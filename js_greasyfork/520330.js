// ==UserScript==
// @name         YCS Auto Minimize
// @namespace    http://tampermonkey.net/
// @version      2.27
// @description  Minimizes the YCS menu to save screen real estate; auto-toggle between min/maximized states based on preference.
// @author       eedo31
// @match        https://www.youtube.com/watch?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520330/YCS%20Auto%20Minimize.user.js
// @updateURL https://update.greasyfork.org/scripts/520330/YCS%20Auto%20Minimize.meta.js
// ==/UserScript==

// v2.27 Added aria-label for better accessibility

(function () {
  "use strict";

  // Configuration constants
  const RETRY_DELAY = 1000; // Delay for retrying to find elements
  const MAX_RETRIES = 10; // Maximum number of retries to find elements
  const LOCAL_STORAGE_KEY = "ycs_minimized"; // LocalStorage key for state persistence

  // Utility functions
  function applyStyles() {
    GM_addStyle(`
      .ycs-minimize-bar {
        width: calc(100% + 30px);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        padding: 10px 15px;
        background-color: transparent;
        border-radius: 10px;
        box-sizing: border-box;
        position: relative;
        left: -15px;
        z-index: 1000;
      }

      .ycs-minimize-bar:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .ycs-minimize-bar span {
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        margin: 0;
        padding: 0;
        text-align: left;
        width: 100%;
      }

      .ycs-app-main {
        display: block;
      }

      .ycs-app {
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
        border: 1px solid #ccc;
        padding-top: 0;
      }
    `);
  }

  // DOM Manipulation functions
  function createMinimizeBar() {
    const minimizeBar = document.createElement("div");
    minimizeBar.classList.add("ycs-minimize-bar");

    // Add aria-label for accessibility
    minimizeBar.setAttribute("aria-label", "Toggle YCS menu visibility");

    const text = document.createElement("span");
    text.textContent = "Maximize YCS"; // Default text when minimized
    minimizeBar.appendChild(text);

    return minimizeBar;
  }

  function addMinimizeBarToPage(minimizeBar) {
    const ycsApp = document.querySelector(".ycs-app");

    if (!ycsApp) {
      console.warn("Cannot find .ycs-app, retrying...");
      return false; // Failed to find the YCS app container
    }

    setDynamicPadding(ycsApp, minimizeBar);
    ycsApp.insertBefore(minimizeBar, ycsApp.firstChild);
    return true; // Successfully added the minimize bar
  }

  function setDynamicPadding(ycsApp, minimizeBar) {
    const appPadding = parseInt(window.getComputedStyle(ycsApp).paddingLeft, 10);
    minimizeBar.style.paddingLeft = `${appPadding}px`;
  }

  // State management functions
  function getInitialState() {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedState === "true"; // Return true if saved state is minimized
  }

  function setMinimizedState(isMinimized) {
    localStorage.setItem(LOCAL_STORAGE_KEY, isMinimized.toString());
  }

  // Bar interaction logic
  function toggleMinimizeBar(minimizeBar, ycsApp) {
    const main = ycsApp.querySelector(".ycs-app-main");
    const text = minimizeBar.querySelector("span");

    if (!main) return;

    if (main.style.display === "none") {
      main.style.display = "block";
      text.textContent = "Minimize YCS";
      ycsApp.style.height = "";
      setMinimizedState(false);
    } else {
      main.style.display = "none";
      text.textContent = "Maximize YCS";
      ycsApp.style.height = "40px";
      setMinimizedState(true);
    }
  }

  function setupBarEventListener(minimizeBar, ycsApp) {
    minimizeBar.addEventListener("click", () => toggleMinimizeBar(minimizeBar, ycsApp));
  }

  // Initialize the state and setup the bar
  function initializeMenuState(ycsApp) {
    const isMinimized = getInitialState();
    const main = ycsApp.querySelector(".ycs-app-main");
    const text = ycsApp.querySelector(".ycs-minimize-bar span");

    if (!main) return;

    if (isMinimized) {
      main.style.display = "none";
      ycsApp.style.height = "40px";
      text.textContent = "Maximize YCS";
    } else {
      main.style.display = "block";
      ycsApp.style.height = "";
      text.textContent = "Minimize YCS";
    }
  }

  // Core function to add the minimize bar
  function addMinimizeBar() {
    const minimizeBar = createMinimizeBar();
    const ycsApp = document.querySelector(".ycs-app");

    if (addMinimizeBarToPage(minimizeBar)) {
      setupBarEventListener(minimizeBar, ycsApp);
      initializeMenuState(ycsApp);
    } else {
      retryCount++;
      if (retryCount > MAX_RETRIES) {
        console.error("Max retries reached, couldn't find .ycs-app.");
        return;
      }
      setTimeout(addMinimizeBar, RETRY_DELAY);
    }
  }

  let retryCount = 0;

  // Initialize the script
  window.onload = function () {
    applyStyles();
    addMinimizeBar();
  };
})();
