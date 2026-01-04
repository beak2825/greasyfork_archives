// ==UserScript==
// @name         Torn Background Editor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Allows editing of Torn background color
// @author       TR0LL [2561502],
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/529917/Torn%20Background%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/529917/Torn%20Background%20Editor.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ===== Configuration =====
  const CONFIG = {
    defaultBgColor: "#000000",
    selectorContentContainer: ".content.responsive-sidebar-container.logged-in"
  };

  // ===== State Management =====
  const state = {
    bgColor: GM_getValue("bgColor", CONFIG.defaultBgColor),
    isObserving: false
  };

  // ===== DOM Manipulation =====
  function applyBackgroundColor(color) {
    const contentContainer = document.querySelector(CONFIG.selectorContentContainer);
    if (contentContainer) {
      contentContainer.style.backgroundColor = color;
      return true;
    }
    return false;
  }

  function saveBackgroundColor(color) {
    // Validate color format
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      console.warn("Invalid color format:", color);
      return false;
    }

    state.bgColor = color;
    GM_setValue("bgColor", color);
    return applyBackgroundColor(color);
  }

  // ===== Observer for Dynamic Content =====
  const observer = new MutationObserver((mutations) => {
    // Only reapply if we found actual DOM changes that might affect our target
    const shouldReapply = mutations.some(mutation =>
      mutation.type === 'childList' ||
      (mutation.type === 'attributes' &&
       (mutation.attributeName === 'style' ||
        mutation.attributeName === 'class'))
    );

    if (shouldReapply) {
      applyBackgroundColor(state.bgColor);
    }
  });

  function startObserving() {
    if (state.isObserving) return;

    const contentContainer = document.querySelector(CONFIG.selectorContentContainer);
    if (contentContainer) {
      observer.observe(contentContainer, {
        attributes: true,
        childList: true,
        subtree: false // Only observe direct children
      });
      state.isObserving = true;
    }
  }

  function stopObserving() {
    observer.disconnect();
    state.isObserving = false;
  }

  // ===== UI Creation =====
  function createUI() {
    // Create popup container
    const popup = document.createElement("div");
    popup.id = "bgEditorPopup";

    // Apply styles
    Object.assign(popup.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "var(--main-bg, #1a1a1a)",
      padding: "20px",
      border: "1px solid #444",
      borderRadius: "10px",
      zIndex: "1000",
      display: "none",
      flexDirection: "column",
      gap: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
      minWidth: "250px"
    });

    // Add header
    const header = document.createElement("div");
    header.textContent = "Background Color Editor";
    Object.assign(header.style, {
      fontWeight: "bold",
      fontSize: "20px",
      marginBottom: "10px",
      borderBottom: "1px solid #444",
      paddingBottom: "5px"
    });
    popup.appendChild(header);

    // Create color inputs group
    const colorGroup = document.createElement("div");
    Object.assign(colorGroup.style, {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "15px"
    });

    // Add label
    const colorLabel = document.createElement("label");
    colorLabel.textContent = "Background:";
    colorLabel.style.minWidth = "90px";
    colorGroup.appendChild(colorLabel);

    // Add color picker
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = state.bgColor;
    colorInput.title = "Pick a color";
    colorGroup.appendChild(colorInput);

    // Add hex input
    const hexInput = document.createElement("input");
    hexInput.type = "text";
    hexInput.value = state.bgColor;
    hexInput.placeholder = "#RRGGBB";
    hexInput.title = "Enter hex color code";
    Object.assign(hexInput.style, {
      width: "80px",
      padding: "3px 5px"
    });
    colorGroup.appendChild(hexInput);

    popup.appendChild(colorGroup);

    // Create button group
    const buttonGroup = document.createElement("div");
    Object.assign(buttonGroup.style, {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "10px"
    });

    // Add reset button
    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.className = "torn-btn";
    buttonGroup.appendChild(resetButton);

    // Add save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.className = "torn-btn";
    buttonGroup.appendChild(saveButton);

    // Add close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.className = "torn-btn";
    buttonGroup.appendChild(closeButton);

    popup.appendChild(buttonGroup);
    document.body.appendChild(popup);

    // Event listeners for real-time updates
    colorInput.addEventListener("input", (e) => {
      const newColor = e.target.value;
      hexInput.value = newColor;
      applyBackgroundColor(newColor);
    });

    // Handle hex input with better real-time validation
    let hexTimeout;
    hexInput.addEventListener("input", (e) => {
      // Always update immediately for feedback
      let value = e.target.value;

      // Auto-add hash if missing
      if (!value.startsWith("#")) {
        value = "#" + value;
        e.target.value = value;
      }

      // Clear previous timeout to prevent multiple delayed updates
      if (hexTimeout) clearTimeout(hexTimeout);

      // For complete valid hex codes, update immediately
      if (/^#[0-9A-Fa-f]{6}$/i.test(value)) {
        colorInput.value = value;
        applyBackgroundColor(value);
      }
      // For partial codes (while user is typing), use best attempt
      else if (/^#[0-9A-Fa-f]{1,5}$/i.test(value)) {
        // Pad the hex with trailing zeros if incomplete
        const paddedValue = value.padEnd(7, '0');
        // Apply with short delay to avoid flicker during typing
        hexTimeout = setTimeout(() => applyBackgroundColor(paddedValue), 50);
      }
    });

    saveButton.addEventListener("click", () => {
      // The color is already applied in real-time, just save the value
      saveBackgroundColor(colorInput.value);
      popup.style.display = "none";
      startObserving();
    });

    resetButton.addEventListener("click", () => {
      colorInput.value = CONFIG.defaultBgColor;
      hexInput.value = CONFIG.defaultBgColor;
      applyBackgroundColor(CONFIG.defaultBgColor);
    });

    closeButton.addEventListener("click", () => {
      // Revert to saved color if changed but not saved
      applyBackgroundColor(state.bgColor);
      popup.style.display = "none";
    });

    // Create the toggle button (only on preferences page)
    if (window.location.href.includes("https://www.torn.com/preferences.php")) {
      const toggleButton = document.createElement("button");
      toggleButton.textContent = "Background Editor";
      toggleButton.className = "torn-btn";
      Object.assign(toggleButton.style, {
        position: "fixed",
        top: "40px",
        left: "10px",
        zIndex: "999"
      });

      toggleButton.addEventListener("click", () => {
        popup.style.display = popup.style.display === "flex" ? "none" : "flex";

        // Update inputs to current values when opening
        if (popup.style.display === "flex") {
          colorInput.value = state.bgColor;
          hexInput.value = state.bgColor;
          stopObserving(); // Pause observer while UI is open
        } else {
          startObserving(); // Resume observer when UI is closed
        }
      });

      document.body.appendChild(toggleButton);
    }

    return popup;
  }

  // ===== Initialization =====
  function init() {
    // Apply saved background color
    if (!applyBackgroundColor(state.bgColor)) {
      // If element not found immediately, wait for DOM to be ready
      window.addEventListener("DOMContentLoaded", () => {
        applyBackgroundColor(state.bgColor);
        startObserving();
      });
    } else {
      startObserving();
    }

    // Create UI
    createUI();
  }

  // Start the script
  init();
})();