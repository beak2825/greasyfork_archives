// ==UserScript==
// @name         Filterblade 中文化工具 
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Filterblade 中文化工具 Sab.
// @author       Sab
// @match        https://www.filterblade.xyz/*
// @match        https://poe2filter.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      raw.githubusercontent.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544318/Filterblade%20%E4%B8%AD%E6%96%87%E5%8C%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/544318/Filterblade%20%E4%B8%AD%E6%96%87%E5%8C%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/**
 * @typedef {Object} TranslationEntry
 * @property {string} original
 * @property {string} translated
 */

/**
 * @typedef {Object} SearchResult
 * @property {string} original
 * @property {string} translated
 * @property {number} score
 */

(function () {
  'use strict';

  // ==========================================
  // Core Configuration & Constants
  // ==========================================
  const CONFIG = {
    URLS: {
      POE1: 'https://raw.githubusercontent.com/sab9527/sab9527.github.io/refs/heads/main/tools/filterchinese/20250722.json',
      POE2: 'https://raw.githubusercontent.com/sab9527/sab9527.github.io/refs/heads/main/tools/filterchinese/POE2.json'
    },
    SELECTORS: {
      OVERLAY_TARGET: '.ItemProgression_ItemLabel',
      OVERLAY_CLASS: 'translation-overlay-parent'
    },
    PERFORMANCE: {
      SEARCH_DEBOUNCE: 300,
      TRANSITION_DURATION: 300
    },
    SEARCH: {
      MAX_CHINESE_LENGTH: 13
    }
  };

  // ==========================================
  // Web Worker for Search & Data Processing
  // ==========================================
  const WORKER_CODE = `
    self.onmessage = function(e) {
      const { type, payload } = e.data;
      
      if (type === 'INIT') {
        self.translationMap = new Map(payload);
        self.reverseMap = new Map();
        self.searchIndex = [];
        
        for (const [key, value] of self.translationMap.entries()) {
          self.reverseMap.set(value, key);
          // Pre-filter or just store everything? Storing everything allows dynamic filtering if rules change.
          // But for now, we build the index.
          self.searchIndex.push({ o: key.toLowerCase(), t: value, k: key });
        }
        
        self.postMessage({ type: 'INIT_COMPLETE' });
      } 
      else if (type === 'SEARCH') {
        const query = payload.toLowerCase();
        if (!query) {
          self.postMessage({ type: 'SEARCH_RESULT', payload: [] });
          return;
        }
        
        // Filter logic:
        // 1. Translated text length must be <= 13
        // 2. Exclude items containing specific symbols: > = < ? .
        // 3. Match query in original or translated text
        const results = self.searchIndex
          .filter(item => {
             if (item.t.length > 13) return false;
             if (/[>=<?.]/.test(item.o) || /[>=<?.]/.test(item.t)) return false;
             return item.o.includes(query) || item.t.includes(query);
          })
          .slice(0, 10)
          .map(item => ({ original: item.k, translated: item.t }));
          
        self.postMessage({ type: 'SEARCH_RESULT', payload: results });
      }
    };
  `;

  // ==========================================
  // Utility Classes
  // ==========================================
  class Utils {
    static normalizeText(text) {
      return text ? text.trim() : '';
    }

    static debounce(func, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }

    static createWorker(code) {
      const blob = new Blob([code], { type: 'application/javascript' });
      return new Worker(URL.createObjectURL(blob));
    }

    static downloadJson(filename, content) {
      const blob = new Blob([content], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 100);
    }
  }

  // ==========================================
  // Data Manager (ES Module Style)
  // ==========================================
  class DataManager {
    constructor() {
      this.data = new Map();
      this.reverseData = new Map(); // For toggling back
    }

    async init() {
      const preferredGame = this._getPreferredGame();
      console.log(`[DataManager] Preferred Game: ${preferredGame}`);

      const urls = preferredGame === 'Poe2'
        ? [CONFIG.URLS.POE1, CONFIG.URLS.POE2]
        : [CONFIG.URLS.POE2, CONFIG.URLS.POE1];

      const results = await Promise.all(urls.map(url => this._fetchJson(url)));

      this.data.clear();
      this.reverseData.clear();

      results.forEach(json => {
        if (!json) return;
        for (const [original, translated] of json) {
          const normOriginal = Utils.normalizeText(original);
          this.data.set(normOriginal, translated);
          if (!this.reverseData.has(translated)) {
            this.reverseData.set(translated, normOriginal);
          }
        }
      });

      console.log(`[DataManager] Loaded ${this.data.size} entries.`);
      return Array.from(this.data.entries());
    }

    _getPreferredGame() {
      const params = new URLSearchParams(window.location.search);
      const host = window.location.hostname;
      if (host.includes('poe2filter.com')) return 'Poe2';
      return params.get('game') === 'Poe2' ? 'Poe2' : 'Poe1';
    }

    _fetchJson(url) {
      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: `${url}?_t=${Date.now()}`,
          onload: (res) => {
            try {
              resolve(JSON.parse(res.responseText));
            } catch (e) {
              console.error(`[DataManager] JSON Parse Error: ${url}`, e);
              resolve([]);
            }
          },
          onerror: (err) => {
            console.error(`[DataManager] Network Error: ${url}`, err);
            resolve([]);
          }
        });
      });
    }

    getTranslation(text) {
      return this.data.get(text);
    }

    getOriginal(text) {
      return this.reverseData.get(text);
    }
  }

  // ==========================================
  // DOM Handler (TreeWalker & Performance)
  // ==========================================
  class DOMHandler {
    constructor(dataManager) {
      this.dataManager = dataManager;
      this.observer = null;
      this.isTranslated = false;
    }

    enable() {
      if (this.isTranslated) return;
      this.processRoot(document.body, true);
      this._startObserver();
      this.isTranslated = true;
    }

    disable() {
      if (!this.isTranslated) return;
      this._stopObserver();
      this.processRoot(document.body, false);
      this.isTranslated = false;
    }

    processRoot(root, toTranslated) {
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        null,
        false
      );

      let node;
      while (node = walker.nextNode()) {
        if (node.nodeType === Node.TEXT_NODE) {
          this._handleTextNode(node, toTranslated);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          this._handleElementNode(node, toTranslated);
        }
      }
    }

    _handleTextNode(node, toTranslated) {
      const text = Utils.normalizeText(node.nodeValue);
      if (!text) return;

      const parent = node.parentNode;
      const isOverlayTarget = parent && parent.classList.contains('ItemProgression_ItemLabel');

      if (toTranslated) {
        const translated = this.dataManager.getTranslation(text);
        if (!translated) return;

        if (isOverlayTarget) {
          if (!parent.classList.contains(CONFIG.SELECTORS.OVERLAY_CLASS)) {
            const originalColor = window.getComputedStyle(parent).color;
            parent.classList.add(CONFIG.SELECTORS.OVERLAY_CLASS);
            parent.dataset.translation = translated;
            parent.style.setProperty('--original-text-color', originalColor);
          }
        } else {
          node.nodeValue = translated;
        }
      } else {
        // Restore
        if (isOverlayTarget) {
          parent.classList.remove(CONFIG.SELECTORS.OVERLAY_CLASS);
          delete parent.dataset.translation;
          parent.style.removeProperty('--original-text-color');
        } else {
          const original = this.dataManager.getOriginal(text);
          if (original) {
            node.nodeValue = original;
          }
        }
      }
    }

    _handleElementNode(node, toTranslated) {
      // Reserved for future element-specific logic
    }

    _startObserver() {
      if (this.observer) return;
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.processRoot(node, true);
            } else if (node.nodeType === Node.TEXT_NODE) {
              this._handleTextNode(node, true);
            }
          });
        });
      });
      this.observer.observe(document.body, { childList: true, subtree: true });
    }

    _stopObserver() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    }

    collectUntranslated() {
      const textsSet = new Set();
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let node;
      while (node = walker.nextNode()) {
        const text = Utils.normalizeText(node.nodeValue);
        // Filter logic:
        // 1. Must have content
        // 2. Not already in data (dataManager.getTranslation(text) returns undefined if not found)
        // 3. Not containing Chinese (assuming it's already translated or is Chinese UI)
        // 4. Not purely digits
        // 5. Not inside an overlay parent (though TreeWalker hits text nodes, we check parent)

        if (
          text &&
          !this.dataManager.getTranslation(text) &&
          !/[\u4e00-\u9fa5]/.test(text) &&
          !/^\d+$/.test(text)
        ) {
          const parent = node.parentNode;
          if (parent && parent.classList.contains(CONFIG.SELECTORS.OVERLAY_CLASS)) continue;

          textsSet.add(text);
        }
      }
      return Array.from(textsSet).map((txt) => [txt, ""]);
    }
  }

  // ==========================================
  // Web Component: UI Widget
  // ==========================================
  class TranslationWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.state = {
        enabled: true,
        searchResults: [],
        isSearching: false
      };
    }

    connectedCallback() {
      this.render();
      this.setupEvents();
    }

    set onToggle(callback) {
      this._onToggle = callback;
    }

    set onSearch(callback) {
      this._onSearch = callback;
    }

    updateSearchResults(results) {
      this.state.searchResults = results;
      this.renderResults();
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            font-family: 'Segoe UI', sans-serif;
            --primary-color: #4CAF50;
            --bg-color: rgba(33, 33, 33, 0.95);
            --text-color: #eee;
          }
          .container {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
          }
          .controls {
            display: flex;
            gap: 10px;
            background: var(--bg-color);
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255,255,255,0.1);
          }
          
          /* Tooltip Styles */
          .tooltip-container {
            position: relative;
          }
          .tooltip-container:hover::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 120%;
            left: 50%;
            transform: translateX(-50%);
            background: #222;
            color: #fff;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 1;
            border: 1px solid #555;
            box-shadow: 0 2px 5px rgba(0,0,0,0.5);
            z-index: 10000;
          }

          button {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          button:hover {
            background: #45a049;
            transform: translateY(-1px);
          }
          button.inactive {
            background: #757575;
          }
          
          .search-box {
            position: relative;
            display: flex;
            align-items: center;
          }
          input {
            background: #424242;
            border: 1px solid #616161;
            color: white;
            padding: 8px;
            border-radius: 4px;
            outline: none;
            width: 150px;
            transition: width 0.3s;
          }
          input:focus {
            width: 200px;
            border-color: var(--primary-color);
          }
          
          .results-popover {
            position: absolute;
            bottom: 100%;
            right: 0;
            width: 300px;
            background: #333;
            border: 1px solid #555;
            border-radius: 4px;
            margin-bottom: 5px;
            max-height: 400px;
            overflow-y: auto;
            display: none;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
          }
          .results-popover.visible {
            display: block;
          }
          
          .result-item {
            padding: 8px 12px;
            border-bottom: 1px solid #444;
            color: #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .result-item:last-child {
            border-bottom: none;
          }
          .result-item:hover {
            background: #444;
          }
          
          .result-content {
            flex: 1;
            margin-right: 10px;
          }
          .result-original {
            font-size: 0.9em;
            color: #aaa;
            word-break: break-all;
          }
          .result-translated {
            font-size: 1em;
            color: var(--primary-color);
            font-weight: bold;
          }
          
          .copy-btn {
            background: #555;
            padding: 4px 8px;
            font-size: 12px;
            min-width: 50px;
          }
          .copy-btn:hover {
            background: #777;
          }
          .copy-btn:active {
            background: var(--primary-color);
          }
        </style>
        <div class="container">
          <div class="results-popover" id="results"></div>
          <div class="controls">
            <div class="search-box tooltip-container" data-tooltip="輸入文字搜尋，僅顯示13字以內的翻譯結果">
              <input type="text" id="searchInput" placeholder="搜尋/Search...">
            </div>
            <div class="tooltip-container" data-tooltip="點擊切換 英文/中文 顯示模式">
              <button id="toggleBtn">中/En</button>
            </div>
          </div>
        </div>
      `;
    }

    setupEvents() {
      const toggleBtn = this.shadowRoot.getElementById('toggleBtn');
      const searchInput = this.shadowRoot.getElementById('searchInput');
      const resultsContainer = this.shadowRoot.getElementById('results');

      toggleBtn.addEventListener('click', () => {
        this.state.enabled = !this.state.enabled;
        toggleBtn.classList.toggle('inactive', !this.state.enabled);
        if (this._onToggle) this._onToggle(this.state.enabled);
      });

      const debouncedSearch = Utils.debounce((query) => {
        if (this._onSearch) this._onSearch(query);
      }, CONFIG.PERFORMANCE.SEARCH_DEBOUNCE);

      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 0) {
          debouncedSearch(query);
        } else {
          resultsContainer.classList.remove('visible');
        }
      });

      // Prevent shortcut keys of the original web page from being triggered when typing in the search box
      searchInput.addEventListener('keydown', (e) => {
        e.stopPropagation();
      });

      // Close results when clicking outside
      document.addEventListener('click', (e) => {
        if (e.target !== this) {
          resultsContainer.classList.remove('visible');
        }
      });

      // Delegate click for copy buttons
      resultsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-btn')) {
          const text = e.target.dataset.text;
          navigator.clipboard.writeText(text).then(() => {
            const originalText = e.target.innerText;
            e.target.innerText = 'Copied!';
            e.target.style.background = '#4CAF50';
            setTimeout(() => {
              e.target.innerText = originalText;
              e.target.style.background = '';
            }, 1000);
          });
        }
      });
    }

    renderResults() {
      const container = this.shadowRoot.getElementById('results');
      if (!this.state.searchResults.length) {
        container.classList.remove('visible');
        return;
      }

      container.innerHTML = this.state.searchResults.map(item => `
        <div class="result-item">
          <div class="result-content">
            <div class="result-translated">${item.translated}</div>
            <div class="result-original">${item.original}</div>
          </div>
          <button class="copy-btn" data-text="${item.original.replace(/"/g, '&quot;')}">Copy</button>
        </div>
      `).join('');

      container.classList.add('visible');
    }
  }

  customElements.define('translation-widget', TranslationWidget);

  // ==========================================
  // Main Application
  // ==========================================
  class App {
    constructor() {
      this.dataManager = new DataManager();
      this.domHandler = new DOMHandler(this.dataManager);
      this.worker = Utils.createWorker(WORKER_CODE);
      this.widget = null;
    }

    async init() {
      this._injectGlobalStyles();

      // Load Data
      const entries = await this.dataManager.init();

      // Init Worker
      this.worker.postMessage({ type: 'INIT', payload: entries });
      this.worker.onmessage = (e) => this._handleWorkerMessage(e);

      // Init UI
      this.widget = document.createElement('translation-widget');
      document.body.appendChild(this.widget);

      this.widget.onToggle = (enabled) => {
        if (enabled) this.domHandler.enable();
        else this.domHandler.disable();
      };

      this.widget.onSearch = (query) => {
        this.worker.postMessage({ type: 'SEARCH', payload: query });
      };

      // Initial Translation
      this.domHandler.enable();

      // Welcome Modal Logic
      this._handleWelcomeModal();

      // Keyboard Shortcuts
      this._setupKeyboardShortcuts();

      console.log('[Filterblade Translator] System Ready');
    }

    _setupKeyboardShortcuts() {
      document.addEventListener("keydown", (e) => {
        if (e.key === "F8" && e.ctrlKey) {
          e.preventDefault();
          const untranslated = this.domHandler.collectUntranslated();
          if (untranslated.length === 0) {
            alert("沒有發現未翻譯文字。");
            return;
          }
          const jsonStr = JSON.stringify(untranslated, null, 2);
          Utils.downloadJson("untranslated_text.json", jsonStr);
        }
      });
    }

    _handleWorkerMessage(e) {
      const { type, payload } = e.data;
      if (type === 'SEARCH_RESULT') {
        this.widget.updateSearchResults(payload);
      }
    }

    _injectGlobalStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .translation-overlay-parent {
          position: relative;
          color: transparent !important;
        }
        .translation-overlay-parent::after {
          content: attr(data-translation);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: var(--original-text-color, black);
          pointer-events: none;
          white-space: pre;
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);
    }

    _handleWelcomeModal() {
      const modalId = 'welcome-modal-sab';
      const checkboxId = 'do-not-show-again-sab';
      const storageKey = 'sab_hide_welcome_modal_until';

      const hideUntil = localStorage.getItem(storageKey);
      if (hideUntil && Date.now() < parseInt(hideUntil)) {
        return;
      }

      const overlay = document.createElement('div');
      overlay.id = modalId;
      overlay.style.cssText = `
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-color: rgba(0, 0, 0, 0.7); display: flex;
          justify-content: center; align-items: center; z-index: 100000;
        `;

      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
          background-color: #333; color: #eee; padding: 25px; border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); max-width: 450px; width: 90%;
          text-align: left; font-family: 'Segoe UI', sans-serif; line-height: 1.6;
          border: 1px solid #555; position: relative;
        `;

      modalContent.innerHTML = `
            <h3 style="color: #4CAF50; margin-top: 0; border-bottom: 1px solid #555; padding-bottom: 10px; font-size: 1.4em;">歡迎使用翻譯腳本！</h3>
            <p style="margin-bottom: 15px;"><strong>如果遇到進入時載入太久可以直接重新整理網頁！</strong></p>
            <p style="margin-bottom: 15px;">目前中文化由 Sab 維護，大力感謝雕像協助
            <p style="margin-bottom: 15px;">相關介紹可以到巴哈文章看。</p>
            <p style="margin-bottom: 15px;">有疑問或bug回報可以在巴哈文章或discord找我。</p>
            <p style="margin-bottom: 15px;">文章連結：<a href="https://forum.gamer.com.tw/C.php?bsn=18966&snA=141099&tnum=1" target="_blank" style="color: #64B5F6; text-decoration: none;">巴哈文章連結</a></p>
            <p style="margin-bottom: 20px;">dc Sab9453</p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #555; padding-top: 15px;">
                <label for="${checkboxId}" style="cursor: pointer; display: flex; align-items: center;">
                  <input type="checkbox" id="${checkboxId}" style="margin-right: 8px; transform: scale(1.2);">
                  一天內不再顯示
                </label>
                <button id="confirm-button-sab" style="
                  background-color: #4CAF50; color: white; padding: 10px 20px;
                  border: none; border-radius: 5px; cursor: pointer; font-size: 1em;
                ">確認</button>
            </div>
        `;

      overlay.appendChild(modalContent);
      document.body.appendChild(overlay);

      document.getElementById('confirm-button-sab').addEventListener('click', () => {
        if (document.getElementById(checkboxId).checked) {
          localStorage.setItem(storageKey, (Date.now() + 86400000).toString());
        }
        overlay.remove();
      });

      document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'F9') {
          localStorage.removeItem(storageKey);
          // Create a toast notification
          const toast = document.createElement('div');
          toast.textContent = '已清除「一天內不再顯示」的設定';
          toast.style.cssText = `
                    position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white;
                    padding: 15px; border-radius: 5px; z-index: 100001;
                `;
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 3000);
        }
      });
    }
  }

  // Start
  window.addEventListener('load', () => {
    new App().init();
  });

})();
