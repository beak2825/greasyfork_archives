// ==UserScript==
// @name         Torn Price Filler [Market+Bazaar] by Rosti powered by Weav3r.dev
// @namespace    https://github.com/Rosti-dev
// @version      1.0.2
// @description  On "Fill" click on the Item Market or Bazaar, autofills the price with the lowest market price minus $1 (customizable), and shows a price popup.
// @author       Rosti
// @license      MIT License
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @connect      weav3r.dev
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/541451/Torn%20Price%20Filler%20%5BMarket%2BBazaar%5D%20by%20Rosti%20powered%20by%20Weav3rdev.user.js
// @updateURL https://update.greasyfork.org/scripts/541451/Torn%20Price%20Filler%20%5BMarket%2BBazaar%5D%20by%20Rosti%20powered%20by%20Weav3rdev.meta.js
// ==/UserScript==

//Credits:
// -Silmaril [2665762] for the Bazaar filler script and the Item Market Price filler (MIT License)
// -Weav3r for providing the Bazaar lisitings API (Without API keys)
// -Chedburn for absolutely making the user experience worse by a huge margin due to his "vision" forcing people to use scripts or burn 5% of every purchase.

/*
 * v1.0.2 (2025-01-24):
 * - Fixed: Torn Browser popup warning now have 30-second cooldown to prevent spam on mobile
 *
 * v1.0.1 (2025-01-24):
 * - Fixed: Anomaly highlighting now only affects the column where anomaly was detected
 * - Fixed: Native Torn warnings now shown as browser alerts (not lost when popup closes)
 *
 * v1.0.0 (2025-01-24):
 * - Context-aware anomaly warnings (Bazaar vs Item Market specific)
 * - Dynamic percentage display in warnings (shows actual threshold used)
 * - Scrollable popup with ~320px height (~4 listings visible)
 * - Enhanced footer styling (light/dark mode aware)
 * - Native Torn warning detection (underprice alerts captured)
 * - No auto-close when warnings present (user must dismiss manually)
 * - Consolidated warning display (single alert for all warnings)
 * - Cross-market anomaly detection (50% threshold)
 * - Internal same-market anomaly detection (70% threshold)
 * - API retry with exponential backoff (3x)
 * - Response caching (60s TTL)
 * - Visual warnings (RED anomalous, YELLOW empty inputs)
 * - Manual cache refresh button
 * - Debug logging for Weav3r API
 * - Rapid button press detection (3x in 10s clears cache)
 * - Automatic cache cleanup (5min intervals)
 */

