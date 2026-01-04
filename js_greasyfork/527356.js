// ==UserScript==
// @name         GG.deals Steam Companion
// @namespace    http://tampermonkey.net/
// @version      1.6.4
// @description  Shows lowest price from gg.deals on Steam game pages
// @author       Crimsab
// @license      GPL-3.0-or-later
// @match        https://store.steampowered.com/app/*
// @match        https://store.steampowered.com/sub/*
// @match        https://store.steampowered.com/bundle/*
// @icon         https://gg.deals/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @connect      gg.deals
// @connect      api.gg.deals
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/527356/GGdeals%20Steam%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/527356/GGdeals%20Steam%20Companion.meta.js
// ==/UserScript==

// KNOWN LIMITATIONS: 
// Bundles always use web scraping, never API. The official api does not support steam bundles, giving null results.
// Subs (packages) and Apps can use either API or web scraping.
// Steam sub IDs are no longer supported by the API - all requests use app IDs.
// "Enable Scraping" toggle controls whether web scraping is used when API is disabled or fails.
// GG.deals website now uses Cloudflare protection which blocks automated requests (HTTP 403 errors). So most of the resolvers are disabled. 

(function () {
  "use strict";

  // Default color scheme
  const defaultColors = {
    background: "#16202d",
    headerBackground: "#0d141c",
    officialText: "#67c1f5",
    officialPrice: "#ffffff",
    keyshopText: "#67c1f5",
    keyshopPrice: "#ffffff",
    bestPrice: "#a4d007",
    buttonBackground: "linear-gradient(to right, #67c1f5 0%, #4a9bd5 100%)",
    buttonText: "#ffffff",
    borderColor: "#67c1f530"
  };

  // Get saved colors or use defaults
  const savedColors = {};
  Object.keys(defaultColors).forEach(key => {
    savedColors[key] = GM_getValue(`color_${key}`, defaultColors[key]);
  });

  // Function to apply colors
  function applyCustomColors() {
    let customCSS = `
      :root {
        --gg-deals-background: ${savedColors.background};
        --gg-deals-header-bg: ${savedColors.headerBackground};
        --gg-deals-official-text: ${savedColors.officialText};
        --gg-deals-official-price: ${savedColors.officialPrice};
        --gg-deals-keyshop-text: ${savedColors.keyshopText};
        --gg-deals-keyshop-price: ${savedColors.keyshopPrice};
        --gg-deals-best-price: ${savedColors.bestPrice};
        --gg-deals-button-bg: ${savedColors.buttonBackground};
        --gg-deals-button-text: ${savedColors.buttonText};
        --gg-deals-border-color: ${savedColors.borderColor};
      }
    `;
    
    // Create a style element for our custom colors
    const styleEl = document.getElementById('gg-deals-custom-colors') || document.createElement('style');
    styleEl.id = 'gg-deals-custom-colors';
    styleEl.textContent = customCSS;
    document.head.appendChild(styleEl);
  }

  GM_addStyle(`
        .gg-deals-container {
            background: var(--gg-deals-background, #16202d) !important;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            border: 1px solid var(--gg-deals-border-color, #67c1f530);
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            clear: both;
        }
        .gg-deals-container.compact {
            padding: 10px;
            margin: 10px 0;
        }
        .gg-deals-container.compact .gg-header,
        .gg-deals-container.compact .gg-attribution,
        .gg-deals-container.compact .gg-price-sections {
            display: none;
        }
        .gg-compact-row {
            display: none;
            align-items: center;
            gap: 15px;
            padding: 5px;
            flex-wrap: nowrap;
            min-width: 0;
        }
        .gg-deals-container.compact .gg-compact-row {
            display: flex;
        }
        .gg-compact-prices {
            display: flex;
            align-items: center;
            gap: 20px;
            flex: 1;
            min-width: 0;
            overflow: visible;
        }
        .gg-compact-price-item {
            display: flex;
            align-items: center;
            position: relative;
            gap: 8px;
            min-width: 0;
            flex-shrink: 1;
        }
        .gg-compact-price-item .gg-price-value {
            font-size: 18px;
        }
        .gg-price-value.best-price {
            color: var(--gg-deals-best-price, #a4d007);
            position: relative;
            padding-top: 16px;
        }
        .gg-price-value.best-price:before {
            content: "✓ Best Price";
            position: absolute;
            right: 0;
            top: 0;
            font-size: 12px;
            opacity: 0.9;
            color: var(--gg-deals-best-price, #a4d007);
            white-space: nowrap;
        }
        /* Hide the "Best Price" text in compact view */
        .gg-compact-price-item .gg-price-value.best-price {
            padding-top: 0;
        }
        .gg-compact-price-item .gg-price-value.best-price:before {
            display: none;
        }
        .gg-settings-dropdown {
            position: relative;
            display: inline-block;
        }
        .gg-settings-icon {
            cursor: pointer;
            padding: 5px;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        .gg-settings-icon:hover {
            opacity: 1;
        }
        .gg-settings-icon svg {
            width: 20px;
            height: 20px;
            fill: var(--gg-deals-official-text, #67c1f5);
        }
        .gg-settings-content {
            display: none;
            position: absolute;
            right: 0;
            background: var(--gg-deals-background, #16202d);
            min-width: 160px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            border: 1px solid var(--gg-deals-border-color, #67c1f530);
            border-radius: 4px;
            z-index: 1000;
            padding: 10px;
        }
        .gg-settings-content.show {
            display: block;
        }
        .gg-compact-controls {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
        }
        .gg-tooltip {
            position: relative;
            display: inline-block;
        }
        .gg-tooltip:hover .gg-tooltip-text {
            visibility: visible;
            opacity: 1;
        }
        .gg-tooltip-text {
            visibility: hidden;
            opacity: 0;
            background-color: var(--gg-deals-background, #16202d);
            color: #fff;
            text-align: center;
            padding: 5px 10px;
            border-radius: 4px;
            border: 1px solid var(--gg-deals-border-color, #67c1f530);
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            transition: opacity 0.2s;
            font-size: 12px;
        }
        /* New historical tooltip styles */
        .gg-historical-tooltip {
            position: relative;
            display: inline-block;
        }
        .gg-historical-tooltip:hover .gg-historical-tooltip-text {
            visibility: visible;
            opacity: 1;
        }
        .gg-historical-tooltip-text {
            visibility: hidden;
            opacity: 0;
            background-color: var(--gg-deals-background, #16202d);
            color: #fff;
            text-align: center;
            padding: 5px 10px;
            border-radius: 4px;
            border: 1px solid var(--gg-deals-border-color, #67c1f530);
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            transition: opacity 0.2s;
            font-size: 12px;
        }
        .gg-controls {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid var(--gg-deals-border-color, rgba(103, 193, 245, 0.1));
        }
        .gg-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: -15px -15px 15px -15px;
            padding: 15px;
            background: var(--gg-deals-header-bg, rgb(13, 20, 28));
            border-radius: 4px 4px 0 0;
            border-bottom: 1px solid var(--gg-deals-border-color, rgba(103, 193, 245, 0.2));
            text-align: center;
        }
        .gg-title {
            color: var(--gg-deals-official-text, #67c1f5);
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .gg-title img {
            width: 32px;
            height: 32px;
            filter: brightness(1.2) drop-shadow(1px 1px 2px rgba(0,0,0,0.5));
        }
        .gg-attribution {
            color: #8f98a0;
            font-size: 11px;
            opacity: 0.8;
            font-style: italic;
            text-align: center;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid var(--gg-deals-border-color, rgba(103, 193, 245, 0.1));
        }
        .gg-price-sections {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 12px;
            background: #1b2838;
            border-radius: 3px;
            transition: all 0.3s ease;
            position: relative;
            min-height: 60px;
        }
        .gg-price-section {
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex: 1;
            min-width: 0;
        }
        .gg-price-left {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
        }
        .gg-price-label {
            color: var(--gg-deals-official-text, #67c1f5);
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
        }
        .gg-price-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-width: 120px;
            text-align: center;
            margin-left: 20px;
        }
        .gg-price-value {
            color: var(--gg-deals-official-price, #fff);
            font-weight: bold;
            font-size: 24px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            transition: color 0.3s ease;
            white-space: nowrap;
        }
        .gg-price-value.historical {
            font-size: 13px;
            color: var(--gg-deals-official-text, #acdbf5);
            opacity: 0.9;
            margin-top: 4px;
        }
        .gg-icon {
            width: 20px;
            height: 20px;
            filter: brightness(0.8);
            flex-shrink: 0;
        }
        .gg-footer {
            margin-top: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }
        .gg-view-offers {
            width: 100%;
            background: var(--gg-deals-button-bg, linear-gradient(to right, #67c1f5 0%, #4a9bd5 100%));
            padding: 8px 20px;
            border-radius: 3px;
            color: var(--gg-deals-button-text, #fff) !important;
            font-size: 14px;
            text-decoration: none !important;
            transition: all 0.2s ease;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
            text-align: center;
            white-space: nowrap;
        }
        .gg-view-offers:hover {
            background: var(--gg-deals-button-bg, linear-gradient(to right, #7dcbff 0%, #4a9bd5 100%));
            transform: translateY(-1px);
        }
        .gg-toggles {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .gg-toggle {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            user-select: none;
            opacity: 0.7;
            transition: opacity 0.2s ease;
            white-space: nowrap;
            color: var(--gg-deals-official-text, #67c1f5);
        }
        .gg-toggle:hover {
            opacity: 1;
        }
        .gg-toggle.active {
            opacity: 1;
        }
        .gg-toggle input {
            margin: 0;
        }
        .gg-toggle label {
            color: var(--gg-deals-official-text, #67c1f5);
            font-size: 12px;
        }

        @media (max-width: 640px) {
            .gg-price-sections {
                flex-direction: column;
                align-items: stretch;
                gap: 10px;
            }
            .gg-price-info {
                align-items: flex-start;
                margin-left: 28px;
            }
            .gg-price-value.best-price {
                padding-top: 0;
                padding-right: 80px;
            }
            .gg-price-value.best-price:before {
                top: 50%;
                transform: translateY(-50%);
                right: 0;
            }
            .gg-footer {
                flex-direction: column-reverse;
                align-items: stretch;
            }
            .gg-view-offers {
                text-align: center;
            }
            .gg-toggles {
                justify-content: center;
            }
        }

        .gg-icon-button {
            background: none;
            border: none;
            color: var(--gg-deals-official-text, #67c1f5);
            cursor: pointer;
            padding: 5px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
            opacity: 0.7;
            transition: all 0.2s ease;
        }
        .gg-icon-button:hover {
            opacity: 1;
            background: rgba(103, 193, 245, 0.1);
        }
        .gg-icon-button svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }
        .gg-refresh {
            padding: 5px 8px;
            display: flex;
            align-items: center;
            min-width: max-content;
            flex-shrink: 0;
            position: relative;
        }
        .gg-refresh svg {
            transition: transform 0.5s ease;
            stroke: currentColor;
            fill: none;
        }
        .gg-refresh.loading svg {
            transform: rotate(360deg);
        }
        .gg-refresh-text {
            display: none;
        }
        .gg-refresh:hover .gg-tooltip-text {
            visibility: visible;
            opacity: 1;
        }

        .github-icon {
            width: 16px;
            height: 16px;
            vertical-align: middle;
            margin: -2px 4px 0 2px;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        }
        .github-icon:hover {
            opacity: 1;
        }
        .gg-deals-container.compact .gg-controls {
            display: none;
        }
        .bundle-sub-display {
            background: var(--gg-deals-background, #16202d) !important;
            border-radius: 4px;
            border: 1px solid var(--gg-deals-border-color, #67c1f530);
            position: relative;
            z-index: 1;
        }
        .game_area_purchase_game + .bundle-sub-display {
            margin-top: -10px !important;
        }
        .bundle_contents_preview + .gg-deals-container {
            margin-top: 0 !important;
        }
        .game_area_purchase + .gg-deals-container {
            margin-top: 0 !important;
        }
        .gg-view-offers {
            display: inline-block;
            text-align: center;
            transition: transform 0.2s ease;
        }
        .gg-view-offers:hover {
            transform: translateY(-1px);
        }
        .gg-price-value {
            display: inline-block;
            min-width: 80px;
        }
        .gg-deals-container.compact .gg-view-offers {
            width: auto;
            min-width: 90px;
            white-space: nowrap;
            flex-shrink: 0;
        }
        .gg-api-key-input {
            width: 100%;
            padding: 6px 8px;
            margin: 8px 0;
            border: 1px solid var(--gg-deals-border-color, #67c1f530);
            border-radius: 3px;
            background: #121b28;
            color: #fff;
            font-size: 12px;
            box-sizing: border-box;
        }
        .gg-region-select {
            width: 100%;
            padding: 6px 8px;
            margin: 8px 0;
            border: 1px solid var(--gg-deals-border-color, #67c1f530);
            border-radius: 3px;
            background: #121b28;
            color: #fff;
            font-size: 12px;
            box-sizing: border-box;
        }
        .gg-settings-section {
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--gg-deals-border-color, rgba(103, 193, 245, 0.1));
        }
        .gg-settings-title {
            color: var(--gg-deals-official-text, #67c1f5);
            font-size: 13px;
            margin-bottom: 5px;
        }
        .gg-settings-content {
            width: 270px !important;
            max-width: 270px !important;
        }
        .gg-api-status {
            font-size: 11px;
            margin-top: 4px;
        }
        .gg-api-status.active {
            color: var(--gg-deals-best-price, #a4d007);
        }
        .gg-api-status.inactive {
            color: #ff7b7b;
        }
        .gg-save-button {
            background: var(--gg-deals-button-bg, linear-gradient(to right, #67c1f5 0%, #4a9bd5 100%));
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            color: var(--gg-deals-button-text, #fff);
            font-size: 12px;
            cursor: pointer;
            margin-top: 5px;
            transition: all 0.2s ease;
            width: 100%;
        }
        .gg-save-button:hover {
            background: var(--gg-deals-button-bg, linear-gradient(to right, #7dcbff 0%, #4a9bd5 100%));
        }
        .gg-api-key-wrapper {
            position: relative;
            width: 100%;
        }
        .gg-toggle-visibility {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--gg-deals-official-text, #67c1f5);
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
            padding: 0;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .gg-toggle-visibility:hover {
            opacity: 1;
        }
        .gg-toggle-visibility svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }
        
        /* Color picker styles */
        .gg-color-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin: 10px 0;
        }
        .gg-color-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .gg-color-label {
            font-size: 11px;
            color: var(--gg-deals-official-text, #67c1f5);
        }
        .gg-color-input {
            width: 100%;
            height: 24px;
            border: 1px solid var(--gg-deals-border-color, #67c1f530);
            border-radius: 3px;
            background: none;
            cursor: pointer;
        }
        .gg-reset-colors {
            background: none;
            border: 1px solid var(--gg-deals-border-color, #67c1f530);
            padding: 5px 10px;
            border-radius: 3px;
            color: var(--gg-deals-official-text, #67c1f5);
            font-size: 12px;
            cursor: pointer;
            margin-top: 5px;
            transition: all 0.2s ease;
            width: 100%;
        }
        .gg-reset-colors:hover {
            background: rgba(103, 193, 245, 0.1);
        }
    /* New styles for full view controls layout */
    .gg-deals-container:not(.compact) .gg-controls {
        display: flex;
        flex-direction: column; /* Main sections stacked */
        gap: 20px; /* Increased gap for better separation */
        margin-top: 20px; /* Increased margin */
        padding-top: 15px;
        border-top: 1px solid var(--gg-deals-border-color, rgba(103, 193, 245, 0.1));
        align-items: stretch; /* Allow children to define their own width fully */
    }

    .gg-deals-container:not(.compact) .gg-main-actions {
        display: flex;
        gap: 15px;
        align-items: center;
    }

    .gg-deals-container:not(.compact) .gg-main-actions .gg-view-offers {
        flex-grow: 1; /* Takes available space */
        width: auto; /* Override general width: 100% for flex context */
    }
    
    .gg-deals-container:not(.compact) .gg-main-actions .gg-refresh {
        flex-shrink: 0; /* Prevent refresh icon from shrinking */
    }

    .gg-deals-container:not(.compact) .gg-settings-panels {
        display: flex;
        flex-direction: row;
        gap: 15px;
        flex-wrap: wrap; /* Allow panels to wrap to next line if not enough space */
    }

    .gg-deals-container:not(.compact) .gg-settings-panels .gg-settings-section {
        flex: 1 1 240px; /* Grow, Shrink, Basis */
        padding: 15px;
        border: 1px solid var(--gg-deals-border-color);
        border-radius: 4px;
        background: rgba(0,0,0,0.05); /* Slightly lighter background for panels */
        margin-bottom: 0; 
        /* border-bottom property from general .gg-settings-section will be overridden by the border property here */
    }
    
    .gg-deals-container:not(.compact) .gg-settings-panels .gg-settings-title { /* More specific selector for title */
        margin-bottom: 12px;
        font-weight: bold;
        color: var(--gg-deals-official-text); 
    }
    /* End of new styles */
    `);

  // Get saved toggle states or set defaults
  const toggleStates = {
    official: GM_getValue("showOfficial", true),
    keyshop: GM_getValue("showKeyshop", true),
    compact: GM_getValue("compactView", false),
    subDisplay: GM_getValue("showSubDisplay", true),
    useApi: GM_getValue("useApi", false),
    enableScraping: GM_getValue("enableScraping", true)
  };
  
  // Force set enableScraping in GM storage if it doesn't exist yet
  if (GM_getValue("enableScraping") === undefined) {
    GM_setValue("enableScraping", true);
    console.log("GG.deals: Initializing enableScraping setting to true");
  }
  
  // Get API key if saved
  const apiKey = GM_getValue("apiKey", "");
  
  // Get preferred region/currency (default: us)
  const preferredRegion = GM_getValue("preferredRegion", "us");
  
  // Available regions for API
  const availableRegions = [
    { code: "us", name: "USA (USD)" },
    { code: "gb", name: "UK (GBP)" },
    { code: "eu", name: "Europe (EUR)" },
    { code: "ca", name: "Canada (CAD)" },
    { code: "au", name: "Australia (AUD)" },
    { code: "br", name: "Brazil (BRL)" },
    { code: "ru", name: "Russia (RUB)" },
    { code: "tr", name: "Turkey (TRY)" },
    { code: "pl", name: "Poland (PLN)" },
    { code: "de", name: "Germany (EUR)" },
    { code: "fr", name: "France (EUR)" },
    { code: "es", name: "Spain (EUR)" },
    { code: "it", name: "Italy (EUR)" },
    { code: "ch", name: "Switzerland (CHF)" },
    { code: "nl", name: "Netherlands (EUR)" },
    { code: "se", name: "Sweden (SEK)" },
    { code: "no", name: "Norway (NOK)" },
    { code: "dk", name: "Denmark (DKK)" },
    { code: "fi", name: "Finland (EUR)" },
    { code: "ie", name: "Ireland (EUR)" },
    { code: "be", name: "Belgium (EUR)" }
  ];

  // Apply custom colors on script load
  applyCustomColors();

  // Cache configuration
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests
  const MAX_RETRIES = 1;
  
  // Global variables for easy access
  window.ggDealsApiKey = apiKey;
  window.ggDealsRegion = preferredRegion;

  // In-memory cache to reduce GM_getValue calls
  const memoryCache = {};

  // Cache structure with force refresh option and memory caching
  const priceCache = {
    get: function (key, forceRefresh = false) {
      if (forceRefresh) {
        // Clear both memory and persistent cache
        delete memoryCache[key];
        GM_setValue(`cache_${key}`, "");
        return null;
      }

      // Check memory cache first for better performance
      if (memoryCache[key]) {
        const { data, timestamp } = memoryCache[key];
        if (Date.now() - timestamp <= CACHE_EXPIRY) {
          return data;
        }
        // Expired cache, remove from memory
        delete memoryCache[key];
      }

      // Otherwise check persistent storage
      const cached = GM_getValue(`cache_${key}`);
      if (!cached) return null;

      try {
        const cacheObject = JSON.parse(cached);
        const { data, timestamp, source } = cacheObject;
        
        if (Date.now() - timestamp > CACHE_EXPIRY) {
          // Expired cache, clear it
          GM_setValue(`cache_${key}`, "");
          return null;
        }
        
        // Store in memory cache for future access
        memoryCache[key] = { data, timestamp, source };
        return data;
      } catch (e) {
        // Invalid cache data
        console.warn(`GG.deals: Invalid cache data for ${key}`, e);
        GM_setValue(`cache_${key}`, "");
        return null;
      }
    },
    set: function (key, data, source = "web") {
      if (!data) return; // Don't cache null/undefined data
      
      const cacheObject = {
        data: data,
        timestamp: Date.now(),
        source: source
      };
      
      // Update memory cache
      memoryCache[key] = cacheObject;
      
      // Update persistent storage
      GM_setValue(`cache_${key}`, JSON.stringify(cacheObject));
      
      // Periodically clean old cache entries
      this.cleanExpiredEntries();
    },
    getTimestamp: function (key) {
      // Check memory cache first
      if (memoryCache[key]) {
        return memoryCache[key].timestamp;
      }
      
      const cached = GM_getValue(`cache_${key}`);
      if (!cached) return null;
      
      try {
        return JSON.parse(cached).timestamp;
      } catch (e) {
        return null;
      }
    },
    getSource: function (key) {
      // Check memory cache first
      if (memoryCache[key]) {
        return memoryCache[key].source;
      }
      
      const cached = GM_getValue(`cache_${key}`);
      if (!cached) return null;
      
      try {
        return JSON.parse(cached).source;
      } catch (e) {
        return null;
      }
    },
    // Method to clean expired entries (runs occasionally)
    cleanExpiredEntries: function() {
      // Only run cleanup occasionally (1 in 10 chance)
      if (Math.random() < 0.1) {
        const now = Date.now();
        
        // Clean memory cache
        Object.keys(memoryCache).forEach(key => {
          if (now - memoryCache[key].timestamp > CACHE_EXPIRY) {
            delete memoryCache[key];
          }
        });
        
        // We could do this for GM storage but it's expensive to enumerate all keys
        // Let individual expired entries be cleared on access instead
      }
    }
  };

  // Rate limiter with memory-based tracking and cross-tab synchronization
  const requestTracker = {
    lastRequestTime: 0,
    activeRequests: {}
  };
  
  async function rateLimitedRequest(url) {
    const now = Date.now();
    const urlHash = url.split('?')[0]; // Base URL without params for tracking
    
    // Check if we have an active request for this URL
    if (requestTracker.activeRequests[urlHash]) {
      const activeRequest = requestTracker.activeRequests[urlHash];
      try {
        // Reuse the existing request
        console.log(`GG.deals: Reusing in-flight request for ${urlHash}`);
        return await activeRequest;
      } catch (error) {
        // If the existing request failed, continue with a new one
        console.warn(`GG.deals: Reused request failed, trying again: ${error}`);
      }
    }
    
    // Get last request time from global storage (shared between tabs)
    const storedLastRequest = GM_getValue("lastRequestTime", 0);
    requestTracker.lastRequestTime = Math.max(requestTracker.lastRequestTime, storedLastRequest);
    
    const timeToWait = Math.max(0, RATE_LIMIT_DELAY - (now - requestTracker.lastRequestTime));

    if (timeToWait > 0) {
      await new Promise((resolve) => setTimeout(resolve, timeToWait));
    }

    // Update both local tracker and global storage
    requestTracker.lastRequestTime = Date.now();
    GM_setValue("lastRequestTime", requestTracker.lastRequestTime);

    // Create a new request
    const requestPromise = new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        timeout: 10000,
        onload: (response) => {
          // Clear the tracked request when done
          delete requestTracker.activeRequests[urlHash];
          resolve(response);
        },
        onerror: (error) => {
          // Clear the tracked request when failed
          delete requestTracker.activeRequests[urlHash];
          reject(error);
        },
        ontimeout: (error) => {
          // Clear the tracked request when timed out
          delete requestTracker.activeRequests[urlHash];
          reject(error);
        }
      });
    });
    
    // Track this request
    requestTracker.activeRequests[urlHash] = requestPromise;
    
    return requestPromise;
  }

  // Function to extract app ID from Steam page URL
  function extractAppIdFromSteamPage() {
    try {
      // Look for app ID in the current URL
      const urlMatch = window.location.pathname.match(/\/app\/(\d+)/);
      if (urlMatch) {
        return urlMatch[1];
      }
      
      // Look for app ID in page elements (fallback)
      const appIdElement = document.querySelector('input[name="appid"]') || 
                          document.querySelector('[data-appid]') ||
                          document.querySelector('.game_area_purchase_game input[name="appid"]');
      
      if (appIdElement) {
        return appIdElement.value || appIdElement.getAttribute('data-appid');
      }
      
      return null;
    } catch (error) {
      console.warn("GG.deals: Error extracting app ID from Steam page:", error);
      return null;
    }
  }

  // New function to fetch data using GG.deals API
  async function fetchGamePricesApi(steamId, steamType) {
    // Check for valid API key
    const apiKey = GM_getValue("apiKey", "");
    if (!apiKey) {
      throw new Error("No API key provided");
    }
    
    // Get preferred region
    const region = GM_getValue("preferredRegion", "us");

    // For subs, try to extract the actual app ID from the Steam page
    let effectiveSteamId = steamId;
    if (steamType === 'sub') {
      const extractedAppId = extractAppIdFromSteamPage();
      if (extractedAppId && extractedAppId !== steamId) {
        console.log(`GG.deals: Using extracted app ID ${extractedAppId} instead of sub ID ${steamId}`);
        effectiveSteamId = extractedAppId;
      }
    }

    // Steam sub IDs are no longer supported, use app ID for both
    const apiUrl = `https://api.gg.deals/v1/prices/by-steam-app-id/?ids=${effectiveSteamId}&key=${apiKey}&region=${region}`;
    
    try {
      const response = await rateLimitedRequest(apiUrl);
      
      // Check for successful response
      if (response.status !== 200) {
        console.error(`GG.deals API Error Details:`, {
          status: response.status,
          statusText: response.statusText,
          url: apiUrl,
          originalSteamId: steamId,
          effectiveSteamId: effectiveSteamId,
          steamType: steamType,
          region: region,
          responseText: response.responseText?.substring(0, 500) || 'No response text',
          timestamp: new Date().toISOString()
        });
        throw new Error(`API returned status ${response.status} (${response.statusText})`);
      }
      
      // Parse the JSON response
      const jsonData = JSON.parse(response.responseText);
      
      // Check for successful API response
      if (!jsonData.success) {
        throw new Error(jsonData.data?.message || "API error");
      }
      
      // Check if data exists for this game
      if (!jsonData.data || !jsonData.data[effectiveSteamId]) {
        throw new Error("No data found for this game");
      }
      
      const gameData = jsonData.data[effectiveSteamId];
      
      // Handle case where game is not found in API
      if (gameData === null) {
        throw new Error("Game not found in GG.deals database");
      }
      
      // Get currency symbol based on region
      const currencySymbols = {
        us: "$", eu: "€", gb: "£", ca: "CA$", au: "A$", br: "R$", 
        ru: "₽", tr: "₺", pl: "zł", fr: "€", de: "€", es: "€", 
        it: "€", ch: "CHF", nl: "€", se: "kr", no: "kr", dk: "kr", 
        fi: "€", ie: "€", be: "€"
      };
      const currencySymbol = currencySymbols[region] || gameData.prices.currency || "";
      
      // Format prices with currency symbol
      const formatPrice = (price) => {
        if (!price) return "No data";
        // Check if currency is before or after the number based on region
        if (["us", "ca", "au", "br"].includes(region)) {
          return `${currencySymbol}${price}`;
        } else {
          return `${price}${currencySymbol}`;
        }
      };
      
      // Format the data to match our expected structure
      const formattedData = {
        officialPrice: formatPrice(gameData.prices.currentRetail),
        keyshopPrice: formatPrice(gameData.prices.currentKeyshops),
        historicalData: [],
        lowestPriceType: null,
        url: gameData.url,
        isCorrectGame: true
      };
      
      // Add historical data if available
      if (gameData.prices.historicalRetail) {
        formattedData.historicalData.push({
          type: "official",
          price: gameData.prices.historicalRetail,
          historical: `Historical Low: ${formatPrice(gameData.prices.historicalRetail)}`
        });
      }
      
      if (gameData.prices.historicalKeyshops) {
        formattedData.historicalData.push({
          type: "keyshop",
          price: gameData.prices.historicalKeyshops,
          historical: `Historical Low: ${formatPrice(gameData.prices.historicalKeyshops)}`
        });
      }
      
      // Determine lowest price type
      if (gameData.prices.currentRetail && gameData.prices.currentKeyshops) {
        const officialPriceNum = parseFloat(gameData.prices.currentRetail);
        const keyshopPriceNum = parseFloat(gameData.prices.currentKeyshops);
        formattedData.lowestPriceType = officialPriceNum <= keyshopPriceNum ? "official" : "keyshop";
      } else if (gameData.prices.currentRetail) {
        formattedData.lowestPriceType = "official";
      } else if (gameData.prices.currentKeyshops) {
        formattedData.lowestPriceType = "keyshop";
      }
      
      return formattedData;
    } catch (error) {
      console.error("GG.deals API error:", {
        error: error.message,
        originalSteamId: steamId,
        effectiveSteamId: effectiveSteamId,
        steamType: steamType,
        region: region,
        apiUrl: apiUrl,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  function createPriceContainer() {
    const container = document.createElement("div");
    // Get the saved compact state
    const isCompact = GM_getValue("compactView", false);
    container.className = "gg-deals-container" + (isCompact ? " compact" : "");
    container.innerHTML = `
            <div class="gg-header">
                <div class="gg-title">
                    <img src="https://gg.deals/favicon.ico" alt="GG.deals">
                    GG.deals Steam Companion
                </div>
            </div>
            <div class="gg-compact-row">
                <img src="https://gg.deals/favicon.ico" alt="GG.deals" class="gg-icon">
                <div class="gg-compact-prices">
                    <div class="gg-compact-price-item" id="gg-compact-official" style="${
                      !toggleStates.official ? "display:none" : ""
                    }">
                        <span>Official:</span>
                        <span class="gg-historical-tooltip">
                            <span class="gg-price-value" id="gg-compact-official-price">Loading...</span>
                            <span class="gg-historical-tooltip-text" id="gg-compact-official-historical"></span>
                        </span>
                    </div>
                    <div class="gg-compact-price-item" id="gg-compact-keyshop" style="${
                      !toggleStates.keyshop ? "display:none" : ""
                    }">
                        <span>Keyshop:</span>
                        <span class="gg-historical-tooltip">
                            <span class="gg-price-value" id="gg-compact-keyshop-price">Loading...</span>
                            <span class="gg-historical-tooltip-text" id="gg-compact-keyshop-historical"></span>
                        </span>
                    </div>
                </div>
                <div class="gg-compact-controls">
                    <button class="gg-icon-button gg-refresh" title="Refresh Prices">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span class="gg-tooltip-text">Click to refresh prices</span>
                    </button>
                    <div class="gg-settings-dropdown">
                        <div class="gg-icon-button gg-settings-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                            </svg>
                        </div>
                        <div class="gg-settings-content">
                            <div class="gg-settings-section">
                                <div class="gg-settings-title">Display Options</div>
                                <label class="gg-toggle ${toggleStates.official ? "active" : ""}" title="Toggle Official Stores">
                                    <input type="checkbox" id="gg-toggle-official-compact" ${toggleStates.official ? "checked" : ""}>
                                    <label>Official</label>
                                </label>
                                <label class="gg-toggle ${toggleStates.keyshop ? "active" : ""}" title="Toggle Keyshops">
                                    <input type="checkbox" id="gg-toggle-keyshop-compact" ${toggleStates.keyshop ? "checked" : ""}>
                                    <label>Keyshops</label>
                                </label>
                                <label class="gg-toggle ${toggleStates.compact ? "active" : ""}" title="Toggle Compact View">
                                    <input type="checkbox" id="gg-toggle-compact-menu" ${toggleStates.compact ? "checked" : ""}>
                                    <label>Compact</label>
                                </label>
                                <label class="gg-toggle ${toggleStates.subDisplay ? "active" : ""}" title="Toggle Sub/Bundle Displays">
                                    <input type="checkbox" id="gg-toggle-sub-display-compact" ${toggleStates.subDisplay ? "checked" : ""}>
                                    <label>Bundle/Sub Display</label>
                                </label>
                                <label class="gg-toggle ${toggleStates.enableScraping ? "active" : ""}" title="Enable/disable web scraping for non-API requests">
                                    <input type="checkbox" id="gg-toggle-enable-scraping-compact" ${toggleStates.enableScraping ? "checked" : ""}>
                                    <label>Enable Scraping</label>
                                </label>
                            </div>
                            <div class="gg-settings-section">
                                <div class="gg-settings-title">API Settings</div>
                                <label class="gg-toggle ${toggleStates.useApi ? "active" : ""}" title="Use GG.deals API">
                                    <input type="checkbox" id="gg-toggle-use-api-compact" ${toggleStates.useApi ? "checked" : ""}>
                                    <label>Use API</label>
                                </label>
                                <div>
                                    <div class="gg-api-key-wrapper">
                                        <input type="password" id="gg-api-key-compact" class="gg-api-key-input" 
                                               placeholder="Enter your GG.deals API key" value="${apiKey}">
                                        <button type="button" class="gg-toggle-visibility" title="Show/Hide API Key">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <select id="gg-region-select-compact" class="gg-region-select">
                                        ${availableRegions.map(region => 
                                            `<option value="${region.code}" ${region.code === preferredRegion ? 'selected' : ''}>${region.name}</option>`
                                        ).join('')}
                                    </select>
                                    <div class="gg-api-status ${apiKey && toggleStates.useApi ? "active" : "inactive"}">
                                        API: ${apiKey && toggleStates.useApi ? "Active" : "Inactive"}
                                    </div>
                                    <button id="gg-save-api-key-compact" class="gg-save-button">Save Settings</button>
                                </div>
                            </div>
                            <div class="gg-settings-section">
                                <div class="gg-settings-title">Color Settings</div>
                                <div class="gg-color-grid">
                                    <div class="gg-color-item">
                                        <div class="gg-color-label">Background</div>
                                        <input type="color" id="gg-color-background-compact" class="gg-color-input" value="${savedColors.background}">
                                    </div>
                                    <div class="gg-color-item">
                                        <div class="gg-color-label">Header Background</div>
                                        <input type="color" id="gg-color-header-bg-compact" class="gg-color-input" value="${savedColors.headerBackground}">
                                    </div>
                                    <div class="gg-color-item">
                                        <div class="gg-color-label">Official Text</div>
                                        <input type="color" id="gg-color-official-text-compact" class="gg-color-input" value="${savedColors.officialText}">
                                    </div>
                                    <div class="gg-color-item">
                                        <div class="gg-color-label">Official Price</div>
                                        <input type="color" id="gg-color-official-price-compact" class="gg-color-input" value="${savedColors.officialPrice}">
                                    </div>
                                    <div class="gg-color-item">
                                        <div class="gg-color-label">Keyshop Text</div>
                                        <input type="color" id="gg-color-keyshop-text-compact" class="gg-color-input" value="${savedColors.keyshopText}">
                                    </div>
                                     <div class="gg-color-item">
                                        <div class="gg-color-label">Keyshop Price</div>
                                        <input type="color" id="gg-color-keyshop-price-compact" class="gg-color-input" value="${savedColors.keyshopPrice}">
                                    </div>
                                    <div class="gg-color-item">
                                        <div class="gg-color-label">Best Price</div>
                                        <input type="color" id="gg-color-best-price-compact" class="gg-color-input" value="${savedColors.bestPrice}">
                                    </div>
                                    <div class="gg-color-item">
                                        <div class="gg-color-label">Button Background</div>
                                        <input type="text" id="gg-color-button-bg-compact" class="gg-api-key-input" value="${savedColors.buttonBackground}">
                                    </div>
                                    <div class="gg-color-item">
                                        <div class="gg-color-label">Button Text</div>
                                        <input type="color" id="gg-color-button-text-compact" class="gg-color-input" value="${savedColors.buttonText}">
                                    </div>
                                    <div class="gg-color-item">
                                        <div class="gg-color-label">Border Color</div>
                                        <input type="color" id="gg-color-border-compact" class="gg-color-input" value="${savedColors.borderColor.replace('30', '')}">
                                    </div>
                                </div>
                                <button id="gg-save-colors-compact" class="gg-save-button">Save Colors</button>
                                <button id="gg-reset-colors-compact" class="gg-reset-colors">Reset to Default</button>
                            </div>
                        </div>
                    </div>
                    <a href="#" target="_blank" class="gg-view-offers">View Offers</a>
                </div>
            </div>
            <div class="gg-price-sections">
                <div class="gg-price-section ${
                  toggleStates.official ? "" : "hidden"
                }" id="gg-official-section">
                    <div class="gg-price-left">
                        <span class="gg-price-label">
                            <img src="https://gg.deals/favicon.ico" class="gg-icon">
                            Official Stores
                        </span>
                    </div>
                    <div class="gg-price-info">
                        <span class="gg-price-value" id="gg-official-price">Loading...</span>
                        <span class="gg-price-value historical" id="gg-official-historical"></span>
                    </div>
                </div>
                <div class="gg-price-section ${
                  toggleStates.keyshop ? "" : "hidden"
                }" id="gg-keyshop-section">
                    <div class="gg-price-left">
                        <span class="gg-price-label">
                            <img src="https://gg.deals/favicon.ico" class="gg-icon">
                            Keyshops
                        </span>
                    </div>
                    <div class="gg-price-info">
                        <span class="gg-price-value" id="gg-keyshop-price">Loading...</span>
                        <span class="gg-price-value historical" id="gg-keyshop-historical"></span>
                    </div>
                </div>
            </div>
            <div class="gg-controls">
                <div class="gg-main-actions">
                    <a href="#" target="_blank" class="gg-view-offers">View Offers</a>
                    <button class="gg-icon-button gg-refresh" title="Refresh Prices">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span class="gg-tooltip-text">Click to refresh prices</span>
                    </button>
                </div>
                <div class="gg-settings-panels">
                    <div class="gg-settings-section">
                        <div class="gg-settings-title">Display Options</div>
                        <label class="gg-toggle ${toggleStates.official ? "active" : ""}" title="Toggle Official Stores">
                            <input type="checkbox" id="gg-toggle-official" ${toggleStates.official ? "checked" : ""}>
                            <label>Official</label>
                        </label>
                        <label class="gg-toggle ${toggleStates.keyshop ? "active" : ""}" title="Toggle Keyshops">
                            <input type="checkbox" id="gg-toggle-keyshop" ${toggleStates.keyshop ? "checked" : ""}>
                            <label>Keyshops</label>
                        </label>
                        <label class="gg-toggle ${toggleStates.compact ? "active" : ""}" title="Toggle Compact View">
                            <input type="checkbox" id="gg-toggle-compact" ${toggleStates.compact ? "checked" : ""}>
                            <label>Compact</label>
                        </label>
                        <label class="gg-toggle ${toggleStates.subDisplay ? "active" : ""}" title="Toggle Sub/Bundle Displays">
                            <input type="checkbox" id="gg-toggle-sub-display" ${toggleStates.subDisplay ? "checked" : ""}>
                            <label>Bundle Display</label>
                        </label>
                        <label class="gg-toggle ${toggleStates.enableScraping ? "active" : ""}" title="Enable/disable web scraping for non-API requests">
                            <input type="checkbox" id="gg-toggle-enable-scraping" ${toggleStates.enableScraping ? "checked" : ""}>
                            <label>Enable Scraping</label>
                        </label>
                    </div>
                    <div class="gg-settings-section">
                        <div class="gg-settings-title">API Settings</div>
                        <label class="gg-toggle ${toggleStates.useApi ? "active" : ""}" title="Use GG.deals API">
                            <input type="checkbox" id="gg-toggle-use-api" ${toggleStates.useApi ? "checked" : ""}>
                            <label>Use API</label>
                        </label>
                        <div>
                            <div class="gg-api-key-wrapper">
                                <input type="password" id="gg-api-key" class="gg-api-key-input" 
                                       placeholder="Enter your GG.deals API key" value="${apiKey}">
                                <button type="button" class="gg-toggle-visibility" title="Show/Hide API Key">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                    </svg>
                                </button>
                            </div>
                            <select id="gg-region-select" class="gg-region-select">
                                ${availableRegions.map(region => 
                                    `<option value="${region.code}" ${region.code === preferredRegion ? 'selected' : ''}>${region.name}</option>`
                                ).join('')}
                            </select>
                            <div class="gg-api-status ${apiKey && toggleStates.useApi ? "active" : "inactive"}">
                                API: ${apiKey && toggleStates.useApi ? "Active" : "Inactive"}
                            </div>
                            <button id="gg-save-api-key" class="gg-save-button">Save Settings</button>
                        </div>
                    </div>
                    <div class="gg-settings-section">
                        <div class="gg-settings-title">Color Settings</div>
                        <div class="gg-color-grid">
                            <div class="gg-color-item">
                                <div class="gg-color-label">Background</div>
                                <input type="color" id="gg-color-background" class="gg-color-input" value="${savedColors.background}">
                            </div>
                            <div class="gg-color-item">
                                <div class="gg-color-label">Header Background</div>
                                <input type="color" id="gg-color-header-bg" class="gg-color-input" value="${savedColors.headerBackground}">
                            </div>
                            <div class="gg-color-item">
                                <div class="gg-color-label">Official Text</div>
                                <input type="color" id="gg-color-official-text" class="gg-color-input" value="${savedColors.officialText}">
                            </div>
                            <div class="gg-color-item">
                                <div class="gg-color-label">Official Price</div>
                                <input type="color" id="gg-color-official-price" class="gg-color-input" value="${savedColors.officialPrice}">
                            </div>
                            <div class="gg-color-item">
                                <div class="gg-color-label">Keyshop Text</div>
                                <input type="color" id="gg-color-keyshop-text" class="gg-color-input" value="${savedColors.keyshopText}">
                            </div>
                             <div class="gg-color-item">
                                <div class="gg-color-label">Keyshop Price</div>
                                <input type="color" id="gg-color-keyshop-price" class="gg-color-input" value="${savedColors.keyshopPrice}">
                            </div>
                            <div class="gg-color-item">
                                <div class="gg-color-label">Best Price</div>
                                <input type="color" id="gg-color-best-price" class="gg-color-input" value="${savedColors.bestPrice}">
                            </div>
                             <div class="gg-color-item">
                                <div class="gg-color-label">Button Background</div>
                                <input type="text" id="gg-color-button-bg" class="gg-api-key-input" value="${savedColors.buttonBackground}">
                            </div>
                            <div class="gg-color-item">
                                <div class="gg-color-label">Button Text</div>
                                <input type="color" id="gg-color-button-text" class="gg-color-input" value="${savedColors.buttonText}">
                            </div>
                            <div class="gg-color-item">
                                <div class="gg-color-label">Border Color</div>
                                <input type="color" id="gg-color-border" class="gg-color-input" value="${savedColors.borderColor.replace('30', '')}">
                            </div>
                        </div>
                        <button id="gg-save-colors" class="gg-save-button">Save Colors</button>
                        <button id="gg-reset-colors" class="gg-reset-colors">Reset to Default</button>
                    </div>
                </div>
            </div>
            <div class="gg-attribution">
        Extension by <a href="https://steamcommunity.com/profiles/76561199186030286">Crimsab</a> 
        <a href="https://github.com/Crimsab/ggdeals-steam-companion" title="View on GitHub">
            <svg class="github-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
        </a> · 
        Data by <a href="https://gg.deals">gg.deals</a>
        <span id="gg-api-indicator" class="gg-api-status ${toggleStates.useApi && apiKey ? "active" : "inactive"}" style="margin-left: 5px; display: inline-block;">
            ${toggleStates.useApi && apiKey ? "· API Active" : ""}
        </span>
    </div>
        `;

    // Add toggle listeners for both sets of controls
    const toggleOfficialCompact = container.querySelector(
      "#gg-toggle-official-compact"
    );
    const toggleKeyshopCompact = container.querySelector(
      "#gg-toggle-keyshop-compact"
    );
    const toggleCompactMenu = container.querySelector(
      "#gg-toggle-compact-menu"
    );
    const toggleOfficial = container.querySelector("#gg-toggle-official");
    const toggleKeyshop = container.querySelector("#gg-toggle-keyshop");
    const toggleCompact = container.querySelector("#gg-toggle-compact");
    const toggleSubDisplay = container.querySelector("#gg-toggle-sub-display");

    function updateToggleState(type, checked) {
      toggleStates[type] = checked;
      if (type === "compact") {
        GM_setValue("compactView", checked);
      } else if (type === "useApi") {
        GM_setValue("useApi", checked);
      } else if (type === "enableScraping") {
        // Make sure to explicitly save enableScraping setting
        GM_setValue("enableScraping", checked);
        console.log(`GG.deals: Saving enableScraping = ${checked}`);
      } else {
        GM_setValue(`show${type.charAt(0).toUpperCase() + type.slice(1)}`, checked);
      }

      if (type === "official" || type === "keyshop") {
        container.querySelector(`#gg-compact-${type}`).style.display = checked
          ? ""
          : "none";
        container
          .querySelector(`#gg-${type}-section`)
          .classList.toggle("hidden", !checked);
      } else if (type === "compact") {
        // Update all containers on the page, preserving sub-display containers
        document.querySelectorAll('.gg-deals-container').forEach(cont => {
          // Skip sub-display containers if we're switching to full view
          if (!checked && cont.classList.contains('bundle-sub-display')) {
            return;
          }
          cont.classList.toggle("compact", checked);
        });
      } else if (type === "subDisplay") {
        document.querySelectorAll('.gg-deals-container.bundle-sub-display').forEach(el => {
          el.style.display = checked ? "" : "none";
        });
      }

      // Update all related toggle buttons
      document.querySelectorAll(`input[id*=toggle-${type}]`).forEach((input) => {
        input.checked = checked;
        input.closest(".gg-toggle").classList.toggle("active", checked);
      });
    }

    // Add event listeners for all toggles
    [toggleOfficialCompact, toggleOfficial].forEach((toggle) => {
      if (toggle) {
        toggle.addEventListener("change", (e) =>
          updateToggleState("official", e.target.checked)
        );
      }
    });

    [toggleKeyshopCompact, toggleKeyshop].forEach((toggle) => {
      if (toggle) {
        toggle.addEventListener("change", (e) =>
          updateToggleState("keyshop", e.target.checked)
        );
      }
    });

    [toggleCompactMenu, toggleCompact].forEach((toggle) => {
      if (toggle) {
        toggle.addEventListener("change", (e) =>
          updateToggleState("compact", e.target.checked)
        );
      }
    });

    const toggleSubDisplayCompact = container.querySelector("#gg-toggle-sub-display-compact");
    [toggleSubDisplay, toggleSubDisplayCompact].forEach((toggle) => {
      if (toggle) {
        toggle.addEventListener("change", (e) => updateToggleState("subDisplay", e.target.checked));
      }
    });
    
    // Add web scraping toggle event listeners
    const toggleEnableScraping = container.querySelector("#gg-toggle-enable-scraping");
    const toggleEnableScrapingCompact = container.querySelector("#gg-toggle-enable-scraping-compact");
    [toggleEnableScraping, toggleEnableScrapingCompact].forEach((toggle) => {
      if (toggle) {
        toggle.addEventListener("change", (e) => {
          updateToggleState("enableScraping", e.target.checked);
        });
      }
    });
    
    // Add API toggle event listeners
    const toggleUseApi = container.querySelector("#gg-toggle-use-api");
    const toggleUseApiCompact = container.querySelector("#gg-toggle-use-api-compact");
    [toggleUseApi, toggleUseApiCompact].forEach((toggle) => {
      if (toggle) {
        toggle.addEventListener("change", (e) => {
          updateToggleState("useApi", e.target.checked);
          // Update API status text in settings
          document.querySelectorAll('.gg-api-status:not(#gg-api-indicator)').forEach(status => {
            status.classList.toggle('active', e.target.checked && apiKey);
            status.classList.toggle('inactive', !e.target.checked || !apiKey);
            status.textContent = `API: ${e.target.checked && apiKey ? "Active" : "Inactive"}`;
          });
          
          // Update API indicator in attribution
          const apiIndicator = document.getElementById('gg-api-indicator');
          if (apiIndicator) {
            apiIndicator.classList.toggle('active', e.target.checked && apiKey);
            apiIndicator.classList.toggle('inactive', !e.target.checked || !apiKey);
            apiIndicator.textContent = e.target.checked && apiKey ? "· API Active" : "";
          }
        });
      }
    });
    
    // Add API key visibility toggle listeners
    const toggleVisibilityBtns = container.querySelectorAll(".gg-toggle-visibility");
    toggleVisibilityBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener("click", (e) => {
          // Stop event propagation to prevent closing the settings dropdown
          e.stopPropagation();
          // Find the corresponding input field (sibling of parent element)
          const inputField = btn.closest(".gg-api-key-wrapper").querySelector(".gg-api-key-input");
          if (inputField) {
            // Toggle between password and text type
            inputField.type = inputField.type === "password" ? "text" : "password";
            
            // Update the icon to reflect the current state
            const eyeIcon = btn.querySelector("svg");
            if (eyeIcon) {
              if (inputField.type === "password") {
                // Show the "eye" icon to indicate the user can click to show the password
                eyeIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
              } else {
                // Show the "eye-off" icon to indicate the user can click to hide the password
                eyeIcon.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
              }
            }
          }
        });
      }
    });
    
    // Add save API key button event listeners
    const saveApiKeyBtn = container.querySelector("#gg-save-api-key");
    const saveApiKeyBtnCompact = container.querySelector("#gg-save-api-key-compact");
    const apiKeyInput = container.querySelector("#gg-api-key");
    const apiKeyInputCompact = container.querySelector("#gg-api-key-compact");
    const regionSelect = container.querySelector("#gg-region-select");
    const regionSelectCompact = container.querySelector("#gg-region-select-compact");
    
    [saveApiKeyBtn, saveApiKeyBtnCompact].forEach(btn => {
      if (btn) {
        btn.addEventListener("click", () => {
          // Get value from the inputs in the same container
          const isCompact = btn.id.includes('compact');
          const input = isCompact ? apiKeyInputCompact : apiKeyInput;
          const regionInput = isCompact ? regionSelectCompact : regionSelect;
          const newApiKey = input.value.trim();
          const newRegion = regionInput.value;
          
          // Save to both inputs
          if (apiKeyInput) apiKeyInput.value = newApiKey;
          if (apiKeyInputCompact) apiKeyInputCompact.value = newApiKey;
          
          // Update region selectors
          if (regionSelect && regionSelectCompact) {
            regionSelect.value = newRegion;
            regionSelectCompact.value = newRegion;
          }
          
          // Save to GM storage
          GM_setValue("apiKey", newApiKey);
          GM_setValue("preferredRegion", newRegion);
          
          // Update global variables
          window.ggDealsApiKey = newApiKey;
          window.ggDealsRegion = newRegion;
          
          // Clear cache to reflect updated region
          document.querySelectorAll('.gg-deals-container').forEach(container => {
            if (container.id) {
              const match = container.id.match(/gg-deals-(app|sub|bundle)-(\d+)/);
              if (match) {
                const [, containerType, containerId] = match;
                priceCache.get(`${containerType}_${containerId}`, true);
              }
            }
          });
          
          // Update status in settings
          document.querySelectorAll('.gg-api-status:not(#gg-api-indicator)').forEach(status => {
            const isActive = toggleStates.useApi && newApiKey;
            status.classList.toggle('active', isActive);
            status.classList.toggle('inactive', !isActive);
            status.textContent = `API: ${isActive ? "Active" : "Inactive"}`;
          });
          
          // Update API indicator in attribution
          const apiIndicator = document.getElementById('gg-api-indicator');
          if (apiIndicator) {
            const isActive = toggleStates.useApi && newApiKey;
            apiIndicator.classList.toggle('active', isActive);
            apiIndicator.classList.toggle('inactive', !isActive);
            apiIndicator.textContent = isActive ? "· API Active" : "";
          }
          
          // Refresh prices with new region
          if (toggleStates.useApi && newApiKey) {
            document.querySelectorAll('.gg-refresh').forEach(refreshBtn => {
              refreshBtn.click();
            });
          }
        });
      }
    });

    // Add color setting event listeners
    const saveColorsBtn = container.querySelector("#gg-save-colors");
    const saveColorsBtnCompact = container.querySelector("#gg-save-colors-compact");
    const resetColorsBtn = container.querySelector("#gg-reset-colors");
    const resetColorsBtnCompact = container.querySelector("#gg-reset-colors-compact");
    
    // Function to get all color inputs
    function getAllColorInputs(compact = false) {
      const suffix = compact ? "-compact" : "";
      return {
        background: container.querySelector(`#gg-color-background${suffix}`),
        headerBackground: container.querySelector(`#gg-color-header-bg${suffix}`),
        officialText: container.querySelector(`#gg-color-official-text${suffix}`),
        officialPrice: container.querySelector(`#gg-color-official-price${suffix}`),
        keyshopText: container.querySelector(`#gg-color-keyshop-text${suffix}`),
        keyshopPrice: container.querySelector(`#gg-color-keyshop-price${suffix}`), // Added keyshopPrice
        bestPrice: container.querySelector(`#gg-color-best-price${suffix}`),
        buttonBackground: container.querySelector(`#gg-color-button-bg${suffix}`), // Added buttonBackground
        buttonText: container.querySelector(`#gg-color-button-text${suffix}`),
        borderColor: container.querySelector(`#gg-color-border${suffix}`)
      };
    }
    
    // Function to save colors from a set of inputs
    function saveColorsFromInputs(compact = false) {
      const inputs = getAllColorInputs(compact);
      const nonCompactInputs = getAllColorInputs(false);
      const compactInputs = getAllColorInputs(true);
      
      // Get the values from the inputs
      Object.keys(inputs).forEach(key => {
        if (inputs[key]) {
          let value = inputs[key].value;
          
          // Special handling for border color (add transparency)
          if (key === 'borderColor') {
            // Convert hex to hex with alpha
            value = value.replace('#', '#') + '30';
          }
          
          // Save to storage
          savedColors[key] = value;
          GM_setValue(`color_${key}`, value);
          
          // Update both sets of inputs
          if (nonCompactInputs[key]) {
            nonCompactInputs[key].value = inputs[key].value;
          }
          if (compactInputs[key]) {
            compactInputs[key].value = inputs[key].value;
          }
        }
      });
      
      // Apply the new colors
      applyCustomColors();
    }
    
    // Function to reset colors to default
    function resetColorsToDefault() {
      // Reset all colors to default
      Object.keys(defaultColors).forEach(key => {
        savedColors[key] = defaultColors[key];
        GM_setValue(`color_${key}`, defaultColors[key]);
      });
      
      // Update all inputs
      const nonCompactInputs = getAllColorInputs(false);
      const compactInputs = getAllColorInputs(true);
      
      Object.keys(defaultColors).forEach(key => {
        let displayValue = defaultColors[key];
        
        // Special handling for border color (remove transparency for display)
        // For button background, which is a text input, just use the value directly.
        if (key === 'borderColor') {
          displayValue = defaultColors[key].replace('30', '');
        }
        
        if (nonCompactInputs[key]) {
          nonCompactInputs[key].value = displayValue;
        }
        if (compactInputs[key]) {
          compactInputs[key].value = displayValue;
        }
      });
      
      // Apply the default colors
      applyCustomColors();
    }
    
    // Add save colors button listeners
    [saveColorsBtn, saveColorsBtnCompact].forEach(btn => {
      if (btn) {
        btn.addEventListener("click", () => {
          const isCompact = btn.id.includes('compact');
          saveColorsFromInputs(isCompact);
        });
      }
    });
    
    // Add reset colors button listeners
    [resetColorsBtn, resetColorsBtnCompact].forEach(btn => {
      if (btn) {
        btn.addEventListener("click", resetColorsToDefault);
      }
    });

    // Add refresh button listeners to both compact and full view buttons
    container.querySelectorAll(".gg-refresh").forEach(refreshButton => {
      const refreshText = refreshButton.querySelector(".gg-tooltip-text");
      refreshButton.addEventListener("click", async function () {
        refreshButton.classList.add("loading");
        refreshButton.disabled = true;

        try {
          // First check if this container has its own ID/type information
          let type, id;
          
          if (container.id) {
            const containerMatch = container.id.match(/gg-deals-(app|sub|bundle)-(\d+)/);
            if (containerMatch) {
              [, type, id] = containerMatch;
            }
          }
          
          // If no container-specific info, use the URL
          if (!type || !id) {
            const urlMatch = window.location.pathname.match(/\/(app|sub|bundle)\/(\d+)/);
            if (urlMatch) {
              [, type, id] = urlMatch;
            } else {
              throw new Error("Could not determine game ID");
            }
          }
          
          // Force a refresh by clearing the cache first
          const cacheKey = `${type}_${id}`;
          priceCache.get(cacheKey, true);
          
          // Fetch fresh data
          await fetchGamePrices(null, container.id, true, { type, id });
          
          // Check the data source after update
          const dataSource = priceCache.getSource(`${type}_${id}`) || "web";
          const sourceText = dataSource === "api" ? "API" : "Web";
          
          refreshText.textContent = `Updated just now (via ${sourceText})`;
          setTimeout(() => {
            refreshText.textContent = "";
          }, 3000);
        } catch (error) {
          console.error("Failed to refresh prices:", error);
          refreshText.textContent = "Refresh failed";
          setTimeout(() => {
            refreshText.textContent = "";
          }, 3000);
        } finally {
          refreshButton.classList.remove("loading");
          refreshButton.disabled = false;
        }
      });
    });

    // Add settings dropdown toggle
    const settingsIcon = container.querySelector(".gg-settings-icon");
    const settingsContent = container.querySelector(".gg-settings-content");

    settingsIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      settingsContent.classList.toggle("show");
    });

    // Close settings dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!settingsContent.contains(e.target) && !settingsIcon.contains(e.target)) {
        settingsContent.classList.remove("show");
      }
    });

    // Update last refresh time if cached data exists
    const urlMatch = window.location.pathname.match(/\/(app|sub|bundle)\/(\d+)/);
    if (urlMatch) {
      const [, type, id] = urlMatch;
      const timestamp = priceCache.getTimestamp(`${type}_${id}`);
      if (timestamp) {
                  // Update all refresh tooltips with the timestamp and source
          container.querySelectorAll('.gg-refresh').forEach(refreshButton => {
            const tooltipSpan = refreshButton.querySelector('.gg-tooltip-text');
            if (tooltipSpan) {
              const timeAgo = Math.floor((Date.now() - timestamp) / 60000); // minutes
              
              // Get source of data (API or web scraping)
              const source = priceCache.getSource(`${type}_${id}`) || "web";
              const sourceText = source === "api" ? "API" : "Web";
              
              // Format time ago text
              let timeText;
              if (timeAgo < 60) {
                timeText = `${timeAgo}m ago`;
              } else {
                const hoursAgo = Math.floor(timeAgo / 60);
                timeText = `${hoursAgo}h ago`;
              }
              
              tooltipSpan.textContent = `Updated ${timeText} (via ${sourceText})`;
            }
          });
      }
    }

    return container;
  }

  // Improved error handling and retries
  async function fetchWithRetry(url, retries = MAX_RETRIES) {
    try {
      const response = await rateLimitedRequest(url);
      if (response.status === 200) {
        return response;
      }
      throw new Error(`HTTP ${response.status} (${response.statusText || 'Unknown'})`);
    } catch (error) {
      if (retries > 0) {
        console.warn(`GG.deals fetchWithRetry: Retrying ${url} (${retries} retries left)`, {
          error: error.message,
          url: url,
          status: error.status || 'Unknown',
          statusText: error.statusText || 'Unknown',
          retriesLeft: retries,
          timestamp: new Date().toISOString()
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchWithRetry(url, retries - 1);
      }
      console.error(`GG.deals fetchWithRetry: All retries failed for ${url}`, {
        error: error.message,
        url: url,
        status: error.status || 'Unknown',
        statusText: error.statusText || 'Unknown',
        responseText: error.responseText?.substring(0, 500) || 'No response text',
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  async function fetchGamePrices(gameTitle, containerId, forceRefresh = false, idInfo = null) {
    let type, id;

    if (idInfo) {
        type = idInfo.type;
        id = idInfo.id;
    } else {
        // First try to get ID from the container itself
        const container = document.getElementById(containerId);
        if (container) {
            const purchaseGame = container.closest('.game_area_purchase_game');
            if (purchaseGame) {
                const bundleInput = purchaseGame.querySelector('input[name="bundleid"]');
                const subInput = purchaseGame.querySelector('input[name="subid"]');
                if (bundleInput) {
                    type = 'bundle';
                    id = bundleInput.value;
                } else if (subInput) {
                    type = 'sub';
                    id = subInput.value;
                }
            }
        }

        // If no ID found from container, try URL
        if (!type || !id) {
            const urlMatch = window.location.pathname.match(/\/(app|sub|bundle)\/(\d+)/);
            if (!urlMatch) {
                console.warn("GG.deals: Could not find Steam ID");
                return;
            }
            [, type, id] = urlMatch;
        }
    }

    const cacheKey = `${type}_${id}`;
    
    // Track active requests to prevent duplicate requests for the same game
    const pendingRequestKey = `pending_${cacheKey}`;
    if (window[pendingRequestKey] && !forceRefresh) {
        console.log(`GG.deals: Request for ${type} ${id} already in progress, waiting...`);
        try {
            await window[pendingRequestKey];
            // After the pending request completes, get the cached data
            const cachedAfterWait = priceCache.get(cacheKey);
            if (cachedAfterWait) {
                updatePriceDisplay(cachedAfterWait, containerId);
                return;
            }
        } catch (error) {
            console.warn(`GG.deals: Error waiting for pending request: ${error}`);
            // Continue with a new request if the pending one failed
        }
    }

    // Check cache before making any requests
    const cachedData = priceCache.get(cacheKey, forceRefresh);
    if (cachedData) {
        updatePriceDisplay(cachedData, containerId);
        return;
    }

    // Create a promise for this request that other potential duplicate requests can await
    const requestPromise = (async () => {
        try {
            // If forcing refresh, clear cache for all containers on the page
            if (forceRefresh) {
                document.querySelectorAll('.gg-deals-container').forEach(container => {
                    if (container.id && container.id !== containerId) {
                        const match = container.id.match(/gg-deals-(app|sub|bundle)-(\d+)/);
                        if (match) {
                            const [, containerType, containerId] = match;
                            priceCache.get(`${containerType}_${containerId}`, true);
                        }
                    }
                });
            }
            
            // Check if API should be used
            const useApi = GM_getValue("useApi", false);
            const apiKey = GM_getValue("apiKey", "");
            const enableScraping = GM_getValue("enableScraping", true);
            
            // Try to use API if enabled and key is available
            // Note: API works for app IDs and sub IDs, not bundle IDs
            // Bundle pages always use web scraping regardless of API settings
            if (useApi && apiKey && (type === 'app' || type === 'sub')) {
                try {
                    // Use the ID directly, whether it's an app or sub ID
                    const itemId = id;
                    console.log(`GG.deals: Using API to fetch prices for ${type} ${id}`);
                    const data = await fetchGamePricesApi(itemId, type);
                    if (data) {
                        priceCache.set(cacheKey, data, "api");
                        updatePriceDisplay(data, containerId);
                        return;
                    }
                } catch (error) {
                    console.warn("GG.deals API fetch failed:", {
                        error: error.message,
                        steamId: id,
                        steamType: type,
                        region: GM_getValue("preferredRegion", "us"),
                        apiKey: apiKey ? "Present" : "Missing",
                        stack: error.stack,
                        timestamp: new Date().toISOString()
                    });
                    // If API fails and scraping is disabled, hide the container
                    if (!enableScraping) {
                        const noDataResult = {
                            officialPrice: "No data",
                            keyshopPrice: "No data",
                            historicalData: [],
                            lowestPriceType: null,
                            url: `https://gg.deals/steam/${type}/${id}/`,
                            isCorrectGame: true,
                            noData: true // Flag to indicate there's no data
                        };
                        priceCache.set(cacheKey, noDataResult, "api");
                        // Hide the container instead of updating with "No data"
                        const container = document.getElementById(containerId);
                        if (container) {
                            container.style.display = "none";
                        }
                        return;
                    }
                    // Otherwise fall back to web scraping if enabled
                }
            }

            // If scraping is disabled, hide the container entirely
            if (!enableScraping) {
                const noDataResult = {
                    officialPrice: "No data",
                    keyshopPrice: "No data",
                    historicalData: [],
                    lowestPriceType: null,
                    url: `https://gg.deals/steam/${type}/${id}/`,
                    isCorrectGame: true,
                    noData: true // Flag to indicate there's no data
                };
                priceCache.set(cacheKey, noDataResult, "web");
                // Hide the container instead of updating with "No data"
                const container = document.getElementById(containerId);
                if (container) {
                    container.style.display = "none";
                }
                return;
            }

            // If we get here, we're either:
            // 1. Using web scraping for any type (scraping enabled)
            // 2. Not using API at all

            // Batch requests for performance
            await new Promise(resolve => setTimeout(resolve, Math.random() * 100));

            // Function to convert game name to URL slug
            const toUrlSlug = (name) => {
                return name.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            };

            // Define base URL formats - only try one format unless necessary
            let urlFormats = [];
            
            if (type === 'bundle') {
                // For bundles, only try the bundle format
                urlFormats = [{ type: 'bundle', id: id }];
            } else if (type === 'app') {
                // For apps, only try the app format
                urlFormats = [{ type: 'app', id: id }];
            } else if (type === 'sub') {
                // For subs, try app format first since GG.deals now uses app IDs for subs
                urlFormats = [
                    { type: 'app', id: id }, // Try app format first (new standard)
                    { type: 'sub', id: id }  // Try sub format as fallback (legacy if for whatever reason they will add it back)
                ];
            }

            // Try each URL format
            for (const format of urlFormats) {
                try {
                    const steamUrl = `https://gg.deals/steam/${format.type}/${format.id}/`;
                    const response = await fetchWithRetry(steamUrl);
                    const data = extractPriceData(response.responseText);
                    if (data && data.officialPrice !== "No data") {
                        priceCache.set(cacheKey, data, "web");
                        updatePriceDisplay(data, containerId);
                        return;
                    }
                } catch (error) {
                    const isCloudflareBlock = error.message?.includes('403') || error.status === 403;
                    const errorDetails = {
                        error: error.message,
                        url: `https://gg.deals/steam/${format.type}/${format.id}/`,
                        steamId: format.id,
                        steamType: format.type,
                        status: error.status || 'Unknown',
                        statusText: error.statusText || 'Unknown',
                        responseText: error.responseText?.substring(0, 500) || 'No response text',
                        stack: error.stack,
                        timestamp: new Date().toISOString(),
                        isCloudflareBlock: isCloudflareBlock
                    };
                    
                    if (isCloudflareBlock) {
                        console.error(`GG.deals ${format.type} URL blocked by Cloudflare:`, errorDetails);
                        console.warn(`GG.deals: Cloudflare protection detected. Can't do anything about it.`);
                    } else {
                        console.warn(`GG.deals ${format.type} URL fetch failed:`, errorDetails);
                    }
                }
            }

            // If the direct Steam URL didn't work, try to construct a fallback URL
            // This is useful when Cloudflare blocks web scraping but we can still show a link
            const fallbackUrl = `https://gg.deals/steam/${type}/${id}/`;
            
            // Create a minimal data structure with the fallback URL
            const noDataResult = {
                officialPrice: "No data",
                keyshopPrice: "No data",
                historicalData: [],
                lowestPriceType: null,
                url: fallbackUrl,
                isCorrectGame: true,
                noData: true, // Flag to indicate there's no data
                cloudflareBlocked: true // Flag to indicate Cloudflare blocked the request
            };
            
            priceCache.set(cacheKey, noDataResult, "web");
            
            // Instead of hiding the container, show it with a message about Cloudflare
            const container = document.getElementById(containerId);
            if (container) {
                // Update the display to show the fallback data
                updatePriceDisplay(noDataResult, containerId);
                
                // Add a small notice about Cloudflare if this is the first time
                if (!container.querySelector('.gg-cloudflare-notice')) {
                    const notice = document.createElement('div');
                    notice.className = 'gg-cloudflare-notice';
                    notice.style.cssText = 'font-size: 11px; color: #ff7b7b; margin-top: 8px; font-style: italic; text-align: center;';
                    notice.textContent = '⚠️ Cloudflare protection detected. Use API for full functionality.';
                    container.appendChild(notice);
                }
            }
        } finally {
            // Clear the pending request marker when done
            window[pendingRequestKey] = null;
        }
    })();
    
    // Store the promise so other requests for the same item can wait for it
    window[pendingRequestKey] = requestPromise;
    
    // Execute the promise
    await requestPromise;
  }

  function extractPriceData(html, expectedGameName) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Get the actual game name from the page
    const pageGameName = doc.querySelector('.game-info-title')?.textContent?.trim() ||
                        doc.querySelector('.game-header-title')?.textContent?.trim();

    // Check if we got the correct game
    const isCorrectGame = !expectedGameName || !pageGameName || 
                         pageGameName.toLowerCase().includes(expectedGameName.toLowerCase()) ||
                         expectedGameName.toLowerCase().includes(pageGameName.toLowerCase());

    // Check if it's a valid game page
    if (!doc.querySelector('.game-info-price-col')) {
        return {
            officialPrice: "No data",
            keyshopPrice: "No data",
            historicalData: [],
            lowestPriceType: null,
            url: doc.querySelector('link[rel="canonical"]')?.href || "https://gg.deals",
            isCorrectGame
        };
    }

    // Find current prices (non-historical)
    let officialPrice = "No data";
    let keyshopPrice = "No data";

    // Look for current prices in the main price sections (not historical)
    const currentPriceSections = Array.from(doc.querySelectorAll('.game-info-price-col')).filter(
      section => !section.classList.contains('historical')
    );

    currentPriceSections.forEach(section => {
      const label = section.querySelector('.game-info-price-label')?.textContent.trim();
      const price = section.querySelector('.price-inner.numeric')?.textContent.trim();
      
      if (label?.includes('Official Stores')) {
        officialPrice = price || "No data";
      } else if (label?.includes('Keyshops')) {
        keyshopPrice = price || "No data";
      }
    });

    // Historical lows (separate section)
    const historicalPrices = doc.querySelectorAll(
      ".game-info-price-col.historical.game-header-price-box"
    );
    const historicalData = [];
    historicalPrices.forEach((priceBox) => {
      const label = priceBox
        .querySelector(".game-info-price-label")
        ?.textContent.trim();
      const price = priceBox
        .querySelector(".price-inner.numeric")
        ?.textContent.trim();
      let date = priceBox
        .querySelector(".game-price-active-label")
        ?.textContent.trim();
      date = date?.replace("Expired", "").trim();

      if (!price || !date) return;

      const historicalText = `Historical Low: ${price} (${date})`;

      if (label?.includes("Official Stores Low")) {
        historicalData.push({
          type: "official",
          price: price,
          historical: historicalText,
        });
      } else if (label?.includes("Keyshops Low") && keyshopPrice !== "No data") {
        historicalData.push({
          type: "keyshop",
          price: price,
          historical: historicalText,
        });
      }
    });

    // Compare current prices (not historical) to determine the lowest
    const officialPriceNum = parseFloat(
      officialPrice.replace(/[^0-9,.]/g, "").replace(",", ".")
    );
    const keyshopPriceNum = parseFloat(
      keyshopPrice.replace(/[^0-9,.]/g, "").replace(",", ".")
    );

    let lowestPriceType = null;
    if (!isNaN(officialPriceNum) && !isNaN(keyshopPriceNum)) {
      lowestPriceType =
        officialPriceNum <= keyshopPriceNum ? "official" : "keyshop";
    } else if (!isNaN(officialPriceNum)) {
      lowestPriceType = "official";
    } else if (!isNaN(keyshopPriceNum)) {
      lowestPriceType = "keyshop";
    }

    // Get the current URL for the "View Offers" link
    const currentUrl = doc.querySelector('link[rel="canonical"]')?.href || "https://gg.deals";

    return {
      officialPrice: officialPrice,
      keyshopPrice: keyshopPrice,
      historicalData: historicalData,
      lowestPriceType: lowestPriceType,
      url: currentUrl,
      isCorrectGame
    };
  }

  function updatePriceDisplay(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // If data has the noData flag, hide the container and return
    if (data && data.noData) {
        container.style.display = "none";
        return;
    }

    // Update all View Offers links in the container
    const links = container.querySelectorAll(".gg-view-offers");

    if (data) {
        // Update prices based on container type
        if (container.classList.contains('bundle-sub-display')) {
            // Update compact display
            const officialPrice = container.querySelector('.gg-compact-official-price');
            const keyshopPrice = container.querySelector('.gg-compact-keyshop-price');
            const officialHistorical = container.querySelector('.gg-compact-official-historical');
            const keyshopHistorical = container.querySelector('.gg-compact-keyshop-historical');

            if (officialPrice) officialPrice.textContent = data.officialPrice;
            if (keyshopPrice) keyshopPrice.textContent = data.keyshopPrice;

            // Show historical data regardless of current price status
            if (officialHistorical) {
                const officialHistData = data.historicalData.find(h => h.type === 'official');
                officialHistorical.textContent = officialHistData?.historical || '';
            }
            if (keyshopHistorical) {
                const keyshopHistData = data.historicalData.find(h => h.type === 'keyshop');
                keyshopHistorical.textContent = keyshopHistData?.historical || '';
            }

            // Update best price indicators
            if (officialPrice) officialPrice.classList.remove('best-price');
            if (keyshopPrice) keyshopPrice.classList.remove('best-price');

            if (data.lowestPriceType === 'official' && officialPrice) {
                officialPrice.classList.add('best-price');
            } else if (data.lowestPriceType === 'keyshop' && keyshopPrice) {
                keyshopPrice.classList.add('best-price');
            }
        } else {
            // Update full display
            const elements = {
                official: {
                    price: container.querySelector("#gg-official-price"),
                    historical: container.querySelector("#gg-official-historical"),
                    compactPrice: container.querySelector("#gg-compact-official-price"),
                    compactHistorical: container.querySelector("#gg-compact-official-historical")
                },
                keyshop: {
                    price: container.querySelector("#gg-keyshop-price"),
                    historical: container.querySelector("#gg-keyshop-historical"),
                    compactPrice: container.querySelector("#gg-compact-keyshop-price"),
                    compactHistorical: container.querySelector("#gg-compact-keyshop-historical")
                }
            };

            // Update prices
            if (elements.official.price) elements.official.price.textContent = data.officialPrice;
            if (elements.keyshop.price) elements.keyshop.price.textContent = data.keyshopPrice;
            if (elements.official.compactPrice) elements.official.compactPrice.textContent = data.officialPrice;
            if (elements.keyshop.compactPrice) elements.keyshop.compactPrice.textContent = data.keyshopPrice;

            // Update historical data regardless of current price status
            const officialHistData = data.historicalData.find(h => h.type === 'official');
            const keyshopHistData = data.historicalData.find(h => h.type === 'keyshop');

            if (elements.official.historical) {
                elements.official.historical.textContent = officialHistData?.historical || '';
            }
            if (elements.keyshop.historical) {
                elements.keyshop.historical.textContent = keyshopHistData?.historical || '';
            }
            if (elements.official.compactHistorical) {
                elements.official.compactHistorical.textContent = officialHistData?.historical || '';
            }
            if (elements.keyshop.compactHistorical) {
                elements.keyshop.compactHistorical.textContent = keyshopHistData?.historical || '';
            }

            // Update best price indicators
            [elements.official.price, elements.official.compactPrice, elements.keyshop.price, elements.keyshop.compactPrice].forEach(el => {
                if (el) el.classList.remove('best-price');
            });

            if (data.lowestPriceType === 'official') {
                [elements.official.price, elements.official.compactPrice].forEach(el => {
                    if (el) el.classList.add('best-price');
                });
            } else if (data.lowestPriceType === 'keyshop') {
                [elements.keyshop.price, elements.keyshop.compactPrice].forEach(el => {
                    if (el) el.classList.add('best-price');
                });
            }
        }

        // Update all View Offers links
        if (data.url) {
            links.forEach(link => {
                link.href = data.url;
            });
        }
    } else {
        // Handle error state
        const priceElements = container.querySelectorAll('.gg-price-value:not(.historical)');
        priceElements.forEach(el => {
            el.textContent = 'Not found';
        });

        const historicalElements = container.querySelectorAll('.gg-historical-tooltip-text, .gg-price-value.historical');
        historicalElements.forEach(el => {
            el.textContent = '';
        });

        // Set default URL for all View Offers links
        links.forEach(link => {
            link.href = `https://gg.deals/steam/${type}/${id}/`;
        });
    }
  }

  function createCompactPriceDisplay(containerId) {
    const container = document.createElement('div');
    container.className = 'gg-deals-container compact bundle-sub-display';
    container.id = containerId;
    container.style.display = toggleStates.subDisplay ? "" : "none";
    container.innerHTML = `
        <div class="gg-compact-row">
            <img src="https://gg.deals/favicon.ico" alt="GG.deals" class="gg-icon">
            <div class="gg-compact-prices">
                <div class="gg-compact-price-item gg-compact-official" style="${!toggleStates.official ? "display:none" : ""}">
                    <span>Official:</span>
                    <span class="gg-historical-tooltip">
                        <span class="gg-price-value gg-compact-official-price">Loading...</span>
                        <span class="gg-historical-tooltip-text gg-compact-official-historical"></span>
                    </span>
                </div>
                <div class="gg-compact-price-item gg-compact-keyshop" style="${!toggleStates.keyshop ? "display:none" : ""}">
                    <span>Keyshop:</span>
                    <span class="gg-historical-tooltip">
                        <span class="gg-price-value gg-compact-keyshop-price">Loading...</span>
                        <span class="gg-historical-tooltip-text gg-compact-keyshop-historical"></span>
                    </span>
                </div>
            </div>
            <div class="gg-compact-controls">
                <a href="#" target="_blank" class="gg-view-offers">View Offers</a>
            </div>
        </div>
    `;
    return container;
  }

  // Wait for Steam page to fully load (including age gate) and handle tab visibility
  let isInitialized = false;
  
  // Queue for batching price requests
  const requestQueue = {
    items: [],
    processing: false,
    
    add: function(item) {
      this.items.push(item);
      if (!this.processing) {
        this.processQueue();
      }
    },
    
    processQueue: async function() {
      if (this.items.length === 0) {
        this.processing = false;
        return;
      }
      
      this.processing = true;
      
      // Process items in batches of 3 with a small delay between batches
      const BATCH_SIZE = 3;
      const BATCH_DELAY = 300; // ms
      
      // Process a batch
      const batch = this.items.splice(0, BATCH_SIZE);
      const promises = batch.map(item => {
        return fetchGamePrices(
          item.gameTitle, 
          item.containerId, 
          item.forceRefresh, 
          item.idInfo
        ).catch(err => {
          console.warn(`GG.deals: Error processing queue item:`, {
            error: err.message,
            containerId: item.containerId,
            gameTitle: item.gameTitle,
            forceRefresh: item.forceRefresh,
            idInfo: item.idInfo,
            stack: err.stack,
            timestamp: new Date().toISOString()
          });
          // Update the display to show error
          const container = document.getElementById(item.containerId);
          if (container) {
            const priceElements = container.querySelectorAll('.gg-price-value:not(.historical)');
            priceElements.forEach(el => {
              el.textContent = 'Error';
            });
          }
        });
      });
      
      // Wait for batch to complete
      await Promise.all(promises);
      
      // Small delay before next batch to avoid overwhelming browser
      if (this.items.length > 0) {
        setTimeout(() => this.processQueue(), BATCH_DELAY);
      } else {
        this.processing = false;
      }
    }
  };

  function initializeWhenVisible() {
    if (document.visibilityState === "visible" && !isInitialized) {
        const urlMatch = window.location.pathname.match(/\/(app|sub|bundle)\/(\d+)/);
        if (!urlMatch) return;

        const [, pageType, pageId] = urlMatch;
        isInitialized = true;

        // For app pages, show the full container at the top
        if (pageType === 'app') {
            const purchaseSection = document.querySelector("#game_area_purchase");
            if (purchaseSection) {
                const mainContainer = createPriceContainer();
                mainContainer.id = 'gg-deals-main';
                purchaseSection.parentNode.insertBefore(mainContainer, purchaseSection);
                
                // Prioritize the main container request
                requestQueue.add({
                  gameTitle: null,
                  containerId: 'gg-deals-main',
                  forceRefresh: false,
                  idInfo: { type: pageType, id: pageId }
                });
            }
        }

        // For sub/bundle pages, show only one display at the top
        if (pageType === 'sub' || pageType === 'bundle') {
            // Try to find the first purchase game section
            const firstPurchaseGame = document.querySelector('.game_area_purchase_game');
            if (firstPurchaseGame) {
                const mainContainer = createPriceContainer();
                mainContainer.id = `gg-deals-${pageType}-${pageId}`;
                firstPurchaseGame.parentNode.insertBefore(mainContainer, firstPurchaseGame);
                
                requestQueue.add({
                  gameTitle: null,
                  containerId: mainContainer.id,
                  forceRefresh: false,
                  idInfo: { type: pageType, id: pageId }
                });
            }
            return; // Exit early to prevent additional displays
        }

        // Only process additional items if we're on an app page
        if (pageType === 'app') {
            // Get all purchase sections up front
            const purchaseSections = document.querySelectorAll('.game_area_purchase_game');
            let delayIndex = 0;
            
            // Function to process sections with delay
            const processSections = () => {
              // Process each purchase game with the bundle/sub displays
              purchaseSections.forEach((element, index) => {
                // Skip if this is a demo section
                if (element.closest('.demo_above_purchase')) {
                    return;
                }
            
                // Get the ID and type from the inputs
                const bundleInput = element.querySelector('input[name="bundleid"]');
                const subInput = element.querySelector('input[name="subid"]');
            
                if (!bundleInput && !subInput) {
                    // If no inputs found, try to get ID from the element ID
                    const elementId = element.id.match(/\d+$/)?.[0];
            
                    // Skip main app on app pages (main app already handled above)
                    if (pageType === 'app' && elementId === pageId) {
                        return;
                    }
                }

                let itemType, itemId;
                if (bundleInput) {
                    itemType = 'bundle';
                    itemId = bundleInput.value;
                } else if (subInput) {
                    itemType = 'sub';
                    itemId = subInput.value;
                } else {
                    // Skip this item if we can't identify it
                    return;
                }

                const containerId = `gg-deals-${itemType}-${itemId}`;
                
                // Check if a display already exists for this ID
                if (document.getElementById(containerId)) {
                  return; // Skip if already exists
                }
                
                const compactDisplay = createCompactPriceDisplay(containerId);
                
                // Insert before game_purchase_action
                const purchaseAction = element.querySelector('.game_purchase_action');
                if (purchaseAction) {
                    purchaseAction.parentNode.insertBefore(compactDisplay, purchaseAction);
                    
                    // Add to request queue with lower priority
                    requestQueue.add({
                      gameTitle: null, 
                      containerId: containerId,
                      forceRefresh: false,
                      idInfo: { type: itemType, id: itemId }
                    });
                }
              });
            };
            
            // Use requestIdleCallback if available, otherwise use setTimeout
            if (typeof window.requestIdleCallback === 'function') {
              window.requestIdleCallback(() => processSections(), { timeout: 1000 });
            } else {
              // Small delay to let the main page render first
              setTimeout(processSections, 200);
            }
        }
    }
  }

  // Utility function to debounce function calls - useful for event handlers
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // Check for visibility changes with debounce
  document.addEventListener("visibilitychange", debounce(initializeWhenVisible, 100));

  // Initial check (in case the tab is already visible)
  // Use setTimeout to ensure the page is fully loaded
  setTimeout(() => {
    if (document.visibilityState === "visible") {
      initializeWhenVisible();
    }
  }, 500);
  
  // Cleanup interval check after a reasonable time
  const checkTitle = setInterval(() => {
    if (document.visibilityState === "visible") {
      initializeWhenVisible();
      if (isInitialized) {
        clearInterval(checkTitle);
      }
    }
  }, 1000);
  
  // Clear the interval after 10 seconds regardless to avoid resource waste
  setTimeout(() => {
    clearInterval(checkTitle);
  }, 10000);
})();