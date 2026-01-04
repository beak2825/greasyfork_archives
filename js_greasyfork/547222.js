// ==UserScript==
// @name          DMM - Add Trash Guide Regex Buttons
// @version       3.3.2
// @description   Adds buttons to Debrid Media Manager for applying Trash Guide regex patterns.
// @author        Journey Over
// @license       MIT
// @match         *://debridmediamanager.com/*
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@9db06a14c296ae584e0723cde883729d819e0625/libs/dmm/button-data.min.js
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@0171b6b6f24caea737beafbc2a8dacd220b729d8/libs/utils/utils.min.js
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@644b86d55bf5816a4fa2a165bdb011ef7c22dfe1/libs/metadata/armhaglund/armhaglund.min.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @icon          https://www.google.com/s2/favicons?sz=64&domain=debridmediamanager.com
// @homepageURL   https://github.com/StylusThemes/Userscripts
// @namespace https://greasyfork.org/users/32214
// @downloadURL https://update.greasyfork.org/scripts/547222/DMM%20-%20Add%20Trash%20Guide%20Regex%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/547222/DMM%20-%20Add%20Trash%20Guide%20Regex%20Buttons.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const logger = Logger('DMM - Add Trash Guide Regex Buttons', { debug: false });

  const CONFIG = {
    // Page and DOM selectors
    RELEVANT_PAGE_RX: /^https:\/\/debridmediamanager\.com\/(movie|show)\/(tt\d+)(?:\/(\d+))?$/, // Pages where buttons should appear
    CONTAINER_SELECTOR: '.mb-2', // CSS selector for button container
    MAX_RETRIES: 20, // Max attempts to find container on SPA pages

    // UI styling
    CSS_CLASS_PREFIX: 'dmm-tg', // Prefix for all CSS classes to avoid conflicts

    // Storage keys
    QUALITY_OPTIONS_KEY: 'dmm-tg-quality-options', // Local storage key for selected quality options
    QUALITY_POLARITY_KEY: 'dmm-tg-quality-polarity', // Storage key for quality polarity (positive/negative)
    LOGIC_MODE_KEY: 'dmm-tg-logic-mode', // Storage key for AND/OR logic mode preference

    // Caching settings
    CACHE_KEY: 'cache',
    CACHE_PREFIX: 'dmm-anime-cache-',
    CACHE_LAST_CLEANUP_KEY: 'cache-last-cleanup',
    CACHE_DURATION: 24 * 60 * 60 * 1000,

    // Regex patterns for quality removal
    REGEX_PATTERNS: {
      AND_LOOKAHEAD: /\^(\(\?[\=!].*?\))+\.\*/,
      OR_ALTERNATION: /\|\([^)]+\)$/,
      QUALITY_GROUP: /^\([^)]+\)$/,
      NEGATIVE_LOOKAHEAD: /^\(\?[\=!].*?\)$/
    },

    // Timing settings
    POLLING_INTERVAL: 100,
    DEBOUNCE_DELAY: 50
  };

  const BUTTON_DATA = Array.isArray(window?.DMM_BUTTON_DATA) ? window.DMM_BUTTON_DATA : [];
  const armhaglund = new ArmHaglund();

  // Quality tokens for building regex patterns - each represents a quality indicator in filenames
  const QUALITY_TOKENS = [
    { key: '720p', name: '720p', values: ['720p'] },
    { key: '1080p', name: '1080p', values: ['1080p'] },
    { key: '4k', name: '4k', values: ['\\b4k\\b', '2160p'] },
    { key: 'dv', name: 'Dolby Vision', values: ['dovi', '\\bdv\\b', 'dolby', 'vision'] },
    { key: 'x264', name: 'x264', values: ['264'] },
    { key: 'x265', name: 'x265', values: ['265', '\\bHEVC\\b'] },
    { key: 'hdr', name: 'HDR', values: ['hdr'] },
    { key: 'remux', name: 'Remux', values: ['remux'] },
    { key: 'atmos', name: 'Atmos', values: ['atmos'] }
  ];

  const allQualityValues = QUALITY_TOKENS.flatMap(token => token.values);

  const getCachedAnimeData = async (imdbId) => {
    const cache = GM_getValue(CONFIG.CACHE_KEY) || {};
    if (typeof cache !== 'object' || Array.isArray(cache)) return null;
    const cacheKey = `${CONFIG.CACHE_PREFIX}${imdbId}`;
    const cached = cache[cacheKey];
    if (cached && (Date.now() - cached.timestamp) < CONFIG.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  };

  const fetchAnimeData = async (imdbId) => {
    try {
      const data = await armhaglund.fetchIds('imdb', imdbId);
      return data && data.anilist ? { isAnime: true, anilistId: data.anilist } : { isAnime: false, anilistId: null };
    } catch (error) {
      logger.debug(`Failed to fetch from ArmHaglund: ${error.message}`);
      return { isAnime: false, anilistId: null };
    }
  };

  const updateCache = async (imdbId, result) => {
    let cache = GM_getValue(CONFIG.CACHE_KEY) || {};
    if (typeof cache !== 'object' || Array.isArray(cache)) cache = {};
    const cacheKey = `${CONFIG.CACHE_PREFIX}${imdbId}`;
    cache[cacheKey] = { data: result, timestamp: Date.now() };

    // Cleanup old entries to prevent cache bloat
    const now = Date.now();
    const lastCleanup = GM_getValue(CONFIG.CACHE_LAST_CLEANUP_KEY) || 0;
    if (now - lastCleanup >= CONFIG.CACHE_DURATION) {
      let cleanedCount = 0;
      for (const [key, entry] of Object.entries(cache)) {
        if (key.startsWith(CONFIG.CACHE_PREFIX) && (now - entry.timestamp) > CONFIG.CACHE_DURATION) {
          delete cache[key];
          cleanedCount++;
        }
      }
      GM_setValue(CONFIG.CACHE_LAST_CLEANUP_KEY, now);
      if (cleanedCount > 0) {
        logger.debug(`Cache cleanup: Removed ${cleanedCount} expired entries`);
      }
    }
    GM_setValue(CONFIG.CACHE_KEY, cache);
  };

  const checkReleasesMoeExists = (anilistId) => {
    return new Promise((resolve) => {
      const apiUrl = `https://releases.moe/api/collections/entries/records?filter=alID=${anilistId}`;

      GM_xmlhttpRequest({
        method: 'GET',
        url: apiUrl,
        onload: (response) => {
          try {
            const data = JSON.parse(response.responseText);
            const exists = data.totalItems > 0;
            logger.debug(`Releases.moe: Anime ${anilistId} ${exists ? 'found' : 'not found'}`);
            resolve(exists);
          } catch (error) {
            logger.error(`Releases.moe API parse error for ${anilistId}:`, error);
            resolve(false);
          }
        },
        onerror: (error) => {
          logger.error(`Releases.moe API request failed for ${anilistId}:`, error);
          resolve(false);
        }
      });
    });
  };

  // Remove quality-related regex patterns while preserving user input
  // Handles both AND mode lookaheads (^.*(?=.*quality)) and OR mode alternations (|quality)
  const removeQualityFromRegex = (regex) => {
    if (!regex || typeof regex !== 'string') return '';

    let cleaned = regex;

    // Remove AND patterns: lookaheads at the beginning (after ^)
    const andMatch = cleaned.match(CONFIG.REGEX_PATTERNS.AND_LOOKAHEAD);
    if (andMatch && andMatch.index === 0) {
      const matched = andMatch[0];
      const hasQuality = allQualityValues.some(qualityValue => matched.includes(qualityValue));
      cleaned = hasQuality ? cleaned.replace(matched, '') : cleaned;
    }

    // Remove OR patterns: alternations at the end
    const orMatch = cleaned.match(CONFIG.REGEX_PATTERNS.OR_ALTERNATION);
    if (orMatch) {
      const matched = orMatch[0];
      const hasQuality = allQualityValues.some(qualityValue => matched.includes(qualityValue));
      if (hasQuality) {
        cleaned = cleaned.replace(matched, '');
      }
    }

    // Clear standalone quality patterns that contain known quality values
    if (cleaned.match(CONFIG.REGEX_PATTERNS.QUALITY_GROUP) || cleaned.match(CONFIG.REGEX_PATTERNS.NEGATIVE_LOOKAHEAD)) {
      const hasQuality = allQualityValues.some(qualityValue => cleaned.includes(qualityValue));
      if (hasQuality) {
        cleaned = '';
      }
    }

    return cleaned.trim();
  };

  // Build quality regex string based on selected options and logic mode
  // AND mode uses lookaheads (?=.*quality), OR mode uses alternations (quality|other)
  const buildQualityString = (selectedOptions, useAndLogic = false, qualityPolarity = new Map()) => {
    if (!selectedOptions.length) return '';

    const tokenValues = [];
    for (const optionKey of selectedOptions) {
      const token = QUALITY_TOKENS.find((qualityToken) => qualityToken.key === optionKey);
      if (token && token.values) tokenValues.push(token.values);
    }

    if (!tokenValues.length) return '';

    if (useAndLogic) {
      // AND logic: Each token uses positive or negative lookaheads based on polarity
      const lookaheads = selectedOptions.map((optionKey, index) => {
        const values = tokenValues[index];
        const isPositive = qualityPolarity.get(optionKey) !== false;
        const lookaheadType = isPositive ? '=' : '!';

        if (values.length === 1) {
          return `(?${lookaheadType}.*${values[0]})`;
        }
        // Multiple values for one token = internal OR with non-capturing group
        return `(?${lookaheadType}.*(?:${values.join('|')}))`;
      }).join('');
      return lookaheads;
    } else {
      // OR logic: Any token can match, flatten all values
      const flat = tokenValues.flat();
      return `(${flat.join('|')})`;
    }
  };

  const generateStyles = () => {
    const prefix = CONFIG.CSS_CLASS_PREFIX;
    return `
      .${prefix}-btn{cursor:pointer;display:inline-flex;align-items:center;gap:.35rem;margin-right:.5rem;padding:.25rem .5rem;font-size:12px;line-height:1;border-radius:.375rem;color:#e6f0ff;background:rgba(15,23,42,.5);border:1px solid rgba(59,130,246,.55);box-shadow:none;user-select:none;white-space:nowrap;}
      .${prefix}-btn:hover{background:rgba(59,130,246,.08);}
      .${prefix}-btn:focus{outline:2px solid rgba(59,130,246,.18);outline-offset:2px;}
      .${prefix}-chev{width:12px;height:12px;color:rgba(226,240,255,.95);margin-left:.15rem;display:inline-block;transition:transform 160ms ease;transform-origin:center;}
      .${prefix}-btn[aria-expanded="true"] .${prefix}-chev{transform:rotate(180deg);}
      .${prefix}-menu{position:absolute;min-width:10rem;background:#111827;color:#fff;border:1px solid rgba(148,163,184,.06);border-radius:.375rem;box-shadow:0 6px 18px rgba(2,6,23,.6);padding:.25rem 0;z-index:9999;display:none;}
      .${prefix}-menu::before{content:"";position:absolute;top:-6px;left:12px;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid #111827;}
      .${prefix}-item{padding:.45rem .75rem;cursor:pointer;font-size:13px;white-space:nowrap;border-bottom:1px solid rgba(255,255,255,.03);}
      .${prefix}-item:last-child{border-bottom:none;}
      .${prefix}-item:hover{background:#1f2937;}
      .${prefix}-quality-section{display:flex;align-items:center;gap:.75rem;margin-left:.75rem;padding-left:.75rem;border-left:1px solid rgba(148,163,184,.15);}
      .${prefix}-quality-grid{display:flex;flex-wrap:wrap;gap:.6rem;}
      .${prefix}-quality-item{display:inline-flex;align-items:center;font-size:12px;}
      .${prefix}-quality-button{padding:.25rem .5rem;border-radius:.375rem;border:1px solid rgba(148,163,184,.15);background:transparent;color:#e6f0ff;cursor:pointer;font-size:12px;line-height:1}
      .${prefix}-quality-button.active{background:#3b82f6;color:#fff;border-color:#3b82f6}
      .${prefix}-quality-button.active.negative{background:#dc2626;color:#fff;border-color:#dc2626}
      .${prefix}-quality-button:focus{outline:1px solid rgba(59,130,246,.5);}
      .${prefix}-quality-label{color:#e6f0ff;cursor:pointer;white-space:nowrap;}
      .${prefix}-logic-selector{margin-right:.75rem;padding-right:.75rem;border-right:1px solid rgba(148,163,184,.15);display:flex;align-items:center;}
      .${prefix}-logic-toggle{display:inline-flex;border:1px solid rgba(148,163,184,.4);border-radius:.375rem;overflow:hidden;}
      .${prefix}-logic-option{background:#1f2937;color:#e6f0ff;border:none;padding:.25rem .5rem;font-size:12px;cursor:pointer;transition:all 0.2s ease;line-height:1;display:flex;align-items:center;position:relative;}
      .${prefix}-logic-option:hover{background:#374151;}
      .${prefix}-logic-option.active{background:#3b82f6;color:#fff;border-left:1px solid #3b82f6;border-right:1px solid #3b82f6;margin-left:-1px;margin-right:-1px;z-index:1;}
      .${prefix}-logic-option:focus{outline:1px solid rgba(59,130,246,.5);}
      .${prefix}-help-icon{background:#1f2937;color:#e6f0ff;border:1px solid rgba(148,163,184,.4);border-radius:50%;width:16px;height:16px;font-size:11px;cursor:help;margin-left:.25rem;display:inline-flex;align-items:center;justify-content:center;font-weight:bold;}
      .${prefix}-help-icon:hover{background:#374151;}
      /* DMM Fixes below */
      h2.line-clamp-2{display:block!important;-webkit-line-clamp:unset!important;-webkit-box-orient:unset!important;overflow:visible!important;text-overflow:unset!important;white-space:normal!important;} /* show full title without truncation */
    `;
  };

  (function injectStyles() {
    const style = document.createElement('style');
    style.textContent = generateStyles();
    document.head.appendChild(style);
  })();

  class QualityManager {
    constructor() {
      this.state = {
        selectedOptions: [],
        qualityPolarity: new Map(),
        useAndLogic: false
      };
      this.container = null;
      this.buttons = new Map();
      this.logicSelect = null;
    }

    getInputElement(scope = this.container) {
      const primary = document.getElementById('query');
      if (this.isInputUsable(primary)) return primary;

      if (scope) {
        const scoped = scope.querySelector('input, textarea');
        if (this.isInputUsable(scoped)) return scoped;
      }

      const candidates = document.querySelectorAll('input, textarea');
      for (const candidate of candidates) {
        if (this.isInputUsable(candidate)) return candidate;
      }

      return null;
    }

    isInputUsable(element) {
      if (!element) return false;
      if (element.disabled) return false;
      const style = getComputedStyle(element);
      return (
        element.offsetParent !== null &&
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        style.opacity !== '0'
      );
    }

    writeToInput(element, value) {
      if (!element) return;

      const stringValue = typeof value === 'string' ? value : String(value ?? '');
      const proto = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;

      if (nativeSetter) {
        nativeSetter.call(element, stringValue);
      } else {
        element.value = stringValue;
      }

      try {
        element.focus();
        if (typeof element.setSelectionRange === 'function') {
          element.setSelectionRange(stringValue.length, stringValue.length);
        }
      } catch {
        /* ignore focus errors */
      }

      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));

      try {
        element._valueTracker?.setValue?.(stringValue);
      } catch {
        /* ignore React internals */
      }
    }

    async initialize(container) {
      this.container = container;
      this.createQualitySection();
      await this.loadPersistedSettings();
      this.restoreStates();

      // Auto-apply quality options if any are selected
      if (this.state.selectedOptions.length > 0) {
        setTimeout(() => this.updateInputWithQualityOptions(), 50);
      }
    }

    async loadPersistedSettings() {
      try {
        const stored = GM_getValue(CONFIG.QUALITY_OPTIONS_KEY, null);
        this.state.selectedOptions = stored ? JSON.parse(stored) : [];

        const polarityStored = GM_getValue(CONFIG.QUALITY_POLARITY_KEY, null);
        const polarityData = polarityStored ? JSON.parse(polarityStored) : {};
        this.state.qualityPolarity = new Map(Object.entries(polarityData));

        const logicStored = GM_getValue(CONFIG.LOGIC_MODE_KEY, null);
        this.state.useAndLogic = logicStored ? JSON.parse(logicStored) : false;
      } catch (error) {
        logger.error('Failed to load quality options:', error);
        this.state = { selectedOptions: [], qualityPolarity: new Map(), useAndLogic: false };
      }
    }

    createQualitySection() {
      if (!this.container) return;

      const existing = this.container.querySelector(`.${CONFIG.CSS_CLASS_PREFIX}-quality-section`);
      if (existing) {
        logger.debug('Quality section already exists');
        return;
      }

      const section = document.createElement('div');
      section.className = `${CONFIG.CSS_CLASS_PREFIX}-quality-section`;

      const logicSelector = document.createElement('div');
      logicSelector.className = `${CONFIG.CSS_CLASS_PREFIX}-logic-selector`;

      const logicSelect = document.createElement('div');
      logicSelect.className = `${CONFIG.CSS_CLASS_PREFIX}-logic-toggle`;
      logicSelect.setAttribute('tabindex', '0');
      logicSelect.innerHTML = `
        <button type="button" class="${CONFIG.CSS_CLASS_PREFIX}-logic-option active" data-mode="or">OR</button>
        <button type="button" class="${CONFIG.CSS_CLASS_PREFIX}-logic-option" data-mode="and">AND</button>
      `;
      logicSelect.addEventListener('click', (event_) => this.onLogicToggle(event_));

      const helpIcon = document.createElement('button');
      helpIcon.type = 'button';
      helpIcon.className = `${CONFIG.CSS_CLASS_PREFIX}-help-icon`;
      helpIcon.textContent = '?';
      helpIcon.title = `Logic Modes:\n\nOR Mode: Match ANY selected quality\nExample: (720p|1080p) - matches files with 720p OR 1080p\n\nAND Mode: Match ALL selected qualities (advanced filtering)\n- Requires EVERY selected quality to be present in the filename\n- Useful for precise filtering, e.g., only 1080p remux files\nExample: (?=.*1080p)(?=.*remux) - matches files with BOTH 1080p AND remux\n\nNegative Matching in AND Mode:\n- Click a quality button twice to exclude it\n- Creates a negative lookahead: (?!.*quality)\nExample: (?=.*1080p)(?!.*720p) - requires 1080p but excludes 720p\n\nTip: AND mode is powerful for complex filters but may match fewer files`;

      logicSelector.appendChild(logicSelect);
      logicSelector.appendChild(helpIcon);
      this.logicSelect = logicSelect;

      const grid = document.createElement('div');
      grid.className = `${CONFIG.CSS_CLASS_PREFIX}-quality-grid`;

      for (const token of QUALITY_TOKENS) {
        const item = document.createElement('div');
        item.className = `${CONFIG.CSS_CLASS_PREFIX}-quality-item`;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = `${CONFIG.CSS_CLASS_PREFIX}-quality-button`;
        button.id = `${CONFIG.CSS_CLASS_PREFIX}-${token.key}`;
        button.textContent = token.name;
        button.addEventListener('click', () => this.onToggleOption(token.key, button));

        item.appendChild(button);
        grid.appendChild(item);

        this.buttons.set(token.key, button);
      }

      section.appendChild(logicSelector);
      section.appendChild(grid);
      this.container.appendChild(section);
    }

    restoreStates() {
      for (const key of this.state.selectedOptions) {
        const button = this.buttons.get(key);
        if (button) {
          button.classList.add('active');
          if (this.state.useAndLogic) {
            const isPositive = this.state.qualityPolarity.get(key) !== false;
            if (!isPositive) {
              button.classList.add('negative');
            }
          }
        }
      }

      if (this.logicSelect) {
        const allOptions = this.logicSelect.querySelectorAll(`.${CONFIG.CSS_CLASS_PREFIX}-logic-option`);
        for (const option of allOptions) {
          option.classList.remove('active');
          if ((option.dataset.mode === 'and' && this.state.useAndLogic) ||
            (option.dataset.mode === 'or' && !this.state.useAndLogic)) {
            option.classList.add('active');
          }
        }
      }
    }

    async onLogicToggle(event_) {
      event_.preventDefault();
      event_.stopPropagation();

      const target = event_.target;
      if (!target.classList.contains(`${CONFIG.CSS_CLASS_PREFIX}-logic-option`)) return;

      const mode = target.dataset.mode;
      const useAndLogic = mode === 'and';

      const allOptions = this.logicSelect.querySelectorAll(`.${CONFIG.CSS_CLASS_PREFIX}-logic-option`);
      for (const option of allOptions) option.classList.remove('active');
      target.classList.add('active');

      await this.onLogicChange(useAndLogic);
    }

    async onLogicChange(useAndLogic) {
      // Clean existing patterns before switching modes to prevent regex conflicts
      const target = this.getInputElement();
      if (target) {
        const currentValue = target.value || '';
        const cleanedValue = removeQualityFromRegex(currentValue);
        this.writeToInput(target, cleanedValue);
      }

      this.state.useAndLogic = useAndLogic;

      // Update button visual states based on new mode
      for (const key of this.state.selectedOptions) {
        const button = this.buttons.get(key);
        if (button) {
          if (useAndLogic) {
            const isPositive = this.state.qualityPolarity.get(key) !== false;
            if (!isPositive) {
              button.classList.add('negative');
            }
          } else {
            button.classList.remove('negative');
          }
        }
      }

      try {
        GM_setValue(CONFIG.LOGIC_MODE_KEY, JSON.stringify(this.state.useAndLogic));
      } catch (error) {
        logger.error('Failed to save logic mode:', error);
      }

      this.updateInputWithQualityOptions();
    }

    // Toggle behavior differs by mode: OR mode (off->on->off), AND mode (off->positive->negative->off)
    onToggleOption(key, button) {
      const isActive = button.classList.contains('active');
      const isNegative = button.classList.contains('negative');

      if (!isActive && !isNegative) {
        this._activateOption(key, button);
      } else if (isActive && !isNegative) {
        if (this.state.useAndLogic) {
          this._makeNegative(key, button);
        } else {
          this._deactivateOption(key, button);
        }
      } else {
        this._deactivateOption(key, button);
      }

      this._saveOptions();
      this.updateInputWithQualityOptions();
    }

    _activateOption(key, button) {
      button.classList.add('active');
      if (!this.state.selectedOptions.includes(key)) {
        this.state.selectedOptions.push(key);
      }
      if (this.state.useAndLogic) {
        this.state.qualityPolarity.set(key, true);
      }
    }

    _makeNegative(key, button) {
      button.classList.add('negative');
      this.state.qualityPolarity.set(key, false);
    }

    _deactivateOption(key, button) {
      button.classList.remove('active');
      button.classList.remove('negative');
      const index = this.state.selectedOptions.indexOf(key);
      if (index > -1) {
        this.state.selectedOptions.splice(index, 1);
      }
      this.state.qualityPolarity.delete(key);
    }

    async _saveOptions() {
      try {
        GM_setValue(CONFIG.QUALITY_OPTIONS_KEY, JSON.stringify(this.state.selectedOptions));
        GM_setValue(CONFIG.QUALITY_POLARITY_KEY, JSON.stringify(Object.fromEntries(this.state.qualityPolarity)));
      } catch (error) {
        logger.error('Failed to save quality options:', error);
      }
    }

    updateInputWithQualityOptions() {
      const target = this.getInputElement();
      if (!target) return;

      const currentValue = target.value || '';
      const qualityString = buildQualityString(this.state.selectedOptions, this.state.useAndLogic, this.state.qualityPolarity);

      let newValue;
      if (qualityString) {
        const cleanedBase = removeQualityFromRegex(currentValue);
        if (this.state.useAndLogic) {
          newValue = cleanedBase ? `^${qualityString}.*${cleanedBase}` : `^${qualityString}.*`;
        } else {
          newValue = cleanedBase ? `${cleanedBase}|${qualityString}` : qualityString;
        }
      } else {
        newValue = removeQualityFromRegex(currentValue);
      }

      this.writeToInput(target, newValue);
    }

    applyQualityOptionsToValue(baseValue) {
      const qualityString = buildQualityString(this.state.selectedOptions, this.state.useAndLogic, this.state.qualityPolarity);
      if (!qualityString) return baseValue;

      const cleanedBase = removeQualityFromRegex(baseValue);

      if (this.state.useAndLogic) {
        return cleanedBase ? `^${qualityString}.*${cleanedBase}` : `^${qualityString}.*`;
      } else {
        return cleanedBase ? `${cleanedBase}|${qualityString}` : qualityString;
      }
    }

    cleanup() {
      this.buttons.clear();
      this.state.qualityPolarity.clear();
      if (this.container) {
        const existing = this.container?.querySelector(`.${CONFIG.CSS_CLASS_PREFIX}-quality-section`);
        if (existing) existing.remove();
      }
    }
  }

  class ButtonManager {
    constructor() {
      this.dropdowns = new Map();
      this.container = null;
      this.openMenu = null;
      this.qualityManager = new QualityManager();
      this.listenersAttached = false;
      this.cachedTargetInput = null;

      this.documentClickHandler = this.onDocumentClick.bind(this);
      this.resizeHandler = this.onWindowResize.bind(this);
      this.keydownHandler = this.onDocumentKeydown.bind(this);
    }

    cleanup() {
      for (const { button, menu } of this.dropdowns.values()) {
        button.remove();
        menu.remove();
      }
      this.dropdowns.clear();
      this.qualityManager.cleanup();
      this.container = null;
      this.openMenu = null;

      if (this.listenersAttached) {
        document.removeEventListener('click', this.documentClickHandler, true);
        document.removeEventListener('keydown', this.keydownHandler);
        window.removeEventListener('resize', this.resizeHandler);
        this.listenersAttached = false;
      }
    }

    async initialize(container) {
      if (!container) return;
      logger.debug('ButtonManager initialized', { container: !!container, sameContainer: this.container === container });

      // Check if buttons are already present to avoid re-adding during content re-renders
      const existingButtons = container.querySelectorAll(`.${CONFIG.CSS_CLASS_PREFIX}-btn`);
      if (existingButtons.length > 0) {
        logger.debug('Buttons already exist, skipping initialization');
        this.container = container;
        this.cachedContainer = container;
        return;
      }

      this.cleanup();
      this.container = container;
      this.cachedContainer = container;

      for (const spec of BUTTON_DATA) {
        const name = String(spec.name || 'Pattern');
        if (this.dropdowns.has(name)) continue;

        const button = this._createButton(name);
        const menu = this._createMenu(spec.buttonData || [], name);

        document.body.appendChild(menu);
        this.container.appendChild(button);
        this.dropdowns.set(name, { button: button, menu });

        button.addEventListener('click', (event_) => {
          event_.stopPropagation();
          this.toggleMenu(name);
        });
      }

      await this.qualityManager.initialize(container);
      logger.debug('Created dropdown buttons:', { count: this.dropdowns.size });

      await this.detectExternalLinksForCurrentPage();

      if (!this.listenersAttached) {
        document.addEventListener('click', this.documentClickHandler, true);
        document.addEventListener('keydown', this.keydownHandler);
        window.addEventListener('resize', this.resizeHandler);
        this.listenersAttached = true;
      }
    }

    onDocumentKeydown(event_) {
      if (!this.openMenu) return;
      if (event_.key === 'Escape' || event_.key === 'Esc') {
        event_.preventDefault();
        this.closeOpenMenu();
      }
    }

    _createButton(name) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `${CONFIG.CSS_CLASS_PREFIX}-btn`;
      button.appendChild(document.createTextNode(name));

      const svgNs = 'http://www.w3.org/2000/svg';
      const chevron = document.createElementNS(svgNs, 'svg');
      chevron.setAttribute('viewBox', '0 0 20 20');
      chevron.setAttribute('aria-hidden', 'true');
      chevron.setAttribute('class', `${CONFIG.CSS_CLASS_PREFIX}-chev`);
      chevron.innerHTML = '<path d="M6 8l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />';
      button.appendChild(chevron);

      button.setAttribute('aria-haspopup', 'true');
      button.setAttribute('aria-expanded', 'false');
      button.tabIndex = 0;
      return button;
    }

    _createMenu(items = [], name) {
      const menu = document.createElement('div');
      menu.className = `${CONFIG.CSS_CLASS_PREFIX}-menu`;
      menu.dataset.owner = name;

      for (const item of items) {
        const menuItem = document.createElement('div');
        menuItem.className = `${CONFIG.CSS_CLASS_PREFIX}-item`;
        menuItem.textContent = item.name || item.value || 'apply';
        menuItem.addEventListener('click', (event_) => {
          event_.stopPropagation();
          this.onSelectPattern(item.value, item.name);
          this.closeOpenMenu();
        });
        menu.appendChild(menuItem);
      }

      return menu;
    }

    toggleMenu(name) {
      const entry = this.dropdowns.get(name);
      if (!entry) return;
      const { button, menu } = entry;

      if (this.openMenu && this.openMenu !== menu) this.openMenu.style.display = 'none';

      if (menu.style.display === 'block') {
        menu.style.display = 'none';
        button.setAttribute('aria-expanded', 'false');
        this.openMenu = null;
      } else {
        this.positionMenuUnderButton(menu, button);
        menu.style.display = 'block';
        button.setAttribute('aria-expanded', 'true');
        this.openMenu = menu;
      }
    }

    positionMenuUnderButton(menu, button) {
      const rect = button.getBoundingClientRect();
      const left = Math.max(8, rect.left);
      const top = window.scrollY + rect.bottom + 6;
      menu.style.left = `${left}px`;
      menu.style.top = `${top}px`;
    }

    onDocumentClick(event_) {
      if (!this.openMenu) return;
      const target = event_.target;
      const matchingButton = [...this.dropdowns.values()].find((value) => value.menu === this.openMenu)?.button;
      if (matchingButton && (matchingButton.contains(target) || this.openMenu.contains(target))) return;
      this.closeOpenMenu();
    }

    onWindowResize() {
      if (!this.openMenu) return;
      const owner = this.openMenu.dataset.owner;
      const entry = this.dropdowns.get(owner);
      if (entry) this.positionMenuUnderButton(entry.menu, entry.button);
    }

    closeOpenMenu() {
      if (!this.openMenu) return;
      const owner = this.openMenu.dataset.owner;
      const entry = this.dropdowns.get(owner);
      if (entry) entry.button.setAttribute('aria-expanded', 'false');
      this.openMenu.style.display = 'none';
      this.openMenu = null;
    }

    onSelectPattern(value, name) {
      let target = this.cachedTargetInput;
      if (!target || !document.contains(target)) {
        target = this.qualityManager.getInputElement(this.cachedContainer || this.container);
        this.cachedTargetInput = target;
      }

      if (!target) {
        logger.error('Could not find target input element:', { name, value });
        return;
      }

      try {
        const finalValue = this.qualityManager.applyQualityOptionsToValue(value || '');
        logger.debug('Applied pattern to input:', { name, value, finalValue, targetId: target.id || null });
        this.qualityManager.writeToInput(target, finalValue);
      } catch (error) {
        logger.error('Failed to set input value:', error, {
          value,
          name,
          target: target?.id || target?.className || 'unknown'
        });
      }
    }

    async detectExternalLinksForCurrentPage() {
      try {
        const urlMatch = location.pathname.match(/\/(movie|show)\/(tt\d+)/);
        if (!urlMatch) {
          logger.debug('Could not extract IMDB ID from URL:', location.pathname);
          return;
        }
        const mediaType = urlMatch[1]; // 'movie' or 'show'
        const imdbId = urlMatch[2]; // IMDB ID like 'tt0111161'

        this.createTraktButton(imdbId, mediaType);
        await this.detectAnimeForCurrentPage(imdbId);
      } catch (error) {
        logger.error(`External links detection failed for ${location.href}:`, error);
      }
    }

    async detectAnimeForCurrentPage(imdbId) {
      try {
        const cachedData = await getCachedAnimeData(imdbId);
        if (cachedData) {
          logger.debug(`Anime cache hit for ${imdbId}`);
          this.handleAnimeResult(cachedData);
          return;
        }

        logger.debug(`Anime cache miss for ${imdbId}, fetching from APIs`);

        const result = await fetchAnimeData(imdbId);
        if (result.isAnime && result.anilistId) {
          const releasesExists = await checkReleasesMoeExists(result.anilistId);
          const fullResult = { ...result, releasesExists };
          await updateCache(imdbId, fullResult);

          if (releasesExists) {
            this.createReleasesMoeButton(result.anilistId);
          }
        } else {
          const fullResult = { ...result, releasesExists: false };
          await updateCache(imdbId, fullResult);
        }
      } catch (error) {
        logger.error(`Anime detection failed for ${imdbId}:`, error);
        this.handleAnimeResult({ isAnime: false, anilistId: null, releasesExists: false });
      }
    }

    handleAnimeResult(result) {
      const { isAnime, anilistId, releasesExists } = result;
      if (isAnime && anilistId && releasesExists !== false) {
        logger.debug('Anime detected with Releases.moe availability', { anilistId, releasesExists });
        this.createReleasesMoeButton(anilistId);
      } else if (isAnime && anilistId && releasesExists === false) {
        logger.debug('Anime detected but not available on Releases.moe', { anilistId });
      } else if (isAnime && !anilistId) {
        logger.debug('Anime detected but no AniList ID found');
      } else {
        logger.debug('Non-anime content detected');
      }
    }

    createExternalLinkButton({ link, iconUrl, iconAlt, label, className, existingSelector, debugName }) {
      const existingButton = document.querySelector(existingSelector);
      if (existingButton) {
        logger.debug(`${debugName} button already exists, skipping creation`);
        return existingButton;
      }

      logger.debug(`Created ${debugName} button:`, { link });
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `${className}`;
      button.setAttribute('data-url', link);
      button.innerHTML = `<b class="flex items-center justify-center"><img src="${iconUrl}" class="mr-1 h-3 w-3" alt="${iconAlt}">${label}</b>`;
      button.addEventListener('click', () => {
        window.open(link, '_blank', 'noopener,noreferrer');
      });

      const buttonContainer = document.querySelector('.grid > div:last-child');
      if (buttonContainer) {
        buttonContainer.appendChild(button);
        logger.debug(`${debugName} button added to container`);
        return button;
      } else {
        logger.warn(`${debugName} button container not found`);
        return null;
      }
    }

    createReleasesMoeButton(anilistId) {
      const link = `https://releases.moe/${anilistId}/`;
      return this.createExternalLinkButton({
        link,
        iconUrl: 'https://www.google.com/s2/favicons?sz=64&domain=releases.moe',
        iconAlt: 'SeaDex icon',
        label: 'SeaDex',
        className: 'mb-1 mr-2 mt-0 rounded border-2 border-pink-500 bg-pink-900/30 p-1 text-xs text-pink-100 transition-colors hover:bg-pink-800/50',
        existingSelector: `button[data-url="${link}"]`,
        debugName: 'Releases.moe'
      });
    }

    createTraktButton(imdbId, mediaType) {
      const link = `https://trakt.tv/${mediaType}s/${imdbId}`;
      return this.createExternalLinkButton({
        link,
        iconUrl: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/trakt.svg',
        iconAlt: 'Trakt icon',
        label: 'Trakt',
        className: 'mb-1 mr-2 mt-0 rounded border-2 border-red-500 bg-red-900/30 p-1 text-xs text-red-100 transition-colors hover:bg-red-800/50',
        existingSelector: `button[data-url="${link}"]`,
        debugName: 'Trakt.tv'
      });
    }
  }

  class PageManager {
    constructor() {
      this.buttonManager = new ButtonManager();
      this.lastUrl = location.href;
      this.retry = 0;
      this.mutationObserver = null;
      this.lastProcessedUrl = null;
      this.cachedContainer = null;
      this.pollingInterval = null;
      this.initializedForUrl = null;
      this.initializing = false;

      this.debouncedCheck = debounce(this.checkPage.bind(this), CONFIG.DEBOUNCE_DELAY);

      this.setupNavigationDetection();
      this.setupMutationObserver();
      this.checkPage();
    }

    isRelevantPage(url) {
      return CONFIG.RELEVANT_PAGE_RX.test(url);
    }

    getContainer() {
      let container = this.cachedContainer;
      if (!container || !document.contains(container)) {
        container = document.querySelector(CONFIG.CONTAINER_SELECTOR);
        this.cachedContainer = container;
      }
      return container;
    }

    handleRetry() {
      if (this.retry < CONFIG.MAX_RETRIES) {
        this.retry++;
        this.debouncedCheck();
      } else {
        this.retry = 0;
      }
    }

    // Sets up navigation detection using event listeners and polling for SPA navigation
    setupNavigationDetection() {
      window.addEventListener('popstate', () => {
        this.buttonManager.cleanup();
        this.lastProcessedUrl = null;
        this.initializedForUrl = null;
        this.initializing = false;
        this.debouncedCheck();
      });
      window.addEventListener('hashchange', () => {
        this.buttonManager.cleanup();
        this.lastProcessedUrl = null;
        this.initializedForUrl = null;
        this.initializing = false;
        this.debouncedCheck();
      });

      // Poll for URL changes to detect SPA navigation that doesn't trigger events
      this.pollingInterval = setInterval(() => {
        if (location.href !== this.lastUrl) {
          this.buttonManager.cleanup();
          this.lastProcessedUrl = null;
          this.initializedForUrl = null;
          this.initializing = false;
          this.debouncedCheck();
          this.lastUrl = location.href;
        }
      }, CONFIG.POLLING_INTERVAL);
    }

    setupMutationObserver() {
      if (this.mutationObserver) this.mutationObserver.disconnect();
      this.mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            this.debouncedCheck();
            break;
          }
        }
      });
      this.mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: false });
    }

    async checkPage() {
      const url = location.href;

      if (this.initializing || this.initializedForUrl === url) return;
      this.initializing = true;

      if (!this.isRelevantPage(url)) {
        this.buttonManager.cleanup();
        this.lastUrl = url;
        this.initializing = false;
        return;
      }

      const container = this.getContainer();
      if (!container) {
        this.handleRetry();
        this.initializing = false;
        return;
      }

      this.retry = 0;

      await this.buttonManager.initialize(container);
      this.initializing = false;
      this.initializedForUrl = url;
      this.lastProcessedUrl = url;
      this.lastUrl = url;
    }

    cleanup() {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
      this.buttonManager.cleanup();
    }
  }

  function initialize() {
    try {
      if (!BUTTON_DATA.length) return;
      new PageManager();
    } catch (error) {
      logger.error('Load error:', error);
    }
  }

  if (document.readyState !== 'loading') {
    initialize();
  } else {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  }
})();
