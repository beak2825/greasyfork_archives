// ==UserScript==
// @name         Freediumify Medium
// @namespace    https://greasyfork.org/users/3786
// @version      20251016
// @description  Bypasses Medium paywall using Freedium
// @description:ru  Добавляет кнопку для чтения платных статей на medium.com через freedium
// @author       Maranchuk Sergey <slav0nic0@gmail.com>
// @match        https://medium.com/*
// @match        https://*.medium.com/*
// @icon         https://icons.duckduckgo.com/ip2/freedium.cfd.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544528/Freediumify%20Medium.user.js
// @updateURL https://update.greasyfork.org/scripts/544528/Freediumify%20Medium.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const BUTTON_ID = "freedium-button-container";
  const FREEDIUM_BASE_URL = "https://freedium-mirror.cfd/";
  const DEBOUNCE_DELAY = 1000;

  const SELECTORS = {
    jsonLd: 'script[type="application/ld+json"]',
    meteredContent: ".meteredContent",
  };

  function isMemberOnlyArticle() {
    // Check JSON-LD structured data first (most reliable)
    try {
      const jsonLdScript = document.querySelector(SELECTORS.jsonLd);
      if (jsonLdScript) {
        const data = JSON.parse(jsonLdScript.textContent);
        if (data.isAccessibleForFree === false) {
          return true;
        }
      }
    } catch (e) {}

    // Check for meteredContent class
    return !!document.querySelector(SELECTORS.meteredContent);
  }

  function createButton() {
    const button = document.createElement("div");
    button.id = BUTTON_ID;
    button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
            transition: all 0.3s ease;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;

    const iconSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            </svg>
        `;
    button.innerHTML = iconSvg + "<span>Read Free</span>";

    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.05)";
      this.style.boxShadow = "0 6px 20px rgba(34, 197, 94, 0.4)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
      this.style.boxShadow = "0 4px 12px rgba(34, 197, 94, 0.3)";
    });

    button.addEventListener("click", function () {
      const freediumUrl = FREEDIUM_BASE_URL + window.location.href;
      window.open(freediumUrl, "_blank");
    });

    return button;
  }

  function addFreediumButton() {
    // Check if button already exists
    if (document.getElementById(BUTTON_ID)) {
      return;
    }

    // Check if this is a member-only article
    if (!isMemberOnlyArticle()) {
      return;
    }

    const button = createButton();
    document.body.appendChild(button);
  }

  function removeButton() {
    const button = document.getElementById(BUTTON_ID);
    if (button) {
      button.remove();
    }
  }

  // Initial check
  addFreediumButton();

  // Setup SPA navigation observer
  let currentUrl = window.location.href;
  let debounceTimer = null;

  const observer = new MutationObserver(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      removeButton();

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(addFreediumButton, DEBOUNCE_DELAY);
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });
})();
