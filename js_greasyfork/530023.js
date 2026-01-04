// ==UserScript==
// @name          Dark Mode Toggle
// @namespace     https://github.com/Alistair1231/my-userscripts/
// @version       0.3.0
// @description   dark mode using inversion, double-hit Esc for toggle button
// @author        Alistair1231
// @license       GPL-3.0
// @match         *://*/*
// @run-at        document-start
// @grant         GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/530023/Dark%20Mode%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/530023/Dark%20Mode%20Toggle.meta.js
// ==/UserScript==
// https://github.com/Alistair1231/my-userscripts/blob/master/dark-mode-toggle.user.js
// https://greasyfork.org/en/scripts/530023-dark-mode-toggle

(function () {
  "use strict";

  const CONFIG = {
    inversionPercent: 90,
    mediaInversionPercent: 100,
    uiTimeout: 3000,
    doublePressDelay: 500,
  };

  let isActive = false;
  let lastEscPress = 0;
  let uiTimeout;
  let btn = null;
  const style = `
          html {
              -webkit-filter: invert(${CONFIG.inversionPercent}%);
              filter: invert(${CONFIG.inversionPercent}%);
              background-color: white;
          }
          img, video, iframe, object, embed, canvas, svg {
              -webkit-filter: invert(${CONFIG.mediaInversionPercent}%);
              filter: invert(${CONFIG.mediaInversionPercent}%);
          }
      `;

  // Run initial setup immediately
  init();

  // Wait for DOM to be ready before creating the button
  document.addEventListener("DOMContentLoaded", () => {
    createButton();
  });

  // ! 
  // ! Functions
  // !
  // Function to create the toggle button
  function createButton() {
    if (!btn) {
      btn = document.createElement("button");
      btn.textContent = "🌓 Toggle Dark Mode";
      btn.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 2147483647 !important;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 4px;
          background: #fff;
          color: #333;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease;
      `;
      btn.addEventListener("click", () => {
        if (window.localStorage.darkMode === "true") {
          window.localStorage.darkMode = false;
        } else if (window.localStorage.darkMode === "false") {
          window.localStorage.darkMode = true;
        } else {
          window.localStorage.darkMode = true;
        }
        window.location.reload();
      });
      document.body.appendChild(btn);
    }
  }

  function handleEscPress() {
    const now = Date.now();
    if (now - lastEscPress < CONFIG.doublePressDelay) {
      showToggleUI();
    }
    lastEscPress = now;
  }

  function showToggleUI() {
    clearTimeout(uiTimeout);
    if (btn) {
      btn.style.visibility = "visible";
      btn.style.opacity = "1";
    }
    uiTimeout = setTimeout(() => {
      if (btn) {
        btn.style.opacity = "0";
        setTimeout(() => {
          btn.style.visibility = "hidden";
        }, 300);
      }
    }, CONFIG.uiTimeout);
  }

  // Initial setup that can run immediately
  function init() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") handleEscPress();
    });

    // Check localStorage and apply dark mode if needed
    if (window.localStorage.darkMode === "true") {
        GM.addStyle(style);
    }
  }
})();
