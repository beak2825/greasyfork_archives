// ==UserScript==
// @name         Enjoy DeepL Unlimited
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @description  Robust and maintainable DeepL unlimited usage script
// @author       fleey
// @match        https://*.deepl.com/translator
// @match        https://*.deepl.com/*/translator
// @grant        GM_setClipboard
// @icon         https://www.deepl.com/favicon.ico
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547041/Enjoy%20DeepL%20Unlimited.user.js
// @updateURL https://update.greasyfork.org/scripts/547041/Enjoy%20DeepL%20Unlimited.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Global state management
  const AppState = {
    isResetting: false,
    isInitialized: false,
    lastResetTime: 0,
    detectionCount: 0,
    errors: []
  };

  /**
   * Configuration Manager - Centralized configuration with validation
   */
  class ConfigManager {
    constructor() {
      this.config = {
        // Performance settings
        performance: {
          debounceDelay: 300,
          initialScanDelay: 3000, // Increased delay to ensure page is fully loaded
          maxRetries: 3,
          retryDelay: 1000,
          resetCooldown: 10000 // Increased cooldown to prevent frequent resets
        },

        // Detection settings
        detection: {
          keywords: ['300,000', 'unlimited characters'],
          promotionKeywords: [
            '免费试用 DeepL Pro',
            'try DeepL Pro for free',
            'nearing your monthly character limit',
            'Get up to unlimited characters',
            'You\'re nearing your monthly character limit'
          ],
          // More specific keywords that require exact context
          strictKeywords: [
            '免费试用',
            'DeepL Pro'
          ],
          // Minimum text length for detection
          minTextLength: 10,
          // Maximum text length to avoid false positives
          maxTextLength: 500,
          selectors: {
            // Multiple possible selectors for source text area
            sourceText: [
              'div[aria-labelledby="translation-source-heading"] d-textarea',
              'div[aria-labelledby="translation-source-heading"] textarea',
              'd-textarea[aria-labelledby="translation-source-heading"]',
              'textarea[aria-labelledby="translation-source-heading"]',
              '[data-testid="translator-source-input"]',
              '.lmt__source_textarea',
              '#source-dummydiv',
              'div[contenteditable="true"][role="textbox"]'
            ],
            promotionAreas: [
              'div.border-1.-my-4.mx-4.hidden.max-w-md.items-center.justify-start.gap-3.rounded-lg.border-blue-200.bg-blue-50.p-4.text-blue-700.xl\\:flex.min-\\[1440px\\]\\:mx-0',
              'span.__content.with-content-center',
              'div:has(a[href="/pro"])',
              'a.Button.as-link.as-no-padding.as-medium.-font-size-md'
            ],
            // More targeted common areas, excluding generic header and overly broad selectors
            commonAreas: ['.banner', '[class*="promotion"]', '[class*="trial"]', '[class*="limit"]', '[class*="upgrade"]', '[class*="promo"]']
          },
          // Whitelist patterns to ignore
          whitelist: [
            'DeepL翻译器',
            'DeepL Translator',
            'navigation',
            'menu',
            'logo',
            '每天有数百万人使用DeepL翻译',
            'DeepL Write',
            '人工智能写作助手',
            '翻译模式',
            '翻译文本',
            '翻译文件',
            '35 种语言',
            'millions of people translate with DeepL',
            'AI writing assistant',
            'translation modes',
            'translate text',
            'translate files',
            'languages'
          ]
        },

        // Cookie management
        cookies: {
          names: ['dapSid', 'LMTBID', 'dapUid'],
          domain: '.deepl.com'
        },

        // Logging settings
        logging: {
          level: 'INFO', // DEBUG, INFO, WARN, ERROR
          maxLogEntries: 100
        },

        // Debug settings
        debug: {
          enabled: false, // Set to true for detailed debugging
          logDetectionAttempts: false
        }
      };
    }

    get(path) {
      return path.split('.').reduce((obj, key) => obj?.[key], this.config);
    }

    set(path, value) {
      const keys = path.split('.');
      const lastKey = keys.pop();
      const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, this.config);
      target[lastKey] = value;
    }

    validate() {
      const required = ['detection.keywords', 'detection.selectors.sourceText', 'cookies.names'];
      return required.every(path => this.get(path) !== undefined);
    }
  }

  /**
   * Logger - Unified logging system with levels and performance tracking
   */
  class Logger {
    constructor(config) {
      this.config = config;
      this.logs = [];
      this.levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
      this.currentLevel = this.levels[config.get('logging.level')] || this.levels.INFO;
    }

    log(level, message, data = null) {
      if (this.levels[level] < this.currentLevel) return;

      const entry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        data,
        stack: level === 'ERROR' ? new Error().stack : null
      };

      this.logs.push(entry);

      // Limit log entries
      const maxEntries = this.config.get('logging.maxLogEntries');
      if (this.logs.length > maxEntries) {
        this.logs = this.logs.slice(-maxEntries);
      }

      // Console output
      const consoleMethod = level.toLowerCase() === 'error' ? 'error' :
        level.toLowerCase() === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[DeepL Unlimited] ${message}`, data || '');
    }

    debug(message, data) { this.log('DEBUG', message, data); }
    info(message, data) { this.log('INFO', message, data); }
    warn(message, data) { this.log('WARN', message, data); }
    error(message, data) { this.log('ERROR', message, data); }

    getLogs() { return [...this.logs]; }
    clearLogs() { this.logs = []; }
  }

  /**
   * I18n Manager - Internationalization with fallback support
   */
  class I18nManager {
    constructor() {
      this.translations = {
        en: {
          copied_alert: "DeepL limit detected. Your source text has been copied to the clipboard.",
          confirm_reload: "Cookies have been cleared. Do you want to reload the page now to reset the limit?",
          error_clipboard: "Failed to copy text to clipboard.",
          error_cookie_clear: "Failed to clear cookies.",
          error_detection: "Error during limit detection.",
          info_initialized: "DeepL Unlimited script initialized successfully.",
          info_reset_triggered: "Reset process triggered.",
          warn_cooldown: "Reset is on cooldown. Please wait."
        },
        zh: {
          copied_alert: "检测到DeepL使用限制。您的原文已复制到剪贴板。",
          confirm_reload: "相关Cookie已被清除。是否立即刷新页面以重置额度？",
          error_clipboard: "复制文本到剪贴板失败。",
          error_cookie_clear: "清除Cookie失败。",
          error_detection: "限制检测过程中出错。",
          info_initialized: "DeepL无限制脚本初始化成功。",
          info_reset_triggered: "重置流程已触发。",
          warn_cooldown: "重置功能冷却中，请稍候。"
        }
      };
    }

    getLang() {
      const lang = navigator.language || navigator.userLanguage;
      return lang.startsWith('zh') ? 'zh' : 'en';
    }

    getString(key) {
      const lang = this.getLang();
      return this.translations[lang]?.[key] || this.translations.en[key] || key;
    }
  }

  /**
   * Action Handler - Manages reset operations with error handling and retry logic
   */
  class ActionHandler {
    constructor(config, logger, i18n) {
      this.config = config;
      this.logger = logger;
      this.i18n = i18n;
    }

    async deleteCookies() {
      try {
        const cookieNames = this.config.get('cookies.names');
        const domain = this.config.get('cookies.domain');

        cookieNames.forEach(name => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
        });

        this.logger.info('Cookies cleared successfully', { cookies: cookieNames });
        return true;
      } catch (error) {
        this.logger.error('Failed to clear cookies', error);
        return false;
      }
    }

    async copySourceText() {
      try {
        const selectors = this.config.get('detection.selectors.sourceText');
        let sourceTextArea = null;
        let usedSelector = null;

        // Try each selector until we find the source text area
        for (const selector of selectors) {
          sourceTextArea = document.querySelector(selector);
          if (sourceTextArea) {
            usedSelector = selector;
            break;
          }
        }

        if (!sourceTextArea) {
          this.logger.warn('Source text area not found with any selector', { selectors });
          return false;
        }

        this.logger.debug('Found source text area', { selector: usedSelector });

        // Try different methods to extract text
        let textToCopy = '';

        // Method 1: Check for paragraphs (common in contenteditable divs)
        const paragraphs = sourceTextArea.querySelectorAll('p');
        if (paragraphs.length > 0) {
          textToCopy = Array.from(paragraphs).map(p => p.innerText || p.textContent).join('\n');
        }

        // Method 2: Check direct text content
        if (!textToCopy.trim()) {
          textToCopy = sourceTextArea.innerText || sourceTextArea.textContent || sourceTextArea.value || '';
        }

        // Method 3: Check for spans or other text containers
        if (!textToCopy.trim()) {
          const textElements = sourceTextArea.querySelectorAll('span, div');
          textToCopy = Array.from(textElements)
            .map(el => el.innerText || el.textContent)
            .filter(text => text && text.trim())
            .join('\n');
        }

        if (!textToCopy.trim()) {
          this.logger.warn('No text found to copy', {
            element: sourceTextArea.tagName,
            className: sourceTextArea.className
          });
          return false;
        }

        if (typeof GM_setClipboard === 'function') {
          GM_setClipboard(textToCopy);
          this.logger.info('Text copied to clipboard', {
            length: textToCopy.length,
            selector: usedSelector
          });
          return true;
        } else {
          this.logger.error('GM_setClipboard not available');
          return false;
        }
      } catch (error) {
        this.logger.error('Failed to copy source text', error);
        return false;
      }
    }

    async triggerResetProcess() {
      // Check cooldown
      const cooldown = this.config.get('performance.resetCooldown');
      const timeSinceLastReset = Date.now() - AppState.lastResetTime;

      if (timeSinceLastReset < cooldown) {
        this.logger.warn('Reset on cooldown', {
          remaining: cooldown - timeSinceLastReset
        });
        return false;
      }

      if (AppState.isResetting) {
        this.logger.warn('Reset already in progress');
        return false;
      }

      try {
        AppState.isResetting = true;
        AppState.lastResetTime = Date.now();

        this.logger.info(this.i18n.getString('info_reset_triggered'));

        // Execute reset operations
        const cookiesCleared = await this.deleteCookies();
        const textCopied = await this.copySourceText();

        // Show user notification
        if (textCopied) {
          alert(this.i18n.getString('copied_alert'));
        } else {
          alert(this.i18n.getString('error_clipboard'));
        }

        // Ask for reload
        if (cookiesCleared && confirm(this.i18n.getString('confirm_reload'))) {
          window.location.reload();
        }

        return true;
      } catch (error) {
        this.logger.error('Reset process failed', error);
        AppState.errors.push(error);
        return false;
      } finally {
        AppState.isResetting = false;
      }
    }
  }

  /**
   * Limit Detector - Multiple detection strategies with performance optimization
   */
  class LimitDetector {
    constructor(config, logger) {
      this.config = config;
      this.logger = logger;
      this.cache = new Map();
      this.lastScanTime = 0;
    }

    checkForLimit(text) {
      if (!text) return false;
      const keywords = this.config.get('detection.keywords');
      return keywords.every(keyword => text.includes(keyword));
    }

    checkForPromotion(element) {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;

      const text = element.innerText || element.textContent || '';
      if (!text.trim()) return false;

      // Text length validation
      const minLength = this.config.get('detection.minTextLength');
      const maxLength = this.config.get('detection.maxTextLength');
      if (text.length < minLength || text.length > maxLength) {
        return false;
      }

      // Cache check
      const cacheKey = text.substring(0, 100);
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      // Check whitelist first
      const whitelist = this.config.get('detection.whitelist');
      const isWhitelisted = whitelist.some(pattern =>
        text.toLowerCase().includes(pattern.toLowerCase())
      );

      if (isWhitelisted) {
        this.cache.set(cacheKey, false);
        return false;
      }

      // Check promotion keywords (high confidence)
      const promotionKeywords = this.config.get('detection.promotionKeywords');
      const hasPromotionKeyword = promotionKeywords.some(keyword =>
        text.toLowerCase().includes(keyword.toLowerCase())
      );

      // Check strict keywords (require additional context validation)
      const strictKeywords = this.config.get('detection.strictKeywords');
      const hasStrictKeyword = strictKeywords.some(keyword =>
        text.toLowerCase().includes(keyword.toLowerCase())
      );

      let isPromotion = false;

      if (hasPromotionKeyword) {
        // High confidence detection
        isPromotion = true;
      } else if (hasStrictKeyword) {
        // Strict keyword requires additional validation
        isPromotion = this.validateStrictKeyword(element, text);
      }

      // Cache result
      this.cache.set(cacheKey, isPromotion);

      // Limit cache size
      if (this.cache.size > 100) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      if (isPromotion) {
        this.logger.debug('Promotion detected', {
          text: text.substring(0, 100),
          element: element.tagName,
          className: element.className
        });
        return true;
      }

      return false;
    }

    validateStrictKeyword(element, text) {
      // Additional validation for strict keywords
      const textLower = text.toLowerCase();

      // Must have STRONG promotional indicators for strict keywords
      const strongPromotionalContext = [
        'trial', 'free trial', '免费试用', 'upgrade', 'premium',
        'character limit', 'monthly limit', 'unlimited', 'subscription',
        'nearing', 'limit reached', 'get more'
      ];

      const hasStrongPromotionalContext = strongPromotionalContext.some(context =>
        textLower.includes(context)
      );

      // Check element attributes for promotional indicators
      const elementClasses = element.className || '';
      const elementId = element.id || '';
      const promotionalClasses = ['promo', 'trial', 'upgrade', 'banner', 'cta', 'alert', 'warning'];

      const hasPromotionalClass = promotionalClasses.some(cls =>
        elementClasses.toLowerCase().includes(cls) ||
        elementId.toLowerCase().includes(cls)
      );

      // Check if element has promotional styling (blue background, etc.)
      let hasPromotionalStyling = false;
      try {
        const style = window.getComputedStyle(element);
        hasPromotionalStyling =
          style.backgroundColor.includes('blue') ||
          style.borderColor.includes('blue') ||
          elementClasses.includes('blue') ||
          elementClasses.includes('bg-blue');
      } catch (e) {
        // Ignore styling errors
      }

      // Check if text contains action words (call-to-action)
      const actionWords = ['click', 'try', 'get', 'upgrade', 'subscribe', '点击', '试用', '获取', '升级'];
      const hasActionWords = actionWords.some(word => textLower.includes(word));

      // Require multiple indicators for strict keywords
      const indicators = [hasStrongPromotionalContext, hasPromotionalClass, hasPromotionalStyling, hasActionWords];
      const indicatorCount = indicators.filter(Boolean).length;

      this.logger.debug('Strict keyword validation', {
        text: text.substring(0, 50),
        hasStrongPromotionalContext,
        hasPromotionalClass,
        hasPromotionalStyling,
        hasActionWords,
        indicatorCount,
        required: 2
      });

      // Require at least 2 indicators for strict keywords
      return indicatorCount >= 2;
    }

    checkElementAndChildren(element, depth = 0) {
      // Prevent infinite recursion
      if (depth > 10) return false;

      if (this.checkForPromotion(element)) {
        return true;
      }

      // Check children recursively
      if (element.children) {
        for (const child of element.children) {
          if (this.checkElementAndChildren(child, depth + 1)) {
            return true;
          }
        }
      }

      return false;
    }

    clearCache() {
      this.cache.clear();
    }
  }

  /**
   * DOM Watcher - Efficient DOM monitoring with debouncing and performance optimization
   */
  class DOMWatcher {
    constructor(config, logger, detector, actionHandler) {
      this.config = config;
      this.logger = logger;
      this.detector = detector;
      this.actionHandler = actionHandler;
      this.observer = null;
      this.debounceTimer = null;
      this.isWatching = false;
    }

    debounce(func, delay) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(func, delay);
    }

    handleMutation = (mutationsList) => {
      if (AppState.isResetting) return;

      const debounceDelay = this.config.get('performance.debounceDelay');
      this.debounce(() => {
        this.processMutations(mutationsList);
      }, debounceDelay);
    }

    processMutations(mutationsList) {
      try {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // Check for original limit detection
                if (this.detector.checkForLimit(node.innerText)) {
                  this.logger.info('Limit detected via mutation');
                  this.actionHandler.triggerResetProcess();
                  return;
                }

                // Check for promotion elements
                if (this.detector.checkElementAndChildren(node)) {
                  this.logger.info('Promotion detected via mutation');
                  this.actionHandler.triggerResetProcess();
                  return;
                }
              }
            }
          }
        }
      } catch (error) {
        this.logger.error('Mutation processing error', error);
      }
    }

    startWatching() {
      if (this.isWatching) return;

      try {
        this.observer = new MutationObserver(this.handleMutation);
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: false,
          characterData: false
        });
        this.isWatching = true;
        this.logger.info('DOM watching started');
      } catch (error) {
        this.logger.error('Failed to start DOM watching', error);
      }
    }

    stopWatching() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }
      this.isWatching = false;
      this.logger.info('DOM watching stopped');
    }

    isLikelyPromotionalArea(element, selector) {
      // Check element classes and IDs for promotional indicators
      const elementClasses = element.className || '';
      const elementId = element.id || '';
      const promotionalIndicators = [
        'banner', 'promo', 'trial', 'upgrade', 'cta', 'alert', 'warning',
        'notification', 'popup', 'modal', 'overlay', 'toast'
      ];

      const hasPromotionalClass = promotionalIndicators.some(indicator =>
        elementClasses.toLowerCase().includes(indicator) ||
        elementId.toLowerCase().includes(indicator)
      );

      // Check if element has promotional styling
      let hasPromotionalStyling = false;
      try {
        const style = window.getComputedStyle(element);
        const bgColor = style.backgroundColor;
        const borderColor = style.borderColor;

        // Look for typical promotional colors (blue, orange, red, yellow)
        hasPromotionalStyling =
          bgColor.includes('blue') || bgColor.includes('orange') ||
          bgColor.includes('red') || bgColor.includes('yellow') ||
          borderColor.includes('blue') || borderColor.includes('orange') ||
          elementClasses.includes('blue') || elementClasses.includes('bg-blue');
      } catch (e) {
        // Ignore styling errors
      }

      // Check text content for promotional language
      const text = element.innerText || element.textContent || '';
      const promotionalPhrases = [
        'trial', 'free', 'upgrade', 'premium', 'pro', 'limit', 'unlimited',
        'subscribe', 'get more', 'try now', '试用', '免费', '升级', '限制'
      ];

      const hasPromotionalText = promotionalPhrases.some(phrase =>
        text.toLowerCase().includes(phrase)
      );

      // Check position (promotional content is often at top or in sidebars)
      const rect = element.getBoundingClientRect();
      const isAtTop = rect.top < 200;
      const isSmallHeight = rect.height < 150;

      // Combine indicators
      const indicators = [hasPromotionalClass, hasPromotionalStyling, hasPromotionalText];
      const indicatorCount = indicators.filter(Boolean).length;

      this.logger.debug('Promotional area check', {
        selector,
        hasPromotionalClass,
        hasPromotionalStyling,
        hasPromotionalText,
        isAtTop,
        isSmallHeight,
        indicatorCount,
        text: text.substring(0, 50)
      });

      // Require at least one strong indicator
      return indicatorCount >= 1 && (isAtTop || isSmallHeight);
    }

    performInitialScan() {
      try {
        this.logger.info('Performing initial scan');

        // Check if page is ready for scanning
        const selectors = this.config.get('detection.selectors.sourceText');
        let sourceTextArea = null;

        for (const selector of selectors) {
          sourceTextArea = document.querySelector(selector);
          if (sourceTextArea) break;
        }

        if (!sourceTextArea) {
          this.logger.info('Page not ready for scanning - source text area not found, will retry');
          // Retry after a short delay
          setTimeout(() => this.performInitialScan(), 2000);
          return false;
        }

        this.logger.debug('Page ready for scanning - source text area found');

        // Check promotion areas first (most specific)
        const promotionSelectors = this.config.get('detection.selectors.promotionAreas');
        for (const selector of promotionSelectors) {
          try {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
              if (this.detector.checkForPromotion(element)) {
                this.logger.info('Promotion found during initial scan', {
                  selector,
                  text: element.innerText?.substring(0, 100)
                });
                this.actionHandler.triggerResetProcess();
                return true;
              }
            }
          } catch (e) {
            this.logger.debug('Selector error during initial scan', { selector, error: e.message });
          }
        }

        // Check common areas with more careful validation
        const commonAreas = this.config.get('detection.selectors.commonAreas');
        for (const areaSelector of commonAreas) {
          try {
            const areas = document.querySelectorAll(areaSelector);
            for (const area of areas) {
              // Skip if area is too large (likely not a promotion)
              if (area.children && area.children.length > 20) {
                this.logger.debug('Skipping large area', { selector: areaSelector, childCount: area.children.length });
                continue;
              }

              // Skip if area contains too much text (likely main content)
              const areaText = area.innerText || area.textContent || '';
              if (areaText.length > 300) {
                this.logger.debug('Skipping large text area', {
                  selector: areaSelector,
                  textLength: areaText.length,
                  preview: areaText.substring(0, 50)
                });
                continue;
              }

              // Only check areas that look like promotional containers
              const isLikelyPromotional = this.isLikelyPromotionalArea(area, areaSelector);
              if (!isLikelyPromotional) {
                this.logger.debug('Skipping non-promotional area', {
                  selector: areaSelector,
                  preview: areaText.substring(0, 50)
                });
                continue;
              }

              if (this.detector.checkElementAndChildren(area)) {
                this.logger.info('Promotion found in common area during initial scan', {
                  selector: areaSelector,
                  text: area.innerText?.substring(0, 100)
                });
                this.actionHandler.triggerResetProcess();
                return true;
              }
            }
          } catch (e) {
            this.logger.debug('Common area selector error during initial scan', { selector: areaSelector, error: e.message });
          }
        }

        this.logger.info('Initial scan completed - no promotions found');
        return false;
      } catch (error) {
        this.logger.error('Initial scan error', error);
        return false;
      }
    }
  }

  /**
   * Main Application Class - Orchestrates all components
   */
  class DeepLUnlimitedApp {
    constructor() {
      this.config = null;
      this.logger = null;
      this.i18n = null;
      this.detector = null;
      this.actionHandler = null;
      this.domWatcher = null;
      this.initialized = false;
    }

    async initialize() {
      try {
        // Initialize core components
        this.config = new ConfigManager();

        if (!this.config.validate()) {
          throw new Error('Configuration validation failed');
        }

        this.logger = new Logger(this.config);
        this.i18n = new I18nManager();
        this.detector = new LimitDetector(this.config, this.logger);
        this.actionHandler = new ActionHandler(this.config, this.logger, this.i18n);
        this.domWatcher = new DOMWatcher(this.config, this.logger, this.detector, this.actionHandler);

        // Set global error handler
        window.addEventListener('error', (event) => {
          this.logger.error('Global error caught', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          });
        });

        this.initialized = true;
        this.logger.info(this.i18n.getString('info_initialized'));

        return true;
      } catch (error) {
        console.error('[DeepL Unlimited] Initialization failed: - b.js:859', error);
        AppState.errors.push(error);
        return false;
      }
    }

    async start() {
      if (!this.initialized) {
        const initSuccess = await this.initialize();
        if (!initSuccess) {
          return false;
        }
      }

      try {
        AppState.isInitialized = true;

        // Perform initial scan
        const initialScanDelay = this.config.get('performance.initialScanDelay');
        setTimeout(() => {
          const foundPromotion = this.domWatcher.performInitialScan();

          // Start watching if no promotion found
          if (!foundPromotion) {
            this.domWatcher.startWatching();
          }
        }, initialScanDelay);

        this.logger.info('Application started successfully');
        return true;
      } catch (error) {
        this.logger.error('Failed to start application', error);
        return false;
      }
    }

    stop() {
      try {
        if (this.domWatcher) {
          this.domWatcher.stopWatching();
        }

        if (this.detector) {
          this.detector.clearCache();
        }

        AppState.isInitialized = false;
        this.logger.info('Application stopped');
      } catch (error) {
        this.logger.error('Error during application stop', error);
      }
    }

    // Public API for debugging
    getStatus() {
      return {
        initialized: this.initialized,
        appState: { ...AppState },
        logs: this.logger ? this.logger.getLogs() : [],
        config: this.config ? this.config.config : null
      };
    }

    // Manual trigger for testing
    triggerReset() {
      if (this.actionHandler) {
        return this.actionHandler.triggerResetProcess();
      }
      return false;
    }

    // Debug helper to find source text area
    findSourceTextArea() {
      const selectors = this.config.get('detection.selectors.sourceText');
      const results = [];

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        results.push({
          selector,
          found: elements.length,
          elements: Array.from(elements).map(el => ({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            hasText: !!(el.innerText || el.textContent || el.value),
            textLength: (el.innerText || el.textContent || el.value || '').length
          }))
        });
      }

      console.log('Source text area search results: - b.js:950', results);
      return results;
    }

    // Debug helper to scan for all potential text areas
    scanAllTextAreas() {
      const textAreas = document.querySelectorAll('textarea, [contenteditable="true"], d-textarea, [role="textbox"]');
      const results = Array.from(textAreas).map(el => ({
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        ariaLabel: el.getAttribute('aria-label'),
        ariaLabelledBy: el.getAttribute('aria-labelledby'),
        role: el.getAttribute('role'),
        hasText: !!(el.innerText || el.textContent || el.value),
        textLength: (el.innerText || el.textContent || el.value || '').length
      }));

      console.log('All text areas found: - b.js:968', results);
      return results;
    }
  }

  // Initialize and start the application
  const app = new DeepLUnlimitedApp();

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.start());
  } else {
    app.start();
  }

  // Expose app instance for debugging (only in development)
  if (typeof window !== 'undefined') {
    window.DeepLUnlimited = app;
  }

})();
