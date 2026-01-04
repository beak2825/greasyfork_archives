// ==UserScript==
// @name         WordGlance - Dictionary & Translation
// @namespace    https://github.com/ShrekBytes
// @version      2.6.0
// @description  Show instant dictionary definitions and translations for selected text with any language support
// @author       ShrekBytes
// @icon         https://github.com/ShrekBytes/WordGlance/raw/main/icon_128.png
// @match        *://*/*
// @noframes
// @run-at       document-end
// @license      GPL-3.0
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @homepage     https://github.com/ShrekBytes/WordGlance
// @support      https://github.com/ShrekBytes/WordGlance/issues
// @downloadURL https://update.greasyfork.org/scripts/546617/WordGlance%20-%20Dictionary%20%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/546617/WordGlance%20-%20Dictionary%20%20Translation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - Easy to modify
    const CONFIG = {
        tooltipZIndex: 999999,
        maxDefinitions: 9, // Maximum number of definitions to show (3 pages × 3 per page)
        maxTranslations: 8, // Maximum number of translations to show (2 pages × 4 per page)
        definitionsPerPage: 3, // Definitions per page for pagination
        translationsPerPage: 4, // Translations per page for pagination (2x2 grid)
        maxSynonyms: 6, // Maximum synonyms per word (used for display)
        maxAntonyms: 6, // Maximum antonyms per word (used for display)
        cacheSize: 100, // Maximum number of cached words
        apiTimeout: 5000, // API request timeout in milliseconds (reduced for faster response)
        debounceDelay: 100, // Debounce delay for selection events (ms)
        resizeDebounceDelay: 150, // Debounce delay for resize events (ms)
        animationDuration: 300 // UI animation duration (ms)
    };

    // Load settings from userscript storage
    let targetLanguage = GM_getValue('wordglance-target-language', 'en');
    let sourceLanguage = GM_getValue('wordglance-source-language', 'auto');
    let isDarkMode = GM_getValue('wordglance-dark-mode', false);

    // Cache system for definitions and translations
    const cache = {
        definitions: new Map(),
        translations: new Map()
    };

    // Load cache from storage
    function loadCache() {
        try {
            const cachedDefinitions = GM_getValue('wordglance-cache-definitions', '{}');
            const cachedTranslations = GM_getValue('wordglance-cache-translations', '{}');
            
            // Validate JSON before parsing
            if (typeof cachedDefinitions !== 'string' || typeof cachedTranslations !== 'string' ||
                cachedDefinitions === '{}' && cachedTranslations === '{}') {
                return; // Skip if both are empty defaults
            }
            
            const defData = JSON.parse(cachedDefinitions);
            const transData = JSON.parse(cachedTranslations);
            
            // Validate parsed data is object
            if (typeof defData !== 'object' || typeof transData !== 'object') {
                console.log('Invalid cache data format, starting fresh');
                return;
            }
            
            // Convert back to Map and maintain order (most recent first)
            Object.entries(defData).forEach(([key, value]) => {
                cache.definitions.set(key, value);
            });
            
            Object.entries(transData).forEach(([key, value]) => {
                cache.translations.set(key, value);
            });
        } catch (e) {
            console.log('Failed to load cache:', e);
            // Clear corrupted cache
            GM_setValue('wordglance-cache-definitions', '{}');
            GM_setValue('wordglance-cache-translations', '{}');
        }
    }

    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Save cache to storage
    function saveCache() {
        try {
            // Convert Maps to objects for storage
            const defObj = Object.fromEntries(cache.definitions);
            const transObj = Object.fromEntries(cache.translations);
            
            GM_setValue('wordglance-cache-definitions', JSON.stringify(defObj));
            GM_setValue('wordglance-cache-translations', JSON.stringify(transObj));
        } catch (e) {
            console.log('Failed to save cache:', e);
        }
    }

    // Add to cache with LRU behavior
    function addToCache(type, word, data) {
        const targetCache = cache[type];
        const cacheKey = type === 'translations' ? `${word}-${sourceLanguage}-${targetLanguage}` : word.toLowerCase();
        
        // Remove if already exists (to update position)
        if (targetCache.has(cacheKey)) {
            targetCache.delete(cacheKey);
        }
        
        // Add to front
        targetCache.set(cacheKey, data);
        
        // Remove oldest if cache exceeds limit
        if (targetCache.size > CONFIG.cacheSize) {
            const firstKey = targetCache.keys().next().value;
            targetCache.delete(firstKey);
        }
        
        // Save cache
        saveCache();
    }

    // Get from cache
    function getFromCache(type, word) {
        const targetCache = cache[type];
        const cacheKey = type === 'translations' ? `${word}-${sourceLanguage}-${targetLanguage}` : word.toLowerCase();
        
        if (targetCache.has(cacheKey)) {
            // Move to front (most recently used)
            const data = targetCache.get(cacheKey);
            targetCache.delete(cacheKey);
            targetCache.set(cacheKey, data);
            return data;
        }
        
        return null;
    }

    // Initialize cache
    loadCache();

    // Standardized error messages system
    const ERROR_MESSAGES = {
        NO_DEFINITION: 'Definition not found',
        NO_TRANSLATION: 'Translation not available',
        NETWORK_ERROR: 'Connection error - please try again',
        API_TIMEOUT: 'Request timed out - please try again',
        PARSE_ERROR: 'Unable to process response',
        INVALID_INPUT: 'Please select a valid word or phrase',
        LANGUAGE_ERROR: 'Language not supported'
    };

    // Helper function to create standardized error display
    function createErrorMessage(errorType, details = '') {
        const baseMessage = ERROR_MESSAGES[errorType] || 'Unknown error';
        return details ? `${baseMessage}: ${details}` : baseMessage;
    }

    // Centralized language definitions to avoid duplication
    const LANGUAGES = {
        'auto': 'Auto-detect', // Only for source language
        'en': 'English', 'bn': 'Bengali', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
        'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese',
        'ko': 'Korean', 'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi',
        'tr': 'Turkish', 'nl': 'Dutch', 'sv': 'Swedish', 'da': 'Danish',
        'no': 'Norwegian', 'fi': 'Finnish', 'pl': 'Polish', 'cs': 'Czech',
        'sk': 'Slovak', 'hu': 'Hungarian', 'ro': 'Romanian', 'bg': 'Bulgarian',
        'hr': 'Croatian', 'sr': 'Serbian', 'sl': 'Slovenian', 'et': 'Estonian',
        'lv': 'Latvian', 'lt': 'Lithuanian', 'uk': 'Ukrainian', 'el': 'Greek',
        'he': 'Hebrew', 'th': 'Thai', 'vi': 'Vietnamese', 'id': 'Indonesian',
        'ms': 'Malay', 'tl': 'Filipino', 'sw': 'Swahili', 'am': 'Amharic', 'zu': 'Zulu'
    };

    // Add custom styles with CSS custom properties for easier theming
    GM_addStyle(`
        :root {
            --wordglance-primary-color: #3498db;
            --wordglance-primary-hover: #2980b9;
            --wordglance-dark-primary: #ff6b6b;
            --wordglance-dark-primary-hover: #ff5252;
            --wordglance-text-color: #2c3e50;
            --wordglance-bg-color: #ffffff;
            --wordglance-border-color: #e0e0e0;
            --wordglance-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            --wordglance-animation-duration: ${CONFIG.animationDuration}ms;
        }
        
        .wordglance-tooltip {
            position: absolute;
            background: var(--wordglance-bg-color);
            border: 1px solid var(--wordglance-border-color);
            border-radius: 8px;
            box-shadow: var(--wordglance-shadow);
            padding: 16px;
            max-width: 320px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            z-index: ${CONFIG.tooltipZIndex};
            display: none;
            pointer-events: auto;
            transition: opacity var(--wordglance-animation-duration) ease, transform var(--wordglance-animation-duration) ease;
            word-wrap: break-word;
            overflow-wrap: break-word;
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
            will-change: transform, opacity; /* Optimize for animations */
            contain: layout style paint; /* CSS containment for better performance */
        }
        
        .wordglance-tooltip.show {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        
        .wordglance-tooltip.dark-mode {
            background: #1a1a1a;
            border-color: #333333;
            color: #e0e0e0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        
        .wordglance-trigger-icon {
            position: absolute;
            background: var(--wordglance-primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 12px;
            cursor: pointer;
            z-index: ${CONFIG.tooltipZIndex - 1};
            display: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.25s ease, background-color 0.25s ease;
            font-weight: bold;
            opacity: 0;
            transform: scale(0.8);
            will-change: transform, opacity; /* Optimize for animations */
        }
        
        /* Larger button for mobile devices */
        @media (hover: none) and (pointer: coarse) {
            .wordglance-trigger-icon {
                width: 32px;
                height: 32px;
                font-size: 16px;
                box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
            }
        }
        
        .wordglance-trigger-icon.show {
            opacity: 1;
            transform: scale(1);
        }
        
        .wordglance-trigger-icon:hover {
            background: var(--wordglance-primary-hover);
            transform: scale(1.1);
        }
        
        .wordglance-trigger-icon.dark-mode {
            background: var(--wordglance-dark-primary);
        }
        
        .wordglance-trigger-icon.dark-mode:hover {
            background: var(--wordglance-dark-primary-hover);
        }
        
        .wordglance-tooltip .definition-section {
            margin-bottom: 16px;
        }
        
        .wordglance-tooltip .translation-section {
            margin-bottom: 0;
        }
        
        .wordglance-tooltip .section-title {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .wordglance-tooltip.dark-mode .section-title {
            color: #cccccc;
        }
        
        .wordglance-tooltip .slider-controls {
            display: flex;
            gap: 4px;
            align-items: center;
        }
        
        .wordglance-tooltip .slider-button {
            background: none;
            border: none;
            border-radius: 3px;
            width: 20px;
            height: 20px;
            font-size: 12px;
            cursor: pointer;
            color: #7f8c8d;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s; /* Faster transition */
        }
        
        .wordglance-tooltip .slider-button:hover {
            color: #2c3e50;
        }
        
        .wordglance-tooltip .slider-button:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
        
        .wordglance-tooltip .slider-button:disabled:hover {
            color: inherit;
        }
        
        .wordglance-tooltip.dark-mode .slider-button {
            color: #cccccc;
        }
        
        .wordglance-tooltip.dark-mode .slider-button:hover:not(:disabled) {
            color: #ffffff;
        }
        
        .wordglance-tooltip .slider-info {
            font-size: 11px;
            color: #7f8c8d;
            margin: 0 4px;
            white-space: nowrap;
        }
        
        .wordglance-tooltip .content-container {
            position: relative;
            overflow: hidden; /* needed to hide non-active pages */
            height: auto; /* will be set dynamically */
            transition: height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Slower, more natural easing */
            will-change: height; /* Optimize for height animations */
        }
        
        .wordglance-tooltip .content-slider {
            display: flex;
            transition: transform 0.3s ease; /* Slower slider transitions */
            width: 100%;
            height: auto;
            will-change: transform; /* Optimize for transform animations */
        }
        
        .wordglance-tooltip .content-page {
            min-width: 100%;
            max-width: 100%;
            flex-shrink: 0;
            word-wrap: break-word;
            overflow-wrap: break-word;
            box-sizing: border-box;
            height: auto;
        }
        
        .wordglance-tooltip .definition-item {
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #f8f9fa;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .wordglance-tooltip.dark-mode .definition-item {
            border-bottom-color: #333333;
        }
        
        .wordglance-tooltip .definition-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .wordglance-tooltip .definition-text {
            color: #2c3e50;
            margin-bottom: 4px;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .wordglance-tooltip.dark-mode .definition-text {
            color: #e0e0e0;
        }
        
        .wordglance-tooltip .translation-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            min-height: 80px;
            position: relative;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .wordglance-tooltip .translation-grid::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 10%;
            right: 10%;
            height: 2px;
            background: #e0e0e0;
            transform: translateY(-1px);
            z-index: 3;
        }
        
        .wordglance-tooltip .translation-grid::after {
            content: '';
            position: absolute;
            top: 5%;
            bottom: 5%;
            left: 50%;
            width: 2px;
            background: #e0e0e0;
            transform: translateX(-1px);
            z-index: 3;
        }
        
        .wordglance-tooltip.dark-mode .translation-grid::before,
        .wordglance-tooltip.dark-mode .translation-grid::after {
            background: #333333;
        }
        
        .wordglance-tooltip .translation-text {
            color: #27ae60;
            font-weight: 500;
            font-size: 14px;
            word-wrap: break-word;
            overflow-wrap: break-word;
            padding: 12px 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            min-height: 20px;
            background: #ffffff;
            position: relative;
            z-index: 2;
        }
        
        .wordglance-tooltip.dark-mode .translation-text {
            color: #4fc3f7;
            background: #1a1a1a;
        }
        
        .wordglance-tooltip .part-of-speech {
            color: #7f8c8d;
            font-style: italic;
            font-size: 12px;
            margin-right: 8px;
        }
        
        .wordglance-tooltip.dark-mode .part-of-speech {
            color: #cccccc;
        }
        
        .wordglance-tooltip .example {
            font-style: italic;
            color: #7f8c8d;
            font-size: 12px;
            margin-top: 4px;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .wordglance-tooltip.dark-mode .example {
            color: #cccccc;
        }
        
        .wordglance-tooltip .synonyms-antonyms {
            margin-top: 6px;
            font-size: 12px;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .wordglance-tooltip .synonyms-antonyms-section {
            margin-top: 12px;
            padding-top: 0;
        }
        
        .wordglance-tooltip .synonyms,
        .wordglance-tooltip .antonyms {
            margin-top: 4px;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .wordglance-tooltip .synonyms-label,
        .wordglance-tooltip .antonyms-label {
            font-weight: 600;
            color: #2c3e50;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .wordglance-tooltip.dark-mode .synonyms-label,
        .wordglance-tooltip.dark-mode .antonyms-label {
            color: #cccccc;
        }
        
        .wordglance-tooltip .synonyms-list,
        .wordglance-tooltip .antonyms-list {
            color: #7f8c8d;
            font-style: italic;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .wordglance-tooltip.dark-mode .synonyms-list,
        .wordglance-tooltip.dark-mode .antonyms-list {
            color: #cccccc;
        }
        
        .wordglance-tooltip .loading {
            color: #7f8c8d;
            font-style: italic;
        }
        
        .wordglance-tooltip.dark-mode .loading {
            color: #cccccc;
        }
        
        .wordglance-tooltip .error {
            color: #e74c3c;
            font-size: 13px;
        }
        
        .wordglance-tooltip.dark-mode .error {
            color: #ff6b6b;
        }

        /* Settings Menu Styles - Matching tooltip design */
        .wordglance-settings {
            position: absolute;
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 16px;
            max-width: 400px;
            min-width: 350px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            z-index: ${CONFIG.tooltipZIndex + 10};
            display: none;
            pointer-events: auto;
            transition: background-color 0.3s, border-color 0.3s, color 0.3s;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .wordglance-settings.dark-mode {
            background: #1a1a1a;
            border-color: #333333;
            color: #e0e0e0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .wordglance-settings .settings-header {
            font-weight: 600;
            font-size: 16px;
            color: #2c3e50;
            margin-bottom: 12px;
            border-bottom: 1px solid #ecf0f1;
            padding-bottom: 8px;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .wordglance-settings.dark-mode .settings-header {
            color: #ffffff;
            border-bottom-color: #444444;
        }

        .wordglance-settings .setting-section {
            margin-bottom: 12px;
        }

        .wordglance-settings .setting-section:last-child {
            margin-bottom: 0;
        }

        .wordglance-settings .section-title {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .wordglance-settings.dark-mode .section-title {
            color: #cccccc;
        }

        .wordglance-settings .setting-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 8px 0;
        }

        .wordglance-settings .setting-item:last-child {
            margin-bottom: 0;
        }

        .wordglance-settings .setting-label {
            color: #2c3e50;
            font-size: 14px;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .wordglance-settings.dark-mode .setting-label {
            color: #e0e0e0;
        }

        .wordglance-settings .setting-tip {
            font-size: 11px;
            color: #7f8c8d;
            margin-top: 2px;
            font-style: italic;
        }

        .wordglance-settings.dark-mode .setting-tip {
            color: #cccccc;
        }

        .wordglance-settings .toggle-switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        }

        .wordglance-settings .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .wordglance-settings .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #bdc3c7;
            transition: all 0.3s;
            border-radius: 24px;
        }

        .wordglance-settings .toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: all 0.3s;
            border-radius: 50%;
        }

        .wordglance-settings .toggle-switch input:checked + .toggle-slider {
            background-color: #3498db;
        }

        .wordglance-settings .toggle-switch input:checked + .toggle-slider:before {
            transform: translateX(20px);
        }

        .wordglance-settings .language-selector {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 5px 25px 5px 6px;
            cursor: pointer;
            font-size: 13px;
            color: #2c3e50;
            position: relative;
            transition: all 0.3s;
            min-width: 140px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .wordglance-settings .language-selector::after {
            content: "▼";
            position: absolute;
            right: 8px;
            font-size: 11px;
            color: #7f8c8d;
            pointer-events: none;
        }

        .wordglance-settings.dark-mode .language-selector::after {
            color: #aaaaaa;
        }

        .wordglance-settings.dark-mode .language-selector {
            background: #333333;
            border-color: #666666;
            color: #e0e0e0;
        }

        .wordglance-settings .language-selector:hover {
            border-color: #3498db;
        }

        .wordglance-settings .language-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            margin-top: 2px;
            max-height: 200px;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            display: none;
        }

        .wordglance-settings.dark-mode .language-dropdown {
            background: #333333;
            border-color: #666666;
        }

        .wordglance-settings .language-dropdown.open {
            display: block;
        }

        .wordglance-settings .language-search {
            width: 100%;
            padding: 8px;
            border: none;
            border-bottom: 1px solid #e2e8f0;
            font-size: 12px;
            outline: none;
            background: #f7fafc;
            color: #2c3e50;
        }

        .wordglance-settings.dark-mode .language-search {
            background: #2a2a2a;
            border-bottom-color: #666666;
            color: #e0e0e0;
        }

        .wordglance-settings .language-search::placeholder {
            color: #7f8c8d;
            font-style: italic;
        }

        .wordglance-settings.dark-mode .language-search::placeholder {
            color: #cccccc;
        }

        .wordglance-settings .language-options {
            max-height: 150px;
            overflow-y: auto;
        }

        .wordglance-settings .language-option {
            padding: 6px 8px;
            cursor: pointer;
            font-size: 13px;
            color: #2c3e50;
            border-bottom: 1px solid #f8f9fa;
            transition: background-color 0.2s;
        }

        .wordglance-settings.dark-mode .language-option {
            color: #e0e0e0;
            border-bottom-color: #444444;
        }

        .wordglance-settings .language-option:last-child {
            border-bottom: none;
        }

        .wordglance-settings .language-option:hover {
            background-color: #ecf0f1;
        }

        .wordglance-settings.dark-mode .language-option:hover {
            background-color: #444444;
        }

        .wordglance-settings .language-option.selected {
            background-color: #3498db;
            color: white;
        }

        .wordglance-settings .cache-button {
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s;
        }

        .wordglance-settings .cache-button:hover {
            background: #c0392b;
        }

        .wordglance-settings .cache-info {
            font-size: 11px;
            color: #7f8c8d;
            margin-top: 4px;
            font-style: italic;
        }

        .wordglance-settings.dark-mode .cache-info {
            color: #cccccc;
        }

        .wordglance-settings .close-button {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            font-size: 18px;
            color: #95a5a6;
            cursor: pointer;
            padding: 4px;
            line-height: 1;
        }
        
        .wordglance-settings .close-button:hover {
            color: #2c3e50;
        }
        
        .wordglance-settings.dark-mode .close-button:hover {
            color: #ffffff;
        }

        /* Credit Section Styles */
        .wordglance-settings .credit-section {
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
            margin-top: 15px;
            text-align: center;
        }

        .wordglance-settings.dark-mode .credit-section {
            border-top-color: #444444;
        }

        .wordglance-settings .help-link {
            display: block;
            margin-bottom: 12px;
            color: #3498db;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s;
        }

        .wordglance-settings .help-link:hover {
            color: #2980b9;
        }

        .wordglance-settings.dark-mode .help-link {
            color: #5dade2;
        }

        .wordglance-settings.dark-mode .help-link:hover {
            color: #85c1e9;
        }

        .wordglance-settings .credit-text {
            font-size: 13px;
            color: #7f8c8d;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }

        .wordglance-settings.dark-mode .credit-text {
            color: #cccccc;
        }

        .wordglance-settings .credit-link {
            color: #3498db;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: color 0.3s;
        }

        .wordglance-settings .credit-link:hover {
            color: #2980b9;
        }

        .wordglance-settings.dark-mode .credit-link {
            color: #5dade2;
        }

        .wordglance-settings.dark-mode .credit-link:hover {
            color: #85c1e9;
        }

        .wordglance-settings .github-icon {
            width: 16px;
            height: 16px;
            vertical-align: middle;
        }

        /* Usage Statistics Styles */
        .wordglance-settings .usage-circle {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 2px solid #3498db;
            background: transparent;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #3498db;
            font-weight: bold;
            margin: 0 auto;
        }

        .wordglance-settings.dark-mode .usage-circle {
            border-color: #ff6b6b;
            color: #ff6b6b;
        }

        .wordglance-settings .usage-number {
            font-size: 24px;
            line-height: 1;
        }

        .wordglance-settings .usage-label {
            font-size: 10px;
            text-transform: lowercase;
            letter-spacing: 0.3px;
            margin-top: 4px;
        }
    `);

    // Usage statistics tracking
    let totalWordsLearned = GM_getValue('wordglance-total-words-learned', 0);

    // Function to increment word learned counter
    function incrementWordsLearned() {
        totalWordsLearned++;
        GM_setValue('wordglance-total-words-learned', totalWordsLearned);
        
        // Update display if settings menu is open
        const usageNumber = document.querySelector('.usage-number');
        if (usageNumber) {
            usageNumber.textContent = totalWordsLearned;
        }
    }

    // DOM element cache to reduce repeated queries
    let domCache = {
        definitionSlider: null,
        translationSlider: null,
        translationTitle: null,
        definitionInfo: null,
        translationInfo: null,
        definitionPrevBtn: null,
        definitionNextBtn: null,
        translationPrevBtn: null,
        translationNextBtn: null
    };

    // Cache DOM elements when tooltip is created
    function cacheDOMElements() {
        if (!tooltip) return;
        
        domCache.definitionSlider = tooltip.querySelector('.definition-slider');
        domCache.translationSlider = tooltip.querySelector('.translation-slider');
        domCache.translationTitle = tooltip.querySelector('.translation-section .section-title span');
        domCache.definitionInfo = tooltip.querySelector('.definition-info');
        domCache.translationInfo = tooltip.querySelector('.translation-info');
        domCache.definitionPrevBtn = tooltip.querySelector('.definition-prev');
        domCache.definitionNextBtn = tooltip.querySelector('.definition-next');
        domCache.translationPrevBtn = tooltip.querySelector('.translation-prev');
        domCache.translationNextBtn = tooltip.querySelector('.translation-next');
    }

    // Clear DOM cache when tooltip is removed
    function clearDOMCache() {
        // Remove transition event listeners to prevent memory leaks
        if (tooltip) {
            const defSlider = tooltip.querySelector('.definition-slider');
            const transSlider = tooltip.querySelector('.translation-slider');
            
            if (defSlider && defSlider._heightSyncHandler) {
                defSlider.removeEventListener('transitionend', defSlider._heightSyncHandler);
                delete defSlider._heightSyncHandler;
            }
            if (transSlider && transSlider._heightSyncHandler) {
                transSlider.removeEventListener('transitionend', transSlider._heightSyncHandler);
                delete transSlider._heightSyncHandler;
            }
        }
        
        domCache = {
            definitionSlider: null,
            translationSlider: null,
            translationTitle: null,
            definitionInfo: null,
            translationInfo: null,
            definitionPrevBtn: null,
            definitionNextBtn: null,
            translationPrevBtn: null,
            translationNextBtn: null
        };
    }
    let tooltip = null;
    let triggerIcon = null;
    let settingsMenu = null;
    let resizeTimeout = null; // Add missing variable
    let currentSelection = '';
    let selectionRange = null;
    let definitionData = null;
    let translationData = null;
    let currentDefinitionPage = 0;
    let currentTranslationPage = 0;
    let definitionPageHeights = [];
    let translationPageHeights = [];
    let activeRequests = new Set(); // Track active API requests

    // Register menu commands
    GM_registerMenuCommand('⚙️ WordGlance Settings', showSettingsMenu);

    // Create simple settings menu matching tooltip design
    function createSettingsMenu() {
        const menu = document.createElement('div');
        menu.className = `wordglance-settings ${isDarkMode ? 'dark-mode' : ''}`;
        
        menu.innerHTML = `
            <button class="close-button">×</button>
            <div class="settings-header">⚙️ Settings</div>
            
            <div class="setting-section">
                <div class="setting-item">
                    <div class="setting-label">Dark Mode</div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="dark-mode-toggle" ${isDarkMode ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <div class="setting-label">
                        <div>From Language</div>
                        <div class="setting-tip">Use auto for best experience</div>
                    </div>
                    <div class="language-selector" id="source-language-selector">
                        <span class="language-text">${getLanguageName(sourceLanguage)}</span>
                        <div class="language-dropdown" id="source-language-dropdown">
                            <input type="text" class="language-search" id="source-language-search" placeholder="Search languages...">
                            <div class="language-options" id="source-language-options">
                                ${generateSourceLanguageOptions()}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="setting-item">
                    <div class="setting-label">To Language</div>
                    <div class="language-selector" id="target-language-selector">
                        <span class="language-text">${getLanguageName(targetLanguage)}</span>
                        <div class="language-dropdown" id="target-language-dropdown">
                            <input type="text" class="language-search" id="target-language-search" placeholder="Search languages...">
                            <div class="language-options" id="target-language-options">
                                ${generateTargetLanguageOptions()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="setting-section">
                <div class="setting-item">
                    <div class="setting-label">
                        <div>Cache</div>
                        <div class="cache-info" id="cache-info">Loading...</div>
                    </div>
                    <button class="cache-button" id="clear-cache-btn">Clear</button>
                </div>
            </div>
            
            <div class="setting-section">
                <div class="usage-circle">
                    <div class="usage-number">${totalWordsLearned}</div>
                    <div class="usage-label">words learned</div>
                </div>
            </div>
            
            <div class="credit-section">
                <a href="https://github.com/ShrekBytes/WordGlance/issues" target="_blank" class="help-link">Need help?</a>
                <div class="credit-text">
                    Made by 
                    <a href="https://github.com/ShrekBytes/WordGlance" target="_blank" class="credit-link">
                        <svg class="github-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                        ShrekBytes
                    </a>
                </div>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Update cache info
        updateCacheInfo();
        
        // Event listeners
        setupSettingsEventListeners(menu);
        
        return menu;
    }

    function generateSourceLanguageOptions() {
        return Object.entries(LANGUAGES)
            .map(([code, name]) => 
                `<div class="language-option ${code === sourceLanguage ? 'selected' : ''}" data-code="${code}">
                    ${name}
                </div>`
            ).join('');
    }

    function generateTargetLanguageOptions() {
        // Exclude 'auto' from target languages
        return Object.entries(LANGUAGES)
            .filter(([code]) => code !== 'auto')
            .map(([code, name]) => 
                `<div class="language-option ${code === targetLanguage ? 'selected' : ''}" data-code="${code}">
                    ${name}
                </div>`
            ).join('');
    }

    function setupSettingsEventListeners(menu) {
        // Close button
        const closeBtn = menu.querySelector('.close-button');
        closeBtn.addEventListener('click', hideSettingsMenu);
        
        // Dark mode toggle
        const darkModeToggle = menu.querySelector('#dark-mode-toggle');
        darkModeToggle.addEventListener('change', (e) => {
            toggleDarkMode();
            menu.className = `wordglance-settings ${isDarkMode ? 'dark-mode' : ''}`;
        });
        
        // Source language selector
        setupLanguageSelector(menu, 'source', changeSourceLanguage);
        
        // Target language selector
        setupLanguageSelector(menu, 'target', changeTargetLanguage);
        
        // Clear cache button
        const clearCacheBtn = menu.querySelector('#clear-cache-btn');
        clearCacheBtn.addEventListener('click', () => {
            clearCacheWithConfirmation();
            updateCacheInfo();
        });
    }

    function setupLanguageSelector(menu, type, changeLanguageFunction) {
        const prefix = type === 'source' ? 'source-' : 'target-';
        const languageSelector = menu.querySelector(`#${prefix}language-selector`);
        const languageDropdown = menu.querySelector(`#${prefix}language-dropdown`);
        const languageSearch = menu.querySelector(`#${prefix}language-search`);
        const languageOptions = menu.querySelector(`#${prefix}language-options`);
        
        languageSelector.addEventListener('click', (e) => {
            // Don't toggle if clicking on the dropdown itself
            if (!languageDropdown.contains(e.target)) {
                // Close other dropdowns first
                const otherPrefix = type === 'source' ? 'target-' : 'source-';
                const otherDropdown = menu.querySelector(`#${otherPrefix}language-dropdown`);
                if (otherDropdown) {
                    otherDropdown.classList.remove('open');
                    const otherSearch = menu.querySelector(`#${otherPrefix}language-search`);
                    const otherOptions = menu.querySelector(`#${otherPrefix}language-options`);
                    if (otherSearch) otherSearch.value = '';
                    if (otherOptions) {
                        otherOptions.querySelectorAll('.language-option').forEach(opt => 
                            opt.style.display = 'block');
                    }
                }
                
                languageDropdown.classList.toggle('open');
                if (languageDropdown.classList.contains('open')) {
                    // Focus search input when dropdown opens
                    setTimeout(() => languageSearch.focus(), 50);
                }
            }
        });
        
        // Language search functionality
        languageSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const options = languageOptions.querySelectorAll('.language-option');
            
            options.forEach(option => {
                const languageName = option.textContent.toLowerCase();
                const languageCode = option.dataset.code.toLowerCase();
                
                if (languageName.includes(searchTerm) || languageCode.includes(searchTerm)) {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            });
        });
        
        // Prevent dropdown from closing when clicking inside it
        languageDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Language options
        languageOptions.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', () => {
                const newLanguage = option.dataset.code;
                const currentLanguage = type === 'source' ? sourceLanguage : targetLanguage;
                
                if (newLanguage !== currentLanguage) {
                    changeLanguageFunction(newLanguage);
                    
                    // Update selector text
                    const languageText = languageSelector.querySelector('.language-text');
                    if (languageText) {
                        languageText.textContent = option.textContent;
                    }
                    
                    // Update selected state
                    languageOptions.querySelectorAll('.language-option').forEach(opt => 
                        opt.classList.remove('selected'));
                    option.classList.add('selected');
                }
                
                // Clear search and close dropdown
                languageSearch.value = '';
                languageOptions.querySelectorAll('.language-option').forEach(opt => 
                    opt.style.display = 'block');
                languageDropdown.classList.remove('open');
            });
        });
        
        // Handle Escape key in search
        languageSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                languageDropdown.classList.remove('open');
                languageSearch.value = '';
                languageOptions.querySelectorAll('.language-option').forEach(opt => 
                    opt.style.display = 'block');
            }
        });
        
        // Store cleanup function for this selector
        if (!menu._cleanupFunctions) menu._cleanupFunctions = [];
        menu._cleanupFunctions.push(() => {
            // Remove event listeners would happen automatically when DOM elements are removed
            // But we can clear any references
            languageDropdown.classList.remove('open');
            languageSearch.value = '';
        });
    }

    function updateCacheInfo() {
        const cacheInfo = document.querySelector('#cache-info');
        if (cacheInfo) {
            const defCount = cache.definitions.size;
            const transCount = cache.translations.size;
            cacheInfo.textContent = `${defCount + transCount} items`;
        }
    }

    function showSettingsMenu() {
        if (settingsMenu) {
            hideSettingsMenu();
            return;
        }
        
        // Hide tooltip if open
        hideTooltip();
        hideTriggerIcon();
        
        settingsMenu = createSettingsMenu();
        settingsMenu.style.display = 'block';
        
        // Position like tooltip
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const rect = settingsMenu.getBoundingClientRect();
        
        let left = (viewportWidth - rect.width) / 2;
        let top = (viewportHeight - rect.height) / 2;
        
        settingsMenu.style.left = left + window.scrollX + 'px';
        settingsMenu.style.top = top + window.scrollY + 'px';
    }

    function hideSettingsMenu() {
        if (settingsMenu) {
            // Clean up any stored cleanup functions
            if (settingsMenu._cleanupFunctions) {
                settingsMenu._cleanupFunctions.forEach(cleanup => cleanup());
                settingsMenu._cleanupFunctions = null;
            }
            settingsMenu.remove();
            settingsMenu = null;
        }
    }

    // Updated menu command functions
    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        GM_setValue('wordglance-dark-mode', isDarkMode);
        
        // Update all UI elements
        if (tooltip) {
            tooltip.className = `wordglance-tooltip ${isDarkMode ? 'dark-mode' : ''}`;
        }
        if (triggerIcon) {
            triggerIcon.className = `wordglance-trigger-icon ${isDarkMode ? 'dark-mode' : ''}`;
        }
        if (settingsMenu) {
            settingsMenu.className = `wordglance-settings ${isDarkMode ? 'dark-mode' : ''}`;
        }
    }

    // Centralized language validation function
    function validateLanguageCode(languageCode, isSource = true) {
        // Check if language code exists
        if (!LANGUAGES[languageCode]) {
            return { valid: false, error: `Invalid language code: ${languageCode}` };
        }
        
        // Check auto-detect restrictions
        if (!isSource && languageCode === 'auto') {
            return { valid: false, error: 'Auto-detect not allowed for target language' };
        }
        
        return { valid: true, error: null };
    }

    // Consolidated language change function to reduce code duplication
    function changeLanguage(type, newLanguage) {
        const isSource = type === 'source';
        const currentLanguage = isSource ? sourceLanguage : targetLanguage;
        const languageKey = isSource ? 'wordglance-source-language' : 'wordglance-target-language';
        
        // Use centralized validation
        const validation = validateLanguageCode(newLanguage, isSource);
        if (!validation.valid) {
            console.warn(validation.error);
            return;
        }
        
        if (currentLanguage === newLanguage) {
            return;
        }
        
        // Update the language variable
        if (isSource) {
            sourceLanguage = newLanguage;
        } else {
            targetLanguage = newLanguage;
        }
        
        // Save to storage
        GM_setValue(languageKey, newLanguage);
        
        // Clear translation cache since language changed
        cache.translations.clear();
        GM_setValue('wordglance-cache-translations', '{}');
        
        // Update tooltip if open
        if (tooltip && tooltip.style.display !== 'none') {
            const translationTitle = domCache.translationTitle || tooltip.querySelector('.translation-section .section-title span');
            if (translationTitle) {
                const sourceLabel = sourceLanguage === 'auto' ? 'Auto' : getLanguageName(sourceLanguage);
                const targetLabel = getLanguageName(targetLanguage);
                translationTitle.textContent = `${sourceLabel} → ${targetLabel}`;
                
                // Reload translation with new language if we have current selection
                if (currentSelection) {
                    reloadTranslationContent();
                }
            }
        }
    }
    
    // Helper function to reload translation content (optimized with cached DOM elements)
    function reloadTranslationContent() {
        const translationSlider = domCache.translationSlider || tooltip?.querySelector('.translation-slider');
        if (!translationSlider) return;
        
        translationSlider.innerHTML = '<div class="content-page"><div class="translation-content loading">Loading...</div></div>';
        
        // Set loading height
        const container = tooltip.querySelector('.translation-section .content-container');
        if (container) smoothHeightTransition(container, 80, true);
        
        fetchTranslation(currentSelection)
            .then(result => {
                translationData = result;
                updateTranslationDisplay(result);
                currentTranslationPage = 0;
                updateTranslationSlider(true);
                
                // Smooth transition to final height with staggered timing
                setTimeout(() => {
                    setContainerHeightFromCache('translation', false);
                }, 150);
            })
            .catch(error => {
                console.warn('Translation reload failed:', error);
                translationSlider.innerHTML = `<div class="content-page"><span class="error">${error}</span></div>`;
                translationPageHeights = [40];
                currentTranslationPage = 0;
                updateTranslationSlider(true);
                
                // Smooth transition to error state height with delay
                setTimeout(() => {
                    setContainerHeightFromCache('translation', false);
                }, 150);
            });
    }
    
    // Helper function to update translation display (optimized)
    function updateTranslationDisplay(result) {
        const translationSlider = domCache.translationSlider || tooltip?.querySelector('.translation-slider');
        if (!translationSlider) return;
        
        let pagesHtml = '';
        result.pages.forEach((page, pageIndex) => {
            let pageHtml = '<div class="content-page">';
            pageHtml += '<div class="translation-grid">';
            
            page.forEach(translation => {
                pageHtml += `<div class="translation-text">${translation}</div>`;
            });
            
            const emptyCells = CONFIG.translationsPerPage - page.length;
            for (let i = 0; i < emptyCells; i++) {
                pageHtml += '<div class="translation-text" style="opacity: 0; pointer-events: none;"></div>';
            }
            
            pageHtml += '</div></div>';
            pagesHtml += pageHtml;
        });
        
        translationSlider.innerHTML = pagesHtml;
        translationPageHeights = Array.from(translationSlider.children).map(page => {
            return measurePageHeight(page);
        });
    }

    function changeSourceLanguage(newLanguage) {
        changeLanguage('source', newLanguage);
    }

    function changeTargetLanguage(newLanguage) {
        changeLanguage('target', newLanguage);
    }

    function clearCacheWithConfirmation() {
        const confirmed = confirm('Are you sure you want to clear all cached data and reset word counter?\n\nThis will delete:\n• All cached definitions and translations\n• Words learned counter\n\nThis action cannot be undone.');
        if (confirmed) {
            cache.definitions.clear();
            cache.translations.clear();
            GM_setValue('wordglance-cache-definitions', '{}');
            GM_setValue('wordglance-cache-translations', '{}');
            
            // Reset word counter
            totalWordsLearned = 0;
            GM_setValue('wordglance-total-words-learned', 0);
            
            // Update display if settings menu is open
            const usageNumber = document.querySelector('.usage-number');
            if (usageNumber) {
                usageNumber.textContent = totalWordsLearned;
            }
        }
    }

    // Create trigger icon
    function createTriggerIcon() {
        const icon = document.createElement('button');
        icon.className = `wordglance-trigger-icon ${isDarkMode ? 'dark-mode' : ''}`;
        icon.innerHTML = '📖';
        icon.title = 'Click to get definition and translation';
        document.body.appendChild(icon);
        return icon;
    }

    // Create tooltip element
    function createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = `wordglance-tooltip ${isDarkMode ? 'dark-mode' : ''}`;
        tooltip.innerHTML = `
            <div class="definition-section">
                <div class="section-title">
                    <span class="word-title">Word</span>
                    <div class="slider-controls">
                        <button class="slider-button definition-prev">‹</button>
                        <span class="slider-info definition-info">1/1</span>
                        <button class="slider-button definition-next">›</button>
                    </div>
                </div>
                <div class="content-container">
                    <div class="content-slider definition-slider">
                        <div class="content-page">
                            <div class="definition-content loading">Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="translation-section">
                <div class="section-title">
                    <span class="translation-title">${sourceLanguage === 'auto' ? 'Auto' : getLanguageName(sourceLanguage)} → ${getLanguageName(targetLanguage)}</span>
                    <div class="slider-controls">
                        <button class="slider-button translation-prev">‹</button>
                        <span class="slider-info translation-info">1/1</span>
                        <button class="slider-button translation-next">›</button>
                    </div>
                </div>
                <div class="content-container">
                    <div class="content-slider translation-slider">
                        <div class="content-page">
                            <div class="translation-content loading">Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="synonyms-antonyms-section" style="display: none;">
                <div class="synonyms-antonyms-content"></div>
            </div>
        `;
        
        // Add event listeners
        tooltip.querySelector('.definition-prev').addEventListener('click', () => {
            if (currentDefinitionPage > 0) {
                currentDefinitionPage--;
                updateDefinitionSlider();
            }
        });
        
        tooltip.querySelector('.definition-next').addEventListener('click', () => {
            if (definitionData && currentDefinitionPage < definitionData.pages.length - 1) {
                currentDefinitionPage++;
                updateDefinitionSlider();
            }
        });
        
        tooltip.querySelector('.translation-prev').addEventListener('click', () => {
            if (currentTranslationPage > 0) {
                currentTranslationPage--;
                updateTranslationSlider();
            }
        });
        
        tooltip.querySelector('.translation-next').addEventListener('click', () => {
            if (translationData && currentTranslationPage < translationData.pages.length - 1) {
                currentTranslationPage++;
                updateTranslationSlider();
            }
        });
        
        document.body.appendChild(tooltip);
        
        // Cache DOM elements for performance
        cacheDOMElements();
        
        // Attach transition listeners for dynamic height sync
        attachTransitionHeightSync();
        return tooltip;
    }

    // Update slider display and controls (optimized with cached DOM elements)
    function updateDefinitionSlider(initial) {
        if (!tooltip || !definitionData) return;
        
        const slider = domCache.definitionSlider || tooltip.querySelector('.definition-slider');
        const info = domCache.definitionInfo || tooltip.querySelector('.definition-info');
        const prevBtn = domCache.definitionPrevBtn || tooltip.querySelector('.definition-prev');
        const nextBtn = domCache.definitionNextBtn || tooltip.querySelector('.definition-next');
        
        if (!slider || !info || !prevBtn || !nextBtn) return;
        
        // Update slider position
        slider.style.transform = `translateX(-${currentDefinitionPage * 100}%)`;
        
        // Update info
        info.textContent = `${currentDefinitionPage + 1}/${definitionData.pages.length}`;
        
        // Update button states
        prevBtn.disabled = currentDefinitionPage === 0;
        nextBtn.disabled = currentDefinitionPage === definitionData.pages.length - 1;

        setContainerHeightFromCache('definition', initial);
    }

    function updateTranslationSlider(initial) {
        if (!tooltip || !translationData) return;
        
        const slider = domCache.translationSlider || tooltip.querySelector('.translation-slider');
        const info = domCache.translationInfo || tooltip.querySelector('.translation-info');
        const prevBtn = domCache.translationPrevBtn || tooltip.querySelector('.translation-prev');
        const nextBtn = domCache.translationNextBtn || tooltip.querySelector('.translation-next');
        
        if (!slider || !info || !prevBtn || !nextBtn) return;
        
        // Update slider position
        slider.style.transform = `translateX(-${currentTranslationPage * 100}%)`;
        
        // Update info
        info.textContent = `${currentTranslationPage + 1}/${translationData.pages.length}`;
        
        // Update button states
        prevBtn.disabled = currentTranslationPage === 0;
        nextBtn.disabled = currentTranslationPage === translationData.pages.length - 1;

        setContainerHeightFromCache('translation', initial);
    }

    // Listen for transform transition end to re-adjust heights
    function attachTransitionHeightSync() {
        if (!tooltip) return;
        const defSlider = tooltip.querySelector('.definition-slider');
        const transSlider = tooltip.querySelector('.translation-slider');
        const handler = (e) => {
            if (e.propertyName === 'transform') {
                setContainerHeightFromCache('definition');
                setContainerHeightFromCache('translation');
            }
        };
        
        // Store handlers for cleanup
        if (defSlider) {
            defSlider.addEventListener('transitionend', handler);
            defSlider._heightSyncHandler = handler; // Store for removal
        }
        if (transSlider) {
            transSlider.addEventListener('transitionend', handler);
            transSlider._heightSyncHandler = handler; // Store for removal
        }
    }

    // Dynamically adjust container height (fallback for missing cached heights)
    function adjustSliderHeight(kind) {
        if (!tooltip) return;
        const container = tooltip.querySelector(`.${kind}-section .content-container`);
        if (!container) return;
        const slider = container.querySelector(`.${kind}-slider`);
        if (!slider) return;
        const index = kind === 'definition' ? currentDefinitionPage : currentTranslationPage;
        const currentPage = slider.children[index];
        if (!currentPage) return;

        // Measure height without interfering with layout
        const targetHeight = currentPage.scrollHeight || currentPage.offsetHeight;
        
        if (targetHeight && Math.abs(container.clientHeight - targetHeight) > 2) {
            smoothHeightTransition(container, targetHeight);
        }
    }

    // Set container height from cached measurements
    function setContainerHeightFromCache(kind, initial) {
        if (!tooltip) return;
        const container = tooltip.querySelector(`.${kind}-section .content-container`);
        if (!container) return;
        const heights = kind === 'definition' ? definitionPageHeights : translationPageHeights;
        const index = kind === 'definition' ? currentDefinitionPage : currentTranslationPage;
        const targetHeight = heights[index];
        
        if (targetHeight) {
            smoothHeightTransition(container, targetHeight, initial);
        } else {
            // Fallback to live measurement if cache is missing
            adjustSliderHeight(kind);
        }
    }

    // Window resize handler - recalculate current page heights (now debounced)
    const debouncedResizeHandler = debounce(() => {
        if (!tooltip || tooltip.style.display === 'none') return;
        
        definitionPageHeights[currentDefinitionPage] = recalcCurrentPageHeight('definition');
        translationPageHeights[currentTranslationPage] = recalcCurrentPageHeight('translation');
        setContainerHeightFromCache('definition');
        setContainerHeightFromCache('translation');
    }, CONFIG.resizeDebounceDelay); // Configurable debounce delay
    
    window.addEventListener('resize', debouncedResizeHandler);

    // Recalculate height for current page (used on window resize)
    function recalcCurrentPageHeight(kind) {
        if (!tooltip) return 0;
        const container = tooltip.querySelector(`.${kind}-section .content-container`);
        if (!container) return 0;
        const slider = container.querySelector(`.${kind}-slider`);
        if (!slider) return 0;
        const index = kind === 'definition' ? currentDefinitionPage : currentTranslationPage;
        const page = slider.children[index];
        if (!page) return 0;
        
        return measurePageHeight(page);
    }

    // Get language name for display
    function getLanguageName(code) {
        return LANGUAGES[code] || code.toUpperCase();
    }

    // Position trigger icon near selection
    function positionTriggerIcon(icon, x, y) {
        // Use requestAnimationFrame for smooth positioning
        requestAnimationFrame(() => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                           ('ontouchstart' in window) || 
                           (navigator.maxTouchPoints > 0);
            
            // Button size depends on device type
            const buttonSize = isMobile ? 32 : 24;
            const halfButton = buttonSize / 2;
            
            let left, top;
            
            if (isMobile) {
                // On mobile, position below selection to avoid native copy/paste popup
                left = Math.max(10, Math.min(x - halfButton, viewportWidth - buttonSize - 10)); // Center horizontally, with bounds
                top = y + 40; // Position below selection
                
                // If there's no room below, try to the right side
                if (top + buttonSize > viewportHeight - 50) {
                    left = Math.min(x + 20, viewportWidth - buttonSize - 10);
                    top = Math.max(10, y - halfButton); // Center vertically with selection
                    
                    // If still no room, position to the left
                    if (left + buttonSize > viewportWidth - 10) {
                        left = Math.max(10, x - buttonSize - 20);
                    }
                }
            } else {
                // Desktop positioning (original logic)
                left = x + 10;
                top = y - 30;
                
                // Adjust if icon goes off screen
                if (left + buttonSize > viewportWidth) {
                    left = x - buttonSize - 10;
                }
                if (top < 0) {
                    top = y + 10;
                }
            }
            
            icon.style.left = left + window.scrollX + 'px';
            icon.style.top = top + window.scrollY + 'px';
        });
    }

    /**
     * Fetches word definition from Dictionary API with caching and fast response
     * @param {string} word - The word to look up
     * @returns {Promise<Object>} - Promise resolving to definition data with pages, synonyms, and antonyms
     */
    function fetchDefinition(word) {
        return new Promise((resolve, reject) => {
            // Check cache first for instant response
            const cached = getFromCache('definitions', word);
            if (cached) {
                resolve(cached);
                return;
            }
            
            const requestId = `def-${word}-${Date.now()}`;
            activeRequests.add(requestId);
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
                onload: function(response) {
                    // Check if request is still active (not cancelled by newer request)
                    if (!activeRequests.has(requestId)) {
                        return; // Ignore outdated response
                    }
                    activeRequests.delete(requestId);
                    
                    try {
                        if (response.status === 404) {
                            reject(createErrorMessage('NO_DEFINITION'));
                            return;
                        } else if (response.status !== 200) {
                            reject(createErrorMessage('NETWORK_ERROR'));
                            return;
                        }
                        
                        const data = JSON.parse(response.responseText);
                        if (!data || !Array.isArray(data) || data.length === 0) {
                            reject(createErrorMessage('NO_DEFINITION'));
                            return;
                        }
                        
                        const entry = data[0];
                        if (!entry || !entry.meanings || !Array.isArray(entry.meanings) || entry.meanings.length === 0) {
                            reject(createErrorMessage('NO_DEFINITION'));
                            return;
                        }
                        
                        // Collect all definitions first
                        const definitions = [];
                        let allSynonyms = [];
                        let allAntonyms = [];
                        
                        for (const meaning of entry.meanings) {
                            if (definitions.length >= CONFIG.maxDefinitions) break;
                            
                            // Collect synonyms and antonyms from meaning level
                            const meaningSynonyms = meaning.synonyms || [];
                            const meaningAntonyms = meaning.antonyms || [];
                            allSynonyms.push(...meaningSynonyms);
                            allAntonyms.push(...meaningAntonyms);
                            
                            for (const definition of meaning.definitions) {
                                if (definitions.length >= CONFIG.maxDefinitions) break;
                                
                                // Collect synonyms and antonyms from definition level
                                const definitionSynonyms = definition.synonyms || [];
                                const definitionAntonyms = definition.antonyms || [];
                                allSynonyms.push(...definitionSynonyms);
                                allAntonyms.push(...definitionAntonyms);
                                
                                definitions.push({
                                    partOfSpeech: meaning.partOfSpeech,
                                    definition: definition.definition,
                                    example: definition.example
                                });
                            }
                        }
                        
                        // Remove duplicates and limit synonyms/antonyms using CONFIG
                        const uniqueSynonyms = [...new Set(allSynonyms)].slice(0, CONFIG.maxSynonyms);
                        const uniqueAntonyms = [...new Set(allAntonyms)].slice(0, CONFIG.maxAntonyms);
                        
                        // Group definitions into pages (CONFIG.definitionsPerPage per page)
                        const pages = [];
                        for (let i = 0; i < definitions.length; i += CONFIG.definitionsPerPage) {
                            const pageDefinitions = definitions.slice(i, i + CONFIG.definitionsPerPage);
                            pages.push(pageDefinitions);
                        }
                        
                        const result = { 
                            pages: pages,
                            synonyms: uniqueSynonyms,
                            antonyms: uniqueAntonyms
                        };
                        
                        // Cache the result
                        addToCache('definitions', word, result);
                        
                        resolve(result);
                    } catch (e) {
                        console.log('Definition parsing error:', e);
                        reject(createErrorMessage('PARSE_ERROR'));
                    }
                },
                onerror: function(error) {
                    activeRequests.delete(requestId);
                    reject(createErrorMessage('NETWORK_ERROR'));
                },
                ontimeout: function() {
                    activeRequests.delete(requestId);
                    reject(createErrorMessage('API_TIMEOUT'));
                },
                timeout: CONFIG.apiTimeout
            });
        });
    }

    /**
     * Fetches text translation with caching and fast response
     * @param {string} text - The text to translate
     * @returns {Promise<Object>} - Promise resolving to translation data with pages
     */
    function fetchTranslation(text) {
        return new Promise((resolve, reject) => {
            // Check cache first for instant response
            const cached = getFromCache('translations', text);
            if (cached) {
                resolve(cached);
                return;
            }
            
            const requestId = `trans-${text}-${sourceLanguage}-${targetLanguage}-${Date.now()}`;
            activeRequests.add(requestId);
            
            // Build URL with source language parameter
            let url = `https://translation-1e79fb3f3adb.herokuapp.com/translate?dl=${targetLanguage}&text=${encodeURIComponent(text)}`;
            if (sourceLanguage !== 'auto') {
                url += `&sl=${sourceLanguage}`;
            }
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    // Check if request is still active (not cancelled by newer request)
                    if (!activeRequests.has(requestId)) {
                        return; // Ignore outdated response
                    }
                    activeRequests.delete(requestId);
                    
                    try {
                        if (response.status === 404) {
                            reject(createErrorMessage('NO_TRANSLATION'));
                            return;
                        } else if (response.status !== 200) {
                            reject(createErrorMessage('NETWORK_ERROR'));
                            return;
                        }
                        
                        const data = JSON.parse(response.responseText);
                        if (data && data['destination-text']) {
                            const translations = [];
                            
                            // Add primary translation
                            translations.push(data['destination-text']);
                            
                            // Extract translations from all-translations array
                            if (data.translations && data.translations['all-translations']) {
                                const allTranslations = data.translations['all-translations'];
                                
                                for (const translationGroup of allTranslations) {
                                    if (Array.isArray(translationGroup) && translationGroup.length > 0) {
                                        const mainTranslation = translationGroup[0];
                                        
                                        // Add main translation if not already included and not the same as primary
                                        if (mainTranslation && 
                                            mainTranslation !== data['destination-text'] && 
                                            !translations.includes(mainTranslation)) {
                                            translations.push(mainTranslation);
                                        }
                                        
                                        // Stop if we have enough translations
                                        if (translations.length >= CONFIG.maxTranslations) break;
                                    }
                                }
                            }
                            
                            // Add possible translations as fallback if we don't have enough
                            if (translations.length < CONFIG.maxTranslations && 
                                data.translations && data.translations['possible-translations']) {
                                const possibleTranslations = data.translations['possible-translations']
                                    .filter(t => t && !translations.includes(t))
                                    .slice(0, CONFIG.maxTranslations - translations.length);
                                translations.push(...possibleTranslations);
                            }
                            
                            // Limit to maxTranslations
                            const limitedTranslations = translations.slice(0, CONFIG.maxTranslations);
                            
                            // Group translations into pages (CONFIG.translationsPerPage per page)
                            const pages = [];
                            for (let i = 0; i < limitedTranslations.length; i += CONFIG.translationsPerPage) {
                                pages.push(limitedTranslations.slice(i, i + CONFIG.translationsPerPage));
                            }
                            
                            const result = { pages: pages };
                            
                            // Cache the result
                            addToCache('translations', text, result);
                            
                            resolve(result);
                        } else {
                            // Check if it's a language detection issue
                            if (data && data.error && data.error.includes('language')) {
                                reject(createErrorMessage('LANGUAGE_ERROR'));
                            } else {
                                reject(createErrorMessage('NO_TRANSLATION'));
                            }
                        }
                    } catch (e) {
                        console.log('Translation parsing error:', e);
                        reject(createErrorMessage('PARSE_ERROR'));
                    }
                },
                onerror: function(error) {
                    activeRequests.delete(requestId);
                    reject(createErrorMessage('NETWORK_ERROR'));
                },
                ontimeout: function() {
                    activeRequests.delete(requestId);
                    reject(createErrorMessage('API_TIMEOUT'));
                },
                timeout: CONFIG.apiTimeout
            });
        });
    }

    // Smooth height transition helper
    function smoothHeightTransition(container, targetHeight, immediate = false) {
        if (!container) return;
        
        if (immediate) {
            // Disable transition temporarily for immediate changes
            const prevTransition = container.style.transition;
            container.style.transition = 'none';
            container.style.height = targetHeight + 'px';
            // Force reflow and restore transition
            requestAnimationFrame(() => {
                if (container) {
                    container.style.transition = prevTransition || 'height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }
            });
        } else {
            container.style.height = targetHeight + 'px';
        }
    }

    // Helper function to measure page height (reduces code duplication)
    function measurePageHeight(page) {
        const prevStyle = page.getAttribute('style') || '';
        page.style.position = 'absolute';
        page.style.visibility = 'hidden';
        page.style.left = '-10000px';
        page.style.top = '0';
        page.style.height = 'auto';
        const height = page.scrollHeight;
        page.setAttribute('style', prevStyle);
        return height;
    }

    // Cancel active requests to prevent race conditions
    function cancelActiveRequests() {
        activeRequests.clear();
    }
    
    // Helper function to initialize tooltip content
    function initializeTooltipContent(selectedText) {
        if (!tooltip) {
            tooltip = createTooltip();
        }

        // Reset page counters
        currentDefinitionPage = 0;
        currentTranslationPage = 0;
        definitionData = null;
        translationData = null;
        definitionPageHeights = [];
        translationPageHeights = [];

        // Reset content
        const definitionSlider = tooltip.querySelector('.definition-slider');
        const translationSlider = tooltip.querySelector('.translation-slider');
        const synonymsAntonymsSection = tooltip.querySelector('.synonyms-antonyms-section');
        
        definitionSlider.innerHTML = '<div class="content-page"><div class="definition-content loading">Loading...</div></div>';
        translationSlider.innerHTML = '<div class="content-page"><div class="translation-content loading">Loading...</div></div>';
        
        // Hide synonyms/antonyms section initially
        if (synonymsAntonymsSection) {
            synonymsAntonymsSection.style.display = 'none';
        }
        
        // Reset slider controls
        tooltip.querySelector('.definition-info').textContent = '1/1';
        tooltip.querySelector('.translation-info').textContent = '1/1';
        tooltip.querySelector('.definition-prev').disabled = true;
        tooltip.querySelector('.definition-next').disabled = true;
        tooltip.querySelector('.translation-prev').disabled = true;
        tooltip.querySelector('.translation-next').disabled = true;
        
        // Update the word title
        const wordTitle = tooltip.querySelector('.word-title');
        if (wordTitle) {
            wordTitle.textContent = selectedText;
        }
    }

    // Helper function to setup initial tooltip display
    function setupTooltipDisplay(x, y) {
        // Position and show tooltip
        tooltip.style.display = 'block';
        positionTooltip(tooltip, x, y);

        // Set initial loading heights to prevent jumpy animations
        const defLoadingContainer = tooltip.querySelector('.definition-section .content-container');
        const transLoadingContainer = tooltip.querySelector('.translation-section .content-container');
        if (defLoadingContainer) smoothHeightTransition(defLoadingContainer, 60, true); // Loading state height
        if (transLoadingContainer) smoothHeightTransition(transLoadingContainer, 80, true); // Loading state height
        
        // Trigger show animation on next frame
        requestAnimationFrame(() => {
            if (tooltip) {
                tooltip.classList.add('show');
            }
        });
    }

    // Helper function to handle definition fetching and rendering
    async function handleDefinitionFetch(selectedText) {
        try {
            const result = await fetchDefinition(selectedText);
            definitionData = result;
            const definitionSlider = tooltip.querySelector('.definition-slider');
            
            // Create pages
            let pagesHtml = '';
            result.pages.forEach((page, pageIndex) => {
                let pageHtml = '<div class="content-page">';
                
                // Add definitions
                page.forEach(def => {
                    pageHtml += `
                        <div class="definition-item">
                            <span class="part-of-speech">${def.partOfSpeech}</span>
                            <div class="definition-text">${def.definition}</div>
                            ${def.example ? `<div class="example">"${def.example}"</div>` : ''}
                        </div>
                    `;
                });
                
                pageHtml += '</div>';
                pagesHtml += pageHtml;
            });
            
            definitionSlider.innerHTML = pagesHtml;
            
            // Handle synonyms and antonyms in separate section
            const synonymsAntonymsSection = tooltip.querySelector('.synonyms-antonyms-section');
            const synonymsAntonymsContent = tooltip.querySelector('.synonyms-antonyms-content');
            
            if (result.synonyms.length > 0 || result.antonyms.length > 0) {
                let synonymsAntonymsHtml = '<div class="synonyms-antonyms">';
                
                if (result.synonyms.length > 0) {
                    synonymsAntonymsHtml += `
                        <div class="synonyms">
                            <span class="synonyms-label">Synonyms:</span> 
                            <span class="synonyms-list">${result.synonyms.join(', ')}</span>
                        </div>
                    `;
                }
                
                if (result.antonyms.length > 0) {
                    synonymsAntonymsHtml += `
                        <div class="antonyms">
                            <span class="antonyms-label">Antonyms:</span> 
                            <span class="antonyms-list">${result.antonyms.join(', ')}</span>
                        </div>
                    `;
                }
                
                synonymsAntonymsHtml += '</div>';
                synonymsAntonymsContent.innerHTML = synonymsAntonymsHtml;
                synonymsAntonymsSection.style.display = 'block';
            } else {
                synonymsAntonymsSection.style.display = 'none';
            }
            
            // Measure each page's natural height for caching
            definitionPageHeights = Array.from(definitionSlider.children).map(page => {
                return measurePageHeight(page);
            });
            
            // Track successful word lookup
            incrementWordsLearned();
            
            // Smooth transition to final height with slight delay for better visual flow
            updateDefinitionSlider(true);
            
            // Staggered transition for smoother feel
            setTimeout(() => {
                setContainerHeightFromCache('definition', false);
            }, 50);
        } catch (error) {
            const definitionSlider = tooltip.querySelector('.definition-slider');
            definitionSlider.innerHTML = `<div class="content-page"><span class="error">${error}</span></div>`;
            definitionPageHeights = [40]; // Fixed height for error state
            updateDefinitionSlider(true);
            
            // Smooth transition to error state height with delay
            setTimeout(() => {
                setContainerHeightFromCache('definition', false);
            }, 50);
            
            // Hide synonyms/antonyms section on error
            const synonymsAntonymsSection = tooltip.querySelector('.synonyms-antonyms-section');
            if (synonymsAntonymsSection) {
                synonymsAntonymsSection.style.display = 'none';
            }
        }
    }

    // Helper function to handle translation fetching and rendering
    async function handleTranslationFetch(selectedText) {
        try {
            const result = await fetchTranslation(selectedText);
            translationData = result;
            const translationSlider = tooltip.querySelector('.translation-slider');
            
            // Create pages with grid layout
            let pagesHtml = '';
            result.pages.forEach((page, pageIndex) => {
                let pageHtml = '<div class="content-page">';
                pageHtml += '<div class="translation-grid">';
                
                page.forEach(translation => {
                    pageHtml += `<div class="translation-text">${translation}</div>`;
                });
                
                // Fill empty grid cells if needed (for consistent 2x2 layout)
                const emptyCells = CONFIG.translationsPerPage - page.length;
                for (let i = 0; i < emptyCells; i++) {
                    pageHtml += '<div class="translation-text" style="opacity: 0; pointer-events: none;"></div>';
                }
                
                pageHtml += '</div>';
                pageHtml += '</div>';
                pagesHtml += pageHtml;
            });
            
            translationSlider.innerHTML = pagesHtml;
            
            // Measure each page's natural height for caching  
            translationPageHeights = Array.from(translationSlider.children).map(page => {
                return measurePageHeight(page);
            });
            
            // Smooth transition to final height with slight delay for better visual flow
            updateTranslationSlider(true);
            
            // Staggered transition for smoother feel
            setTimeout(() => {
                setContainerHeightFromCache('translation', false);
            }, 100); // Slightly longer delay for translation to create nice flow
        } catch (error) {
            const translationSlider = tooltip.querySelector('.translation-slider');
            translationSlider.innerHTML = `<div class="content-page"><span class="error">${error}</span></div>`;
            translationPageHeights = [40]; // Fixed height for error state
            updateTranslationSlider(true);
            
            // Smooth transition to error state height with delay
            setTimeout(() => {
                setContainerHeightFromCache('translation', false);
            }, 100);
        }
    }
    
    // Show tooltip with content (refactored for better modularity)
    function showTooltip(selectedText, x, y) {
        // Cancel any active requests from previous selections
        cancelActiveRequests();
        
        // Initialize tooltip content
        initializeTooltipContent(selectedText);
        
        // Setup tooltip display
        setupTooltipDisplay(x, y);

        // Fetch definition and translation in parallel
        handleDefinitionFetch(selectedText);
        handleTranslationFetch(selectedText);
    }

    // Position tooltip near selection
    function positionTooltip(tooltip, x, y) {
        // Use requestAnimationFrame for smooth positioning
        requestAnimationFrame(() => {
            const rect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Add comfortable margins from screen edges
            const margin = 20;
            const maxWidth = viewportWidth - (margin * 2);
            const maxHeight = viewportHeight - (margin * 2);
            
            let left = x + 10;
            let top = y - rect.height - 10;
            
            // Adjust if tooltip goes off screen horizontally
            if (left + rect.width > viewportWidth - margin) {
                left = x - rect.width - 10;
            }
            
            // Adjust if tooltip goes off screen vertically
            if (top < margin) {
                top = y + 20;
            }
            
            // Ensure tooltip stays within comfortable bounds (not snapped to edges)
            left = Math.max(margin, Math.min(left, viewportWidth - rect.width - margin));
            top = Math.max(margin, Math.min(top, viewportHeight - rect.height - margin));
            
            tooltip.style.left = left + window.scrollX + 'px';
            tooltip.style.top = top + window.scrollY + 'px';
        });
    }

    // Hide tooltip
    function hideTooltip() {
        if (tooltip) {
            tooltip.classList.remove('show');
            // Hide completely after animation
            setTimeout(() => {
                if (tooltip && !tooltip.classList.contains('show')) {
                    tooltip.style.display = 'none';
                    // Clear DOM cache when tooltip is hidden
                    clearDOMCache();
                }
            }, 300); // Match new transition duration
        }
    }

    function hideTriggerIcon() {
        if (triggerIcon) {
            triggerIcon.classList.remove('show');
            // Hide completely after animation
            setTimeout(() => {
                if (triggerIcon && !triggerIcon.classList.contains('show')) {
                    triggerIcon.style.display = 'none';
                }
            }, 250); // Match new transition duration
        }
    }

    // Show trigger icon on selection
    function showTriggerIcon(x, y) {
        if (!triggerIcon) {
            triggerIcon = createTriggerIcon();
            
            if (!triggerIcon) {
                console.log('Failed to create trigger icon');
                return;
            }
            
            // Add click event listener
            triggerIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                if (currentSelection) {
                    const rect = triggerIcon.getBoundingClientRect();
                    showTooltip(currentSelection, rect.left, rect.top);
                }
            });
        }
        
        // Position first, then show with animation
        positionTriggerIcon(triggerIcon, x, y);
        triggerIcon.style.display = 'block';
        
        // Trigger animation on next frame
        requestAnimationFrame(() => {
            if (triggerIcon) {
                triggerIcon.classList.add('show');
            }
        });
    }

    /**
     * Enhanced input sanitization and validation function
     * @param {string} text - The text to sanitize and validate
     * @returns {Object} - Object with valid boolean, sanitized text, and error message
     */
    function sanitizeAndValidateText(text) {
        if (!text || typeof text !== 'string') {
            return { valid: false, sanitized: '', error: createErrorMessage('INVALID_INPUT') };
        }
        
        // Basic sanitization
        let sanitized = text.trim();
        
        // Remove dangerous characters and control characters
        sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, ''); // Remove control characters
        sanitized = sanitized.replace(/[<>'"&]/g, ''); // Remove HTML special characters
        
        // Length validation
        if (sanitized.length === 0) {
            return { valid: false, sanitized: '', error: createErrorMessage('INVALID_INPUT') };
        }
        
        if (sanitized.length > 100) {
            return { valid: false, sanitized: '', error: createErrorMessage('INVALID_INPUT') };
        }
        
        // Word count validation
        const words = sanitized.split(/\s+/).filter(word => word.length > 0);
        if (words.length > 5) {
            return { valid: false, sanitized: '', error: createErrorMessage('INVALID_INPUT') };
        }
        
        // Content validation - Simple check that works across all userscript environments
        // Allow word characters, spaces, common punctuation, and basic Unicode ranges
        if (!/^[\w\u00C0-\u024F\u0300-\u036F\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0E00-\u0E7F\u0F00-\u0FFF\u1000-\u109F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF\u200c\u200d\s\-\'\.\,\;\:\!\?]+$/.test(sanitized)) {
            return { valid: false, sanitized: '', error: createErrorMessage('INVALID_INPUT') };
        }
        
        // Exclude pure numbers
        if (/^\d+$/.test(sanitized)) {
            return { valid: false, sanitized: '', error: createErrorMessage('INVALID_INPUT') };
        }
        
        // Must contain at least one letter (basic check for common scripts)
        if (!/[a-zA-Z\u00C0-\u024F\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0E00-\u0E7F\u0F00-\u0FFF\u1000-\u109F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/.test(sanitized)) {
            return { valid: false, sanitized: '', error: createErrorMessage('INVALID_INPUT') };
        }
        
        return { valid: true, sanitized: sanitized, error: null };
    }

    // Handle text selection
    function handleSelection() {
        const selection = window.getSelection();
        const selectedText = selection.toString();
        
        // Enhanced input validation
        const validation = sanitizeAndValidateText(selectedText);
        
        if (validation.valid && validation.sanitized !== currentSelection) {
            currentSelection = validation.sanitized;
            
            // Store selection range for positioning
            if (selection.rangeCount > 0) {
                selectionRange = selection.getRangeAt(0);
            }
            
            // Show trigger icon immediately for better perceived performance
            if (selectionRange) {
                try {
                    const rect = selectionRange.getBoundingClientRect();
                    const x = rect.left + (rect.width / 2);
                    const y = rect.top;
                    showTriggerIcon(x, y);
                } catch (e) {
                    console.log('Error positioning trigger icon:', e);
                }
            }
        } else if (!selectedText || !validation.valid) {
            currentSelection = '';
            selectionRange = null;
            hideTooltip();
            hideTriggerIcon();
        }
    }

    // Event listeners
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);
    
    // Add mobile touch support
    document.addEventListener('touchend', function(e) {
        // Small delay to let selection stabilize on mobile
        setTimeout(handleSelection, 100);
    });
    
    // Handle selection changes (for mobile long-press selections)
    document.addEventListener('selectionchange', function() {
        // Only handle if this is likely a user-initiated selection
        if (document.hasFocus()) {
            setTimeout(handleSelection, 150);
        }
    });
    
    // Hide tooltip when clicking outside or pressing Esc
    document.addEventListener('click', function(e) {
        if (tooltip && !tooltip.contains(e.target) && 
            triggerIcon && !triggerIcon.contains(e.target) &&
            (!settingsMenu || !settingsMenu.contains(e.target)) &&
            window.getSelection().toString().trim() === '') {
            hideTooltip();
            hideTriggerIcon();
        }
        
        // Close settings menu when clicking outside
        if (settingsMenu && !settingsMenu.contains(e.target)) {
            hideSettingsMenu();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (settingsMenu) {
                hideSettingsMenu();
            } else {
                hideTooltip();
                hideTriggerIcon();
            }
        }
    });

    // Prevent tooltip from interfering with text selection
    document.addEventListener('selectstart', function(e) {
        if ((tooltip && tooltip.contains(e.target)) || 
            (triggerIcon && triggerIcon.contains(e.target)) ||
            (settingsMenu && settingsMenu.contains(e.target))) {
            e.preventDefault();
        }
    });

    // Cleanup function to remove event listeners and prevent memory leaks
    function cleanup() {
        // Cancel any active API requests
        cancelActiveRequests();
        
        // Clear timeouts
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
            resizeTimeout = null;
        }
        
        // Clear DOM cache
        clearDOMCache();
        
        // Remove elements
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
        if (triggerIcon) {
            triggerIcon.remove();
            triggerIcon = null;
        }
        if (settingsMenu) {
            hideSettingsMenu();
        }
        
        // Save cache one final time
        saveCache();
    }
    
    // Listen for page unload to cleanup
    window.addEventListener('beforeunload', cleanup);

    console.log('WordGlance userscript loaded! Select text and click the 📖 icon to see definitions and translations.');
    
    // Final initialization complete
    console.log(`WordGlance v2.1.0 initialized with:
    - ${Object.keys(LANGUAGES).length} supported languages
    - ${CONFIG.cacheSize} item cache per type
    - ${CONFIG.rateLimitPerMinute} requests/minute rate limit
    - Enhanced performance optimizations`);
})();
