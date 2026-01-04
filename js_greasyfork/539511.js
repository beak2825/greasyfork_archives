// ==UserScript==
// @name         T3 Chat Auto Theme Toggle
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically toggle T3 Chat theme based on system preference
// @icon         https://t3.chat/favicon.ico
// @author       Benjamin Brkic
// @match        https://t3.chat/*
// @grant        none
// @run-at       document-end
// @tag          t3chat, t3.gg
// @downloadURL https://update.greasyfork.org/scripts/539511/T3%20Chat%20Auto%20Theme%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/539511/T3%20Chat%20Auto%20Theme%20Toggle.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function findThemeToggleButton() {
    // Find the span with "Toggle theme" text and get its parent button
    const spans = document.querySelectorAll("span.sr-only");
    for (const span of spans) {
      if (span.textContent.trim() === "Toggle theme") {
        return span.closest("button");
      }
    }
    return null;
  }

  function toggleThemeIfNeeded() {
    const button = findThemeToggleButton();
    if (!button) {
      console.log("Theme toggle button not found");
      return;
    }

    // Detect system theme preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const systemTheme = prefersDark ? "dark" : "light";

    // Get current theme from localStorage
    const currentTheme = localStorage.getItem("theme");
    if (!currentTheme) {
      console.log("No theme found in localStorage");
      return;
    }

    console.log(`System prefers: ${systemTheme}, Current: ${currentTheme}`);

    // Toggle if system preference doesn't match current state
    if (systemTheme !== currentTheme) {
      console.log(`Toggling theme from ${currentTheme} to ${systemTheme}`);
      button.click();
    } else {
      console.log("Theme already matches system preference");
    }
  }

  // Wait a bit for the page to fully load and then toggle
  setTimeout(() => {
    toggleThemeIfNeeded();
  }, 1000);

  // Also listen for system theme changes and toggle accordingly
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      console.log("System theme preference changed");
      setTimeout(toggleThemeIfNeeded, 500);
    });
})();
