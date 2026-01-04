// ==UserScript==
// @name            Amazon CamelCamelCamel + Keepa Price Charts
// @version         2.0.0
// @description     Add CamelCamelCamel and Keepa price charts to Amazon product pages.
// @author          miki.it
// @namespace       https://github.com/mikispag/userscripts/
// @homepage        https://github.com/mikispag/userscripts/
// @match           https://www.amazon.com/*
// @match           https://www.amazon.co.uk/*
// @match           https://www.amazon.de/*
// @match           https://www.amazon.fr/*
// @match           https://www.amazon.it/*
// @match           https://www.amazon.es/*
// @match           https://www.amazon.ca/*
// @match           https://www.amazon.co.jp/*
// @match           https://www.amazon.in/*
// @match           https://www.amazon.com.br/*
// @match           https://www.amazon.com.mx/*
// @match           https://www.amazon.com.au/*
// @match           https://www.amazon.nl/*
// @match           https://www.amazon.sg/*
// @match           https://www.amazon.ae/*
// @match           https://www.amazon.sa/*
// @match           https://www.amazon.se/*
// @match           https://www.amazon.pl/*
// @match           https://www.amazon.com.tr/*
// @match           https://www.amazon.eg/*
// @match           https://www.amazon.com.be/*
// @run-at          document-idle
// @grant           GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/416590/Amazon%20CamelCamelCamel%20%2B%20Keepa%20Price%20Charts.user.js
// @updateURL https://update.greasyfork.org/scripts/416590/Amazon%20CamelCamelCamel%20%2B%20Keepa%20Price%20Charts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_ID = 'ccc-keepa-charts';
    const DEBUG = false;

    // Domain mappings for CamelCamelCamel
    const CAMEL_COUNTRY_MAP = {
        'com': 'us',
        'co.uk': 'uk',
        'de': 'de',
        'fr': 'fr',
        'it': 'it',
        'es': 'es',
        'ca': 'ca',
        'co.jp': 'jp',
        'com.au': 'au',
        'com.br': 'br',
        'com.mx': 'mx',
        'in': 'in',
        'nl': 'nl',
        'se': 'se',
        'sg': 'sg',
        'pl': 'pl',
        'com.be': 'be',
        'com.tr': 'tr',
        'ae': 'ae',
        'sa': 'sa',
        'eg': 'eg'
    };

    // Domain IDs for Keepa API
    const KEEPA_DOMAIN_MAP = {
        'com': 1,
        'co.uk': 2,
        'de': 3,
        'fr': 4,
        'co.jp': 5,
        'ca': 6,
        'it': 8,
        'es': 9,
        'in': 10,
        'com.mx': 11,
        'com.br': 12,
        'com.au': 13,
        'nl': 14,
        'com.tr': 15,
        'ae': 16,
        'sg': 17,
        'sa': 18,
        'se': 19,
        'pl': 20,
        'eg': 21,
        'com.be': 22
    };

    // Possible parent elements to attach charts (in order of preference)
    const PARENT_SELECTORS = [
        '#centerCol',
        '#unifiedPrice_feature_div',
        '#corePrice_feature_div',
        '#corePriceDisplay_desktop_feature_div',
        '#apex_desktop',
        '#MediaMatrix',
        '#rightCol',
        '#ppd',
        '#dp-container'
    ];

    function log(...args) {
        if (DEBUG) console.log(`[${SCRIPT_ID}]`, ...args);
    }

    function warn(...args) {
        console.warn(`[${SCRIPT_ID}]`, ...args);
    }

    /**
     * Extract TLD from current hostname
     * Handles compound TLDs like co.uk, co.jp, com.au, etc.
     */
    function getTLD() {
        const hostname = window.location.hostname;
        const match = hostname.match(/amazon\.(.+)$/);
        if (!match) return null;
        return match[1];
    }

    /**
     * Get ASIN using multiple detection methods
     */
    function getASIN() {
        // Method 1: Hidden input field
        const asinInput = document.getElementById('ASIN');
        if (asinInput?.value) {
            log('ASIN found via #ASIN input');
            return asinInput.value;
        }

        // Method 2: data-asin attribute on product element
        const productDiv = document.getElementById('dp');
        if (productDiv?.dataset?.asin) {
            log('ASIN found via #dp data-asin');
            return productDiv.dataset.asin;
        }

        // Method 3: Any element with data-asin (first non-empty)
        const dataAsinElement = document.querySelector('[data-asin]:not([data-asin=""])');
        if (dataAsinElement?.dataset?.asin) {
            log('ASIN found via [data-asin] selector');
            return dataAsinElement.dataset.asin;
        }

        // Method 4: URL pattern /dp/ASIN or /gp/product/ASIN
        const urlMatch = window.location.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/i);
        if (urlMatch) {
            log('ASIN found via URL pattern');
            return urlMatch[1];
        }

        // Method 5: Canonical link
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            const canonicalMatch = canonical.href.match(/\/dp\/([A-Z0-9]{10})/i);
            if (canonicalMatch) {
                log('ASIN found via canonical link');
                return canonicalMatch[1];
            }
        }

        // Method 6: Detail page JSON (LD+JSON)
        const ldJsonScripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of ldJsonScripts) {
            try {
                const data = JSON.parse(script.textContent);
                if (data?.sku) {
                    log('ASIN found via LD+JSON');
                    return data.sku;
                }
            } catch (e) {
                // Ignore parsing errors
            }
        }

        return null;
    }

    /**
     * Find suitable parent element for chart injection
     */
    function findParentElement() {
        for (const selector of PARENT_SELECTORS) {
            const element = document.querySelector(selector);
            if (element) {
                log('Parent element found:', selector);
                return element;
            }
        }
        return null;
    }

    /**
     * Check if we're on a product page
     */
    function isProductPage() {
        return (
            window.location.pathname.includes('/dp/') ||
            window.location.pathname.includes('/gp/product/') ||
            window.location.pathname.includes('/gp/aw/d/') ||
            document.getElementById('dp') !== null ||
            document.getElementById('ppd') !== null
        );
    }

    /**
     * Add styles for the chart container
     */
    function addStyles() {
        const css = `
            #${SCRIPT_ID}-container {
                margin: 16px 0;
                padding: 10px 16px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background: #fafafa;
            }

            #${SCRIPT_ID}-container .chart-wrapper {
                margin-bottom: 12px;
                text-align: center;
            }

            #${SCRIPT_ID}-container .chart-wrapper:last-child {
                margin-bottom: 0;
            }

            #${SCRIPT_ID}-container .chart-title {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 8px;
                color: #333;
            }

            #${SCRIPT_ID}-container .chart-link {
                display: inline-block;
                text-decoration: none;
            }

            #${SCRIPT_ID}-container .chart-img {
                max-width: 100%;
                height: auto;
                border-radius: 4px;
                transition: opacity 0.3s ease;
            }

            #${SCRIPT_ID}-container .chart-img.loading {
                opacity: 0.5;
            }

            #${SCRIPT_ID}-container .chart-img.error {
                display: none;
            }

            #${SCRIPT_ID}-container .chart-error {
                display: none;
                color: #c00;
                font-size: 12px;
                padding: 20px;
                background: #fff0f0;
                border-radius: 4px;
            }

            #${SCRIPT_ID}-container .chart-wrapper.has-error .chart-error {
                display: block;
            }

            #${SCRIPT_ID}-container .collapse-toggle {
                cursor: pointer;
                user-select: none;
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: bold;
                margin-bottom: 12px;
                color: #0066c0;
            }

            #${SCRIPT_ID}-container .collapse-toggle:hover {
                color: #c45500;
                text-decoration: underline;
            }

            #${SCRIPT_ID}-container .collapse-toggle::before {
                content: '▼';
                font-size: 10px;
                transition: transform 0.2s ease;
            }

            #${SCRIPT_ID}-container.collapsed .collapse-toggle::before {
                transform: rotate(-90deg);
            }

            #${SCRIPT_ID}-container.collapsed .charts-content {
                display: none;
            }

            #${SCRIPT_ID}-container.collapsed .collapse-toggle {
                margin-bottom: 0;
            }
        `;

        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    /**
     * Create chart element with loading/error states
     */
    function createChartElement(title, linkUrl, imageUrl, altText, id, visible = true) {
        const wrapper = document.createElement('div');
        wrapper.className = 'chart-wrapper';
        wrapper.setAttribute("id", id);
        if (!visible){
            wrapper.style.display = "none";
        }

        const titleDiv = document.createElement('div');
        titleDiv.className = 'chart-title';
        titleDiv.textContent = title;

        const link = document.createElement('a');
        link.className = 'chart-link';
        link.href = linkUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.title = `View on ${title}`;

        const img = document.createElement('img');
        img.className = 'chart-img loading';
        img.alt = altText;
        if (visible){
            img.loading = 'lazy';
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'chart-error';
        errorDiv.textContent = `Unable to load ${title} chart. Click title to view on site.`;

        img.addEventListener('load', () => {
            img.classList.remove('loading');
        });

        img.addEventListener('error', () => {
            img.classList.add('error');
            wrapper.classList.add('has-error');
            log(`Failed to load image: ${imageUrl}`);
        });

        // Set src after event listeners
        img.src = imageUrl;

        link.appendChild(img);
        wrapper.appendChild(titleDiv);
        wrapper.appendChild(link);
        wrapper.appendChild(errorDiv);

        return wrapper;
    }

    /**
     * Main function to inject charts
     */
    function injectCharts(refresh = false) {
        // Prevent duplicate injection
        if (!refresh && document.getElementById(`${SCRIPT_ID}-container`)) {
            log('Charts already injected');
            return;
        }

        if (!isProductPage()) {
            log('Not a product page, skipping');
            return;
        }

        const asin = getASIN();
        if (!asin) {
            warn('Could not find ASIN on this page');
            return;
        }

        const tld = getTLD();
        if (!tld) {
            warn('Could not determine Amazon TLD');
            return;
        }

        const camelCountry = CAMEL_COUNTRY_MAP[tld];
        const keepaDomain = KEEPA_DOMAIN_MAP[tld];

        if (!camelCountry && !keepaDomain) {
            warn(`Unsupported Amazon region: ${tld}`);
            return;
        }

        const parentElement = findParentElement();
        if (!parentElement) {
            warn('Could not find suitable parent element');
            return;
        }

        log(`Injecting charts for ASIN: ${asin}, TLD: ${tld}`);

        addStyles();

        // Create main container
        const container = document.createElement('div');
        container.id = `${SCRIPT_ID}-container`;

        // Create collapsible header
        const toggle = document.createElement('div');
        toggle.className = 'collapse-toggle';
        toggle.textContent = 'Price History Charts';
        toggle.addEventListener('click', () => {
            container.classList.toggle('collapsed');
            // Save preference
            try {
                localStorage.setItem(`${SCRIPT_ID}-collapsed`, container.classList.contains('collapsed'));
            } catch (e) {
                // Ignore storage errors
            }
        });

        // Restore collapsed state
        try {
            if (localStorage.getItem(`${SCRIPT_ID}-collapsed`) === 'true') {
                container.classList.add('collapsed');
            }
        } catch (e) {
            // Ignore storage errors
        }

        const chartsContent = document.createElement('div');
        chartsContent.className = 'charts-content';

        // Add CamelCamelCamel chart
        if (camelCountry) {
            const camelChart = createChartElement(
                'CamelCamelCamel',
                `https://${camelCountry}.camelcamelcamel.com/product/${asin}`,
                `https://charts.camelcamelcamel.com/${camelCountry}/${asin}/amazon-new-used.png?force=1&zero=0&w=500&h=400&desired=false&legend=1&ilt=1&tp=all&fo=0`,
                `CamelCamelCamel price history for ${asin}`,
                "camelChart",
                !refresh
            );
            if (!refresh)
            {
                chartsContent.appendChild(camelChart);
            }
            else
            {
                let currentChart = document.getElementById("camelChart");
                currentChart.parentNode.append(camelChart);

                setTimeout(() => {
                    currentChart.style.display = "none";
                    camelChart.style.display = "initial";
                    currentChart.remove();
                ;}, 500);
            }
        }

        // Add Keepa chart
        if (keepaDomain) {
            const keepaChart = createChartElement(
                'Keepa',
                `https://keepa.com/#!product/${keepaDomain}-${asin}`,
                `https://graph.keepa.com/pricehistory.png?used=1&asin=${asin}&domain=${tld}`,
                `Keepa price history for ${asin}`,
                "keepaChart",
                !refresh
            );
            if (!refresh)
            {
                chartsContent.appendChild(keepaChart);
            }
            else
            {
                let currentChart = document.getElementById("keepaChart");
                currentChart.parentNode.append(keepaChart);

                setTimeout(() => {
                    currentChart.style.display = "none";
                    keepaChart.style.display = "initial";
                    currentChart.remove();
                ;}, 500);
            }

        }

        container.appendChild(toggle);
        container.appendChild(chartsContent);

        if (!refresh)
        {
            // Insert at beginning of parent element
        parentElement.insertBefore(container, parentElement.firstChild);
        }

        log('Charts injected successfully');
    }

    /**
     * Initialize with retry logic for dynamic content
     */
    function init(refresh = false) {
        // Try immediately
        injectCharts(refresh);

        // If charts weren't injected, set up observer for dynamic content
        if (!document.getElementById(`${SCRIPT_ID}-container`) && isProductPage()) {
            log('Setting up MutationObserver for dynamic content');

            let attempts = 0;
            const maxAttempts = 10;

            const observer = new MutationObserver((mutations, obs) => {
                attempts++;

                if (document.getElementById(`${SCRIPT_ID}-container`)) {
                    obs.disconnect();
                    return;
                }

                if (attempts >= maxAttempts) {
                    obs.disconnect();
                    warn('Max attempts reached, giving up');
                    return;
                }

                injectCharts();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Cleanup after 10 seconds regardless
            setTimeout(() => observer.disconnect(), 10000);
        }
    }

    // Handle SPA navigation (Amazon sometimes uses pushState)
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            log('URL changed, reinitializing');
            // Small delay to let page update
            setTimeout(function(){init(true);}, 500);
        }
    });

    urlObserver.observe(document.body, { childList: true, subtree: true });

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
