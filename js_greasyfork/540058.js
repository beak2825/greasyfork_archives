// ==UserScript==
// @name         MWI Market Addon
// @name:zh-CN    MWI 市场插件
// @namespace    https://milkiway.market/
// @version      v1.0.1
// @description  Market addon using mwi-moonitoring library for WebSocket events
// @description:zh-CN 使用 mwi-moonitoring 库处理 WebSocket 事件的市场插件
// @author       mathewcst
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://milkywayidle.com/*
// @match        https://milkyway.market/*
// @match        https://www.milkyway.market/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @require      https://cdn.c3d.gg/moonitoring/mwi-moonitoring-library.min.js#sha256=Qh9t1oFtYxej0/XuJdu1m3MLBWQRpRbn08opWuf+2GM=
// @downloadURL https://update.greasyfork.org/scripts/540058/MWI%20Market%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/540058/MWI%20Market%20Addon.meta.js
// ==/UserScript==

;(function () {
	;('use strict')

	//============================================================================
	// Configuration
	//============================================================================

	const CONFIG = {
		events: {
			DATA_REQUEST: 'mwi-request-character-data',
			DATA_RESPONSE: 'mwi-character-data-response',
			DATA_UPDATED: 'mwi-character-data-updated',
		},
		storage: {
			CHAR_STATE: 'char_state_v3',
			LAST_SYNC: 'last_sync_timestamp',
		},
		performance: {
			DEBOUNCE_MS: 600000, // Batch updates every 10 minutes
			MARKET_SYNC_INTERVAL: 600000, // Market site checks every 10 minutes
		},
		// Events we're interested in processing
		IMPORTANT_EVENTS: [
			'init_character_data',
			'action_completed',
			'items_updated',
			'action_type_consumable_slots_updated',
		],
	}

	//===========================================================================
	// Enhanced Logging System - Matches Web App Pattern
	//============================================================================

	const MWM_LOG_STYLES = {
		reset: 'color: inherit',
		info: 'color: #3B82F6; font-weight: bold', // Blue - matches web app
		success: 'color: #10B981; font-weight: bold', // Green - matches web app
		warn: 'color: #F59E0B; font-weight: bold', // Amber - matches web app
		error: 'color: #DC2626; font-weight: bold', // Red - matches web app
		debug: 'color: #8B5CF6; font-weight: bold', // Purple - matches web app
		perf: 'color: #7C3AED; font-weight: bold', // Violet - matches web app
	}

	function mwmLog(tag, level, message, ...args) {
		const prefix = `%c[MWM_ADDON]${tag ? ` [${tag}]` : ''}%c ${message}`
		let style
		switch (level) {
			case 'success':
				style = MWM_LOG_STYLES.success
				break
			case 'warn':
				style = MWM_LOG_STYLES.warn
				break
			case 'error':
				style = MWM_LOG_STYLES.error
				break
			case 'debug':
				style = MWM_LOG_STYLES.debug
				break
			case 'perf':
				style = MWM_LOG_STYLES.perf
				break
			default:
				style = MWM_LOG_STYLES.info
		}
		const reset = MWM_LOG_STYLES.reset

		let method
		switch (level) {
			case 'error':
				method = console.error
				break
			case 'warn':
				method = console.warn
				break
			default:
				method = console.log
		}
		method(prefix, style, reset, ...args)
	}

	// Enhanced logger with module support - matches web app pattern
	const LOG = {
		info: (msg, ...args) => mwmLog('', 'info', msg, ...args),
		success: (msg, ...args) => mwmLog('', 'success', msg, ...args),
		warn: (msg, ...args) => mwmLog('', 'warn', msg, ...args),
		error: (msg, ...args) => mwmLog('', 'error', msg, ...args),
		debug: (msg, ...args) => mwmLog('', 'debug', msg, ...args),
		perf: (msg, ...args) => mwmLog('', 'perf', msg, ...args),

		// Module-specific loggers (matches web app pattern)
		module: (moduleName) => ({
			info: (msg, ...args) => mwmLog(moduleName, 'info', msg, ...args),
			success: (msg, ...args) => mwmLog(moduleName, 'success', msg, ...args),
			warn: (msg, ...args) => mwmLog(moduleName, 'warn', msg, ...args),
			error: (msg, ...args) => mwmLog(moduleName, 'error', msg, ...args),
			debug: (msg, ...args) => mwmLog(moduleName, 'debug', msg, ...args),
			perf: (msg, ...args) => mwmLog(moduleName, 'perf', msg, ...args),
		}),

		// Legacy support for existing code
		tag: (tag) => ({
			info: (msg, ...args) => mwmLog(tag, 'info', msg, ...args),
			success: (msg, ...args) => mwmLog(tag, 'success', msg, ...args),
			warn: (msg, ...args) => mwmLog(tag, 'warn', msg, ...args),
			error: (msg, ...args) => mwmLog(tag, 'error', msg, ...args),
			debug: (msg, ...args) => mwmLog(tag, 'debug', msg, ...args),
			perf: (msg, ...args) => mwmLog(tag, 'perf', msg, ...args),
		}),
	}

	// Pre-configured module loggers for common components
	const addonLogger = LOG.module('addon')
	const syncLogger = LOG.module('sync')
	const dbLogger = LOG.module('database')
	const stateLogger = LOG.module('state')
	const marketLogger = LOG.module('market')

	//===========================================================================
	// Library Access - Get the globally loaded MWIWebSocket library
	//===========================================================================

	// The library is loaded via @require and attached to window/global scope
	// In strict mode, we need to explicitly reference it
	const MWIWebSocket = window.MWIWebSocket || this.MWIWebSocket

	// Create isolated instance for this addon with optimized settings
	const socket = MWIWebSocket
		? MWIWebSocket.createInstance({
				batchInterval: CONFIG.performance.DEBOUNCE_MS,
				eventWhitelist: CONFIG.IMPORTANT_EVENTS, // Only process events we care about
				debug: false,
				logLevel: 'warn',
				historySize: 20, // Keep minimal history
				enableCache: true, // Cache for performance
				cacheSize: 20,
			})
		: null

	// Early check if library and instance are available
	if (!socket) {
		addonLogger.error(
			'CRITICAL: MWI-Moonitoring library not loaded or instance creation failed!',
		)
		addonLogger.error('Please check:')
		addonLogger.error('1. The @require URL is correct and accessible')
		addonLogger.error('2. The CDN is not blocked by your network')
		addonLogger.error('3. Try using the non-minified version for debugging')
		addonLogger.error('4. Check browser console for CORS or network errors')

		// For market site, we can still function without the library
		const isMarketSite = document.URL.includes('milkyway.market')
		if (!isMarketSite) {
			return // Only exit on game site
		}
	}

	class CharacterDatabase {
		constructor() {
			this.dbName = '@mwm/db'
			this.version = 3 // Increment version to ensure stores are created
			this.db = null
			this.isInitialized = false
			this.initPromise = null
		}

		async init(retryCount = 0) {
			if (this.initPromise) return this.initPromise
			if (this.isInitialized) return Promise.resolve()

			const MAX_RETRIES = 3
			const RETRY_DELAY = 150 + retryCount * 250 // Progressive delay: 150ms, 400ms, 650ms (offset from main app)

			this.initPromise = new Promise((resolve, reject) => {
				const request = indexedDB.open(this.dbName, this.version)

				request.onerror = async () => {
					const error = request.error
					const errorName = error?.name || 'UnknownError'

					LOG.tag('CharacterDB').warn(
						`Database open attempt ${retryCount + 1} failed: ${errorName}`,
						error?.message,
					)

					// Clear the promise on error so it can be retried
					this.initPromise = null

					// Check if we should retry
					if (retryCount < MAX_RETRIES) {
						// Common concurrent access errors that are worth retrying
						const retryableErrors = [
							'UnknownError',
							'AbortError',
							'InvalidStateError',
							'DataError',
						]

						if (retryableErrors.includes(errorName)) {
							LOG.tag('CharacterDB').info(
								`Retrying database open after ${RETRY_DELAY}ms...`,
							)

							// Wait before retrying (with offset to avoid collision with main app)
							await new Promise((r) => setTimeout(r, RETRY_DELAY))

							try {
								// Recursive retry with incremented count
								await this.init(retryCount + 1)
								resolve()
								return
							} catch (retryError) {
								// If retry also fails, reject with the retry error
								reject(retryError)
								return
							}
						}
					}

					// Max retries reached or non-retryable error
					LOG.tag('CharacterDB').error(
						'Failed to open database after retries:',
						error,
					)
					reject(error)
				}

				request.onsuccess = () => {
					this.db = request.result
					this.isInitialized = true
					LOG.tag('CharacterDB').success('Database initialized successfully')
					resolve()
				}

				request.onupgradeneeded = (event) => {
					const db = event.target.result
					LOG.tag('CharacterDB').info('Upgrading database schema...')

					// Create all stores that both addon and website need
					// This ensures compatibility regardless of who creates the DB first

					// Characters store - main store for character data
					if (!db.objectStoreNames.contains('characters')) {
						const store = db.createObjectStore('characters', {
							keyPath: 'characterId',
						})
						store.createIndex('name', 'characterName', { unique: false })
						store.createIndex('lastUpdate', 'lastUpdate', { unique: false })
						LOG.tag('CharacterDB').info('Created characters store')
					}

					// Metadata store - for storing app metadata
					if (!db.objectStoreNames.contains('metadata')) {
						db.createObjectStore('metadata', {
							keyPath: 'key',
						})
						LOG.tag('CharacterDB').info('Created metadata store')
					}

					// Query cache store - for caching API responses
					if (!db.objectStoreNames.contains('queryCache')) {
						const queryCacheStore = db.createObjectStore('queryCache', {
							keyPath: 'key',
						})
						queryCacheStore.createIndex('timestamp', 'timestamp', {
							unique: false,
						})
						LOG.tag('CharacterDB').info('Created queryCache store')
					}

					// Pinned items store - for user's pinned items
					if (!db.objectStoreNames.contains('pinnedItems')) {
						const pinnedStore = db.createObjectStore('pinnedItems', {
							keyPath: 'id',
						})
						pinnedStore.createIndex(
							'itemHrid+enhancement',
							['itemHrid', 'enhancement'],
							{ unique: false },
						)
						pinnedStore.createIndex('order', 'order', { unique: false })
						pinnedStore.createIndex('pinnedAt', 'pinnedAt', { unique: false })
						LOG.tag('CharacterDB').info('Created pinnedItems store')
					}
				}

				request.onblocked = () => {
					LOG.tag('CharacterDB').warn(
						'Database upgrade blocked by another connection (likely the website)',
						{
							dbName: this.dbName,
							version: this.version,
							retryCount,
						},
					)
					// The blocked event means another connection is preventing the upgrade
					// This is common when the website and addon are both active
					// The upgrade will proceed once the blocking connection closes
				}
			})

			return this.initPromise
		}

		async ensureInitialized() {
			if (!this.isInitialized) {
				await this.init()
			}
		}

		async saveCharacter(data) {
			await this.ensureInitialized()

			return new Promise((resolve, reject) => {
				const transaction = this.db.transaction(['characters'], 'readwrite')
				const store = transaction.objectStore('characters')

				const character = {
					...data,
					lastFullSync: data.lastFullSync || Date.now(),
				}

				const request = store.put(character)

				request.onsuccess = () => {
					resolve(request.result)
				}

				request.onerror = () => {
					LOG.tag('CharacterDB').error(
						'Failed to save character:',
						request.error,
					)
					reject(request.error)
				}
			})
		}

		async getCharacter(characterId) {
			await this.ensureInitialized()

			return new Promise((resolve, reject) => {
				const transaction = this.db.transaction(['characters'], 'readonly')
				const store = transaction.objectStore('characters')
				const request = store.get(characterId)

				request.onsuccess = () => resolve(request.result)
				request.onerror = () => reject(request.error)
			})
		}

		async getAllCharacters() {
			await this.ensureInitialized()

			return new Promise((resolve, reject) => {
				const transaction = this.db.transaction(['characters'], 'readonly')
				const store = transaction.objectStore('characters')
				const request = store.getAll()

				request.onsuccess = () => resolve(request.result || [])
				request.onerror = () => reject(request.error)
			})
		}
	}

	//============================================================================
	// State Management using MWI-Moonitoring Library
	//============================================================================

	class CharacterStateManager {
		constructor() {
			this.state = this.loadState() || this.createEmptyState()
			this.lastSave = Date.now()
			this.lastNotify = Date.now()
			this.isLibraryAvailable = socket !== null

			if (this.isLibraryAvailable) {
				// No need to configure here - instance was created with optimal settings

				// Initialize library and set up event subscriptions
				this.setupEventSubscriptions()
			} else {
				stateLogger.error(
					'MWI-Moonitoring library not available for CharacterStateManager',
				)
			}
		}

		createEmptyState() {
			return {
				characterId: null,
				characterName: null,
				characterLevel: 0,
				characterAvatar: null,
				characterAvatarOutfit: null,
				gameMode: null,
				skills: [],
				inventory: new Map(),
				// All buff types
				houseActionTypeBuffsMap: {},
				actionTypeDrinkSlotsMap: {},
				actionTypeFoodSlotsMap: {},
				equipmentActionTypeBuffsMap: {},
				consumableActionTypeBuffsMap: {},
				mooPassActionTypeBuffsMap: {},
				communityActionTypeBuffsMap: {},
				equipmentTaskActionBuffs: [],
				mooPassBuffs: [],
				communityBuffs: [],
				lastFullSync: 0,
				lastUpdate: Date.now(),
				version: 3,
			}
		}

		setupEventSubscriptions() {
			if (!this.isLibraryAvailable) {
				stateLogger.warn(
					'Cannot setup event subscriptions - library not available',
				)
				return
			}

			// Subscribe to full character data
			socket.on('init_character_data', (eventType, data) => {
				stateLogger.info('Received init_character_data event')
				this.handleFullCharacterData(data)
			})

			// Subscribe to incremental updates
			socket.on('action_completed', (eventType, data) => {
				this.handleActionCompleted(data)
			})

			socket.on('items_updated', (eventType, data) => {
				this.handleItemsUpdated(data)
			})

			socket.on('action_type_consumable_slots_updated', (eventType, data) => {
				this.handleConsumablesUpdated(data)
			})

			stateLogger.success('Event subscriptions set up successfully')
		}

		handleFullCharacterData(rawData) {
			stateLogger.success('Processing full character data')

			this.state = {
				...this.state,
				characterId: rawData.character?.id,
				characterName: rawData.character?.name,
				characterLevel: this.findSkillByName(rawData, 'total_level'),
				characterAvatar: rawData.character?.avatarHrid,
				characterAvatarOutfit: rawData.character?.avatarOutfitHrid,
				gameMode: rawData.character?.gameMode,
				skills: rawData.characterSkills || [],
				inventory: this.buildInventoryMap(rawData.characterItems || []),
				// Capture all buff types from raw data
				houseActionTypeBuffsMap: rawData.houseActionTypeBuffsMap || {},
				actionTypeDrinkSlotsMap: rawData.actionTypeDrinkSlotsMap || {},
				actionTypeFoodSlotsMap: rawData.actionTypeFoodSlotsMap || {},
				equipmentActionTypeBuffsMap: rawData.equipmentActionTypeBuffsMap || {},
				consumableActionTypeBuffsMap:
					rawData.consumableActionTypeBuffsMap || {},
				mooPassActionTypeBuffsMap: rawData.mooPassActionTypeBuffsMap || {},
				communityActionTypeBuffsMap: rawData.communityActionTypeBuffsMap || {},
				equipmentTaskActionBuffs: rawData.equipmentTaskActionBuffs || [],
				mooPassBuffs: rawData.mooPassBuffs || [],
				communityBuffs: rawData.communityBuffs || [],
				lastFullSync: Date.now(),
				lastUpdate: Date.now(),
			}

			this.saveState()
			this.notifyStateChange('full_sync')
		}

		handleActionCompleted(data) {
			let hasChanges = false

			// Update items - handle both old and new field names
			const items = data.characterItems || data.endCharacterItems || data.items
			if (items && Array.isArray(items)) {
				// Use merge for incremental updates
				this.state.inventory = this.mergeInventoryUpdate(items)
				hasChanges = true
			}

			// Update skills - handle both old and new field names
			const skills =
				data.characterSkills || data.endCharacterSkills || data.skills
			if (skills && Array.isArray(skills)) {
				// Merge with existing skills array
				const currentSkills = Array.isArray(this.state.skills)
					? this.state.skills
					: []
				const skillMap = new Map()

				// Add existing skills to map
				currentSkills.forEach((skill) => {
					if (skill.skillHrid) {
						skillMap.set(skill.skillHrid, skill)
					}
				})

				// Update with new skill data
				skills.forEach((skill) => {
					if (skill.skillHrid) {
						skillMap.set(skill.skillHrid, skill)
					}
				})

				this.state.skills = Array.from(skillMap.values())
				hasChanges = true
			}

			// Update character level from skills
			if (skills && Array.isArray(skills)) {
				const totalLevel = skills.find(
					(s) => s.skillHrid === '/skills/total_level',
				)?.level
				if (totalLevel) {
					this.state.characterLevel = totalLevel
					hasChanges = true
				}
			}

			if (hasChanges) {
				this.state.lastUpdate = Date.now()
				this.throttledSaveAndNotify()
			}
		}

		handleItemsUpdated(data) {
			// Handle both potential field names for items
			const items = data.characterItems || data.endCharacterItems || data.items
			if (items && Array.isArray(items)) {
				// Use merge for incremental updates
				this.state.inventory = this.mergeInventoryUpdate(items)
				this.state.lastUpdate = Date.now()
				this.throttledSaveAndNotify()
			}
		}

		handleConsumablesUpdated(data) {
			let hasChanges = false

			if (data.actionTypeDrinkSlotsMap) {
				this.state.actionTypeDrinkSlotsMap = data.actionTypeDrinkSlotsMap
				hasChanges = true
			}

			if (data.actionTypeFoodSlotsMap) {
				this.state.actionTypeFoodSlotsMap = data.actionTypeFoodSlotsMap
				hasChanges = true
			}

			if (hasChanges) {
				this.state.lastUpdate = Date.now()
				this.throttledSaveAndNotify()
			}
		}

		throttledSaveAndNotify() {
			const now = Date.now()

			// Save to storage (throttled)
			if (now - this.lastSave > 5000) {
				this.saveState()
				this.lastSave = now
			}

			// Notify changes (throttled)
			if (now - this.lastNotify > 5000) {
				this.notifyStateChange('incremental_update')
				this.lastNotify = now
			}
		}

		buildInventoryMap(items) {
			const map = new Map()
			items.forEach((item) => {
				if (item && item.itemHrid && item.count > 0) {
					const key = this.getInventoryKey(item)
					map.set(key, {
						itemHrid: item.itemHrid,
						itemLocationHrid:
							item.itemLocationHrid || '/item_locations/inventory',
						quantity: item.count,
						enhancementLevel: item.enhancementLevel || 0,
					})
				}
			})
			return map
		}

		mergeInventoryUpdate(updateItems) {
			// Start with a copy of existing inventory
			const mergedInventory = new Map(this.state.inventory || new Map())

			updateItems.forEach((item) => {
				if (item && item.itemHrid) {
					const key = this.getInventoryKey(item)
					if (item.count > 0) {
						// Update or add the item
						mergedInventory.set(key, {
							itemHrid: item.itemHrid,
							itemLocationHrid:
								item.itemLocationHrid || '/item_locations/inventory',
							quantity: item.count,
							enhancementLevel: item.enhancementLevel || 0,
						})
					} else {
						// Remove items with 0 count
						mergedInventory.delete(key)
					}
				}
			})

			return mergedInventory
		}

		getInventoryKey(item) {
			return `${item.itemHrid}:${item.enhancementLevel || 0}:${
				item.itemLocationHrid || 'inventory'
			}`
		}

		findSkillByName(rawData, name) {
			if (!rawData.characterSkills || !Array.isArray(rawData.characterSkills)) {
				return 0
			}
			const skill = rawData.characterSkills.find(
				(skill) => skill.skillHrid === `/skills/${name}`,
			)
			return skill ? skill.level : 0
		}

		getFilteredState() {
			// Convert internal state to PlayerData format
			return this.convertToPlayerData()
		}

		convertToPlayerData() {
			// Return Partial<PlayerData> with all fields we track
			return {
				type: 'init_character_data',
				currentTimestamp: new Date(this.state.lastUpdate).toISOString(),
				character: {
					id: this.state.characterId || 0,
					name: this.state.characterName || '',
					gameMode: this.state.gameMode || '',
					avatarHrid: this.state.characterAvatar || '',
					avatarOutfitHrid: this.state.characterAvatarOutfit || '',
					isOnline: true,
				},
				characterSkills: (this.state.skills || []).map((skill) => ({
					characterID: this.state.characterId || 0,
					skillHrid: skill.skillHrid,
					experience: skill.experience || 0,
					level: skill.level || 0,
				})),
				characterItems: Array.from(this.state.inventory.values()).map(
					(item) => ({
						characterID: this.state.characterId || 0,
						itemLocationHrid:
							item.itemLocationHrid || '/item_locations/inventory',
						itemHrid: item.itemHrid,
						enhancementLevel: item.enhancementLevel || 0,
						count: item.quantity || 0,
					}),
				),
				// Include all buff types we capture
				houseActionTypeBuffsMap: this.state.houseActionTypeBuffsMap || {},
				actionTypeDrinkSlotsMap: this.state.actionTypeDrinkSlotsMap || {},
				actionTypeFoodSlotsMap: this.state.actionTypeFoodSlotsMap || {},
				equipmentActionTypeBuffsMap:
					this.state.equipmentActionTypeBuffsMap || {},
				consumableActionTypeBuffsMap:
					this.state.consumableActionTypeBuffsMap || {},
				mooPassActionTypeBuffsMap: this.state.mooPassActionTypeBuffsMap || {},
				communityActionTypeBuffsMap:
					this.state.communityActionTypeBuffsMap || {},
				equipmentTaskActionBuffs: this.state.equipmentTaskActionBuffs || [],
				mooPassBuffs: this.state.mooPassBuffs || [],
				communityBuffs: this.state.communityBuffs || [],
			}
		}

		saveState() {
			try {
				const storableState = {
					...this.state,
					inventory: Array.from(this.state.inventory.entries()),
				}
				GM_setValue(CONFIG.storage.CHAR_STATE, storableState)
				GM_setValue(CONFIG.storage.LAST_SYNC, Date.now())
			} catch (error) {
				stateLogger.error('Error saving state:', error)
			}
		}

		loadState() {
			try {
				const stored = GM_getValue(CONFIG.storage.CHAR_STATE, null)
				if (stored) {
					if (stored.inventory && Array.isArray(stored.inventory)) {
						stored.inventory = new Map(stored.inventory)
					}
					return stored
				}
			} catch (error) {
				stateLogger.error('Error loading state:', error)
			}
			return null
		}

		notifyStateChange(changeType) {
			const filteredState = this.getFilteredState()
			dispatchDataEvent(CONFIG.events.DATA_UPDATED, {
				data: filteredState,
				changeType: changeType,
				source: 'state_manager',
			})
		}
	}

	// ============================================================================
	// Event System
	// ============================================================================

	let stateManager = null

	function dispatchDataEvent(eventType, data, target = window) {
		try {
			const event = new CustomEvent(eventType, {
				detail: data,
				bubbles: true,
				cancelable: true,
			})
			target.dispatchEvent(event)
		} catch (error) {
			LOG.error(`Error dispatching ${eventType}:`, error)
		}
	}

	function setupEventListeners() {
		// Listen for data requests
		window.addEventListener(CONFIG.events.DATA_REQUEST, (event) => {
			syncLogger.info('Data request received')

			if (!stateManager) {
				stateManager = new CharacterStateManager()
			}

			const filteredState = stateManager.getFilteredState()

			if (filteredState && filteredState.character?.id) {
				dispatchDataEvent(CONFIG.events.DATA_RESPONSE, {
					requestId: event.detail?.requestId,
					data: filteredState,
					lastSync: stateManager.state.lastUpdate,
					source: 'state_manager',
				})
			} else {
				syncLogger.warn('No character data available to send')
			}
		})

		// Listen for cross-tab updates
		GM_addValueChangeListener(
			CONFIG.storage.CHAR_STATE,
			(_, __, newValue, remote) => {
				if (remote && newValue && stateManager) {
					syncLogger.info('State updated in another tab')
					stateManager.state = newValue
					if (
						stateManager.state.inventory &&
						Array.isArray(stateManager.state.inventory)
					) {
						stateManager.state.inventory = new Map(stateManager.state.inventory)
					}
					stateManager.notifyStateChange('cross_tab_sync')
				}
			},
		)
	}

	function setupMarketSync() {
		setInterval(() => {
			syncLogger.info('Checking for character updates')
			dispatchDataEvent(CONFIG.events.DATA_REQUEST, {
				requestId: `market-sync-${Date.now()}`,
				source: 'market_site_periodic',
			})
		}, CONFIG.performance.MARKET_SYNC_INTERVAL)
	}

	// ============================================================================
	// Storage Management
	// ============================================================================

	let characterDB = null

	async function initCharacterDB() {
		if (!characterDB) {
			characterDB = new CharacterDatabase()

			try {
				await characterDB.init()
				dbLogger.success('Character database initialized')
			} catch (error) {
				dbLogger.error('Failed to initialize character database:', error)
				characterDB = null
			}
		}

		return characterDB
	}

	async function processMarketData(data) {
		// Expect PlayerData format
		if (!data.character?.id) {
			LOG.warn('[ProcessData] Invalid character data received')
			return
		}

		try {
			const db = await initCharacterDB()
			if (!db) return

			// Save the PlayerData directly
			await db.saveCharacter({
				characterId: data.character.id,
				characterName: data.character.name,
				data: data,
				lastUpdate: Date.now(),
			})

			// Dispatch event to notify React app
			window.dispatchEvent(
				new CustomEvent('mwi-market-data-processed', {
					detail: {
						characterId: data.character.id,
						data: data,
						storage: 'indexeddb',
					},
					bubbles: true,
				}),
			)

			LOG.success(
				`Character saved: ${data.character.name} (${data.character.id})`,
			)
		} catch (error) {
			LOG.error('[ProcessData] Failed to save character:', error)
		}
	}

	// ============================================================================
	// Market Site Integration
	// ============================================================================

	function initMarketSite() {
		marketLogger.info('Initializing for market site')

		try {
			const storedState = GM_getValue(CONFIG.storage.CHAR_STATE, null)
			if (storedState) {
				LOG.info('Loading existing character data from storage')

				// Convert stored state to PlayerData format before processing
				if (storedState.inventory && Array.isArray(storedState.inventory)) {
					storedState.inventory = new Map(storedState.inventory)
				}
				// Create a temporary state manager to convert the data
				const tempManager = new CharacterStateManager()
				tempManager.state = storedState
				const playerData = tempManager.convertToPlayerData()
				processMarketData(playerData)
			} else {
				LOG.warn('No existing character data found')
			}
		} catch (error) {
			LOG.error('Error loading stored data:', error)
		}

		setupMarketSync()

		let lastCrossTabUpdate = 0
		GM_addValueChangeListener(
			CONFIG.storage.CHAR_STATE,
			(_, __, newValue, remote) => {
				if (remote && newValue) {
					const now = Date.now()
					if (now - lastCrossTabUpdate < 5000) {
						return
					}
					lastCrossTabUpdate = now

					LOG.info('Character data updated in game tab')

					// Convert newValue to PlayerData format before processing
					if (newValue.inventory && Array.isArray(newValue.inventory)) {
						newValue.inventory = new Map(newValue.inventory)
					}
					// Create a temporary state manager to convert the data
					const tempManager = new CharacterStateManager()
					tempManager.state = newValue
					const playerData = tempManager.convertToPlayerData()
					processMarketData(playerData)
				}
			},
		)

		window.addEventListener(CONFIG.events.DATA_RESPONSE, (event) => {
			processMarketData(event.detail.data)
		})

		window.addEventListener(CONFIG.events.DATA_UPDATED, (event) => {
			LOG.info(`Character ${event.detail.changeType}`)
			processMarketData(event.detail.data)
		})
	}

	// ============================================================================
	// Initialization
	// ============================================================================

	function init() {
		const isMarketSite = document.URL.includes('milkyway.market')
		const isGameSite =
			document.URL.includes('milkywayidle.com') && !isMarketSite

		addonLogger.info('Initializing', {
			isGameSite,
			isMarketSite,
		})

		if (isGameSite) {
			// Initialize state manager which will set up library subscriptions
			stateManager = new CharacterStateManager()
		} else if (isMarketSite) {
			initMarketSite()
		}

		if (isGameSite || isMarketSite) {
			setupEventListeners()
		}
	}

	// Start the addon
	init()
})()
