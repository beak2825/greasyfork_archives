// ==UserScript==
// @name         4.3 Enhanced Amazon Shopping Assistant
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Combines price savings calculator, ratings enhancement, and navigation features
// @author       Sarah Wilkerson
// @match        https://*.amazon.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/520959/43%20Enhanced%20Amazon%20Shopping%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/520959/43%20Enhanced%20Amazon%20Shopping%20Assistant.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Amazon Filter URL Handler
  class AmazonFilterHandler {
    // Track filter state
    static instance = null;
    constructor() {
      this.filterParams = {
        delivery: {
          today: "p_90:8308920011",
          tomorrow: "p_90:8308921011",
          overnight: "p_101:19346686011",
        },
        rating: {
          fourPlus: "2661617011", // Four stars and up
        },
        deals: {
          today: "p_n_deal_type:23566064011",
          all: "p_n_deal_type:23566065011",
        },
      };
    }

    // Parse current URL parameters
    parseCurrentUrl() {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      return {
        searchQuery: params.get("k") || "",
        crid: params.get("crid") || "",
        sprefix: params.get("sprefix") || "",
        rh: params.get("rh") || "",
        ref: params.get("ref") || "",
        lowPrice: params.get("low-price") || "",
        highPrice: params.get("high-price") || "",
      };
    }

    // Build filter string for rh parameter
    buildRhParameter(filters) {
      const rhParts = [];

      // Add delivery filter
      if (filters.delivery) {
        rhParts.push(this.filterParams.delivery[filters.delivery]);
      }

      // Add rating filter
      if (filters.rating === "fourPlus") {
        rhParts.push(`p_72:${this.filterParams.rating.fourPlus}`);
      }

      // Add deals filter
      if (filters.deals) {
        rhParts.push(this.filterParams.deals[filters.deals]);
      }

      return rhParts.join(",");
    }
    // Modified generateFilteredUrl to work with existing functionality
    generateFilteredUrl(filters) {
      const currentParams = this.parseCurrentUrl();
      const url = new URL(window.location.href);
      const params = new URLSearchParams();

      // Preserve essential search parameters
      if (currentParams.searchQuery) {
        params.set("k", currentParams.searchQuery);
      }
      if (currentParams.crid) {
        params.set("crid", currentParams.crid);
      }
      if (currentParams.sprefix) {
        params.set("sprefix", currentParams.sprefix);
      }

      // Add price range if specified
      if (filters.lowPrice) {
        params.set("low-price", filters.lowPrice);
      }
      if (filters.highPrice) {
        params.set("high-price", filters.highPrice);
      }

      // Build rh parameter for combined filters
      const rhValue = this.buildRhParameter(filters);
      if (rhValue) {
        params.set("rh", rhValue);
      }

      // Set page to 1 when applying new filters
      params.set("page", "1");

      // Set appropriate ref parameter
      params.set("ref", "sr_st_filtered");

      url.search = params.toString();
      return url.toString();
    }

    // Apply filters and navigate
    applyFilters(filters) {
      // Save current scroll position and filter state
      const scrollPos = window.scrollY;
      const filterState =
        document.getElementById("search-filter-panel")?.innerHTML || "";

      // Generate and navigate to filtered URL
      const newUrl = this.generateFilteredUrl(filters);

      // Use History API to avoid full page reload when possible
      if (window.history && window.history.pushState) {
        window.history.pushState({ scrollPos, filterState }, "", newUrl);

        // Trigger a custom event for the filter panel to update
        const event = new CustomEvent("filtersApplied", { detail: filters });
        window.dispatchEvent(event);
      } else {
        window.location.href = newUrl;
      }
    }

    // Handle back/forward navigation
    handleNavigation(e) {
      if (e.state) {
        // Restore scroll position and filter state
        window.scrollTo(0, e.state.scrollPos);
        if (e.state.filterState) {
          const filterPanel = document.getElementById("search-filter-panel");
          if (filterPanel) {
            filterPanel.innerHTML = e.state.filterState;
          }
        }
      }
    }
  }

  GM_addStyle(`
        /* Hide Ads */
        .s-flex-geom {
            display: none !important;
        }

        .s-desktop-content [data-acp-tracking] {
            display: none !important;
        }

        /* Filter Panel Styles - Modified for left sidebar integration */
        #search-filter-panel {
            position: static !important;
            background: transparent;
            background: #111827; /* Dark background */
            padding: 0px 20px 20px !important;
            border-radius: 12px !important;
            box-shadow: none !important;
            width: 100% !important;
            margin-top: 16px !important;
            border-top: 1px solid #e7e7e7 !important;
            animation: none !important;
            max-height: none !important;
            overflow: visible !important;
        border: 1px solid #374151;
        margin-bottom: 16px !important;
        }

        /* Header Styles */
        .filter-header {
            display: flex !important;
            flex-direction: column !important;
            gap: 6px !important;
            margin-bottom: 16px !important;
            padding-top: 16px !important;
            padding-bottom:8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .filter-header-top {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
        }

        .filter-header h3 {
            color: #ffffff !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            margin: 0 !important;
        }

        .filter-count-container {
      display: flex;
      justify-content: flex-start;
      column-gap: 10px;
      align-items: center;
  }

        .filter-count {
            background: #ffa94d !important;
            color: #1a1f2e !important;
            width: 28px !important;
            height: 28px !important;
            border-radius: 50% !important;
            display: none !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 14px !important;
            font-weight: 600 !important;
        }

        .filter-count.active {
            display: flex !important;
        }

        .reset-icon {
                color: #4285f4 !important;
      cursor: pointer !important;
      opacity: 0 !important;
      transition: all 0.3s ease !important;
      display: flex !important;
      align-items: flex-start;
      justify-content: flex-start;
      width: 24px;
      height: 24px;
      border-radius: 50% !important;
      transform-origin: center !important;
      padding: 0 !important;
        }

        .reset-icon svg {
            width: 22px !important;
            height: 22px !important;
            transform: rotate(-45deg) !important;
        }

        .reset-icon:hover {
            background: rgba(66, 133, 244, 0.1) !important;
        }

        .reset-icon:hover svg {
            transform: rotate(135deg) !important;
        }

        .reset-icon.active {
            opacity: 1 !important;
        }

        .reset-icon:hover {
            background: rgba(66, 133, 244, 0.1) !important;
            transform: rotate(-180deg) !important;
        }

        .reset-icon svg {
            transform: scale(0.9) !important;
        }

        .filter-stats {
            color: #9ca3af !important;
            font-size: 14px !important;
            text-align: left !important;
            margin: 0 !important;
        }

        /* Hide the old reset button */
        .reset-filters-button {
            display: none !important;
        }

        /* Filter Section Styles */
        .filter-section {
            margin-bottom: 10px !important;
            padding: 0 0 12px !important;
            border-bottom: 1px solid #e7e7e7 !important;
        }

        .filter-section label {
            color: #e5e7eb !important;
            font-size: 15px !important;
            font-weight: 500 !important;
            margin-bottom: 12px !important;
            display: block !important;
            transition: color 0.2s ease !important;
        }

        .filter-section.active label {
            color: #febd69 !important;
        }

        /* Input Styles */
        .filter-input {
            background: #fff !important;
            border: 1px solid #374151;
            border-radius: 8px;
            padding: 6px 10px !important;
            font-size: 13px !important;
            width: calc(100% - 0px) !important;
        }

        .filter-input:focus {
            border-color: #3b82f6;
            outline: none;
            box-shadow: 0 0 0 2px #C8F3FA !important;
        }

        /* Updated Rating Slider Styles */
        .rating-header label {
      margin-bottom: 0px !important;
  }

        .rating-slider-container {
            padding: 10px 0 10px !important;
            position: relative !important;
        }

        .rating-slider {
            -webkit-appearance: none !important;
            width: 100% !important;
            height: 4px !important;
            border-radius: 6px !important;
            background: linear-gradient(to right,
                #4285f4 var(--slider-progress, 0%),
                #e5e7eb var(--slider-progress, 0%)) !important;
            outline: none !important;
            transition: all 0.2s !important;
        }

        .rating-slider::-webkit-slider-thumb {
            -webkit-appearance: none !important;
            appearance: none !important;
            width: 18px !important;
            height: 18px !important;
            border-radius: 50% !important;
            background: #4285f4 !important;
            border: 2px solid #fff !important;
            box-shadow: 0 1px 4px rgba(66, 133, 244, 0.3) !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
        }

        .rating-slider::-moz-range-thumb {
            width: 18px !important;
            height: 18px !important;
            border-radius: 50% !important;
            background: #4285f4 !important;
            border: 2px solid #fff !important;
            box-shadow: 0 1px 4px rgba(66, 133, 244, 0.3) !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
        }

        .rating-slider::-webkit-slider-thumb:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 2px 6px rgba(66, 133, 244, 0.4) !important;
        }

        .rating-slider::-moz-range-thumb:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 2px 6px rgba(66, 133, 244, 0.4) !important;
        }

        .rating-header {
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
            font-weight: 500 !important;
        }

        .rating-star {
            color: #febd69 !important;
            font-size: 16px !important;
        }

        .rating-value {
            font-size: 14px !important;
            font-weight: 500 !important;
            color: #febd69 !important;
            margin-left: auto !important;
        }

        .rating-labels {
            display: flex !important;
            justify-content: space-between !important;
            margin-top: 6px !important;
            color: #9ca3af !important;
            font-size: 12px !important;
            font-weight: 400 !important;
        }

        /* Price Range Styles */
        .price-range-section {
            margin-bottom: 16px !important;
        }

        .price-range-container {
            display: flex !important;
            gap: 12px !important;
        }

        .price-input-wrapper {
            position: relative !important;
            flex: 1 !important;
        }

        .price-input {
            width: 100% !important;
            background: #ffffff !important;
            border: 1px solid #374151 !important;
            border-radius: 6px !important;
            padding: 8px 4px 8px 10px !important;
            font-size: 13px !important;
            color: #111827 !important;
            transition: all 0.2s ease !important;
            box-sizing: border-box !important;
        }

        .price-input:focus {
            border-color: #4285f4 !important;
            box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1) !important;
            outline: none !important;
        }

        .price-input::placeholder {
            color: #9ca3af !important;
        }

        .price-input-wrapper::before {
            content: "$" !important;
            position: absolute !important;
            left: 12px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            color: #6b7280 !important;
            font-size: 14px !important;
            pointer-events: none !important;
        }

        /* Button Styles */
        .filter-button {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: white;
        border: none;
        padding: 12px 18px;
        border-radius: 8px;
        cursor: pointer;
        width: 100%;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.3s ease;
        letter-spacing: -0.1px;
        box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        }

        .filter-button:hover {
            transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }

    .reset-filters-button {
      width: 100%;
      background: transparent;
      color: rgb(156, 163, 175);
      border: 1px solid rgb(55, 65, 81);
      padding: 12px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 0.875rem;
      margin-top: 8px;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
  }

  .reset-filters-button:hover {
      background: rgb(31, 41, 55);
      color: rgb(248, 113, 113);
      border-color: rgba(185, 28, 28, 0.3);
  }

/* Quick Filter Presets */
.quick-filters .preset-button {
    min-width: 45% !important;
    background-color: #2969ed !important;
    color: #fff !important;
    border: 1px solid #373e4d !important;
    transition: all 0.2s ease;
    overflow: hidden;
    position: relative;  /* Added for absolute positioning of effects */
    padding: 12px 16px;  /* Added for consistent spacing */
    border-radius: 12px; /* Added for modern look */
}

.quick-filters .preset-button:hover {
    transform: translateY(-1px) !important;
    background: linear-gradient(135deg, #003aff, #802dff) !important;
    box-shadow: 1px 1px 20px 6px rgb(161 41 237 / 40%) !important;
    animation: sparkle 0.8s ease-out !important;
        border: 1px solid #ffffff !important;

}

quick-filters .preset-button.active {
    background: linear-gradient(135deg, #ba21b4, #d31616) !important;
    box-shadow: 0 2px 4px rgba(41, 105, 237, 0.3) !important;
    transform: translateY(0) !important;
    border: 1px solid #ff2b00 !important;
}

 .quick-filters .preset-button.active:hover {
background: linear-gradient(135deg, #003aff, #802dff) !important;}


        /* Preset Button Styles */
        .preset-button {
            background: #fff !important;
            border: 1px solid #D5D9D9 !important;
            border-radius: 8px !important;
            color: #0F1111 !important;
            font-size: 13px !important;
            padding: 6px 10px !important;
            margin: 0 6px 6px 0 !important;
            box-shadow: none !important;
            position: relative !important;
            transition: all 0.15s ease-in-out !important;
            cursor: pointer !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-width: 70px !important;
        }

        .preset-button:hover {
            background: #F7FAFA !important;
            border-color: #008296 !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 2px 5px rgba(213, 217, 217, 0.5) !important;
        }

        .preset-button:active {
            transform: translateY(0) !important;
            box-shadow: none !important;
        }

        .preset-button.active {
            background: #EDFDFF !important;
            border: 2px solid #008296 !important;
            padding: 5px 9px !important; /* Compensate for thicker border */
            font-weight: 500 !important;
        }

        .preset-button.active::before {
            content: "✓" !important;
            margin-right: 4px !important;
            font-size: 12px !important;
            color: #008296 !important;
        }

        .preset-button.active:hover {
            background: #E3F4F4 !important;
        }

        #filter-presets {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            margin-bottom: 12px !important;
        }

        /* Hide the floating filter toggle indicator when integrated */
        #filter-toggle-indicator {
            display: none !important;
        }

        /* Rating styles */
        span.a-icon-alt {
            clip-path: none !important;
        }

        .rating-high, .rating-medium, .rating-good {
            font-size: 0.85rem !important;
            line-height: 1rem !important;
            display: flex !important;
            position: absolute;
            top: -23px !important;
            left: -2px !important;
            font-weight: 600;
            font-style: normal;
            overflow: visible !important;
            opacity: 1 !important;
            padding: 0px 8px 16px;
            margin-bottom: 20px;
            width: 180px !important;
            transition: all 0.2s ease-in-out;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Rating styles on non-search pages */
        .a-icon-star-small > .rating-high,
        .a-icon-star-small > .rating-medium,
        .a-icon-star-small > .rating-good {
            font-size: 0.85rem !important;
            left: 0px !important;
        }

        .a-icon-star-small > .rating-high:before,
        .a-icon-star-small > .rating-medium:before,
        .a-icon-star-small > .rating-good:before {
            content: '';
        }

        .a-icon-star-small > .rating-high:after,
        .a-icon-star-small > .rating-medium:after,
        .a-icon-star-small > .rating-good:after {
            white-space: pre;
        }

        .a-section:has(.rating-medium),
        .a-section:has(.rating-high),
        .a-section:has(.rating-good) {
            margin-top: 32px;
        }

        .a-section.a-spacing-none.a-spacing-top-micro {
            padding-top: 24px;
        }

        /* Rating color classes with improved contrast and modern colors */
        .rating-high {
            background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
            color: #ffffff !important;
            border-radius: 6px !important;
        }

        .rating-high:before {
            content: 'BEST ';
            font-size: 0.85rem;
            white-space: pre;
        }

        .rating-medium {
            background: linear-gradient(135deg, #059669, #10b981) !important;
            color: #ffffff !important;
            border-radius: 6px !important;
        }

        .rating-medium:before {
            content: 'BETTER ';
            font-size: 0.85rem;
            white-space: pre;
        }

        .rating-good {
            background: linear-gradient(135deg, #d97706, #f59e0b) !important;
            color: #ffffff !important;
            border-radius: 6px !important;
        }

        .rating-good:before {
            content: 'GOOD ';
            font-size: 0.85rem;
            white-space: pre;
        }



        /* Savings percentage styling with dynamic colors */
        .savings-percentage {
            font-size: 0.85rem !important;
            line-height: 1.1rem !important;
            font-weight: 600 !important;
            margin: 8px 0 !important;
            padding: 4px 10px !important;
            border-radius: 6px !important;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            animation: savingsReveal 0.3s ease-out;
        }

        @keyframes savingsReveal {
            from {
                transform: translateX(-10px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        /* Dynamic discount colors */
        .savings-percentage[data-discount="high"] {
            background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
            color: white !important;
        }

        .savings-percentage[data-discount="medium"] {
            background: linear-gradient(135deg, #059669, #10b981}) !important;
            color: white !important;
        }

        .savings-percentage[data-discount="low"] {
            background: linear-gradient(135deg, #d97706, #ef4444) !important;
            color: white !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            #search-filter-panel {
                width: calc(100% - 32px);
                max-height: calc(100vh - 100px);
                top: 60px;
            }

            #nav-controls {
                bottom: 16px;
                right: 16px;
                flex-direction: column;
            }

            .nav-button {
                font-size: 0.85rem;
                padding: 8px 12px;
            }

            #filter-toggle-indicator {
                top: 16px;
                right: 16px;
                font-size: 0.85rem;
                padding: 8px 12px;
            }
        }

        /* Tooltip styling */
        #nav-tooltip {
            background: linear-gradient(135deg, #1f2937, #374151) !important;
            backdrop-filter: blur(8px);
            border-radius: 8px;
            font-weight: 400;
            letter-spacing: -0.1px;
            animation: tooltipFade 0.3s ease-out;
        }

        @keyframes tooltipFade {
            from {
                transform: translateY(10px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        /* Premium deal styles */
        .premium-item {
            position: relative !important;
            border: 2px solid #f59e0b !important;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15) !important;
            transition: all 0.3s ease-in-out !important;
            border-radius: 8px !important;
        }

        .premium-deal-badge {
            position: absolute !important;
            top: 8px !important;
            right: 8px !important;
            background: linear-gradient(135deg, #f59e0b, #d97706) !important;
            color: white !important;
            padding: 6px 12px !important;
            border-radius: 6px !important;
            font-weight: 600 !important;
            font-size: 0.85rem !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important;
            z-index: 999 !important;
            letter-spacing: -0.1px;
            animation: badgeReveal 0.3s ease-out;
        }

        @keyframes badgeReveal {
            from {
                transform: translateY(-10px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .selected-premium-deal {
            border: 2px solid #dc2626 !important;
            box-shadow: 0 6px 20px rgba(220, 38, 38, 0.2) !important;
            transform: scale(1.02);
            z-index: 100 !important;
            animation: dealSelect 0.3s ease-out;
        }

        @keyframes dealSelect {
            from {
                transform: scale(1);
            }
            to {
                transform: scale(1.02);
            }
        }

        /* Navigation controls */
        #nav-controls {
            position: static !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            background: transparent !important;
            margin-bottom: 16px !important;
        }

        .nav-button {
            border: none !important;
            border-radius: 12px !important;
            padding: 16px !important;
            font-size: 14px !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            transition: all 0.2s ease !important;
            width: 100% !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            opacity:0.6;
        }

        .nav-button .left-content {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
        }

        .nav-button .right-content {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
        }

        .nav-icon {
            color: #9ca3af !important;
            font-size: 20px !important;
        }

        .nav-shortcut, .shortcut {
            background: rgba(255, 255, 255, 0.1) !important;
            padding: 4px 8px !important;
            border-radius: 6px !important;
            font-size: 12px !important;
            font-weight: 500 !important;
        }

        .nav-subtitle {
            color: #9ca3af !important;
            font-size: 12px !important;
            margin-left: 28px !important;
        }

        .nav-arrows {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }

        .nav-arrow {
            font-size: 14px !important;
            padding: 4px !important;
        }

        #page-nav-button {
        background-color: #363e4d;
        color: #ccd5df !important;

        }

        #premium-nav-button {
        background-color: #e8a13b;
                color: #ffffff !important;

        }

        .deals-count {
            color: #9ca3af !important;
            font-size: 12px !important;
        }

        .nav-button:hover {
            border-color: #4285f4 !important;
            opacity: 1 !important;
        }

        .nav-button.active {
            border:none !important;
            opacity: 1 !important;
        }

        /* Dynamic Savings Percentage Styling */
        .savings-percentage {
            font-size: 0.85rem !important;
            line-height: 1.1rem !important;
            font-weight: 600 !important;
            margin: 8px 0 !important;
            padding: 4px 10px !important;
            border-radius: 6px !important;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            animation: savingsReveal 0.3s ease-out;
        }

        @keyframes savingsReveal {
            from {
                transform: translateX(-10px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        /* Dynamic discount colors */
        [data-discount="high"] {
            background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
            color: white !important;
        }

        [data-discount="medium"] {
            background: linear-gradient(135deg, #059669, #10b981) !important;
            color: white !important;
        }

        [data-discount="low"] {
            background: linear-gradient(135deg, #d97706, #f59e0b) !important;
            color: white !important;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
            #search-filter-panel {
                width: calc(100% - 32px);
                max-height: calc(100vh - 100px);
                top: 60px;
            }

            #nav-controls {
                bottom: 16px;
                right: 16px;
                flex-direction: column;
            }

            .nav-button {
                font-size: 0.85rem;
                padding: 8px 12px;
            }

            #filter-toggle-indicator {
                top: 16px;
                right: 16px;
                font-size: 0.85rem;
                padding: 8px 12px;
            }

            #filters-active-indicator {
                top: 16px;
                right: 200px;
            }
        }

        /* Tooltip Styling */
        #nav-tooltip {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: linear-gradient(135deg, #1f2937, #374151) !important;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 0.9rem;
            z-index: 1000;
            pointer-events: none;
            transition: opacity 0.3s ease;
            opacity: 0;
            backdrop-filter: blur(8px);
            font-weight: 400;
            letter-spacing: -0.1px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            animation: tooltipFade 0.3s ease-out;
        }

        @keyframes tooltipFade {
            from {
                transform: translateY(10px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        /* Preset buttons container */
           .preset-buttons-container {
            display: flex;
            gap: 8px;
            margin-top: 8px;
            width: 100%;
            flex-wrap: wrap;
        }

        /* Delivery preset button specific styles */
        .delivery-preset {
            flex: 1;
            min-width: 60px;
            padding: 8px 12px !important;
            text-align: center !important;
            font-size: 13px !important;
            background: #373e4d !important;
            border: 1px solid #374151 !important;
            color: #ffffff !important;
            transition: all 0.2s ease !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            margin: 0 !important;
        }

        .delivery-preset:hover {
            background: #F7FAFA !important;
            border-color: #008296 !important;
            transform: translateY(-1px) !important;
                        color: #008296 !important;

        }

        .delivery-preset.active {
            background: #EDFDFF !important;
            border: 2px solid #008296 !important;
            color: #373e4d !important;
            font-weight: 500 !important;
            padding: 7px 11px !important; /* Compensate for thicker border */
        }

        /* Discount preset button specific styles */
        .discount-preset {
            flex: 1;
            min-width: 30px !important;
            padding: 8px 8px !important;
            text-align: center !important;
            font-size: 13px !important;
            background: #373e4d !important;
            border: 1px solid #374151 !important;
            color: #ffffff !important;
            transition: all 0.2s ease !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            margin: 0 !important;
        }

        .discount-preset:hover {
            background: #F7FAFA !important;
            border-color: #008296 !important;
            color: #008296 !important;
            transform: translateY(-1px) !important;
        }

        .discount-preset.active {
            background: #EDFDFF !important;
            border: 2px solid #008296 !important;
            color: #373e4d !important;
            font-weight: 500 !important;
            padding: 7px 11px !important; /* Compensate for thicker border */
        }

        .discount-preset.active::before {
            content: "" !important;
            margin-right: 0px !important;
            font-size: 0px !important;
            color: #008296 !important;
        }

        /* Dropdown specific styles */
        select.filter-input {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat;
            background-position: right 0.7rem top 50%;
            background-size: 0.65rem auto;
            padding-right: 2.5rem;
            cursor: pointer;
            border: 1px solid #374151;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 13px;
            color: #ffffff;
            background-color: #373e4d !important;
            width: 100%;
            transition: all 0.2s ease;
        }

        select.filter-input:focus {
            border-color: #3b82f6;
            outline: none;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .filter-section.active select.filter-input {
          background: #EDFDFF !important;
            border: 2px solid #008296 !important;
            color: #373e4d !important;
  }

        select.filter-input option {
            font-size: 13px;
            padding: 8px;
            background-color: #ffffff;
            color: #111827;
        }



    `);

  // Add support for dynamic discount colors
  const oldProcessItems = window.processItems;
  window.processItems = function () {
    // Call the original function first
    oldProcessItems?.apply(this, arguments);

    // Add dynamic discount colors
    document.querySelectorAll(".savings-percentage").forEach((el) => {
      const discount = parseFloat(el.textContent.match(/(\d+\.?\d*)/)[1]);
      if (discount >= 30) {
        el.setAttribute("data-discount", "high");
      } else if (discount >= 20) {
        el.setAttribute("data-discount", "medium");
      } else {
        el.setAttribute("data-discount", "low");
      }
    });
  };

  // State variables
  let currentPremiumIndex = -1;
  let pageNavigationActive = true;
  let premiumNavigationActive = true;
  let navControls = null;

  function showTooltip(text, duration = 2000) {
    // Create tooltip if it doesn't exist
    let tooltip = document.getElementById("nav-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "nav-tooltip";
      tooltip.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 0.9rem;
                z-index: 1000;
                pointer-events: none;
                transition: opacity 0.3s ease;
                opacity: 0;
            `;
      document.body.appendChild(tooltip);
    }

    // Show tooltip
    tooltip.textContent = text;
    tooltip.style.opacity = "1";
    setTimeout(() => {
      tooltip.style.opacity = "0";
    }, duration);
  }

  function getCurrentPageFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page")) || 1;
    return page;
  }

  function updatePageUrl(newPage) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    newPage = Math.max(1, newPage);
    params.set("page", newPage);
    url.search = params.toString();

    window.history.pushState({}, "", url.toString());
    showTooltip(`Navigating to page ${newPage}`, 1500);

    // Save current filter state before navigation
    saveFilterPreferences();

    setTimeout(() => {
      window.location.href = url.toString();
    }, 1500);
  }

  function isSearchPage() {
    return (
      window.location.pathname === "/s" ||
      window.location.pathname.startsWith("/s/")
    );
  }

  function isInputActive() {
    const activeElement = document.activeElement;
    if (!activeElement) return false;

    // Check if element is an input field or has aria-expanded="true"
    return (
      activeElement.tagName === "INPUT" ||
      activeElement.tagName === "TEXTAREA" ||
      activeElement.getAttribute("role") === "searchbox" ||
      activeElement.getAttribute("aria-expanded") === "true" ||
      activeElement.contentEditable === "true"
    );
  }

  // Modify the createNavigationControls function
  function createNavigationControls() {
    if (!navControls) {
      navControls = document.createElement("div");
      navControls.id = "nav-controls";

      // Only create page navigation button on search pages
      if (isSearchPage()) {
        const pageButton = document.createElement("div");
        pageButton.id = "page-nav-button";
        pageButton.className =
          "nav-button" + (pageNavigationActive ? " active" : "");
        pageButton.innerHTML = `<div class="left-content">
                <span class="nav-icon">⌲</span>
                <span>Page Nav</span>
            </div>
            <div class="right-content">
                <div class="nav-arrows">
                    <span class="nav-arrow">←</span>
                    <span class="nav-arrow">→</span>
                </div>
                <span class="nav-shortcut">N</span>
            </div>`;
        pageButton.onclick = togglePageNavigation;
        navControls.appendChild(pageButton);
      }

      const premiumButton = document.createElement("div");
      premiumButton.id = "premium-nav-button";
      premiumButton.className =
        "nav-button" + (premiumNavigationActive ? " active" : "");
      premiumButton.innerHTML = `Premium Deals <div class="right-content">
              <div class="nav-arrows">
                  <span class="nav-arrow">↑</span>
                  <span class="nav-arrow">↓</span>
              </div>
              <span class="nav-shortcut">D</span>
          </div>`;
      premiumButton.onclick = togglePremiumNavigation;
      navControls.appendChild(premiumButton);

      // Find Amazon's left sidebar and insert nav controls before filter panel
      const amazonSidebar = document.querySelector("#s-refinements");
      if (amazonSidebar) {
        const filterPanel = document.getElementById("search-filter-panel");
        if (filterPanel) {
          amazonSidebar.insertBefore(navControls, filterPanel);
        } else {
          amazonSidebar.insertBefore(navControls, amazonSidebar.firstChild);
        }
      } else {
        // Fallback to body if sidebar not found
        document.body.appendChild(navControls);
      }
    }
    updateNavigationControls();
  }

  function updateNavigationControls() {
    if (navControls) {
      const pageButton = document.getElementById("page-nav-button");
      const premiumButton = document.getElementById("premium-nav-button");

      if (pageButton)
        pageButton.className =
          "nav-button" + (pageNavigationActive ? " active" : "");
      if (premiumButton)
        premiumButton.className =
          "nav-button" + (premiumNavigationActive ? " active" : "");
    }
  }

  function checkForNewSearchAndReset() {
    const currentSearchTerm =
      new URLSearchParams(window.location.search).get("k") || "";
    const lastSearchTerm = GM_getValue("lastSearchTerm", "");

    if (currentSearchTerm && currentSearchTerm !== lastSearchTerm) {
      // Detected brand-new search → reset filters & panel
      console.log("New search detected. Resetting filters.");
      GM_setValue("filterPreferences", "{}");
      GM_setValue("filterPanelVisible", false);
    }

    GM_setValue("lastSearchTerm", currentSearchTerm);
  }

  function getPremiumDeals() {
    return Array.from(document.querySelectorAll(".premium-item"));
  }

  function selectPremiumDeal(index) {
    const premiumDeals = getPremiumDeals();
    if (!premiumDeals.length) {
      showTooltip("No premium deals found");
      return;
    }

    document
      .querySelectorAll(".selected-premium-deal")
      .forEach((el) => el.classList.remove("selected-premium-deal"));

    currentPremiumIndex =
      ((index % premiumDeals.length) + premiumDeals.length) %
      premiumDeals.length;
    const selectedDeal = premiumDeals[currentPremiumIndex];
    selectedDeal.classList.add("selected-premium-deal");

    const offset = window.innerHeight / 3;
    const elementTop =
      selectedDeal.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementTop - offset,
      behavior: "smooth",
    });

    showTooltip(`Deal ${currentPremiumIndex + 1} of ${premiumDeals.length}`);
  }

  function togglePageNavigation() {
    pageNavigationActive = !pageNavigationActive;
    updateNavigationControls();
    showTooltip(
      pageNavigationActive
        ? "Page navigation ON - Use ← → arrows"
        : "Page navigation OFF"
    );
  }

  function togglePremiumNavigation() {
    premiumNavigationActive = !premiumNavigationActive;
    updateNavigationControls();

    if (premiumNavigationActive) {
      const deals = getPremiumDeals();
      if (deals.length > 0) {
        selectPremiumDeal(0);
        showTooltip("Deals navigation ON - Use ↑ ↓ arrows");
      } else {
        premiumNavigationActive = false;
        updateNavigationControls();
        showTooltip("No premium deals found on this page");
      }
    } else {
      document
        .querySelectorAll(".selected-premium-deal")
        .forEach((el) => el.classList.remove("selected-premium-deal"));
      currentPremiumIndex = -1;
      showTooltip("Deals navigation OFF");
    }
  }

  // Modify the handleKeyboardNavigation function
  function handleKeyboardNavigation(e) {
    if (e.type !== "keydown") return;

    // Don't handle single-key shortcuts if an input field is active
    if (isInputActive() && !e.altKey) {
      return;
    }

    // Toggle navigation modes
    if (e.key.toLowerCase() === "n" && isSearchPage()) {
      e.preventDefault();
      togglePageNavigation();
      return;
    }
    if (e.key.toLowerCase() === "d") {
      e.preventDefault();
      togglePremiumNavigation();
      return;
    }

    if (e.key.toLowerCase() === "f" && !isInputActive()) {
      e.preventDefault();
      toggleFilterPanel();
      return;
    }
    if (e.key.toLowerCase() === "t" && !isInputActive()) {
      e.preventDefault();
      resetFilters();
      return;
    }

    // Handle page navigation only on search pages
    if (pageNavigationActive && isSearchPage()) {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          const prevPage = getCurrentPageFromUrl() - 1;
          if (prevPage >= 1) {
            updatePageUrl(prevPage);
          } else {
            showTooltip("Already on first page");
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          const nextPage = getCurrentPageFromUrl() + 1;
          updatePageUrl(nextPage);
          break;
      }
    }

    // Handle premium deals navigation
    if (premiumNavigationActive) {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          selectPremiumDeal(currentPremiumIndex - 1);
          break;
        case "ArrowDown":
          e.preventDefault();
          selectPremiumDeal(currentPremiumIndex + 1);
          break;
      }
    }

    // Global Escape handler
    if (e.key === "Escape") {
      e.preventDefault();
      if (premiumNavigationActive) togglePremiumNavigation();
      if (pageNavigationActive) togglePageNavigation();
    }
  }

  function processItems() {
    const containers = document.querySelectorAll('[data-csa-c-type="item"]');
    let premiumDealsFound = 0;
    let processedItems = new Set(); // Track processed items to avoid double counting

    containers.forEach((container) => {
      // Skip items that are hidden
      if (container.closest(".hidden-result")) {
        return;
      }
      // Skip if this container is inside an already processed premium item
      if (
        container.closest(".premium-item") &&
        container !== container.closest(".premium-item")
      ) {
        return;
      }

      // Process ratings
      const ratingElement = container.querySelector(".a-icon-alt");
      let rating = null;
      if (ratingElement) {
        const ratingMatch = ratingElement.textContent.match(/(\d+\.?\d*)/);
        if (ratingMatch) {
          rating = parseFloat(ratingMatch[1]);
          if (rating >= 4.8) {
            ratingElement.classList.add("rating-high");
          } else if (rating >= 4.5) {
            ratingElement.classList.add("rating-medium");
          } else if (rating >= 4.2) {
            ratingElement.classList.add("rating-good");
          }
        }
      }

      // Process prices
      const currentPriceElement = container.querySelector(
        'span.a-price[data-a-color="base"]'
      );
      const originalPriceElement = container.querySelector(
        'span.a-price.a-text-price[data-a-strike="true"]'
      );

      const currentPrice = currentPriceElement
        ? parseFloat(
            currentPriceElement
              .querySelector(".a-offscreen")
              .textContent.replace(/[$,]/g, "")
          )
        : null;
      const originalPrice = originalPriceElement
        ? parseFloat(
            originalPriceElement
              .querySelector(".a-offscreen")
              .textContent.replace(/[$,]/g, "")
          )
        : null;

      // Calculate savings
      const savingsPercentage =
        originalPrice && currentPrice
          ? ((originalPrice - currentPrice) / originalPrice) * 100
          : null;

      // Add savings label
      if (savingsPercentage && savingsPercentage > 0) {
        const priceContainer = currentPriceElement.closest(".a-row");
        if (
          priceContainer &&
          !priceContainer.querySelector(".savings-percentage")
        ) {
          const savingsElement = document.createElement("div");
          savingsElement.className = "savings-percentage";
          savingsElement.style.cssText = `
                        color: ${
                          savingsPercentage >= 30
                            ? "#2e03d5"
                            : savingsPercentage >= 20
                            ? "#d3e8d4"
                            : savingsPercentage >= 10
                            ? "#fff7d5"
                            : "#000000"
                        } !important;
                        background-color: ${
                          savingsPercentage >= 30
                            ? "#c4e9ff"
                            : savingsPercentage >= 20
                            ? "#058b73"
                            : savingsPercentage >= 10
                            ? "#f3b357"
                            : "#ffffff"
                        } !important;
                        font-size: .8rem !important;
                        line-height: .8rem !important;
                        font-weight: bold !important;
                        margin-bottom: 10px !important;
                        margin-top: 0px !important;
                        padding: 2px 6px 5px !important;
                        width: fit-content !important;
                        border-radius: 5px !important;
                    `;
          savingsElement.textContent = `Discount: ${savingsPercentage.toFixed(
            2
          )}%`;
          priceContainer.appendChild(savingsElement);
        }
      }

      // Add premium badge for high rated items with big discounts
      if (rating >= 4.7 && savingsPercentage >= 25) {
        // Only count if we haven't processed this item yet
        if (!processedItems.has(container)) {
          premiumDealsFound++;
          processedItems.add(container);
        }

        if (!container.classList.contains("premium-item")) {
          container.classList.add("premium-item");

          if (!container.querySelector(".premium-deal-badge")) {
            const badge = document.createElement("div");
            badge.className = "premium-deal-badge";
            badge.textContent = "★ Premium Deal";

            const imageContainer =
              container.querySelector(".s-product-image-container") ||
              container.querySelector(".a-section") ||
              container;
            imageContainer.appendChild(badge);
          }
        }
      }
    });

    // Alternative counting method to verify
    const uniquePremiumDeals = new Set(
      document.querySelectorAll(".premium-item")
    ).size;
    console.log(
      `Premium deals found: ${premiumDealsFound}, Unique premium items: ${uniquePremiumDeals}`
    );

    // Update UI based on whether deals were found
    const premiumButton = document.querySelector("#premium-nav-button");
    if (premiumButton) {
      if (premiumDealsFound === 0) {
        premiumButton.style.opacity = "0.5";
        premiumButton.title = "No premium deals on this page";
        premiumButton.querySelector(".nav-shortcut").style.display = "none";
        premiumButton.innerHTML = `★ No Deals Found`;

        // If deals navigation was active, disable it
        if (premiumNavigationActive) {
          premiumNavigationActive = false;
          updateNavigationControls();
          showTooltip("No premium deals found on this page");
        }
      } else {
        premiumButton.style.opacity = "0.85";
        premiumButton.title = "Navigate premium deals";
        premiumButton.innerHTML = `★ ${premiumDealsFound} Premium Deals <div class="nav-arrows">
                  <span class="nav-arrow">↑</span>
                  <span class="nav-arrow">↓</span>
              </div><span class="nav-shortcut">D</span>`;
      }
    }

    createNavigationControls();
  }

  // Add new filter panel HTML
  // Add filter preferences storage
  function saveFilterPreferences() {
    const preferences = {
      minRating: document.getElementById("min-rating").value,
      minReviews: document.getElementById("min-reviews").value,
      minDiscount:
        document.querySelector(".discount-preset.active")?.dataset.discount ||
        "",
      minPrice: document.getElementById("min-price").value,
      maxPrice: document.getElementById("max-price").value,
      deliveryDays:
        document.querySelector(".delivery-preset.active")?.dataset.delivery ||
        "",
      activeSort:
        document.querySelector(".sort-button.active")?.dataset.sort || null,
    };

    // Only save non-empty values
    Object.keys(preferences).forEach((key) => {
      if (preferences[key] === "" || preferences[key] === null) {
        delete preferences[key];
      }
    });

    GM_setValue("filterPreferences", JSON.stringify(preferences));
    updateFilterIndicator();
  }

  function loadFilterPreferences() {
    const preferences = JSON.parse(GM_getValue("filterPreferences", "{}"));

    // Update input fields
    const inputs = {
      "min-rating": preferences.minRating || "0.0",
      "min-reviews": preferences.minReviews || "",
      "min-price": preferences.minPrice || "",
      "max-price": preferences.maxPrice || "",
    };

    // Set all input values and trigger change events
    Object.entries(inputs).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.value = value;
        // Trigger change event to update any UI elements
        const event = new Event("change", { bubbles: true });
        element.dispatchEvent(event);
      }
    });

    // Restore discount preset if any
    if (preferences.minDiscount) {
      const discountButton = document.querySelector(
        `[data-discount="${preferences.minDiscount}"]`
      );
      if (discountButton) {
        discountButton.classList.add("active");
      }
    }

    // Restore delivery preset if any
    if (preferences.deliveryDays) {
      const deliveryButton = document.querySelector(
        `[data-delivery="${preferences.deliveryDays}"]`
      );
      if (deliveryButton) {
        deliveryButton.classList.add("active");
      }
    }

    // Restore active sort if any
    if (preferences.activeSort) {
      const sortButton = document.querySelector(
        `[data-sort="${preferences.activeSort}"]`
      );
      if (sortButton) {
        document
          .querySelectorAll(".sort-button")
          .forEach((b) => b.classList.remove("active"));
        sortButton.classList.add("active");
        sortResults(preferences.activeSort);
      }
    }

    // Update filter indicator and panel state
    updateFilterIndicator();

    // Update filter panel visibility if it was previously visible
    const panelVisible = GM_getValue("filterPanelVisible", false);
    const panel = document.getElementById("search-filter-panel");
    if (panel && panelVisible) {
      panel.classList.add("active");
    }

    // Update stats display
    const statsElement = document.querySelector(".filter-stats");
    if (statsElement) {
      const activeCount = getActiveFiltersCount();
      if (activeCount > 0) {
        statsElement.style.display = "block";
      }
    }
  }

  // 1) A helper function to force page=1 and reload
  function goToPageOne() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set("page", 1);
    url.search = params.toString();
    // Redirect immediately
    window.location.href = url.toString();
  }

  // Replace the toggle indicator creation in createFilterPanel with a separate function
  function createToggleIndicator() {
    // Remove any existing indicator first
    const existingIndicator = document.getElementById(
      "filter-toggle-indicator"
    );
    if (existingIndicator) {
      existingIndicator.remove();
    }

    const indicator = document.createElement("div");
    indicator.id = "filter-toggle-indicator";

    // Create main text and shortcut
    const toggleText = document.createElement("span");
    toggleText.innerText = "Filters";
    const shortcut = document.createElement("span");
    shortcut.className = "key";
    shortcut.innerText = "F";

    // Create counter badge
    const filterCount = document.createElement("div");
    filterCount.className = "count-badge";
    const activeCount = getActiveFiltersCount();
    filterCount.innerHTML = activeCount;
    filterCount.style.display = activeCount > 0 ? "flex" : "none";

    // Assemble the indicator
    indicator.appendChild(filterCount);
    indicator.appendChild(toggleText);
    indicator.appendChild(shortcut);
    document.body.appendChild(indicator);

    return indicator;
  }

  // Modify the updateFilterIndicator function
  function updateFilterIndicator() {
    let indicator = document.getElementById("filter-toggle-indicator");
    if (!indicator) {
      indicator = createToggleIndicator();
    }

    const activeCount = getActiveFiltersCount();
    const countBadge = indicator.querySelector(".count-badge");

    if (countBadge) {
      countBadge.innerHTML = activeCount;
      countBadge.style.display = activeCount > 0 ? "flex" : "none";
    }

    const toggleText = indicator.querySelector("span:not(.key)");
    if (toggleText) {
      toggleText.innerText = "Filters";
    }
  }

  // Modify createFilterPanel to use the new functions
  function createFilterPanel() {
    const panel = document.createElement("div");
    panel.id = "search-filter-panel";

    // Find Amazon's left sidebar
    const amazonSidebar = document.querySelector("#s-refinements");
    if (!amazonSidebar) {
      console.log("Amazon sidebar not found, falling back to floating panel");
      document.body.appendChild(panel);
      return panel;
    }

    // Insert our panel at the top of Amazon's sidebar
    amazonSidebar.insertBefore(panel, amazonSidebar.firstChild);

    // Rest of the panel HTML remains the same
    panel.innerHTML = `
        <div class="filter-header">
          <div class="filter-header-top">
            <h3>Enhanced Filters</h3>
            <div class="reset-icon" title="Reset filters">
              <svg width="64px" height="64px" viewBox="-0.21 -0.21 21.42 21.42" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" stroke-width="1.8690000000000002"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="none" fill-rule="evenodd" stroke="#0777ff" stroke-linecap="round" stroke-linejoin="round" transform="matrix(0 1 1 0 2.5 2.5)"> <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"></path> <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)"></path> </g> </g></svg>
            </div>
            <span class="shortcut">T</span>
          </div>
          <div class="filter-count-container">
            <div class="filter-count">0</div>
            <div class="filter-stats"></div>
          </div>
        </div>

        <!-- Quick Filter Presets -->
        <div class="filter-section">
          <div id="filter-presets" class="quick-filters">
            <button class="preset-button" data-preset="top-rated">Top Rated</button>
            <button class="preset-button" data-preset="best-deals">Best Deals</button>
          </div>
        </div>

                <div class="filter-section">
          <label>Delivery Within</label>
          <div id="delivery-presets" class="preset-buttons-container">
            <button class="preset-button delivery-preset" data-delivery="today">Today</button>
            <button class="preset-button delivery-preset" data-delivery="tomorrow">Tomorrow</button>
            <button class="preset-button delivery-preset" data-delivery="2">2 Days</button>
            <button class="preset-button delivery-preset" data-delivery="5">5 Days</button>
          </div>
        </div>

        <div class="filter-section">
          <div class="rating-header">
            <label>Minimum Rating</label>
            <span class="rating-value"></span>
          </div>
          <div class="rating-slider-container">
            <input type="range"
                  id="min-rating"
                  class="rating-slider filter-input"
                  min="0"
                  max="10"
                  value="0"
                  step="1">
            <div class="rating-labels">
              <span>Any</span>
              <span>5.0 ★</span>
            </div>
          </div>
        </div>

        <div class="filter-section">
          <label>Minimum Reviews</label>
          <select id="min-reviews" class="filter-input">
            <option value="">Any</option>
            <option value="50">50+ Reviews</option>
            <option value="100">100+ Reviews</option>
            <option value="250">250+ Reviews</option>
            <option value="500">500+ Reviews</option>
            <option value="1000">1,000+ Reviews</option>
            <option value="2000">2,000+ Reviews</option>
          </select>
        </div>

        <div class="filter-section">
          <label>Minimum Discount</label>
          <div id="discount-presets" class="preset-buttons-container">
            <button class="preset-button discount-preset" data-discount="10">10%</button>
            <button class="preset-button discount-preset" data-discount="20">20%</button>
            <button class="preset-button discount-preset" data-discount="30">30%</button>
            <button class="preset-button discount-preset" data-discount="50">50%</button>
          </div>
        </div>



        <div class="filter-section price-range-section">
          <label>Price Range ($)</label>
          <div class="price-range-container">
            <div class="price-input-wrapper">
              <input type="number"
                    id="min-price"
                    class="price-input"
                    placeholder="Min"
                    min="0"
                    aria-label="Minimum price">
            </div>
            <div class="price-input-wrapper">
              <input type="number"
                    id="max-price"
                    class="price-input"
                    placeholder="Max"
                    min="0"
                    aria-label="Maximum price">
            </div>
          </div>
        </div>

        <button id="apply-filters" class="filter-button">Apply Filters</button>
        <button id="reset-filters" class="reset-filters-button">Reset Filters</button>
    `;

    // Initialize event handlers
    initializeEventHandlers(panel);

    return panel;
  }

  function initializeEventHandlers(panel) {
    // Initialize rating slider
    const ratingSlider = panel.querySelector("#min-rating");
    const ratingValue = panel.querySelector(".rating-value");

    // Add reviews dropdown handler
    const reviewsDropdown = document.getElementById("min-reviews");
    if (reviewsDropdown) {
      reviewsDropdown.addEventListener("change", (e) => {
        // Apply filters immediately
        applySearchFilters();
        saveFilterPreferences();
        updateActiveSections();
        updateFilterHeader();

        // Show tooltip
        const value = e.target.value;
        showTooltip(
          value ? `Minimum ${value} reviews applied` : "Review filter removed"
        );
      });
    }

    function updateRatingValue(value) {
      const numericValue = parseInt(value);

      // Update the slider's background gradient
      const progress = numericValue === 0 ? 0 : (numericValue / 10) * 100;
      ratingSlider.style.setProperty("--slider-progress", `${progress}%`);

      // Update the display value
      if (numericValue === 0) {
        ratingValue.textContent = "";
        return 0;
      } else {
        const actualRating = 4 + (numericValue - 1) / 10;
        ratingValue.textContent = `${actualRating.toFixed(1)} ★`;
        return actualRating;
      }
    }

    ratingSlider.addEventListener("input", (e) => {
      updateRatingValue(e.target.value);
    });

    ratingSlider.addEventListener("change", () => {
      const numericValue = updateRatingValue(ratingSlider.value);
      // Apply filters
      applySearchFilters();
      // Save preferences
      saveFilterPreferences();
    });

    ratingSlider.addEventListener("mouseenter", () => {
      ratingValue.classList.add("active");
    });

    ratingSlider.addEventListener("mouseleave", () => {
      if (!ratingSlider.matches(":active")) {
        ratingValue.classList.remove("active");
      }
    });

    // Handle preset button clicks
    panel
      .querySelectorAll("#filter-presets .preset-button")
      .forEach((button) => {
        button.addEventListener("click", () => {
          try {
            const presetType = button.dataset.preset;
            let filterSettings = {};

            // Remove active class from all preset buttons
            panel
              .querySelectorAll("#filter-presets .preset-button")
              .forEach((btn) => {
                if (btn !== button) {
                  btn.classList.remove("active");
                }
              });

            // Toggle active state for clicked button
            button.classList.toggle("active");

            // Only apply filters if button is now active
            if (button.classList.contains("active")) {
              switch (presetType) {
                case "top-rated":
                  filterSettings = {
                    minRating: "7", // 4.7 stars
                    minReviews: "50",
                  };
                  // Clear any active discount
                  document
                    .querySelectorAll(".discount-preset")
                    .forEach((btn) => btn.classList.remove("active"));
                  break;
                case "best-deals":
                  filterSettings = {
                    minRating: "2", // 4.2 stars
                    minDiscount: "30",
                    minReviews: "50",
                  };
                  break;
              }

              // Update form values and trigger necessary events
              if (filterSettings.delivery) {
                const deliveryInput =
                  document.getElementById("delivery-presets");
                deliveryInput.value = filterSettings.delivery;
                deliveryInput.dispatchEvent(new Event("change"));
              }
              if (filterSettings.minRating) {
                const ratingInput = document.getElementById("min-rating");
                ratingInput.value = filterSettings.minRating;
                ratingInput.dispatchEvent(new Event("input"));
                ratingInput.dispatchEvent(new Event("change"));
              }
              if (filterSettings.minReviews) {
                const reviewsInput = document.getElementById("min-reviews");
                reviewsInput.value = filterSettings.minReviews;
                reviewsInput.dispatchEvent(new Event("change"));
              }
              if (filterSettings.minDiscount) {
                // Find and activate the closest discount preset button
                const discountValue = parseInt(filterSettings.minDiscount);
                const discountButtons =
                  document.querySelectorAll(".discount-preset");
                let closestButton = null;
                let minDiff = Infinity;

                discountButtons.forEach((btn) => {
                  const btnValue = parseInt(btn.dataset.discount);
                  const diff = Math.abs(btnValue - discountValue);
                  if (diff < minDiff) {
                    minDiff = diff;
                    closestButton = btn;
                  }
                });

                if (closestButton) {
                  document
                    .querySelectorAll(".discount-preset")
                    .forEach((btn) => btn.classList.remove("active"));
                  closestButton.classList.add("active");
                }
              }
            } else {
              // Reset the specific fields related to this preset
              switch (presetType) {
                case "deliver-today":
                case "deliver-tomorrow":
                  const deliveryInput =
                    document.getElementById("delivery-presets");
                  deliveryInput.value = "";
                  deliveryInput.dispatchEvent(new Event("change"));
                  break;
                case "top-rated":
                  const ratingInput = document.getElementById("min-rating");
                  ratingInput.value = "0";
                  ratingInput.dispatchEvent(new Event("input"));
                  ratingInput.dispatchEvent(new Event("change"));

                  const reviewsInput = document.getElementById("min-reviews");
                  reviewsInput.value = "";
                  reviewsInput.dispatchEvent(new Event("change"));
                  break;
                case "best-deals":
                  const ratingInput2 = document.getElementById("min-rating");
                  ratingInput2.value = "0";
                  ratingInput2.dispatchEvent(new Event("input"));
                  ratingInput2.dispatchEvent(new Event("change"));

                  const reviewsInput2 = document.getElementById("min-reviews");
                  reviewsInput2.value = "";
                  reviewsInput2.dispatchEvent(new Event("change"));

                  // Clear discount preset buttons
                  document
                    .querySelectorAll(".discount-preset")
                    .forEach((btn) => btn.classList.remove("active"));
                  break;
              }
            }

            // Apply filters
            applySearchFilters();

            // Save preferences
            saveFilterPreferences();

            // Update active sections and header
            updateActiveSections();
            updateFilterHeader();

            // Show confirmation
            showTooltip(
              button.classList.contains("active")
                ? `${button.textContent} filter applied`
                : `${button.textContent} filter removed`
            );
          } catch (error) {
            console.error("Error applying preset filters:", error);
            showTooltip("Error applying filters");
          }
        });
      });

    // Add discount preset button handlers
    panel.querySelectorAll(".discount-preset").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        // Toggle active state
        const wasActive = button.classList.contains("active");
        panel.querySelectorAll(".discount-preset").forEach((btn) => {
          btn.classList.remove("active");
        });
        if (!wasActive) {
          button.classList.add("active");
        }

        // Apply filters immediately
        applySearchFilters();
        saveFilterPreferences();
        updateActiveSections();
        updateFilterHeader();

        // Show tooltip
        const discount = button.dataset.discount;
        showTooltip(
          wasActive
            ? "Discount filter removed"
            : `Minimum ${discount}% discount applied`
        );
      });
    });

    // Add delivery preset button handlers
    panel.querySelectorAll(".delivery-preset").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        // Toggle active state
        const wasActive = button.classList.contains("active");
        panel.querySelectorAll(".delivery-preset").forEach((btn) => {
          btn.classList.remove("active");
        });
        if (!wasActive) {
          button.classList.add("active");
        }

        // Apply filters immediately
        applySearchFilters();
        saveFilterPreferences();
        updateActiveSections();
        updateFilterHeader();

        // Show tooltip
        const delivery = button.dataset.delivery;
        const deliveryText =
          delivery === "today"
            ? "today"
            : delivery === "tomorrow"
            ? "tomorrow"
            : `within ${delivery} days`;
        showTooltip(
          wasActive ? "Delivery filter removed" : `Delivery ${deliveryText}`
        );
      });
    });

    // Add keyboard event listener to the entire panel
    panel.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === "Return") {
        e.preventDefault();
        document.getElementById("apply-filters").click();
      }
    });

    // Add keyboard event listeners to each input field
    const inputs = [
      "min-reviews",
      "min-price",
      "max-price",
      "delivery-presets",
    ];

    inputs.forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === "Return") {
            e.preventDefault();
            document.getElementById("apply-filters").click();
          }
        });
      }
    });

    // Add filter count listeners
    addFilterCountListeners();

    // Add apply filters button handler
    panel.querySelector("#apply-filters").addEventListener("click", () => {
      try {
        // Apply UI filters
        applySearchFilters();

        // Save preferences
        saveFilterPreferences();

        // Show confirmation
        showTooltip("Filters applied");
      } catch (error) {
        console.error("Error applying filters:", error);
        showTooltip("Error applying filters");
      }
    });

    // Add reset button handler
    panel
      .querySelector("#reset-filters")
      .addEventListener("click", resetFilters);

    // Initial header update
    updateFilterHeader();
  }

  function getActiveFiltersCount() {
    let activeCount = 0;

    // Check rating
    const ratingValue = parseInt(document.getElementById("min-rating").value);
    if (ratingValue > 0) activeCount++;

    // Check reviews
    const minReviews = document.getElementById("min-reviews").value;
    if (minReviews && parseInt(minReviews) > 0) activeCount++;

    // Check discount
    const minDiscount = document.querySelector(".discount-preset.active")
      ?.dataset.discount;
    if (minDiscount && parseInt(minDiscount) > 0) activeCount++;

    // Check price range
    const minPrice = document.getElementById("min-price").value;
    if (minPrice && parseInt(minPrice) > 0) activeCount++;

    const maxPrice = document.getElementById("max-price").value;
    if (maxPrice && parseInt(maxPrice) > 0) activeCount++;

    // Check delivery
    const deliveryDays = document.querySelector(".delivery-preset.active")
      ?.dataset.delivery;
    if (deliveryDays && deliveryDays !== "") activeCount++;

    // Check preset buttons
    document.querySelectorAll(".preset-button.active").forEach(() => {
      activeCount++;
    });

    return activeCount;
  }

  function updateActiveFiltersCount() {
    const activeCount = getActiveFiltersCount();
    const countBadge = document.querySelector(".count-badge");

    if (countBadge) {
      countBadge.innerHTML = activeCount;
      countBadge.style.display = activeCount > 0 ? "flex" : "none";
    }
  }

  function resetFilters() {
    // Reset form values
    const minRatingSlider = document.getElementById("min-rating");
    minRatingSlider.value = "0";
    minRatingSlider.dispatchEvent(new Event("input"));
    minRatingSlider.dispatchEvent(new Event("change"));

    // Reset reviews dropdown
    document.getElementById("min-reviews").value = "";

    // Reset price fields
    document.getElementById("min-price").value = "";
    document.getElementById("max-price").value = "";

    // Reset discount buttons
    document.querySelectorAll(".discount-preset").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Reset delivery buttons
    document.querySelectorAll(".delivery-preset").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Reset preset buttons in filter-presets
    document
      .querySelectorAll("#filter-presets .preset-button")
      .forEach((btn) => {
        btn.classList.remove("active");
      });

    // Clear stored preferences
    GM_setValue("filterPreferences", "{}");

    // Update UI
    updateFilterIndicator();
    applySearchFilters();
    showTooltip("Filters reset");

    // Clear URL parameters while preserving search query
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams();

    // Preserve only essential search parameters
    const searchQuery = url.searchParams.get("k");
    if (searchQuery) {
      searchParams.set("k", searchQuery);
    }

    // Remove all filter-related parameters
    url.searchParams.delete("rh");
    url.searchParams.delete("ref");
    url.searchParams.delete("low-price");
    url.searchParams.delete("high-price");
    url.searchParams.delete("page");

    // Update URL without reload
    if (window.history && window.history.pushState) {
      url.search = searchParams.toString();
      window.history.pushState({}, "", url.toString());
    }

    // Make sure indicator shows no active filters
    const indicator = document.getElementById("filter-toggle-indicator");
    if (indicator) {
      indicator.innerHTML = `Toggle Filters <span class="key">F</span>`;
    }

    // Go back to page one
    goToPageOne();

    // Update header after reset
    updateFilterHeader();

    // Reset active section highlighting
    document.querySelectorAll(".filter-section").forEach((section) => {
      section.classList.remove("active");
    });
  }

  function sortResults(sortType) {
    const products = Array.from(document.querySelectorAll(".filter-match"));

    products.sort((a, b) => {
      switch (sortType) {
        case "price-asc":
          return getPrice(a) - getPrice(b);
        case "price-desc":
          return getPrice(b) - getPrice(a);
        case "rating-desc":
          return getRating(b) - getRating(a);
        case "reviews-desc":
          return getReviewCount(b) - getReviewCount(a);
        case "discount-desc":
          return getDiscount(b) - getDiscount(a);
      }
    });

    // Reorder elements
    const container = products[0].parentElement;
    products.forEach((product) => {
      container.appendChild(product);
    });

    showTooltip(`Sorted by ${sortType.replace("-", " ")}`);
  }

  function exportResults() {
    const matches = document.querySelectorAll(".filter-match");
    const data = Array.from(matches).map((product) => ({
      title: product.querySelector("h2")?.textContent.trim(),
      price: getPrice(product),
      rating: getRating(product),
      reviews: getReviewCount(product),
      discount: getDiscount(product),
      url: product.querySelector("a")?.href,
    }));

    // Create CSV
    const csv = [
      ["Title", "Price", "Rating", "Reviews", "Discount %", "URL"].join(","),
      ...data.map((item) =>
        [
          `"${item.title}"`,
          item.price,
          item.rating,
          item.reviews,
          item.discount,
          item.url,
        ].join(",")
      ),
    ].join("\n");

    // Download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "amazon-filtered-results.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    showTooltip("Results exported to CSV");
  }

  // Helper functions for getting values
  function getPrice(element) {
    const priceEl = element.querySelector(".a-price .a-offscreen");
    return priceEl ? parseFloat(priceEl.textContent.replace(/[$,]/g, "")) : 0;
  }

  function getRating(element) {
    const ratingEl = element.querySelector(".a-icon-alt");
    return ratingEl
      ? parseFloat(ratingEl.textContent.match(/(\d+\.?\d*)/)[1])
      : 0;
  }

  function getReviewCount(productElement) {
    // Looks for <a aria-label="XYZ ratings">
    const ratingLink = productElement.querySelector(
      'a[aria-label$=" ratings"]'
    );
    if (!ratingLink) return 0;

    // Example aria-label: "23 ratings"
    const match = ratingLink
      .getAttribute("aria-label")
      .match(/(\d+)\s+ratings/);
    if (match) {
      return parseInt(match[1], 10);
    }
    return 0;
  }

  function getDiscount(element) {
    const discountEl = element.querySelector(".savings-percentage");
    return discountEl
      ? parseFloat(discountEl.textContent.match(/(\d+\.?\d*)/)[1])
      : 0;
  }

  // Update the getDeliveryDays function
  function getDeliveryDays(element) {
    // Look for delivery date text in various formats
    const deliveryEl = element.querySelector(
      '[data-csa-c-type="message"], .a-text-bold, .a-color-base.a-text-bold, [data-csa-c-delivery-time], .a-text-bold span'
    );

    if (!deliveryEl) {
      console.log("No delivery element found");
      return null;
    }

    const deliveryText = deliveryEl.textContent.trim().toLowerCase();
    console.log("Found delivery text:", deliveryText);

    // Handle various immediate delivery phrases
    if (
      deliveryText.includes("today") ||
      deliveryText.includes("get it today") ||
      deliveryText.includes("same-day") ||
      deliveryText.includes("prime free same-day")
    ) {
      console.log("Matched today delivery");
      return 0;
    }

    // Handle various next-day delivery phrases
    if (
      deliveryText.includes("tomorrow") ||
      deliveryText.includes("next day") ||
      deliveryText.includes("get it tomorrow") ||
      deliveryText.includes("overnight") ||
      deliveryText.includes("one-day") ||
      deliveryText.includes("1-day")
    ) {
      console.log("Matched tomorrow/overnight delivery");
      return 1;
    }

    // Handle "Get it by" or "Delivery" format with date
    const dateMatch = deliveryText.match(
      /(mon|tue|wed|thu|fri|sat|sun),?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})/i
    );

    if (!dateMatch) {
      // Try to find just the number of days
      const daysMatch = deliveryText.match(/in\s+(\d+)\s+days?|(\d+)\s+days?/i);
      if (daysMatch) {
        const days = parseInt(daysMatch[1] || daysMatch[2]);
        console.log("Matched days pattern:", days);
        return days;
      }
      console.log("No date pattern matched");
      return null;
    }

    const months = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };

    try {
      const deliveryDate = new Date();
      deliveryDate.setMonth(months[dateMatch[2].toLowerCase()]);
      deliveryDate.setDate(parseInt(dateMatch[3]));

      // If delivery date appears to be in the past, it's for next year
      if (deliveryDate < new Date()) {
        deliveryDate.setFullYear(deliveryDate.getFullYear() + 1);
      }

      // Calculate days until delivery
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = deliveryDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    } catch (e) {
      console.error("Error calculating delivery days:", e);
      return null;
    }
  }

  function reprocessPremiumItems() {
    // 1) Remove existing premium classes and badges
    document.querySelectorAll(".premium-item").forEach((el) => {
      el.classList.remove("premium-item", "selected-premium-deal");
      const badge = el.querySelector(".premium-deal-badge");
      if (badge) badge.remove();
    });

    // 2) Reset any selected premium index
    currentPremiumIndex = -1;

    // 3) Re-run the premium logic
    processItems();
  }

  // Update the applySearchFilters function's delivery filtering section
  function applySearchFilters() {
    const ratingValue = parseInt(document.getElementById("min-rating").value);
    const actualRating = ratingValue === 0 ? 0 : 4 + (ratingValue - 1) / 10;
    const minReviews =
      parseInt(document.getElementById("min-reviews").value) || 0;
    const minDiscount =
      parseFloat(
        document.querySelector(".discount-preset.active")?.dataset.discount
      ) || 0;
    const minPrice =
      parseFloat(document.getElementById("min-price").value) || 0;
    const maxPrice =
      parseFloat(document.getElementById("max-price").value) || Infinity;
    const deliveryFilter =
      document.querySelector(".delivery-preset.active")?.dataset.delivery || "";

    // Reset previous filtering
    document.querySelectorAll(".filter-match").forEach((el) => {
      el.classList.remove("filter-match");
    });
    document.querySelectorAll(".hidden-result").forEach((el) => {
      el.classList.remove("hidden-result");
    });

    let matchCount = 0;
    let totalCount = 0;

    // Process all product containers
    const products = document.querySelectorAll(
      '[data-component-type="s-search-result"]'
    );
    products.forEach((product) => {
      totalCount++;
      let showProduct = true;

      // Check rating
      const ratingElement = product.querySelector(".a-icon-alt");
      if (ratingElement) {
        const rating = parseFloat(
          ratingElement.textContent.match(/(\d+\.?\d*)/)[1]
        );
        if (actualRating > 0 && rating < actualRating) {
          showProduct = false;
        }
      } else if (actualRating > 0) {
        showProduct = false;
      }

      // Check review count
      const reviewCount = getReviewCount(product);
      if (showProduct && reviewCount < minReviews) {
        showProduct = false;
      }

      // Check discount percentage
      const savingsElement = product.querySelector(".savings-percentage");
      if (savingsElement && showProduct) {
        const discount = parseFloat(
          savingsElement.textContent.match(/(\d+\.?\d*)/)[1]
        );
        if (discount < minDiscount) {
          showProduct = false;
        }
      } else if (minDiscount > 0) {
        showProduct = false;
      }

      // Check price
      const price = getPrice(product);
      if (price < minPrice || (maxPrice !== Infinity && price > maxPrice)) {
        showProduct = false;
      }

      // Check delivery
      if (deliveryFilter && showProduct) {
        console.log("Checking delivery filter:", deliveryFilter);
        const deliveryDays = getDeliveryDays(product);
        console.log("Got delivery days:", deliveryDays);

        if (deliveryDays === null) {
          showProduct = false;
          console.log("Filtered out: No delivery info found");
        } else {
          // Convert string filters to numeric values for comparison
          let maxAllowedDays;
          switch (deliveryFilter) {
            case "today":
              maxAllowedDays = 0;
              break;
            case "tomorrow":
            case "overnight":
              maxAllowedDays = 1;
              break;
            default:
              maxAllowedDays = parseInt(deliveryFilter);
          }

          // If we have a valid number of days, filter items that take longer
          // Items that can be delivered sooner are always included
          if (!isNaN(maxAllowedDays) && deliveryDays > maxAllowedDays) {
            showProduct = false;
            console.log(
              `Filtered out: ${deliveryDays} days > maximum ${maxAllowedDays} days`
            );
          } else {
            console.log(
              `Keeping item with delivery in ${deliveryDays} days (within ${maxAllowedDays} days limit)`
            );
          }
        }
      }

      // Apply visibility
      if (showProduct) {
        product.classList.remove("hidden-result");
        product.classList.add("filter-match");
        matchCount++;
      } else {
        product.classList.add("hidden-result");
        product.classList.remove("filter-match");
      }

      // Also apply to parent containers
      const containers = [
        product.closest('div[role="listitem"]'),
        product.closest(".s-result-item"),
        product.closest(".puis-card-container"),
        product.closest('[data-cy="asin-faceout-container"]'),
      ].filter(Boolean); // Remove null values

      containers.forEach((container) => {
        if (showProduct) {
          container.classList.remove("hidden-result");
          container.classList.add("filter-match");
        } else {
          container.classList.add("hidden-result");
          container.classList.remove("filter-match");
        }
      });
    });

    // Update stats
    const statsElement = document.querySelector(".filter-stats");
    if (statsElement) {
      statsElement.textContent = `Showing ${matchCount} of ${totalCount} items`;
      statsElement.style.display = matchCount < totalCount ? "block" : "none";
    }

    // Update header with active filters count
    updateFilterHeader();

    // Add CSS if not already present
    if (!document.getElementById("filter-styles")) {
      const style = document.createElement("style");
      style.id = "filter-styles";
      style.textContent = `
          .hidden-result {
            display: none !important;
          }
          .filter-match {
            display: block !important;
          }
        `;
      document.head.appendChild(style);
    }

    // Scroll to first match if any found
    // const firstMatch = document.querySelector(".filter-match");
    // if (firstMatch) {
    //   firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    // }

    // Update filter indicator
    updateFilterIndicator();

    // Auto-close the filter panel
    const panel = document.getElementById("search-filter-panel");
    if (panel) {
      panel.classList.remove("active");
      // Update the stored panel state
      GM_setValue("filterPanelVisible", false);
    }

    // Save the current filter preferences
    saveFilterPreferences();
  }

  function toggleFilterPanel() {
    const panel = document.getElementById("search-filter-panel");
    if (panel) {
      panel.classList.toggle("active");

      // Save panel state
      GM_setValue("filterPanelVisible", panel.classList.contains("active"));
    }
  }

  // Modify the initialize function
  function initialize() {
    console.log("Script initializing...");

    if (!isSearchPage()) {
      pageNavigationActive = false;
      return;
    }

    // Check for new search and handle URL parameters
    checkForNewSearchAndReset();

    // Create filter handler instance
    const filterHandler = new AmazonFilterHandler();

    // Add keyboard navigation
    document.addEventListener("keydown", handleKeyboardNavigation, true);

    // Create and setup filter panel
    createFilterPanel();

    // Process items after small delay
    setTimeout(() => {
      const preferences = JSON.parse(GM_getValue("filterPreferences", "{}"));
      if (Object.keys(preferences).length > 0) {
        loadFilterPreferences();
        setTimeout(() => {
          applySearchFilters();
          processItems();
        }, 100);
      } else {
        processItems();
      }
      console.log("Initial processing complete");
    }, 500);
  }

  // Listen for clicks on Amazon's native pagination buttons (next/prev)
  document.addEventListener("click", (e) => {
    // If the element or its closest parent is an 'a' with class s-pagination-item
    const pageLink = e.target.closest("a.s-pagination-item");
    if (!pageLink) return;

    // We only care about clicks on search pages
    if (!isSearchPage()) return;

    // Intercept the default behavior
    e.preventDefault();

    // 1) Store current filters
    saveFilterPreferences();

    // 2) Redirect to the target page so that on load, filters re-apply
    window.location.href = pageLink.href;
  });

  // Observer for dynamic content
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        setTimeout(processItems, 100);
        break;
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Start initialization
  initialize();

  // Add the reset icon click handler and update the active filters display:
  function updateFilterHeader() {
    const activeCount = getActiveFiltersCount();
    const filterCount = document.querySelector(".filter-count");
    const resetIcon = document.querySelector(".reset-icon");
    const statsElement = document.querySelector(".filter-stats");

    if (filterCount) {
      filterCount.textContent = activeCount;
      filterCount.classList.toggle("active", activeCount > 0);
    }

    if (resetIcon) {
      resetIcon.classList.toggle("active", activeCount > 0);
    }

    // Update stats if they exist
    if (
      statsElement &&
      typeof matchCount !== "undefined" &&
      typeof totalCount !== "undefined"
    ) {
      statsElement.textContent = `Showing ${matchCount} of ${totalCount} items`;
      statsElement.style.display = matchCount < totalCount ? "block" : "none";
    }
  }

  // Add reset icon click handler
  const resetIcon = document.querySelector(".reset-icon");
  if (resetIcon) {
    resetIcon.addEventListener("click", resetFilters);
  }

  // Add event listeners for all filter inputs to update the count
  function addFilterCountListeners() {
    const inputs = [
      "min-rating",
      "min-reviews",
      "min-discount",
      "min-price",
      "max-price",
      "delivery-presets",
    ];

    inputs.forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener("change", () => {
          updateFilterHeader();
          updateActiveSections();
        });
        input.addEventListener("input", () => {
          updateFilterHeader();
          updateActiveSections();
        });
      }
    });
  }

  // Add new function to update section active states:
  function updateActiveSections() {
    // Rating section
    const ratingValue = parseInt(document.getElementById("min-rating").value);
    const actualRating = ratingValue === 0 ? 0 : 4 + (ratingValue - 1) / 10;
    document
      .getElementById("min-rating")
      .closest(".filter-section")
      .classList.toggle("active", actualRating > 0);

    // Reviews section
    const minReviews = document.getElementById("min-reviews").value;
    document
      .getElementById("min-reviews")
      .closest(".filter-section")
      .classList.toggle("active", minReviews && parseInt(minReviews) > 0);

    // Discount section
    const activeDiscount = document.querySelector(".discount-preset.active");
    document
      .querySelector("#discount-presets")
      .closest(".filter-section")
      .classList.toggle("active", activeDiscount !== null);

    // Price range section
    const minPrice = document.getElementById("min-price").value;
    const maxPrice = document.getElementById("max-price").value;
    const priceSection = document
      .getElementById("min-price")
      .closest(".filter-section");
    priceSection.classList.toggle(
      "active",
      (minPrice && parseInt(minPrice) > 0) ||
        (maxPrice && parseInt(maxPrice) > 0)
    );

    // Delivery section
    const activeDelivery = document.querySelector(".delivery-preset.active");
    document
      .querySelector("#delivery-presets")
      .closest(".filter-section")
      .classList.toggle("active", activeDelivery !== null);
  }
})();
