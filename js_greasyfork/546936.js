// ==UserScript==
// @name         Steam Multi-currency Live Converter
// @name:ru      Steam Авто-конвертер валют с живыми курсами
// @name:de      Steam Auto-Währungsumrechner mit Live-Kursen
// @name:kk      Steam Авто-валюта конвертері тікелей бағамдармен
// @name:uk      Steam Авто-конвертер валют з живими курсами
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Auto-detect and convert Steam prices to any currency with live exchange rates
// @description:ru Автоматически определяет и конвертирует цены Steam в любую валюту с живыми курсами
// @description:de Automatische Erkennung und Konvertierung von Steam-Preisen in jede Währung mit Live-Kursen
// @description:kk Steam бағаларын тікелей бағамдармен кез келген валютаға автоматты анықтау және конвертация
// @description:uk Автоматично визначає та конвертує ціни Steam у будь-яку валюту з живими курсами
// @author       Aze4ka
// @license      MIT
// @match        *://store.steampowered.com/*
// @match        *://steamcommunity.com/market/*
// @grant        GM_xmlhttpRequest
// @connect      cdn.jsdelivr.net
// @downloadURL https://update.greasyfork.org/scripts/546936/Steam%20Multi-currency%20Live%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/546936/Steam%20Multi-currency%20Live%20Converter.meta.js
// ==/UserScript==
/*


               AAA                                                           444444444  kkkkkkkk
              A:::A                                                         4::::::::4  k::::::k
             A:::::A                                                       4:::::::::4  k::::::k
            A:::::::A                                                     4::::44::::4  k::::::k
           A:::::::::A           zzzzzzzzzzzzzzzzz    eeeeeeeeeeee       4::::4 4::::4   k:::::k    kkkkkkkaaaaaaaaaaaaa
          A:::::A:::::A          z:::::::::::::::z  ee::::::::::::ee    4::::4  4::::4   k:::::k   k:::::k a::::::::::::a
         A:::::A A:::::A         z::::::::::::::z  e::::::eeeee:::::ee 4::::4   4::::4   k:::::k  k:::::k  aaaaaaaaa:::::a
        A:::::A   A:::::A        zzzzzzzz::::::z  e::::::e     e:::::e4::::444444::::444 k:::::k k:::::k            a::::a
       A:::::A     A:::::A             z::::::z   e:::::::eeeee::::::e4::::::::::::::::4 k::::::k:::::k      aaaaaaa:::::a
      A:::::AAAAAAAAA:::::A           z::::::z    e:::::::::::::::::e 4444444444:::::444 k:::::::::::k     aa::::::::::::a
     A:::::::::::::::::::::A         z::::::z     e::::::eeeeeeeeeee            4::::4   k:::::::::::k    a::::aaaa::::::a
    A:::::AAAAAAAAAAAAA:::::A       z::::::z      e:::::::e                     4::::4   k::::::k:::::k  a::::a    a:::::a
   A:::::A             A:::::A     z::::::zzzzzzzze::::::::e                    4::::4  k::::::k k:::::k a::::a    a:::::a
  A:::::A               A:::::A   z::::::::::::::z e::::::::eeeeeeee          44::::::44k::::::k  k:::::ka:::::aaaa::::::a
 A:::::A                 A:::::A z:::::::::::::::z  ee:::::::::::::e          4::::::::4k::::::k   k:::::ka::::::::::aa:::a
AAAAAAA                   AAAAAAAzzzzzzzzzzzzzzzzz    eeeeeeeeeeeeee          4444444444kkkkkkkk    kkkkkkkaaaaaaaaaa  aaaa

*/

