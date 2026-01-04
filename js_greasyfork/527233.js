// ==UserScript==
// @name         Auto Regenerate on Server Busy (DeepSeek)
// @name:ar       مُجَدِّد ديب سيك (DeepSeek Regenerator)
// @namespace    Violentmonkey Scripts
// @version      1.5
// @description  Automatically regenerates messages on DeepSeek when the server is busy.
// @description:ar   سكربت مدعوم بالذكاء الاصطناعي لتحسين تجربة المستخدم على ديب سيك من خلال التجديد التلقائي، واكتشاف الأخطاء، والمحاولات الذكية.
// @author       Ezio Auditore
// @license      MIT
// @icon         https://i.imgur.com/3RqMFdM.png
// @match        https://chat.deepseek.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527233/Auto%20Regenerate%20on%20Server%20Busy%20%28DeepSeek%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527233/Auto%20Regenerate%20on%20Server%20Busy%20%28DeepSeek%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // -----------------------
  // Configuration Settings
  // -----------------------
  // This XPath query checks for a <p> element that contains either the English or Chinese busy message.
  const BUSY_MESSAGE_XPATH = `//p[contains(text(), "The server is busy. Please try again later.") or contains(text(), "服务器繁忙")]`;
  const REGENERATE_SVG_ID = "重新生成"; // The id of the <rect> element within the regenerate button
  const DEBOUNCE_DELAY = 500; // Debounce delay in milliseconds
  const CLICK_COOLDOWN = 3000; // Minimum interval between clicks (in ms)
  const POLLING_INTERVAL = 3000; // Fallback polling interval (in ms)
  const DEBUG = true; // Set to false to disable debug logging

  // -----------------------
  // Internal State Variables
  // -----------------------
  let lastClickTime = 0;
  let debounceTimer = null;

  // -----------------------
  // Utility: Debug Logging
  // -----------------------
  function log(...args) {
    if (DEBUG) {
      console.log("[AutoRegenerate]", ...args);
    }
  }

  // -----------------------
  // Core: Check for Busy Message & Click Regenerate
  // -----------------------
  function checkForServerBusy() {
    log("Checking for busy message...");

    // Use XPath to locate a <p> element that contains either the English or Chinese busy message.
    const busyMessage = document.evaluate(
      BUSY_MESSAGE_XPATH,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    if (busyMessage) {
      log("Busy message detected:", busyMessage.textContent);

      // Enforce click cooldown to prevent rapid, repeated clicks.
      const now = Date.now();
      if (now - lastClickTime < CLICK_COOLDOWN) {
        log("Click cooldown active; skipping click.");
        return;
      }

      // Locate the regenerate button by finding the <rect> element with the specified id.
      const regenerateSvg = document.querySelector(
        `rect[id="${REGENERATE_SVG_ID}"]`
      );
      if (regenerateSvg) {
        const buttonElement = regenerateSvg.closest("div.ds-icon-button");
        if (buttonElement) {
          log("Regenerate button found. Clicking...");
          buttonElement.click();
          lastClickTime = now;
          log("Clicked regenerate button.");
        } else {
          console.error(
            "Regenerate button container (div.ds-icon-button) not found."
          );
        }
      } else {
        console.error(
          "Regenerate SVG element not found with id:",
          REGENERATE_SVG_ID
        );
      }
    } else {
      log("No busy message detected.");
    }
  }

  // -----------------------
  // Debounce Wrapper
  // -----------------------
  function debouncedCheck() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(checkForServerBusy, DEBOUNCE_DELAY);
  }

  // -----------------------
  // MutationObserver Setup
  // -----------------------
  const observer = new MutationObserver((mutations) => {
    debouncedCheck();
  });

  function startObserver() {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
      log("MutationObserver started on document.body.");
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        observer.observe(document.body, { childList: true, subtree: true });
        log("MutationObserver started after DOMContentLoaded.");
      });
    }
  }

  // -----------------------
  // Fallback Polling
  // -----------------------
  function startPolling() {
    setInterval(checkForServerBusy, POLLING_INTERVAL);
    log("Fallback polling started (every", POLLING_INTERVAL, "ms).");
  }

  // -----------------------
  // Initialization
  // -----------------------
  function init() {
    startObserver();
    startPolling();
    // Also perform an initial check once the window loads.
    window.addEventListener("load", checkForServerBusy);
  }

  init();
})();
