// ==UserScript==
// @name         Auto Currency Converter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically converts prices to your preferred currency on shopping sites, travel sites, and anywhere prices are displayed.
// @author       xvcf
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540186/Auto%20Currency%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/540186/Auto%20Currency%20Converter.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const config = {
		targetCurrency: GM_getValue("targetCurrency", "EUR"),
		localCurrency: GM_getValue("localCurrency", "auto"),
		updateInterval: 3600000,
		maxRetries: 3,
		debug: false,
		ratesCacheDuration: 3600000,
	};

	let exchangeRates = {};
	let processedElements = new WeakSet();
	let isRatesLoaded = false;

	function log(message, ...args) {
		if (config.debug) {
			console.log(`[Currency Converter] ${message}`, ...args);
		}
	}

	const currencySymbols = {
		USD: "$",
		EUR: "€",
		GBP: "£",
		JPY: "¥",
		CNY: "¥",
		KRW: "₩",
		INR: "₹",
		RUB: "₽",
		BRL: "R$",
		CAD: "C$",
		AUD: "A$",
		CHF: "CHF",
	};

	const pricePatterns = [
		/([£$€¥₹₽₩₪₺])\s*([0-9]{1,3}(?:[,.]?[0-9]{3})*(?:[.,][0-9]{1,2})?)/g,
		/([0-9]{1,3}(?:[,.]?[0-9]{3})*(?:[.,][0-9]{1,2})?)\s*([A-Z]{3})\b/g,
		/\b([A-Z]{3})\s+([0-9]{1,3}(?:[,.]?[0-9]{3})*(?:[.,][0-9]{1,2})?)/g,
		/\b([A-Z]{3})([0-9]{1,3}(?:[,.]?[0-9]{3})*(?:[.,][0-9]{1,2})?)/g,
	];

	function detectCurrencyFromSymbol(symbol) {
		const symbolMap = {
			$: "USD",
			"€": "EUR",
			"£": "GBP",
			"¥": "JPY",
			"₹": "INR",
			"₽": "RUB",
			"₩": "KRW",
			"₪": "ILS",
			"₺": "TRY",
		};
		return symbolMap[symbol] || null;
	}

	function detectCurrencyFromDomain() {
		const domain = window.location.hostname;
		const domainMap = {
			"amazon.com": "USD",
			"amazon.co.uk": "GBP",
			"amazon.de": "EUR",
			"amazon.fr": "EUR",
			"amazon.ca": "CAD",
			"amazon.co.jp": "JPY",
			"ebay.com": "USD",
			"ebay.co.uk": "GBP",
			"ebay.de": "EUR",
			"booking.com": "EUR",
			"airbnb.com": "USD",
			"expedia.com": "USD",
			"walmart.com": "USD",
			"target.com": "USD",
			"bestbuy.com": "USD",
			"zalando.com": "EUR",
			"zara.com": "EUR",
			"hm.com": "EUR",
			"nike.com": "USD",
			"adidas.com": "EUR",
		};

		for (const [site, currency] of Object.entries(domainMap)) {
			if (domain.includes(site)) {
				return currency;
			}
		}
		return "USD";
	}

	function getLocalCurrency() {
		if (config.localCurrency === "auto") {
			return detectCurrencyFromDomain();
		}
		return config.localCurrency;
	}

	async function fetchExchangeRates() {
		const cachedRates = GM_getValue("exchangeRates", null);
		const cacheTime = GM_getValue("ratesCacheTime", 0);
		const now = Date.now();

		if (cachedRates && now - cacheTime < config.ratesCacheDuration) {
			exchangeRates = JSON.parse(cachedRates);
			isRatesLoaded = true;
			log("Using cached exchange rates");
			return;
		}

		for (let attempt = 0; attempt < config.maxRetries; attempt++) {
			try {
				await new Promise((resolve, reject) => {
					GM_xmlhttpRequest({
						method: "GET",
						url: "https://api.exchangerate-api.com/v4/latest/USD",
						onload: function (response) {
							try {
								const data = JSON.parse(response.responseText);
								if (data && data.rates) {
									exchangeRates = data.rates;
									exchangeRates["USD"] = 1;
									GM_setValue(
										"exchangeRates",
										JSON.stringify(exchangeRates)
									);
									GM_setValue("ratesCacheTime", now);
									isRatesLoaded = true;
									log("Exchange rates loaded successfully");
									resolve();
								} else {
									reject(
										new Error("Invalid response format")
									);
								}
							} catch (e) {
								reject(e);
							}
						},
						onerror: function (error) {
							reject(error);
						},
					});
				});
				return;
			} catch (error) {
				log(`Attempt ${attempt + 1} failed:`, error);
				if (attempt === config.maxRetries - 1) {
					const fallbackRates = GM_getValue("exchangeRates", null);
					if (fallbackRates) {
						exchangeRates = JSON.parse(fallbackRates);
						isRatesLoaded = true;
						log("Using fallback cached rates");
					} else {
						log("Failed to load exchange rates");
					}
				}
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}
	}

	function parsePrice(priceText) {
		const cleanText = priceText.replace(
			/[^\d.,£$€¥₹₽₩₪₺₦₵₨₱₸₼₾₮₲₴₪₫₡₧A-Z\s]/g,
			""
		);

		for (const pattern of pricePatterns) {
			pattern.lastIndex = 0;
			const match = pattern.exec(cleanText);
			if (match) {
				let amount, currency;

				if (
					match[1] &&
					match[2] &&
					!isNaN(parseFloat(match[2].replace(/[,]/g, ""))) &&
					/^[£$€¥₹₽₩₪₺₦₵₨₱₸₼₾₮₲₴₫₡₧]$/.test(match[1])
				) {
					currency = detectCurrencyFromSymbol(match[1]);
					amount = parseFloat(match[2].replace(/[,]/g, ""));
				} else if (
					match[1] &&
					match[2] &&
					match[2].length === 3 &&
					!isNaN(parseFloat(match[1].replace(/[,]/g, "")))
				) {
					amount = parseFloat(match[1].replace(/[,]/g, ""));
					currency = match[2].toUpperCase();
				} else if (
					match[1] &&
					match[2] &&
					match[1].length === 3 &&
					!isNaN(parseFloat(match[2].replace(/[,]/g, "")))
				) {
					currency = match[1].toUpperCase();
					amount = parseFloat(match[2].replace(/[,]/g, ""));
				} else if (
					match[1] &&
					!match[2] &&
					!isNaN(parseFloat(match[1].replace(/[,]/g, "")))
				) {
					amount = parseFloat(match[1].replace(/[,]/g, ""));
					currency = getLocalCurrency();
				}

				if (
					amount &&
					currency &&
					exchangeRates[currency] &&
					amount > 0
				) {
					return { amount, currency };
				}
			}
		}
		return null;
	}

	function convertCurrency(amount, fromCurrency, toCurrency) {
		if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
			return null;
		}

		const usdAmount = amount / exchangeRates[fromCurrency];
		const convertedAmount = usdAmount * exchangeRates[toCurrency];
		return convertedAmount;
	}

	function formatCurrency(amount, currency) {
		const symbol = currencySymbols[currency] || currency;
		const formatted = new Intl.NumberFormat("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(amount);

		if (symbol.length === 1 && /^[£$€¥₹₽₩₪₺₦₵₨₱₸₼₾₮₲₴₫₡₧]$/.test(symbol)) {
			return `${symbol}${formatted}`;
		} else {
			return `${formatted} ${symbol}`;
		}
	}

	function createConvertedElement(
		convertedPrice,
		originalPrice,
		originalCurrency
	) {
		const wrapper = document.createElement("span");
		wrapper.className = "currency-converter-wrapper";

		const converted = document.createElement("span");
		converted.className = "currency-converted";
		converted.textContent = convertedPrice;
		converted.style.cssText = `
            font-weight: bold;
            color: #e74c3c;
            background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.9em;
            margin: 0 4px;
            display: inline-block;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        `;

		wrapper.appendChild(converted);

		converted.addEventListener("mouseenter", () => {
			converted.style.transform = "scale(1.05)";
			converted.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
		});

		converted.addEventListener("mouseleave", () => {
			converted.style.transform = "scale(1)";
			converted.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
		});

		return wrapper;
	}

	function processTextNode(textNode) {
		if (processedElements.has(textNode) || !textNode.textContent.trim()) {
			return;
		}

		const parent = textNode.parentNode;
		if (!parent) {
			return;
		}

		if (
			parent.classList.contains("currency-converter-wrapper") ||
			parent.classList.contains("currency-converted") ||
			parent.closest(".currency-converter-wrapper")
		) {
			return;
		}

		const text = textNode.textContent;
		const priceInfo = parsePrice(text);

		if (priceInfo) {
			if (priceInfo.currency !== config.targetCurrency) {
				const convertedAmount = convertCurrency(
					priceInfo.amount,
					priceInfo.currency,
					config.targetCurrency
				);

				if (convertedAmount) {
					const convertedPrice = formatCurrency(
						convertedAmount,
						config.targetCurrency
					);
					const convertedElement = createConvertedElement(
						convertedPrice,
						text,
						priceInfo.currency
					);

					const fragment = document.createDocumentFragment();
					fragment.appendChild(convertedElement);

					parent.insertBefore(fragment, textNode.nextSibling);
					processedElements.add(textNode);

					log(
						`Converted ${formatCurrency(
							priceInfo.amount,
							priceInfo.currency
						)} to ${convertedPrice}`
					);
				}
			}
		}
	}

	function findAndConvertPrices() {
		if (!isRatesLoaded) return;

		const walker = document.createTreeWalker(
			document.body,
			NodeFilter.SHOW_TEXT,
			{
				acceptNode: function (node) {
					if (
						node.parentNode.tagName === "SCRIPT" ||
						node.parentNode.tagName === "STYLE" ||
						node.parentNode.closest(".currency-converter-wrapper")
					) {
						return NodeFilter.FILTER_REJECT;
					}
					return NodeFilter.FILTER_ACCEPT;
				},
			}
		);

		const textNodes = [];
		let node;
		while ((node = walker.nextNode())) {
			textNodes.push(node);
		}

		textNodes.forEach(processTextNode);
	}

	function createToggleButton() {
		if (document.getElementById("currency-converter-toggle")) {
			return;
		}

		const button = document.createElement("button");
		button.id = "currency-converter-toggle";
		button.innerHTML = "💱";
		button.title = "Currency Converter Settings";
		button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 2147483646;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

		button.addEventListener("mouseenter", () => {
			button.style.transform = "scale(1.1)";
			button.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
		});

		button.addEventListener("mouseleave", () => {
			button.style.transform = "scale(1)";
			button.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
		});

		button.addEventListener("click", () => {
			const panel = document.getElementById(
				"currency-converter-settings"
			);
			if (panel) {
				panel.style.display =
					panel.style.display === "none" ? "block" : "none";
			}
		});

		document.body.appendChild(button);
	}

	function createSettingsPanel() {
		if (document.getElementById("currency-converter-settings")) {
			return;
		}

		const panel = document.createElement("div");
		panel.id = "currency-converter-settings";
		panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 2147483647;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
            display: none;
        `;

		panel.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #2c3e50;">Currency Converter</h3>
            <label style="display: block; margin-bottom: 10px;">
                Local Currency (for this site):
                <select id="local-currency-select" style="width: 100%; padding: 5px; margin-top: 5px;">
                    <option value="auto">Auto-detect (${detectCurrencyFromDomain()})</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CNY">CNY (¥)</option>
                    <option value="KRW">KRW (₩)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="RUB">RUB (₽)</option>
                    <option value="BRL">BRL (R$)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                    <option value="CHF">CHF (Fr)</option>
                </select>
            </label>
            <label style="display: block; margin-bottom: 10px;">
                Convert To:
                <select id="target-currency-select" style="width: 100%; padding: 5px; margin-top: 5px;">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CNY">CNY (¥)</option>
                    <option value="KRW">KRW (₩)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="RUB">RUB (₽)</option>
                    <option value="BRL">BRL (R$)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                    <option value="CHF">CHF (Fr)</option>
                </select>
            </label>
            <button id="convert-now-btn" style="width: 100%; padding: 8px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 10px;">Save</button>
            <button id="close-settings-btn" style="width: 100%; padding: 8px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        `;

		document.body.appendChild(panel);

		const localSelect = panel.querySelector("#local-currency-select");
		const targetSelect = panel.querySelector("#target-currency-select");

		localSelect.value = config.localCurrency;
		targetSelect.value = config.targetCurrency;

		localSelect.addEventListener("change", (e) => {
			config.localCurrency = e.target.value;
			GM_setValue("localCurrency", config.localCurrency);
			refreshConversions();
		});

		targetSelect.addEventListener("change", (e) => {
			config.targetCurrency = e.target.value;
			GM_setValue("targetCurrency", config.targetCurrency);
			refreshConversions();
		});

		panel
			.querySelector("#convert-now-btn")
			.addEventListener("click", () => {
				refreshConversions();
			});

		panel
			.querySelector("#close-settings-btn")
			.addEventListener("click", () => {
				panel.style.display = "none";
			});

		return panel;
	}

	function refreshConversions() {
		document
			.querySelectorAll(".currency-converter-wrapper")
			.forEach((el) => el.remove());

		processedElements = new WeakSet();

		findAndConvertPrices();
	}

	async function initialize() {
		if (window.currencyConverterInitialized) return;
		window.currencyConverterInitialized = true;

		await fetchExchangeRates();
		if (!isRatesLoaded) return;

		createToggleButton();
		createSettingsPanel();
		findAndConvertPrices();

		if (!window.currencyConverterObserver) {
			window.currencyConverterObserver = new MutationObserver(() => {
				setTimeout(findAndConvertPrices, 1000);
			});
			window.currencyConverterObserver.observe(document.body, {
				childList: true,
				subtree: true,
			});
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initialize);
	} else {
		initialize();
	}
})();
