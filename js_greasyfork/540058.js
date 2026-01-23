// ==UserScript==
// @name         MWI Market Addon
// @name:zh-CN    MWI 市场插件
// @namespace    https://milkiway.market/
// @version      v1.1.2
// @description  Market addon using mwi-moonitoring library for WebSocket events
// @description:zh-CN 使用 mwi-moonitoring 库处理 WebSocket 事件的市场插件
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkyway.market
// @author       mathewcst
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://milkywayidle.com/*
// @match        https://milkyway.market/*
// @match        https://www.milkyway.market/*
// @connect      api.milkyway.market
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/540058/MWI%20Market%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/540058/MWI%20Market%20Addon.meta.js
// ==/UserScript==

;(function () {
	'use strict'

	const d = new Set()
	const importCSS = async (e) => {
		d.has(e) ||
			(d.add(e),
			((t) => {
				typeof GM_addStyle == 'function'
					? GM_addStyle(t)
					: (document.head || document.documentElement)
							.appendChild(document.createElement('style'))
							.append(t)
			})(e))
	}

	var _GM_addValueChangeListener = (() =>
		typeof GM_addValueChangeListener != 'undefined'
			? GM_addValueChangeListener
			: void 0)()
	var _GM_getValue = (() =>
		typeof GM_getValue != 'undefined' ? GM_getValue : void 0)()
	var _GM_setValue = (() =>
		typeof GM_setValue != 'undefined' ? GM_setValue : void 0)()
	var _GM_xmlhttpRequest = (() =>
		typeof GM_xmlhttpRequest != 'undefined' ? GM_xmlhttpRequest : void 0)()
	const version = '1.2.7'
	const VERSION = version
	const STORAGE_KEY$1 = '@mwm/character-data'
	const SYNC_THROTTLE_MS = 3e4
	const WS_ENDPOINTS = [
		'api.milkywayidle.com/ws',
		'api-test.milkywayidle.com/ws',
	]
	const MARKET_API = 'https://api.milkyway.market'
	const EVENTS = {
		REQUEST: 'mwi-request-character-data',
		RESPONSE: 'mwi-character-data-response',
		UPDATED: 'mwi-character-data-updated',
		ADDON_READY: 'mwm-addon-ready',
	}
	const isGameSite = location.hostname.includes('milkywayidle.com')
	const isMarketSite = location.hostname.includes('milkyway.market')
	const ADDON_COLOR = '#8B5CF6'
	const WARN_COLOR = '#F59E0B'
	const formatMessage = (msg) => {
		const prefix = `%c[MWM] [Addon v${VERSION}]%c`
		const prefixStyle = `color: ${ADDON_COLOR}; font-weight: bold;`
		const messageStyle = 'color: inherit; padding-left: 4px;'
		return [`${prefix} ${msg}`, prefixStyle, messageStyle]
	}
	const formatWarnMessage = (msg) => {
		const prefix = `%c[MWM] [Addon v${VERSION}]%c`
		const prefixStyle = `color: ${WARN_COLOR}; font-weight: bold;`
		const messageStyle = 'color: inherit; padding-left: 4px;'
		return [`${prefix} ${msg}`, prefixStyle, messageStyle]
	}
	const log = (msg, ...args) => {
		const [formatted, style1, style2] = formatMessage(msg)
		console.log(formatted, style1, style2, ...args)
	}
	const warn = (msg, ...args) => {
		const [formatted, style1, style2] = formatWarnMessage(msg)
		console.warn(formatted, style1, style2, ...args)
	}
	let lastSyncTime = 0
	function mergeItems(target, newItems) {
		if (!newItems?.length) return
		const itemMap = new Map()
		if (target.characterItems) {
			for (const item of target.characterItems) {
				const key = `${item.itemHrid}:${item.enhancementLevel || 0}:${item.itemLocationHrid || ''}`
				itemMap.set(key, item)
			}
		}
		for (const item of newItems) {
			const key = `${item.itemHrid}:${item.enhancementLevel || 0}:${item.itemLocationHrid || ''}`
			if (item.count > 0) {
				itemMap.set(key, item)
			} else {
				itemMap.delete(key)
			}
		}
		target.characterItems = Array.from(itemMap.values())
	}
	function mergeSkills(target, newSkills) {
		if (!newSkills?.length) return
		const skillMap = new Map()
		if (target.characterSkills) {
			for (const skill of target.characterSkills) {
				skillMap.set(skill.skillHrid, skill)
			}
		}
		for (const skill of newSkills) {
			skillMap.set(skill.skillHrid, skill)
		}
		target.characterSkills = Array.from(skillMap.values())
	}
	function syncToStorage(characterData2, force = false) {
		if (!characterData2) return
		const now = Date.now()
		if (!force && now - lastSyncTime < SYNC_THROTTLE_MS) return
		lastSyncTime = now
		characterData2.currentTimestamp = new Date().toISOString()
		const storedData = { data: characterData2, timestamp: now }
		_GM_setValue(STORAGE_KEY$1, storedData)
		log('Synced:', characterData2.character?.name)
	}
	function loadFromStorage() {
		const stored = _GM_getValue(STORAGE_KEY$1, null)
		if (stored?.data) {
			log('Loaded from storage:', stored.data.character?.name)
			return stored.data
		}
		return null
	}
	class DOMObserver {
		observer = null
		handlers = []
		isObserving = false
		start() {
			if (this.isObserving) return
			this.observer = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					for (const node of mutation.addedNodes) {
						if (!(node instanceof Element)) continue
						this.processNode(node)
					}
				}
			})
			this.observer.observe(document.body, {
				childList: true,
				subtree: true,
			})
			this.isObserving = true
			log('DOM observer started')
		}
		stop() {
			if (this.observer) {
				this.observer.disconnect()
				this.observer = null
			}
			this.isObserving = false
			log('DOM observer stopped')
		}
		onClass(name, className, callback) {
			const handler = { name, className, callback }
			this.handlers.push(handler)
			return () => {
				const index = this.handlers.indexOf(handler)
				if (index > -1) {
					this.handlers.splice(index, 1)
				}
			}
		}
		processNode(node) {
			for (const handler of this.handlers) {
				if (node.classList.contains(handler.className)) {
					try {
						handler.callback(node)
					} catch (err) {
						console.error(`[MWM] Handler error (${handler.name}):`, err)
					}
				}
				const matches = node.querySelectorAll(`.${handler.className}`)
				for (const match of matches) {
					try {
						handler.callback(match)
					} catch (err) {
						console.error(`[MWM] Handler error (${handler.name}):`, err)
					}
				}
			}
		}
	}
	const domObserver = new DOMObserver()
	const NON_TRADEABLE_ITEMS = new Set([
		'coin',
		'cowbell',
		'task_token',
		'chimerical_token',
		'sinister_token',
		'enchanted_token',
		'pirate_token',
		'purples_gift',
		'small_meteorite_cache',
		'medium_meteorite_cache',
		'large_meteorite_cache',
		'small_artisans_crate',
		'medium_artisans_crate',
		'large_artisans_crate',
		'small_treasure_chest',
		'medium_treasure_chest',
		'large_treasure_chest',
		'chimerical_chest',
		'chimerical_refinement_chest',
		'sinister_chest',
		'sinister_refinement_chest',
		'enchanted_chest',
		'enchanted_refinement_chest',
		'pirate_chest',
		'pirate_refinement_chest',
		'sinister_cape',
		'sinister_cape_refined',
		'chimerical_quiver',
		'chimerical_quiver_refined',
		'enchanted_cloak',
		'enchanted_cloak_refined',
		'trainee_milking_charm',
		'trainee_foraging_charm',
		'trainee_woodcutting_charm',
		'trainee_cheesesmithing_charm',
		'trainee_crafting_charm',
		'trainee_tailoring_charm',
		'trainee_cooking_charm',
		'trainee_brewing_charm',
		'trainee_alchemy_charm',
		'trainee_enhancing_charm',
		'trainee_stamina_charm',
		'trainee_intelligence_charm',
		'trainee_attack_charm',
		'trainee_defense_charm',
		'trainee_melee_charm',
		'trainee_ranged_charm',
		'trainee_magic_charm',
		'basic_task_badge',
		'advanced_task_badge',
		'expert_task_badge',
		'task_crystal',
	])
	function isNonTradeable(itemHrid) {
		return NON_TRADEABLE_ITEMS.has(itemHrid.toLowerCase())
	}
	const priceCache = new Map()
	const CACHE_TTL = 5 * 60 * 1e3
	async function fetchPriceChart(itemHrid) {
		if (isNonTradeable(itemHrid)) {
			return []
		}
		const cached = priceCache.get(itemHrid)
		if (cached && cached.expires > Date.now()) {
			log(`Cache hit for ${itemHrid}`)
			return cached.data
		}
		return new Promise((resolve, reject) => {
			_GM_xmlhttpRequest({
				method: 'GET',
				url: `${MARKET_API}/addon/prices/${itemHrid}`,
				headers: {
					'Content-Type': 'application/json',
					'X-MWM-Addon': VERSION,
				},
				onload: (response) => {
					try {
						const parsed = JSON.parse(response.responseText)
						if (parsed.success) {
							log(`Loaded ${parsed.data.length} price points for ${itemHrid}`)
							priceCache.set(itemHrid, {
								data: parsed.data,
								expires: Date.now() + CACHE_TTL,
							})
							resolve(parsed.data)
						} else {
							warn(`API error for ${itemHrid}`)
							resolve([])
						}
					} catch (err) {
						warn(`Parse error for ${itemHrid}:`, err)
						reject(err)
					}
				},
				onerror: (err) => {
					warn(`Network error for ${itemHrid}:`, err)
					reject(err)
				},
			})
		})
	}
	const INJECTED_CLASS$2 = 'mwm-modal-injected'
	const ITEM_DICTIONARY_CLASS = 'ItemDictionary_modalContent__WvEBY'
	const ITEM_TITLE_CLASS = 'ItemDictionary_title__27cTd'
	function initItemModal() {
		log('Initializing item modal prices')
		return domObserver.onClass(
			'item-modal-prices',
			ITEM_DICTIONARY_CLASS,
			handleItemModal,
		)
	}
	function formatPrice$2(price) {
		if (price === null) return '—'
		if (price >= 1e6) return `${(price / 1e6).toFixed(1)}M`
		if (price >= 1e3) return `${(price / 1e3).toFixed(1)}K`
		return price.toLocaleString()
	}
	function formatDate$1(timestamp) {
		const date = new Date(timestamp)
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}
	function calculateStats$1(data) {
		const bidPrices = data.map((d) => d.bidPrice).filter((p) => p !== null)
		const askPrices = data.map((d) => d.askPrice).filter((p) => p !== null)
		const currentBid = bidPrices[bidPrices.length - 1] ?? null
		const currentAsk = askPrices[askPrices.length - 1] ?? null
		const highBid = bidPrices.length > 0 ? Math.max(...bidPrices) : null
		const lowBid = bidPrices.length > 0 ? Math.min(...bidPrices) : null
		let change = 0
		if (bidPrices.length >= 2) {
			const first = bidPrices[0]
			const last = bidPrices[bidPrices.length - 1]
			change = ((last - first) / first) * 100
		}
		return { currentBid, currentAsk, highBid, lowBid, change }
	}
	function renderChart$1(canvas, data, tooltipEl) {
		const ctx = canvas.getContext('2d')
		if (!ctx) return
		const rect = canvas.getBoundingClientRect()
		const dpr = window.devicePixelRatio || 1
		canvas.width = rect.width * dpr
		canvas.height = rect.height * dpr
		ctx.scale(dpr, dpr)
		const width = rect.width
		const height = rect.height
		const padding = { top: 15, right: 10, bottom: 20, left: 45 }
		const chartWidth = width - padding.left - padding.right
		const chartHeight = height - padding.top - padding.bottom
		ctx.clearRect(0, 0, width, height)
		if (data.length < 2) {
			ctx.fillStyle = 'rgba(226, 232, 240, 0.4)'
			ctx.font = '11px monospace'
			ctx.textAlign = 'center'
			ctx.fillText('No data available', width / 2, height / 2)
			return
		}
		const bidPrices = data.map((d) => d.bidPrice).filter((p) => p !== null)
		const askPrices = data.map((d) => d.askPrice).filter((p) => p !== null)
		const allPrices = [...bidPrices, ...askPrices]
		const minPrice = Math.min(...allPrices)
		const maxPrice = Math.max(...allPrices)
		const priceRange = maxPrice - minPrice || 1
		const getX = (i) => padding.left + (i / (data.length - 1)) * chartWidth
		const getY = (price) =>
			padding.top +
			chartHeight -
			((price - minPrice) / priceRange) * chartHeight
		ctx.strokeStyle = 'rgba(59, 89, 152, 0.2)'
		ctx.lineWidth = 1
		for (let i = 0; i <= 4; i++) {
			const y = padding.top + (i / 4) * chartHeight
			ctx.beginPath()
			ctx.moveTo(padding.left, y)
			ctx.lineTo(width - padding.right, y)
			ctx.stroke()
			const price = maxPrice - (i / 4) * priceRange
			ctx.fillStyle = 'rgba(226, 232, 240, 0.4)'
			ctx.font = '9px monospace'
			ctx.textAlign = 'right'
			ctx.fillText(formatPrice$2(price), padding.left - 6, y + 3)
		}
		ctx.beginPath()
		let started = false
		for (let i = 0; i < data.length; i++) {
			const price = data[i].askPrice
			if (price !== null) {
				const x = getX(i)
				const y = getY(price)
				if (!started) {
					ctx.moveTo(x, y)
					started = true
				} else {
					ctx.lineTo(x, y)
				}
			}
		}
		ctx.strokeStyle = '#e879a7'
		ctx.lineWidth = 2
		ctx.stroke()
		ctx.beginPath()
		started = false
		for (let i = 0; i < data.length; i++) {
			const price = data[i].bidPrice
			if (price !== null) {
				const x = getX(i)
				const y = getY(price)
				if (!started) {
					ctx.moveTo(x, y)
					started = true
				} else {
					ctx.lineTo(x, y)
				}
			}
		}
		ctx.strokeStyle = '#5ee9c5'
		ctx.lineWidth = 2
		ctx.stroke()
		canvas.onmousemove = (e) => {
			const bounds = canvas.getBoundingClientRect()
			const mouseX = e.clientX - bounds.left
			const dataIndex = Math.round(
				((mouseX - padding.left) / chartWidth) * (data.length - 1),
			)
			if (dataIndex >= 0 && dataIndex < data.length) {
				const point = data[dataIndex]
				const dateEl = tooltipEl.querySelector('.mwm-tooltip-date')
				const bidEl = tooltipEl.querySelector('.mwm-tooltip-price.bid')
				const askEl = tooltipEl.querySelector('.mwm-tooltip-price.ask')
				if (dateEl) dateEl.textContent = formatDate$1(point.timestamp)
				if (bidEl) bidEl.textContent = `Bid: ${formatPrice$2(point.bidPrice)}`
				if (askEl) askEl.textContent = `Ask: ${formatPrice$2(point.askPrice)}`
				tooltipEl.classList.add('visible')
			}
		}
		canvas.onmouseleave = () => {
			tooltipEl.classList.remove('visible')
		}
	}
	function createPanelHTML$1() {
		return `
		<div class="mwm-modal-panel ${INJECTED_CLASS$2}">
			<div class="mwm-panel-header" style="cursor: default;">
				<div class="mwm-panel-title">
					<div class="mwm-panel-icon">📊</div>
					<span class="mwm-panel-name">Market Prices (14d)</span>
				</div>
			</div>
			<div class="mwm-panel-body">
				<div class="mwm-stats-row">
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">Bid</div>
						<div class="mwm-stat-value bid" data-stat="bid">—</div>
					</div>
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">Ask</div>
						<div class="mwm-stat-value ask" data-stat="ask">—</div>
					</div>
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">High</div>
						<div class="mwm-stat-value" data-stat="high">—</div>
					</div>
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">Low</div>
						<div class="mwm-stat-value" data-stat="low">—</div>
					</div>
				</div>
				<div class="mwm-chart-container">
					<canvas class="mwm-chart-canvas"></canvas>
					<div class="mwm-chart-tooltip">
						<div class="mwm-tooltip-date"></div>
						<div class="mwm-tooltip-prices">
							<span class="mwm-tooltip-price bid"></span>
							<span class="mwm-tooltip-price ask"></span>
						</div>
					</div>
				</div>
				<div class="mwm-legend">
					<div class="mwm-legend-item">
						<span class="mwm-legend-color bid"></span>
						<span>Bid</span>
					</div>
					<div class="mwm-legend-item">
						<span class="mwm-legend-color ask"></span>
						<span>Ask</span>
					</div>
				</div>
			</div>
			<div class="mwm-panel-footer">
				<a class="mwm-panel-link" href="https://milkyway.market" target="_blank">
					View on MilkyWay Market →
				</a>
				<span class="mwm-panel-brand">MWM</span>
			</div>
		</div>
	`
	}
	async function handleItemModal(modalContent) {
		if (modalContent.querySelector(`.${INJECTED_CLASS$2}`)) return
		const titleEl = modalContent.querySelector(`h1.${ITEM_TITLE_CLASS}`)
		if (!titleEl) return
		const itemName = titleEl.textContent?.trim()
		if (!itemName) return
		const itemHrid = nameToHrid$1(itemName)
		log(`Item modal detected: ${itemName} -> ${itemHrid}`)
		const panelContainer = document.createElement('div')
		panelContainer.innerHTML = createPanelHTML$1()
		const panel = panelContainer.firstElementChild
		const insertTarget = titleEl.parentElement || modalContent
		insertTarget.insertAdjacentElement('afterend', panel)
		const statsRow = panel.querySelector('.mwm-stats-row')
		if (statsRow) {
			statsRow.innerHTML = `
			<div class="mwm-loading" style="grid-column: 1 / -1;">
				<div class="mwm-loading-spinner"></div>
				<span>Loading market data...</span>
			</div>
		`
		}
		try {
			const priceData = await fetchPriceChart(itemHrid)
			if (priceData.length > 0) {
				const stats = calculateStats$1(priceData)
				if (statsRow) {
					statsRow.innerHTML = `
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">Bid</div>
						<div class="mwm-stat-value bid">${formatPrice$2(stats.currentBid)}</div>
					</div>
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">Ask</div>
						<div class="mwm-stat-value ask">${formatPrice$2(stats.currentAsk)}</div>
					</div>
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">High</div>
						<div class="mwm-stat-value">${formatPrice$2(stats.highBid)}</div>
					</div>
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">Low</div>
						<div class="mwm-stat-value">${formatPrice$2(stats.lowBid)}</div>
					</div>
				`
				}
				const canvas = panel.querySelector('.mwm-chart-canvas')
				const tooltip = panel.querySelector('.mwm-chart-tooltip')
				if (canvas && tooltip) {
					renderChart$1(canvas, priceData, tooltip)
				}
			} else {
				const body = panel.querySelector('.mwm-panel-body')
				if (body) {
					body.innerHTML = `
					<div class="mwm-no-data">
						<span>No market data available for this item</span>
					</div>
				`
				}
			}
		} catch (err) {
			warn(`Failed to load prices for modal: ${err}`)
			const body = panel.querySelector('.mwm-panel-body')
			if (body) {
				body.innerHTML = `
				<div class="mwm-error">
					<span>Failed to load market data</span>
				</div>
			`
			}
		}
	}
	function nameToHrid$1(name) {
		return name
			.toLowerCase()
			.replace(/['']/g, '')
			.replace(/\s+/g, '_')
			.replace(/[^a-z0-9_]/g, '')
	}
	const SETTINGS_STORAGE_KEY = '@mwm/settings'
	const SETTINGS_PANEL_CLASS = 'SettingsPanel_profileTab__214Bj'
	const DEFAULT_SETTINGS = {
		tooltipGraphEnabled: true,
		marketGraphEnabled: true,
		fetchDelayMs: 2e3,
	}
	let currentSettings = { ...DEFAULT_SETTINGS }
	function loadSettings() {
		try {
			const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
			if (stored) {
				const parsed = JSON.parse(stored)
				currentSettings = {
					...DEFAULT_SETTINGS,
					...parsed,
					fetchDelayMs: Math.max(
						2e3,
						parsed.fetchDelayMs ?? DEFAULT_SETTINGS.fetchDelayMs,
					),
				}
			}
		} catch {
			currentSettings = { ...DEFAULT_SETTINGS }
		}
		return currentSettings
	}
	function saveSettings() {
		try {
			localStorage.setItem(
				SETTINGS_STORAGE_KEY,
				JSON.stringify(currentSettings),
			)
			log('Settings saved:', currentSettings)
		} catch (err) {
			console.error('Failed to save settings:', err)
		}
	}
	function getSettings() {
		return currentSettings
	}
	function createSettingsPanelHTML() {
		return `
		<div id="mwm-settings" class="mwm-settings-panel">
			<div class="mwm-settings-header">
				<span class="mwm-settings-title">MWM Addon Settings</span>
				<span class="mwm-settings-note">(changes apply immediately)</span>
			</div>

			<div class="mwm-settings-section">
				<div class="mwm-setting-item">
					<label class="mwm-setting-label">
						<input type="checkbox" id="mwm-tooltip-graph" ${currentSettings.tooltipGraphEnabled ? 'checked' : ''} />
						<span class="mwm-setting-text">Show prices in tooltips</span>
					</label>
				</div>

				<div class="mwm-setting-item">
					<label class="mwm-setting-label">
						<input type="checkbox" id="mwm-market-graph" ${currentSettings.marketGraphEnabled ? 'checked' : ''} />
						<span class="mwm-setting-text">Show price chart in marketplace</span>
					</label>
				</div>

				<div class="mwm-setting-item">
					<label class="mwm-setting-label">
						<span class="mwm-setting-text">Fetch delay (seconds):</span>
						<input
							type="number"
							id="mwm-fetch-delay"
							value="${currentSettings.fetchDelayMs / 1e3}"
							min="2"
							step="0.5"
							class="mwm-setting-input"
						/>
					</label>
					<span class="mwm-setting-hint">Minimum 2s. Higher = fewer API calls on rapid hovers</span>
				</div>
			</div>
		</div>
	`
	}
	function injectSettingsUI(settingsPanel) {
		if (settingsPanel.querySelector('#mwm-settings')) return
		const container = document.createElement('div')
		container.innerHTML = createSettingsPanelHTML()
		settingsPanel.appendChild(container.firstElementChild)
		const tooltipCheckbox = document.getElementById('mwm-tooltip-graph')
		const marketCheckbox = document.getElementById('mwm-market-graph')
		const delayInput = document.getElementById('mwm-fetch-delay')
		if (tooltipCheckbox) {
			tooltipCheckbox.addEventListener('change', (e) => {
				const target = e.target
				currentSettings.tooltipGraphEnabled = target.checked
				log('Tooltip graph setting changed:', target.checked)
				saveSettings()
				log('Current settings:', { ...currentSettings })
			})
		}
		if (marketCheckbox) {
			marketCheckbox.addEventListener('change', (e) => {
				const target = e.target
				currentSettings.marketGraphEnabled = target.checked
				log('Market graph setting changed:', target.checked)
				saveSettings()
				log('Current settings:', { ...currentSettings })
			})
		}
		if (delayInput) {
			delayInput.addEventListener('input', (e) => {
				const target = e.target
				const valueInSeconds = parseFloat(target.value)
				const valueInMs = isNaN(valueInSeconds) ? 2e3 : valueInSeconds * 1e3
				currentSettings.fetchDelayMs = Math.max(2e3, valueInMs)
				target.value = String(currentSettings.fetchDelayMs / 1e3)
				log('Fetch delay setting changed:', currentSettings.fetchDelayMs)
				saveSettings()
			})
		}
		log('Settings UI injected')
	}
	function initSettings() {
		log('Settings initialized:', currentSettings)
		return domObserver.onClass(
			'settings-panel',
			SETTINGS_PANEL_CLASS,
			injectSettingsUI,
		)
	}
	const INJECTED_CLASS$1 = 'mwm-marketplace-injected'
	const CURRENT_ITEM_CLASS = 'MarketplacePanel_currentItem__3ercC'
	const STORAGE_KEY = '@mwm/panel-visible'
	function getPanelVisible() {
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored === null) {
				return false
			}
			return stored === 'true'
		} catch {
			return false
		}
	}
	function setPanelVisible(visible) {
		try {
			localStorage.setItem(STORAGE_KEY, String(visible))
		} catch {}
	}
	function initMarketplacePrices() {
		log('Initializing marketplace prices')
		return domObserver.onClass(
			'marketplace-prices',
			CURRENT_ITEM_CLASS,
			handleMarketplaceItem,
		)
	}
	function formatPrice$1(price) {
		if (price === null) return '—'
		if (price >= 1e6) return `${(price / 1e6).toFixed(1)}M`
		if (price >= 1e3) return `${(price / 1e3).toFixed(1)}K`
		return price.toLocaleString()
	}
	function formatDate(timestamp) {
		const date = new Date(timestamp)
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}
	function calculateStats(data) {
		const bidPrices = data.map((d) => d.bidPrice).filter((p) => p !== null)
		const askPrices = data.map((d) => d.askPrice).filter((p) => p !== null)
		const currentBid = bidPrices[bidPrices.length - 1] ?? null
		const currentAsk = askPrices[askPrices.length - 1] ?? null
		const highBid = bidPrices.length > 0 ? Math.max(...bidPrices) : null
		const lowBid = bidPrices.length > 0 ? Math.min(...bidPrices) : null
		let change = 0
		if (bidPrices.length >= 2) {
			const first = bidPrices[0]
			const last = bidPrices[bidPrices.length - 1]
			change = ((last - first) / first) * 100
		}
		return { currentBid, currentAsk, highBid, lowBid, change }
	}
	function renderChart(canvas, data, tooltipEl) {
		const ctx = canvas.getContext('2d')
		if (!ctx) return
		const rect = canvas.getBoundingClientRect()
		const dpr = window.devicePixelRatio || 1
		canvas.width = rect.width * dpr
		canvas.height = rect.height * dpr
		ctx.scale(dpr, dpr)
		const width = rect.width
		const height = rect.height
		const padding = { top: 15, right: 10, bottom: 20, left: 45 }
		const chartWidth = width - padding.left - padding.right
		const chartHeight = height - padding.top - padding.bottom
		let hoverIndex = null
		const render = () => {
			ctx.clearRect(0, 0, width, height)
			if (data.length < 2) {
				ctx.fillStyle = 'rgba(226, 232, 240, 0.4)'
				ctx.font = '11px monospace'
				ctx.textAlign = 'center'
				ctx.fillText('No data available', width / 2, height / 2)
				return
			}
			const bidPrices = data.map((d) => d.bidPrice).filter((p) => p !== null)
			const askPrices = data.map((d) => d.askPrice).filter((p) => p !== null)
			const allPrices = [...bidPrices, ...askPrices]
			const minPrice = Math.min(...allPrices)
			const maxPrice = Math.max(...allPrices)
			const priceRange = maxPrice - minPrice || 1
			const getX = (i) =>
				padding.left + ((data.length - 1 - i) / (data.length - 1)) * chartWidth
			const getY = (price) =>
				padding.top +
				chartHeight -
				((price - minPrice) / priceRange) * chartHeight
			ctx.strokeStyle = 'rgba(59, 89, 152, 0.2)'
			ctx.lineWidth = 1
			for (let i = 0; i <= 4; i++) {
				const y = padding.top + (i / 4) * chartHeight
				ctx.beginPath()
				ctx.moveTo(padding.left, y)
				ctx.lineTo(width - padding.right, y)
				ctx.stroke()
				const price = maxPrice - (i / 4) * priceRange
				ctx.fillStyle = 'rgba(226, 232, 240, 0.4)'
				ctx.font = '10px monospace'
				ctx.textAlign = 'right'
				ctx.fillText(formatPrice$1(price), padding.left - 6, y + 3)
			}
			const dateCount = Math.min(5, data.length)
			ctx.fillStyle = 'rgba(226, 232, 240, 0.4)'
			ctx.font = '10px monospace'
			ctx.textAlign = 'center'
			for (let i = 0; i < dateCount; i++) {
				const dataIdx =
					dateCount === 1
						? 0
						: Math.round(
								((dateCount - 1 - i) / (dateCount - 1)) * (data.length - 1),
							)
				const x = getX(dataIdx)
				const date = new Date(data[dataIdx].timestamp)
				const label = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`
				ctx.fillText(label, x, height - 4)
			}
			ctx.beginPath()
			let started = false
			for (let i = 0; i < data.length; i++) {
				const price = data[i].askPrice
				if (price !== null) {
					const x = getX(i)
					const y = getY(price)
					if (!started) {
						ctx.moveTo(x, y)
						started = true
					} else {
						ctx.lineTo(x, y)
					}
				}
			}
			ctx.strokeStyle = '#e879a7'
			ctx.lineWidth = 2
			ctx.stroke()
			ctx.beginPath()
			started = false
			for (let i = 0; i < data.length; i++) {
				const price = data[i].bidPrice
				if (price !== null) {
					const x = getX(i)
					const y = getY(price)
					if (!started) {
						ctx.moveTo(x, y)
						started = true
					} else {
						ctx.lineTo(x, y)
					}
				}
			}
			ctx.strokeStyle = '#5ee9c5'
			ctx.lineWidth = 2
			ctx.stroke()
			if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < data.length) {
				const point = data[hoverIndex]
				const x = getX(hoverIndex)
				if (point.askPrice !== null) {
					const y = getY(point.askPrice)
					ctx.beginPath()
					ctx.arc(x, y, 4, 0, Math.PI * 2)
					ctx.fillStyle = '#e879a7'
					ctx.fill()
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
					ctx.lineWidth = 1.5
					ctx.stroke()
				}
				if (point.bidPrice !== null) {
					const y = getY(point.bidPrice)
					ctx.beginPath()
					ctx.arc(x, y, 4, 0, Math.PI * 2)
					ctx.fillStyle = '#5ee9c5'
					ctx.fill()
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
					ctx.lineWidth = 1.5
					ctx.stroke()
				}
			}
		}
		render()
		canvas.onmousemove = (e) => {
			const bounds = canvas.getBoundingClientRect()
			const mouseX = e.clientX - bounds.left
			const dataIndex = Math.round(
				(1 - (mouseX - padding.left) / chartWidth) * (data.length - 1),
			)
			if (dataIndex >= 0 && dataIndex < data.length) {
				const point = data[dataIndex]
				hoverIndex = dataIndex
				render()
				const dateEl = tooltipEl.querySelector('.mwm-tooltip-date')
				const bidEl = tooltipEl.querySelector('.mwm-tooltip-price.bid')
				const askEl = tooltipEl.querySelector('.mwm-tooltip-price.ask')
				if (dateEl) dateEl.textContent = formatDate(point.timestamp)
				if (bidEl) bidEl.textContent = `Bid: ${formatPrice$1(point.bidPrice)}`
				if (askEl) askEl.textContent = `Ask: ${formatPrice$1(point.askPrice)}`
				tooltipEl.classList.add('visible')
			}
		}
		canvas.onmouseleave = () => {
			hoverIndex = null
			render()
			tooltipEl.classList.remove('visible')
		}
	}
	function createPanelHTML(isVisible) {
		const collapsedClass = isVisible ? '' : 'collapsed'
		const toggleIcon = isVisible ? '−' : '+'
		const toggleTitle = isVisible ? 'Hide panel' : 'Show panel'
		return `
		<div class="mwm-marketplace-panel ${INJECTED_CLASS$1} ${collapsedClass}">
			<div class="mwm-panel-header" style="cursor: default;">
				<div class="mwm-panel-title">
					<span class="mwm-panel-name">MWM Prices (14d)</span>
				</div>
				<button class="mwm-panel-toggle" title="${toggleTitle}">${toggleIcon}</button>
			</div>
			<div class="mwm-panel-body">
				<div class="mwm-stats-row">
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">Bid</div>
						<div class="mwm-stat-value bid" data-stat="bid">—</div>
					</div>
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">Ask</div>
						<div class="mwm-stat-value ask" data-stat="ask">—</div>
					</div>
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">High</div>
						<div class="mwm-stat-value" data-stat="high">—</div>
					</div>
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">Low</div>
						<div class="mwm-stat-value" data-stat="low">—</div>
					</div>
				</div>
				<div class="mwm-chart-container">
					<canvas class="mwm-chart-canvas"></canvas>
					<div class="mwm-chart-tooltip">
						<div class="mwm-tooltip-date"></div>
						<div class="mwm-tooltip-prices">
							<span class="mwm-tooltip-price bid"></span>
							<span class="mwm-tooltip-price ask"></span>
						</div>
					</div>
				</div>
				<div class="mwm-legend">
					<div class="mwm-legend-item">
						<span class="mwm-legend-color bid"></span>
						<span>Bid</span>
					</div>
					<div class="mwm-legend-item">
						<span class="mwm-legend-color ask"></span>
						<span>Ask</span>
					</div>
				</div>
			</div>
			<div class="mwm-panel-footer">
				<a class="mwm-panel-link" href="https://milkyway.market" target="_blank">
					View on MilkyWay Market →
				</a>
				<span class="mwm-panel-brand">MWM</span>
			</div>
		</div>
	`
	}
	function extractItemHrid(currentItemEl) {
		const useElement = currentItemEl.querySelector('use')
		if (useElement && useElement.href && useElement.href.baseVal) {
			const itemId = useElement.href.baseVal.split('#')[1]
			if (itemId) {
				return itemId
			}
		}
		return null
	}
	async function handleMarketplaceItem(currentItemEl) {
		if (!getSettings().marketGraphEnabled) {
			const existingPanel2 = document.querySelector(
				`.mwm-marketplace-panel.${INJECTED_CLASS$1}`,
			)
			existingPanel2?.remove()
			return
		}
		const priceInputsContainer = document.querySelector(
			'[class*="MarketplacePanel_orderBooksContainer"]',
		)
		const infoContainer = currentItemEl.closest(
			'[class*="MarketplacePanel_infoContainer"]',
		)
		const insertTarget = priceInputsContainer || infoContainer
		if (!insertTarget) {
			warn('Could not find marketplace insert target')
			return
		}
		const existingPanel = document.querySelector(
			`.mwm-marketplace-panel.${INJECTED_CLASS$1}`,
		)
		const itemHrid = extractItemHrid(currentItemEl)
		if (!itemHrid) {
			warn('Could not extract item HRID from marketplace')
			return
		}
		if (isNonTradeable(itemHrid)) {
			log(`Skipping non-tradeable item: ${itemHrid}`)
			existingPanel?.remove()
			return
		}
		if (existingPanel) {
			const existingHrid = existingPanel.dataset.itemHrid
			if (existingHrid === itemHrid) {
				return
			}
			existingPanel.remove()
		}
		const isVisible = getPanelVisible()
		const panelContainer = document.createElement('div')
		panelContainer.innerHTML = createPanelHTML(isVisible)
		const panel = panelContainer.firstElementChild
		panel.dataset.itemHrid = itemHrid
		if (priceInputsContainer) {
			priceInputsContainer.insertAdjacentElement('beforebegin', panel)
		} else {
			insertTarget.appendChild(panel)
		}
		const toggleBtn = panel.querySelector('.mwm-panel-toggle')
		let dataLoaded = false
		if (toggleBtn) {
			toggleBtn.addEventListener('click', async () => {
				const isNowCollapsed = panel.classList.toggle('collapsed')
				const newVisible = !isNowCollapsed
				setPanelVisible(newVisible)
				toggleBtn.textContent = newVisible ? '−' : '+'
				toggleBtn.setAttribute(
					'title',
					newVisible ? 'Hide panel' : 'Show panel',
				)
				if (newVisible && !dataLoaded) {
					dataLoaded = true
					await loadPanelData(panel, itemHrid)
				}
			})
		}
		if (!isVisible) {
			return
		}
		dataLoaded = true
		await loadPanelData(panel, itemHrid)
	}
	async function loadPanelData(panel, itemHrid) {
		const statsRow = panel.querySelector('.mwm-stats-row')
		if (statsRow) {
			statsRow.innerHTML = `
			<div class="mwm-loading" style="grid-column: 1 / -1;">
				<div class="mwm-loading-spinner"></div>
				<span>Loading market data...</span>
			</div>
		`
		}
		try {
			const priceData = await fetchPriceChart(itemHrid)
			if (priceData.length > 0) {
				const stats = calculateStats(priceData)
				if (statsRow) {
					statsRow.innerHTML = `
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">Bid</div>
						<div class="mwm-stat-value bid">${formatPrice$1(stats.currentBid)}</div>
					</div>
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">Ask</div>
						<div class="mwm-stat-value ask">${formatPrice$1(stats.currentAsk)}</div>
					</div>
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">High</div>
						<div class="mwm-stat-value">${formatPrice$1(stats.highBid)}</div>
					</div>
					<div class="mwm-stat-item">
						<div class="mwm-stat-label">Low</div>
						<div class="mwm-stat-value">${formatPrice$1(stats.lowBid)}</div>
					</div>
				`
				}
				const canvas = panel.querySelector('.mwm-chart-canvas')
				const tooltip = panel.querySelector('.mwm-chart-tooltip')
				if (canvas && tooltip) {
					renderChart(canvas, priceData, tooltip)
				}
			} else {
				const body = panel.querySelector('.mwm-panel-body')
				if (body) {
					body.innerHTML = `
					<div class="mwm-no-data">
						<span>No market data available for this item</span>
					</div>
				`
				}
			}
		} catch (err) {
			warn(`Failed to load prices for marketplace: ${err}`)
			const body = panel.querySelector('.mwm-panel-body')
			if (body) {
				body.innerHTML = `
				<div class="mwm-error">
					<span>Failed to load market data</span>
				</div>
			`
			}
		}
	}
	const DEFAULT_OPTIONS = {
		width: 200,
		height: 36,
		bidColor: '#5ee9c5',
		askColor: '#e879a7',
		fillOpacity: 0.15,
		lineWidth: 1.5,
	}
	function renderSparkline(canvas, data, options) {
		const opts = { ...DEFAULT_OPTIONS, ...options }
		const ctx = canvas.getContext('2d')
		if (!ctx) return
		canvas.width = opts.width
		canvas.height = opts.height
		ctx.clearRect(0, 0, opts.width, opts.height)
		if (data.length < 2) return
		const bidPrices = data.map((d) => d.bidPrice).filter((p) => p !== null)
		const askPrices = data.map((d) => d.askPrice).filter((p) => p !== null)
		const allPrices = [...bidPrices, ...askPrices]
		const minPrice = Math.min(...allPrices)
		const maxPrice = Math.max(...allPrices)
		const priceRange = maxPrice - minPrice || 1
		const normalizeY = (price) => {
			const padding = 2
			const height = opts.height - padding * 2
			return padding + height - ((price - minPrice) / priceRange) * height
		}
		const getX = (index, total) => {
			return (index / (total - 1)) * opts.width
		}
		if (askPrices.length >= 2) {
			drawLine(ctx, data, 'askPrice', opts.askColor, opts, normalizeY, getX)
		}
		if (bidPrices.length >= 2) {
			drawLine(ctx, data, 'bidPrice', opts.bidColor, opts, normalizeY, getX)
		}
	}
	function drawLine(ctx, data, priceKey, color, opts, normalizeY, getX) {
		const points = []
		for (let i = 0; i < data.length; i++) {
			const price = data[i][priceKey]
			if (price !== null) {
				points.push({
					x: getX(i, data.length),
					y: normalizeY(price),
				})
			}
		}
		if (points.length < 2) return
		ctx.beginPath()
		ctx.moveTo(points[0].x, opts.height)
		for (const point of points) {
			ctx.lineTo(point.x, point.y)
		}
		ctx.lineTo(points[points.length - 1].x, opts.height)
		ctx.closePath()
		const gradient = ctx.createLinearGradient(0, 0, 0, opts.height)
		gradient.addColorStop(0, hexToRgba(color, opts.fillOpacity))
		gradient.addColorStop(1, hexToRgba(color, 0))
		ctx.fillStyle = gradient
		ctx.fill()
		ctx.beginPath()
		ctx.moveTo(points[0].x, points[0].y)
		for (let i = 1; i < points.length; i++) {
			ctx.lineTo(points[i].x, points[i].y)
		}
		ctx.strokeStyle = color
		ctx.lineWidth = opts.lineWidth
		ctx.lineCap = 'round'
		ctx.lineJoin = 'round'
		ctx.stroke()
	}
	function hexToRgba(hex, alpha) {
		const r = parseInt(hex.slice(1, 3), 16)
		const g = parseInt(hex.slice(3, 5), 16)
		const b = parseInt(hex.slice(5, 7), 16)
		return `rgba(${r}, ${g}, ${b}, ${alpha})`
	}
	function createSparklineCanvas(options) {
		const opts = { ...DEFAULT_OPTIONS, ...options }
		const canvas = document.createElement('canvas')
		canvas.width = opts.width
		canvas.height = opts.height
		canvas.className = 'mwm-sparkline'
		return canvas
	}
	const INJECTED_CLASS = 'mwm-price-injected'
	const TOOLTIP_POPPER_CLASS = 'MuiTooltip-popper'
	const ITEM_NAME_CLASS = 'ItemTooltipText_name__2JAHA'
	const TOOLTIP_CONTENT_CLASS = 'ItemTooltipText_itemTooltipText__zFq3A'
	function formatPrice(price) {
		if (price === null) return '—'
		if (price >= 1e6) return `${(price / 1e6).toFixed(1)}M`
		if (price >= 1e3) return `${(price / 1e3).toFixed(1)}K`
		return price.toLocaleString()
	}
	function calculateChange(data) {
		const bidPrices = data.map((d) => d.bidPrice).filter((p) => p !== null)
		if (bidPrices.length < 2) return 0
		const first = bidPrices[0]
		const last = bidPrices[bidPrices.length - 1]
		return ((last - first) / first) * 100
	}
	function initTooltipPrices() {
		log('Initializing tooltip prices')
		return domObserver.onClass(
			'tooltip-prices',
			TOOLTIP_POPPER_CLASS,
			handleTooltip,
		)
	}
	function createLoadingHTML() {
		return `
		<div class="mwm-loading">
			<div class="mwm-loading-spinner"></div>
			<span>Loading prices...</span>
		</div>
	`
	}
	function createPriceHTML(data) {
		const currentBid = data[data.length - 1]?.bidPrice ?? null
		const currentAsk = data[data.length - 1]?.askPrice ?? null
		const change = calculateChange(data)
		const changeClass =
			change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'
		const changeText =
			change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`
		return `
		<div class="mwm-price-header">
			<span class="mwm-price-label">MWM Prices</span>
			<span class="mwm-price-change ${changeClass}">${changeText}</span>
		</div>
		<div class="mwm-price-row">
			<div class="mwm-price-item">
				<span class="mwm-price-type bid">Bid</span>
				<span class="mwm-price-value">${formatPrice(currentBid)}</span>
			</div>
			<div class="mwm-price-item">
				<span class="mwm-price-type ask">Ask</span>
				<span class="mwm-price-value">${formatPrice(currentAsk)}</span>
			</div>
		</div>
	`
	}
	function createNoDataHTML() {
		return `
		<div class="mwm-no-data">
			<span>No market data available</span>
		</div>
	`
	}
	function createErrorHTML() {
		return `
		<div class="mwm-error">
			<span>Failed to load prices</span>
		</div>
	`
	}
	function getFetchDelay() {
		return getSettings().fetchDelayMs
	}
	async function handleTooltip(tooltip) {
		if (!getSettings().tooltipGraphEnabled) {
			const existingContainer = tooltip.querySelector(`.${INJECTED_CLASS}`)
			if (existingContainer) existingContainer.remove()
			return
		}
		const nameElement = tooltip.querySelector(`.${ITEM_NAME_CLASS}`)
		if (!nameElement) return
		const tooltipContent = tooltip.querySelector(`.${TOOLTIP_CONTENT_CLASS}`)
		if (!tooltipContent) return
		if (tooltipContent.querySelector(`.${INJECTED_CLASS}`)) return
		const itemName = nameElement.textContent?.trim()
		if (!itemName) return
		const cleanName = itemName.replace(/\s*\+\d+$/, '')
		const itemHrid = nameToHrid(cleanName)
		if (isNonTradeable(itemHrid)) return
		const container = document.createElement('div')
		container.className = `mwm-price-container ${INJECTED_CLASS}`
		container.innerHTML = createLoadingHTML()
		tooltipContent.appendChild(container)
		await new Promise((resolve) => setTimeout(resolve, getFetchDelay()))
		if (!document.body.contains(tooltip)) {
			return
		}
		try {
			const priceData = await fetchPriceChart(itemHrid)
			if (!document.body.contains(tooltip)) {
				return
			}
			if (priceData.length > 0) {
				container.innerHTML = createPriceHTML(priceData)
				const canvas = createSparklineCanvas()
				container.appendChild(canvas)
				renderSparkline(canvas, priceData)
			} else {
				container.innerHTML = createNoDataHTML()
			}
		} catch (err) {
			warn(`Failed to fetch prices for ${itemHrid}:`, err)
			container.innerHTML = createErrorHTML()
		}
	}
	function nameToHrid(name) {
		return name
			.toLowerCase()
			.replace(/['']/g, '')
			.replace(/\s+/g, '_')
			.replace(/[^a-z0-9_]/g, '')
	}
	function hookWebSocket(onMessage) {
		const dataDesc = Object.getOwnPropertyDescriptor(
			MessageEvent.prototype,
			'data',
		)
		if (!dataDesc?.get) {
			warn('Cannot hook WebSocket - MessageEvent.prototype.data not found')
			return
		}
		const originalGet = dataDesc.get
		dataDesc.get = function hookedGet() {
			const socket = this.currentTarget
			if (!(socket instanceof WebSocket)) {
				return originalGet.call(this)
			}
			const isMWI = WS_ENDPOINTS.some((ep) => socket.url?.includes(ep))
			if (!isMWI) {
				return originalGet.call(this)
			}
			const message = originalGet.call(this)
			Object.defineProperty(this, 'data', { value: message })
			if (typeof message === 'string') {
				try {
					const data = JSON.parse(message)
					if (data?.type) {
						setTimeout(() => onMessage(data.type, data), 0)
					}
				} catch {}
			}
			return message
		}
		Object.defineProperty(MessageEvent.prototype, 'data', dataDesc)
		log('WebSocket hook installed')
	}
	const styleCss =
		':root{--mwm-bg-deep: #0a0e1a;--mwm-bg-panel: rgba(18, 22, 42, .95);--mwm-bg-surface: rgba(30, 36, 60, .8);--mwm-border-glow: #3b5998;--mwm-border-dim: rgba(59, 89, 152, .3);--mwm-bid-color: #5ee9c5;--mwm-bid-color-dim: rgba(94, 233, 197, .2);--mwm-ask-color: #e879a7;--mwm-ask-color-dim: rgba(232, 121, 167, .2);--mwm-accent-purple: #8b5cf6;--mwm-accent-purple-dim: rgba(139, 92, 246, .15);--mwm-text-primary: #e2e8f0;--mwm-text-secondary: rgba(226, 232, 240, .6);--mwm-text-muted: rgba(226, 232, 240, .4);--mwm-font-mono: "SF Mono", "Fira Code", "Consolas", "Monaco", monospace}.mwm-price-container{margin-top:10px;padding:10px 12px;background:linear-gradient(135deg,var(--mwm-bg-panel) 0%,rgba(12,16,32,.95) 100%);border-radius:6px;border:1px solid var(--mwm-border-dim);box-shadow:0 0 20px #3b599826,inset 0 1px #ffffff0d;position:relative;overflow:hidden}.mwm-price-container:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.03) 2px,rgba(0,0,0,.03) 4px);pointer-events:none}.mwm-price-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;position:relative;z-index:1}.mwm-price-label{font-family:var(--mwm-font-mono);font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--mwm-accent-purple);display:flex;align-items:center;gap:6px}.mwm-price-label:before{content:"";width:6px;height:6px;background:var(--mwm-accent-purple);border-radius:50%;box-shadow:0 0 6px var(--mwm-accent-purple);animation:mwm-pulse 2s ease-in-out infinite}@keyframes mwm-pulse{0%,to{opacity:1}50%{opacity:.5}}.mwm-click-hint{font-family:var(--mwm-font-mono);font-size:8px;color:var(--mwm-text-muted);cursor:pointer;transition:color .2s}.mwm-click-hint:hover{color:var(--mwm-text-secondary)}.mwm-price-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;position:relative;z-index:1}.mwm-price-item{display:flex;flex-direction:column;gap:2px}.mwm-price-type{font-family:var(--mwm-font-mono);font-size:8px;text-transform:uppercase;letter-spacing:.05em}.mwm-price-type.bid{color:var(--mwm-bid-color)}.mwm-price-type.ask{color:var(--mwm-ask-color)}.mwm-price-value{font-family:var(--mwm-font-mono);font-size:13px;font-weight:600;color:var(--mwm-text-primary)}.mwm-price-change{font-family:var(--mwm-font-mono);font-size:10px;padding:2px 6px;border-radius:3px}.mwm-price-change.positive{color:var(--mwm-bid-color);background:var(--mwm-bid-color-dim)}.mwm-price-change.negative{color:var(--mwm-ask-color);background:var(--mwm-ask-color-dim)}.mwm-price-change.neutral{color:var(--mwm-text-secondary);background:var(--mwm-bg-surface)}.mwm-sparkline{display:block;width:100%;height:32px;border-radius:4px;background:var(--mwm-bg-surface);position:relative;z-index:1}.mwm-loading{display:flex;align-items:center;justify-content:center;gap:8px;padding:16px 12px;color:var(--mwm-text-secondary);font-family:var(--mwm-font-mono);font-size:10px}.mwm-loading-spinner{width:14px;height:14px;border:2px solid var(--mwm-border-dim);border-top-color:var(--mwm-accent-purple);border-radius:50%;animation:mwm-spin .8s linear infinite}@keyframes mwm-spin{to{transform:rotate(360deg)}}.mwm-error{display:flex;align-items:center;gap:6px;padding:8px;color:var(--mwm-text-muted);font-family:var(--mwm-font-mono);font-size:9px}.mwm-panel-overlay{position:fixed;inset:0;background:#0006;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);z-index:999998;opacity:0;pointer-events:none;transition:opacity .2s ease}.mwm-panel-overlay.visible{opacity:1;pointer-events:auto}.mwm-detail-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(.95);width:420px;max-width:90vw;background:linear-gradient(180deg,var(--mwm-bg-panel) 0%,var(--mwm-bg-deep) 100%);border-radius:12px;border:1px solid var(--mwm-border-glow);box-shadow:0 0 40px #3b59984d,0 0 80px #8b5cf61a,inset 0 1px #ffffff1a;z-index:999999;opacity:0;pointer-events:none;transition:all .25s cubic-bezier(.34,1.56,.64,1);overflow:hidden}.mwm-detail-panel.visible{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}.mwm-detail-panel:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.02) 2px,rgba(0,0,0,.02) 4px);pointer-events:none;z-index:1}.mwm-panel-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:linear-gradient(90deg,var(--mwm-accent-purple-dim) 0%,transparent 100%);border-bottom:1px solid var(--mwm-border-dim);cursor:move;-webkit-user-select:none;user-select:none;position:relative;z-index:2}.mwm-panel-title{display:flex;align-items:center;gap:10px}.mwm-panel-icon{width:28px;height:28px;border-radius:4px;background:var(--mwm-bg-surface);display:flex;align-items:center;justify-content:center;font-size:16px;border:1px solid var(--mwm-border-dim)}.mwm-panel-name{font-family:var(--mwm-font-mono);font-size:14px;font-weight:600;color:var(--mwm-text-primary)}.mwm-panel-close{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:none;background:transparent;color:var(--mwm-text-secondary);cursor:pointer;border-radius:4px;transition:all .15s;font-size:18px}.mwm-panel-close:hover{background:#ffffff1a;color:var(--mwm-text-primary)}.mwm-panel-body{padding:16px;position:relative;z-index:2}.mwm-stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}.mwm-stat-item{background:var(--mwm-bg-surface);border-radius:6px;padding:10px 8px;border:1px solid var(--mwm-border-dim);text-align:center}.mwm-stat-label{font-family:var(--mwm-font-mono);font-size:8px;text-transform:uppercase;letter-spacing:.1em;color:var(--mwm-text-muted);margin-bottom:4px}.mwm-stat-value{font-family:var(--mwm-font-mono);font-size:13px;font-weight:600;color:var(--mwm-text-primary)}.mwm-stat-value.bid{color:var(--mwm-bid-color)}.mwm-stat-value.ask{color:var(--mwm-ask-color)}.mwm-period-selector{display:flex;gap:4px;margin-bottom:12px}.mwm-period-btn{flex:1;padding:6px 12px;border:1px solid var(--mwm-border-dim);background:transparent;color:var(--mwm-text-secondary);font-family:var(--mwm-font-mono);font-size:10px;font-weight:500;border-radius:4px;cursor:pointer;transition:all .15s}.mwm-period-btn:hover{background:var(--mwm-bg-surface);color:var(--mwm-text-primary)}.mwm-period-btn.active{background:var(--mwm-accent-purple-dim);border-color:var(--mwm-accent-purple);color:var(--mwm-accent-purple)}.mwm-chart-container{position:relative;background:var(--mwm-bg-surface);border-radius:8px;border:1px solid var(--mwm-border-dim);overflow:hidden}.mwm-chart-canvas{display:block;width:100%;height:180px;cursor:crosshair}.mwm-chart-tooltip{position:absolute;top:8px;right:8px;background:var(--mwm-bg-panel);border:1px solid var(--mwm-border-dim);border-radius:4px;padding:8px 10px;font-family:var(--mwm-font-mono);pointer-events:none;opacity:0;transition:opacity .15s;z-index:10}.mwm-chart-tooltip.visible{opacity:1}.mwm-tooltip-date{font-size:10px;color:var(--mwm-text-muted);margin-bottom:4px}.mwm-tooltip-prices{display:flex;gap:12px}.mwm-tooltip-price{font-size:11px}.mwm-tooltip-price.bid{color:var(--mwm-bid-color)}.mwm-tooltip-price.ask{color:var(--mwm-ask-color)}.mwm-panel-footer{padding:12px 16px;border-top:1px solid var(--mwm-border-dim);display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2}.mwm-panel-link{font-family:var(--mwm-font-mono);font-size:10px;color:var(--mwm-accent-purple);text-decoration:none;display:flex;align-items:center;gap:4px;transition:opacity .15s}.mwm-panel-link:hover{opacity:.8}.mwm-panel-brand{font-family:var(--mwm-font-mono);font-size:9px;color:var(--mwm-text-muted)}.mwm-legend{display:flex;gap:16px;margin-top:10px;justify-content:center}.mwm-legend-item{display:flex;align-items:center;gap:6px;font-family:var(--mwm-font-mono);font-size:9px;color:var(--mwm-text-secondary)}.mwm-legend-color{width:12px;height:3px;border-radius:2px}.mwm-legend-color.bid{background:var(--mwm-bid-color)}.mwm-legend-color.ask{background:var(--mwm-ask-color)}.mwm-no-data{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;color:var(--mwm-text-muted);font-family:var(--mwm-font-mono);font-size:11px;text-align:center;gap:4px}.mwm-modal-panel{margin:16px 0;background:linear-gradient(180deg,var(--mwm-bg-panel) 0%,var(--mwm-bg-deep) 100%);border-radius:8px;border:1px solid var(--mwm-border-glow);box-shadow:0 0 20px #3b599833,inset 0 1px #ffffff0d;overflow:hidden}.mwm-modal-panel .mwm-panel-header{padding:10px 14px;background:linear-gradient(90deg,var(--mwm-accent-purple-dim) 0%,transparent 100%);border-bottom:1px solid var(--mwm-border-dim)}.mwm-modal-panel .mwm-panel-body{padding:14px}.mwm-modal-panel .mwm-panel-footer{padding:10px 14px}.mwm-modal-panel .mwm-stats-row{grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px}.mwm-modal-panel .mwm-chart-canvas{height:140px}.mwm-marketplace-panel{margin:12px 0;background:linear-gradient(180deg,var(--mwm-bg-panel) 0%,var(--mwm-bg-deep) 100%);border-radius:8px;border:1px solid var(--mwm-border-glow);box-shadow:0 0 20px #3b599833,inset 0 1px #ffffff0d;overflow:visible;width:100%}.mwm-marketplace-panel .mwm-panel-header{padding:8px 12px;background:linear-gradient(90deg,var(--mwm-accent-purple-dim) 0%,transparent 100%);border-bottom:1px solid var(--mwm-border-dim)}.mwm-marketplace-panel .mwm-panel-name{font-size:11px}.mwm-marketplace-panel .mwm-panel-body{padding:10px 12px}.mwm-marketplace-panel .mwm-panel-footer{padding:8px 12px}.mwm-marketplace-panel .mwm-stats-row{grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px}.mwm-marketplace-panel .mwm-stat-item{padding:6px 4px}.mwm-marketplace-panel .mwm-stat-label{font-size:7px}.mwm-marketplace-panel .mwm-stat-value{font-size:11px}.mwm-marketplace-panel .mwm-chart-canvas{height:120px}.mwm-marketplace-panel .mwm-legend{margin-top:8px}.mwm-marketplace-panel .mwm-panel-link{font-size:9px}.mwm-marketplace-panel .mwm-panel-brand{font-size:8px}.mwm-panel-toggle{width:24px;height:24px;display:flex;align-items:center;justify-content:center;border:1px solid var(--mwm-border-dim);background:var(--mwm-bg-surface);color:var(--mwm-text-secondary);cursor:pointer;border-radius:4px;transition:all .15s;font-size:16px;font-family:var(--mwm-font-mono);line-height:1}.mwm-panel-toggle:hover{background:#ffffff1a;color:var(--mwm-text-primary);border-color:var(--mwm-accent-purple)}.mwm-marketplace-panel.collapsed .mwm-panel-body,.mwm-marketplace-panel.collapsed .mwm-panel-footer{display:none}.mwm-marketplace-panel.collapsed{border-color:var(--mwm-border-dim)}.mwm-marketplace-panel.collapsed .mwm-panel-header{border-bottom:none}.mwm-settings-panel{margin:20px 0;padding:16px 32px;background:linear-gradient(135deg,var(--mwm-bg-panel) 0%,rgba(12,16,32,.95) 100%);border-radius:8px;border:1px solid var(--mwm-border-glow);box-shadow:0 0 20px #3b599833,inset 0 1px #ffffff0d;position:relative;overflow:hidden;width:100%}.mwm-settings-header{display:flex;align-items:center;gap:10px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--mwm-border-dim);position:relative;z-index:1}.mwm-settings-title{font-family:var(--mwm-font-mono);font-size:13px;font-weight:600;color:var(--mwm-accent-purple);text-transform:uppercase;letter-spacing:.05em;display:flex;align-items:center;gap:8px}.mwm-settings-title:before{content:"";width:8px;height:8px;background:var(--mwm-accent-purple);border-radius:50%;box-shadow:0 0 8px var(--mwm-accent-purple);animation:mwm-pulse 2s ease-in-out infinite}.mwm-settings-note{font-family:var(--mwm-font-mono);font-size:9px;color:var(--mwm-text-muted)}.mwm-settings-section{display:flex;flex-direction:column;gap:14px;position:relative;z-index:1}.mwm-setting-item{display:flex;flex-direction:column;gap:8px}.mwm-setting-label{display:flex;align-items:center;gap:10px;cursor:pointer}.mwm-setting-label input[type=checkbox]{appearance:none;-webkit-appearance:none;width:18px;height:18px;border:2px solid var(--mwm-border-dim);border-radius:4px;background:var(--mwm-bg-surface);cursor:pointer;position:relative;transition:all .15s;flex-shrink:0}.mwm-setting-label input[type=checkbox]:hover{border-color:var(--mwm-accent-purple);background:var(--mwm-accent-purple-dim)}.mwm-setting-label input[type=checkbox]:checked{background:var(--mwm-accent-purple);border-color:var(--mwm-accent-purple)}.mwm-setting-label input[type=checkbox]:checked:after{content:"✓";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:11px;font-weight:700}.mwm-setting-text{font-family:var(--mwm-font-mono);font-size:11px;color:var(--mwm-text-primary)}.mwm-setting-input{width:80px;padding:6px 10px;background:var(--mwm-bg-surface);border:1px solid var(--mwm-border-dim);border-radius:4px;color:var(--mwm-text-primary);font-family:var(--mwm-font-mono);font-size:11px;transition:all .15s}.mwm-setting-input:hover,.mwm-setting-input:focus{border-color:var(--mwm-accent-purple);outline:none}.mwm-setting-input:focus{box-shadow:0 0 8px var(--mwm-accent-purple-dim)}.mwm-setting-hint{font-family:var(--mwm-font-mono);font-size:9px;color:var(--mwm-text-muted);text-align:left}.mwm-setting-preview{padding:10px;background:var(--mwm-bg-surface);border-radius:6px;border:1px solid var(--mwm-border-dim);margin-left:28px;transition:opacity .3s}.mwm-setting-preview canvas{display:block;border-radius:4px}.mwm-setting-input::-webkit-inner-spin-button,.mwm-setting-input::-webkit-outer-spin-button{opacity:1;height:20px}'
	importCSS(styleCss)
	function signalPresence() {
		document.documentElement.setAttribute('data-mwm-addon', VERSION)
		window.dispatchEvent(
			new CustomEvent(EVENTS.ADDON_READY, { detail: { version: VERSION } }),
		)
		log('Addon ready')
	}
	let characterData = null
	async function initGameSite() {
		hookWebSocket((type, data) => {
			switch (type) {
				case 'init_character_data':
					characterData = data
					log('Character initialized:', characterData.character?.name)
					syncToStorage(characterData, true)
					break
				case 'items_updated': {
					if (!characterData) return
					const itemsData = data
					const items = itemsData.characterItems || itemsData.items
					if (items) mergeItems(characterData, items)
					syncToStorage(characterData)
					break
				}
				case 'action_completed': {
					if (!characterData) return
					const actionData = data
					const items =
						actionData.characterItems || actionData.endCharacterItems
					const skills =
						actionData.characterSkills || actionData.endCharacterSkills
					if (items) mergeItems(characterData, items)
					if (skills) mergeSkills(characterData, skills)
					syncToStorage(characterData)
					break
				}
			}
		})
		window.addEventListener(EVENTS.REQUEST, (event) => {
			log('Data request received')
			const customEvent = event
			if (characterData) {
				syncToStorage(characterData, true)
				const detail = {
					requestId: customEvent.detail?.requestId,
					data: characterData,
					source: 'game_site',
				}
				window.dispatchEvent(new CustomEvent(EVENTS.RESPONSE, { detail }))
			} else {
				warn('No character data available')
			}
		})
		loadSettings()
		domObserver.start()
		initSettings()
		initTooltipPrices()
		initItemModal()
		initMarketplacePrices()
		log('Game site initialized')
	}
	function initMarketSite() {
		characterData = loadFromStorage()
		_GM_addValueChangeListener(
			STORAGE_KEY$1,
			(_name, _oldValue, newValue, remote) => {
				if (!remote || !newValue?.data) return
				const storedData = newValue
				characterData = storedData.data
				log('Cross-tab update:', characterData.character?.name)
				const detail = {
					data: characterData,
					source: 'cross_tab',
					timestamp: storedData.timestamp,
				}
				window.dispatchEvent(new CustomEvent(EVENTS.UPDATED, { detail }))
			},
		)
		window.addEventListener(EVENTS.REQUEST, (event) => {
			log('Pull request received')
			const customEvent = event
			if (characterData) {
				const detail = {
					requestId: customEvent.detail?.requestId,
					data: characterData,
					source: 'storage',
				}
				window.dispatchEvent(new CustomEvent(EVENTS.RESPONSE, { detail }))
			} else {
				warn('No character data in storage')
			}
		})
		if (characterData) {
			setTimeout(() => {
				const detail = {
					data: characterData,
					source: 'initial_load',
					timestamp: Date.now(),
				}
				window.dispatchEvent(new CustomEvent(EVENTS.UPDATED, { detail }))
			}, 100)
		}
		log('Market site initialized')
	}
	function init() {
		signalPresence()
		if (isGameSite) {
			initGameSite()
		} else if (isMarketSite) {
			initMarketSite()
		}
	}
	init()
})()