(async function() {
	'use strict';

	// --- SHARED CONFIGURATION AND STATE ---
	const itemUrl = "https://api.torn.com/torn/{itemId}?selections=items&key={apiKey}&comment=PriceFiller";
	const marketUrlV2 = "https://api.torn.com/v2/market?id={itemId}&selections=itemMarket&key={apiKey}&comment=PriceFiller";
	const bazaarUrl = "https://weav3r.dev/api/marketplace/{itemId}";

	const CONFIG = {
		// Anomaly Detection
		anomalyThresholdInternal: 0.70,     // must be higher than ThresholdCross
		anomalyThresholdCross: 0.50,        // Comparison across markets
		anomalyMinPrice: 10000,             // $10,000 - only check above this price
		anomalyCompareCount: 3,             // Next 3 listings to average
		anomalyColor: '#e74c3c',            // Red for bad listings

		// API Retry
		maxRetries: 3,
		retryDelays: [500, 1000, 2000],

		// Caching
		enableCaching: true,
		cacheTTLSeconds: 60,

		// UI
		maxListingsPerSource: 20,
		highlightAnomalousInputs: true,
		warningColor: '#f1c40f',            // Yellow/amber

		// Debug
		debug: false,  // Set to true for console logging
	};

	// To customize: Open browser console, type `CONFIG.anomalyThresholdCross = 0.40;`

	let priceDeltaRaw = GM_getValue("rosti-torn-price-filler-price-delta", '-1[0]');
	let apiKey; // Will be set by checkApiKey() before use
	let showPricesPopup = GM_getValue("rosti-torn-price-filler-show-prices-popup", true);
	let keepPopupOpen = localStorage.getItem("rosti-torn-price-filler-keep-popup-open") === 'true';

	let recentFilledInput = null;
	let popupOffsetX = localStorage.getItem("rosti-torn-price-filler-popup-offset-x") ?? 0;
	let popupOffsetY = 0;
	let isDragging = false;
	let startX, startY;
	let closePopupTimer = null;
	let refreshInterval = null;

	// Price cache and button press tracking
	const priceCache = new Map(); // { "torn-{itemId}": { data, timestamp } }
	let lastPressTime = 0;
	let pressCount = 0;

	const LOADING_THE_PRICES = 'Loading the prices...';

	// --- SHARED UTILITIES ---

	function setReactInputValue(input, value) {
		const previousValue = input.value;
		input.value = value;
		const tracker = input._valueTracker;
		if (tracker) {
			tracker.setValue(previousValue);
		}
		const event = new Event('input', { bubbles: true });
		input.dispatchEvent(event);
	}

	const RateLimiter = {
		requestQueue: [],
		maxRequests: 60,
		interval: 60 * 1000,
		async processRequest(requestFn) {
			const now = Date.now();
			this.requestQueue = this.requestQueue.filter(timestamp => now - timestamp < this.interval);
			if (this.requestQueue.length >= this.maxRequests) {
				const oldestRequest = this.requestQueue[0];
				const timeToWait = this.interval - (now - oldestRequest);
				console.warn(`[PriceFiller] Rate limit reached. Waiting ${timeToWait}ms.`);
				await new Promise(resolve => setTimeout(resolve, timeToWait + 100));
				return this.processRequest(requestFn);
			}
			this.requestQueue.push(Date.now());
			return requestFn();
		}
	};

	function GM_addStyle_TornPDA(s) {
		let style = document.createElement("style");
		style.type = "text/css";
		style.innerHTML = s;
		document.head.appendChild(style);
	};

	class StringBuilder {
		constructor() { this.parts = []; }
		append(str) { this.parts.push(str); return this; }
		toString() { return this.parts.join(''); }
	}

	function formatNumberWithCommas(number) {
		return new Intl.NumberFormat('en-US').format(number);
	}

	function performOperation(number, operation) {
		const match = operation.match(/^([-+]?)(\d+(?:\.\d+)?)(%)?$/);
		if (!match) throw new Error('Invalid operation string');
		const [, operator, operand, isPercentage] = match;
		const operandValue = parseFloat(operand);
		const adjustedOperand = isPercentage ? (number * operandValue) / 100 : operandValue;
		switch (operator) {
			case '+': return number + adjustedOperand;
			case '-': return number - adjustedOperand;
			default: return number + adjustedOperand;
		}
	}

	function findParentByCondition(element, conditionFn) {
		let currentElement = element;
		while (currentElement) {
			if (conditionFn(currentElement)) return currentElement;
			currentElement = currentElement.parentElement;
		}
		return null;
	}

	function getApiKey() {
		const keySources = [
			'tornpda_api_key',
			'rosti-torn-price-filler'
		];
		for (const key of keySources) {
			const value = localStorage.getItem(key);
			if (value) return value;
		}
		return null;
	}

	function checkApiKey() {
		apiKey = getApiKey();
		if (!apiKey || apiKey.length !== 16) {
			let userInput = prompt("Please enter a PUBLIC Torn API Key:");
			if (userInput && userInput.length === 16) {
				apiKey = userInput;
				localStorage.setItem("rosti-torn-price-filler", userInput);
			} else {
				alert("Invalid API Key. Please provide a valid 16-character key.");
				return false;
			}
		}
		return true;
	}

	function forceNewApiKey() {
		let userInput = prompt("Your Torn API key seems to be invalid. Please enter a new PUBLIC Torn API key:");
		if (userInput && userInput.length === 16) {
			apiKey = userInput;
			localStorage.setItem("rosti-torn-price-filler", userInput);
			alert("New API key saved. Retrying price fetch...");
			return true;
		} else if (userInput) {
			alert("Invalid API Key. Must be 16 characters long. The old key will be used for now.");
		}
		return false;
	}

	// --- API CALLS ---

	function makeRequest(options) {
		if (typeof GM_xmlhttpRequest !== 'undefined') {
			return GM_xmlhttpRequest(options);
		} else if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest !== 'undefined') {
			return GM.xmlHttpRequest(options);
		} else {
			console.error('[PriceFiller] Neither GM_xmlhttpRequest nor GM.xmlHttpRequest are available');
			if (options.onerror) {
				options.onerror(new Error('XMLHttpRequest API not available'));
			}
			return null;
		}
	}

	async function fetchWithRetry(fetchFn, source, maxRetries = CONFIG.maxRetries) {
		let lastError;
		for (let attempt = 0; attempt < maxRetries; attempt++) {
			try {
				return await fetchFn();
			} catch (error) {
				lastError = error;
				console.warn(`[PriceFiller] ${source} API attempt ${attempt + 1}/${maxRetries} failed:`, error.message);
				if (attempt < maxRetries - 1) {
					const delay = CONFIG.retryDelays[attempt] || CONFIG.retryDelays[CONFIG.retryDelays.length - 1];
					await new Promise(resolve => setTimeout(resolve, delay));
				}
			}
		}
		console.error(`[PriceFiller] ${source} API failed after ${maxRetries} attempts`);
		throw lastError;
	}

	function getCachedPrices(source, itemId) {
		if (!CONFIG.enableCaching) return null;
		const cacheKey = `${source}-${itemId}`;
		const cached = priceCache.get(cacheKey);
		if (!cached) return null;
		if (Date.now() - cached.timestamp > CONFIG.cacheTTLSeconds * 1000) {
			priceCache.delete(cacheKey);
			return null;
		}
		return cached.data;
	}

	function setCachedPrices(source, itemId, data) {
		if (!CONFIG.enableCaching) return;
		const cacheKey = `${source}-${itemId}`;
		priceCache.set(cacheKey, { data, timestamp: Date.now() });
	}

	async function GetPrices(itemId) {
		// Check cache first
		const cached = getCachedPrices('torn', itemId);
		if (cached) {
			console.log(`[PriceFiller] Using cached Torn data for item ${itemId}`);
			return cached;
		}

		if (!apiKey) {
			if (!checkApiKey()) return [];
		}

		let requestUrl = priceDeltaRaw.includes('[market]') ? itemUrl : marketUrlV2;
		requestUrl = requestUrl.replace("{itemId}", itemId).replace("{apiKey}", apiKey);

		try {
			const response = await fetchWithRetry(() => fetch(requestUrl), 'Torn');
			const data = await response.json();

			if (data.error) {
				console.error("[PriceFiller] Torn API error:", data.error.error);
				if (forceNewApiKey()) {
					return GetPrices(itemId); // Retry with the new key
				} else {
					throw new Error("Invalid or missing API key.");
				}
			}

			let result;
			if (priceDeltaRaw.includes('[market]')) {
				if (data.items && data.items[itemId]) {
					result = [{ "price": data.items[itemId].market_value, "amount": 1 }];
				} else {
					console.error("[PriceFiller] Torn API did not return market value for item:", itemId);
					result = [];
				}
			} else {
				result = data.itemmarket?.listings || [];
			}

			// Cache the result
			setCachedPrices('torn', itemId, result);
			return result;
		} catch (error) {
			console.error("[PriceFiller] Network error during Torn API fetch:", error);
			throw error;
		}
	}

	async function GetBazaarPrices(itemId) {
		// Check cache first
		const cached = getCachedPrices('weav3r', itemId);
		if (cached) {
			console.log(`[PriceFiller] Using cached Weav3r data for item ${itemId}`);
			return cached;
		}

		return RateLimiter.processRequest(() => new Promise((resolve, reject) => {
			const url = bazaarUrl.replace('{itemId}', itemId);
			makeRequest({
				method: "GET",
				url: url,
				onload: function(response) {
					if (CONFIG.debug) {
						console.log(`[PriceFiller DEBUG] Weav3r API Call:`, url);
						console.log(`[PriceFiller DEBUG] Weav3r Response:`, response.responseText);
					}
					try {
						if (response.status !== 200) {
							throw new Error(`Bazaar API returned status ${response.status}`);
						}
						const data = JSON.parse(response.responseText);
						const result = data?.listings?.map(l => ({ price: l.price, amount: l.quantity })) || [];
						const hasData = result && result.length > 0;
						if (CONFIG.debug) {
							console.log(`[PriceFiller DEBUG] Price info provided: ${hasData}`);
							console.log(`[PriceFiller DEBUG] Listings count: ${result.length}`);
						}
						// Cache the result
						setCachedPrices('weav3r', itemId, result);
						resolve(result);
					} catch (e) {
						console.error("[PriceFiller] Error parsing bazaar data:", e);
						reject(e);
					}
				},
				onerror: function(error) {
					console.error("[PriceFiller] Error fetching bazaar data:", error);
					reject(error);
				}
			});
		}));
	}

	// --- ANOMALY DETECTION ---

	function detectAnomaly(marketResult, bazaarResult, currentPage) {
		// Returns: { isAnomaly: boolean, anomalyReason: string, anomalousListingIndex: number, source: string, thresholdPercent: number }

		const extractPrices = (result) => {
			if (result.status !== 'fulfilled' || !result.value || result.value.length === 0) return null;
			return result.value;
		};

		const marketPrices = extractPrices(marketResult);
		const bazaarPrices = extractPrices(bazaarResult);

		if (!marketPrices || !bazaarPrices) return { isAnomaly: false };

		// Add null check for price properties
		if (!marketPrices[0]?.price || !bazaarPrices[0]?.price) return { isAnomaly: false };

		const marketCheapest = marketPrices[0].price;
		const bazaarCheapest = bazaarPrices[0].price;

		// Check minimum price threshold (skip if BOTH < $10,000)
		if (marketCheapest < CONFIG.anomalyMinPrice && bazaarCheapest < CONFIG.anomalyMinPrice) {
			return { isAnomaly: false };
		}

		// Cross-market comparison (50% threshold)
		if (bazaarCheapest < marketCheapest * CONFIG.anomalyThresholdCross) {
			return {
				isAnomaly: true,
				anomalyReason: 'Bazaar price < 50% of Item Market',
				anomalousListingIndex: 0,
				source: 'bazaar',
				thresholdPercent: CONFIG.anomalyThresholdCross
			};
		}
		if (marketCheapest < bazaarCheapest * CONFIG.anomalyThresholdCross) {
			return {
				isAnomaly: true,
				anomalyReason: 'Item Market price < 50% of Bazaar',
				anomalousListingIndex: 0,
				source: 'item-market',
				thresholdPercent: CONFIG.anomalyThresholdCross
			};
		}

		// Internal same-market comparison (70% threshold)
		const pricesToCheck = currentPage === 'bazaar' ? bazaarPrices : marketPrices;
		if (pricesToCheck.length >= 2) {
			const cheapest = pricesToCheck[0].price;
			const nextPrices = pricesToCheck.slice(1, 1 + CONFIG.anomalyCompareCount);
			const avgNext = nextPrices.reduce((sum, p) => sum + p.price, 0) / nextPrices.length;

			if (cheapest < avgNext * CONFIG.anomalyThresholdInternal) {
				return {
					isAnomaly: true,
					anomalyReason: 'Cheapest < 70% of next 3 listings',
					anomalousListingIndex: 0,
					source: currentPage,
					thresholdPercent: CONFIG.anomalyThresholdInternal
				};
			}
		}

		return { isAnomaly: false };
	}

	// --- NATIVE TORN WARNING DETECTION ---

	const nativeWarnings = new Set();
	const lastShownWarnings = new Map(); // Tracks when each warning was last shown
	const WARNING_COOLDOWN_MS = 30000; // 30 seconds
	let domWarningObserver = null;
	let lastPopupContent = '';
	let lastItemId = null;

	function detectNativeTornWarnings() {
		// Hook window.alert for any alert-based warnings
		const originalAlert = window.alert;
		window.alert = function(message) {
			const isPricingWarning = message &&
				(message.includes('under') || message.includes('low') ||
				 message.includes('price') || message.includes('value') ||
				 message.includes('worth') || message.includes('estimated'));

			if (isPricingWarning) {
				nativeWarnings.add(message);
				console.log('[PriceFiller] Native Torn warning detected (alert):', message);
			}

			originalAlert.call(window, message);
		};

		// Watch for DOM-based warnings (Torn displays warnings inline, not via alert)
		domWarningObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node.nodeType === Node.ELEMENT_NODE) {
						// Check for warning div with class "t-red"
						const warningDiv = node.classList?.contains('t-red') ? node : node.querySelector?.('.t-red');
						if (warningDiv) {
							const text = warningDiv.textContent;
							if (text && (text.includes('worth') || text.includes('estimated'))) {
								// Extract the full warning message
								const warningMessage = text.trim();
								if (!nativeWarnings.has(warningMessage)) {
									nativeWarnings.add(warningMessage);
									console.log('[PriceFiller] Native Torn warning detected (DOM):', warningMessage);
									showNativeWarningsAsAlerts();
								}
							}
						}
					}
				}
			}
		});

		// Also check for existing warnings on page load
		setTimeout(() => {
			const existingWarnings = document.querySelectorAll('.t-red');
			existingWarnings.forEach(warningDiv => {
				const text = warningDiv.textContent;
				if (text && (text.includes('worth') || text.includes('estimated'))) {
					const warningMessage = text.trim();
					if (!nativeWarnings.has(warningMessage)) {
						nativeWarnings.add(warningMessage);
						console.log('[PriceFiller] Native Torn warning detected (existing):', warningMessage);
						showNativeWarningsAsAlerts();
					}
				}
			});
		}, 100);

		// Start observing the document for changes
		domWarningObserver.observe(document.body, { childList: true, subtree: true });
	}

	function showNativeWarningsAsAlerts() {
		const now = Date.now();
		const warningsToShow = [];

		// Check which warnings haven't been shown in the last 30 seconds
		nativeWarnings.forEach(warning => {
			const lastShown = lastShownWarnings.get(warning) || 0;
			if (now - lastShown > WARNING_COOLDOWN_MS) {
				warningsToShow.push(warning);
				lastShownWarnings.set(warning, now);
			}
		});

		// Show each warning as a browser alert (only those not shown recently)
		if (warningsToShow.length > 0) {
			warningsToShow.forEach((warning, index) => {
				// Use setTimeout to avoid blocking, stagger alerts slightly
				setTimeout(() => {
					alert(`⚠️ Torn Pricing Warning:\n\n${warning}`);
				}, index * 150);
			});
		}

		// Clear the Set to prevent duplicates (warnings are tracked in lastShownWarnings Map)
		nativeWarnings.clear();
	}

	function getNativeWarningsHTML() {
		if (nativeWarnings.size === 0) return '';

		let warningsHTML = '<div style="margin-top: 8px; padding: 8px; background: #ffebee; border: 1px solid #f44336; border-radius: 4px; color: #c62828; font-size: 0.85em;">';
		warningsHTML += '<strong>⚠️ Torn Pricing Warnings:</strong><ul style="margin: 5px 0 0 20px; padding: 0;">';

		nativeWarnings.forEach(warning => {
			warningsHTML += `<li>${warning}</li>`;
		});

		warningsHTML += '</ul></div>';
		return warningsHTML;
	}

	function clearNativeWarnings() {
		nativeWarnings.clear();
		lastShownWarnings.clear(); // Reset cooldown tracking for new item
	}

	// --- POPUP UI ---

	function addCustomFillPopup() {
		const popup = document.createElement('div');
		popup.className = 'rosti-price-filler-popup';
		popup.style.display = 'none';
		popup.innerHTML = `
			<div class="rosti-price-filler-popup-close" title="Close">&times;</div>
			<b class="rosti-price-filler-popup-draggable" style="cursor: move; user-select: none;">Drag from here</b>
			<div class="rosti-price-filler-popup-body" style="margin-top: 2px;"></div>
			<div class="rosti-price-filler-popup-footer">
				<div class="rosti-price-filler-footer-controls">
					<input type="checkbox" id="rosti-price-filler-keep-open" />
					<label for="rosti-price-filler-keep-open">Keep open</label>
					<button id="rosti-price-filler-refresh-cache">Refresh</button>
				</div>
			</div>
		`;
		popup.querySelector('.rosti-price-filler-popup-close').onclick = hideAllFillPopups;
		document.body.appendChild(popup);

		const dragHandle = popup.querySelector('.rosti-price-filler-popup-draggable');

		const startDrag = (e) => {
			isDragging = true;
			const clientX = e.clientX || e.touches[0].clientX;
			const clientY = e.clientY || e.touches[0].clientY;
			startX = clientX - popup.offsetLeft;
			startY = clientY - popup.offsetTop;
			e.preventDefault();
		};

		const drag = (e) => {
			if (isDragging) {
				const clientX = e.clientX || e.touches[0].clientX;
				const clientY = e.clientY || e.touches[0].clientY;
				popup.style.left = (clientX - startX) + "px";
				popup.style.top = (clientY - startY) + "px";
			}
		};

		const endDrag = () => {
			if (isDragging) {
				isDragging = false;
				localStorage.setItem("rosti-torn-price-filler-popup-offset-x", popup.style.left);
				localStorage.setItem("rosti-torn-price-filler-popup-offset-y", popup.style.top);
			}
		};

		dragHandle.addEventListener("mousedown", startDrag);
		document.addEventListener("mousemove", drag);
		document.addEventListener("mouseup", endDrag);

		dragHandle.addEventListener("touchstart", startDrag);
		document.addEventListener("touchmove", drag);
		document.addEventListener("touchend", endDrag);
	}


	function showCustomFillPopup(contentHTML, itemId) {
		const popup = document.querySelector('.rosti-price-filler-popup');

		// Store content and item ID for DOM warning observer updates
		lastPopupContent = contentHTML;
		lastItemId = itemId;

		popup.querySelector('.rosti-price-filler-popup-body').innerHTML = contentHTML;
		popup.querySelectorAll('.rosti-price-filler-popup-price').forEach(row => {
			row.addEventListener('click', (e) => {
				if (recentFilledInput) {
					const price = parseInt(e.target.getAttribute('data-price')) - 1;
					recentFilledInput.forEach(x => setReactInputValue(x, price));
				}
			});
		});

		// Setup refresh button
		const refreshBtn = popup.querySelector('#rosti-price-filler-refresh-cache');
		if (refreshBtn && itemId) {
			refreshBtn.onclick = async () => {
				refreshBtn.disabled = true;
				refreshBtn.textContent = 'Refreshing...';
				// Clear cache for this item
				priceCache.delete(`torn-${itemId}`);
				priceCache.delete(`weav3r-${itemId}`);
				// Re-fetch prices
				const results = await Promise.allSettled([GetPrices(itemId), GetBazaarPrices(itemId)]);
				const [marketResult, bazaarResult] = results;
				const anomalyDetection = detectAnomaly(marketResult, bazaarResult, window.location.href.includes("bazaar.php") ? 'bazaar' : 'market');
				const breakdown = GetPricesBreakdown(marketResult, bazaarResult, anomalyDetection);
				showCustomFillPopup(breakdown, itemId);
				refreshBtn.disabled = false;
				refreshBtn.textContent = 'Refresh';
			};
		}
	}

	function hideAllFillPopups() {
		const popup = document.querySelector('.rosti-price-filler-popup');
		if (popup) popup.style.display = 'none';
		clearInterval(refreshInterval);
	}

	function GetPricesBreakdown(marketResult, bazaarResult, anomalyData = null) {
		const marketTaxFactor = 1 - 0.05;
		const sb = new StringBuilder();
		sb.append('<div class="rosti-price-filler-listings-scroll">');
		sb.append('<div class="rosti-price-filler-popup-table">');

		const buildColumn = (title, result, includeTax) => {
			sb.append(`<div class="rosti-price-filler-popup-col"><b>${title}</b>`);
			if (result.status === 'fulfilled') {
				const prices = result.value;
				if (prices && prices.length > 0) {
					const maxListings = Math.min(prices.length, CONFIG.maxListingsPerSource);
					for (let i = 0; i < maxListings; i++) {
						const item = prices[i];
						if (typeof item !== "object" || item.amount === undefined || item.price === undefined) continue;
						let priceText = `${item.amount} x ${formatNumberWithCommas(item.price)}`;
						if (includeTax) {
							priceText += ` (${formatNumberWithCommas(Math.round(item.price * marketTaxFactor))})`;
						}
						let cssClass = 'rosti-price-filler-popup-price';
						// Only highlight if this column matches the anomaly source
						const isCurrentColumnAnomalous = (
							(title === 'Item Market' && anomalyData.source === 'item-market') ||
							(title === 'Bazaar' && anomalyData.source === 'bazaar')
						);
						if (anomalyData && anomalyData.isAnomaly &&
							anomalyData.anomalousListingIndex === i &&
							isCurrentColumnAnomalous) {
							cssClass += ' anomalous';
						}
						sb.append(`<span class="${cssClass}" data-price="${item.price}">${priceText}</span>`);
					}
				} else {
					sb.append('<span>No listings found.</span>');
				}
			} else {
				sb.append('<span style="color: red;">API Error</span>');
				console.error(`[PriceFiller] ${title} API Error:`, result.reason);
			}
			sb.append('</div>');
		};

		buildColumn('Item Market', marketResult, true);
		buildColumn('Bazaar', bazaarResult, false);
		sb.append('</div>');
		sb.append('</div>'); // Close scrollable div

		// Add anomaly warning if detected (simplified message)
		if (anomalyData && anomalyData.isAnomaly) {
			sb.append(`<div style="margin-top: 5px; padding: 5px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 3px; color: #856404; font-size: 0.85em;">
				<strong>Warning:</strong> Bad pricing detected.<br>Select a price.
			</div>`);
		}

		// Native warnings are now shown as browser alerts, not in popup
		// (Popup may be closed when warning appears)

		return sb.toString();
	}

	/**
	 * Checks if the popup is within the visible viewport and adjusts its position if not.
	 * @param {HTMLElement} popup The popup element to check.
	 */
	function ensurePopupIsInFrame(popup) {
		const margin = 5; // A small margin from the viewport edges

		// Get popup's dimensions and current position (in document coordinates)
		const popupWidth = popup.offsetWidth;
		const popupHeight = popup.offsetHeight;
		let popupLeft = parseInt(popup.style.left, 10);
		let popupTop = parseInt(popup.style.top, 10);

		// Get viewport boundaries (in document coordinates)
		const viewLeft = window.scrollX;
		const viewTop = window.scrollY;
		const viewRight = viewLeft + window.innerWidth;
		const viewBottom = viewTop + window.innerHeight;

		// Calculate the min and max allowed positions for the top-left corner of the popup
		const minLeft = viewLeft + margin;
		const maxLeft = viewRight - popupWidth - margin;
		const minTop = viewTop + margin;
		const maxTop = viewBottom - popupHeight - margin;

		// Clamp the popup's position to keep it within the viewport.
		// The Math.max(min, Math.min(val, max)) pattern is a robust way to clamp a value.
		// It correctly handles cases where the popup is larger than the viewport.
		// If max < min (e.g., popup is too wide), Math.min(val, max) returns max,
		// and Math.max(min, max) returns min, effectively aligning the popup to the left/top edge.
		popupLeft = Math.max(minLeft, Math.min(popupLeft, maxLeft));
		popupTop = Math.max(minTop, Math.min(popupTop, maxTop));

		// Apply the corrected position
		popup.style.left = `${popupLeft}px`;
		popup.style.top = `${popupTop}px`;
	}

	async function handleFillClick(event, itemId, priceInputs, quantityCallback) {
		if (!checkApiKey()) return;
		clearTimeout(closePopupTimer);
		clearInterval(refreshInterval);

		// Clear native warnings from previous fill
		clearNativeWarnings();

		// Track rapid button presses (3x within 10 seconds = clear cache)
		const now = Date.now();
		if (now - lastPressTime < 10000) {
			pressCount++;
			if (pressCount >= 3) {
				console.log('[PriceFiller] Rapid button presses detected - clearing cache');
				priceCache.clear();
				pressCount = 0;
			}
		} else {
			pressCount = 1;
		}
		lastPressTime = now;

		recentFilledInput = priceInputs;
		const popup = document.querySelector('.rosti-price-filler-popup');
		const currentPage = window.location.href.includes("bazaar.php") ? 'bazaar' : 'market';

		if (popup && showPricesPopup) {
			const rect = event.currentTarget.getBoundingClientRect();
			const savedX = localStorage.getItem("rosti-torn-price-filler-popup-offset-x");
			const savedY = localStorage.getItem("rosti-torn-price-filler-popup-offset-y");

			popup.style.left = savedX ? savedX : `${window.scrollX + rect.left - 250}px`;
			popup.style.top = savedY ? savedY : `${window.scrollY + rect.top + 4}px`;
			popup.style.display = 'block';
			ensurePopupIsInFrame(popup);
			popup.querySelector('.rosti-price-filler-popup-body').innerHTML = LOADING_THE_PRICES;
		}

		const updatePopupContent = async () => {
			const results = await Promise.allSettled([GetPrices(itemId), GetBazaarPrices(itemId)]);
			const [marketResult, bazaarResult] = results;
			const anomalyDetection = detectAnomaly(marketResult, bazaarResult, currentPage);

			if (showPricesPopup) {
				const breakdown = GetPricesBreakdown(marketResult, bazaarResult, anomalyDetection);
				showCustomFillPopup(breakdown, itemId);
			}
			return { marketResult, bazaarResult, anomalyDetection };
		};

		let { marketResult, bazaarResult, anomalyDetection } = await updatePopupContent();

		if (showPricesPopup) {
			const startRefresh = () => {
				clearInterval(refreshInterval);
				refreshInterval = setInterval(updatePopupContent, 60000);
			};

			const hasAnyWarnings = anomalyDetection.isAnomaly || nativeWarnings.size > 0;

			const keepOpenCheckbox = popup.querySelector('#rosti-price-filler-keep-open');
			keepOpenCheckbox.checked = keepPopupOpen;

			if (keepOpenCheckbox.checked || hasAnyWarnings) {
				startRefresh();
			} else {
				closePopupTimer = setTimeout(hideAllFillPopups, 2000);
			}

			keepOpenCheckbox.onchange = () => {
				keepPopupOpen = keepOpenCheckbox.checked;
				localStorage.setItem("rosti-torn-price-filler-keep-popup-open", keepPopupOpen);
				if (keepPopupOpen) {
					clearTimeout(closePopupTimer);
					startRefresh();
				} else {
					clearInterval(refreshInterval);
					if (!hasAnyWarnings) {
						closePopupTimer = setTimeout(hideAllFillPopups, 3000);
					}
				}
			};
		}

		const GetPrice = (result) => {
			if (result.status !== 'fulfilled' || !result.value || result.value.length === 0) return '';
			const prices = result.value;

			if (priceDeltaRaw.includes('[median]')) {
				const sortedPrices = prices.map(p => p.price).sort((a, b) => a - b);
				const mid = Math.floor(sortedPrices.length / 2);
				const median = sortedPrices.length % 2 === 0 ? (sortedPrices[mid - 1] + sortedPrices[mid]) / 2 : sortedPrices[mid];
				let priceDelta = priceDeltaRaw.substring(0, priceDeltaRaw.indexOf('['));
				return Math.round(performOperation(median, priceDelta));
			} else if (priceDeltaRaw.includes('[market]')) {
				let priceDelta = priceDeltaRaw.substring(0, priceDeltaRaw.indexOf('['));
				return Math.round(performOperation(prices[0].price, priceDelta));
			} else {
				let marketSlotOffset = priceDeltaRaw.includes('[') ? parseInt(priceDeltaRaw.substring(priceDeltaRaw.indexOf('[') + 1, priceDeltaRaw.indexOf(']'))) : 0;
				let priceDeltaWithoutMarketOffset = priceDeltaRaw.includes('[') ? priceDeltaRaw.substring(0, priceDeltaRaw.indexOf('[')) : priceDeltaRaw;
				return Math.round(performOperation(prices[Math.min(marketSlotOffset, prices.length - 1)].price, priceDeltaWithoutMarketOffset));
			}
		};

		const isBazaar = currentPage === 'bazaar';
		const resultToUse = isBazaar ? bazaarResult : marketResult;

		// Context-aware anomaly detection: only warn if current page's market has anomaly
		if (anomalyDetection.isAnomaly) {
			const relevantWarning = (
				(isBazaar && anomalyDetection.source === 'bazaar') ||
				(!isBazaar && anomalyDetection.source === 'item-market')
			);

			if (relevantWarning) {
				console.warn(`[PriceFiller] Anomaly detected for ${currentPage}: ${anomalyDetection.anomalyReason}`);

				// Clear price input and highlight with warning color
				if (CONFIG.highlightAnomalousInputs) {
					priceInputs.forEach(input => {
						input.value = '';  // Delete price
						input.style.backgroundColor = CONFIG.warningColor;
						input.title = "Price not filled - potential anomaly detected. See popup for details.";
					});
				}
			} else {
				// Other market's anomaly is irrelevant - fill normally
				const price = GetPrice(resultToUse);
				if (price !== '') {
					priceInputs.forEach(x => setReactInputValue(x, price));
				}
			}
		} else {
			// No anomaly - proceed normally
			const price = GetPrice(resultToUse);
			if (price !== '') {
				priceInputs.forEach(x => setReactInputValue(x, price));
			}
		}

		if (quantityCallback) {
			quantityCallback();
		}
	}

	// --- PAGE-SPECIFIC INITIALIZERS ---
	function addDisablePopupCheckbox(container, insertBeforeElement, isMarket) {
		if (document.getElementById('disable-popup-checkbox-container')) return;

		const checkboxContainer = document.createElement('div');
		checkboxContainer.id = 'disable-popup-checkbox-container';
		checkboxContainer.style.display = 'inline-flex';
		checkboxContainer.style.alignItems = 'center';
		if(isMarket) {
			checkboxContainer.style.marginLeft = '10px';
		} else {
			checkboxContainer.style.marginRight = '10px';
		}


		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = 'disable-popup-checkbox';
		checkbox.checked = showPricesPopup;
		checkbox.style.margin = '0';

		const label = document.createElement('label');
		label.htmlFor = 'disable-popup-checkbox';
		label.textContent = 'Show Popup';
		label.style.marginLeft = '5px';
		label.style.fontWeight = 'normal';


		checkbox.addEventListener('change', () => {
			showPricesPopup = checkbox.checked;
			GM_setValue("rosti-torn-price-filler-show-prices-popup", showPricesPopup);
		});

		checkboxContainer.appendChild(checkbox);
		checkboxContainer.appendChild(label);

		if (insertBeforeElement) {
			container.insertBefore(checkboxContainer, insertBeforeElement);
		} else {
			container.appendChild(checkboxContainer);
		}
	}


	function initMarketPage() {
		const observerTarget = document.querySelector("#item-market-root");
		if (!observerTarget) return;

		const observer = new MutationObserver(mutations => {
			mutations.forEach(mutationRaw => {
				const mutation = mutationRaw.target;
				const isAddItems = window.location.href.includes('#/addListing');
				const isViewItems = window.location.href.includes('#/viewListing');

				if (isAddItems || isViewItems) {
					const selector = '[class*=itemRowWrapper___]:not(.price-filler-processed) > [class*=itemRow___]:not([class*=grayedOut___]) [class^=priceInputWrapper___]';
					mutation.querySelectorAll(selector).forEach(x => addMarketFillButton(x));
				}
			});
			// Add checkbox for item market
			const controlsContainer = document.querySelector('[class*="controls___"]');
			if (controlsContainer) {
				addDisablePopupCheckbox(controlsContainer, null, true);
			}
		});
		observer.observe(observerTarget, { childList: true, subtree: true });
	}

	function addMarketFillButton(itemPriceElement) {
		if (itemPriceElement.querySelector('.price-filler-button')) return;

		const wrapperParent = findParentByCondition(itemPriceElement, (el) => String(el.className).includes('itemRowWrapper___'));
		if (!wrapperParent) return;
		wrapperParent.classList.add('price-filler-processed');

		const itemIdString = wrapperParent.querySelector('[class^=itemRow___] [type=button][class^=viewInfoButton___]')?.getAttribute('aria-controls');
		const itemImage = wrapperParent.querySelector('[class*=viewInfoButton] img');
		const itemId = window.location.href.includes('#/addListing')
			  ? (itemIdString?.match(/-(\d+)-/)?.[1] || -1)
			  : (itemImage?.src.match(/\/(\d+)\//)?.[1] || -1);

		if (itemId === -1) return;

		const span = document.createElement('span');
		span.className = 'price-filler-button input-money-symbol';
		span.style.position = "relative";
		span.onclick = (e) => {
			const priceInputs = Array.from(itemPriceElement.querySelectorAll('input.input-money'));
			const itemRow = findParentByCondition(e.target, (el) => String(el.className).includes('itemRowWrapper___'));
			const checkbox = itemRow.querySelector('input[id*="selectCheckbox"]');

			handleFillClick(e, itemId, priceInputs, () => {
				if (checkbox) {
					checkbox.click();
				} else {
					const quantityInputs = itemRow.querySelectorAll('[class^=amountInputWrapper___] .input-money-group > .input-money');
					if (quantityInputs && quantityInputs.length > 0) {
						if (quantityInputs[0].value.length === 0 || parseInt(quantityInputs[0].value) < 1) {
							setReactInputValue(quantityInputs[0], Number.MAX_SAFE_INTEGER);
							setReactInputValue(quantityInputs[1], Number.MAX_SAFE_INTEGER);
						}
					}
				}
			});
		};

		const input = document.createElement('input');
		input.type = 'button';
		input.className = 'wai-btn';
		span.appendChild(input);
		itemPriceElement.querySelector('.input-money-group').prepend(span);
	}

	function initBazaarPage() {
		const processBazaarItems = () => {
			// For #/add page
			$("ul.items-cont li.clearfix").each(function() {
				const targetElement = $(this).find("div.title-wrap div.name-wrap")[0];
				if (targetElement && !$(this).hasClass("disabled") && !targetElement.querySelector('.torn-bazaar-fill-qty-price')) {
					addBazaarFillButtons(targetElement);
				}
			});

			// For #/manage page
			$("div[class*=row___]").each(function() {
				const targetElement = $(this).find("div[class*=item___] div[class*=desc___]")[0];
				if (targetElement && !targetElement.querySelector('.torn-bazaar-fill-qty-price')) {
					addBazaarFillButtons(targetElement);
				}
			});

			// Add checkbox for bazaar on manage page
			if (window.location.hash.includes('#/manage')) {
				const linksContainer = document.querySelector('.linksContainer___LiOTN');
				const addItemsLink = document.querySelector('a[href="#/add"]');
				if (linksContainer && addItemsLink && !document.getElementById('disable-popup-checkbox-container')) {
					addDisablePopupCheckbox(linksContainer, addItemsLink, false);
				}
			}
		};

		const observerTarget = document.querySelector(".content-wrapper");
		if (!observerTarget) return;

		const observer = new MutationObserver(processBazaarItems);
		observer.observe(observerTarget, { childList: true, subtree: true });
		window.addEventListener('hashchange', () => {
			// A brief delay to allow the page to render after hash change
			setTimeout(processBazaarItems, 100);
		});
		processBazaarItems(); // Initial run
	}

	function addBazaarFillButtons(element) {
		const outerSpanFill = document.createElement('span');
		outerSpanFill.className = 'btn-wrap torn-bazaar-fill-qty-price';
		const innerSpanFill = document.createElement('span');
		innerSpanFill.className = 'btn';
		const inputElementFill = document.createElement('input');
		inputElementFill.type = 'button';
		inputElementFill.value = "Fill";
		inputElementFill.className = 'torn-btn';

		innerSpanFill.appendChild(inputElementFill);
		outerSpanFill.appendChild(innerSpanFill);
		element.append(outerSpanFill);

		$(outerSpanFill).on("click", "input", function(event) {
			event.stopPropagation();
			const itemRow = $(this).closest('li.clearfix, div[class*=row___]');
			const image = itemRow.find("div.image-wrap img, div.imgContainer___tEZeE img")[0];
			const itemId = image.src.match(/\/(\d+)\//)?.[1];
			if (!itemId) return;

			const fillPriceAndQuantity = () => {
				let priceInputs;
				const isManageMobile = window.location.hash.includes('#/manage') && window.innerWidth <= 784;

				if (isManageMobile) {
					priceInputs = Array.from(itemRow.find('.priceMobile___cpt8p .input-money-group input'));
				} else {
					priceInputs = Array.from(itemRow.find("div.price div input, div[class*=price___] div.input-money-group input"));
				}

				const checkbox = itemRow.find('div.amount.choice-container input[type="checkbox"]')[0];

				handleFillClick(event, itemId, priceInputs, () => {
					if (checkbox) {
						checkbox.click();
					} else {
						const quantityInput = itemRow.find("div.amount input")[0];
						const quantityElement = itemRow.find('span.t-hide span:last-child');
						const quantity = quantityElement.length > 0 ? quantityElement.text().trim() : 1;
						if (quantityInput) {
							setReactInputValue(quantityInput, quantity);
						}
					}
				});
			};

			// On manage page, expand the item if it's not already expanded
			if (window.location.hash.includes('#/manage')) {
				const itemContainer = itemRow.find('div[class*=item___]');
				if (itemContainer.length > 0 && !itemContainer.hasClass('active___OTFsm')) {
					const manageButton = itemRow.find('button[aria-label="Manage"]');
					if (manageButton.length > 0) {
						manageButton.click();
						// Wait for expansion animation before filling
						setTimeout(fillPriceAndQuantity, 150);
						return;
					}
				}
			}

			// If not on manage page or item is already expanded, fill immediately
			fillPriceAndQuantity();
		});
	}

	// --- CACHE MANAGEMENT ---

	function cleanExpiredCache() {
		const now = Date.now();
		const ttl = CONFIG.cacheTTLSeconds * 1000;
		for (const [key, value] of priceCache.entries()) {
			if (now - value.timestamp > ttl) {
				priceCache.delete(key);
			}
		}
	}

	// --- SCRIPT INITIALIZATION ---

	function init() {
		GM_addStyle_TornPDA(`
			.rosti-price-filler-popup { background: var(--tooltip-bg-color); padding: 2px 3px; border-radius: 5px; border: 1px solid #888; box-shadow: 0 2px 8px 0 #0006; color: var(--info-msg-font-color); z-index: 99999; position: absolute; font-size: 0.9em; line-height: 1.1; pointer-events: auto; }
			.rosti-price-filler-popup-close { position: absolute; top: 1px; right: 5px; font-size: 1.2em; color: #aaa; cursor: pointer; }
			.rosti-price-filler-popup-price { cursor: pointer; display: block; margin-bottom: 0; }
			.rosti-price-filler-popup-table { display: flex; gap: 0; }
			.rosti-price-filler-popup-col { display: flex; flex-direction: column; gap: 0; margin: 0; padding: 0; }
			.rosti-price-filler-listings-scroll { max-height: 90px; overflow-y: auto; padding-right: 2px; scrollbar-width: thin; }
			.rosti-price-filler-listings-scroll::-webkit-scrollbar { width: 5px; }
			.rosti-price-filler-listings-scroll::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 4px; }
			.rosti-price-filler-listings-scroll::-webkit-scrollbar-thumb { background: rgba(136, 136, 136, 0.5); border-radius: 4px; }
			.rosti-price-filler-listings-scroll::-webkit-scrollbar-thumb:hover { background: rgba(136, 136, 136, 0.8); }
			.rosti-price-filler-popup-footer { margin-top: 2px; padding-top: 2px; border-top: 1px solid rgba(136, 136, 136, 0.3); }
			.rosti-price-filler-footer-controls { display: flex; align-items: center; gap: 3px; font-size: 0.75em; }
			#rosti-price-filler-keep-open { margin: 0; vertical-align: middle; cursor: pointer; }
			#rosti-price-filler-keep-open + label { margin: 0; vertical-align: middle; cursor: pointer; color: var(--info-msg-font-color); user-select: none; }
			#rosti-price-filler-refresh-cache { margin-left: auto; padding: 1px 5px; font-size: 0.7em; cursor: pointer; border: 1px solid rgba(136, 136, 136, 0.5); border-radius: 3px; background: var(--tooltip-bg-color); color: var(--info-msg-font-color); transition: background-color 0.2s, border-color 0.2s; }
			#rosti-price-filler-refresh-cache:hover:not(:disabled) { background: rgba(136, 136, 136, 0.2); border-color: rgba(136, 136, 136, 0.8); }
			#rosti-price-filler-refresh-cache:disabled { opacity: 0.6; cursor: not-allowed; }
			.rosti-price-filler-popup-price.anomalous { color: #e74c3c; font-weight: bold; }
			.input-money.anomaly-warning { background-color: #f1c40f !important; }
			.price-filler-button { position: relative; }
			.btn-wrap.torn-bazaar-fill-qty-price { float: right; margin-left: auto; z-index: 99999; }
		`);
		addCustomFillPopup();
		detectNativeTornWarnings();  // Initialize native Torn warning detection

		// Auto-clear expired cache every 5 minutes
		setInterval(cleanExpiredCache, 300000);

		const href = window.location.href;
		if (href.includes("page.php?sid=ItemMarket")) {
			initMarketPage();
		} else if (href.includes("bazaar.php")) {
			initBazaarPage();
		}

		GM_registerMenuCommand("Change Price Delta", () => {
			const newPriceDelta = prompt("Enter new price delta (e.g., -1, -10%, -1[median], -1[market]):", priceDeltaRaw);
			if (newPriceDelta) {
				priceDeltaRaw = newPriceDelta;
				GM_setValue("rosti-torn-price-filler-price-delta", newPriceDelta);
			}
		});
	}

	init();

})();
