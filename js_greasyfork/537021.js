// ==UserScript==
// @name         Steam Inventory Auto Sell Script
// @description  Automatically list marketable items in your Steam inventory.
// @version      2.0.0
// @author       RLAlpha49
// @namespace    https://github.com/RLAlpha49/Steam-Inventory-Auto-Sell-Script
// @license      MIT
// @match        https://steamcommunity.com/id/*/inventory*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537021/Steam%20Inventory%20Auto%20Sell%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/537021/Steam%20Inventory%20Auto%20Sell%20Script.meta.js
// ==/UserScript==

(function () {
	"use strict";

	/**
	 * @typedef {Object} Config
	 * @property {boolean} DEBUG - Enable verbose debug logging.
	 * @property {boolean} USE_STEAMDB_FALLBACK - Use SteamDB Quick Sell if available.
	 * @property {number} MAX_ITEMS_PER_PAGE - Max items to process per page.
	 * @property {number} ITEM_INFO_UPDATE_DELAY_MS - Delay after clicking item link.
	 * @property {number} BETWEEN_ITEMS_DELAY_MS - Delay between items.
	 * @property {number} NEXT_PAGE_DELAY_MS - Delay before next page.
	 * @property {number} FILTER_WAIT_TIMEOUT_MS - Timeout for filter wait.
	 * @property {number} FILTER_POLL_INTERVAL_MS - Poll interval for filter.
	 * @property {number} FILTER_AFTER_TOGGLE_DELAY_MS - Delay after filter toggle.
	 * @property {number} PRICE_RETRIES - Number of price retries.
	 * @property {number} PRICE_RELOAD_DELAY_MS - Delay before price reload.
	 * @property {number} PRICE_RETRY_WAIT_MS - Wait time for price retry.
	 * @property {number} SELL_DIALOG_APPEAR_TIMEOUT_MS - Timeout for sell dialog.
	 * @property {number} SELL_DIALOG_POLL_INTERVAL_MS - Poll interval for sell dialog.
	 * @property {number} AFTER_ACCEPT_DELAY_MS - Delay after accept.
	 * @property {number} AFTER_OK_DELAY_MS - Delay after OK.
	 * @property {number} MODAL_CLOSE_TIMEOUT_MS - Timeout for modal close.
	 * @property {number} STEAMDB_FALLBACK_WAIT_MS - Wait for SteamDB.
	 * @property {number} STEAMDB_ENABLE_TIMEOUT_MS - Timeout for SteamDB enable.
	 * @property {number} STEAMDB_CLICK_ATTEMPTS - Attempts to click SteamDB.
	 */

	/**
	 * @typedef {Object} State
	 * @property {boolean} running - Whether the script is currently running.
	 * @property {boolean} paused - Whether the script is paused.
	 * @property {boolean} stopRequested - Whether a stop has been requested.
	 * @property {Object} settings - User settings.
	 * @property {boolean} settings.useSteamDbFallback - Use SteamDB fallback.
	 * @property {boolean} settings.useTurnIntoGems - Use turn into gems.
	 * @property {boolean} settings.stopAfterPage - Stop after current page.
	 * @property {Object} stats - Statistics.
	 * @property {number} stats.startedAtMs - Start time in ms.
	 * @property {number} stats.elapsedMs - Elapsed time in ms.
	 * @property {number} stats.page - Current page number.
	 * @property {number} stats.itemsOnPage - Items on current page.
	 * @property {number} stats.itemsAttemptedThisPage - Items attempted this page.
	 * @property {number} stats.itemsAttemptedTotal - Total items attempted.
	 * @property {number} stats.itemsListed - Items listed.
	 * @property {number} stats.itemsSkipped - Items skipped.
	 * @property {number} stats.errors - Errors count.
	 * @property {UI|null} ui - UI object.
	 * @property {number|null} uiTicker - UI update ticker.
	 */

	/** @type {Config} Default configuration object. */
	const CONFIG = Object.freeze({
		// ===== USER-CONFIGURABLE OPTIONS =====
		// These are the main settings you can tweak to customize the script's behavior.
		// Edit the values below as needed.

		// Set to true to enable verbose debug logging in the console
		DEBUG: false,

		// Whether to try SteamDB Quick Sell first before falling back to default Steam sell flow
		// Set to false to disable SteamDB integration entirely
		USE_STEAMDB_FALLBACK: true,

		// Whether to turn items into gems instead of selling them
		// Set to true to enable turning items into gems
		USE_TURN_INTO_GEMS: false,
		// ===== END USER-CONFIGURABLE OPTIONS =====

		MAX_ITEMS_PER_PAGE: 25,

		ITEM_INFO_UPDATE_DELAY_MS: 500,
		BETWEEN_ITEMS_DELAY_MS: 1000,
		NEXT_PAGE_DELAY_MS: 1500,

		FILTER_WAIT_TIMEOUT_MS: 2500,
		FILTER_POLL_INTERVAL_MS: 100,
		FILTER_AFTER_TOGGLE_DELAY_MS: 2000,

		PRICE_RETRIES: 3,
		PRICE_RELOAD_DELAY_MS: 1000,
		PRICE_RETRY_WAIT_MS: 10000,

		SELL_DIALOG_APPEAR_TIMEOUT_MS: 1500,
		SELL_DIALOG_POLL_INTERVAL_MS: 100,
		AFTER_ACCEPT_DELAY_MS: 500,
		AFTER_OK_DELAY_MS: 500,
		MODAL_CLOSE_TIMEOUT_MS: 10000,

		STEAMDB_FALLBACK_WAIT_MS: 500,
		STEAMDB_ENABLE_TIMEOUT_MS: 5000,
		STEAMDB_CLICK_ATTEMPTS: 3,
	});

	/** @type {Object<string, string>} CSS selectors used throughout the script. */
	const SELECTORS = Object.freeze({
		INVENTORY_LOGOS: "#inventory_logos",
		FILTER_CONTAINER: "#filter_options",
		FILTER_SHOW: "#filter_tag_show",
		MARKETABLE_INPUT: 'input[id*="misc_marketable"]',

		PAGE_CURRENT: "#pagecontrol_cur",
		PAGE_NEXT: "#pagebtn_next",
		INVENTORY_PAGE: ".inventory_page",
		INVENTORIES: "#inventories",
		ITEM_HOLDER: ".itemHolder",
		ITEM_LINK: "a.inventory_item_link",

		ITEMINFO0: "#iteminfo0",
		ITEMINFO1: "#iteminfo1",
		MARKET_ACTIONS:
			"#iteminfo0_item_market_actions, #iteminfo1_item_market_actions, .item_market_actions",

		SELL_BUTTONS_GREEN: 'button[data-accent-color="green"]',
		SELL_DIALOG: "#market_sell_dialog",
		PRICE_INPUT: "#market_sell_buyercurrency_input",
		SSA_CHECKBOX: "#market_sell_dialog_accept_ssa",
		ACCEPT_BUTTON: "#market_sell_dialog_accept",
		OK_BUTTON: "#market_sell_dialog_ok",
		ERROR_DIV: "#market_sell_dialog_error",

		QUANTITY_INPUT: "#market_sell_quantity_input",
		QUANTITY_AVAILABLE_AMT: "#market_sell_quantity_available_amt",

		MODAL_BACKGROUND: ".newmodal_background",
		MODAL_CLOSE: ".newmodal_close",

		STEAMDB_BUY: "div.steamdb_orders_header.steamdb_buy_summary",
		STEAMDB_SELL: "div.steamdb_orders_header.steamdb_sell_summary",

		ACCOUNT_PULLDOWN: "#account_pulldown",
		PERSONA_NAME: ".whiteLink.persona_name_text_content",
	});

	/** @type {string} Prefix for log messages. */
	const LOG_PREFIX = "[Steam Auto Sell Helper]";

	/** @type {Object<string, string>} Keys for localStorage. */
	const STORAGE_KEYS = Object.freeze({
		PANEL_MODE: "steamAutoSell.panelMode",
		STOP_AFTER_PAGE: "steamAutoSell.stopAfterPage",
		RUNTIME_CONFIG_JSON: "steamAutoSell.runtimeConfig.v1",
	});

	/** @type {Config} Runtime configuration, loaded from storage or defaults. */
	let runtimeConfig = { ...CONFIG };

	/**
	 * Logs a message to the console with the script prefix.
	 * @param {...any} args - The arguments to log.
	 */
	function log(...args) {
		console.log(LOG_PREFIX, ...args);
	}

	/**
	 * Logs a warning message to the console with the script prefix.
	 * @param {...any} args - The arguments to log.
	 */
	function warn(...args) {
		console.warn(`${LOG_PREFIX}[WARN]`, ...args);
	}

	/**
	 * Logs an error message to the console with the script prefix.
	 * @param {...any} args - The arguments to log.
	 */
	function error(...args) {
		console.error(`${LOG_PREFIX}[ERROR]`, ...args);
	}

	/**
	 * Logs a debug message if DEBUG is enabled.
	 * @param {...any} args - The arguments to log.
	 */
	function debug(...args) {
		if (runtimeConfig.DEBUG) console.debug(`${LOG_PREFIX}[DEBUG]`, ...args);
	}

	/**
	 * Reads a boolean setting from localStorage.
	 * @param {string} key - The storage key.
	 * @param {boolean} defaultValue - The default value if not found.
	 * @returns {boolean} The stored value or default.
	 */
	function readBoolSetting(key, defaultValue) {
		try {
			const raw = globalThis.localStorage.getItem(key);
			if (raw === null || raw === undefined) return defaultValue;
			if (raw === "1" || raw === "true") return true;
			if (raw === "0" || raw === "false") return false;
			return defaultValue;
		} catch {
			return defaultValue;
		}
	}

	/**
	 * Reads a string setting from localStorage.
	 * @param {string} key - The storage key.
	 * @param {string} defaultValue - The default value if not found.
	 * @returns {string} The stored value or default.
	 */
	function readStringSetting(key, defaultValue) {
		try {
			const raw = globalThis.localStorage.getItem(key);
			if (raw === null || raw === undefined) return defaultValue;
			const v = String(raw).trim();
			return v || defaultValue;
		} catch {
			return defaultValue;
		}
	}

	/**
	 * Writes a boolean setting to localStorage.
	 * @param {string} key - The storage key.
	 * @param {boolean} value - The value to store.
	 */
	function writeBoolSetting(key, value) {
		try {
			globalThis.localStorage.setItem(key, value ? "1" : "0");
		} catch {}
	}

	/**
	 * Writes a string setting to localStorage.
	 * @param {string} key - The storage key.
	 * @param {string} value - The value to store.
	 */
	function writeStringSetting(key, value) {
		try {
			globalThis.localStorage.setItem(key, String(value));
		} catch {}
	}

	/**
	 * Deletes a setting from localStorage.
	 * @param {string} key - The storage key.
	 */
	function deleteSetting(key) {
		try {
			globalThis.localStorage.removeItem(key);
		} catch {}
	}

	/** @type {Object<string, {type: string, min?: number, max?: number}>} Schema for config validation. */
	const CONFIG_SCHEMA = Object.freeze({
		DEBUG: { type: "bool" },
		USE_STEAMDB_FALLBACK: { type: "bool" },
		USE_TURN_INTO_GEMS: { type: "bool" },

		MAX_ITEMS_PER_PAGE: { type: "int", min: 1, max: 500 },
		ITEM_INFO_UPDATE_DELAY_MS: { type: "int", min: 0, max: 120000 },
		BETWEEN_ITEMS_DELAY_MS: { type: "int", min: 0, max: 120000 },
		NEXT_PAGE_DELAY_MS: { type: "int", min: 0, max: 120000 },

		FILTER_WAIT_TIMEOUT_MS: { type: "int", min: 250, max: 120000 },
		FILTER_POLL_INTERVAL_MS: { type: "int", min: 25, max: 10000 },
		FILTER_AFTER_TOGGLE_DELAY_MS: { type: "int", min: 0, max: 120000 },

		PRICE_RETRIES: { type: "int", min: 0, max: 20 },
		PRICE_RELOAD_DELAY_MS: { type: "int", min: 0, max: 120000 },
		PRICE_RETRY_WAIT_MS: { type: "int", min: 0, max: 600000 },

		SELL_DIALOG_APPEAR_TIMEOUT_MS: { type: "int", min: 250, max: 60000 },
		SELL_DIALOG_POLL_INTERVAL_MS: { type: "int", min: 25, max: 5000 },
		AFTER_ACCEPT_DELAY_MS: { type: "int", min: 0, max: 60000 },
		AFTER_OK_DELAY_MS: { type: "int", min: 0, max: 60000 },
		MODAL_CLOSE_TIMEOUT_MS: { type: "int", min: 500, max: 300000 },

		STEAMDB_FALLBACK_WAIT_MS: { type: "int", min: 0, max: 60000 },
		STEAMDB_ENABLE_TIMEOUT_MS: { type: "int", min: 250, max: 120000 },
		STEAMDB_CLICK_ATTEMPTS: { type: "int", min: 0, max: 20 },
	});

	/**
	 * Clamps a number between min and max if provided.
	 * @param {number} n - The number to clamp.
	 * @param {number} [min] - The minimum value.
	 * @param {number} [max] - The maximum value.
	 * @returns {number} The clamped number.
	 */
	function clamp(n, min, max) {
		if (typeof min === "number") n = Math.max(min, n);
		if (typeof max === "number") n = Math.min(max, n);
		return n;
	}

	/**
	 * Normalizes runtime config by validating and clamping values.
	 * @param {Object} candidate - The candidate config object.
	 * @returns {Config} The normalized config.
	 */
	function normalizeRuntimeConfig(candidate) {
		const cfg = { ...CONFIG };
		if (!candidate || typeof candidate !== "object") return cfg;
		for (const [key, rule] of Object.entries(CONFIG_SCHEMA)) {
			if (!Object.hasOwn(candidate, key)) continue;
			const v = candidate[key];
			if (rule.type === "bool") {
				cfg[key] = !!v;
				continue;
			}
			if (rule.type === "int") {
				const n = Number(v);
				if (!Number.isFinite(n)) continue;
				cfg[key] = clamp(Math.round(n), rule.min, rule.max);
			}
		}
		return cfg;
	}

	/**
	 * Picks config keys for storage.
	 * @param {Config} cfg - The config object.
	 * @returns {Object} The config for storage.
	 */
	function pickRuntimeConfigForStorage(cfg) {
		const out = {};
		for (const key of Object.keys(CONFIG_SCHEMA)) out[key] = cfg[key];
		return out;
	}

	/**
	 * Loads runtime config from localStorage.
	 * @returns {Config} The loaded config.
	 */
	function loadRuntimeConfigFromStorage() {
		let candidate = null;
		const rawJson = readStringSetting(STORAGE_KEYS.RUNTIME_CONFIG_JSON, null);
		if (rawJson) {
			try {
				candidate = JSON.parse(rawJson);
			} catch {
				candidate = null;
			}
		}

		return normalizeRuntimeConfig(candidate);
	}

	/**
	 * Persists runtime config to localStorage.
	 * @param {Config} cfg - The config to persist.
	 */
	function persistRuntimeConfigToStorage(cfg) {
		writeStringSetting(
			STORAGE_KEYS.RUNTIME_CONFIG_JSON,
			JSON.stringify(pickRuntimeConfigForStorage(cfg))
		);
	}

	/**
	 * Resets runtime config to defaults and persists.
	 * @returns {Config} The reset config.
	 */
	function resetRuntimeConfigToDefaults() {
		deleteSetting(STORAGE_KEYS.RUNTIME_CONFIG_JSON);
		runtimeConfig = { ...CONFIG };
		persistRuntimeConfigToStorage(runtimeConfig);
		return runtimeConfig;
	}

	/**
	 * Sleeps for the specified milliseconds.
	 * @param {number} ms - Milliseconds to sleep.
	 * @returns {Promise<void>}
	 */
	function sleep(ms) {
		return new Promise((res) => setTimeout(res, ms));
	}

	/**
	 * Checks if an element is visible.
	 * @param {Element} el - The element to check.
	 * @returns {boolean} True if visible.
	 */
	function isVisible(el) {
		if (!el) return false;
		if (el?.style?.display === "none") return false;
		return true;
	}

	/**
	 * Waits while the script is paused.
	 * @param {Object} state - The state object.
	 */
	async function waitWhilePaused(state) {
		if (!state) return;
		while (state.paused && !state.stopRequested) {
			state.ui?.setStatus?.("Paused", "paused");
			await sleep(250);
		}
	}

	/**
	 * Sleeps for ms, respecting pauses and stops.
	 * @param {number} ms - Milliseconds to sleep.
	 * @param {Object} state - The state object.
	 */
	async function controlledSleep(ms, state) {
		const step = 200;
		const start = Date.now();
		while (Date.now() - start < ms) {
			if (state?.stopRequested) return;
			await waitWhilePaused(state);
			const remaining = ms - (Date.now() - start);
			await sleep(Math.min(step, Math.max(0, remaining)));
		}
	}

	/**
	 * Waits for a value to be truthy.
	 * @param {Function} getValue - Function to get the value.
	 * @param {Object} options - Options for timeout, interval, etc.
	 * @param {number} options.timeoutMs - Timeout in ms.
	 * @param {number} options.intervalMs - Poll interval in ms.
	 * @param {string} [options.label] - Label for logging.
	 * @param {Function} [options.shouldStop] - Function to check if should stop.
	 * @param {Object} [options.pauseState] - State for pausing.
	 * @returns {any} The value or null if timeout.
	 */
	async function waitFor(getValue, { timeoutMs, intervalMs, label, shouldStop, pauseState }) {
		const start = Date.now();
		while (Date.now() - start < timeoutMs) {
			if (shouldStop?.()) return null;
			await waitWhilePaused(pauseState);
			try {
				const val = getValue();
				if (val) return val;
			} catch (e) {
				debug(`waitFor(${label || "value"}) threw:`, e);
			}
			await sleep(intervalMs);
		}
		return null;
	}

	/**
	 * Checks if the current inventory is the user's own.
	 * @returns {boolean} True if own inventory.
	 */
	function isOwnInventory() {
		const accountPulldown = document.querySelector(SELECTORS.ACCOUNT_PULLDOWN);
		const personaNameElem = document.querySelector(SELECTORS.PERSONA_NAME);
		if (!accountPulldown || !personaNameElem) return false;
		const accountName = (accountPulldown.textContent || "").trim();
		const personaName = (personaNameElem.textContent || "").trim();
		return accountName && personaName && accountName === personaName;
	}

	/**
	 * Picks the visible item info div.
	 * @returns {Element|null} The visible item info div.
	 */
	function pickVisibleItemInfoDiv() {
		const itemInfo0 = document.querySelector(SELECTORS.ITEMINFO0);
		const itemInfo1 = document.querySelector(SELECTORS.ITEMINFO1);
		if (itemInfo0 && isVisible(itemInfo0)) return itemInfo0;
		if (itemInfo1 && isVisible(itemInfo1)) return itemInfo1;
		return null;
	}

	/**
	 * Gets the sell button from the item info div.
	 * @param {Element} itemInfoDiv - The item info div.
	 * @returns {Element|null} The sell button.
	 */
	function getSellButton(itemInfoDiv) {
		if (!itemInfoDiv) return null;
		const candidates = Array.from(itemInfoDiv.querySelectorAll(SELECTORS.SELL_BUTTONS_GREEN));
		return candidates.find((btn) => (btn.textContent || "").trim() === "Sell") || null;
	}

	/**
	 * Gets the turn into gems button from the item info div.
	 * @param {Element} itemInfoDiv - The item info div.
	 * @returns {Element|null} The turn into gems button.
	 */
	function getGemsButton(itemInfoDiv) {
		if (!itemInfoDiv) return null;
		const candidates = Array.from(
			itemInfoDiv.querySelectorAll('button[data-accent-color="green"]')
		);
		return (
			candidates.find((btn) => (btn.textContent || "").trim() === "Turn into Gems...") || null
		);
	}

	/**
	 * Extracts the starting at price from text.
	 * @param {string} text - The text to parse.
	 * @returns {string|null} The price string.
	 */
	function extractStartingAtPriceFromText(text) {
		if (!text) return null;
		const match = new RegExp(/Starting at:\s*([$€£¥₽₹₩₺₫₴₦₱]?\s*\d+(?:[.,]\d+)?)/i).exec(text);
		return match ? match[1].replaceAll(/\s+/g, "") : null;
	}

	/**
	 * Finds the starting at price in the item info div.
	 * @param {Element} itemInfoDiv - The item info div.
	 * @returns {string|null} The price.
	 */
	function findStartingAtPrice(itemInfoDiv) {
		if (!itemInfoDiv) return null;
		const marketActionsDiv = itemInfoDiv.querySelector(SELECTORS.MARKET_ACTIONS);
		if (marketActionsDiv) {
			const price = extractStartingAtPriceFromText(marketActionsDiv.textContent || "");
			if (price) return price;
		}
		return extractStartingAtPriceFromText(itemInfoDiv.textContent || "");
	}

	/**
	 * Simulates typing text into an input.
	 * @param {HTMLInputElement} input - The input element.
	 * @param {string} text - The text to type.
	 * @param {Object} [options] - Options.
	 * @param {number} [options.perCharDelayMs=35] - Delay per character.
	 */
	async function simulateTyping(input, text, { perCharDelayMs = 35 } = {}) {
		input.value = "";
		input.dispatchEvent(new Event("input", { bubbles: true }));

		for (const char of text) {
			const codePoint = char.codePointAt(0) ?? 0;
			const eventOptions = {
				bubbles: true,
				cancelable: true,
				key: char,
				char,
				keyCode: codePoint,
			};
			input.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
			input.dispatchEvent(new KeyboardEvent("keypress", eventOptions));
			input.value += char;
			input.dispatchEvent(new Event("input", { bubbles: true }));
			input.dispatchEvent(new KeyboardEvent("keyup", eventOptions));
			await sleep(perCharDelayMs);
		}
		input.dispatchEvent(new Event("change", { bubbles: true }));
	}

	/**
	 * Waits for the sell dialog to be visible.
	 * @param {Function} shouldStop - Function to check if should stop.
	 * @returns {Element|null} The sell dialog element.
	 */
	async function waitForSellDialogVisible(shouldStop) {
		return waitFor(
			() => {
				const dlg = document.querySelector(SELECTORS.SELL_DIALOG);
				return dlg && isVisible(dlg) ? dlg : null;
			},
			{
				timeoutMs: runtimeConfig.SELL_DIALOG_APPEAR_TIMEOUT_MS,
				intervalMs: runtimeConfig.SELL_DIALOG_POLL_INTERVAL_MS,
				label: "sell dialog",
				shouldStop,
			}
		);
	}

	/**
	 * Waits for the modal to close.
	 * @param {Function} shouldStop - Function to check if should stop.
	 * @returns {boolean} True if closed.
	 */
	async function waitForModalToClose(shouldStop) {
		const closed = await waitFor(
			() => {
				const bg = document.querySelector(SELECTORS.MODAL_BACKGROUND);
				if (!bg) return true;
				if (bg?.style?.display === "none") return true;
				return null;
			},
			{
				timeoutMs: runtimeConfig.MODAL_CLOSE_TIMEOUT_MS,
				intervalMs: 250,
				label: "modal close",
				shouldStop,
			}
		);
		return !!closed;
	}

	/**
	 * Gets the error text from the sell dialog.
	 * @returns {string|null} The error text.
	 */
	function getSellDialogErrorText() {
		const errorDiv = document.querySelector(SELECTORS.ERROR_DIV);
		if (!errorDiv) return null;
		if (!isVisible(errorDiv)) return null;
		const text = (errorDiv.textContent || "").trim();
		return text || null;
	}

	/**
	 * Closes the modal if possible.
	 * @param {string} reason - Reason for closing.
	 * @returns {boolean} True if closed.
	 */
	function closeModalIfPossible(reason) {
		const closeBtn = document.querySelector(SELECTORS.MODAL_CLOSE);
		if (closeBtn) {
			closeBtn.click();
			log(`Closed modal manually (${reason}).`);
			return true;
		}
		log(`Could not find modal close button (${reason}).`);
		return false;
	}

	/**
	 * Handles sell dialog errors.
	 * @param {string} errText - The error text.
	 * @param {Object} state - The state object.
	 * @returns {Object} Result with ok, fatal, reason.
	 */
	function handleSellDialogError(errText, state) {
		if (!errText) return { ok: true };
		if (errText.includes("You have too many listings pending confirmation")) {
			log("Too many listings pending confirmation. Stopping script.");
			state.stopRequested = true;
			state.ui?.setStatus?.("Stopped: pending confirmations", "error");
			state.ui?.setLastAction?.("Too many listings pending confirmation");
			state.ui?.update?.();
			return { ok: false, fatal: true, reason: errText };
		}
		warn(`Sell dialog error: ${errText}`);
		closeModalIfPossible(`sell error: ${errText}`);
		return { ok: false, fatal: false, reason: errText };
	}

	/**
	 * Clicks an element if present.
	 * @param {Element} el - The element to click.
	 * @param {Object} [options] - Options.
	 * @param {string} [options.name] - Name for logging.
	 * @param {number} [options.afterMs=0] - Delay after click.
	 * @param {string} [options.missingLevel="warn"] - Log level if missing.
	 * @returns {boolean} True if clicked.
	 */
	async function clickIfPresent(el, { name, afterMs = 0, missingLevel = "warn" } = {}) {
		if (el) {
			el.click();
			debug(`Clicked ${name}.`);
			if (afterMs > 0) await sleep(afterMs);
			return true;
		}
		if (missingLevel === "warn") warn(`${name} not found.`);
		else log(`${name} not found.`);
		return false;
	}

	/**
	 * Checks and sets the SSA checkbox if needed.
	 * @param {Object} state - The state object.
	 */
	async function checkAndSetSSA(state) {
		const ssaCheckbox = document.querySelector(SELECTORS.SSA_CHECKBOX);
		if (ssaCheckbox && !ssaCheckbox.checked) {
			ssaCheckbox.click();
			debug("Checked SSA checkbox.");
		}
	}

	/**
	 * Sets the quantity input to the available amount.
	 * @param {Object} state - The state object.
	 */
	async function setQuantity(state) {
		const quantityInput = document.querySelector(SELECTORS.QUANTITY_INPUT);
		if (quantityInput) {
			const availableSpan = document.querySelector(SELECTORS.QUANTITY_AVAILABLE_AMT);
			if (availableSpan) {
				const availableQty = availableSpan.textContent.trim();
				if (availableQty) {
					debug(`Setting quantity to ${availableQty}`);
					await simulateTyping(quantityInput, availableQty);
				}
			}
		}
	}

	/**
	 * Clicks the accept and OK buttons.
	 * @param {Object} state - The state object.
	 * @returns {Object} Result with ok.
	 */
	async function clickAcceptAndOK(state) {
		const acceptClicked = clickIfPresent(document.querySelector(SELECTORS.ACCEPT_BUTTON), {
			name: "accept button",
			afterMs: runtimeConfig.AFTER_ACCEPT_DELAY_MS,
		});

		if (!acceptClicked) {
			closeModalIfPossible("accept button missing");
			return { ok: false, reason: "Accept button not found" };
		}

		const okClicked = clickIfPresent(document.querySelector(SELECTORS.OK_BUTTON), {
			name: "OK button",
			afterMs: runtimeConfig.AFTER_OK_DELAY_MS,
		});

		if (!okClicked) {
			closeModalIfPossible("OK button missing");
			return { ok: false, reason: "OK button not found" };
		}

		return { ok: true };
	}

	/**
	 * Finalizes the sell flow.
	 * @param {Object} options - Options.
	 * @param {boolean} options.skipPriceInput - Skip price input.
	 * @param {Object} state - The state object.
	 * @returns {Object} Result with ok.
	 */
	async function finalizeSellFlow({ skipPriceInput }, state) {
		if (state.stopRequested) return { ok: false, reason: "Stop requested" };

		await checkAndSetSSA(state);

		await setQuantity(state);

		const clickResult = await clickAcceptAndOK(state);
		if (!clickResult.ok) return clickResult;

		const errText = getSellDialogErrorText();
		const err = handleSellDialogError(errText, state);
		if (!err.ok)
			return { ok: false, reason: err.reason || "Sell dialog error", fatal: !!err.fatal };

		const closed = await waitForModalToClose(() => state.stopRequested);
		if (closed) {
			log(skipPriceInput ? "Listing submitted (SteamDB fallback)." : "Listing submitted.");
		} else {
			warn("Modal background did not hide after OK click (timeout).");
			closeModalIfPossible("modal close timeout");
			return { ok: false, reason: "Modal did not close (timeout)" };
		}

		if (skipPriceInput) {
			debug("Sell flow finished (SteamDB fallback).");
		} else {
			debug("Sell flow finished (normal).");
		}
		return { ok: true };
	}

	/**
	 * Waits before retrying price fetch.
	 * @param {Element} link - The item link.
	 * @param {Object} state - The state object.
	 * @param {number} visibleIndex - Visible index.
	 * @param {number} attempt - Attempt number.
	 */
	async function waitBeforePriceRetry(link, state, visibleIndex, attempt) {
		log(
			`Price not found for visible itemHolder #${visibleIndex}, retrying in ${Math.round(
				runtimeConfig.PRICE_RETRY_WAIT_MS / 1000
			)}s (retry #${attempt + 1} of ${runtimeConfig.PRICE_RETRIES})...`
		);
		await sleep(
			Math.max(0, runtimeConfig.PRICE_RETRY_WAIT_MS - runtimeConfig.PRICE_RELOAD_DELAY_MS)
		);
		if (state.stopRequested) return;
		if (link) link.click();
		await sleep(runtimeConfig.PRICE_RELOAD_DELAY_MS);
	}

	/**
	 * Tries SteamDB quick sell.
	 * @param {Element} itemInfoDiv - The item info div.
	 * @param {Object} state - The state object.
	 * @param {number} visibleIndex - Visible index.
	 * @returns {Object} Result with handled, ok, reason.
	 */
	async function trySteamDbQuickSell(itemInfoDiv, state, visibleIndex) {
		if (!itemInfoDiv) return { handled: false, ok: false };
		if (state.stopRequested) return { handled: true, ok: false, reason: "Stop requested" };

		let candidate = await waitFor(
			() => {
				const buy = itemInfoDiv.querySelector(SELECTORS.STEAMDB_BUY);
				const sell = itemInfoDiv.querySelector(SELECTORS.STEAMDB_SELL);
				return buy || sell;
			},
			{
				timeoutMs: runtimeConfig.STEAMDB_FALLBACK_WAIT_MS * 2,
				intervalMs: 100,
				label: "SteamDB elements",
				shouldStop: () => state.stopRequested,
				pauseState: state,
			}
		);
		if (!candidate) {
			debug(`SteamDB quick sell UI not detected for item #${visibleIndex}.`);
			return { handled: false, ok: false };
		}

		const text = (candidate.textContent || "").trim();
		if (text.includes("There are no active buy orders for this item.")) {
			const sellSummary = itemInfoDiv.querySelector(SELECTORS.STEAMDB_SELL);
			if (sellSummary) candidate = sellSummary;
		}

		const enabled = await waitFor(
			() => (candidate && !candidate.classList.contains("disabled") ? candidate : null),
			{
				timeoutMs: runtimeConfig.STEAMDB_ENABLE_TIMEOUT_MS,
				intervalMs: 500,
				label: "SteamDB quick sell enabled",
				shouldStop: () => state.stopRequested,
				pauseState: state,
			}
		);
		if (!enabled) {
			debug(
				`SteamDB quick sell UI detected but still disabled after timeout for item #${visibleIndex}.`
			);
			return { handled: false, ok: false };
		}

		log(
			`Clicking alternate sell button for visible itemHolder #${visibleIndex} (SteamDB Quick Sell fallback)`
		);

		for (let attempt = 1; attempt <= runtimeConfig.STEAMDB_CLICK_ATTEMPTS; attempt++) {
			if (state.stopRequested) return { handled: true, ok: false, reason: "Stop requested" };
			await waitWhilePaused(state);
			enabled.click();
			debug(`Clicked SteamDB quick sell element (attempt ${attempt}).`);
			const dlg = waitForSellDialogVisible(() => state.stopRequested);
			if (dlg) {
				state.ui?.setLastAction?.(
					`SteamDB Quick Sell → sell dialog (item #${visibleIndex})`
				);
				const result = await finalizeSellFlow({ skipPriceInput: true }, state);
				return { handled: true, ok: !!result.ok, reason: result.reason };
			}
		}

		log("SteamDB fallback element clicked, but sell dialog never appeared.");
		return { handled: false, ok: false };
	}

	/**
	 * Processes via turn into gems flow.
	 * @param {Element} gemsBtn - The turn into gems button.
	 * @param {Object} state - The state object.
	 * @param {number} visibleIndex - Visible index.
	 * @returns {Object} Result with outcome, reason.
	 */
	async function processViaGemsFlow(gemsBtn, state, visibleIndex) {
		log(`Clicking turn into gems button for visible itemHolder #${visibleIndex}`);
		clickIfPresent(gemsBtn, { name: "turn into gems button" });

		const firstOk = await waitFor(
			() => {
				const btn = document.querySelector(".btn_green_steamui.btn_medium span");
				if (btn && btn.textContent.trim() === "OK") return btn.parentElement;
				return null;
			},
			{
				timeoutMs: 5000,
				intervalMs: 100,
				label: "first gems modal",
				shouldStop: () => state.stopRequested,
				pauseState: state,
			}
		);

		if (!firstOk) {
			warn("First gems modal did not appear (timeout).");
			return { outcome: "error", reason: "first gems modal timeout" };
		}

		clickIfPresent(firstOk, { name: "first gems OK" });

		await controlledSleep(500, state);

		const secondOk = await waitFor(
			() => {
				const btn = document.querySelector(".btn_grey_steamui.btn_medium span");
				if (btn && btn.textContent.trim() === "OK") return btn.parentElement;
				return null;
			},
			{
				timeoutMs: 5000,
				intervalMs: 100,
				label: "second gems modal",
				shouldStop: () => state.stopRequested,
				pauseState: state,
			}
		);

		if (!secondOk) {
			warn("Second gems modal did not appear (timeout).");
			return { outcome: "error", reason: "second gems modal timeout" };
		}

		clickIfPresent(secondOk, { name: "second gems OK" });

		log(`Turned item #${visibleIndex} into gems.`);
		return { outcome: "listed" };
	}

	/**
	 * Gets the starting at price with retries.
	 * @param {Element} link - The item link.
	 * @param {Object} state - The state object.
	 * @param {number} visibleIndex - Visible index.
	 * @returns {Object} Result with price, usedFallback, itemInfoDiv.
	 */
	async function getStartingAtPriceWithRetries(link, state, visibleIndex) {
		for (
			let attempt = 0;
			attempt < runtimeConfig.PRICE_RETRIES && !state.stopRequested;
			attempt++
		) {
			await waitWhilePaused(state);
			const itemInfoDiv = pickVisibleItemInfoDiv();

			const price = findStartingAtPrice(itemInfoDiv);
			if (price) {
				log(`Found price for visible itemHolder #${visibleIndex}: ${price}`);
				return { price, usedFallback: false, itemInfoDiv };
			}

			const isLastAttempt = attempt >= runtimeConfig.PRICE_RETRIES - 1;
			if (!isLastAttempt) {
				await waitBeforePriceRetry(link, state, visibleIndex, attempt);
			}
		}
		return { price: null, usedFallback: false, itemInfoDiv: pickVisibleItemInfoDiv() };
	}

	/**
	 * Gets the current inventory container.
	 * @returns {Element|null} The inventory container.
	 */
	function getCurrentInventoryContainer() {
		const inventoriesDiv = document.querySelector(SELECTORS.INVENTORIES);
		if (!inventoriesDiv) {
			warn("No #inventories element found.");
			return null;
		}
		const containers = Array.from(inventoriesDiv.children).filter(
			(el) => el.tagName === "DIV" && isVisible(el)
		);
		if (containers.length === 0) {
			warn("No visible inventory containers found under #inventories.");
			return null;
		}
		if (containers.length > 1) {
			warn(`Multiple visible inventory containers found: ${containers.length}. Stopping.`);
			return null;
		}
		return containers[0];
	}

	/**
	 * Gets the current inventory page element.
	 * @param {Element} [container] - The container.
	 * @returns {Element|null} The page element.
	 */
	function getCurrentInventoryPageElement(container = null) {
		const root = container || document;
		const pages = Array.from(root.querySelectorAll(SELECTORS.INVENTORY_PAGE));
		if (!pages.length) return null;

		const cur = document.querySelector(SELECTORS.PAGE_CURRENT);
		const raw = cur ? (cur.textContent || "").trim() : "";
		const n = raw ? Number.parseInt(raw, 10) : Number.NaN;

		const candidates = [];
		if (!Number.isNaN(n)) {
			candidates.push(n - 1);
		}
		candidates.push(0);

		for (const idx of candidates) {
			if (idx >= 0 && idx < pages.length) {
				const page = pages[idx];
				if (isVisible(page)) {
					return page;
				}
			}
		}
		return pages[0] || null;
	}

	/**
	 * Ensures the inventory is loaded, retrying if there's a load error.
	 * @param {Object} state - The state object.
	 */
	async function ensureInventoryLoaded(state) {
		const retryBtn = document.querySelector("#inventory_load_error_ctn .retry_load_btn");
		if (retryBtn && isVisible(retryBtn)) {
			log("Inventory load error detected. Clicking Try Again...");
			state.ui?.setLastAction?.("Retrying inventory load...");
			retryBtn.click();
			const loaded = await waitFor(
				() => {
					const errorDiv = document.querySelector("#inventory_load_error_ctn > div");
					if (errorDiv && isVisible(errorDiv)) return null;
					const itemHolders = document.querySelectorAll(SELECTORS.ITEM_HOLDER);
					return itemHolders.length > 0 ? true : null;
				},
				{
					timeoutMs: 5000,
					intervalMs: 500,
					label: "inventory load",
					shouldStop: () => state.stopRequested,
					pauseState: state,
				}
			);
			if (!loaded) {
				log("Failed to retry inventory load after timeout.");
				state.ui?.setLastAction?.("Failed to retry inventory load");
			}
		}
	}
	async function ensureMarketableFilter(state) {
		state.ui?.setStatus?.("Preparing (ensuring Marketable filter)…", "running");
		state.ui?.setLastAction?.("Ensuring filters are set");
		log("Ensuring filters are set before starting page processing...");

		const showBtn = document.querySelector(SELECTORS.FILTER_SHOW);
		if (showBtn && isVisible(showBtn)) {
			debug("Clicking filter_tag_show to reveal filters...");
			showBtn.click();
		}

		const filterContainer = document.querySelector(SELECTORS.FILTER_CONTAINER);
		const visibleChildDiv = filterContainer
			? Array.from(filterContainer.children).find(
					(child) => child.tagName === "DIV" && isVisible(child)
			  )
			: null;

		const marketableInput = await waitFor(
			() => visibleChildDiv?.querySelector(SELECTORS.MARKETABLE_INPUT),
			{
				timeoutMs: runtimeConfig.FILTER_WAIT_TIMEOUT_MS,
				intervalMs: runtimeConfig.FILTER_POLL_INTERVAL_MS,
				label: "marketable filter input",
				shouldStop: () => state.stopRequested,
				pauseState: state,
			}
		);

		if (!marketableInput) {
			log("Timed out waiting for marketable filter input.");
			return;
		}

		if (marketableInput.checked) {
			debug("Marketable filter already checked.");
		} else {
			debug("Checking the marketable filter input...");
			marketableInput.click();
			await controlledSleep(runtimeConfig.FILTER_AFTER_TOGGLE_DELAY_MS, state);
		}
	}

	/**
	 * Records a skip.
	 * @param {Object} state - The state object.
	 * @param {number} visibleIndex - Visible index.
	 * @param {string} reason - Reason for skip.
	 */
	function recordSkip(state, visibleIndex, reason) {
		state.stats.itemsSkipped++;
		state.ui?.setLastAction?.(`Skipped item #${visibleIndex}: ${reason}`);
		state.ui?.update?.();
	}

	/**
	 * Records an error on item.
	 * @param {Object} state - The state object.
	 * @param {number} visibleIndex - Visible index.
	 * @param {string} reason - Reason for error.
	 */
	function recordErrorOnItem(state, visibleIndex, reason) {
		state.stats.errors++;
		state.ui?.setLastAction?.(`Error on item #${visibleIndex}: ${reason}`);
		state.ui?.update?.();
	}

	/**
	 * Records a listed item.
	 * @param {Object} state - The state object.
	 * @param {number} visibleIndex - Visible index.
	 * @param {string} [suffix] - Suffix for action.
	 */
	function recordListed(state, visibleIndex, suffix) {
		state.stats.itemsListed++;
		const suffixPart = suffix ? ` (${suffix})` : "";
		state.ui?.setLastAction?.(`Listed item #${visibleIndex}${suffixPart}`);
		state.ui?.update?.();
	}

	/**
	 * Processes via Steam sell flow.
	 * @param {Element} link - The item link.
	 * @param {Object} state - The state object.
	 * @param {number} visibleIndex - Visible index.
	 * @returns {Object} Result with outcome, reason.
	 */
	async function processViaSteamSellFlow(link, state, visibleIndex) {
		const { price, usedFallback, itemInfoDiv } = await getStartingAtPriceWithRetries(
			link,
			state,
			visibleIndex
		);
		if (state.stopRequested) {
			log("Stop requested during price wait. Halting immediately.");
			return { outcome: "stop" };
		}

		if (usedFallback) {
			return { outcome: "error", reason: "Fallback used" };
		}

		if (!price) {
			log(
				`No 'Starting at:' price found for visible itemHolder #${visibleIndex} after retries.`
			);
			return { outcome: "skip", reason: "no “Starting at” price found" };
		}

		const sellBtn = getSellButton(itemInfoDiv);
		if (!sellBtn) {
			warn(
				`No green market action Sell button found for visible itemHolder #${visibleIndex}`
			);
			return { outcome: "skip", reason: "no Sell button" };
		}

		sellBtn.click();
		const dlg = waitForSellDialogVisible(() => state.stopRequested);
		if (!dlg) {
			warn("Sell dialog did not appear (timeout).");
			return { outcome: "error", reason: "sell dialog timeout" };
		}

		const priceInput = document.querySelector(SELECTORS.PRICE_INPUT);
		if (!priceInput) {
			warn("Price input not found.");
			closeModalIfPossible("price input not found");
			return { outcome: "error", reason: "price input not found" };
		}

		debug(`Entering price for item #${visibleIndex}: ${price}`);
		state.ui?.setLastAction?.(`Typing price for item #${visibleIndex}: ${price}`);
		await simulateTyping(priceInput, price);

		const result = await finalizeSellFlow({ skipPriceInput: false }, state);
		if (result.ok) return { outcome: "listed" };
		return { outcome: "error", reason: result.reason || "Listing failed" };
	}

	/**
	 * Tries to turn the item into gems.
	 * @param {Object} state - The state object.
	 * @param {number} visibleIndex - Visible index.
	 * @returns {string} 'continue' or 'restart'
	 */
	async function tryTurnIntoGems(state, visibleIndex) {
		const itemInfoDiv = pickVisibleItemInfoDiv();
		const gemsBtn = getGemsButton(itemInfoDiv);
		if (!gemsBtn) {
			recordSkip(state, visibleIndex, "no gems button");
			return "continue";
		}
		const flow = await processViaGemsFlow(gemsBtn, state, visibleIndex);
		if (flow.outcome === "listed") {
			recordListed(state, visibleIndex, "Turned into Gems");
			return "restart";
		}
		if (flow.outcome === "error") {
			recordErrorOnItem(state, visibleIndex, flow.reason || "gems error");
			return "continue";
		}
		recordSkip(state, visibleIndex, flow.reason || "gems skipped");
		return "continue";
	}

	/**
	 * Tries SteamDB fallback for the item.
	 * @param {Object} state - The state object.
	 * @param {number} visibleIndex - Visible index.
	 * @returns {string|null} 'continue' or null if not handled.
	 */
	async function trySteamDbFallback(state, visibleIndex) {
		const itemInfoDiv = pickVisibleItemInfoDiv();
		const steamDb = await trySteamDbQuickSell(itemInfoDiv, state, visibleIndex);
		if (steamDb.handled) {
			if (steamDb.ok) {
				recordListed(state, visibleIndex, "SteamDB Quick Sell");
			} else {
				recordErrorOnItem(
					state,
					visibleIndex,
					`SteamDB sell failed: ${steamDb.reason || "Unknown error"}`
				);
			}
			return "continue";
		}
		return null;
	}

	/**
	 * Processes a visible item.
	 * @param {Object} params - Parameters.
	 * @param {Element} params.itemHolder - The item holder.
	 * @param {number} params.visibleIndex - Visible index.
	 * @param {number} params.domIndex - DOM index.
	 * @param {Object} state - The state object.
	 * @returns {string} 'continue' or 'restart'
	 */
	async function processVisibleItem({ itemHolder, visibleIndex, domIndex }, state) {
		if (state.stopRequested) return "continue";
		await waitWhilePaused(state);

		state.stats.itemsAttemptedTotal++;
		state.stats.itemsAttemptedThisPage++;
		state.ui?.update?.();

		log(`Processing item ${visibleIndex} (DOM index ${domIndex})...`);
		state.ui?.setLastAction?.(
			`Selecting item #${visibleIndex} (page item ${state.stats.itemsAttemptedThisPage})`
		);

		const link = itemHolder.querySelector(SELECTORS.ITEM_LINK);
		if (!link) {
			log(
				`No inventory_item_link found in visible itemHolder #${visibleIndex} (DOM index ${domIndex})`
			);
			recordSkip(state, visibleIndex, "missing item link");
			return "continue";
		}

		debug(
			`Clicking inventory_item_link in visible itemHolder #${visibleIndex} (DOM index ${domIndex})`
		);
		link.click();
		await controlledSleep(runtimeConfig.ITEM_INFO_UPDATE_DELAY_MS, state);

		if (state.settings.useTurnIntoGems) {
			return await tryTurnIntoGems(state, visibleIndex);
		}

		if (state.settings.useSteamDbFallback) {
			const result = await trySteamDbFallback(state, visibleIndex);
			if (result) return result;
		}

		const flow = await processViaSteamSellFlow(link, state, visibleIndex);
		if (flow.outcome === "stop") return "continue";
		if (flow.outcome === "listed") {
			recordListed(state, visibleIndex);
			return "continue";
		}
		if (flow.outcome === "skip") {
			recordSkip(state, visibleIndex, flow.reason || "skipped");
			return "continue";
		}
		recordErrorOnItem(state, visibleIndex, flow.reason || "error");
		return "continue";
	}

	/**
	 * Restarts page processing after inventory refresh.
	 * @param {Object} state - The state object.
	 * @returns {Object|null} Restart data or null if failed.
	 */
	async function restartPageProcessing(state) {
		await ensureInventoryLoaded(state);
		await ensureMarketableFilter(state);
		const inventoryContainer = getCurrentInventoryContainer();
		if (!inventoryContainer) return null;
		const inventoryPage = getCurrentInventoryPageElement(inventoryContainer);
		if (!inventoryPage) return null;
		const allItemHolders = Array.from(inventoryPage.querySelectorAll(SELECTORS.ITEM_HOLDER));
		const itemHolders = allItemHolders.filter(
			(holder) => !holder.classList.contains("disabled")
		);
		const visibleHolders = itemHolders.filter((h) => isVisible(h));
		const itemsOnPage = Math.min(visibleHolders.length, runtimeConfig.MAX_ITEMS_PER_PAGE);
		log(
			`Restarting page processing after inventory refresh. Found ${itemHolders.length} items.`
		);
		return { inventoryContainer, inventoryPage, itemHolders, visibleHolders, itemsOnPage };
	}

	/**
	 * Processes the current page.
	 * @param {Object} state - The state object.
	 */
	async function processCurrentPage(state) {
		await waitWhilePaused(state);
		await ensureInventoryLoaded(state);
		if (state.stopRequested) return;
		let inventoryContainer = getCurrentInventoryContainer();
		if (!inventoryContainer) {
			error("No valid inventory container found.");
			state.stats.errors++;
			state.ui?.setLastAction?.("Error: could not find current inventory container");
			state.ui?.update?.();
			state.stopRequested = true;
			return;
		}
		let inventoryPage = getCurrentInventoryPageElement(inventoryContainer);
		if (!inventoryPage) {
			error("No inventory_page found in the current inventory container!");
			state.stats.errors++;
			state.ui?.setLastAction?.("Error: could not find current inventory page element");
			state.ui?.update?.();
			return;
		}

		await ensureMarketableFilter(state);

		let allItemHolders = Array.from(inventoryPage.querySelectorAll(SELECTORS.ITEM_HOLDER));
		let itemHolders = allItemHolders.filter((holder) => !holder.classList.contains("disabled"));
		let disabledCount = allItemHolders.length - itemHolders.length;
		const suffix = disabledCount > 0 ? `, ${disabledCount} disabled (empty slots)` : "";
		log(`Found ${itemHolders.length} enabled item holders on current page${suffix}.`);

		state.stats.itemsAttemptedThisPage = 0;
		let visibleHolders = itemHolders.filter((h) => isVisible(h));
		state.stats.itemsOnPage = Math.min(visibleHolders.length, runtimeConfig.MAX_ITEMS_PER_PAGE);
		state.ui?.setLastAction?.(`Found ${itemHolders.length} items on current page`);
		state.ui?.update?.();

		let currentIndex = 0;
		let visibleIndex = 0;
		while (
			currentIndex < itemHolders.length &&
			visibleIndex < runtimeConfig.MAX_ITEMS_PER_PAGE
		) {
			if (state.stopRequested) {
				log("Stop requested. Halting immediately.");
				return;
			}

			await waitWhilePaused(state);

			await ensureInventoryLoaded(state);

			const itemHolder = itemHolders[currentIndex];
			if (!isVisible(itemHolder)) {
				debug(`Skipping itemHolder at DOM index ${currentIndex} (not visible)`);
				currentIndex++;
				continue;
			}

			visibleIndex++;
			const result = await processVisibleItem(
				{ itemHolder, visibleIndex, domIndex: currentIndex },
				state
			);
			if (result === "restart") {
				const restartData = await restartPageProcessing(state);
				if (!restartData) break;
				({ itemHolders, itemsOnPage: state.stats.itemsOnPage } = restartData);
				currentIndex = 0;
				visibleIndex = 0;
				continue;
			}
			currentIndex++;
			await controlledSleep(runtimeConfig.BETWEEN_ITEMS_DELAY_MS, state);
		}
	}

	/**
	 * Processes all pages.
	 * @param {Object} state - The state object.
	 */
	async function processAllPages(state) {
		if (!state.settings.useTurnIntoGems) await ensureMarketableFilter(state);
		let page = 1;
		while (!state.stopRequested) {
			log(`Processing page ${page}...`);
			state.stats.page = page;
			state.ui?.setStatus?.(`Running (page ${page})`, "running");
			state.ui?.setLastAction?.(`Processing page ${page}`);
			state.ui?.update?.();
			await processCurrentPage(state);
			if (state.stopRequested) break;

			if (state.settings.stopAfterPage) {
				log("Stop-after-page is enabled. Stopping after current page.");
				state.stopRequested = true;
				break;
			}

			const nextBtn = document.querySelector(SELECTORS.PAGE_NEXT);
			if (nextBtn && !nextBtn.classList.contains("disabled")) {
				debug("Clicking next page button...");
				nextBtn.click();
				await controlledSleep(runtimeConfig.NEXT_PAGE_DELAY_MS, state);
				page++;
				continue;
			}
			log("No next page or next page button is disabled. Stopping.");
			break;
		}
		log("Pagination loop ended.");
	}

	/**
	 * Creates the control panel.
	 * @param {Object} state - The state object.
	 */
	function createControlPanel(state) {
		const PANEL_ID = "steam-auto-sell-panel";
		const STYLE_ID = "steam-auto-sell-style";
		if (document.getElementById(PANEL_ID)) return;

		state.settings.useSteamDbFallback = !!runtimeConfig.USE_STEAMDB_FALLBACK;
		state.settings.stopAfterPage = readBoolSetting(STORAGE_KEYS.STOP_AFTER_PAGE, false);

		const storedMode = readStringSetting(STORAGE_KEYS.PANEL_MODE, null);
		const modeInitial = storedMode || "open";

		if (!document.getElementById(STYLE_ID)) {
			const style = document.createElement("style");
			style.id = STYLE_ID;
			style.textContent = `
                #steam-auto-sell-panel{
                position:fixed;
                top:12px;
                right:12px;
                width:320px;
                color:#e7e7e7;
                font:12px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;
                z-index:2147483000;
                    transform: translateZ(0);
                }
                #steam-auto-sell-panel *{box-sizing:border-box;}
                #steam-auto-sell-panel .sas-card,
                #steam-auto-sell-panel .sas-fab{
                    will-change: transform, opacity;
                }
                #steam-auto-sell-panel .sas-card{
                background:rgba(18,20,23,.92);
                border:1px solid rgba(255,255,255,.10);
                border-radius:10px;
                box-shadow:0 10px 30px rgba(0,0,0,.35);
                overflow:hidden;
                backdrop-filter:saturate(140%) blur(6px);
                    opacity:0;
                    transform: translateY(-8px) scale(.98);
                    transition: opacity 180ms ease, transform 220ms cubic-bezier(.2,.8,.2,1);
                }
                #steam-auto-sell-panel.sas-mounted .sas-card{
                    opacity:1;
                    transform: translateY(0) scale(1);
                }
                #steam-auto-sell-panel.sas-mode-icon .sas-card{
                    opacity:0;
                    transform: translateY(-8px) scale(.98);
                    pointer-events:none;
                }
                #steam-auto-sell-panel .sas-head{
                display:flex;
                align-items:center;
                justify-content:space-between;
                padding:10px 10px 8px;
                border-bottom:1px solid rgba(255,255,255,.08);
                }
                #steam-auto-sell-panel .sas-title{font-weight:700; letter-spacing:.2px;}
                #steam-auto-sell-panel .sas-sub{opacity:.7; font-weight:500; margin-left:6px;}
                #steam-auto-sell-panel .sas-headbtns{display:flex; gap:6px;}
                #steam-auto-sell-panel .sas-iconbtn{
                width:28px;
                height:26px;
                border-radius:8px;
                border:1px solid rgba(255,255,255,.12);
                background:rgba(255,255,255,.06);
                color:#e7e7e7;
                cursor:pointer;
                    transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
                }
                #steam-auto-sell-panel .sas-iconbtn:hover{background:rgba(255,255,255,.10); border-color:rgba(255,255,255,.18);}
                #steam-auto-sell-panel .sas-iconbtn:active{transform: translateY(1px) scale(.98);}
                #steam-auto-sell-panel .sas-body{padding:10px;}
                #steam-auto-sell-panel .sas-body{
                    max-height:1000px;
                    opacity:1;
                    transform: translateY(0);
                    overflow-y: auto;
                    transition: max-height 220ms ease, opacity 160ms ease, transform 160ms ease, padding 220ms ease;
                }
                #steam-auto-sell-panel .sas-row{display:flex; gap:8px; align-items:center;}
                #steam-auto-sell-panel .sas-row + .sas-row{margin-top:8px;}
                #steam-auto-sell-panel .sas-btn{
                flex:1;
                height:34px;
                border-radius:10px;
                border:1px solid rgba(255,255,255,.12);
                cursor:pointer;
                color:#0b1114;
                font-weight:700;
                    transition: transform 120ms ease, filter 120ms ease, opacity 120ms ease;
                }
                #steam-auto-sell-panel .sas-btn:hover{filter: brightness(1.02);}
                #steam-auto-sell-panel .sas-btn:active{transform: translateY(1px) scale(.99);}
                #steam-auto-sell-panel .sas-btn:disabled{opacity:.55; cursor:not-allowed;}
                #steam-auto-sell-panel .sas-primary{background:linear-gradient(180deg,#7bdc7b,#46b946);}
                #steam-auto-sell-panel .sas-danger{background:linear-gradient(180deg,#ff7b7b,#d84444); color:#0b1114;}
                #steam-auto-sell-panel .sas-secondary{background:rgba(255,255,255,.10); color:#e7e7e7;}
                #steam-auto-sell-panel .sas-meta{
                display:grid;
                grid-template-columns: 1fr 1fr;
                gap:6px 10px;
                padding:8px 0 2px;
                }
                #steam-auto-sell-panel .sas-k{opacity:.65;}
                #steam-auto-sell-panel .sas-v{justify-self:end; font-variant-numeric:tabular-nums;}
                #steam-auto-sell-panel .sas-status{
                margin-top:8px;
                padding:8px 10px;
                border-radius:10px;
                border:1px solid rgba(255,255,255,.10);
                background:rgba(255,255,255,.06);
                }
                #steam-auto-sell-panel .sas-status[data-level="idle"]{border-color:rgba(255,255,255,.10)}
                #steam-auto-sell-panel .sas-status[data-level="running"]{border-color:rgba(123,220,123,.45)}
                #steam-auto-sell-panel .sas-status[data-level="paused"]{border-color:rgba(255,214,102,.45)}
                #steam-auto-sell-panel .sas-status[data-level="error"]{border-color:rgba(255,123,123,.45)}
                #steam-auto-sell-panel .sas-small{opacity:.7; font-size:11px;}
                #steam-auto-sell-panel .sas-toggle{display:flex; align-items:center; justify-content:space-between; gap:10px; padding:6px 0;}
                #steam-auto-sell-panel .sas-toggle label{opacity:.9;}
                #steam-auto-sell-panel .sas-toggle input{transform:scale(1.05);}

                #steam-auto-sell-panel .sas-notice{
                    margin-top:8px;
                    padding:8px 10px;
                    border-radius:10px;
                    border:1px solid rgba(255,214,102,.45);
                    background:rgba(255,214,102,.1);
                    font-size:11px;
                    color:#e7e7e7;
                }

                #steam-auto-sell-panel .sas-config{margin-top:6px;}
                #steam-auto-sell-panel .sas-config summary{cursor:pointer; list-style:none; user-select:none; padding:6px 0; opacity:.9;}
                #steam-auto-sell-panel .sas-config summary::-webkit-details-marker{display:none;}
                #steam-auto-sell-panel .sas-config summary::before{content:"▸"; display:inline-block; width:14px; opacity:.7;}
                #steam-auto-sell-panel .sas-config[open] summary::before{content:"▾";}
                #steam-auto-sell-panel .sas-config-grid{display:grid; grid-template-columns: 1fr 110px; gap:6px 10px; padding:6px 0 0;}
                #steam-auto-sell-panel .sas-config-grid label{opacity:.75; align-self:center;}
                #steam-auto-sell-panel .sas-config-grid input{
                    width:100%;
                    height:28px;
                    border-radius:8px;
                    border:1px solid rgba(255,255,255,.12);
                    background:rgba(255,255,255,.06);
                    color:#e7e7e7;
                    padding:0 8px;
                    font-variant-numeric: tabular-nums;
                }
                #steam-auto-sell-panel .sas-config-actions{display:flex; gap:8px; margin-top:8px;}
                #steam-auto-sell-panel .sas-config-actions .sas-btn{height:30px; border-radius:10px;}

                #steam-auto-sell-panel .sas-fab{
                    position:absolute;
                    top:0;
                    right:0;
                    width:44px;
                    height:44px;
                    border-radius:14px;
                    border:1px solid rgba(255,255,255,.16);
                    background:rgba(18,20,23,.92);
                    box-shadow:0 10px 30px rgba(0,0,0,.35);
                    color:#e7e7e7;
                    cursor:pointer;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-weight:800;
                    letter-spacing:.4px;
                    opacity:0;
                    transform: translateY(-8px) scale(.90);
                    pointer-events:none;
                    transition: opacity 160ms ease, transform 220ms cubic-bezier(.2,.8,.2,1), border-color 160ms ease;
                }
                #steam-auto-sell-panel.sas-mode-icon .sas-fab{
                    opacity:1;
                    transform: translateY(0) scale(1);
                    pointer-events:auto;
                }
                #steam-auto-sell-panel .sas-fab:hover{border-color:rgba(255,255,255,.22);}
                #steam-auto-sell-panel .sas-fab:active{transform: translateY(1px) scale(.98);}
            `.trim();
			document.head.appendChild(style);
		}

		const root = document.createElement("div");
		root.id = PANEL_ID;

		const fab = document.createElement("button");
		fab.className = "sas-fab";
		fab.type = "button";
		fab.title = "Open Auto Sell helper";
		fab.textContent = "AS";

		const card = document.createElement("div");
		card.className = "sas-card";

		const head = document.createElement("div");
		head.className = "sas-head";

		const title = document.createElement("div");
		title.innerHTML = `<span class="sas-title">Auto Sell</span><span class="sas-sub">helper</span>`;

		const headBtns = document.createElement("div");
		headBtns.className = "sas-headbtns";

		const collapseBtn = document.createElement("button");
		collapseBtn.className = "sas-iconbtn";
		collapseBtn.title = "Collapse";
		collapseBtn.textContent = "▴";

		headBtns.appendChild(collapseBtn);

		head.appendChild(title);
		head.appendChild(headBtns);

		const body = document.createElement("div");
		body.className = "sas-body";

		const row1 = document.createElement("div");
		row1.className = "sas-row";

		const startStopBtn = document.createElement("button");
		startStopBtn.className = "sas-btn sas-primary";
		startStopBtn.textContent = "Start";

		const pauseBtn = document.createElement("button");
		pauseBtn.className = "sas-btn sas-secondary";
		pauseBtn.textContent = "Pause";
		pauseBtn.disabled = true;

		row1.appendChild(startStopBtn);
		row1.appendChild(pauseBtn);

		const meta = document.createElement("div");
		meta.className = "sas-meta";
		meta.innerHTML = `
          <div class="sas-k">Page</div><div class="sas-v" data-sas="page">—</div>
          <div class="sas-k">Items (this page)</div><div class="sas-v" data-sas="itemsThisPage">0 / 0</div>
          <div class="sas-k">Attempted (total)</div><div class="sas-v" data-sas="attempted">0</div>
          <div class="sas-k">Listed</div><div class="sas-v" data-sas="listed">0</div>
          <div class="sas-k">Skipped</div><div class="sas-v" data-sas="skipped">0</div>
          <div class="sas-k">Errors</div><div class="sas-v" data-sas="errors">0</div>
          <div class="sas-k">Elapsed</div><div class="sas-v" data-sas="elapsed">00:00</div>
        `.trim();

		const status = document.createElement("div");
		status.className = "sas-status";
		status.dataset.level = "idle";
		status.innerHTML = `
          <div data-sas="statusText">Idle</div>
          <div class="sas-small" data-sas="lastAction">—</div>
        `.trim();

		const toggles = document.createElement("div");
		toggles.innerHTML = `
          <div class="sas-toggle"><label for="sas-toggle-turngems">Turn into Gems</label><input id="sas-toggle-turngems" type="checkbox"></div>
          <div class="sas-toggle"><label for="sas-toggle-steamdb">SteamDB Quick Sell</label><input id="sas-toggle-steamdb" type="checkbox"></div>
          <div class="sas-toggle"><label for="sas-toggle-stopafter">Stop after page</label><input id="sas-toggle-stopafter" type="checkbox"></div>
          <div class="sas-toggle"><label for="sas-toggle-debug">Verbose logs</label><input id="sas-toggle-debug" type="checkbox"></div>
          <div class="sas-small">Hotkeys: Alt+S start/stop • Alt+P pause/resume</div>
        `.trim();

		const notice = document.createElement("div");
		notice.className = "sas-notice";
		notice.textContent =
			"Important: Always check market listing confirmations on mobile to avoid unwanted listings.";

		const configDetails = document.createElement("details");
		configDetails.className = "sas-config";
		const configSummary = document.createElement("summary");
		configSummary.textContent = "Config";
		configDetails.appendChild(configSummary);
		const configGrid = document.createElement("div");
		configGrid.className = "sas-config-grid";
		configDetails.appendChild(configGrid);
		const configActions = document.createElement("div");
		configActions.className = "sas-config-actions";
		const configApplyBtn = document.createElement("button");
		configApplyBtn.type = "button";
		configApplyBtn.className = "sas-btn sas-secondary";
		configApplyBtn.textContent = "Apply";
		const configResetBtn = document.createElement("button");
		configResetBtn.type = "button";
		configResetBtn.className = "sas-btn sas-secondary";
		configResetBtn.textContent = "Reset";
		configActions.appendChild(configApplyBtn);
		configActions.appendChild(configResetBtn);
		configDetails.appendChild(configActions);
		const configNote = document.createElement("div");
		configNote.className = "sas-small";
		configNote.textContent = "Edits apply immediately. Values are clamped to safe ranges.";
		configDetails.appendChild(configNote);

		body.appendChild(row1);
		body.appendChild(meta);
		body.appendChild(status);
		body.appendChild(toggles);
		body.appendChild(notice);
		body.appendChild(configDetails);

		card.appendChild(head);
		card.appendChild(body);
		root.appendChild(fab);
		root.appendChild(card);

		const mount = document.querySelector(SELECTORS.INVENTORY_LOGOS) || document.body;
		mount.appendChild(root);

		const el = {
			root,
			card,
			fab,
			startStopBtn,
			pauseBtn,
			collapseBtn,
			steamDbToggle: toggles.querySelector("#sas-toggle-steamdb"),
			stopAfterToggle: toggles.querySelector("#sas-toggle-stopafter"),
			debugToggle: toggles.querySelector("#sas-toggle-debug"),
			turnGemsToggle: toggles.querySelector("#sas-toggle-turngems"),
			config: {
				details: configDetails,
				grid: configGrid,
				applyBtn: configApplyBtn,
				resetBtn: configResetBtn,
				inputs: {},
			},
			fields: {
				page: meta.querySelector('[data-sas="page"]'),
				itemsThisPage: meta.querySelector('[data-sas="itemsThisPage"]'),
				attempted: meta.querySelector('[data-sas="attempted"]'),
				listed: meta.querySelector('[data-sas="listed"]'),
				skipped: meta.querySelector('[data-sas="skipped"]'),
				errors: meta.querySelector('[data-sas="errors"]'),
				elapsed: meta.querySelector('[data-sas="elapsed"]'),
				statusText: status.querySelector('[data-sas="statusText"]'),
				lastAction: status.querySelector('[data-sas="lastAction"]'),
				statusBox: status,
			},
		};

		const MODES = Object.freeze({
			OPEN: "open",
			ICON: "icon",
		});

		/**
		 * Normalizes the panel mode.
		 * @param {string} mode - The mode to normalize.
		 * @returns {string} The normalized mode.
		 */
		function normalizeMode(mode) {
			if (mode === MODES.OPEN || mode === MODES.ICON) return mode;
			return MODES.OPEN;
		}

		let currentMode = normalizeMode(modeInitial);

		/**
		 * Applies the given mode to the panel.
		 * @param {string} mode - The mode to apply.
		 */
		function applyMode(mode) {
			currentMode = normalizeMode(mode);
			el.root.classList.toggle("sas-mode-icon", currentMode === MODES.ICON);

			if (currentMode === MODES.OPEN) {
				el.collapseBtn.textContent = "▴";
				el.collapseBtn.title = "Collapse to icon";
			} else {
				el.collapseBtn.textContent = "▾";
				el.collapseBtn.title = "Expand";
			}

			writeStringSetting(STORAGE_KEYS.PANEL_MODE, currentMode);
		}

		/**
		 * Returns the next mode in sequence.
		 * @returns {string} The next mode.
		 */
		function nextMode() {
			return currentMode === MODES.OPEN ? MODES.ICON : MODES.OPEN;
		}

		if (el.steamDbToggle) el.steamDbToggle.checked = !!state.settings.useSteamDbFallback;
		if (el.stopAfterToggle) el.stopAfterToggle.checked = !!state.settings.stopAfterPage;
		if (el.debugToggle) el.debugToggle.checked = !!runtimeConfig.DEBUG;
		if (el.turnGemsToggle) el.turnGemsToggle.checked = !!state.settings.useTurnIntoGems;

		const CONFIG_UI_FIELDS = [
			{
				key: "MAX_ITEMS_PER_PAGE",
				label: "Max items / page",
				step: 1,
				tooltip:
					"Maximum number of items to process per inventory page. Higher values may cause rate limiting.",
			},
			{
				key: "ITEM_INFO_UPDATE_DELAY_MS",
				label: "Item info delay (ms)",
				step: 50,
				tooltip:
					"Delay in milliseconds after clicking an item link to wait for the item info panel to load.",
			},
			{
				key: "BETWEEN_ITEMS_DELAY_MS",
				label: "Between items (ms)",
				step: 50,
				tooltip: "Delay in milliseconds between processing each item on the same page.",
			},
			{
				key: "NEXT_PAGE_DELAY_MS",
				label: "Next page delay (ms)",
				step: 50,
				tooltip:
					"Delay in milliseconds after processing a page before moving to the next page.",
			},
			{
				key: "FILTER_WAIT_TIMEOUT_MS",
				label: "Filter wait timeout (ms)",
				step: 50,
				tooltip:
					"Maximum time in milliseconds to wait for the marketable filter input to appear.",
			},
			{
				key: "FILTER_POLL_INTERVAL_MS",
				label: "Filter poll interval (ms)",
				step: 25,
				tooltip: "How often in milliseconds to check if the marketable filter is ready.",
			},
			{
				key: "FILTER_AFTER_TOGGLE_DELAY_MS",
				label: "After filter toggle (ms)",
				step: 50,
				tooltip:
					"Delay in milliseconds after toggling the marketable filter before starting processing.",
			},
			{
				key: "PRICE_RETRIES",
				label: "Price retries",
				step: 1,
				tooltip:
					"Number of times to retry fetching the starting price if it fails initially.",
			},
			{
				key: "PRICE_RELOAD_DELAY_MS",
				label: "Price reload delay (ms)",
				step: 50,
				tooltip:
					"Delay in milliseconds before reloading the item info to retry price fetching.",
			},
			{
				key: "PRICE_RETRY_WAIT_MS",
				label: "Price retry wait (ms)",
				step: 500,
				tooltip: "Total wait time in milliseconds before each price retry attempt.",
			},
			{
				key: "SELL_DIALOG_APPEAR_TIMEOUT_MS",
				label: "Sell dialog timeout (ms)",
				step: 50,
				tooltip:
					"Maximum time in milliseconds to wait for the sell dialog to appear after clicking the sell button.",
			},
			{
				key: "SELL_DIALOG_POLL_INTERVAL_MS",
				label: "Sell dialog poll (ms)",
				step: 25,
				tooltip: "How often in milliseconds to check if the sell dialog is visible.",
			},
			{
				key: "AFTER_ACCEPT_DELAY_MS",
				label: "After Accept delay (ms)",
				step: 25,
				tooltip:
					"Delay in milliseconds after clicking the Accept button in the sell dialog.",
			},
			{
				key: "AFTER_OK_DELAY_MS",
				label: "After OK delay (ms)",
				step: 25,
				tooltip: "Delay in milliseconds after clicking the OK button in the sell dialog.",
			},
			{
				key: "MODAL_CLOSE_TIMEOUT_MS",
				label: "Modal close timeout (ms)",
				step: 250,
				tooltip:
					"Maximum time in milliseconds to wait for the modal to close after confirming the listing.",
			},
			{
				key: "STEAMDB_FALLBACK_WAIT_MS",
				label: "SteamDB wait (ms)",
				step: 50,
				tooltip:
					"Delay in milliseconds to wait for SteamDB elements to appear before attempting quick sell.",
			},
			{
				key: "STEAMDB_ENABLE_TIMEOUT_MS",
				label: "SteamDB enable timeout (ms)",
				step: 250,
				tooltip:
					"Maximum time in milliseconds to wait for the SteamDB quick sell button to become enabled.",
			},
			{
				key: "STEAMDB_CLICK_ATTEMPTS",
				label: "SteamDB click attempts",
				step: 1,
				tooltip: "Number of times to attempt clicking the SteamDB quick sell button.",
			},
		];

		/**
		 * Renders the config editor UI.
		 */
		function renderConfigEditor() {
			el.config.grid.textContent = "";
			for (const f of CONFIG_UI_FIELDS) {
				const rule = CONFIG_SCHEMA[f.key];
				if (!rule) continue;

				const label = document.createElement("label");
				label.textContent = f.label;
				label.htmlFor = `sas-config-${f.key}`;
				label.title = f.tooltip;

				const input = document.createElement("input");
				input.id = `sas-config-${f.key}`;
				input.type = "number";
				input.step = String(f.step ?? 1);
				if (typeof rule.min === "number") input.min = String(rule.min);
				if (typeof rule.max === "number") input.max = String(rule.max);
				input.value = String(runtimeConfig[f.key]);
				input.title = f.tooltip;
				el.config.inputs[f.key] = input;

				el.config.grid.appendChild(label);
				el.config.grid.appendChild(input);
			}
		}

		/**
		 * Syncs the config editor inputs from runtime config.
		 */
		function syncConfigEditorFromRuntime() {
			for (const key of Object.keys(el.config.inputs)) {
				const input = el.config.inputs[key];
				if (!input) continue;
				input.value = String(runtimeConfig[key]);
			}
		}

		renderConfigEditor();

		state.ui = {
			update: () => {
				const s = state.stats;
				el.fields.page.textContent = s.page ? String(s.page) : "—";
				el.fields.itemsThisPage.textContent = `${s.itemsAttemptedThisPage} / ${s.itemsOnPage}`;
				el.fields.attempted.textContent = String(s.itemsAttemptedTotal);
				el.fields.listed.textContent = String(s.itemsListed);
				el.fields.skipped.textContent = String(s.itemsSkipped);
				el.fields.errors.textContent = String(s.errors);
				el.fields.elapsed.textContent = formatDurationMs(
					state.running ? Date.now() - s.startedAtMs : s.elapsedMs
				);

				el.startStopBtn.textContent = state.running ? "Stop" : "Start";
				el.startStopBtn.className =
					"sas-btn " + (state.running ? "sas-danger" : "sas-primary");
				el.pauseBtn.disabled = !state.running;
				el.pauseBtn.textContent = state.paused ? "Resume" : "Pause";
			},
			setStatus: (text, level = "idle") => {
				el.fields.statusText.textContent = text;
				el.fields.statusBox.dataset.level = level;

				if (level === "running") el.fab.style.borderColor = "rgba(123,220,123,.55)";
				else if (level === "paused") el.fab.style.borderColor = "rgba(255,214,102,.55)";
				else if (level === "error") el.fab.style.borderColor = "rgba(255,123,123,.55)";
				else el.fab.style.borderColor = "rgba(255,255,255,.16)";
			},
			setLastAction: (text) => {
				el.fields.lastAction.textContent = text || "—";
			},
		};

		collapseBtn.addEventListener("click", () => applyMode(nextMode()));

		el.fab.addEventListener("click", () => {
			applyMode(MODES.OPEN);
			state.ui?.update?.();
		});

		el.steamDbToggle?.addEventListener("change", () => {
			state.settings.useSteamDbFallback = !!el.steamDbToggle.checked;
			runtimeConfig = normalizeRuntimeConfig({
				...runtimeConfig,
				USE_STEAMDB_FALLBACK: state.settings.useSteamDbFallback,
			});
			persistRuntimeConfigToStorage(runtimeConfig);
			state.ui.setLastAction(
				`SteamDB Quick Sell ${state.settings.useSteamDbFallback ? "enabled" : "disabled"}`
			);
		});
		el.turnGemsToggle?.addEventListener("change", () => {
			state.settings.useTurnIntoGems = !!el.turnGemsToggle.checked;
			runtimeConfig = normalizeRuntimeConfig({
				...runtimeConfig,
				USE_TURN_INTO_GEMS: state.settings.useTurnIntoGems,
			});
			persistRuntimeConfigToStorage(runtimeConfig);
			state.ui.setLastAction(
				`Turn into Gems ${state.settings.useTurnIntoGems ? "enabled" : "disabled"}`
			);
		});
		el.stopAfterToggle?.addEventListener("change", () => {
			state.settings.stopAfterPage = !!el.stopAfterToggle.checked;
			writeBoolSetting(STORAGE_KEYS.STOP_AFTER_PAGE, state.settings.stopAfterPage);
			state.ui.setLastAction(
				`Stop after page ${state.settings.stopAfterPage ? "enabled" : "disabled"}`
			);
		});
		el.debugToggle?.addEventListener("change", () => {
			runtimeConfig = normalizeRuntimeConfig({
				...runtimeConfig,
				DEBUG: !!el.debugToggle.checked,
			});
			persistRuntimeConfigToStorage(runtimeConfig);
			state.ui.setLastAction(`Verbose logs ${runtimeConfig.DEBUG ? "enabled" : "disabled"}`);
		});

		el.config.details.addEventListener("toggle", () => {
			if (el.config.details.open) syncConfigEditorFromRuntime();
		});

		el.config.applyBtn.addEventListener("click", () => {
			const draft = { ...runtimeConfig };
			for (const [key, input] of Object.entries(el.config.inputs)) {
				const rule = CONFIG_SCHEMA[key];
				if (rule?.type !== "int") continue;
				const raw = Number(input.value);
				if (!Number.isFinite(raw)) continue;
				draft[key] = raw;
			}
			runtimeConfig = normalizeRuntimeConfig(draft);
			persistRuntimeConfigToStorage(runtimeConfig);
			syncConfigEditorFromRuntime();
			state.settings.useSteamDbFallback = !!runtimeConfig.USE_STEAMDB_FALLBACK;
			if (el.steamDbToggle) el.steamDbToggle.checked = !!state.settings.useSteamDbFallback;
			if (el.debugToggle) el.debugToggle.checked = !!runtimeConfig.DEBUG;
			state.settings.useTurnIntoGems = !!runtimeConfig.USE_TURN_INTO_GEMS;
			if (el.turnGemsToggle) el.turnGemsToggle.checked = !!state.settings.useTurnIntoGems;
			state.ui.setLastAction(
				state.running ? "Config applied (run will use new values)." : "Config applied."
			);
		});

		el.config.resetBtn.addEventListener("click", () => {
			resetRuntimeConfigToDefaults();
			syncConfigEditorFromRuntime();
			state.settings.useSteamDbFallback = !!runtimeConfig.USE_STEAMDB_FALLBACK;
			if (el.steamDbToggle) el.steamDbToggle.checked = !!state.settings.useSteamDbFallback;
			if (el.debugToggle) el.debugToggle.checked = !!runtimeConfig.DEBUG;
			state.settings.useTurnIntoGems = !!runtimeConfig.USE_TURN_INTO_GEMS;
			if (el.turnGemsToggle) el.turnGemsToggle.checked = !!state.settings.useTurnIntoGems;
			state.ui.setLastAction("Config reset to defaults.");
		});

		startStopBtn.addEventListener("click", () => {
			if (state.running) {
				state.stopRequested = true;
				state.ui.setStatus("Stopping…", "running");
				state.ui.setLastAction("Stop requested by user");
				state.ui.update();
				return;
			}
			void startRun(state);
		});

		pauseBtn.addEventListener("click", () => {
			if (!state.running) return;
			state.paused = !state.paused;
			state.ui.setStatus(
				state.paused ? "Paused" : `Running (page ${state.stats.page || 1})`,
				state.paused ? "paused" : "running"
			);
			state.ui.setLastAction(state.paused ? "Paused by user" : "Resumed by user");
			state.ui.update();
		});

		document.addEventListener(
			"keydown",
			(e) => {
				const t = e.target;
				const tag = String(t?.tagName || "").toLowerCase();
				const isTyping = tag === "input" || tag === "textarea" || !!t?.isContentEditable;
				if (isTyping) return;
				if (!e.altKey) return;
				const key = String(e.key || "").toLowerCase();
				if (key === "s") {
					e.preventDefault();
					startStopBtn.click();
				}
				if (key === "p") {
					e.preventDefault();
					if (!pauseBtn.disabled) pauseBtn.click();
				}
			},
			{ capture: true }
		);

		state.ui.setStatus("Idle", "idle");
		state.ui.setLastAction("Ready");
		applyMode(currentMode);
		state.ui.update();

		globalThis.setTimeout(() => {
			el.root.classList.add("sas-mounted");
		}, 0);

		state.uiTicker = globalThis.setInterval(() => {
			if (!state.ui) return;
			if (!state.running) return;
			state.ui.update();
		}, 1000);
	}

	/**
	 * Formats duration in milliseconds to MM:SS.
	 * @param {number} ms - Milliseconds.
	 * @returns {string} Formatted duration.
	 */
	function formatDurationMs(ms) {
		const totalSec = Math.max(0, Math.floor(ms / 1000));
		const m = Math.floor(totalSec / 60);
		const s = totalSec % 60;
		return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	}

	/**
	 * Starts the run.
	 * @param {Object} state - The state object.
	 */
	async function startRun(state) {
		state.running = true;
		state.stopRequested = false;
		state.paused = false;
		state.stats.startedAtMs = Date.now();
		state.stats.elapsedMs = 0;
		state.stats.page = 0;
		state.stats.itemsOnPage = 0;
		state.stats.itemsAttemptedThisPage = 0;
		state.stats.itemsAttemptedTotal = 0;
		state.stats.itemsListed = 0;
		state.stats.itemsSkipped = 0;
		state.stats.errors = 0;

		state.ui?.setStatus?.("Starting…", "running");
		state.ui?.setLastAction?.("Run started");
		state.ui?.update?.();

		log("Script started.");
		debug("Effective config:", runtimeConfig);
		try {
			await processAllPages(state);
		} catch (e) {
			state.stats.errors++;
			state.ui?.setStatus?.("Error (see console)", "error");
			error("Unhandled error while running script:", e);
		} finally {
			state.running = false;
			state.paused = false;
			state.stats.elapsedMs = Date.now() - state.stats.startedAtMs;

			if (state.stopRequested) {
				state.ui?.setStatus?.("Stopped", "idle");
				state.ui?.setLastAction?.("Stopped");
			} else {
				state.ui?.setStatus?.("Finished", "idle");
				state.ui?.setLastAction?.("Finished");
			}
			state.ui?.update?.();
			log("Script finished.");
		}
	}

	/**
	 * Main entry point.
	 */
	async function main() {
		log("Userscript loaded.");
		runtimeConfig = loadRuntimeConfigFromStorage();
		persistRuntimeConfigToStorage(runtimeConfig);
		const ready = await waitFor(() => (isOwnInventory() ? true : null), {
			timeoutMs: 5000,
			intervalMs: 250,
			label: "own inventory header",
			shouldStop: null,
		});
		if (!ready) {
			debug("Not your inventory (or Steam header not ready). Script will not attach UI.");
			return;
		}

		/** @type {State} */
		const state = {
			running: false,
			paused: false,
			stopRequested: false,
			settings: {
				useSteamDbFallback: runtimeConfig.USE_STEAMDB_FALLBACK,
				stopAfterPage: readBoolSetting(STORAGE_KEYS.STOP_AFTER_PAGE, false),
				useTurnIntoGems: runtimeConfig.USE_TURN_INTO_GEMS,
			},
			stats: {
				startedAtMs: 0,
				elapsedMs: 0,
				page: 0,
				itemsOnPage: 0,
				itemsAttemptedThisPage: 0,
				itemsAttemptedTotal: 0,
				itemsListed: 0,
				itemsSkipped: 0,
				errors: 0,
			},
			ui: null,
			uiTicker: null,
		};

		createControlPanel(state);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			void main();
		});
	} else {
		void main();
	}
})();
