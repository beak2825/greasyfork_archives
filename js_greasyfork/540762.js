// ==UserScript==
// @name         Prime Video Enhancer
// @namespace    https://github.com/bernardopg
// @version      2.0
// @description  Enhanced Prime Video experience with X-ray hiding, ad skipping, cursor management, and more
// @author       bernardopg
// @icon         https://www.primevideo.com/favicon.ico
// @match        https://www.primevideo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540762/Prime%20Video%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/540762/Prime%20Video%20Enhancer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    logging: false, // Set to true for debugging
    adSkip: {
      tries: 3,
      delay: 1500,
      selectors: [
        ".adSkipButton.skippable",
        '[data-testid="skip-ad-button"]',
        ".atvwebplayersdk-skipelements-button",
      ],
    },
    xray: {
      selectors: [
        ".xrayQuickView",
        '[data-testid="x-ray-panel"]',
        ".dv-player-fullscreen .xrayQuickView",
      ],
    },
    cursor: {
      hideDelay: 3000,
      playerSelectors: [
        ".webPlayerUIContainer",
        '[data-testid="video-player"]',
        ".dv-player-fullscreen",
      ],
    },
  };

  // Utility functions
  const Utils = {
    log: function (message, type = "info") {
      if (!CONFIG.logging) return;
      const prefix = "[Prime Video Enhancer]";
      console[type](`${prefix} ${message}`);
    },

    isElementVisible: function (element) {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    },

    waitForElement: function (selector, timeout = 10000) {
      return new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }

        const observer = new MutationObserver(() => {
          const element = document.querySelector(selector);
          if (element) {
            observer.disconnect();
            resolve(element);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, timeout);
      });
    },

    debounce: function (func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
  };

  // X-ray Panel Manager
  const XrayManager = {
    styleInjected: false,

    init: function () {
      this.injectStyles();
      this.observeXrayElements();
      Utils.log("X-ray manager initialized");
    },

    injectStyles: function () {
      if (this.styleInjected) return;

      const style = document.createElement("style");
      style.type = "text/css";
      style.id = "prime-video-enhancer-xray";

      const css = `
                ${CONFIG.xray.selectors.join(", ")} {
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
            `;

      style.textContent = css;
      document.head.appendChild(style);
      this.styleInjected = true;
      Utils.log("X-ray hiding styles injected");
    },

    observeXrayElements: function () {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              CONFIG.xray.selectors.forEach((selector) => {
                if (node.matches && node.matches(selector)) {
                  this.hideElement(node);
                }
                const elements =
                  node.querySelectorAll && node.querySelectorAll(selector);
                if (elements) {
                  elements.forEach((el) => this.hideElement(el));
                }
              });
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    },

    hideElement: function (element) {
      if (element) {
        element.style.setProperty("visibility", "hidden", "important");
        element.style.setProperty("opacity", "0", "important");
        element.style.setProperty("pointer-events", "none", "important");
        Utils.log("X-ray element hidden");
      }
    },
  };

  // Ad Skipper
  const AdSkipper = {
    init: function () {
      this.hookFetch();
      this.observeAds();
      Utils.log("Ad skipper initialized");
    },

    hookFetch: function () {
      const originalFetch = window.fetch;
      if (typeof originalFetch !== "function") return;

      window.fetch = function (...args) {
        const result = originalFetch.apply(this, args);
        result
          .then(() => {
            AdSkipper.checkForAds();
          })
          .catch(() => {
            // Silently handle fetch errors
          });
        return result;
      };
    },

    observeAds: function () {
      const observer = new MutationObserver(
        Utils.debounce(() => {
          this.checkForAds();
        }, 500)
      );

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    },

    checkForAds: function () {
      CONFIG.adSkip.selectors.forEach((selector) => {
        const button = document.querySelector(selector);
        if (button && Utils.isElementVisible(button)) {
          this.skipAd(button);
        }
      });
    },

    skipAd: function (button) {
      try {
        button.click();
        Utils.log("Ad skipped successfully");
      } catch (error) {
        Utils.log(`Failed to skip ad: ${error.message}`, "error");
      }
    },
  };

  // Cursor Manager
  const CursorManager = {
    hideTimeout: null,
    isPlayerActive: false,

    init: function () {
      this.observePlayer();
      Utils.log("Cursor manager initialized");
    },

    observePlayer: function () {
      const observer = new MutationObserver(() => {
        this.setupCursorHiding();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      this.setupCursorHiding();
    },

    setupCursorHiding: function () {
      CONFIG.cursor.playerSelectors.forEach((selector) => {
        const player = document.querySelector(selector);
        if (player && !player.dataset.cursorSetup) {
          this.attachCursorEvents(player);
          player.dataset.cursorSetup = "true";
        }
      });
    },

    attachCursorEvents: function (player) {
      const videoElement = player.querySelector("video");

      player.addEventListener("mouseenter", () => {
        this.isPlayerActive = true;
        this.scheduleCursorHide(player);
      });

      player.addEventListener("mouseleave", () => {
        this.isPlayerActive = false;
        this.showCursor(player);
      });

      player.addEventListener("mousemove", () => {
        if (this.isPlayerActive) {
          this.showCursor(player);
          this.scheduleCursorHide(player);
        }
      });

      // Show cursor when video is paused
      if (videoElement) {
        videoElement.addEventListener("pause", () => {
          this.showCursor(player);
        });
      }
    },

    scheduleCursorHide: function (player) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = setTimeout(() => {
        if (this.isPlayerActive) {
          this.hideCursor(player);
        }
      }, CONFIG.cursor.hideDelay);
    },

    hideCursor: function (player) {
      player.style.cursor = "none";
      Utils.log("Cursor hidden");
    },

    showCursor: function (player) {
      clearTimeout(this.hideTimeout);
      player.style.cursor = "default";
    },
  };

  // Quality Manager (New Feature)
  const QualityManager = {
    init: function () {
      this.addKeyboardShortcuts();
      Utils.log("Quality manager initialized");
    },

    addKeyboardShortcuts: function () {
      document.addEventListener("keydown", (event) => {
        // Only trigger on video player pages
        if (!document.querySelector("video")) return;

        switch (event.key.toLowerCase()) {
          case "h":
            if (event.ctrlKey) {
              event.preventDefault();
              this.openQualitySettings();
            }
            break;
          case "f":
            if (event.ctrlKey) {
              event.preventDefault();
              this.toggleFullscreen();
            }
            break;
        }
      });
    },

    openQualitySettings: function () {
      const settingsButton =
        document.querySelector('[data-testid="settings-button"]') ||
        document.querySelector(".atvwebplayersdk-settings-button");
      if (settingsButton) {
        settingsButton.click();
        Utils.log("Quality settings opened");
      }
    },

    toggleFullscreen: function () {
      const fullscreenButton =
        document.querySelector('[data-testid="fullscreen-button"]') ||
        document.querySelector(".atvwebplayersdk-fullscreen-button");
      if (fullscreenButton) {
        fullscreenButton.click();
        Utils.log("Fullscreen toggled");
      }
    },
  };

  // Auto-play Manager (New Feature)
  const AutoPlayManager = {
    init: function () {
      this.handleNextEpisode();
      Utils.log("Auto-play manager initialized");
    },

    handleNextEpisode: function () {
      const observer = new MutationObserver(() => {
        const nextButton =
          document.querySelector('[data-testid="next-episode-button"]') ||
          document.querySelector(".nextupcard-button");

        if (nextButton && Utils.isElementVisible(nextButton)) {
          setTimeout(() => {
            if (nextButton.parentNode) {
              nextButton.click();
              Utils.log("Auto-played next episode");
            }
          }, 2000); // Wait 2 seconds before auto-clicking
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    },
  };

  // Main initialization
  function initialize() {
    Utils.log("Prime Video Enhancer starting...");

    // Wait for the page to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", startEnhancements);
    } else {
      startEnhancements();
    }
  }

  function startEnhancements() {
    try {
      XrayManager.init();
      AdSkipper.init();
      CursorManager.init();
      QualityManager.init();
      AutoPlayManager.init();

      Utils.log("All enhancements initialized successfully");
    } catch (error) {
      Utils.log(`Initialization error: ${error.message}`, "error");
    }
  }

  // Start the enhancer
  initialize();
})();
