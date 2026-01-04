// ==UserScript==
// @name         GeoGuessr Liked Maps Advanced Overhaul (LMAO)
// @namespace    https://github.com/schnador/
// @version      1.1.0
// @description  Adds organization to liked maps on GeoGuessr. Add tags and filter them. Integrates with Learnable Meta!
// @author       snador
// @license      GNU GPLv3
// @icon         https://github.com/schnador/geoguessr-lmao/raw/main/img/lmao_icon.png
// @match        https://www.geoguessr.com/*
// @connect      learnablemeta.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543001/GeoGuessr%20Liked%20Maps%20Advanced%20Overhaul%20%28LMAO%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543001/GeoGuessr%20Liked%20Maps%20Advanced%20Overhaul%20%28LMAO%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- STYLE INJECTION ---
  ((css) => {
    if (typeof GM_addStyle === 'function') {
      GM_addStyle(css);
    } else {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    }
  })(`
    .lmao-full-width-container {
      width: 100%;
      min-width: 100%;
      margin: 0;
    }
    .lmao-likes-container {
      flex: 1;
      min-width: 0;
    }
    .lmao-map-teaser_tag {
      border: .0625rem solid var(--ds-color-white-40);
      border-radius: .3125rem;
      font-size: .8125rem;
      font-style: italic;
      line-height: .875rem;
      padding: .125rem .5rem .25rem;
      text-transform: capitalize;
      background: rgba(0,0,0,0.2);
      max-height: 25px;
    }
    .lmao-map-teaser_tag.api-tag {
      color: var(--ds-color-white-60);
      border-color: var(--ds-color-white-40);
      background: rgba(0,0,0,0.2);
    }
    .lmao-map-teaser_tag.user-tag {
      color: #fff;
      border-color: var(--ds-color-blue-80);
      background: color-mix(in srgb, var(--ds-color-blue-50) 50%, transparent);
    }
    .lmao-map-teaser_tag.lmao-learnable-meta {
      border-color: var(--ds-color-green-80);
      background: color-mix(in srgb, var(--ds-color-green-70) 50%, transparent);
    }
    .lmao-map-teaser_tag.lmao-region {
      border-color: var(--ds-color-green-80);
      background: color-mix(in srgb, var(--ds-color-green-80) 50%, transparent);
    }
    .lmao-tag-remove-btn {
      margin-left: 0.2em;
      font-size: 1em;
      color: #ffffff;
      cursor: pointer;
      background: transparent;
      border: none;
      padding: 0 0.2em;
    }
    .lmao-tag-input {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background: 0.75rem;
      border: 0;
      border-radius: .5rem;
      box-shadow: inset 0 0 0.0625rem 0 hsla(0, 0%, 100%, .9);
      box-sizing: border-box;
      color: #fff;
      font-family: var(--default-font);
      font-size: 0.875rem;
      outline: none;
      padding: 0.75rem 0.75rem;
      resize: none;
      width: auto;
      max-height: 25px;
      display: block;
      margin-top: 0.25em;
      flex-basis: 100%;
      margin-right: 2rem;
    }
    .lmao-controls {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 15rem;
      min-width: 15rem;
      background: rgb(16 16 28/80%);
      padding: 1em;
      z-index: 1000;
      border-radius: 1rem;
      height: min-content;
      position: sticky;
      top: 2rem;
      max-height: calc(100vh - 4rem);
      overflow-y: auto;
      overflow-x: visible;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      margin-right: 1rem;
      flex-shrink: 0;
    }
    .lmao-collapsible-tag-group {
      margin-bottom: 0.5rem;
    }
    .lmao-collapsible-header {
      font-size: var(--font-size-16);
      font-weight: bold;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
    }
    .lmao-collapsible-arrow {
      margin-right: 0.3em;
    }
    .lmao-collapsible-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      margin-left: 0.25rem;
      margin-top: 0.5rem;
    }
    .lmao-collapsible-tags.lmao-collapsed {
      display: none;
    }
    .lmao-tag-chip {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
      border: 1px solid transparent;
      position: relative;
    }
    .lmao-tag-chip:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      opacity: 1 !important;
    }
    .lmao-tag-chip.selected {
      border-color: rgb(255, 255, 255);
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
    }
    .lmao-tag-chip:not(.selected) {
      opacity: 0.5;
    }
    .lmao-tag-chip.user-tag {
      background: color-mix(in srgb, var(--ds-color-blue-50) 50%, transparent);
      color: #fff;
    }
    .lmao-tag-chip.api-tag {
      background: rgba(0,0,0,0.2);
      color: var(--ds-color-white-60);
    }
    .lmao-tag-chip.meta-tag {
      background: color-mix(in srgb, var(--ds-color-green-70) 50%, transparent);
      color: #fff;
    }
    .lmao-tag-chip.region-tag {
      background: color-mix(in srgb, var(--ds-color-green-80) 50%, transparent);
      color: #fff;
    }
    .lmao-tag-chip.dragging {
      opacity: 0.5;
      transform: rotate(3deg);
      z-index: 1000;
    }
    .lmao-tag-chip.drag-over {
      border-color: var(--ds-color-purple-60);
      background: color-mix(in srgb, var(--ds-color-purple-50) 30%, transparent);
    }
    .lmao-tag-chip.edit-mode {
      cursor: grab;
    }
    .lmao-tag-chip.edit-mode:active {
      cursor: grabbing;
    }
    .lmao-drag-handle {
      margin-right: 0.25rem;
      opacity: 0.6;
      font-size: 0.6rem;
    }
    .lmao-collapsible-tag-label {
      margin: 0.2em 0;
    }
    .lmao-tag-visibility-toggles {
      display: flex;
      flex-direction: column;
      gap: 0.2em;
    }
    .lmao-controls-header {
      margin-top: 0.75rem;
      margin-bottom: 0.25rem;
      font-size: var(--font-size-18);
    }
    .lmao-checkbox-input {
      border: .0625rem solid #ddd;
      box-sizing: border-box;
      outline: none;
      padding: .625rem;
    }
    .lmao-checkbox-mark {
      background: var(--ds-color-purple-100);
      border-radius: .25rem;
      box-shadow: var(--shadow-1);
      left: 0;
      top: 0;
      border: .0625rem solid var(--ds-color-white-20);
    }
    .lmao-loading-indicator {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2em;
      width: 100%;
    }
    .lmao-loading-indicator-text {
      font-size: 1.25em;
    }
    .map-teaser_mapTitleAndTags__iiqiz {
      padding-right: 0.125rem;
    }
    .lmao-settings-button {
      background: var(--ds-color-purple-100);
      border: 1px solid var(--ds-color-white-20);
      border-radius: 0.25rem;
      color: white;
      cursor: pointer;
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
      margin-top: 0.5rem;
      width: 100%;
    }
    .lmao-settings-button:hover {
      background: var(--ds-color-purple-80);
    }
    .lmao-file-input {
      display: none;
    }
    .lmao-clear-filters-button {
      background: var(--ds-color-red-100);
      border: 1px solid var(--ds-color-white-20);
      border-radius: 0.25rem;
      color: white;
      cursor: pointer;
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
      margin-top: 0.5rem;
      margin-bottom: 1rem;
      width: 100%;
    }
    .lmao-clear-filters-button:hover {
      background: var(--ds-color-red-80);
    }
    .lmao-default-bottom-margin {
      margin-bottom: 0.5rem;
    }
    .lmao-no-left-margin {
      margin-left: 0;
    }
    .lmao-header-controls {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      z-index: 1000;
    }
    .lmao-header-button {
      background: var(--ds-color-purple-100);
      border: 1px solid var(--ds-color-white-20);
      border-radius: 0.25rem;
      color: white;
      cursor: pointer;
      font-size: 0.75rem;
      padding: 0.375rem 0.5rem;
      white-space: nowrap;
    }
    .lmao-header-button:hover {
      background: var(--ds-color-purple-80);
    }
    .lmao-header-button.lmao-clear-button {
      background: var(--ds-color-purple-100);
    }
    .lmao-header-button.lmao-clear-button:hover {
      background: var(--ds-color-red-80);
    }
    .lmao-header-button.lmao-help-button {
      background: var(--ds-color-purple-100);
    }
    .lmao-header-button.lmao-help-button:hover {
      background: var(--ds-color-purple-80);
    }
    .lmao-header-search-placeholder {
      width: 200px;
      height: 32px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.25rem;
      border: 1px solid var(--ds-color-white-20);
      opacity: 0.5;
    }
    .lmao-header-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-left: auto;
    }
    .lmao-settings-dropdown {
      position: relative;
      display: inline-block;
    }
    .lmao-settings-dropdown-content {
      display: none;
      position: absolute;
      right: 0;
      background: rgb(16 16 28/95%);
      min-width: 160px;
      border-radius: 0.5rem;
      border: 1px solid var(--ds-color-white-20);
      z-index: 1001;
      backdrop-filter: blur(10px);
    }
    .lmao-settings-dropdown-content.show {
      display: block;
    }
    .lmao-settings-dropdown-item {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 0.875rem;
      padding: 0.75rem 1rem;
      width: 100%;
      text-align: left;
      border-radius: 0;
    }
    .lmao-settings-dropdown-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .lmao-settings-dropdown-item:first-child {
      border-radius: 0.5rem 0.5rem 0 0;
    }
    .lmao-settings-dropdown-item:last-child {
      border-radius: 0 0 0.5rem 0.5rem;
    }
    .lmao-header-wrapper {
      display: flex !important;
      align-items: center !important;
      width: 100% !important;
      margin-bottom: 1rem !important;
      position: relative;
      justify-content: space-between;
    }
    .lmao-header-wrapper h1[class*="headline_heading__"] {
      margin: 0 !important;
      white-space: nowrap;
    }
    .lmao-header-wrapper .lmao-header-actions {
      margin-left: auto;
      flex-shrink: 0;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      z-index: 1;
    }
    .lmao-header-actions .lmao-header-button {
      white-space: nowrap;
      font-size: 1rem;
      padding: 0.5rem;
      min-width: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Tooltip styling */
    .lmao-tooltip {
      position: relative;
      display: inline-block;
    }
    .lmao-tooltip-text {
      visibility: hidden;
      width: auto;
      min-width: 120px;
      max-width: 250px;
      background-color: rgba(0, 0, 0, 0.9) !important;
      color: #fff !important;
      text-align: center;
      border-radius: 6px;
      padding: 8px 12px;
      position: fixed;
      z-index: 10001;
      opacity: 0;
      transition: opacity 0.3s;
      font-size: 0.75rem !important;
      white-space: pre-wrap;
      word-wrap: break-word;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      line-height: 1.4;
      font-family: var(--default-font) !important;
    }
    .lmao-controls-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.75rem;
      margin-bottom: 0.25rem;
      font-size: var(--font-size-18);
    }
    .lmao-controls-header .lmao-icon {
      font-size: 1rem;
      opacity: 0.8;
    }
    .lmao-edit-toggle {
      background: var(--ds-color-purple-100);
      border: 1px solid var(--ds-color-white-20);
      border-radius: 0.25rem;
      color: white;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.5rem;
      width: auto;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lmao-edit-toggle:hover {
      background: var(--ds-color-purple-80);
    }
    .lmao-edit-toggle.active {
      background: var(--ds-color-green-80);
      border-color: var(--ds-color-green-70);
    }
    .lmao-edit-toggle.active:hover {
      background: var(--ds-color-green-70);
    }
    .lmao-tooltip label {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      transition: background-color 0.2s;
    }
    .lmao-tooltip label:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    /* Help Popup Styles */
    .lmao-help-popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgb(16 16 28/95%);
      border: 1px solid var(--ds-color-white-20);
      border-radius: 0.75rem;
      padding: 1.5rem;
      max-width: 500px;
      width: 90%;
      z-index: 10002;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    }
    .lmao-help-popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--ds-color-white-20);
    }
    .lmao-help-popup-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
      margin: 0;
    }
    .lmao-help-popup-close {
      background: transparent;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
    }
    .lmao-help-popup-close:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .lmao-help-popup-content {
      color: white;
      line-height: 1.6;
    }
    .lmao-help-popup-section {
      margin-bottom: 1rem;
    }
    .lmao-help-popup-section h3 {
      color: var(--ds-color-blue-80);
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
    }
    .lmao-help-popup-section p {
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
    }
    .lmao-help-popup-links {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--ds-color-white-20);
    }
    .lmao-help-popup-links a {
      color: var(--ds-color-blue-80);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border: 1px solid var(--ds-color-blue-80);
      border-radius: 0.25rem;
      transition: all 0.2s;
    }
    .lmao-help-popup-links a:hover {
      background: var(--ds-color-blue-80);
      color: white;
    }
    .lmao-help-popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 10001;
    }
    .lmao-small-clear-button {
      background: var(--ds-color-red-100);
      border: 1px solid var(--ds-color-white-20);
      border-radius: 0.25rem;
      color: white;
      cursor: pointer;
      font-size: 0.75rem;
      padding: 0.25rem 0.375rem;
      min-width: auto;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 0.5rem;
    }
    .lmao-small-clear-button:hover {
      background: var(--ds-color-red-80);
    }

    /* Search Panel Styles */
    .lmao-search-panel {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.25rem;
      border: 1px solid var(--ds-color-white-20);
      overflow: visible; /* Changed from hidden to visible */
      min-width: 300px;
      max-width: 400px;
      flex: 1;
      transition: border-color 0.2s ease;
    }
    @media (max-width: 768px) {
      .lmao-search-panel {
        min-width: 250px;
        max-width: 300px;
      }
    }
    .lmao-search-dropdown {
      background: var(--ds-color-purple-100);
      border: none;
      color: white;
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      white-space: nowrap;
      border-radius: 0;
      min-width: 80px;
      border-right: 1px solid var(--ds-color-white-20);
    }
    .lmao-search-dropdown:hover {
      background: var(--ds-color-purple-80);
    }
    .lmao-search-input {
      flex: 1;
      background: transparent;
      border: none;
      color: white;
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
      outline: none;
      min-width: 0;
    }
    .lmao-search-input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    .lmao-search-clear {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      font-size: 1rem;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
    }
    .lmao-search-clear:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }
    .lmao-search-dropdown-menu {
      position: fixed; /* Changed to fixed since it's appended to body */
      background: rgb(16 16 28/95%);
      border: 1px solid var(--ds-color-white-20);
      border-radius: 0.25rem;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      z-index: 10002 !important;
      min-width: 150px;
      backdrop-filter: blur(10px);
      display: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .lmao-search-dropdown-menu.show {
      display: block !important;
    }
    .lmao-search-dropdown-item {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 0.875rem;
      padding: 0.75rem 1rem;
      text-align: left;
      border-radius: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      user-select: none;
    }
    .lmao-search-dropdown-item input[type="checkbox"] {
      accent-color: var(--ds-color-purple-100);
      margin: 0;
      margin-right: 0.5rem;
    }
    .lmao-search-dropdown-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .lmao-search-dropdown-item:first-child {
      border-radius: 0;
    }
    .lmao-search-dropdown-item:last-child {
      border-radius: 0 0 0.25rem 0.25rem;
    }
    .lmao-search-icon {
      font-size: 0.875rem;
      opacity: 0.8;
    }
    .lmao-map-counter {
      margin: 0;
      margin-right: 0.5rem;
      margin-left: auto;
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--ds-color-white-100);
    }
    .lmao-heading-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
    }
  `);

  var _GM_xmlhttpRequest = /* @__PURE__ */ (() =>
    typeof GM_xmlhttpRequest != 'undefined' ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() =>
    typeof unsafeWindow != 'undefined' ? unsafeWindow : void 0)();

  // --- CONFIGURATION OBJECT ---
  /**
   * Central configuration for LMAO userscript.
   */
  const CONFIG = {
    version: GM_info.script.version ? GM_info.script.version : 'unknown',
    features: {
      debugMode: true,
      logLevel: 'INFO' // Default log level: TRACE, DEBUG, INFO, WARN, ERROR
    }
    // validPaths: ['/me/likes', '/maps/community'],
    // validTabs: [undefined, 'liked-maps']
  };

  // --- LOG LEVELS ---
  const LOG_LEVELS = {
    TRACE: 0, // Most verbose - DOM finding, detailed operations
    DEBUG: 1, // General debugging info
    INFO: 2, // Important information
    WARN: 3, // Warnings
    ERROR: 4 // Errors only
  };

  // Convenient object for cleaner debugLog calls: debugLog(LogLevel.DEBUG, ...)
  const LogLevel = {
    TRACE: 'TRACE',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
  };

  const TagCategory = {
    USER: 'user',
    REGION: 'region',
    API: 'api',
    LEARNABLE_META: 'learnableMeta'
  };

  /**
   * Maps category string to TagCategory constant
   * @param {string} category - Category string ('user', 'region', 'api', 'learnableMeta')
   * @returns {string} TagCategory constant
   */
  function getTagCategory(category) {
    switch (category) {
      case 'user':
        return TagCategory.USER;
      case 'region':
        return TagCategory.REGION;
      case 'api':
        return TagCategory.API;
      case 'learnableMeta':
        return TagCategory.LEARNABLE_META;
      default:
        return TagCategory.USER;
    }
  }

  /**
   * Gets the current log level from CONFIG object.
   * @returns {number} Current log level
   */
  function getCurrentLogLevel() {
    const configLevel = CONFIG.features.logLevel;
    if (configLevel && LOG_LEVELS.hasOwnProperty(configLevel)) {
      return LOG_LEVELS[configLevel];
    }
    return LOG_LEVELS.INFO; // Default log level
  }

  /**
   * Helper function to set the log level for debugging.
   * Updates the CONFIG object and saves it to lmaoDevConfig localStorage.
   * Call this from the browser console to change log level.
   * @param {string} level - One of: LogLevel.TRACE, LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR
   * @example
   * // In browser console:
   * setLMAOLogLevel(LogLevel.DEBUG)  // Show debug and higher
   * setLMAOLogLevel(LogLevel.TRACE)  // Show all logs (most verbose)
   * setLMAOLogLevel(LogLevel.ERROR)  // Show only errors
   */
  function setLMAOLogLevel(level) {
    if (!LOG_LEVELS.hasOwnProperty(level)) {
      console.error('[LMAO] Invalid log level. Available levels:', Object.keys(LOG_LEVELS));
      return;
    }
    try {
      CONFIG.features.logLevel = level;
      saveDevConfig();
      console.info(`[LMAO] Log level set to: ${level} (${LOG_LEVELS[level]})`);
    } catch (e) {
      console.error('[LMAO] Failed to set log level:', e);
    }
  }

  // Make the function available globally for console access
  if (typeof _unsafeWindow !== 'undefined' && _unsafeWindow) {
    _unsafeWindow.setLMAOLogLevel = setLMAOLogLevel;
  } else {
    window.setLMAOLogLevel = setLMAOLogLevel;
  }

  /**
   * Debug logger for LMAO with log levels. Uses console methods based on log level.
   * @param {string} level - Log level: LogLevel.TRACE, LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR
   * @param {...any} args - Arguments to log
   * @example
   * debugLog(LogLevel.TRACE, 'Finding DOM element');
   * debugLog(LogLevel.ERROR, 'Failed to fetch data', error);
   * // Legacy string syntax still works:
   * debugLog(LogLevel.DEBUG, 'Some debug info');
   */
  function debugLog(level, ...args) {
    if (!CONFIG.features.debugMode) return;

    const currentLevel = getCurrentLogLevel();
    const messageLevel = LOG_LEVELS[level] || LOG_LEVELS.DEBUG;

    // Only log if message level is >= current log level
    if (messageLevel < currentLevel) return;

    // Get the calling function name from the stack
    const stack = new Error().stack;
    let fnName = 'unknown';
    if (stack) {
      const lines = stack.split('\n');
      // The third line is usually the caller (first is Error, second is debugLog)
      if (lines.length > 2) {
        const match = lines[2].match(/at (\w+)/);
        if (match) fnName = match[1];
      }
    }

    const prefix = `[LMAO] ${level} ${fnName}:`;

    // Use appropriate console method based on log level
    switch (level) {
      case LogLevel.ERROR:
        console.error(prefix, ...args);
        break;
      case LogLevel.WARN:
        console.warn(prefix, ...args);
        break;
      case LogLevel.INFO:
        console.info(prefix, ...args);
        break;
      case LogLevel.DEBUG:
      case LogLevel.TRACE:
      default:
        console.log(prefix, ...args);
        break;
    }
  }

  // --- CONSTANTS & LOCALSTORAGE KEYS ---
  const LOCALSTORAGE_INTERNAL_CONFIG = 'lmaoDevConfig';
  const LOCALSTORAGE_USER_TAGS_KEY = 'lmaoUserTags';
  const LOCALSTORAGE_ADDITIONAL_MAP_INFO = 'lmaoAdditionalMapInfo';
  const LOCALSTORAGE_STATE_KEY = 'lmaoState';
  const LOCALSTORAGE_GEOMETA_PREFIX = 'geometa:map-info:';
  const USER_TAG_CLASS = 'lmao-map-teaser_tag user-tag';
  const API_TAG_CLASS = 'lmao-map-teaser_tag api-tag';

  // Load dev config at startup
  loadDevConfig();

  // --- GLOBAL STATE ---
  const AppState = {
    maps: [],
    userTagsList: [],
    apiTagsList: [],
    metaTagsList: [],
    selectedTags: {
      userTags: [],
      regionTags: [],
      apiTags: [],
      learnableMeta: false
    },
    currentUserTags: {},
    tagVisibility: {},
    filterCollapse: {},
    filterMode: 'ALL',
    editMode: false,
    learnableMetaCache: new Set(),
    metaRegionCache: {},
    controlsDiv: null,
    searchQuery: '',
    searchCriteria: {},
    tagOrder: {}, // Will store tag order for each category

    // State management methods
    updateSelectedTags(newTags) {
      this.selectedTags = newTags;
      saveSelectedTags(this.selectedTags);
      this.rebuildControls();
      this.rerender();
    },

    updateTagVisibility(newVisibility) {
      this.tagVisibility = { ...newVisibility };
      saveTagVisibility(this.tagVisibility);
      this.rerender();
    },

    updateFilterCollapse(newCollapse) {
      this.filterCollapse = newCollapse;
      saveFilterCollapse(this.filterCollapse);
      this.rebuildControls();
    },

    updateFilterMode(newMode) {
      this.filterMode = newMode;
      this.rerender();
    },

    updateEditMode(newMode) {
      this.editMode = newMode;
      // Update edit toggle button appearance
      const editToggleBtn = document.querySelector('.lmao-edit-toggle');
      if (editToggleBtn) {
        editToggleBtn.className = 'lmao-edit-toggle' + (newMode ? ' active' : '');
      }
      // Rebuild controls to show/hide drag handles
      this.rebuildControls();
      this.rerender();
    },

    updateSearchQuery(newQuery) {
      this.searchQuery = newQuery;
      this.rerender();
    },

    updateSearchCriteria(newCriteria) {
      this.searchCriteria = [...newCriteria]; // Copy array
      saveSearchCriteria(this.searchCriteria); // Save to localStorage
      // Update dropdown display using shared function
      const dropdown = document.querySelector('.lmao-search-dropdown');
      if (dropdown) {
        updateDropdownDisplay(dropdown, newCriteria);
      }
      // Update placeholder
      const input = document.querySelector('.lmao-search-input');
      if (input) {
        if (newCriteria.length === 0) {
          input.placeholder = 'Select search criteria first...';
        } else if (newCriteria.length === 1) {
          const placeholders = {
            name: 'Search map names...',
            description: 'Search descriptions...',
            creator: 'Search creators...',
            tags: 'Search tags...'
          };
          input.placeholder = placeholders[newCriteria[0]] || 'Search...';
        } else {
          input.placeholder = `Search...`;
        }
      }

      if (window.updateSearchPanelBorder) {
        window.updateSearchPanelBorder();
      }
      this.rerender();
    },

    addUserTag(map, tag) {
      const key = getMapKey(map);
      this.currentUserTags[key] = this.currentUserTags[key] || [];
      this.currentUserTags[key].push(tag);
      saveUserTags(this.currentUserTags);
      this.userTagsList = Array.from(new Set(Object.values(this.currentUserTags).flat())).sort();
      this.rebuildControls();
      this.rerender();
    },

    removeUserTag(map, tag) {
      const key = getMapKey(map);
      this.currentUserTags[key] = (this.currentUserTags[key] || []).filter((t) => t !== tag);
      saveUserTags(this.currentUserTags);
      this.userTagsList = Array.from(new Set(Object.values(this.currentUserTags).flat())).sort();
      this.rebuildControls();
      this.rerender();
    },

    rebuildControls() {
      debugLog(LogLevel.DEBUG, 'Rebuilding controls UI');
      const newControls = createControlsUI();

      // Find the proper container for the sidebar
      // We want to insert it into the likes_map div so it's a sibling of the grid
      const grid = findGridContainer();
      let targetContainer = null;

      if (grid) {
        const likesMapDiv = grid.closest('div[class*="likes_map__"]');
        if (likesMapDiv) {
          targetContainer = likesMapDiv;
          debugLog(LogLevel.DEBUG, 'Using likes_map div as target container');
        }
      }

      if (!targetContainer) {
        targetContainer = findFullHeightContainer();
        debugLog(LogLevel.DEBUG, 'Falling back to main container');
      }

      if (!targetContainer) {
        debugLog(LogLevel.ERROR, 'No suitable container found for sidebar');
        return;
      }

      newControls.id = 'liked-maps-filter-controls';

      if (this.controlsDiv) {
        this.controlsDiv.replaceWith(newControls);
      } else {
        // Insert the sidebar at the beginning of the container
        if (targetContainer.firstChild) {
          targetContainer.insertBefore(newControls, targetContainer.firstChild);
        } else {
          targetContainer.appendChild(newControls);
        }
      }

      this.controlsDiv = newControls;
      debugLog(LogLevel.DEBUG, 'Sidebar inserted successfully');

      // Add header actions
      this.addHeaderActions();
    },

    addHeaderActions() {
      // Check if wrapper already exists
      const existingWrapper = document.querySelector('.lmao-header-wrapper');
      if (existingWrapper) {
        debugLog(LogLevel.DEBUG, 'Header wrapper already exists, skipping');
        return;
      }

      // Find the header area
      const heading = findHeading();
      if (!heading) {
        debugLog(LogLevel.ERROR, 'Heading not found for header actions');
        return;
      }

      // Check if heading is already inside a wrapper (safety check)
      if (heading.closest('.lmao-header-wrapper')) {
        debugLog(LogLevel.DEBUG, 'Heading already in wrapper, skipping');
        return;
      }

      debugLog(LogLevel.DEBUG, 'Found heading, creating header wrapper');

      // Create wrapper div
      const headerWrapper = document.createElement('div');
      headerWrapper.className = 'lmao-header-wrapper';

      // Create map counter
      const mapCounter = document.createElement('h1');
      mapCounter.id = 'lmao-map-counter';
      mapCounter.className = 'lmao-map-counter';

      // Create and add header actions
      const headerActions = createHeaderActions();

      // Remove h1 from its current position and add to wrapper
      const parent = heading.parentElement;
      if (parent) {
        debugLog(LogLevel.DEBUG, 'Creating header wrapper with actions');

        // Insert wrapper where h1 was
        parent.insertBefore(headerWrapper, heading);

        // wrap heading in heading container
        parent.removeChild(heading);
        const headingContainer = document.createElement('div');
        headingContainer.className = 'lmao-heading-container';
        headingContainer.appendChild(mapCounter);
        headingContainer.appendChild(heading);

        headerWrapper.appendChild(headingContainer);

        // Add header actions to wrapper
        headerWrapper.appendChild(headerActions);

        // Update the map counter with initial count
        updateMapCounter();

        debugLog(LogLevel.DEBUG, 'Header wrapper created successfully');
      } else {
        debugLog(LogLevel.ERROR, 'No parent found for heading element');
      }
    },

    rerender() {
      patchTeasersWithControls();
      updateMapCounter();
    }
  };

  // --- UTILS ---
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Updates the dropdown button display based on the current search criteria
   * @param {HTMLElement} dropdownElement - The dropdown button element to update
   * @param {string[]} criteria - Array of selected search criteria
   */
  function updateDropdownDisplay(dropdownElement, criteria) {
    const criteriaIcons = {
      name: '📝',
      description: '📄',
      creator: '👤',
      tags: '🏷️'
    };

    if (criteria.length === 0) {
      dropdownElement.textContent = 'Select criteria...';
    } else if (criteria.length === 1) {
      dropdownElement.textContent = criteriaIcons[criteria[0]] || 'Search';
    } else if (criteria.length === 4) {
      // Show magnifying glass when all criteria are selected
      dropdownElement.textContent = '🔍';
    } else {
      // Show icons for multiple criteria (but not all)
      dropdownElement.innerHTML = '';
      criteria.forEach((criteriaItem, index) => {
        const icon = document.createElement('span');
        icon.textContent = criteriaIcons[criteriaItem] || '?';
        icon.style.marginRight = index < criteria.length - 1 ? '0.25rem' : '0';
        dropdownElement.appendChild(icon);
      });
    }
  }

  /**
   * Checks if a map matches the current search query based on the selected search criteria.
   * @param {Object} map - The map object to check
   * @param {string} query - The search query
   * @param {string[]} criteriaArray - Array of search criteria to check
   * @returns {boolean} - True if the map matches the search query in any of the selected criteria
   */
  function matchesSearchQuery(map, query, criteriaArray) {
    if (!query || query.trim() === '' || !criteriaArray || criteriaArray.length === 0) return true;

    const searchTerm = query.toLowerCase().trim();
    const mapKey = getMapKey(map);

    // Check each selected criteria - if ANY matches, return true
    return criteriaArray.some((criteria) => {
      switch (criteria) {
        case 'name':
          return map.name && map.name.toLowerCase().includes(searchTerm);

        case 'description':
          return map.description && map.description.toLowerCase().includes(searchTerm);

        case 'creator':
          return (
            map.creator && map.creator.nick && map.creator.nick.toLowerCase().includes(searchTerm)
          );

        case 'tags': {
          // Search in all types of tags: user tags, API tags, learnable meta, regions
          const allTags = [...(map.tags || []), ...(AppState.currentUserTags[mapKey] || [])];

          // Add Learnable Meta tag if applicable
          if (isLearnableMetaFromCacheOrLocalStorage(mapKey, AppState.learnableMetaCache)) {
            allTags.push('Learnable Meta');
          }

          // Add region tags if applicable
          if (
            AppState.metaRegionCache &&
            AppState.metaRegionCache[mapKey] &&
            Array.isArray(AppState.metaRegionCache[mapKey].regions)
          ) {
            allTags.push(...AppState.metaRegionCache[mapKey].regions);
          }

          // Add Official tag if applicable
          if (map.isUserMap === false) {
            allTags.push('Official');
          }

          return allTags.some((tag) => tag.toLowerCase().includes(searchTerm));
        }

        default:
          return false;
      }
    });
  }

  function getMapKey(map) {
    return map.id;
  }

  function getMapByTeaserHref(maps, href) {
    const idMatch = href && href.match(/\/maps\/([^/?#]+)/);
    if (!idMatch) return null;
    const mapIdOrSlug = idMatch[1];
    // Try to find by id or by slug
    return maps.find((m) => m.id === mapIdOrSlug || m.slug === mapIdOrSlug) || null;
  }

  /**
   * Loads the dev configuration from localStorage and updates CONFIG object.
   */
  function loadDevConfig() {
    try {
      const saved = _unsafeWindow.localStorage.getItem(LOCALSTORAGE_INTERNAL_CONFIG);
      if (saved) {
        const parsedConfig = JSON.parse(saved);
        // Merge saved config into CONFIG, preserving defaults for missing keys
        if (parsedConfig.features) {
          CONFIG.features = { ...CONFIG.features, ...parsedConfig.features };
        }
        debugLog(LogLevel.DEBUG, 'Loaded dev config from localStorage', CONFIG);
      }
    } catch (e) {
      debugLog(LogLevel.ERROR, 'Failed to load dev config', e);
    }
  }

  function saveDevConfig() {
    try {
      _unsafeWindow.localStorage.setItem(LOCALSTORAGE_INTERNAL_CONFIG, JSON.stringify(CONFIG));
      debugLog(LogLevel.DEBUG, 'Saved dev config to localStorage', CONFIG);
    } catch (e) {
      debugLog(LogLevel.ERROR, 'Failed to save dev config', e);
    }
  }

  /**
   * Fetches map info from the Learnable Meta API.
   * @param {string} url - The API endpoint URL
   * @returns {Promise<Object>} - The map info object
   */
  async function fetchMapInfo(url) {
    debugLog(LogLevel.DEBUG, 'fetching map info from API with URL', url);
    return new Promise((resolve, reject) => {
      if (typeof _GM_xmlhttpRequest !== 'function') {
        console.error('GM_xmlhttpRequest is not available');
        reject(
          'GM_xmlhttpRequest is not available, please use Version 4.0+ of Tampermonkey or Violentmonkey'
        );
        return;
      }
      _GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: (response) => {
          debugLog(LogLevel.TRACE, 'onload', url, response.status);
          if (response.status === 200 || response.status === 404) {
            try {
              const mapInfo = JSON.parse(response.responseText);
              debugLog(LogLevel.DEBUG, 'fetched map info', mapInfo);
              resolve(mapInfo);
            } catch (e) {
              console.error('failed to parse map info response', e);
              reject('Failed to parse response');
            }
          } else {
            console.error('failed to fetch map info', response);
            reject(`HTTP error! status: ${response.status}`);
          }
        },
        onerror: () => {
          console.error('onerror');
          reject('An error occurred while fetching data');
        }
      });
    });
  }

  /**
   * Gets map info from localStorage or Learnable Meta API.
   * @param {string} geoguessrId - The map ID
   * @param {boolean} [forceUpdate=false] - Force API fetch
   * @returns {Promise<Object>} - The map info object
   */
  async function getMapInfo(geoguessrId, forceUpdate = false) {
    const localStorageMapInfoKey = `${LOCALSTORAGE_GEOMETA_PREFIX}${geoguessrId}`;
    if (!forceUpdate) {
      const savedMapInfo = _unsafeWindow.localStorage.getItem(localStorageMapInfoKey);
      if (savedMapInfo) {
        const mapInfoFromLocalStorage = JSON.parse(savedMapInfo);
        debugLog(LogLevel.TRACE, 'loaded from localStorage', mapInfoFromLocalStorage);
        return mapInfoFromLocalStorage;
      }
    }
    const url = `https://learnablemeta.com/api/userscript/map/${geoguessrId}`;
    const mapInfo = await fetchMapInfo(url);
    _unsafeWindow.localStorage.setItem(localStorageMapInfoKey, JSON.stringify(mapInfo));
    return mapInfo;
  }

  /**
   * Fetches and caches Learnable Meta status for a map during initialization.
   * @param {string} mapId - The map ID
   * @returns {Promise<boolean>} - True if Learnable Meta, else false
   */
  async function fetchAndCacheLearnableMeta(mapId) {
    try {
      const mapInfo = await getMapInfo(mapId);
      return mapInfo && mapInfo.mapFound === true;
    } catch (err) {
      debugLog(LogLevel.ERROR, 'Failed to fetch and cache learnable meta', err);
      return false;
    }
  }

  /**
   * Synchronously checks if a map is Learnable Meta using local cache or localStorage.
   * @param {string} mapId - The map ID
   * @param {Set<string>} [learnableMetaCache] - Optional cache set
   * @returns {boolean}
   */
  function isLearnableMetaFromCacheOrLocalStorage(mapId, learnableMetaCache) {
    if (learnableMetaCache && learnableMetaCache.has(mapId)) return true;
    const data = _unsafeWindow.localStorage.getItem(LOCALSTORAGE_GEOMETA_PREFIX + mapId);
    if (!data) return false;
    try {
      const obj = JSON.parse(data);
      debugLog(LogLevel.TRACE, 'loaded from localstorage', obj);
      return obj && obj.mapFound === true;
    } catch (err) {
      debugLog(LogLevel.ERROR, 'Error parsing localStorage data', err);
      return false;
    }
  }

  /**
   * Loads and updates region tags for all Learnable Meta maps at startup.
   * Only fetches regions for maps not present in the cache.
   *
   * @param {string[]} learnableMetaMapIds - Array of GeoGuessr map IDs
   * @returns {Promise<Object<string, string[]>>} Updated region cache
   * @example
   * const cache = await preloadMetaRegions(["abc123", "def456"]);
   * // cache["abc123"] might be ["south america"]
   */
  /**
   * Loads the region tag cache from localStorage.
   * @returns {Object<string, {regions: string[]}>} The region cache object
   */
  function loadMetaRegionCache() {
    try {
      const raw = _unsafeWindow.localStorage.getItem(LOCALSTORAGE_ADDITIONAL_MAP_INFO);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) return parsed;
      return {};
    } catch (e) {
      debugLog(LogLevel.ERROR, 'Failed to load meta region cache', e);
      return {};
    }
  }

  /**
   * Saves the region tag cache to localStorage.
   * @param {Object<string, {regions: string[]}>} cache - The region cache object
   */
  function saveMetaRegionCache(cache) {
    try {
      _unsafeWindow.localStorage.setItem(LOCALSTORAGE_ADDITIONAL_MAP_INFO, JSON.stringify(cache));
    } catch (e) {
      debugLog(LogLevel.ERROR, 'Failed to save meta region cache', e);
    }
  }

  /**
   * Fetches region tags for a map from the Learnable Meta API.
   * @param {string} mapId - The GeoGuessr map ID
   * @returns {Promise<string[]>} Array of region tags (may be empty)
   */
  async function fetchMetaRegionsFromAPI(mapId) {
    const url = `https://learnablemeta.com/api/maps?geoguessrId=${mapId}`;
    debugLog(LogLevel.DEBUG, 'Fetching meta regions from API', url);
    return new Promise((resolve, reject) => {
      if (typeof _GM_xmlhttpRequest !== 'function') {
        reject('GM_xmlhttpRequest is not available');
        return;
      }
      _GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: (response) => {
          if (response.status === 200) {
            try {
              const responseData = JSON.parse(response.responseText);
              const data = responseData[0] || {}; // should always be ONE item in the array
              debugLog(LogLevel.DEBUG, 'Meta regions response', data);
              if (Array.isArray(data.regions)) {
                debugLog(LogLevel.DEBUG, 'Found regions array:', data.regions);
                resolve(data.regions);
              } else {
                resolve([]);
              }
            } catch (e) {
              debugLog(LogLevel.ERROR, 'Failed to parse meta regions response', e);
              resolve([]);
            }
          } else if (response.status === 404) {
            resolve([]);
          } else {
            reject(`HTTP error! status: ${response.status}`);
          }
        },
        onerror: () => {
          reject('An error occurred while fetching meta regions');
        }
      });
    });
  }

  /**
   * Loads and updates region tags for all Learnable Meta maps at startup.
   * Only fetches regions for maps not present in the cache.
   *
   * @param {string[]} learnableMetaMapIds - Array of GeoGuessr map IDs
   * @returns {Promise<Object<string, {regions: string[]}>>} Updated region cache
   * @example
   * const cache = await preloadMetaRegions(["abc123", "def456"]);
   * // cache["abc123"] might be { regions: ["south america"] }
   */
  async function preloadMetaRegions(learnableMetaMapIds) {
    const cache = loadMetaRegionCache();
    debugLog(LogLevel.DEBUG, 'Loaded meta region cache', cache);
    let updated = false;
    for (const mapId of learnableMetaMapIds) {
      if (!cache.hasOwnProperty(mapId)) {
        try {
          const regions = await fetchMetaRegionsFromAPI(mapId);
          if (regions?.length) {
            debugLog(LogLevel.INFO, 'Found regions for', mapId, regions);
            cache[mapId] = { regions };
            updated = true;
          }
        } catch (e) {
          debugLog(LogLevel.ERROR, 'Failed to fetch regions for', mapId, e);
        }
      }
    }
    if (updated) saveMetaRegionCache(cache);
    return cache;
  }

  // --- LOCALSTORAGE STATE ---
  function loadUserTags() {
    return JSON.parse(_unsafeWindow.localStorage.getItem(LOCALSTORAGE_USER_TAGS_KEY) || '{}');
  }

  function saveUserTags(userTags) {
    debugLog(LogLevel.DEBUG, 'Saving user tags', userTags);
    _unsafeWindow.localStorage.setItem(LOCALSTORAGE_USER_TAGS_KEY, JSON.stringify(userTags));
  }

  function saveTagVisibility(tagVisibility) {
    debugLog(LogLevel.DEBUG, 'Saving tag visibility', tagVisibility);
    const currentState = loadLMAOState();
    currentState.tagVisibility = tagVisibility;
    saveLMAOState(currentState);
  }

  function saveFilterCollapse(filterCollapse) {
    debugLog(LogLevel.DEBUG, 'Saving filter collapse', filterCollapse);
    const currentState = loadLMAOState();
    currentState.filterCollapse = filterCollapse;
    saveLMAOState(currentState);
  }

  function saveSelectedTags(selectedTags) {
    debugLog(LogLevel.DEBUG, 'Saving selected tags', selectedTags);
    const currentState = loadLMAOState();
    currentState.selectedTags = selectedTags;
    saveLMAOState(currentState);
  }

  // --- LMAO STATE MANAGEMENT ---
  function loadLMAOState() {
    try {
      const defaultState = {
        // defaults
        searchCriteria: ['name', 'description', 'creator', 'tags'],
        tagOrder: {},
        tagVisibility: {
          showUserTags: true,
          showLearnableMetaTag: true,
          showRegionTags: true,
          showApiTags: false
        },
        filterCollapse: {
          user: false,
          regions: false,
          api: true
        },
        selectedTags: {
          userTags: [],
          regionTags: [],
          apiTags: [],
          learnableMeta: false
        }
      };
      const raw = _unsafeWindow.localStorage.getItem(LOCALSTORAGE_STATE_KEY);
      if (!raw) return defaultState; // Default: all enabled
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    } catch (e) {
      debugLog(LogLevel.ERROR, 'Failed to load LMAO state', e);
      return defaultState;
    }
  }

  function saveLMAOState(state) {
    try {
      _unsafeWindow.localStorage.setItem(LOCALSTORAGE_STATE_KEY, JSON.stringify(state));
      debugLog(LogLevel.DEBUG, 'LMAO state saved', state);
    } catch (e) {
      debugLog(LogLevel.ERROR, 'Failed to save LMAO state', e);
    }
  }

  function saveSearchCriteria(searchCriteria) {
    const currentState = loadLMAOState();
    currentState.searchCriteria = searchCriteria;
    saveLMAOState(currentState);
  }

  // --- SELECTED TAGS HELPERS ---

  /**
   * Gets all selected tags as a flat array for backward compatibility
   * @returns {string[]} Array of all selected tag names
   */
  function getAllSelectedTags() {
    const { userTags, regionTags, apiTags, learnableMeta } = AppState.selectedTags;
    const allTags = [...userTags, ...regionTags, ...apiTags];
    if (learnableMeta) {
      allTags.push('Learnable Meta');
    }
    return allTags;
  }

  /**
   * Gets the count of all selected tags
   * @returns {number} Total number of selected tags
   */
  function getSelectedTagsCount() {
    const { userTags, regionTags, apiTags, learnableMeta } = AppState.selectedTags;
    let count = userTags.length + regionTags.length + apiTags.length;
    if (learnableMeta) count++;
    return count;
  }

  /**
   * Checks if a tag is selected in a specific category
   * @param {string} tag - Tag name to check
   * @param {string} category - Category to check ('user', 'region', 'api', 'learnableMeta')
   * @returns {boolean} True if tag is selected in that category
   */
  function isTagSelected(tag, category) {
    switch (category) {
      case 'user':
        return AppState.selectedTags.userTags.includes(tag);
      case 'region':
        return AppState.selectedTags.regionTags.includes(tag);
      case 'api':
        return AppState.selectedTags.apiTags.includes(tag);
      case 'learnableMeta':
        return tag === 'Learnable Meta' && AppState.selectedTags.learnableMeta;
      default:
        return false;
    }
  }

  /**
   * Adds a tag to the selected tags in the specified category
   * @param {string} tag - Tag name to add
   * @param {string} category - Category to add to (TagCategory.USER, TagCategory.REGION, TagCategory.API, TagCategory.LEARNABLE_META)
   */
  function addSelectedTag(tag, category) {
    switch (category) {
      case TagCategory.USER:
        if (!AppState.selectedTags.userTags.includes(tag)) {
          AppState.selectedTags.userTags.push(tag);
        }
        break;
      case TagCategory.REGION:
        if (!AppState.selectedTags.regionTags.includes(tag)) {
          AppState.selectedTags.regionTags.push(tag);
        }
        break;
      case TagCategory.API:
        if (!AppState.selectedTags.apiTags.includes(tag)) {
          AppState.selectedTags.apiTags.push(tag);
        }
        break;
      case TagCategory.LEARNABLE_META:
        AppState.selectedTags.learnableMeta = true;
        break;
    }
  }

  /**
   * Clears all selected tags
   */
  function clearAllSelectedTags() {
    AppState.selectedTags.userTags = [];
    AppState.selectedTags.regionTags = [];
    AppState.selectedTags.apiTags = [];
    AppState.selectedTags.learnableMeta = false;
  }

  /**
   * Removes a tag from the selected tags in the specified category
   * @param {string} tag - Tag name to remove
   * @param {string} category - Category to remove from (TagCategory.USER, TagCategory.REGION, TagCategory.API, TagCategory.LEARNABLE_META)
   */
  function removeSelectedTag(tag, category) {
    switch (category) {
      case TagCategory.USER:
        const userIndex = AppState.selectedTags.userTags.indexOf(tag);
        if (userIndex > -1) {
          AppState.selectedTags.userTags.splice(userIndex, 1);
        }
        break;
      case TagCategory.REGION:
        const regionIndex = AppState.selectedTags.regionTags.indexOf(tag);
        if (regionIndex > -1) {
          AppState.selectedTags.regionTags.splice(regionIndex, 1);
        }
        break;
      case TagCategory.API:
        const apiIndex = AppState.selectedTags.apiTags.indexOf(tag);
        if (apiIndex > -1) {
          AppState.selectedTags.apiTags.splice(apiIndex, 1);
        }
        break;
      case TagCategory.LEARNABLE_META:
        AppState.selectedTags.learnableMeta = false;
        break;
    }
  }

  // --- TAG ORDER MANAGEMENT ---
  function saveTagOrder(tagOrder) {
    const currentState = loadLMAOState();
    currentState.tagOrder = tagOrder;
    saveLMAOState(currentState);
  }

  /**
   * Sorts tags according to saved order, putting unordered tags at the end
   * @param {string[]} tags - Array of tag names
   * @param {string} category - Category key (TagCategory.USER, TagCategory.API, TagCategory.REGION)
   * @returns {string[]} Sorted array of tags
   */
  function sortTagsByOrder(tags, category) {
    const order = AppState.tagOrder[category] || [];
    const orderedTags = [];
    const unorderedTags = [...tags];

    // Add tags in saved order
    order.forEach((tag) => {
      const index = unorderedTags.indexOf(tag);
      if (index !== -1) {
        orderedTags.push(tag);
        unorderedTags.splice(index, 1);
      }
    });

    // Add remaining unordered tags at the end
    return [...orderedTags, ...unorderedTags.sort()];
  }

  // --- EXPORT/IMPORT FUNCTIONS ---
  function exportLMAOSettings() {
    const exportData = {
      version: CONFIG.version,
      exportDate: new Date().toISOString(),
      data: {}
    };

    // Collect all localStorage items that start with "lmao" (case-insensitive)
    for (let i = 0; i < _unsafeWindow.localStorage.length; i++) {
      const key = _unsafeWindow.localStorage.key(i);
      if (key && key.toLowerCase().startsWith('lmao')) {
        try {
          const value = _unsafeWindow.localStorage.getItem(key);
          exportData.data[key] = JSON.parse(value);
        } catch (e) {
          // If it's not JSON, store as string
          exportData.data[key] = _unsafeWindow.localStorage.getItem(key);
        }
      }
    }

    return exportData;
  }

  function downloadExportData() {
    try {
      const exportData = exportLMAOSettings();
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `lmao-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      debugLog(LogLevel.INFO, 'Settings exported successfully');
    } catch (error) {
      console.error('[LMAO] Failed to export settings:', error);
      alert('Failed to export settings. Check console for details.');
    }
  }

  function importLMAOSettings(importData) {
    try {
      if (!importData.data || typeof importData.data !== 'object') {
        throw new Error('Invalid import data format');
      }

      // Import only LMAO-specific localStorage keys
      Object.keys(importData.data).forEach((key) => {
        if (key.toLowerCase().startsWith('lmao')) {
          const value =
            typeof importData.data[key] === 'object'
              ? JSON.stringify(importData.data[key])
              : importData.data[key];
          _unsafeWindow.localStorage.setItem(key, value);
        }
      });

      debugLog(LogLevel.INFO, 'Settings imported successfully');
      alert('Settings imported successfully! Please refresh the page to see changes.');
    } catch (error) {
      console.error('[LMAO] Failed to import settings:', error);
      alert('Failed to import settings. Please check the file format.');
    }
  }

  function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importData = JSON.parse(e.target.result);
        importLMAOSettings(importData);
      } catch (error) {
        console.error('[LMAO] Failed to parse import file:', error);
        alert('Invalid file format. Please select a valid LMAO settings file.');
      }
    };
    reader.readAsText(file);
  }

  // --- API ---
  async function fetchAllLikedMaps() {
    const allMaps = [];
    let paginationToken = null;
    let url = 'https://www.geoguessr.com/api/v3/likes/maps?limit=50';
    while (true) {
      const res = await fetch(
        paginationToken ? `${url}&paginationToken=${encodeURIComponent(paginationToken)}` : url,
        { credentials: 'include' }
      );

      if (!res.ok) {
        console.error('[LMAO] Failed to fetch liked maps:', res.status);
        break;
      }

      const data = await res.json();
      allMaps.push(...data.items);

      if (!data.paginationToken) break;

      paginationToken = data.paginationToken;
    }

    return allMaps;
  }

  // --- UI HELPERS ---

  // Global tooltip element - only one tooltip exists at a time
  let _globalTooltipElement = null;

  // Ensure tooltip is hidden when page is unloaded
  window.addEventListener('beforeunload', () => {
    if (_globalTooltipElement) {
      _globalTooltipElement.style.visibility = 'hidden';
      _globalTooltipElement.style.opacity = '0';
    }
  });

  function createTooltip(element, tooltipText, offSet = false) {
    const wrapper = document.createElement('div');
    wrapper.className = 'lmao-tooltip';

    // Ensure global tooltip element exists
    if (!_globalTooltipElement) {
      _globalTooltipElement = document.createElement('span');
      _globalTooltipElement.className = 'lmao-tooltip-text';
      _globalTooltipElement.style.visibility = 'hidden';
      _globalTooltipElement.style.opacity = '0';
      document.body.appendChild(_globalTooltipElement);
      debugLog(LogLevel.DEBUG, 'Created global tooltip element');
    }

    let showTimeout, hideTimeout;

    const showTooltip = () => {
      debugLog(LogLevel.TRACE, `Showing tooltip: ${tooltipText}`);
      clearTimeout(hideTimeout);

      // Update tooltip text
      _globalTooltipElement.textContent = tooltipText;

      // Immediately hide any existing tooltip to prevent overlapping
      _globalTooltipElement.style.visibility = 'hidden';
      _globalTooltipElement.style.opacity = '0';

      showTimeout = setTimeout(() => {
        const rect = wrapper.getBoundingClientRect();

        // Position above the element by default
        let top = rect.top - 50 - 10; // Approximate tooltip height
        let left = rect.left + rect.width / 2;

        if (offSet) {
          top += 20;
        }

        // If tooltip would go above viewport, show below instead
        if (top < 10) {
          top = rect.bottom + 10;
        }

        // Adjust horizontal position if tooltip would go off screen
        const tooltipWidth = 200; // Approximate width
        if (left - tooltipWidth / 2 < 10) {
          left = tooltipWidth / 2 + 10;
        }
        if (left + tooltipWidth / 2 > window.innerWidth - 10) {
          left = window.innerWidth - tooltipWidth / 2 - 10;
        }

        _globalTooltipElement.style.position = 'fixed';
        _globalTooltipElement.style.top = top + 'px';
        _globalTooltipElement.style.left = left + 'px';
        _globalTooltipElement.style.transform = 'translateX(-50%)';
        _globalTooltipElement.style.zIndex = offSet ? '99999' : '10001';
        _globalTooltipElement.style.visibility = 'visible';
        _globalTooltipElement.style.opacity = '1';
        debugLog(LogLevel.TRACE, `Tooltip now visible: ${tooltipText}`);
      }, 200);
    };

    const hideTooltip = () => {
      debugLog(LogLevel.TRACE, `Hiding tooltip: ${tooltipText}`);
      clearTimeout(showTimeout);

      hideTimeout = setTimeout(() => {
        _globalTooltipElement.style.visibility = 'hidden';
        _globalTooltipElement.style.opacity = '0';
        debugLog(LogLevel.TRACE, `Tooltip now hidden: ${tooltipText}`);
      }, 100);
    };

    wrapper.addEventListener('mouseenter', showTooltip);
    wrapper.addEventListener('mouseleave', hideTooltip);

    wrapper.appendChild(element);

    return wrapper;
  }

  function showHelpPopup() {
    // Remove existing popup if any
    const existingPopup = document.querySelector('.lmao-help-popup-overlay');
    if (existingPopup) {
      existingPopup.remove();
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'lmao-help-popup-overlay';

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'lmao-help-popup';

    // Create header
    const header = document.createElement('div');
    header.className = 'lmao-help-popup-header';

    const title = document.createElement('h2');
    title.className = 'lmao-help-popup-title';
    title.textContent = `GeoGuessr LMAO V${GM_info.script.version}`;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lmao-help-popup-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => {
      overlay.remove();
    };

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Create content
    const content = document.createElement('div');
    content.className = 'lmao-help-popup-content';

    // Features section
    const featuresSection = document.createElement('div');
    featuresSection.className = 'lmao-help-popup-section';
    const featuresTitle = document.createElement('h3');
    featuresTitle.textContent = 'Features';
    const featuresText = document.createElement('p');
    featuresText.textContent =
      'LMAO (Liked Maps Advanced Overhaul) enhances your "Liked Maps" page by adding organization and filtering capabilities to your liked maps. You can add custom tags, filter by various criteria, and integrate with Learnable Meta for enhanced map information.';
    featuresSection.appendChild(featuresTitle);
    featuresSection.appendChild(featuresText);

    // Usage section
    const usageSection = document.createElement('div');
    usageSection.className = 'lmao-help-popup-section';
    const usageTitle = document.createElement('h3');
    usageTitle.textContent = 'How to Use';
    const usageText = document.createElement('p');
    usageText.style.whiteSpace = 'pre-line';
    usageText.textContent =
      '• Click the edit mode button (✏️) to add tags, reorder and manage tags\n• Use the sidebar to filter maps by tags\n• Use the search panel to filter maps by name or other criteria\n• Use the clear button (🗑️) to reset all filters\n• Toggle tag visibility in the sidebar to remove clutter.';
    usageSection.appendChild(usageTitle);
    usageSection.appendChild(usageText);

    // Links section
    const linksSection = document.createElement('div');
    linksSection.className = 'lmao-help-popup-links';

    const repoLink = document.createElement('a');
    repoLink.href = 'https://github.com/schnador/geoguessr-lmao';
    repoLink.target = '_blank';
    repoLink.textContent = 'GitHub Repository';
    repoLink.rel = 'noopener noreferrer';

    const learnableMetaLink = document.createElement('a');
    learnableMetaLink.href = 'https://learnablemeta.com';
    learnableMetaLink.target = '_blank';
    learnableMetaLink.textContent = 'Learnable Meta';
    learnableMetaLink.rel = 'noopener noreferrer';

    const signature = document.createElement('p');
    signature.textContent = 'Made by schnador\nwith ❤️';
    signature.style.whiteSpace = 'pre-line';
    signature.style.textAlign = 'center';
    linksSection.appendChild(signature);

    linksSection.appendChild(repoLink);
    linksSection.appendChild(learnableMetaLink);

    // Assemble popup
    content.appendChild(featuresSection);
    content.appendChild(usageSection);
    content.appendChild(linksSection);

    popup.appendChild(header);
    popup.appendChild(content);

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', closeOnEscape);
      }
    });
  }

  function createCheckbox(labelText, checked, onChange, classList = null) {
    const label = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = checked;
    cb.addEventListener('change', () => onChange(cb.checked));
    if (classList) {
      cb.classList = classList;
    }

    label.appendChild(cb);
    label.appendChild(document.createTextNode(' ' + labelText));
    return label;
  }

  function createRadioGroup(options, selected, name, onChange) {
    const div = document.createElement('div');
    options.forEach((opt) => {
      const label = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = name;
      radio.value = opt.value;
      radio.checked = selected === opt.value;
      radio.addEventListener('change', () => {
        if (radio.checked) onChange(opt.value);
      });
      label.appendChild(radio);
      label.appendChild(document.createTextNode(' ' + opt.label));
      label.style.marginRight = '1em';
      label.style.cursor = 'pointer';

      // Add tooltip if provided
      if (opt.tooltip) {
        const labelWithTooltip = createTooltip(label, opt.tooltip);
        div.appendChild(labelWithTooltip);
      } else {
        div.appendChild(label);
      }
    });

    return div;
  }

  function createCollapsibleTagGroup(
    title,
    tags,
    selectedTags,
    onChange,
    collapsed,
    onCollapseToggle,
    category = 'user'
  ) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'lmao-collapsible-tag-group';

    // Header
    const header = document.createElement('div');
    header.className = 'lmao-collapsible-header';

    const arrow = document.createElement('span');
    arrow.className = 'lmao-collapsible-arrow';
    arrow.textContent = collapsed ? '▶' : '▼';
    header.appendChild(arrow);
    header.appendChild(document.createTextNode(title));
    header.onclick = () => onCollapseToggle(!collapsed);
    groupDiv.appendChild(header);

    // Tags container
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'lmao-collapsible-tags' + (collapsed ? ' lmao-collapsed' : '');
    tagsDiv.setAttribute('data-category', category);

    // Sort tags by saved order
    const sortedTags = sortTagsByOrder(tags, category);

    sortedTags.forEach((tag, index) => {
      const chip = createTagChip(tag, isTagSelected(tag, category), category, (selected) => {
        if (selected) {
          addSelectedTag(tag, getTagCategory(category));
        } else {
          removeSelectedTag(tag, getTagCategory(category));
        }
        onChange(AppState.selectedTags);
      });

      // Add drag and drop functionality in edit mode
      if (AppState.editMode) {
        makeDraggable(chip, category, index, () => {
          // Rebuild the group after reordering
          const newSortedTags = sortTagsByOrder(tags, getTagCategory(category));
          rebuildTagGroup(tagsDiv, newSortedTags, selectedTags, onChange, category);
        });
      }

      tagsDiv.appendChild(chip);
    });

    groupDiv.appendChild(tagsDiv);
    return groupDiv;
  }

  /**
   * Creates a tag chip element
   */
  function createTagChip(tag, selected, category, onToggle) {
    const chip = document.createElement('div');
    chip.className = `lmao-tag-chip ${getTagChipClass(category)}${selected ? ' selected' : ''}${
      AppState.editMode ? ' edit-mode' : ''
    }`;
    chip.setAttribute('data-tag', tag);
    chip.setAttribute('data-category', category);

    // Add drag handle in edit mode, but not for learnable meta tag - currently the only in its category
    if (AppState.editMode && category !== TagCategory.LEARNABLE_META) {
      const handle = document.createElement('span');
      handle.className = 'lmao-drag-handle';
      handle.textContent = '⋮';
      chip.appendChild(handle);
    }

    const text = document.createElement('span');
    text.textContent = tag;
    chip.appendChild(text);

    // Click to toggle selection (only if not in edit mode or not dragging)
    chip.addEventListener('click', (e) => {
      if (!AppState.editMode && !chip.classList.contains('dragging')) {
        onToggle(!selected);
        chip.classList.toggle('selected', !selected);
      }
    });

    return chip;
  }

  /**
   * Gets the appropriate CSS class for a tag chip based on category
   */
  function getTagChipClass(category) {
    switch (category) {
      case TagCategory.USER:
        return 'user-tag';
      case TagCategory.API:
        return 'api-tag';
      case TagCategory.LEARNABLE_META:
        return 'meta-tag';
      case TagCategory.REGION:
        return 'region-tag';
      default:
        return 'user-tag';
    }
  }

  /**
   * Rebuilds a tag group container with new tag order
   */
  function rebuildTagGroup(container, tags, selectedTags, onChange, category) {
    container.innerHTML = '';
    tags.forEach((tag, index) => {
      const chip = createTagChip(tag, isTagSelected(tag, category), category, (selected) => {
        if (selected) {
          addSelectedTag(tag, getTagCategory(category));
        } else {
          removeSelectedTag(tag, getTagCategory(category));
        }
        onChange(AppState.selectedTags);
      });

      if (AppState.editMode) {
        makeDraggable(chip, category, index, () => {
          const newSortedTags = sortTagsByOrder(tags, getTagCategory(category));
          rebuildTagGroup(container, newSortedTags, selectedTags, onChange, category);
        });
      }

      container.appendChild(chip);
    });
  }

  /**
   * Makes a tag chip draggable for reordering
   */
  function makeDraggable(chip, category, index, onReorder) {
    chip.draggable = true;

    chip.addEventListener('dragstart', (e) => {
      chip.classList.add('dragging');
      e.dataTransfer.setData(
        'text/plain',
        JSON.stringify({
          tag: chip.getAttribute('data-tag'),
          category: category,
          index: index
        })
      );
      e.dataTransfer.effectAllowed = 'move';
    });

    chip.addEventListener('dragend', () => {
      chip.classList.remove('dragging');
      // Remove drag-over class from all chips
      document.querySelectorAll('.lmao-tag-chip.drag-over').forEach((c) => {
        c.classList.remove('drag-over');
      });
    });

    chip.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      chip.classList.add('drag-over');
    });

    chip.addEventListener('dragleave', () => {
      chip.classList.remove('drag-over');
    });

    chip.addEventListener('drop', (e) => {
      e.preventDefault();
      chip.classList.remove('drag-over');

      try {
        const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
        const targetTag = chip.getAttribute('data-tag');
        const targetCategory = chip.getAttribute('data-category');

        // Only allow reordering within the same category
        if (dragData.category !== targetCategory) return;

        const sourceTag = dragData.tag;
        if (sourceTag === targetTag) return;

        reorderTags(sourceTag, targetTag, category);
        onReorder();
      } catch (err) {
        debugLog(LogLevel.ERROR, 'Error handling drop', err);
      }
    });
  }

  /**
   * Reorders tags by moving sourceTag before targetTag
   */
  function reorderTags(sourceTag, targetTag, category) {
    debugLog(LogLevel.DEBUG, `Reordering ${sourceTag} before ${targetTag} in category ${category}`);

    // Get current order or create new one
    const currentOrder = AppState.tagOrder[category] || [];
    const allTags = getCurrentTagsForCategory(category);

    // Create a complete order array if it doesn't exist
    let fullOrder = [...currentOrder];
    allTags.forEach((tag) => {
      if (!fullOrder.includes(tag)) {
        fullOrder.push(tag);
      }
    });

    // Remove source tag from current position
    const sourceIndex = fullOrder.indexOf(sourceTag);
    if (sourceIndex !== -1) {
      fullOrder.splice(sourceIndex, 1);
    }

    // Find target position and insert source tag before it
    const targetIndex = fullOrder.indexOf(targetTag);
    if (targetIndex !== -1) {
      fullOrder.splice(targetIndex, 0, sourceTag);
    } else {
      // If target not found, add to end
      fullOrder.push(sourceTag);
    }

    // Update state and save
    AppState.tagOrder[category] = fullOrder;
    saveTagOrder(AppState.tagOrder);

    debugLog(LogLevel.DEBUG, `New order for ${category}:`, fullOrder);

    // Trigger rerender of map teasers to apply new tag order
    AppState.rerender();
  }

  /**
   * Gets all current tags for a category
   */
  function getCurrentTagsForCategory(category) {
    switch (category) {
      case 'user':
        return AppState.userTagsList;
      case 'api':
        return AppState.apiTagsList;
      case 'region':
        return AppState.metaTagsList.filter((tag) => tag !== 'Learnable Meta');
      case 'learnableMeta':
        return AppState.metaTagsList.filter((tag) => tag === 'Learnable Meta');
      default:
        return [];
    }
  }

  function createTagVisibilityToggles(tagVisibility, onChange) {
    const div = document.createElement('div');
    div.className = 'lmao-tag-visibility-toggles';

    div.appendChild(
      createCheckbox('Show learnable meta tag', tagVisibility.showLearnableMetaTag, (checked) => {
        tagVisibility.showLearnableMetaTag = checked;
        saveTagVisibility(tagVisibility);
        onChange({ ...tagVisibility });
      })
    );

    div.appendChild(
      createCheckbox('Show user tags', tagVisibility.showUserTags, (checked) => {
        tagVisibility.showUserTags = checked;
        saveTagVisibility(tagVisibility);
        onChange({ ...tagVisibility });
      })
    );

    div.appendChild(
      createCheckbox('Show region tags', tagVisibility.showRegionTags, (checked) => {
        tagVisibility.showRegionTags = checked;
        saveTagVisibility(tagVisibility);
        onChange({ ...tagVisibility });
      })
    );

    div.appendChild(
      createCheckbox('Show default tags', tagVisibility.showApiTags, (checked) => {
        tagVisibility.showApiTags = checked;
        saveTagVisibility(tagVisibility);
        onChange({ ...tagVisibility });
      })
    );
    return div;
  }

  function createControlsUI() {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'lmao-controls';

    const header = (title, icon, button = null) => {
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'space-between';
      container.style.marginTop = '0.75rem';
      container.style.marginBottom = '0.25rem';

      const s = document.createElement('strong');
      s.className = 'lmao-controls-header';
      s.style.margin = '0';

      if (icon) {
        const iconSpan = document.createElement('span');
        iconSpan.className = 'lmao-icon';
        iconSpan.textContent = icon;
        s.appendChild(iconSpan);
      }

      const textSpan = document.createElement('span');
      textSpan.textContent = title;
      s.appendChild(textSpan);

      container.appendChild(s);

      if (button) {
        container.appendChild(button);
      }

      return container;
    };

    const headerFilterMode = header('Filter Mode', '⚙️');
    headerFilterMode.style.marginTop = '0.25rem';
    controlsDiv.appendChild(headerFilterMode);
    controlsDiv.appendChild(
      createRadioGroup(
        [
          {
            value: 'ALL',
            label: 'All tags',
            tooltip: 'Show maps that have ALL selected tags\n(stricter filtering - fewer results)'
          },
          {
            value: 'ANY',
            label: 'Any tag',
            tooltip:
              'Show maps that have ANY of the selected tags\n(broader results - more maps shown)'
          }
        ],
        AppState.filterMode,
        'lmao-filter-mode',
        (newMode) => AppState.updateFilterMode(newMode)
      )
    );
    // Create small clear button for Filter heading - only clears tag filters
    const smallClearBtn = document.createElement('button');
    smallClearBtn.innerHTML = '🧹'; // Broom icon for cleaning tag filters
    smallClearBtn.className = 'lmao-small-clear-button';
    smallClearBtn.onclick = () => {
      clearAllSelectedTags();
      AppState.updateSelectedTags(AppState.selectedTags);
    };
    const smallClearWithTooltip = createTooltip(smallClearBtn, 'Clear Tag Filters', true);

    controlsDiv.appendChild(header('Filter', '🔍', smallClearWithTooltip));

    // Show Learnable Meta chip (without header) if user has learnable meta maps
    const hasLearnableMeta = AppState.learnableMetaCache.size > 0;
    if (hasLearnableMeta) {
      const learnableMetaChip = createTagChip(
        'Learnable Meta',
        AppState.selectedTags?.learnableMeta || false,
        TagCategory.LEARNABLE_META,
        (selected) => {
          AppState.selectedTags.learnableMeta = selected;
          AppState.updateSelectedTags(AppState.selectedTags);
        }
      );
      learnableMetaChip.classList.add('lmao-default-bottom-margin');
      controlsDiv.appendChild(learnableMetaChip);
    }

    controlsDiv.appendChild(
      createCollapsibleTagGroup(
        'User tags',
        AppState.userTagsList,
        AppState.selectedTags,
        (newTags) => AppState.updateSelectedTags(newTags),
        AppState.filterCollapse?.user,
        (c) => AppState.updateFilterCollapse({ ...AppState.filterCollapse, user: c }),
        'user'
      )
    );

    // Show Regions section only if user has learnable meta maps and there are region tags
    const regionTags = AppState.metaTagsList.filter((tag) => tag !== 'Learnable Meta');
    if (hasLearnableMeta && regionTags.length > 0) {
      controlsDiv.appendChild(
        createCollapsibleTagGroup(
          'Regions',
          regionTags,
          AppState.selectedTags,
          (newTags) => AppState.updateSelectedTags(newTags),
          AppState.filterCollapse?.regions,
          (c) => AppState.updateFilterCollapse({ ...AppState.filterCollapse, regions: c }),
          'region'
        )
      );
    }

    controlsDiv.appendChild(
      createCollapsibleTagGroup(
        'Default tags',
        AppState.apiTagsList,
        AppState.selectedTags,
        (newTags) => AppState.updateSelectedTags(newTags),
        AppState.filterCollapse?.api,
        (c) => AppState.updateFilterCollapse({ ...AppState.filterCollapse, api: c }),
        'api'
      )
    );
    controlsDiv.appendChild(header('Tag Visibility', '👁️'));
    controlsDiv.appendChild(
      createTagVisibilityToggles(AppState.tagVisibility, (newVisibility) =>
        AppState.updateTagVisibility(newVisibility)
      )
    );

    return controlsDiv;
  }

  /**
   * Creates the search panel component with dropdown and input.
   * @returns {HTMLElement} The search panel element
   */
  function createSearchPanel() {
    const searchPanel = document.createElement('div');
    searchPanel.className = 'lmao-search-panel';

    const updateSearchPanelBorder = () => {
      const currentCriteria = AppState.searchCriteria;
      if (currentCriteria.length === 0) {
        searchPanel.style.borderColor = 'var(--ds-color-red-80)'; // Red border when no criteria
      } else {
        searchPanel.style.borderColor = 'var(--ds-color-white-20)'; // Default border
      }
    };

    // Make the function globally accessible so it can be called when criteria changes
    window.updateSearchPanelBorder = updateSearchPanelBorder;

    // Search criteria dropdown
    const dropdown = document.createElement('button');
    dropdown.className = 'lmao-search-dropdown';
    dropdown.type = 'button';

    // Set initial display based on current criteria using shared function
    updateDropdownDisplay(dropdown, AppState.searchCriteria);

    // Dropdown menu
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'lmao-search-dropdown-menu';

    const searchCriteria = [
      { value: 'name', label: 'Name', icon: '📝' },
      { value: 'description', label: 'Description', icon: '📄' },
      { value: 'creator', label: 'Creator', icon: '👤' },
      { value: 'tags', label: 'Tags', icon: '🏷️' }
    ];

    searchCriteria.forEach((criteria) => {
      const item = document.createElement('label');
      item.className = 'lmao-search-dropdown-item';
      item.style.cursor = 'pointer';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = criteria.value;
      checkbox.checked = AppState.searchCriteria.includes(criteria.value);
      checkbox.style.marginRight = '0.5rem';

      const icon = document.createElement('span');
      icon.className = 'lmao-search-icon';
      icon.textContent = criteria.icon;

      const labelText = document.createElement('span');
      labelText.textContent = criteria.label;

      checkbox.onchange = (e) => {
        e.stopPropagation();
        const currentCriteria = [...AppState.searchCriteria];

        if (checkbox.checked) {
          if (!currentCriteria.includes(criteria.value)) {
            currentCriteria.push(criteria.value);
          }
        } else {
          const index = currentCriteria.indexOf(criteria.value);
          if (index > -1) {
            currentCriteria.splice(index, 1);
          }
        }

        AppState.updateSearchCriteria(currentCriteria);
        updateSearchPanelBorder();
      };

      item.appendChild(checkbox);
      item.appendChild(icon);
      item.appendChild(labelText);

      // Prevent label click from closing dropdown
      item.onclick = (e) => {
        e.stopPropagation();
      };

      dropdownMenu.appendChild(item);
    });

    // Toggle dropdown - use only click event with proper handling
    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      dropdownMenu.classList.toggle('show');
      const isShowing = dropdownMenu.classList.contains('show');

      if (isShowing) {
        // Position the dropdown relative to the button since it's now in document.body
        const positionDropdown = () => {
          const buttonRect = dropdown.getBoundingClientRect();
          dropdownMenu.style.position = 'fixed';
          dropdownMenu.style.top = buttonRect.bottom + 'px';
          dropdownMenu.style.left = buttonRect.left + 'px';
          dropdownMenu.style.minWidth = buttonRect.width + 'px';
        };

        positionDropdown();

        // Add scroll listener to reposition dropdown when scrolling
        const scrollHandler = () => {
          if (dropdownMenu.classList.contains('show')) {
            positionDropdown();
          }
        };

        window.addEventListener('scroll', scrollHandler, true);
        window.addEventListener('resize', scrollHandler);

        // Store handlers for cleanup
        dropdownMenu._scrollHandler = scrollHandler;
      } else {
        // Clean up scroll listeners when dropdown closes
        if (dropdownMenu._scrollHandler) {
          window.removeEventListener('scroll', dropdownMenu._scrollHandler, true);
          window.removeEventListener('resize', dropdownMenu._scrollHandler);
          dropdownMenu._scrollHandler = null;
        }
      }
    });

    // Search input
    const input = document.createElement('input');
    input.className = 'lmao-search-input';
    input.type = 'text';
    input.value = AppState.searchQuery;

    // Set initial placeholder based on current criteria
    const updatePlaceholder = () => {
      const currentCriteria = AppState.searchCriteria;
      if (currentCriteria.length === 0) {
        input.placeholder = 'Select criteria first...';
      } else {
        input.placeholder = `Search...`;
      }
    };

    updatePlaceholder();
    updateSearchPanelBorder();

    // Search input event handlers
    let searchTimeout;
    input.oninput = (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        AppState.updateSearchQuery(e.target.value);
      }, 300); // Debounce search
    };

    input.onkeydown = (e) => {
      e.stopPropagation();
    };

    // Close dropdown when clicking on the input field
    input.onclick = (e) => {
      e.stopPropagation();
      if (dropdownMenu.classList.contains('show')) {
        dropdownMenu.classList.remove('show');
        // Clean up scroll listeners when dropdown closes
        if (dropdownMenu._scrollHandler) {
          window.removeEventListener('scroll', dropdownMenu._scrollHandler, true);
          window.removeEventListener('resize', dropdownMenu._scrollHandler);
          dropdownMenu._scrollHandler = null;
        }
      }
    };

    // Clear search button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'lmao-search-clear';
    clearBtn.innerHTML = '✕';
    clearBtn.type = 'button';
    clearBtn.title = 'Clear search';
    clearBtn.onclick = (e) => {
      e.stopPropagation();
      input.value = '';
      AppState.updateSearchQuery('');
    };

    // Assemble search panel (but append dropdown to body to avoid clipping)
    searchPanel.appendChild(dropdown);
    searchPanel.appendChild(input);
    searchPanel.appendChild(clearBtn);

    // Append dropdown menu to body to avoid overflow clipping
    document.body.appendChild(dropdownMenu);

    // Close dropdown when clicking outside - use a unique identifier to avoid conflicts
    const closeDropdownHandler = (e) => {
      // Only close if dropdown is open and click is outside both the search panel and dropdown menu
      if (
        dropdownMenu.classList.contains('show') &&
        !searchPanel.contains(e.target) &&
        !dropdownMenu.contains(e.target)
      ) {
        dropdownMenu.classList.remove('show');
        // Clean up scroll listeners when dropdown closes
        if (dropdownMenu._scrollHandler) {
          window.removeEventListener('scroll', dropdownMenu._scrollHandler, true);
          window.removeEventListener('resize', dropdownMenu._scrollHandler);
          dropdownMenu._scrollHandler = null;
        }
      }
    };

    // Add the outside click listener with a delay to avoid immediate conflicts
    setTimeout(() => {
      document.addEventListener('click', closeDropdownHandler, true); // Use capture phase
    }, 100);

    return searchPanel;
  }

  function createHeaderActions() {
    const headerActions = document.createElement('div');
    headerActions.className = 'lmao-header-actions';

    // Add search panel first
    const searchPanel = createSearchPanel();
    headerActions.appendChild(searchPanel);

    // Clear filters button with reset icon
    const clearFiltersBtn = document.createElement('button');
    clearFiltersBtn.innerHTML = '🗑️'; // Trash icon
    clearFiltersBtn.className = 'lmao-header-button lmao-clear-button';
    clearFiltersBtn.onclick = () => {
      clearAllSelectedTags();
      AppState.updateSelectedTags(AppState.selectedTags);
      AppState.updateSearchQuery('');
      // Also clear the search input
      const searchInput = document.querySelector('.lmao-search-input');
      if (searchInput) {
        searchInput.value = '';
      }
    };
    const clearFiltersWithTooltip = createTooltip(
      clearFiltersBtn,
      'Reset All (Filters & Search)',
      true
    );
    headerActions.appendChild(clearFiltersWithTooltip);

    // Edit mode toggle button
    const editToggleBtn = document.createElement('button');
    editToggleBtn.innerHTML = '✏️'; // Pencil icon
    editToggleBtn.className = 'lmao-header-button lmao-edit-toggle' + (AppState.editMode ? ' active' : '');
    editToggleBtn.onclick = () => {
      const newMode = !AppState.editMode;
      AppState.updateEditMode(newMode);
      editToggleBtn.className = 'lmao-header-button lmao-edit-toggle' + (newMode ? ' active' : '');
    };
    const editToggleWithTooltip = createTooltip(editToggleBtn, 'Toggle Edit Mode', true);
    headerActions.appendChild(editToggleWithTooltip);

    // Settings dropdown
    const settingsDropdown = document.createElement('div');
    settingsDropdown.className = 'lmao-settings-dropdown';

    const settingsBtn = document.createElement('button');
    settingsBtn.innerHTML = '⚙️'; // Cogwheel icon
    settingsBtn.className = 'lmao-header-button';
    settingsBtn.onclick = (e) => {
      e.stopPropagation();
      const dropdown = settingsDropdown.querySelector('.lmao-settings-dropdown-content');
      dropdown.classList.toggle('show');
    };
    const settingsBtnWithTooltip = createTooltip(settingsBtn, 'Settings', true);
    settingsDropdown.appendChild(settingsBtnWithTooltip);

    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'lmao-settings-dropdown-content';

    // Export button
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Settings';
    exportBtn.className = 'lmao-settings-dropdown-item';
    exportBtn.onclick = () => {
      downloadExportData();
      dropdownContent.classList.remove('show');
    };

    // Import button and hidden file input
    const importBtn = document.createElement('button');
    importBtn.textContent = 'Import Settings';
    importBtn.className = 'lmao-settings-dropdown-item';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.className = 'lmao-file-input';
    fileInput.onchange = (e) => {
      handleImportFile(e);
      dropdownContent.classList.remove('show');
    };

    importBtn.onclick = () => fileInput.click();

    dropdownContent.appendChild(exportBtn);
    dropdownContent.appendChild(importBtn);
    settingsDropdown.appendChild(dropdownContent);
    settingsDropdown.appendChild(fileInput);

    headerActions.appendChild(settingsDropdown);

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!settingsDropdown.contains(e.target)) {
        dropdownContent.classList.remove('show');
      }
    });

    // Help button with question mark emoji
    const helpBtn = document.createElement('button');
    helpBtn.innerHTML = '❓'; // Question mark emoji
    helpBtn.className = 'lmao-header-button lmao-help-button';
    helpBtn.onclick = () => {
      showHelpPopup();
    };
    const helpBtnWithTooltip = createTooltip(helpBtn, 'Help & Information', true);
    headerActions.appendChild(helpBtnWithTooltip);

    return headerActions;
  }

  /**
   * Updates the map counter in the header
   */
  function updateMapCounter() {
    const counter = document.getElementById('lmao-map-counter');
    if (!counter) return;

    const totalMaps = AppState.maps ? AppState.maps.length : 0;
    const visibleMaps = countVisibleMaps();

    if (visibleMaps === totalMaps) {
      counter.textContent = totalMaps.toString();
    } else {
      counter.textContent = `${visibleMaps}/${totalMaps}`;
    }
  }

  // --- FILTERING FUNCTIONS ---
  /**
   * Checks if a map matches ALL selected tags from ALL categories (ALL filter mode)
   * @param {string[]} allTags - All tags on the map
   * @param {string} mapKey - Map key for looking up user tags and meta data
   * @returns {boolean} True if map matches all selected tags
   */
  function matchesAllSelectedTags(allTags, mapKey) {
    // Check user tags
    if (AppState.selectedTags.userTags.length > 0) {
      const userTags = AppState.currentUserTags[mapKey] || [];
      if (!AppState.selectedTags.userTags.every((tag) => userTags.includes(tag))) {
        return false;
      }
    }

    // Check region tags
    if (AppState.selectedTags.regionTags.length > 0) {
      const regionTags = AppState.metaRegionCache?.[mapKey]?.regions || [];
      if (!AppState.selectedTags.regionTags.every((tag) => regionTags.includes(tag))) {
        return false;
      }
    }

    // Check API tags
    if (AppState.selectedTags.apiTags.length > 0) {
      const apiTags = allTags.filter(
        (tag) => !AppState.currentUserTags[mapKey]?.includes(tag) && tag !== 'Learnable Meta'
      );
      if (!AppState.selectedTags.apiTags.every((tag) => apiTags.includes(tag))) {
        return false;
      }
    }

    // Check Learnable Meta
    if (AppState.selectedTags.learnableMeta) {
      if (!isLearnableMetaFromCacheOrLocalStorage(mapKey, AppState.learnableMetaCache)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Checks if a map matches at least ONE selected tag from ANY category (ANY filter mode)
   * @param {string[]} allTags - All tags on the map
   * @param {string} mapKey - Map key for looking up user tags and meta data
   * @returns {boolean} True if map matches at least one selected tag
   */
  function matchesAnySelectedTags(allTags, mapKey) {
    // Check user tags
    if (AppState.selectedTags.userTags.length > 0) {
      const userTags = AppState.currentUserTags[mapKey] || [];
      if (AppState.selectedTags.userTags.some((tag) => userTags.includes(tag))) {
        return true;
      }
    }

    // Check region tags
    if (AppState.selectedTags.regionTags.length > 0) {
      const regionTags = AppState.metaRegionCache?.[mapKey]?.regions || [];
      if (AppState.selectedTags.regionTags.some((tag) => regionTags.includes(tag))) {
        return true;
      }
    }

    // Check API tags
    if (AppState.selectedTags.apiTags.length > 0) {
      const apiTags = allTags.filter(
        (tag) =>
          !AppState.currentUserTags[mapKey]?.includes(tag) &&
          tag !== 'Learnable Meta' &&
          tag !== 'Official'
      );
      if (AppState.selectedTags.apiTags.some((tag) => apiTags.includes(tag))) {
        return true;
      }
    }

    // Check Learnable Meta
    if (AppState.selectedTags.learnableMeta) {
      if (isLearnableMetaFromCacheOrLocalStorage(mapKey, AppState.learnableMetaCache)) {
        return true;
      }
    }

    return false;
  }

  // --- PATCH TEASERS ---
  function patchTeasersWithControls() {
    const grid = findGridContainer();
    if (!grid) return;
    const teasers = findMapTeaserElements(grid);
    teasers.forEach((teaser) => {
      const href = teaser.getAttribute('href');
      const map = getMapByTeaserHref(AppState.maps, href);
      if (!map) return;

      const mapKey = getMapKey(map);
      // Compute all tags (user, api, meta)
      const allTags = [
        ...new Set([...(map.tags || []), ...(AppState.currentUserTags[mapKey] || [])])
      ];
      if (
        isLearnableMetaFromCacheOrLocalStorage(mapKey, AppState.learnableMetaCache) &&
        !allTags.includes('Learnable Meta')
      ) {
        allTags.push('Learnable Meta');
      }

      if (map.isUserMap === false) allTags.push('Official');

      // Filter logic - combine tag filtering and search filtering
      let shouldShow = true;

      // Tag filtering - category-specific
      if (getSelectedTagsCount() > 0) {
        if (AppState.filterMode === 'ALL') {
          // ALL mode: must have ALL selected tags from ALL categories
          if (!matchesAllSelectedTags(allTags, mapKey)) {
            shouldShow = false;
          }
        } else {
          // ANY mode: must have at least ONE selected tag from ANY category
          if (!matchesAnySelectedTags(allTags, mapKey)) {
            shouldShow = false;
          }
        }
      }

      // Search filtering - only apply if there's a search query and tag filtering passed
      if (shouldShow && AppState.searchQuery && AppState.searchQuery.trim() !== '') {
        if (!matchesSearchQuery(map, AppState.searchQuery, AppState.searchCriteria)) {
          shouldShow = false;
        }
      }

      // Apply visibility
      if (!shouldShow) {
        teaser.closest('li').style.display = 'none';
        return;
      }
      teaser.closest('li').style.display = '';

      const tagsContainer = findTagsContainer(teaser);
      if (!tagsContainer) {
        console.warn('[LMAO] Tags container not found for map', map.slug);
        return;
      }

      // Clear existing tags
      tagsContainer
        .querySelectorAll('.lmao-map-teaser_tag, .lmao-tag-input')
        .forEach((e) => e.remove());

      // Add Official tag as a default tag if present and showApiTags is true
      if (AppState.tagVisibility.showApiTags && allTags.includes('Official')) {
        const tagDiv = document.createElement('span');
        tagDiv.className = API_TAG_CLASS;
        tagDiv.textContent = 'Official';
        tagDiv.style.cursor = 'default';
        tagDiv.addEventListener(
          'mousedown',
          (e) => {
            e.stopPropagation();
            e.preventDefault();
          },
          true
        );
        tagDiv.addEventListener(
          'click',
          (e) => {
            e.stopPropagation();
            e.preventDefault();
          },
          true
        );
        tagsContainer.appendChild(tagDiv);
      }

      // Hide or show native API tags based on toggle
      Array.from(tagsContainer.children).forEach((child) => {
        if (
          child.tagName === 'DIV' &&
          child.className &&
          child.className.includes('map-teaser_tag') &&
          !child.className.includes('user-tag') &&
          !child.className.includes('api-tag') &&
          !child.className.includes('lmao-tag-input')
        ) {
          child.style.display = AppState.tagVisibility.showApiTags ? '' : 'none';
        }
        child.style.cursor = 'default';
        child.addEventListener(
          'mousedown',
          (e) => {
            e.stopPropagation();
            e.preventDefault();
          },
          true
        );
        child.addEventListener(
          'click',
          (e) => {
            e.stopPropagation();
            e.preventDefault();
          },
          true
        );
      });

      // Add Learnable Meta tag if present
      if (
        AppState.tagVisibility.showLearnableMetaTag &&
        isLearnableMetaFromCacheOrLocalStorage(mapKey, AppState.learnableMetaCache)
      ) {
        const tagDiv = document.createElement('span');
        tagDiv.className = USER_TAG_CLASS + ' lmao-learnable-meta';
        tagDiv.textContent = 'Learnable Meta';
        tagDiv.style.cursor = 'default';
        tagDiv.addEventListener(
          'mousedown',
          (e) => {
            e.stopPropagation();
            e.preventDefault();
          },
          true
        );
        tagDiv.addEventListener(
          'click',
          (e) => {
            e.stopPropagation();
            e.preventDefault();
          },
          true
        );
        tagsContainer.appendChild(tagDiv);
      }

      // Add region tags if learnable meta (in sorted order)
      if (
        AppState.tagVisibility.showRegionTags &&
        AppState.learnableMetaCache.has(mapKey) &&
        AppState.metaRegionCache &&
        AppState.metaRegionCache[mapKey] &&
        Array.isArray(AppState.metaRegionCache[mapKey].regions)
      ) {
        const regionTags = AppState.metaRegionCache[mapKey].regions;
        const sortedRegionTags = sortTagsByOrder(regionTags, TagCategory.REGION);
        sortedRegionTags.forEach((region) => {
          const tagDiv = document.createElement('span');
          tagDiv.className = USER_TAG_CLASS + ' lmao-region';
          tagDiv.textContent = region;
          tagDiv.style.cursor = 'default';
          tagDiv.addEventListener(
            'mousedown',
            (e) => {
              e.stopPropagation();
              e.preventDefault();
            },
            true
          );
          tagDiv.addEventListener(
            'click',
            (e) => {
              e.stopPropagation();
              e.preventDefault();
            },
            true
          );
          tagsContainer.appendChild(tagDiv);
        });
      }

      // Add user tags if enabled (in sorted order)
      if (AppState.tagVisibility.showUserTags) {
        const userTags = AppState.currentUserTags[mapKey] || [];
        const sortedUserTags = sortTagsByOrder(userTags, TagCategory.USER);
        sortedUserTags.forEach((tag) => {
          const tagDiv = document.createElement('span');
          tagDiv.className = USER_TAG_CLASS;
          tagDiv.style.cursor = 'default';
          tagDiv.setAttribute('data-lmao-usertag', '1');
          tagDiv.textContent = tag;
          tagDiv.addEventListener(
            'mousedown',
            (e) => {
              if (e.target === tagDiv) {
                e.stopPropagation();
                e.preventDefault();
              }
            },
            true
          );
          tagDiv.addEventListener(
            'click',
            (e) => {
              if (e.target === tagDiv) {
                e.stopPropagation();
                e.preventDefault();
              }
            },
            true
          );
          if (AppState.editMode) {
            const rmBtn = document.createElement('button');
            rmBtn.textContent = '×';
            rmBtn.title = 'Remove tag';
            rmBtn.className = 'lmao-tag-remove-btn';
            rmBtn.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              debugLog(LogLevel.DEBUG, 'Removing tag', tag, 'from map', map.id);
              AppState.removeUserTag(map, tag);
            };
            tagDiv.appendChild(rmBtn);
          }
          tagsContainer.appendChild(tagDiv);
        });
      }

      // Add tag input if in edit mode
      if (AppState.editMode) {
        const datalistId = 'lmao-user-tags-datalist';
        let datalist = document.getElementById(datalistId);

        if (!datalist) {
          datalist = document.createElement('datalist');
          datalist.id = datalistId;
          AppState.userTagsList.forEach((tag) => {
            const option = document.createElement('option');
            option.value = tag;
            datalist.appendChild(option);
          });
          document.body.appendChild(datalist);
        } else {
          datalist.innerHTML = '';
          AppState.userTagsList.forEach((tag) => {
            const option = document.createElement('option');
            option.value = tag;
            datalist.appendChild(option);
          });
        }

        const addTagInput = document.createElement('input');
        addTagInput.placeholder = 'Add tag';
        addTagInput.className = 'lmao-tag-input';
        addTagInput.setAttribute('list', datalistId);

        ['mousedown', 'click'].forEach((evt) => {
          addTagInput.addEventListener(evt, (e) => {
            e.stopPropagation();
            e.preventDefault();
            e.target.focus();
          });
        });

        addTagInput.addEventListener('input', function () {
          const val = addTagInput.value.toLowerCase();
          datalist.innerHTML = '';
          AppState.userTagsList
            .filter((tag) => tag.toLowerCase().startsWith(val))
            .forEach((tag) => {
              const option = document.createElement('option');
              option.value = tag;
              datalist.appendChild(option);
            });
        });

        addTagInput.addEventListener('keydown', (e) => {
          e.stopPropagation();
          if (e.key === 'Enter') {
            const val = addTagInput.value.trim();
            if (
              val &&
              !(
                (AppState.currentUserTags[mapKey] || []).includes(val) ||
                (map.tags || []).includes(val)
              )
            ) {
              AppState.addUserTag(map, val);
              addTagInput.value = '';
            }
          }
        });
        tagsContainer.appendChild(addTagInput);
      }
    });

    // Update the map counter after filtering
    updateMapCounter();
  }

  // --- DOM FINDERS ---
  function findGridContainer() {
    const grid = document.querySelector('div[class*="grid_grid__"]');
    if (grid) {
      debugLog(LogLevel.TRACE, 'Found grid container');
    } else {
      debugLog(LogLevel.ERROR, 'Grid container not found');
    }
    return grid;
  }

  function findMapTeaserElements(grid) {
    const teasers = Array.from(grid.querySelectorAll('li > a[class*="map-teaser_mapTeaser__"]'));
    debugLog(LogLevel.TRACE, `Found ${teasers.length} map teaser elements`);
    return teasers;
  }

  /**
   * Counts the number of visible map teasers
   * @returns {number} The count of visible maps
   */
  function countVisibleMaps() {
    const grid = findGridContainer();
    if (!grid) return 0;

    const teasers = findMapTeaserElements(grid);
    let visibleCount = 0;

    teasers.forEach((teaser) => {
      const listItem = teaser.closest('li');
      if (listItem && listItem.style.display !== 'none') {
        visibleCount++;
      }
    });

    return visibleCount;
  }

  function findTagsContainer(mapTeaser) {
    const container = mapTeaser.querySelector('div[class*="map-teaser_tagsContainer__"]');
    if (!container) {
      debugLog(LogLevel.WARN, 'Tags container not found for map teaser');
    }
    return container;
  }

  function findLikesMapDiv() {
    const likesDiv = document.querySelector('div[class*="likes_map__"]');
    if (likesDiv) {
      debugLog(LogLevel.TRACE, 'Found likes map div');
    } else {
      debugLog(LogLevel.ERROR, 'Likes map div not found');
    }
    return likesDiv;
  }

  function findHeading() {
    const heading = document.querySelector('h1[class*="headline_heading__"]');
    if (heading) {
      debugLog(LogLevel.TRACE, 'Found heading element');
    } else {
      debugLog(LogLevel.ERROR, 'Heading element not found');
    }
    return heading;
  }

  function findFullHeightContainer() {
    const container = document.querySelector('main');
    if (container) {
      debugLog(LogLevel.TRACE, 'Found main container');
    } else {
      debugLog(LogLevel.ERROR, 'Main container not found');
    }
    return container;
  }

  /**
   * Shows a loading indicator in the likes container.
   */
  function showLoadingIndicator() {
    const container = findLikesMapDiv();
    if (!container) return;
    let loader = document.getElementById('lmao-loading-indicator');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'lmao-loading-indicator';
      loader.className = 'lmao-loading-indicator';
      loader.innerHTML = `<span class="lmao-loading-indicator-text">⏳ Checking for learnable meta maps...</span>`;
      container.parentNode.insertBefore(loader, container);
    }
  }

  /**
   * Removes the loading indicator from the likes container.
   */
  function removeLoadingIndicator() {
    const loader = document.getElementById('lmao-loading-indicator');
    if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
  }

  // --- MAIN ---
  async function init() {
    debugLog(LogLevel.INFO, 'Starting LMAO initialization');

    showLoadingIndicator();
    try {
      const userTags = loadUserTags();
      debugLog(
        LogLevel.INFO,
        `Loaded ${Object.keys(userTags).length} user tag entries from localStorage`
      );
      const maps = await fetchAllLikedMaps();
      debugLog(LogLevel.INFO, `Fetched ${maps.length} liked maps from API`);
      // Group tags for filter UI
      const userTagsSet = new Set();
      const apiTagsSet = new Set();
      const metaTagsSet = new Set();
      const learnableMetaCache = new Set();

      // Await fetchAndCacheLearnableMeta only during init, then cache result in learnableMetaCache
      const learnableMetaMapIds = [];
      for (const map of maps) {
        (userTags[getMapKey(map)] || []).forEach((t) => userTagsSet.add(t));
        (map.tags || []).forEach((t) => apiTagsSet.add(t));
        if (await fetchAndCacheLearnableMeta(getMapKey(map))) {
          metaTagsSet.add('Learnable Meta');
          learnableMetaCache.add(getMapKey(map));
          learnableMetaMapIds.push(getMapKey(map));
        }
        if (map.isUserMap === false) apiTagsSet.add('Official');
      }

      // get regions from Learnable Meta API
      debugLog(
        LogLevel.INFO,
        `Processing ${learnableMetaMapIds.length} Learnable Meta maps for regions`
      );
      const metaRegionCache = await preloadMetaRegions(learnableMetaMapIds);
      Object.values(metaRegionCache).forEach((regionData) => {
        if (regionData && Array.isArray(regionData.regions)) {
          regionData.regions.forEach((region) => metaTagsSet.add(region));
        }
      });
      debugLog(LogLevel.INFO, `Found ${metaTagsSet.size} total meta tags (including regions)`);

      // Initialize AppState
      const lmaoState = loadLMAOState();

      AppState.maps = maps;
      AppState.userTagsList = Array.from(userTagsSet).sort();
      AppState.apiTagsList = Array.from(apiTagsSet).sort();
      AppState.metaTagsList = Array.from(metaTagsSet).sort();
      AppState.currentUserTags = { ...userTags };
      AppState.selectedTags = lmaoState.selectedTags;
      AppState.tagVisibility = lmaoState.tagVisibility;
      AppState.filterCollapse = lmaoState.filterCollapse;
      AppState.tagOrder = lmaoState.tagOrder;
      AppState.searchCriteria = lmaoState.searchCriteria;
      AppState.filterMode = 'ALL';
      AppState.editMode = false;
      AppState.learnableMetaCache = learnableMetaCache;
      AppState.metaRegionCache = metaRegionCache;
      const grid = findGridContainer();
      if (!grid) return;

      const container = grid.closest('div[class*="container_content__"]');
      if (container && !container.className.includes('lmao-full-width-container'))
        container.classList.add('lmao-full-width-container');

      const likesMapDiv = grid.closest('div[class*="likes_map__"]');
      if (likesMapDiv) {
        likesMapDiv.style.display = 'flex';
        likesMapDiv.style.alignItems = 'flex-start';
        likesMapDiv.style.gap = '0';
        likesMapDiv.style.marginTop = '1rem';
      }

      const likesMapContainer = likesMapDiv.parentElement;
      if (likesMapContainer && !likesMapContainer.className.includes('lmao-likes-container')) {
        likesMapContainer.classList.add('lmao-likes-container');
      }

      AppState.controlsDiv = document.getElementById('liked-maps-filter-controls');

      if (!AppState.controlsDiv) AppState.rebuildControls();
      grid.style.flexGrow = '1';
      AppState.rerender();

      debugLog(LogLevel.INFO, 'LMAO initialization completed successfully');
    } finally {
      removeLoadingIndicator();
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  /**
   * Checks if the current page is one where the script should activate.
   * @returns {boolean}
   */
  function isActivePage() {
    const { pathname, search } = window.location;
    if (pathname === '/me/likes') return true;
    // disabled for now - would need handle the different class names to make it work.
    // if (pathname === '/maps/community') {
    //   const params = new URLSearchParams(search);
    //   return params.get('tab') === 'liked-maps';
    // }
    return false;
  }

  // --- PAGE NAVIGATION HANDLING ---
  /**
   * Observe URL and DOM changes to trigger script activation on SPA navigation.
   */
  function observePageAndGrid() {
    let lastUrl = location.href;
    let gridInitialized = false;

    /**
     * Try to initialize the script if on the correct page and grid is present.
     * Remove controls if not on the correct page.
     */
    function tryInit() {
      try {
        if (!isActivePage()) {
          gridInitialized = false;
          // Remove controls panel if present
          const controlsDiv = document.getElementById('liked-maps-filter-controls');
          if (controlsDiv && controlsDiv.parentNode) {
            controlsDiv.parentNode.removeChild(controlsDiv);
          }
          return;
        }
        const grid = document.querySelector('div[class*="grid_grid__"]');
        // debugLog('[LMAO] grid alive:', !!grid, 'initialized:', !!gridInitialized);
        if (!grid) {
          gridInitialized = false;
          // Keep retrying until grid appears (for SPA back/forward navigation)
          // debugLog('[LMAO] Grid not found. Retrying...');
          setTimeout(tryInit, 100);
          return;
        }
        if (!gridInitialized) {
          gridInitialized = true;
          debugLog(LogLevel.INFO, 'Grid found, initializing LMAO');

          init();

          saveDevConfig();
        }
      } catch (e) {
        debugLog(LogLevel.ERROR, 'Error during tryInit:', e);
      }
    }

    // Observe URL changes (pushState, replaceState, popstate)
    const origPushState = history.pushState;
    const origReplaceState = history.replaceState;

    history.pushState = function (...args) {
      origPushState.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
    };

    history.replaceState = function (...args) {
      origReplaceState.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
    };

    window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
    window.addEventListener('locationchange', () => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        gridInitialized = false;
        tryInit();
      }
    });

    // Observe DOM changes for grid
    const observer = new MutationObserver(() => {
      tryInit();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check
    tryInit();
  }

  // --- WAIT FOR PAGE (MutationObserver version) ---
  const waitForLoad = async () => {
    while (!document.body) {
      await sleep(100);
    }
    observePageAndGrid();
  };

  waitForLoad();
})();
