// ==UserScript==
// @name         ProgressUI Module-js-old
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Reusable progress UI module for Tampermonkey scripts
// @author       You
// @grant        none
// @match        *://*/*
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530495/ProgressUI%20Module-js-old.user.js
// @updateURL https://update.greasyfork.org/scripts/530495/ProgressUI%20Module-js-old.meta.js
// ==/UserScript==

// You can include this file as a module in other userscripts using:
// @require      [URL_TO_THIS_SCRIPT]

(function (global) {
  "use strict";

  const ProgressUI = {
    /**
     * Creates and displays a progress UI on the page
     * @returns {Object} UI elements object containing references to created DOM elements
     */
    create: (options = {}) => {
      const config = {
        position: options.position || "top-right",
        width: options.width || "300px",
        theme: options.theme || "light",
        ...options,
      };

      // Remove any existing progress UI
      const existingUI = document.querySelector(".progress-ui-container");
      if (existingUI) {
        existingUI.remove();
      }

      // Create container
      const progressContainer = document.createElement("div");
      progressContainer.className = "progress-ui-container";

      // Set position
      let positionStyle = "position: fixed; z-index: 9999;";
      switch (config.position) {
        case "top-left":
          positionStyle += "top: 20px; left: 20px;";
          break;
        case "top-center":
          positionStyle += "top: 20px; left: 50%; transform: translateX(-50%);";
          break;
        case "bottom-left":
          positionStyle += "bottom: 20px; left: 20px;";
          break;
        case "bottom-right":
          positionStyle += "bottom: 20px; right: 20px;";
          break;
        case "bottom-center":
          positionStyle +=
            "bottom: 20px; left: 50%; transform: translateX(-50%);";
          break;
        case "center":
          positionStyle +=
            "top: 50%; left: 50%; transform: translate(-50%, -50%);";
          break;
        default: // top-right
          positionStyle += "top: 20px; right: 20px;";
      }

      // Set theme colors
      let colors = {
        background: "#f8f8f8",
        text: "#333333",
        border: "#e0e0e0",
        progressBg: "#e0e0e0",
        progressFill: "#4CAF50",
        shadow: "rgba(0,0,0,0.2)",
      };

      if (config.theme === "dark") {
        colors = {
          background: "#2a2a2a",
          text: "#ffffff",
          border: "#444444",
          progressBg: "#444444",
          progressFill: "#4CAF50",
          shadow: "rgba(0,0,0,0.5)",
        };
      }

      // Apply styles
      progressContainer.style.cssText = `
                    ${positionStyle}
                    background-color: ${colors.background};
                    color: ${colors.text};
                    padding: 15px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px ${colors.shadow};
                    width: ${config.width};
                    direction: ltr;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    transition: opacity 0.3s ease;
                `;

      // Create status element
      const statusElement = document.createElement("div");
      statusElement.className = "progress-ui-status";
      statusElement.style.cssText = `
                    margin-bottom: 10px;
                    font-size: 14px;
                    font-weight: 500;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                `;

      // Create progress bar container
      const progressBarContainer = document.createElement("div");
      progressBarContainer.className = "progress-ui-bar-container";
      progressBarContainer.style.cssText = `
                    width: 100%;
                    background-color: ${colors.progressBg};
                    border-radius: 4px;
                    height: 10px;
                    overflow: hidden;
                `;

      // Create progress bar
      const progressBar = document.createElement("div");
      progressBar.className = "progress-ui-bar";
      progressBar.style.cssText = `
                    height: 100%;
                    width: 0%;
                    background-color: ${colors.progressFill};
                    transition: width 0.3s;
                `;

      // Create percentage text
      const percentText = document.createElement("div");
      percentText.className = "progress-ui-percent";
      percentText.style.cssText = `
                    text-align: right;
                    margin-top: 5px;
                    font-size: 12px;
                    font-weight: 600;
                `;

      // Add optional close button
      const closeButton = document.createElement("div");
      closeButton.className = "progress-ui-close";
      closeButton.innerHTML = "×";
      closeButton.style.cssText = `
                    position: absolute;
                    top: 5px;
                    right: 8px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    color: ${colors.text};
                    opacity: 0.6;
                `;
      closeButton.addEventListener("click", () => {
        progressContainer.remove();
      });

      // Add optional title
      if (config.title) {
        const titleElement = document.createElement("div");
        titleElement.className = "progress-ui-title";
        titleElement.textContent = config.title;
        titleElement.style.cssText = `
                        margin-bottom: 10px;
                        font-size: 16px;
                        font-weight: bold;
                        padding-right: 15px;
                    `;
        progressContainer.appendChild(titleElement);
      }

      // Assemble UI
      progressBarContainer.appendChild(progressBar);
      progressContainer.appendChild(statusElement);
      progressContainer.appendChild(progressBarContainer);
      progressContainer.appendChild(percentText);

      if (config.closable !== false) {
        progressContainer.appendChild(closeButton);
      }

      document.body.appendChild(progressContainer);

      return {
        container: progressContainer,
        status: statusElement,
        progressBar: progressBar,
        percentText: percentText,

        // Add helper method to check if UI still exists
        exists: function () {
          return document.body.contains(this.container);
        },
      };
    },

    /**
     * Updates the progress UI
     * @param {Object} elements - UI elements object returned from create()
     * @param {String} message - Status message to display
     * @param {Number} percent - Progress percentage (0-100)
     * @returns {Boolean} - True if update successful, false if UI not found
     */
    update: (elements, message = null, percent = null) => {
      if (
        !elements ||
        !elements.container ||
        !document.body.contains(elements.container)
      ) {
        return false;
      }

      if (message !== null && elements.status) {
        elements.status.textContent = message;
      }

      if (percent !== null && !isNaN(percent)) {
        const clampedPercent = Math.max(0, Math.min(100, percent));
        elements.progressBar.style.width = `${clampedPercent}%`;
        elements.percentText.textContent = `${Math.round(clampedPercent)}%`;
      }

      return true;
    },

    /**
     * Removes the progress UI after a delay
     * @param {Object} elements - UI elements object returned from create()
     * @param {Number} delay - Delay in milliseconds before removal
     * @param {Boolean} fade - Whether to fade out before removal
     */
    cleanup: (elements, delay = 3000, fade = true) => {
      if (
        !elements ||
        !elements.container ||
        !document.body.contains(elements.container)
      ) {
        return;
      }

      setTimeout(() => {
        if (!document.body.contains(elements.container)) {
          return;
        }

        if (fade) {
          elements.container.style.opacity = "0";
          setTimeout(() => {
            if (document.body.contains(elements.container)) {
              document.body.removeChild(elements.container);
            }
          }, 300);
        } else {
          document.body.removeChild(elements.container);
        }
      }, delay);
    },

    /**
     * Shows a quick message with progress and auto-removes it
     * @param {String} message - Message to display
     * @param {Object} options - Configuration options
     */
    showQuick: (message, options = {}) => {
      const elements = ProgressUI.create({
        ...options,
        closable: options.closable !== false,
      });

      ProgressUI.update(elements, message, options.percent || 100);
      ProgressUI.cleanup(elements, options.duration || 3000, true);

      return elements;
    },
  };

  // Make ProgressUI available globally
  global.ProgressUI = ProgressUI;
})(typeof unsafeWindow !== "undefined" ? unsafeWindow : window);
