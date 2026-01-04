// ==UserScript==
// @name Dark Mode 2: Electric Boogaloo
// @description Adds a dark mode option to websites that don't natively support it.
// @include *
// @version 3
// @grant GM_addStyle
// @namespace Tampermonkey
// @downloadURL https://update.greasyfork.org/scripts/464622/Dark%20Mode%202%3A%20Electric%20Boogaloo.user.js
// @updateURL https://update.greasyfork.org/scripts/464622/Dark%20Mode%202%3A%20Electric%20Boogaloo.meta.js
// ==/UserScript==

const DARK_MODE_ENABLED = "dm_enabled";
const DARK_MODE_BUTTON_TEXT = "Toggle Dark Mode";

function enableDarkMode() {
  GM_addStyle(`
    body {
      background-color: #2b2b2b !important;
      color: #e6e6e6 !important;
      transition: background-color 0.5s ease, color 0.5s ease;
    }
  `);
  localStorage.setItem(DARK_MODE_ENABLED, true);
}

function disableDarkMode() {
  GM_addStyle(`
    body {
      background-color: #fff !important;
      color: #000 !important;
      transition: background-color 0.5s ease, color 0.5s ease;
    }
  `);
  localStorage.setItem(DARK_MODE_ENABLED, false);
}

function toggleDarkMode() {
  localStorage.getItem(DARK_MODE_ENABLED) === "true" ? disableDarkMode() : enableDarkMode();
  updateDarkModeButton();
}

function updateDarkModeButton() {
  const darkModeButton = document.getElementById("dark-mode-button");
  const isEnabled = localStorage.getItem(DARK_MODE_ENABLED) === "true";
  darkModeButton.innerHTML = isEnabled ? "Disable Dark Mode" : DARK_MODE_BUTTON_TEXT;
}

function createDarkModeButton() {
  const darkModeButton = document.createElement("button");
  darkModeButton.id = "dark-mode-button";
  darkModeButton.innerHTML = DARK_MODE_BUTTON_TEXT;
  darkModeButton.style.cssText = "position:fixed;bottom:20px;right:20px;padding:10px;background:#444;color:#fff;border:none;border-radius:5px;cursor:pointer;";
  darkModeButton.addEventListener("click", toggleDarkMode);
  document.body.appendChild(darkModeButton);
  updateDarkModeButton();
}

createDarkModeButton();