(function() {
    'use strict';

    const currencySymbols = {
        USD: '$', EUR: '€', CHF: 'CHF ', PLN: 'zł', CZK: 'Kč', GBP: '£',
        CAD: 'CA$', AUD: 'A$', JPY: '¥', KZT: '₸', HUF: 'Ft', RON: 'lei',
        CNY: '元', TRY: '₺', INR: '₹', UAH: '₴',
        BYN: 'Br', RUB: '₽', ARS: '$AR'
    };

    const ALL_CURRENCIES = [
        'USD','EUR','CHF','PLN','CZK','GBP',
        'CAD','AUD','JPY','KZT','HUF','RON','CNY',
        'TRY','INR','UAH','BYN','RUB','ARS'
    ];

    const PANEL_ID = 'uah-currency-panel';
    let originalCurrency = null;
    let priceElements = new Map();
    let currentRate = 1;

    function getUserCurrency() { return localStorage.getItem('uah_currency') || 'CHF'; }
    function setUserCurrency(v) { localStorage.setItem('uah_currency', v); }

    function addCurrencyPanel() {
        let panel = document.getElementById(PANEL_ID);
        if (panel) return panel;

        panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.style.position = 'fixed';
        panel.style.top = '18px';
        panel.style.right = '28px';
        panel.style.zIndex = 10000;
        panel.style.background = 'linear-gradient(90deg,#18e95b 20%, #63f177 80%)';
        panel.style.padding = '4px 10px 4px 10px';
        panel.style.borderRadius = '18px';
        panel.style.boxShadow = '0 0 10px 2px #11ff60dd,0 0 1px #222';
        panel.style.display = 'flex';
        panel.style.alignItems = 'center';

        const sel = document.createElement('select');
        sel.id = 'uah-currency-sel';
        sel.style.fontSize = '15px';
        sel.style.border = 'none';
        sel.style.outline = 'none';
        sel.style.background = 'transparent';
        sel.style.fontWeight = 'bold';
        sel.style.color = '#222';
        sel.style.cursor = 'pointer';
        sel.style.textShadow = '0 0 2px #fff, 0 0 1px #5fffaf';

        ALL_CURRENCIES.forEach((c) => {
            const o = document.createElement('option');
            o.value = c;
            o.textContent = c;
            if (getUserCurrency() === c) o.selected = true;
            sel.appendChild(o);
        });

        // Request rate only when currency is switched
        sel.onchange = async function() {
            const newCurrency = sel.value;
            setUserCurrency(newCurrency);

            console.log(`Currency changed to: ${newCurrency}`);

            // Reset conversion flags for all elements
            priceElements.forEach((data, element) => {
                if (element && element.parentNode) {
                    element.removeAttribute('data-price-converted');
                }
            });

            // Get rate only once when switching
            const fromCurrency = detectOriginalCurrency();
            currentRate = await getExchangeRate(fromCurrency, newCurrency);

            console.log(`Switching from ${fromCurrency} to ${newCurrency}, rate: ${currentRate}`);

            convertAllPrices();
        };

        panel.appendChild(sel);
        document.body.appendChild(panel);
        return panel;
    }

    // Detecting page currency
    function detectOriginalCurrency() {
        if (originalCurrency) return originalCurrency;

        const symbolToCode = {};
        Object.entries(currencySymbols).forEach(([code, sym]) => {
            if (sym && !/^[A-Za-z0-9 ]+$/.test(sym)) {
                symbolToCode[sym.trim()] = code;
            }
        });

        // Additional mappings for different formats
        symbolToCode['AR$'] = 'ARS';
        symbolToCode['руб.'] = 'RUB';
        symbolToCode['руб'] = 'RUB';
        symbolToCode['₽'] = 'RUB';
        symbolToCode['$'] = 'USD';
        symbolToCode['US$'] = 'USD';
        symbolToCode['USD'] = 'USD';
        symbolToCode['CA$'] = 'CAD';
        symbolToCode['CDN$'] = 'CAD';
        symbolToCode['A$'] = 'AUD';
        symbolToCode['zł'] = 'PLN';
        symbolToCode['Kč'] = 'CZK';
        symbolToCode['Ft'] = 'HUF';
        symbolToCode['lei'] = 'RON';
        symbolToCode['元'] = 'CNY';
        symbolToCode['₸'] = 'KZT';
        symbolToCode['Br'] = 'BYN';
        symbolToCode['CHF'] = 'CHF';
        symbolToCode['CHF '] = 'CHF';
        symbolToCode['£'] = 'GBP';
        symbolToCode['₹'] = 'INR';
        symbolToCode['¥'] = 'JPY';

        const priceSelectors = [
            '.discount_final_price',
            '.discount_original_price',
            '.game_purchase_price',
            '[class*="price"]',
            '.market_listing_price',
            '.price',
            '.discount_prices',
            '.game_purchase_action',
            '.discount_block'
        ];

        for (let selector of priceSelectors) {
            const elements = document.querySelectorAll(selector);
            for (let el of elements) {
                const text = el.textContent || '';

                // First check for exact matches of symbols
                for (let [symbol, code] of Object.entries(symbolToCode)) {
                    if (text.includes(symbol)) {
                        originalCurrency = code;
                        console.log(`Detected original currency: ${code} from symbol: ${symbol} in text: "${text}"`);
                        return originalCurrency;
                    }
                }

                // Check for currency code patterns (e.g., "10 USD", "15 EUR")
                const currencyCodePattern = /\d+\s*([A-Z]{3})/g;
                let match;
                while ((match = currencyCodePattern.exec(text)) !== null) {
                    const code = match[1];
                    if (ALL_CURRENCIES.includes(code)) {
                        originalCurrency = code;
                        console.log(`Detected original currency: ${code} from currency code pattern in text: "${text}"`);
                        return originalCurrency;
                    }
                }

                // Special check for USD - look for numbers ending with $ or starting with $
                if (/\$\s*\d+|\d+\s*\$/i.test(text)) {
                    originalCurrency = 'USD';
                    console.log(`Detected USD from price pattern: ${text}`);
                    return originalCurrency;
                }

                // Special check for CHF - look for numbers ending with CHF
                if (/CHF\s*\d+|\d+\s*CHF/i.test(text)) {
                    originalCurrency = 'CHF';
                    console.log(`Detected CHF from price pattern: ${text}`);
                    return originalCurrency;
                }

                // Special check for RUB - look for numbers ending with руб.
                if (/руб\.?\s*\d+|\d+\s*руб\.?/i.test(text)) {
                    originalCurrency = 'RUB';
                    console.log(`Detected RUB from price pattern: ${text}`);
                    return originalCurrency;
                }

                // Special check for GBP - look for numbers ending with £
                if (/£\s*\d+|\d+\s*£/i.test(text)) {
                    originalCurrency = 'GBP';
                    console.log(`Detected GBP from price pattern: ${text}`);
                    return originalCurrency;
                }

                // Special check for INR - look for numbers ending with ₹
                if (/₹\s*\d+|\d+\s*₹/i.test(text)) {
                    originalCurrency = 'INR';
                    console.log(`Detected INR from price pattern: ${text}`);
                    return originalCurrency;
                }

                // Special check for JPY - look for numbers ending with ¥
                if (/¥\s*\d+|\d+\s*¥/i.test(text)) {
                    originalCurrency = 'JPY';
                    console.log(`Detected JPY from price pattern: ${text}`);
                    return originalCurrency;
                }

                // Special check for CAD - look for numbers ending with CDN$
                if (/CDN\$\s*\d+|\d+\s*CDN\$/i.test(text)) {
                    originalCurrency = 'CAD';
                    console.log(`Detected CAD from price pattern: ${text}`);
                    return originalCurrency;
                }

                // Special check for AUD - look for numbers ending with A$
                if (/A\$\s*\d+|\d+\s*A\$/i.test(text)) {
                    originalCurrency = 'AUD';
                    console.log(`Detected AUD from price pattern: ${text}`);
                    return originalCurrency;
                }
            }
        }

        // Check entire page text for specific symbols
        const bodyText = document.body.innerText;

        // Check in order of priority (more specific first)
        if (bodyText.includes('₴')) {
            originalCurrency = 'UAH';
        } else if (bodyText.includes('₽') || bodyText.includes('руб.')) {
            originalCurrency = 'RUB';
        } else if (bodyText.includes('₺')) {
            originalCurrency = 'TRY';
        } else if (bodyText.includes('₹')) {
            originalCurrency = 'INR';
        } else if (bodyText.includes('¥')) {
            originalCurrency = 'JPY';
        } else if (bodyText.includes('£')) {
            originalCurrency = 'GBP';
        } else if (bodyText.includes('€')) {
            originalCurrency = 'EUR';
        } else if (bodyText.includes('₸')) {
            originalCurrency = 'KZT';
        } else if (bodyText.includes('Ft')) {
            originalCurrency = 'HUF';
        } else if (bodyText.includes('lei')) {
            originalCurrency = 'RON';
        } else if (bodyText.includes('元')) {
            originalCurrency = 'CNY';
        } else if (bodyText.includes('zł')) {
            originalCurrency = 'PLN';
        } else if (bodyText.includes('Kč')) {
            originalCurrency = 'CZK';
        } else if (bodyText.includes('Br')) {
            originalCurrency = 'BYN';
        } else if (bodyText.includes('CHF') || bodyText.includes('CHF ')) {
            originalCurrency = 'CHF';
        } else if (bodyText.includes('$AR') || bodyText.includes('AR$')) {
            originalCurrency = 'ARS';
        } else if (bodyText.includes('CA$')) {
            originalCurrency = 'CAD';
        } else if (bodyText.includes('A$')) {
            originalCurrency = 'AUD';
        } else if (bodyText.includes('$') || bodyText.includes('USD')) {
            originalCurrency = 'USD';
        } else {
            originalCurrency = 'USD'; // Default to USD
        }

        console.log(`Final detected currency: ${originalCurrency} from body text analysis`);
        return originalCurrency;
    }

    // Saving original HTML of elements
    function saveOriginalPrices() {
        const priceSelectors = [
            '.discount_final_price',
            '.discount_original_price',
            '.game_purchase_price',
            '[class*="price"]',
            '.market_listing_price',
            '.price',
            '.discount_prices',
            '.game_purchase_action',
            '.discount_block'
        ];

        priceSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Check if element hasn't been processed yet
                if (!priceElements.has(el) && !el.hasAttribute('data-price-converted')) {
                    const originalHTML = el.innerHTML;
                    const originalText = el.textContent.trim();

                    // Check if element contains a price (numbers + currency symbol)
                    const hasPrice = /[\d.,]/.test(originalText) &&
                                   (originalText.includes('$') ||
                                    originalText.includes('€') ||
                                    originalText.includes('₽') ||
                                    originalText.includes('₴') ||
                                    originalText.includes('₺') ||
                                    originalText.includes('£') ||
                                    originalText.includes('¥') ||
                                    originalText.includes('CHF') ||
                                    originalText.includes('zł') ||
                                    originalText.includes('Kč') ||
                                    originalText.includes('Ft') ||
                                    originalText.includes('lei') ||
                                    originalText.includes('元') ||
                                    originalText.includes('₸') ||
                                    originalText.includes('Br') ||
                                    originalText.includes('₹') ||
                                    originalText.includes('CA$') ||
                                    originalText.includes('A$') ||
                                    originalText.includes('$AR') ||
                                    originalText.includes('AR$') ||
                                    originalText.includes('руб.') ||
                                    originalText.includes('руб') ||
                                    originalText.includes('CDN$') ||
                                    /\d+\s*[A-Z]{3}/i.test(originalText)); // For cases like "10 USD"

                    if (originalText && hasPrice) {
                        priceElements.set(el, {
                            originalHTML: originalHTML,
                            originalText: originalText,
                            originalCurrency: detectOriginalCurrency()
                        });
                        console.log(`Saved price element: ${originalText} (currency: ${detectOriginalCurrency()})`);
                    }
                }
            });
        });
    }

    // Getting currency rates (called only when switching)
    async function getExchangeRate(fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return 1;

        try {
            console.log(`Fetching exchange rate ${fromCurrency} -> ${toCurrency}`);
            const response = await new Promise((resolve, reject) =>
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency.toLowerCase()}.json`,
                    onload: resolve,
                    onerror: reject,
                    timeout: 10000
                })
            );

            const data = JSON.parse(response.responseText);
            const rate = data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];
            console.log(`Exchange rate ${fromCurrency} -> ${toCurrency}: ${rate}`);
            return rate || 1;
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            return 1;
        }
    }

    // Converting price in text
    function convertPriceInText(text, rate, targetCurrency) {
        // Check if text already contains target currency (indicating it's already converted)
        const targetSymbol = currencySymbols[targetCurrency] || (targetCurrency + ' ');

        // More accurate check - look for target symbol followed by a number
        const targetCurrencyPattern = new RegExp(`${targetSymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[\\d\\s,.]`, 'i');
        if (targetCurrencyPattern.test(text)) {
            return text; // Already converted
        }

        // Find numbers preceding currency symbols in original currency
        const originalSymbol = currencySymbols[originalCurrency] || originalCurrency;

        // Special handling for different currencies
        let priceRegex;
        if (originalCurrency === 'USD') {
            // For USD, look for different variations: $10, 10$, $ 10, 10 $, 10 USD
            priceRegex = /(\$)\s*([\d\s,.]+)|([\d\s,.]+)\s*(\$)|([\d\s,.]+)\s*(USD)/gi;
        } else if (originalCurrency === 'RUB') {
            // For RUB, look for: 465 руб., 139 руб.
            priceRegex = /([\d\s,.]+)\s*(руб\.?)/gi;
        } else if (originalCurrency === 'GBP') {
            // For GBP, look for: £8.59, £3.43
            priceRegex = /(£)\s*([\d\s,.]+)/gi;
        } else if (originalCurrency === 'INR') {
            // For INR, look for: ₹ 499, ₹ 199
            priceRegex = /(₹)\s*([\d\s,.]+)/gi;
        } else if (originalCurrency === 'JPY') {
            // For JPY, look for: ¥ 1,320, ¥ 528
            priceRegex = /(¥)\s*([\d\s,.]+)/gi;
        } else if (originalCurrency === 'CAD') {
            // For CAD, look for: CDN$ 13.49, CDN$ 5.39
            priceRegex = /(CDN\$)\s*([\d\s,.]+)/gi;
        } else if (originalCurrency === 'AUD') {
            // For AUD, look for: A$ 14.95, A$ 5.98
            priceRegex = /(A\$)\s*([\d\s,.]+)/gi;
        } else {
            // For other currencies, use standard approach
            const escapedSymbol = originalSymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            priceRegex = new RegExp(`([\\d\\s,.]+)\\s*${escapedSymbol}|([\\d\\s,.]+)\\s*(${originalCurrency})`, 'gi');
        }

        if (originalCurrency === 'USD') {
            let result = text.replace(priceRegex, (match, dollarBefore, amountBefore, amountAfter, dollarAfter, amountUSD, usdCode) => {
                const amount = amountBefore || amountAfter || amountUSD;
                const cleanNumber = amount.replace(/[\s,]/g, '').replace(',', '.');
                const price = parseFloat(cleanNumber);

                if (!isNaN(price) && price > 0) {
                    const convertedPrice = (price * rate).toFixed(2);
                    return targetSymbol + convertedPrice;
                }
                return match;
            });

            // Remove remaining USD and $ anywhere
            result = result.replace(/USD/gi, '').replace(/\$/g, '').replace(/\s+/g, ' ').trim();
            return result;
        } else if (originalCurrency === 'RUB') {
            const result = text.replace(priceRegex, (match, amount, rubSymbol) => {
                const cleanNumber = amount.replace(/[\s,]/g, '').replace(',', '.');
                const price = parseFloat(cleanNumber);

                if (!isNaN(price) && price > 0) {
                    const convertedPrice = (price * rate).toFixed(2);
                    return targetSymbol + convertedPrice;
                }
                return match;
            });
            // Remove remaining руб. anywhere
            const cleanedResult = result.replace(/руб\.?/gi, '').replace(/\s+/g, ' ').trim();
            return cleanedResult;
        } else if (originalCurrency === 'GBP') {
            const result = text.replace(priceRegex, (match, poundSymbol, amount) => {
                const cleanNumber = amount.replace(/[\s,]/g, '').replace(',', '.');
                const price = parseFloat(cleanNumber);

                if (!isNaN(price) && price > 0) {
                    const convertedPrice = (price * rate).toFixed(2);
                    return targetSymbol + convertedPrice;
                }
                return match;
            });
            // Remove remaining £ anywhere
            const cleanedResult = result.replace(/£/gi, '').replace(/\s+/g, ' ').trim();
            return cleanedResult;
        } else if (originalCurrency === 'INR') {
            const result = text.replace(priceRegex, (match, rupeeSymbol, amount) => {
                const cleanNumber = amount.replace(/[\s,]/g, '').replace(',', '.');
                const price = parseFloat(cleanNumber);

                if (!isNaN(price) && price > 0) {
                    const convertedPrice = (price * rate).toFixed(2);
                    return targetSymbol + convertedPrice;
                }
                return match;
            });
            // Remove remaining ₹ anywhere
            const cleanedResult = result.replace(/₹/gi, '').replace(/\s+/g, ' ').trim();
            return cleanedResult;
        } else if (originalCurrency === 'JPY') {
            const result = text.replace(priceRegex, (match, yenSymbol, amount) => {
                const cleanNumber = amount.replace(/[\s,]/g, '').replace(',', '.');
                const price = parseFloat(cleanNumber);

                if (!isNaN(price) && price > 0) {
                    const convertedPrice = (price * rate).toFixed(2);
                    return targetSymbol + convertedPrice;
                }
                return match;
            });
            // Remove remaining ¥ anywhere
            const cleanedResult = result.replace(/¥/gi, '').replace(/\s+/g, ' ').trim();
            return cleanedResult;
        } else if (originalCurrency === 'CAD') {
            const result = text.replace(priceRegex, (match, cadSymbol, amount) => {
                const cleanNumber = amount.replace(/[\s,]/g, '').replace(',', '.');
                const price = parseFloat(cleanNumber);

                if (!isNaN(price) && price > 0) {
                    const convertedPrice = (price * rate).toFixed(2);
                    return targetSymbol + convertedPrice;
                }
                return match;
            });
            // Remove remaining CDN$ anywhere
            const cleanedResult = result.replace(/CDN\$/gi, '').replace(/\s+/g, ' ').trim();
            return cleanedResult;
        } else if (originalCurrency === 'AUD') {
            const result = text.replace(priceRegex, (match, audSymbol, amount) => {
                const cleanNumber = amount.replace(/[\s,]/g, '').replace(',', '.');
                const price = parseFloat(cleanNumber);

                if (!isNaN(price) && price > 0) {
                    const convertedPrice = (price * rate).toFixed(2);
                    return targetSymbol + convertedPrice;
                }
                return match;
            });
            // Remove remaining A$ anywhere
            const cleanedResult = result.replace(/A\$/gi, '').replace(/\s+/g, ' ').trim();
            return cleanedResult;
        } else {
            let result = text.replace(priceRegex, (match, amount, symbol, amountCode, currencyCode) => {
                const amountValue = amount || amountCode;
                const cleanNumber = amountValue.replace(/[\s,]/g, '').replace(',', '.');
                const price = parseFloat(cleanNumber);

                if (!isNaN(price) && price > 0) {
                    const convertedPrice = (price * rate).toFixed(2);
                    return targetSymbol + convertedPrice;
                }
                return match;
            });

            // Remove remaining original currency symbol anywhere
            const escapedOriginalSymbol = originalSymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            result = result.replace(new RegExp(`${escapedOriginalSymbol}`, 'gi'), '').replace(/\s+/g, ' ').trim();
            return result;
        }
    }

    // Converting all saved prices using current rate
    function convertAllPrices() {
        if (isConverting) return;
        isConverting = true;

        const targetCurrency = getUserCurrency();
        const fromCurrency = detectOriginalCurrency();

        console.log(`Converting prices using rate: ${currentRate}`);

        if (fromCurrency === targetCurrency || currentRate === 1) {
            // Restore original HTML
            priceElements.forEach((data, element) => {
                if (element && element.parentNode) {
                    element.innerHTML = data.originalHTML;
                    element.removeAttribute('title');
                    element.removeAttribute('data-price-converted');
                }
            });
        } else {
            // Convert prices in each element
            priceElements.forEach((data, element) => {
                if (element && element.parentNode) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data.originalHTML;

                    // Special handling for discount cards
                    if (element.classList.contains('discount_prices') || element.closest('.discount_block')) {
                        // Process child elements with prices
                        const priceElements = tempDiv.querySelectorAll('.discount_original_price, .discount_final_price');
                        priceElements.forEach(priceEl => {
                            const originalText = priceEl.textContent;
                            if (/[\d.,]/.test(originalText)) {
                                // Check if it already contains target currency
                                const targetSymbol = currencySymbols[targetCurrency] || (targetCurrency + ' ');
                                if (!originalText.includes(targetSymbol)) {
                                    const convertedText = convertPriceInText(originalText, currentRate, targetCurrency);
                                    if (convertedText !== originalText) {
                                        priceEl.textContent = convertedText;
                                        priceEl.title = `Original: ${originalText}`;
                                    }
                                }
                            }
                        });
                    } else {
                        // Standard processing for regular elements
                        const walker = document.createTreeWalker(
                            tempDiv,
                            NodeFilter.SHOW_TEXT,
                            null,
                            false
                        );

                        let textNode;
                        while (textNode = walker.nextNode()) {
                            const originalText = textNode.textContent;
                            if (/[\d.,]/.test(originalText)) {
                                // Check if it already contains target currency
                                const targetSymbol = currencySymbols[targetCurrency] || (targetCurrency + ' ');
                                if (!originalText.includes(targetSymbol)) {
                                    const convertedText = convertPriceInText(originalText, currentRate, targetCurrency);
                                    if (convertedText !== originalText) {
                                        textNode.textContent = convertedText;
                                    }
                                }
                            }
                        }
                    }

                    element.innerHTML = tempDiv.innerHTML;
                    element.title = `Original: ${data.originalText}`;
                    element.setAttribute('data-price-converted', 'true');
                }
            });
        }

        setTimeout(() => { isConverting = false; }, 100);
    }

    let isConverting = false; // Flag to prevent recursion

    // Processing new elements
    function processNewElements() {
        if (isConverting) return; // Avoid recursion

        const oldSize = priceElements.size;
        saveOriginalPrices();
        const newSize = priceElements.size;

        // Convert only if new elements were added
        if (newSize > oldSize && getUserCurrency() !== detectOriginalCurrency() && currentRate !== 1) {
            isConverting = true;

            // Convert only new elements
            const newElements = Array.from(priceElements.entries()).slice(oldSize);
            newElements.forEach(([element, data]) => {
                if (element && element.parentNode && !element.hasAttribute('data-price-converted')) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data.originalHTML;

                    // Special handling for discount cards
                    if (element.classList.contains('discount_prices') || element.closest('.discount_block')) {
                        const priceElements = tempDiv.querySelectorAll('.discount_original_price, .discount_final_price');
                        priceElements.forEach(priceEl => {
                            const originalText = priceEl.textContent;
                            if (/[\d.,]/.test(originalText)) {
                                // Check if it already contains target currency
                                const targetSymbol = currencySymbols[getUserCurrency()] || (getUserCurrency() + ' ');
                                if (!originalText.includes(targetSymbol)) {
                                    const convertedText = convertPriceInText(originalText, currentRate, getUserCurrency());
                                    if (convertedText !== originalText) {
                                        priceEl.textContent = convertedText;
                                        priceEl.title = `Original: ${originalText}`;
                                    }
                                }
                            }
                        });
                    } else {
                        // Standard processing for regular elements
                        const walker = document.createTreeWalker(
                            tempDiv,
                            NodeFilter.SHOW_TEXT,
                            null,
                            false
                        );

                        let textNode;
                        while (textNode = walker.nextNode()) {
                            const originalText = textNode.textContent;
                            if (/[\d.,]/.test(originalText)) {
                                // Check if it already contains target currency
                                const targetSymbol = currencySymbols[getUserCurrency()] || (getUserCurrency() + ' ');
                                if (!originalText.includes(targetSymbol)) {
                                    const convertedText = convertPriceInText(originalText, currentRate, getUserCurrency());
                                    if (convertedText !== originalText) {
                                        textNode.textContent = convertedText;
                                    }
                                }
                            }
                        }
                    }

                    element.innerHTML = tempDiv.innerHTML;
                    element.title = `Original: ${data.originalText}`;
                    element.setAttribute('data-price-converted', 'true');
                }
            });

            setTimeout(() => { isConverting = false; }, 100);
        }
    }

    // Initialization
    async function init() {
        console.log('Initializing currency converter...');

        // Reset currency detection on each initialization
        originalCurrency = null;
        priceElements.clear();

        detectOriginalCurrency();
        addCurrencyPanel();
        saveOriginalPrices();

        // Get initial rate if selected currency is different from original
        const targetCurrency = getUserCurrency();
        const detectedCurrency = detectOriginalCurrency();

        console.log(`Target currency: ${targetCurrency}, Detected currency: ${detectedCurrency}`);

        if (targetCurrency !== detectedCurrency) {
            currentRate = await getExchangeRate(detectedCurrency, targetCurrency);
            console.log(`Initial conversion rate: ${currentRate}`);
            convertAllPrices();
        } else {
            console.log('No conversion needed - currencies match');
        }
    }

    // Run after page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    // Tracking URL changes to handle region changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('URL changed, re-initializing currency converter...');
            setTimeout(init, 500); // Small delay to allow new content to load
        }
    }).observe(document, {subtree: true, childList: true});

    // Observing new elements with protection against recursion
    let observerTimeout;
    const observer = new MutationObserver((mutations) => {
        // Ignore changes in our currency panel
        const relevantMutations = mutations.filter(mutation => {
            return !mutation.target.closest(`#${PANEL_ID}`) &&
                   mutation.target.id !== PANEL_ID &&
                   !isConverting;
        });

        if (relevantMutations.length === 0) return;

        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(processNewElements, 500);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false // Do not track attribute changes
    });

})();