// ==UserScript==
// @name         DevTools Bypass
// @name:vi      Bỏ Qua Chặn DevTools
// @name:zh-CN   开发工具限制绕过
// @name:en      DevTools Bypass
// @namespace    https://greasyfork.org/vi/users/1195312-renji-yuusei
// @version      4.0.0
// @description  Bypass website anti-DevTools restrictions and enable full developer access
// @description:vi Vô hiệu hóa các biện pháp chặn DevTools của website và cho phép truy cập đầy đủ
// @description:zh-CN 绕过网站的反开发者工具限制，启用完整的开发者访问权限
// @description:en Bypass website anti-DevTools restrictions and enable full developer access
// @author       Yuusei
// @match        *://*/*
// @grant        unsafeWindow
// @run-at       document-start
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/511714/DevTools%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/511714/DevTools%20Bypass.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // Configuration
  const CONFIG = {
    // Enhanced regex to detect and neutralize anti-DevTools code
    antiDevToolsRegex: new RegExp(
      [
        // Debugger statements - remove completely
        /(?:^|[;\s{(,])\s*debugger\s*(?:[;\s}),]|$)/.source,

        // Function constructor with debugger
        /(?:new\s+)?Function\s*\(\s*['"`][^'"`]*debugger[^'"`]*['"`]\s*\)/
          .source,

        // Timer-based debugger injections
        /(?:setTimeout|setInterval)\s*\(\s*(?:function[^{]*\{[^}]*debugger[^}]*\}|['"`][^'"`]*debugger[^'"`]*['"`])\s*[,)]/
          .source,

        // eval with debugger
        /eval\s*\(\s*['"`][^'"`]*debugger[^'"`]*['"`]\s*\)/.source,

        // Console detection tricks
        /console\s*\[\s*['"`](?:log|warn|error|info|debug|clear|table|dir|group|time)['"`]\s*\]\s*\.\s*toString/
          .source,
        /console\.(?:log|warn|error|info|debug|trace|clear|table|dir|group|time)\s*\.\s*toString\s*\(\s*\)/
          .source,

        // DevTools size detection
        /(?:window\.(?:outer|inner)(?:Width|Height)|screen\.(?:width|height))\s*[-+*\/]\s*(?:window\.(?:outer|inner)(?:Width|Height)|screen\.(?:width|height))\s*[<>=!]+\s*\d+/
          .source,

        // Performance timing detection
        /(?:performance\.now|Date\.now)\s*\(\s*\)\s*[-+]\s*(?:performance\.now|Date\.now)\s*\(\s*\)\s*[><=!]+\s*\d+/
          .source,

        // Known anti-DevTools libraries
        /(?:FuckDevTools|devtools-detector|disable-devtool|console-ban|anti-debug|devtools-detect|fuck-debugger)/
          .source,

        // DevTools event listeners
        /(?:addEventListener|on)\s*\(\s*['"`](?:keydown|keyup|keypress|contextmenu|selectstart|copy|cut|paste|dragstart)['"`][^)]*(?:F12|preventDefault|stopPropagation)/
          .source,

        // Console override attempts
        /console\s*=\s*(?:\{\}|null|undefined|false)/.source,
        /window\.console\s*=/.source,

        // DevTools detection via exceptions
        /try\s*\{[^}]*(?:debugger|console)[^}]*\}\s*catch/.source,

        // Stack trace analysis for DevTools detection
        /(?:Error|TypeError|ReferenceError)\(\)\.stack\.(?:split|match|replace|indexOf|includes|search)/
          .source,

        // Arguments.callee detection (used in some anti-debug)
        /arguments\.callee/.source,

        // toString override for detection
        /toString\s*=\s*function[^{]*\{[^}]*(?:devtools|debug|console)/.source,
      ].join("|"),
      "gim"
    ),

    protection: {
      neutralizeDebugger: true,
      enableDevToolsKeys: true,
      enableRightClick: true,
      enableTextSelection: true,
      enableCopyPaste: true,
      preventAntiDebugTimers: true,
      restoreConsole: true,
      preventKeyBlocking: true,
    },

    logging: {
      enabled: true,
      prefix: "[DevTools Bypass]",
      verbose: false,
    },
  };

  // Logger
  class Logger {
    static #logHistory = new Map();
    static #maxLogsPerType = 5;

    static #canLog(type, message) {
      const key = `${type}:${message}`;
      const count = this.#logHistory.get(key) || 0;
      if (count >= this.#maxLogsPerType) return false;

      this.#logHistory.set(key, count + 1);
      return true;
    }

    static info(message, ...args) {
      if (CONFIG.logging.enabled && this.#canLog("info", message)) {
        console.info(CONFIG.logging.prefix, message, ...args);
      }
    }

    static warn(message, ...args) {
      if (CONFIG.logging.enabled && this.#canLog("warn", message)) {
        console.warn(CONFIG.logging.prefix, message, ...args);
      }
    }

    static debug(message, ...args) {
      if (
        CONFIG.logging.enabled &&
        CONFIG.logging.verbose &&
        this.#canLog("debug", message)
      ) {
        console.debug(CONFIG.logging.prefix, message, ...args);
      }
    }
  }

  // Store original functions before they get overridden
  const ORIGINAL = {
    // Core functions
    Function: window.Function,
    eval: window.eval,
    setTimeout: window.setTimeout,
    setInterval: window.setInterval,
    clearTimeout: window.clearTimeout,
    clearInterval: window.clearInterval,

    // Timing
    Date: window.Date,
    now: Date.now,
    performance: window.performance?.now?.bind(window.performance),

    // DOM
    addEventListener: window.addEventListener,
    removeEventListener: window.removeEventListener,
    createElement: document.createElement,

    // Object methods
    defineProperty: Object.defineProperty,
    getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor,
    keys: Object.keys,

    // Console (store before potential override)
    console: {},
  };

  // Backup console methods
  [
    "log",
    "warn",
    "error",
    "info",
    "debug",
    "trace",
    "dir",
    "table",
    "group",
    "groupEnd",
    "clear",
    "time",
    "timeEnd",
  ].forEach((method) => {
    if (console[method]) {
      ORIGINAL.console[method] = console[method].bind(console);
    }
  });

  // Code Neutralizer - Cleans anti-DevTools code
  class CodeNeutralizer {
    static neutralize(code) {
      if (typeof code !== "string" || !code.trim()) {
        return code;
      }

      try {
        let neutralized = code;

        // Replace anti-DevTools patterns
        neutralized = neutralized.replace(
          CONFIG.antiDevToolsRegex,
          (match, ...args) => {
            const replacement = this.#getReplacement(match);
            Logger.debug(
              "Neutralized anti-DevTools code:",
              match.substring(0, 100)
            );
            return replacement;
          }
        );

        // Handle encoded debugger statements
        neutralized = neutralized.replace(
          /\\u0064\\u0065\\u0062\\u0075\\u0067\\u0067\\u0065\\u0072/g,
          ""
        );
        neutralized = neutralized.replace(
          /\u0064\u0065\u0062\u0075\u0067\u0067\u0065\u0072/g,
          ""
        );

        // Remove obfuscated debugger
        neutralized = neutralized.replace(/['"`]debugger['"`]/g, '""');
        neutralized = neutralized.replace(/\bdebugger\b/g, "");

        // Neutralize console blocking
        neutralized = neutralized.replace(
          /console\s*=\s*(?:\{\}|null|undefined|false)/g,
          "console = console"
        );
        neutralized = neutralized.replace(/window\.console\s*=\s*[^;]+/g, "");

        return neutralized;
      } catch (e) {
        Logger.warn("Code neutralization failed:", e.message);
        return code;
      }
    }

    static #getReplacement(match) {
      if (match.includes("debugger")) {
        return "/* debugger statement removed */";
      }
      if (match.includes("console")) {
        return "/* console detection removed */";
      }
      if (match.includes("addEventListener") || match.includes("keydown")) {
        return "/* key blocking removed */";
      }
      if (match.includes("performance") || match.includes("Date.now")) {
        return "/* timing detection removed */";
      }
      return "/* anti-DevTools code removed */";
    }
  }

  // DevTools Protection Bypass
  class DevToolsProtectionBypass {
    static apply() {
      this.#neutralizeFunctionConstructor();
      this.#neutralizeEval();
      this.#neutralizeTimers();
      this.#preventKeyBlocking();
      this.#restoreRightClick();
      this.#restoreTextSelection();
      this.#restoreConsole();
      this.#preventTimingDetection();
      this.#neutralizeDebuggerTricks();
      this.#patchMutationObserver();
      this.#restoreClipboard();
      this.#preventErrorOverrides();
    }

    // Neutralize Function constructor to prevent debugger injection
    static #neutralizeFunctionConstructor() {
      const handler = {
        construct(target, args) {
          if (args[0] && typeof args[0] === "string") {
            args[0] = CodeNeutralizer.neutralize(args[0]);
          }
          return Reflect.construct(target, args);
        },
        apply(target, thisArg, args) {
          if (args[0] && typeof args[0] === "string") {
            args[0] = CodeNeutralizer.neutralize(args[0]);
          }
          return Reflect.apply(target, thisArg, args);
        },
      };

      try {
        window.Function = new Proxy(ORIGINAL.Function, handler);
        if (typeof unsafeWindow !== "undefined") {
          unsafeWindow.Function = window.Function;
        }
        Logger.info("Function constructor protected");
      } catch (e) {
        Logger.warn("Function protection failed:", e.message);
      }
    }

    // Neutralize eval to prevent debugger injection
    static #neutralizeEval() {
      const safeEval = function (code) {
        if (typeof code === "string") {
          code = CodeNeutralizer.neutralize(code);
        }
        return ORIGINAL.eval.call(this, code);
      };

      try {
        Object.defineProperty(window, "eval", {
          value: safeEval,
          writable: false,
          configurable: false,
        });

        if (typeof unsafeWindow !== "undefined") {
          unsafeWindow.eval = safeEval;
        }
        Logger.info("eval function protected");
      } catch (e) {
        Logger.warn("eval protection failed:", e.message);
      }
    }

    // Neutralize timers that might inject debugger
    static #neutralizeTimers() {
      const wrapTimer = (original, name) => {
        return function (handler, delay, ...args) {
          if (typeof handler === "string") {
            handler = CodeNeutralizer.neutralize(handler);
          }
          return original.call(this, handler, delay, ...args);
        };
      };

      window.setTimeout = wrapTimer(ORIGINAL.setTimeout, "setTimeout");
      window.setInterval = wrapTimer(ORIGINAL.setInterval, "setInterval");

      Logger.info("Timer functions protected");
    }

    // Prevent key blocking (F12, Ctrl+Shift+I, etc.)
    static #preventKeyBlocking() {
      const events = ["keydown", "keypress", "keyup"];

      events.forEach((eventType) => {
        // Override addEventListener to prevent key blocking
        const originalAddListener = ORIGINAL.addEventListener;
        document.addEventListener = function (type, listener, options) {
          if (type === eventType && typeof listener === "function") {
            const originalListener = listener;
            listener = function (event) {
              const key = event.key?.toLowerCase();
              const code = event.code?.toLowerCase();

              // Allow DevTools keys
              const isDevToolsKey =
                key === "f12" ||
                (event.ctrlKey &&
                  event.shiftKey &&
                  ["i", "j", "c"].includes(key)) ||
                (event.ctrlKey && key === "u");

              if (isDevToolsKey) {
                Logger.debug("Allowing DevTools key:", key);
                return; // Don't call the original listener
              }

              return originalListener.call(this, event);
            };
          }
          return originalAddListener.call(this, type, listener, options);
        };

        // Also handle window events
        window.addEventListener = document.addEventListener;
      });

      // Block existing key event listeners by overriding preventDefault
      const originalPreventDefault = Event.prototype.preventDefault;
      Event.prototype.preventDefault = function () {
        const key = this.key?.toLowerCase();
        const isDevToolsKey =
          key === "f12" ||
          (this.ctrlKey && this.shiftKey && ["i", "j", "c"].includes(key)) ||
          (this.ctrlKey && key === "u");

        if (
          isDevToolsKey &&
          (this.type === "keydown" ||
            this.type === "keypress" ||
            this.type === "keyup")
        ) {
          Logger.debug("Prevented preventDefault on DevTools key:", key);
          return; // Don't prevent default for DevTools keys
        }

        return originalPreventDefault.call(this);
      };

      Logger.info("Key blocking prevention enabled");
    }

    // Restore right-click context menu
    static #restoreRightClick() {
      // Override contextmenu event blocking
      const originalAddListener = document.addEventListener;
      document.addEventListener = function (type, listener, options) {
        if (type === "contextmenu") {
          // Replace with a dummy function that doesn't block
          listener = function (e) {
            Logger.debug("Context menu allowed");
            return true;
          };
        }
        return originalAddListener.call(this, type, listener, options);
      };

      // Also handle oncontextmenu attribute
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "oncontextmenu"
          ) {
            mutation.target.removeAttribute("oncontextmenu");
            Logger.debug("Removed oncontextmenu attribute");
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        subtree: true,
        attributeFilter: ["oncontextmenu"],
      });

      Logger.info("Right-click restored");
    }

    // Restore text selection
    static #restoreTextSelection() {
      // Override selectstart event blocking
      const originalAddListener = document.addEventListener;
      const blockedEvents = ["selectstart", "dragstart", "copy", "cut"];

      document.addEventListener = function (type, listener, options) {
        if (blockedEvents.includes(type)) {
          listener = function (e) {
            Logger.debug("Selection/copy event allowed:", type);
            return true;
          };
        }
        return originalAddListener.call(this, type, listener, options);
      };

      // Remove CSS that prevents text selection
      const style = document.createElement("style");
      style.textContent = `
                *, *::before, *::after {
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    user-select: text !important;
                }
            `;
      document.head.appendChild(style);

      Logger.info("Text selection restored");
    }

    // Restore console if it was overridden
    static #restoreConsole() {
      try {
        // Check if console was disabled/overridden
        if (!window.console || typeof window.console.log !== "function") {
          window.console = ORIGINAL.console;
          Logger.info("Console restored");
        }

        // Ensure console methods are working
        Object.keys(ORIGINAL.console).forEach((method) => {
          if (!console[method] || typeof console[method] !== "function") {
            console[method] = ORIGINAL.console[method];
          }
        });

        // Prevent future console overrides
        Object.defineProperty(window, "console", {
          value: window.console,
          writable: false,
          configurable: false,
        });
      } catch (e) {
        Logger.warn("Console restoration failed:", e.message);
      }
    }

    // Prevent timing-based DevTools detection
    static #preventTimingDetection() {
      // Add small random delays to timing functions to break detection
      const addNoise = () => Math.random() * 2;

      try {
        Object.defineProperty(Date, "now", {
          value: () => ORIGINAL.now() + addNoise(),
          writable: false,
          configurable: false,
        });

        if (window.performance?.now) {
          Object.defineProperty(window.performance, "now", {
            value: () => ORIGINAL.performance() + addNoise(),
            writable: false,
            configurable: false,
          });
        }

        Logger.info("Timing detection prevented");
      } catch (e) {
        Logger.warn("Timing protection failed:", e.message);
      }
    }

    // Neutralize debugger tricks
    static #neutralizeDebuggerTricks() {
      // Override toString methods that might be used for detection
      const safeToString = function () {
        return this.name
          ? `function ${this.name}() { [native code] }`
          : "function() { [native code] }";
      };

      try {
        // Protect critical functions from toString inspection
        window.Function.prototype.toString = safeToString;
        window.eval.toString = () => "function eval() { [native code] }";

        Logger.info("Debugger tricks neutralized");
      } catch (e) {
        Logger.warn("Debugger trick neutralization failed:", e.message);
      }
    }

    // Monitor and clean injected scripts
    static #patchMutationObserver() {
      if (!window.MutationObserver) return;

      try {
        new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // Clean script content
                if (node.tagName === "SCRIPT" && node.textContent) {
                  const originalContent = node.textContent;
                  const cleanedContent =
                    CodeNeutralizer.neutralize(originalContent);

                  if (originalContent !== cleanedContent) {
                    node.textContent = cleanedContent;
                    Logger.debug("Cleaned injected script");
                  }
                }

                // Clean event attributes
                if (node.attributes) {
                  Array.from(node.attributes).forEach((attr) => {
                    if (
                      attr.name.startsWith("on") ||
                      attr.name === "oncontextmenu"
                    ) {
                      const cleaned = CodeNeutralizer.neutralize(attr.value);
                      if (
                        cleaned !== attr.value ||
                        attr.name === "oncontextmenu"
                      ) {
                        node.removeAttribute(attr.name);
                        Logger.debug(
                          "Removed/cleaned event attribute:",
                          attr.name
                        );
                      }
                    }
                  });
                }
              }
            });
          });
        }).observe(document.documentElement, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: [
            "onload",
            "onerror",
            "onclick",
            "oncontextmenu",
            "onkeydown",
            "onkeyup",
          ],
        });

        Logger.info("DOM monitoring active");
      } catch (e) {
        Logger.warn("DOM monitoring failed:", e.message);
      }
    }

    // Restore clipboard functionality
    static #restoreClipboard() {
      const clipboardEvents = ["copy", "cut", "paste"];

      clipboardEvents.forEach((eventType) => {
        document.addEventListener(
          eventType,
          (e) => {
            // Ensure clipboard events are not blocked
            e.stopImmediatePropagation();
          },
          true
        );
      });

      Logger.info("Clipboard functionality restored");
    }

    // Prevent error handling overrides that might block DevTools
    static #preventErrorOverrides() {
      const originalErrorHandler = window.onerror;

      window.addEventListener(
        "error",
        (e) => {
          // Don't let websites block error reporting
          e.stopImmediatePropagation();
        },
        true
      );

      // Prevent overriding of error handlers
      Object.defineProperty(window, "onerror", {
        set: function (handler) {
          Logger.debug("Prevented error handler override");
        },
        get: function () {
          return originalErrorHandler;
        },
      });

      Logger.info("Error override prevention active");
    }
  }

  // Main bypass controller
  class DevToolsBypass {
    static init() {
      try {
        Logger.info("Starting DevTools protection bypass...");

        // Apply all bypasses
        DevToolsProtectionBypass.apply();

        // Clean existing page content
        this.#cleanExistingContent();

        Logger.info("DevTools bypass activated successfully");

        // Show success indicator
        this.#showSuccessIndicator();
      } catch (e) {
        Logger.warn("Bypass initialization failed:", e.message);
      }
    }

    static #cleanExistingContent() {
      try {
        // Clean all existing script tags
        const scripts = document.querySelectorAll("script");
        scripts.forEach((script) => {
          if (script.textContent) {
            const cleaned = CodeNeutralizer.neutralize(script.textContent);
            if (cleaned !== script.textContent) {
              script.textContent = cleaned;
              Logger.debug("Cleaned existing script");
            }
          }
        });

        // Remove problematic event attributes
        const elementsWithEvents = document.querySelectorAll(
          "[oncontextmenu], [onkeydown], [onkeyup], [onselectstart], [ondragstart]"
        );
        elementsWithEvents.forEach((element) => {
          [
            "oncontextmenu",
            "onkeydown",
            "onkeyup",
            "onselectstart",
            "ondragstart",
          ].forEach((attr) => {
            if (element.hasAttribute(attr)) {
              element.removeAttribute(attr);
              Logger.debug("Removed event attribute:", attr);
            }
          });
        });
      } catch (e) {
        Logger.warn("Content cleaning failed:", e.message);
      }
    }

    static #showSuccessIndicator() {
      if (!CONFIG.logging.enabled) return;

      // Create a temporary success indicator
      const indicator = document.createElement("div");
      indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 999999;
                font-family: Arial, sans-serif;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            `;
      indicator.textContent = "✓ DevTools Bypass Active";

      document.body?.appendChild(indicator);

      // Remove after 3 seconds
      setTimeout(() => {
        indicator.remove();
      }, 3000);
    }
  }

  // Initialize immediately and on various events
  DevToolsBypass.init();

  // Also initialize when DOM is ready (fallback)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", DevToolsBypass.init);
  }

  // Initialize on window load (another fallback)
  window.addEventListener("load", DevToolsBypass.init);
})();
