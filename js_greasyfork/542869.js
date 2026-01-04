// ==UserScript==
// @name         XBDeals Price Toolkit
// @namespace    https://github.com/sinazadeh/userscripts
// @version      1.0.2
// @description  The essential toolkit for xbdeals.net. Converts all prices (lists, history, charts) to USD
// @author       TheSina
// @match        *://xbdeals.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      cdn.jsdelivr.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542869/XBDeals%20Price%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/542869/XBDeals%20Price%20Toolkit.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
(function () {
    'use strict';

    // --- Constants and Global State ---
    const API_URL =
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
    const hiddenStores = ['ae'];
    const currencyMap = {
        ae: 'aed',
        ar: 'ars',
        at: 'eur',
        au: 'aud',
        be: 'eur',
        br: 'brl',
        ca: 'cad',
        ch: 'chf',
        cl: 'clp',
        co: 'cop',
        cz: 'czk',
        de: 'eur',
        dk: 'dkk',
        es: 'eur',
        fi: 'eur',
        fr: 'eur',
        gb: 'gbp',
        gr: 'eur',
        hk: 'hkd',
        hu: 'huf',
        ie: 'eur',
        il: 'ils',
        in: 'inr',
        it: 'eur',
        jp: 'jpy',
        kr: 'krw',
        mx: 'mxn',
        nl: 'eur',
        no: 'nok',
        nz: 'nzd',
        pl: 'pln',
        pt: 'eur',
        sa: 'sar',
        se: 'sek',
        sg: 'sgd',
        sk: 'eur',
        tr: 'try',
        tw: 'twd',
        us: 'usd',
        za: 'zar',
    };

    let ratesCache = null;

    // --- Utility Functions ---

    GM_addStyle(`
    .usd-price-appendix {
        display: block; font-size: 0.8em; font-weight: normal;
        color: #888; margin-top: 2px;
    }
    `);

    /**
     * Parses a price string into a float. Handles "FREE".
     */
    function parseAmount(text) {
        const cleanText = text.trim().toUpperCase();
        if (cleanText === 'FREE') return 0;

        let cleaned = text.replace(/[^\d.,]/g, '');
        if (cleaned.includes(',') && cleaned.includes('.')) {
            const lastComma = cleaned.lastIndexOf(',');
            const lastDot = cleaned.lastIndexOf('.');
            if (lastDot > lastComma) cleaned = cleaned.replace(/,/g, '');
            else cleaned = cleaned.replace(/\./g, '').replace(',', '.');
        } else if (cleaned.includes(',')) {
            const parts = cleaned.split(',');
            if (parts.length === 2 && parts[1].length <= 2)
                cleaned = cleaned.replace(',', '.');
            else cleaned = cleaned.replace(/,/g, '');
        }
        return parseFloat(cleaned);
    }

    async function fetchRates() {
        if (ratesCache) return ratesCache;
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: API_URL,
                onload: res => {
                    try {
                        ratesCache = JSON.parse(res.responseText).usd;
                        resolve(ratesCache);
                    } catch (e) {
                        console.error('Error parsing currency data:', e);
                        resolve(null);
                    }
                },
                onerror: err => {
                    console.error('Error fetching currency data:', err);
                    resolve(null);
                },
            });
        });
    }

    // --- Page-Specific Conversion Functions ---

    async function convertAndSort(container) {
        // Mark as processed immediately to prevent multiple runs on the same mutation event
        container.dataset.usdConverted = 'true';
        console.log('Running conversion for price comparison list...');

        const rates = await fetchRates();
        if (!rates) {
            delete container.dataset.usdConverted; // Allow a retry if API fails
            return;
        }

        container
            .closest('.compare-prices-container')
            ?.style.setProperty('height', 'auto', 'important');
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
        container.style.gap = '10px';

        const entries = Array.from(container.querySelectorAll('a'))
            .map(link => {
                const priceEl = link.querySelector('.compare-prices-price');
                if (!priceEl) return null;

                const regionCode = link
                    .getAttribute('href')
                    ?.match(/^\/([a-z]{2})-store/i)?.[1]
                    .toLowerCase();
                if (!regionCode || hiddenStores.includes(regionCode))
                    return null;

                const currencyCode = currencyMap[regionCode];
                const rate = rates[currencyCode];
                if (!currencyCode || !rate) return null;

                const rawText = priceEl.textContent
                    .replace(/\(≈.*?\)/g, '')
                    .trim();
                const localAmount = parseAmount(rawText);
                if (isNaN(localAmount)) return null;

                const usd = localAmount / rate;
                priceEl.textContent = `${rawText} ($${usd.toFixed(2)} USD)`;
                return {link, usdValue: usd};
            })
            .filter(Boolean);

        if (entries.length > 0) {
            entries.sort((a, b) => a.usdValue - b.usdValue);
            container.innerHTML = '';
            entries.forEach(entry => container.appendChild(entry.link));
        }
    }

    async function convertPriceHistory(container) {
        container.dataset.usdConverted = 'true';
        console.log('Running conversion for price history...');

        const rates = await fetchRates();
        if (!rates) {
            delete container.dataset.usdConverted; // Allow retry
            return;
        }

        const breadcrumbLink = document.querySelector(
            '.breadcrumb a[itemprop="item"]',
        );
        const regionCode = breadcrumbLink
            ?.getAttribute('href')
            ?.match(/^\/([a-z]{2})-store/i)?.[1]
            .toLowerCase();
        if (!regionCode) return;

        const currencyCode = currencyMap[regionCode];
        const rate = rates[currencyCode];
        if (!currencyCode || !rate) return;

        container.querySelectorAll('.game-stats-col-number-big').forEach(el => {
            if (el.parentNode.querySelector('.usd-price-appendix')) return; // Already done
            const localAmount = parseAmount(el.textContent);
            if (!isNaN(localAmount)) {
                const usd = localAmount / rate;
                const usdText = document.createElement('small');
                usdText.className = 'usd-price-appendix';
                usdText.textContent = `($${usd.toFixed(2)} USD)`;
                el.parentNode.appendChild(usdText);
            }
        });
    }

    // --- Main Execution Logic ---

    function runConversions() {
        // PATIENCE: Check for a container that is NOT processed AND has content.
        const listContainer = document.querySelector(
            '#compare-prices:not([data-usd-converted])',
        );
        if (
            listContainer &&
            listContainer.querySelector('a .compare-prices-price')
        ) {
            convertAndSort(listContainer);
        }

        // PATIENCE: Check for a container that is NOT processed AND has content.
        const historyContainer = document.querySelector(
            '.game-stats-price-history:not([data-usd-converted])',
        );
        if (
            historyContainer &&
            historyContainer.querySelector('.game-stats-col-number-big')
        ) {
            convertPriceHistory(historyContainer);
        }
    }

    // PERSISTENCE: This observer keeps watching the page for new content.
    const observer = new MutationObserver(runConversions);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
