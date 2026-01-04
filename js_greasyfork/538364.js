// ==UserScript==
// @name         Steam Market Auto-Remove Listings
// @description  Adds a button to remove market listings above a user-specified price from last to first page.
// @version      2.0.1
// @author       RLAlpha49
// @namespace    https://github.com/RLAlpha49/Steam-Market-Auto-Remove-Listings-Script
// @license      MIT
// @match        https://steamcommunity.com/market/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538364/Steam%20Market%20Auto-Remove%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/538364/Steam%20Market%20Auto-Remove%20Listings.meta.js
// ==/UserScript==

(function () {
	"use strict";

	/** @const {string} Prefix for all log messages */
	const LOG_PREFIX = "[Steam Auto-Remove Listings]";

	/** @const {Object.<string, string>} Keys used for localStorage */
	const STORAGE_KEYS = Object.freeze({
		THRESHOLD: "steamAutoRemoveListings.threshold.v1",
		PANEL_MODE: "steamAutoRemoveListings.panelMode.v1",
		RUNTIME_CONFIG_JSON: "steamAutoRemoveListings.runtimeConfig.v1",
	});

	/** @const {Object.<string, string>} CSS selectors for DOM elements */
	const SELECTORS = Object.freeze({
		UI_ANCHOR: "#myMarketTabs .pick_and_sell_button",
		LISTINGS_CONTAINER: "#tabContentsMyActiveMarketListingsRows",
		LISTING_ROW: "div[id^='mylisting_']",
		BUYER_PRICE_EXACT: "span[title='This is the price the buyer pays.']",
		BUYER_PRICE_FALLBACK:
			"span.market_listing_price, span.market_listing_price_with_fee, span.market_listing_price_without_fee",
		EDIT_BUTTON:
			"a.item_market_action_button.item_market_action_button_edit.nodisable, a.item_market_action_button.item_market_action_button_edit:not(.disabled)",
		NEXT_BTN: "#tabContentsMyActiveMarketListings_btn_next",
		PREV_BTN: "#tabContentsMyActiveMarketListings_btn_prev",
		REMOVE_DIALOG: "#market_removelisting_dialog",
		REMOVE_ACCEPT: "#market_removelisting_dialog_accept",
	});

	/** @const {Object} Default configuration values */
	const CONFIG = Object.freeze({
		// ===== USER-CONFIGURABLE OPTIONS =====
		/** @type {boolean} Enable debug logging */
		DEBUG: false,
		/** @type {number} Minimum threshold value */
		MIN_THRESHOLD: 0.03,
		// ===== END USER-CONFIGURABLE OPTIONS =====

		/** @type {number} Delay after clicking navigation buttons */
		NAV_AFTER_CLICK_DELAY_MS: 250,
		/** @type {number} Timeout for page changes */
		PAGE_CHANGE_TIMEOUT_MS: 8000,
		/** @type {number} Polling interval for page changes */
		PAGE_CHANGE_POLL_MS: 150,
		/** @type {number} Timeout for remove dialog appearance */
		DIALOG_APPEAR_TIMEOUT_MS: 3000,
		/** @type {number} Polling interval for dialog visibility */
		DIALOG_POLL_MS: 100,
		/** @type {number} Timeout for dialog closing */
		DIALOG_CLOSE_TIMEOUT_MS: 8000,
		/** @type {number} Delay after accepting removal */
		AFTER_ACCEPT_CLICK_DELAY_MS: 250,
		/** @type {number} Delay between removals */
		BETWEEN_REMOVALS_DELAY_MS: 350,
	});

	/** @const {Object.<string, {type: string, min?: number, max?: number}>} Schema for runtime config validation */
	const CONFIG_SCHEMA = Object.freeze({
		DEBUG: { type: "bool" },
		NAV_AFTER_CLICK_DELAY_MS: { type: "int", min: 0, max: 60000 },
		PAGE_CHANGE_TIMEOUT_MS: { type: "int", min: 250, max: 120000 },
		PAGE_CHANGE_POLL_MS: { type: "int", min: 25, max: 5000 },
		DIALOG_APPEAR_TIMEOUT_MS: { type: "int", min: 250, max: 60000 },
		DIALOG_POLL_MS: { type: "int", min: 25, max: 5000 },
		DIALOG_CLOSE_TIMEOUT_MS: { type: "int", min: 250, max: 120000 },
		AFTER_ACCEPT_CLICK_DELAY_MS: { type: "int", min: 0, max: 60000 },
		BETWEEN_REMOVALS_DELAY_MS: { type: "int", min: 0, max: 120000 },
	});

	/** @type {Object} Runtime configuration, modifiable during execution */
	let runtimeConfig = { ...CONFIG };

	/**
	 * Logs a message to the console with the script prefix.
	 * @param {...*} args - Arguments to log.
	 */
	function log(...args) {
		console.log(LOG_PREFIX, ...args);
	}

	/**
	 * Logs a warning message to the console with the script prefix.
	 * @param {...*} args - Arguments to log.
	 */
	function warn(...args) {
		console.warn(`${LOG_PREFIX}[WARN]`, ...args);
	}

	/**
	 * Logs an error message to the console with the script prefix.
	 * @param {...*} args - Arguments to log.
	 */
	function error(...args) {
		console.error(`${LOG_PREFIX}[ERROR]`, ...args);
	}

	/**
	 * Logs a debug message to the console if DEBUG is enabled.
	 * @param {...*} args - Arguments to log.
	 */
	function debug(...args) {
		if (runtimeConfig.DEBUG) console.debug(`${LOG_PREFIX}[DEBUG]`, ...args);
	}

	/**
	 * Sleeps for the specified number of milliseconds.
	 * @param {number} ms - Milliseconds to sleep.
	 * @returns {Promise<void>}
	 */
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Checks if an element is visible.
	 * @param {Element} el - The element to check.
	 * @returns {boolean} True if the element is visible.
	 */
	function isVisible(el) {
		if (!el) return false;
		const style = getComputedStyle(el);
		return style.display !== "none" && style.visibility !== "hidden";
	}

	/**
	 * Reads a string value from localStorage.
	 * @param {string} key - The storage key.
	 * @param {string} defaultValue - Default value if not found.
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
	 * Writes a string value to localStorage.
	 * @param {string} key - The storage key.
	 * @param {string} value - The value to store.
	 */
	function writeStringSetting(key, value) {
		try {
			globalThis.localStorage.setItem(key, String(value));
		} catch {}
	}

	/**
	 * Deletes a key from localStorage.
	 * @param {string} key - The storage key to delete.
	 */
	function deleteSetting(key) {
		try {
			globalThis.localStorage.removeItem(key);
		} catch {}
	}

	/**
	 * Waits for a condition to be true.
	 * @param {Function} getValue - Function that returns the value or null.
	 * @param {Object} [options] - Options for waiting.
	 * @param {number} [options.timeoutMs=5000] - Timeout in milliseconds.
	 * @param {number} [options.intervalMs=150] - Polling interval.
	 * @param {string} [options.label] - Label for debug messages.
	 * @param {Function} [options.shouldStop] - Function to check if should stop.
	 * @param {Object} [options.pauseState] - State for pausing.
	 * @returns {*} The value when condition is met, or null on timeout.
	 */
	async function waitFor(
		getValue,
		{ timeoutMs, intervalMs, label, shouldStop, pauseState } = {}
	) {
		const timeout = Number.isFinite(timeoutMs) ? timeoutMs : 5000;
		const interval = Number.isFinite(intervalMs) ? intervalMs : 150;
		const start = Date.now();
		while (Date.now() - start < timeout) {
			if (shouldStop?.()) return null;
			await waitWhilePaused(pauseState);
			try {
				const v = getValue();
				if (v) return v;
			} catch (e) {
				debug(`waitFor(${label || "value"}) threw:`, e);
			}
			await sleep(interval);
		}
		return null;
	}

	/**
	 * Clamps a number between min and max.
	 * @param {number} n - The number to clamp.
	 * @param {number} [min] - Minimum value.
	 * @param {number} [max] - Maximum value.
	 * @returns {number} The clamped value.
	 */
	function clamp(n, min, max) {
		let out = n;
		if (typeof min === "number") out = Math.max(min, out);
		if (typeof max === "number") out = Math.min(max, out);
		return out;
	}

	/**
	 * Normalizes runtime config from candidate object.
	 * @param {Object} candidate - Candidate config object.
	 * @returns {Object} Normalized config.
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
	 * @param {Object} cfg - Config object.
	 * @returns {Object} Config for storage.
	 */
	function pickRuntimeConfigForStorage(cfg) {
		const out = {};
		for (const key of Object.keys(CONFIG_SCHEMA)) out[key] = cfg[key];
		return out;
	}

	/**
	 * Loads runtime config from storage.
	 * @returns {Object} Loaded config.
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
	 * Persists runtime config to storage.
	 * @param {Object} cfg - Config to persist.
	 */
	function persistRuntimeConfigToStorage(cfg) {
		writeStringSetting(
			STORAGE_KEYS.RUNTIME_CONFIG_JSON,
			JSON.stringify(pickRuntimeConfigForStorage(cfg))
		);
	}

	/**
	 * Resets runtime config to defaults.
	 * @returns {Object} Default config.
	 */
	function resetRuntimeConfigToDefaults() {
		deleteSetting(STORAGE_KEYS.RUNTIME_CONFIG_JSON);
		runtimeConfig = { ...CONFIG };
		persistRuntimeConfigToStorage(runtimeConfig);
		return runtimeConfig;
	}

	/**
	 * Waits while paused.
	 * @param {Object} state - State object.
	 */
	async function waitWhilePaused(state) {
		if (!state) return;
		while (state.paused && !state.stopRequested) {
			state.ui?.setStatus?.("Paused", "paused");
			await sleep(250);
		}
	}

	/**
	 * Sleeps for a controlled duration, respecting pause state.
	 * @param {number} ms - Milliseconds to sleep.
	 * @param {Object} state - State object.
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
	 * Parses a money string to a number.
	 * @param {string} text - Money text.
	 * @returns {number|null} Parsed number or null.
	 */
	function parseMoneyToNumber(text) {
		const raw = String(text || "").trim();
		const match = /\d[\d\s.,]*/.exec(raw);
		if (!match) return null;

		let num = match[0].replaceAll(/\s+/g, "");
		const lastDot = num.lastIndexOf(".");
		const lastComma = num.lastIndexOf(",");

		if (lastDot !== -1 && lastComma !== -1) {
			const decimalIsDot = lastDot > lastComma;
			num = num.replaceAll(decimalIsDot ? "," : ".", "");
			if (!decimalIsDot) num = num.replace(",", ".");
		} else if (lastComma !== -1) {
			num = /,\d{1,2}$/.test(num) ? num.replace(",", ".") : num.replaceAll(",", "");
		} else if (lastDot !== -1) {
			const looksLikeThousands = /\.\d{3}(\.|$)/.test(num) && !/\.\d{1,2}$/.test(num);
			if (looksLikeThousands) num = num.replaceAll(".", "");
		}

		const n = Number.parseFloat(num);
		return Number.isFinite(n) ? n : null;
	}

	/**
	 * Gets the listings container element.
	 * @returns {Element|null} The container element.
	 */
	function getListingsContainer() {
		return document.querySelector(SELECTORS.LISTINGS_CONTAINER);
	}

	/**
	 * Gets listing row elements from container.
	 * @param {Element} container - Container element.
	 * @returns {Element[]} Array of row elements.
	 */
	function getListingRows(container) {
		if (!container) return [];
		return Array.from(container.querySelectorAll(SELECTORS.LISTING_ROW));
	}

	/**
	 * Gets buyer price text from a listing row.
	 * @param {Element} listingRow - Listing row element.
	 * @returns {string|null} Price text or null.
	 */
	function getBuyerPriceText(listingRow) {
		const exact = listingRow.querySelector(SELECTORS.BUYER_PRICE_EXACT);
		if (exact?.textContent) return exact.textContent;
		const fallback = listingRow.querySelector(SELECTORS.BUYER_PRICE_FALLBACK);
		return fallback?.textContent || null;
	}

	/**
	 * Gets a signature for the current page.
	 * @returns {string} Page signature.
	 */
	function getPageSignature() {
		const container = getListingsContainer();
		if (!container) return "";
		const rows = getListingRows(container);
		const first = rows[0]?.id || "";
		const last = rows.at(-1)?.id || "";
		return `${rows.length}:${first}:${last}`;
	}

	/**
	 * Checks if a button is disabled.
	 * @param {Element} btn - Button element.
	 * @returns {boolean} True if disabled.
	 */
	function isDisabledButton(btn) {
		return !btn || btn.classList.contains("disabled");
	}

	/**
	 * Clicks a paginator button and waits for page change.
	 * @param {Element} btn - Button to click.
	 * @param {Object} state - State object.
	 * @param {string} label - Label for logging.
	 * @returns {boolean} True if page changed.
	 */
	async function clickPaginatorAndWait(btn, state, label) {
		if (isDisabledButton(btn)) return false;
		const before = getPageSignature();
		btn.click();
		await controlledSleep(runtimeConfig.NAV_AFTER_CLICK_DELAY_MS, state);
		const changed = await waitFor(
			() => {
				const after = getPageSignature();
				return after && after !== before ? true : null;
			},
			{
				timeoutMs: runtimeConfig.PAGE_CHANGE_TIMEOUT_MS,
				intervalMs: runtimeConfig.PAGE_CHANGE_POLL_MS,
				label: label || "page change",
				shouldStop: () => state.stopRequested,
				pauseState: state,
			}
		);
		if (!changed) debug("Page change wait timed out; continuing anyway.");
		return true;
	}

	/**
	 * Navigates to the last page.
	 * @param {Object} state - State object.
	 */
	async function goToLastPage(state) {
		const nextBtn = document.querySelector(SELECTORS.NEXT_BTN);
		if (!nextBtn) return;

		let safety = 200;
		while (!state.stopRequested && !nextBtn.classList.contains("disabled") && safety-- > 0) {
			await waitWhilePaused(state);
			state.ui?.setStatus?.("Navigating to last page…", "running");
			await clickPaginatorAndWait(nextBtn, state, "next page");
		}
	}

	/**
	 * Waits for the remove dialog to become visible.
	 * @param {Object} state - State object.
	 * @returns {Element|null} Accept button or null.
	 */
	async function waitForRemoveDialogVisible(state) {
		return waitFor(
			() => {
				const dlg = document.querySelector(SELECTORS.REMOVE_DIALOG);
				if (!dlg || !isVisible(dlg)) return null;
				const accept = document.querySelector(SELECTORS.REMOVE_ACCEPT);
				return accept && isVisible(accept) ? accept : null;
			},
			{
				timeoutMs: runtimeConfig.DIALOG_APPEAR_TIMEOUT_MS,
				intervalMs: runtimeConfig.DIALOG_POLL_MS,
				label: "remove dialog",
				shouldStop: () => state.stopRequested,
				pauseState: state,
			}
		);
	}

	/**
	 * Waits for the remove dialog to close.
	 * @param {Object} state - State object.
	 * @returns {boolean} True if closed.
	 */
	async function waitForRemoveDialogClosed(state) {
		const closed = await waitFor(
			() => {
				const dlg = document.querySelector(SELECTORS.REMOVE_DIALOG);
				return !dlg || !isVisible(dlg) ? true : null;
			},
			{
				timeoutMs: runtimeConfig.DIALOG_CLOSE_TIMEOUT_MS,
				intervalMs: 150,
				label: "remove dialog close",
				shouldStop: () => state.stopRequested,
				pauseState: state,
			}
		);
		return !!closed;
	}

	/**
	 * Removes a single listing.
	 * @param {string} listingId - ID of the listing.
	 * @param {Object} state - State object.
	 * @returns {Object} Result with ok and reason.
	 */
	async function removeListing(listingId, state) {
		await waitWhilePaused(state);
		const row = document.getElementById(listingId);
		if (!row) return { ok: false, reason: "listing row not found" };

		const editBtn = row.querySelector(SELECTORS.EDIT_BUTTON);
		if (!editBtn) return { ok: false, reason: "remove/edit button not found" };

		editBtn.click();
		state.ui?.setLastAction?.(`Opened remove dialog for ${listingId}`);

		const acceptBtn = await waitForRemoveDialogVisible(state);
		if (!acceptBtn) return { ok: false, reason: "remove dialog did not appear" };

		acceptBtn.click();
		await controlledSleep(runtimeConfig.AFTER_ACCEPT_CLICK_DELAY_MS, state);

		const closed = await waitForRemoveDialogClosed(state);
		if (!closed) return { ok: false, reason: "remove dialog did not close" };

		await waitFor(() => (document.getElementById(listingId) ? null : true), {
			timeoutMs: runtimeConfig.PAGE_CHANGE_TIMEOUT_MS,
			intervalMs: 150,
			label: "listing removal",
			shouldStop: () => state.stopRequested,
			pauseState: state,
		});

		return { ok: true };
	}

	/**
	 * Processes listings on the current page.
	 * @param {number} threshold - Price threshold.
	 * @param {Object} state - State object.
	 */
	async function processCurrentPage(threshold, state) {
		await waitWhilePaused(state);
		const container = getListingsContainer();
		if (!container) return;
		const rows = getListingRows(container);
		state.stats.scanned += rows.length;

		const candidates = [];
		for (let i = 0; i < rows.length; i++) {
			const row = rows[i];
			const txt = getBuyerPriceText(row);
			const p = parseMoneyToNumber(txt);
			if (typeof p === "number" && p >= threshold) {
				candidates.push({ id: row.id, idx: i, price: p });
			}
		}

		candidates.sort((a, b) => b.idx - a.idx);
		state.stats.matched += candidates.length;
		state.ui?.setLastAction?.(
			candidates.length
				? `Found ${candidates.length} listings above threshold on this page`
				: "No matching listings on this page"
		);

		for (const c of candidates) {
			if (state.stopRequested) return;
			await waitWhilePaused(state);
			state.ui?.setStatus?.(`Removing listings… (${state.stats.removed} removed)`, "running");
			state.ui?.setLastAction?.(`Removing ${c.id} (buyer pays ${c.price})`);
			const res = await removeListing(c.id, state);
			if (res.ok) {
				state.stats.removed++;
			} else {
				state.stats.errors++;
				warn(`Failed to remove ${c.id}: ${res.reason}`);
			}
			state.ui?.update?.();
			await controlledSleep(runtimeConfig.BETWEEN_REMOVALS_DELAY_MS, state);
		}
	}

	/**
	 * Runs the removal process.
	 * @param {number} threshold - Price threshold.
	 * @param {Object} state - State object.
	 * @throws {Error} If elements not found.
	 */
	async function runRemoval(threshold, state) {
		const container = getListingsContainer();
		if (!container) {
			throw new Error(
				"Could not find the Active Listings container. Make sure your listings are visible."
			);
		}

		const nextBtn = document.querySelector(SELECTORS.NEXT_BTN);
		const prevBtn = document.querySelector(SELECTORS.PREV_BTN);
		if (!nextBtn || !prevBtn) {
			debug("Pagination buttons not found; assuming single page.");
		}

		const pageSizeBtn = document.getElementById("my_listing_pagesize_100");
		if (pageSizeBtn) {
			pageSizeBtn.click();
			await controlledSleep(runtimeConfig.NAV_AFTER_CLICK_DELAY_MS + 750, state);
			await waitFor(
				() => getListingsContainer() && getListingRows(getListingsContainer()).length > 0,
				{
					timeoutMs: runtimeConfig.PAGE_CHANGE_TIMEOUT_MS,
					intervalMs: runtimeConfig.PAGE_CHANGE_POLL_MS,
					label: "page size change",
					shouldStop: () => state.stopRequested,
					pauseState: state,
				}
			);
		}

		state.ui?.setStatus?.("Starting…", "running");
		await goToLastPage(state);

		let safety = 250;
		while (!state.stopRequested && safety-- > 0) {
			await waitWhilePaused(state);
			state.stats.pagesProcessed++;
			state.ui?.setStatus?.(
				`Processing page (last → first)… (${state.stats.pagesProcessed})`,
				"running"
			);
			state.ui?.update?.();
			await processCurrentPage(threshold, state);
			if (state.stopRequested) break;
			const moved = await clickPaginatorAndWait(prevBtn, state, "prev page");
			if (!moved) break;
		}
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
	 * Creates the control panel UI.
	 * @param {Object} state - State object.
	 */
	function createControlPanel(state) {
		const PANEL_ID = "steam-auto-remove-panel";
		const STYLE_ID = "steam-auto-remove-style";
		if (document.getElementById(PANEL_ID)) return;

		const storedMode = readStringSetting(STORAGE_KEYS.PANEL_MODE, null);
		const modeInitial = storedMode || "open";

		if (!document.getElementById(STYLE_ID)) {
			const style = document.createElement("style");
			style.id = STYLE_ID;
			style.textContent = `
				#steam-auto-remove-panel{position:fixed;top:12px;right:12px;width:320px;color:#e7e7e7;font:12px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;z-index:2147483000;transform: translateZ(0);}
				#steam-auto-remove-panel *{box-sizing:border-box;}
				#steam-auto-remove-panel .sas-card,#steam-auto-remove-panel .sas-fab{will-change: transform, opacity;}
				#steam-auto-remove-panel .sas-card{background:rgba(18,20,23,.92);border:1px solid rgba(255,255,255,.10);border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.35);overflow:hidden;backdrop-filter:saturate(140%) blur(6px);opacity:0;transform: translateY(-8px) scale(.98);transition: opacity 180ms ease, transform 220ms cubic-bezier(.2,.8,.2,1);}
				#steam-auto-remove-panel.sas-mounted .sas-card{opacity:1;transform: translateY(0) scale(1);}
				#steam-auto-remove-panel.sas-mode-icon .sas-card{opacity:0;transform: translateY(-8px) scale(.98);pointer-events:none;}
				#steam-auto-remove-panel .sas-head{display:flex;align-items:center;justify-content:space-between;padding:10px 10px 8px;border-bottom:1px solid rgba(255,255,255,.08);}
				#steam-auto-remove-panel .sas-title{font-weight:700;letter-spacing:.2px;}
				#steam-auto-remove-panel .sas-sub{opacity:.7;font-weight:500;margin-left:6px;}
				#steam-auto-remove-panel .sas-headbtns{display:flex;gap:6px;}
				#steam-auto-remove-panel .sas-iconbtn{width:28px;height:26px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#e7e7e7;cursor:pointer;transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;}
				#steam-auto-remove-panel .sas-iconbtn:hover{background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.18);}
				#steam-auto-remove-panel .sas-iconbtn:active{transform: translateY(1px) scale(.98);}
				#steam-auto-remove-panel .sas-body{padding:10px;max-height:1000px;opacity:1;transform: translateY(0);overflow-y:auto;transition: max-height 220ms ease, opacity 160ms ease, transform 160ms ease, padding 220ms ease;}
				#steam-auto-remove-panel .sas-row{display:flex;gap:8px;align-items:center;}
				#steam-auto-remove-panel .sas-row + .sas-row{margin-top:8px;}
				#steam-auto-remove-panel .sas-btn{flex:1;height:34px;border-radius:10px;border:1px solid rgba(255,255,255,.12);cursor:pointer;color:#0b1114;font-weight:700;transition: transform 120ms ease, filter 120ms ease, opacity 120ms ease;}
				#steam-auto-remove-panel .sas-btn:hover{filter: brightness(1.02);}
				#steam-auto-remove-panel .sas-btn:active{transform: translateY(1px) scale(.99);}
				#steam-auto-remove-panel .sas-btn:disabled{opacity:.55;cursor:not-allowed;}
				#steam-auto-remove-panel .sas-primary{background:linear-gradient(180deg,#7bdc7b,#46b946);}
				#steam-auto-remove-panel .sas-danger{background:linear-gradient(180deg,#ff7b7b,#d84444);color:#0b1114;}
				#steam-auto-remove-panel .sas-secondary{background:rgba(255,255,255,.10);color:#e7e7e7;}
				#steam-auto-remove-panel .sas-meta{display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;padding:8px 0 2px;}
				#steam-auto-remove-panel .sas-k{opacity:.65;}
				#steam-auto-remove-panel .sas-v{justify-self:end;font-variant-numeric:tabular-nums;}
				#steam-auto-remove-panel .sas-status{margin-top:8px;padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.06);}
				#steam-auto-remove-panel .sas-status[data-level="idle"]{border-color:rgba(255,255,255,.10)}
				#steam-auto-remove-panel .sas-status[data-level="running"]{border-color:rgba(123,220,123,.45)}
				#steam-auto-remove-panel .sas-status[data-level="paused"]{border-color:rgba(255,214,102,.45)}
				#steam-auto-remove-panel .sas-status[data-level="error"]{border-color:rgba(255,123,123,.45)}
				#steam-auto-remove-panel .sas-small{opacity:.7;font-size:11px;}
				#steam-auto-remove-panel .sas-toggle{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 0;}
				#steam-auto-remove-panel .sas-toggle label{opacity:.9;}
				#steam-auto-remove-panel .sas-toggle input{transform:scale(1.05);}
				#steam-auto-remove-panel .sas-config{margin-top:6px;}
				#steam-auto-remove-panel .sas-config summary{cursor:pointer;list-style:none;user-select:none;padding:6px 0;opacity:.9;}
				#steam-auto-remove-panel .sas-config summary::-webkit-details-marker{display:none;}
				#steam-auto-remove-panel .sas-config summary::before{content:"▸";display:inline-block;width:14px;opacity:.7;}
				#steam-auto-remove-panel .sas-config[open] summary::before{content:"▾";}
				#steam-auto-remove-panel .sas-config-grid{display:grid;grid-template-columns:1fr 110px;gap:6px 10px;padding:6px 0 0;}
				#steam-auto-remove-panel .sas-config-grid label{opacity:.75;align-self:center;}
				#steam-auto-remove-panel .sas-config-grid input{width:100%;height:28px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#e7e7e7;padding:0 8px;font-variant-numeric: tabular-nums;}
				#steam-auto-remove-panel .sas-config-actions{display:flex;gap:8px;margin-top:8px;}
				#steam-auto-remove-panel .sas-config-actions .sas-btn{height:30px;border-radius:10px;}
				#steam-auto-remove-panel .sas-fab{position:absolute;top:0;right:0;width:44px;height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(18,20,23,.92);box-shadow:0 10px 30px rgba(0,0,0,.35);color:#e7e7e7;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:800;letter-spacing:.4px;opacity:0;transform: translateY(-8px) scale(.90);pointer-events:none;transition: opacity 160ms ease, transform 220ms cubic-bezier(.2,.8,.2,1), border-color 160ms ease;}
				#steam-auto-remove-panel.sas-mode-icon .sas-fab{opacity:1;transform: translateY(0) scale(1);pointer-events:auto;}
				#steam-auto-remove-panel .sas-fab:hover{border-color:rgba(255,255,255,.22);}
				#steam-auto-remove-panel .sas-fab:active{transform: translateY(1px) scale(.98);}
			`.trim();
			document.head.appendChild(style);
		}

		const root = document.createElement("div");
		root.id = PANEL_ID;
		const fab = document.createElement("button");
		fab.className = "sas-fab";
		fab.type = "button";
		fab.title = "Open Auto Remove helper";
		fab.textContent = "AR";

		const card = document.createElement("div");
		card.className = "sas-card";
		const head = document.createElement("div");
		head.className = "sas-head";
		const title = document.createElement("div");
		title.innerHTML = `<span class="sas-title">Auto Remove</span><span class="sas-sub">helper</span>`;
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

		const row2 = document.createElement("div");
		row2.className = "sas-row";
		row2.style.alignItems = "stretch";
		const threshLabel = document.createElement("div");
		threshLabel.style.flex = "1";
		threshLabel.style.opacity = "0.85";
		threshLabel.style.display = "flex";
		threshLabel.style.alignItems = "center";
		threshLabel.textContent = "Threshold (buyer pays >=)";
		const thresholdInput = document.createElement("input");
		thresholdInput.type = "number";
		thresholdInput.step = "0.01";
		thresholdInput.min = String(CONFIG.MIN_THRESHOLD);
		thresholdInput.style.height = "30px";
		thresholdInput.style.width = "70px";
		thresholdInput.title = "Remove listings where buyer pays more than or equal to this value.";
		thresholdInput.value = String(state.settings.threshold);
		row2.appendChild(threshLabel);
		row2.appendChild(thresholdInput);

		const meta = document.createElement("div");
		meta.className = "sas-meta";
		meta.innerHTML = `
			<div class="sas-k">Pages</div><div class="sas-v" data-sas="pages">0</div>
			<div class="sas-k">Scanned</div><div class="sas-v" data-sas="scanned">0</div>
			<div class="sas-k">Matched</div><div class="sas-v" data-sas="matched">0</div>
			<div class="sas-k">Removed</div><div class="sas-v" data-sas="removed">0</div>
			<div class="sas-k">Errors</div><div class="sas-v" data-sas="errors">0</div>
			<div class="sas-k">Elapsed</div><div class="sas-v" data-sas="elapsed">00:00</div>
		`.trim();

		const status = document.createElement("div");
		status.className = "sas-status";
		status.dataset.level = "idle";
		status.innerHTML = `
			<div data-sas="statusText">Idle</div>
			<div class="sas-small" data-sas="lastAction">Ready</div>
		`.trim();

		const toggles = document.createElement("div");
		toggles.innerHTML = `
			<div class="sas-toggle"><label for="sar-toggle-debug">Verbose logs</label><input id="sar-toggle-debug" type="checkbox"></div>
			<div class="sas-small">Hotkeys: Alt+S start/stop • Alt+P pause/resume</div>
		`.trim();

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
		body.appendChild(row2);
		body.appendChild(meta);
		body.appendChild(status);
		body.appendChild(toggles);
		body.appendChild(configDetails);
		card.appendChild(head);
		card.appendChild(body);
		root.appendChild(fab);
		root.appendChild(card);
		document.body.appendChild(root);

		const el = {
			root,
			fab,
			startStopBtn,
			pauseBtn,
			collapseBtn,
			thresholdInput,
			debugToggle: toggles.querySelector("#sar-toggle-debug"),
			config: {
				details: configDetails,
				grid: configGrid,
				applyBtn: configApplyBtn,
				resetBtn: configResetBtn,
				inputs: {},
			},
			fields: {
				pages: meta.querySelector('[data-sas="pages"]'),
				scanned: meta.querySelector('[data-sas="scanned"]'),
				matched: meta.querySelector('[data-sas="matched"]'),
				removed: meta.querySelector('[data-sas="removed"]'),
				errors: meta.querySelector('[data-sas="errors"]'),
				elapsed: meta.querySelector('[data-sas="elapsed"]'),
				statusText: status.querySelector('[data-sas="statusText"]'),
				lastAction: status.querySelector('[data-sas="lastAction"]'),
				statusBox: status,
			},
		};

		const MODES = Object.freeze({ OPEN: "open", ICON: "icon" });
		function normalizeMode(mode) {
			if (mode === MODES.OPEN || mode === MODES.ICON) return mode;
			return MODES.OPEN;
		}
		let currentMode = normalizeMode(modeInitial);
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
		function nextMode() {
			return currentMode === MODES.OPEN ? MODES.ICON : MODES.OPEN;
		}

		const CONFIG_UI_FIELDS = [
			{
				key: "NAV_AFTER_CLICK_DELAY_MS",
				label: "Nav after click (ms)",
				step: 25,
				tooltip: "Delay after clicking next/prev before checking for page change.",
			},
			{
				key: "PAGE_CHANGE_TIMEOUT_MS",
				label: "Page change timeout (ms)",
				step: 250,
				tooltip: "Max time to wait for page content to change after pagination.",
			},
			{
				key: "PAGE_CHANGE_POLL_MS",
				label: "Page change poll (ms)",
				step: 25,
				tooltip: "How often to check for page change.",
			},
			{
				key: "DIALOG_APPEAR_TIMEOUT_MS",
				label: "Dialog appear timeout (ms)",
				step: 50,
				tooltip: "Max time to wait for remove dialog to appear.",
			},
			{
				key: "DIALOG_POLL_MS",
				label: "Dialog poll (ms)",
				step: 25,
				tooltip: "How often to check remove dialog visibility.",
			},
			{
				key: "DIALOG_CLOSE_TIMEOUT_MS",
				label: "Dialog close timeout (ms)",
				step: 250,
				tooltip: "Max time to wait for dialog to close after accepting.",
			},
			{
				key: "AFTER_ACCEPT_CLICK_DELAY_MS",
				label: "After accept (ms)",
				step: 25,
				tooltip: "Delay after clicking remove dialog accept.",
			},
			{
				key: "BETWEEN_REMOVALS_DELAY_MS",
				label: "Between removals (ms)",
				step: 50,
				tooltip: "Delay between each removal.",
			},
		];

		function renderConfigEditor() {
			el.config.grid.textContent = "";
			for (const f of CONFIG_UI_FIELDS) {
				const rule = CONFIG_SCHEMA[f.key];
				if (!rule) continue;
				const label = document.createElement("label");
				label.textContent = f.label;
				label.htmlFor = `sar-config-${f.key}`;
				label.title = f.tooltip;
				const input = document.createElement("input");
				input.id = `sar-config-${f.key}`;
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
				el.fields.pages.textContent = String(s.pagesProcessed);
				el.fields.scanned.textContent = String(s.scanned);
				el.fields.matched.textContent = String(s.matched);
				el.fields.removed.textContent = String(s.removed);
				el.fields.errors.textContent = String(s.errors);
				el.fields.elapsed.textContent = formatDurationMs(
					state.running ? Date.now() - s.startedAtMs : s.elapsedMs
				);
				el.startStopBtn.textContent = state.running ? "Stop" : "Start";
				el.startStopBtn.className =
					"sas-btn " + (state.running ? "sas-danger" : "sas-primary");
				el.pauseBtn.disabled = !state.running;
				el.pauseBtn.textContent = state.paused ? "Resume" : "Pause";
				el.thresholdInput.disabled = state.running;
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

		if (el.debugToggle) el.debugToggle.checked = !!runtimeConfig.DEBUG;

		el.collapseBtn.addEventListener("click", () => applyMode(nextMode()));
		el.fab.addEventListener("click", () => {
			applyMode(MODES.OPEN);
			state.ui?.update?.();
		});

		el.thresholdInput.addEventListener("change", () => {
			const raw = Number(el.thresholdInput.value);
			const threshold = clamp(
				Number.isFinite(raw) ? raw : CONFIG.MIN_THRESHOLD,
				CONFIG.MIN_THRESHOLD,
				Number.POSITIVE_INFINITY
			);
			state.settings.threshold = threshold;
			writeStringSetting(STORAGE_KEYS.THRESHOLD, String(threshold));
			state.ui?.setLastAction?.(`Threshold set to ${threshold.toFixed(2)}`);
			state.ui?.update?.();
		});

		el.debugToggle?.addEventListener("change", () => {
			runtimeConfig = normalizeRuntimeConfig({
				...runtimeConfig,
				DEBUG: !!el.debugToggle.checked,
			});
			persistRuntimeConfigToStorage(runtimeConfig);
			state.ui?.setLastAction?.(
				`Verbose logs ${runtimeConfig.DEBUG ? "enabled" : "disabled"}`
			);
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
			if (el.debugToggle) el.debugToggle.checked = !!runtimeConfig.DEBUG;
			state.ui?.setLastAction?.(
				state.running ? "Config applied (run will use new values)." : "Config applied."
			);
		});

		el.config.resetBtn.addEventListener("click", () => {
			resetRuntimeConfigToDefaults();
			syncConfigEditorFromRuntime();
			if (el.debugToggle) el.debugToggle.checked = !!runtimeConfig.DEBUG;
			state.ui?.setLastAction?.("Config reset to defaults.");
		});

		el.startStopBtn.addEventListener("click", () => {
			if (state.running) {
				state.stopRequested = true;
				state.ui?.setStatus?.("Stopping…", "running");
				state.ui?.setLastAction?.("Stop requested by user");
				state.ui?.update?.();
				return;
			}
			void startRun(state);
		});

		el.pauseBtn.addEventListener("click", () => {
			if (!state.running) return;
			state.paused = !state.paused;
			state.ui?.setStatus?.(
				state.paused ? "Paused" : "Running…",
				state.paused ? "paused" : "running"
			);
			state.ui?.setLastAction?.(state.paused ? "Paused by user" : "Resumed by user");
			state.ui?.update?.();
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
					el.startStopBtn.click();
				}
				if (key === "p") {
					e.preventDefault();
					if (!el.pauseBtn.disabled) el.pauseBtn.click();
				}
			},
			{ capture: true }
		);

		state.ui.setStatus("Idle", "idle");
		state.ui.setLastAction("Ready");
		applyMode(currentMode);
		state.ui.update();
		globalThis.setTimeout(() => el.root.classList.add("sas-mounted"), 0);
		state.uiTicker = globalThis.setInterval(() => {
			if (!state.ui) return;
			if (!state.running) return;
			state.ui.update();
		}, 1000);
	}

	/**
	 * Starts the removal run.
	 * @param {Object} state - State object.
	 */
	async function startRun(state) {
		const threshold = clamp(
			Number.isFinite(Number(state.settings.threshold))
				? Number(state.settings.threshold)
				: CONFIG.MIN_THRESHOLD,
			CONFIG.MIN_THRESHOLD,
			Number.POSITIVE_INFINITY
		);
		if (!Number.isFinite(threshold) || threshold <= 0) {
			state.ui?.setStatus?.("Invalid threshold", "error");
			state.ui?.setLastAction?.("Enter a valid threshold > 0");
			state.ui?.update?.();
			return;
		}
		writeStringSetting(STORAGE_KEYS.THRESHOLD, String(threshold));

		state.running = true;
		state.stopRequested = false;
		state.paused = false;
		state.stats.startedAtMs = Date.now();
		state.stats.elapsedMs = 0;
		state.stats.pagesProcessed = 0;
		state.stats.scanned = 0;
		state.stats.matched = 0;
		state.stats.removed = 0;
		state.stats.errors = 0;

		state.ui?.setStatus?.("Starting…", "running");
		state.ui?.setLastAction?.(`Run started (threshold ${threshold.toFixed(2)})`);
		state.ui?.update?.();

		log("Run started. Threshold:", threshold);
		debug("Effective config:", runtimeConfig);
		try {
			await runRemoval(threshold, state);
		} catch (e) {
			state.stats.errors++;
			state.ui?.setStatus?.("Error (see console)", "error");
			error("Unhandled error:", e);
		} finally {
			state.running = false;
			state.paused = false;
			state.stats.elapsedMs = Date.now() - state.stats.startedAtMs;
			if (state.stopRequested) {
				state.ui?.setStatus?.("Stopped", "idle");
				state.ui?.setLastAction?.("Stopped");
			} else {
				state.ui?.setStatus?.("Finished", "idle");
				state.ui?.setLastAction?.(
					`Finished. Removed ${state.stats.removed} • Errors ${state.stats.errors}`
				);
			}
			state.ui?.update?.();
			log("Run finished.");
		}
	}

	/**
	 * Main entry point.
	 */
	function main() {
		log("Userscript loaded.");
		runtimeConfig = loadRuntimeConfigFromStorage();
		persistRuntimeConfigToStorage(runtimeConfig);

		const storedThreshold = readStringSetting(
			STORAGE_KEYS.THRESHOLD,
			String(CONFIG.MIN_THRESHOLD)
		);
		const parsedThreshold = Number.parseFloat(storedThreshold);
		const thresholdNum = clamp(
			Number.isFinite(parsedThreshold) ? parsedThreshold : CONFIG.MIN_THRESHOLD,
			CONFIG.MIN_THRESHOLD,
			Number.POSITIVE_INFINITY
		);

		const state = {
			running: false,
			paused: false,
			stopRequested: false,
			settings: { threshold: thresholdNum },
			stats: {
				startedAtMs: 0,
				elapsedMs: 0,
				pagesProcessed: 0,
				scanned: 0,
				matched: 0,
				removed: 0,
				errors: 0,
			},
			ui: null,
			uiTicker: null,
		};

		createControlPanel(state);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", main);
	} else {
		main();
	}
})();
