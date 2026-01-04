// ==UserScript==
// @name         Font Customizer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Customize fonts for any website through the Tampermonkey menu
// @author       Cursor, claude-3.7, and me(qooo).
// @license      MIT
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik05LjkzIDEzLjVoNC4xNEwxMiA3Ljk4ek0yMCAySDRjLTEuMSAwLTIgLjktMiAydjE2YzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNGMwLTEuMS0uOS0yLTItMm0tNC4wNSAxNi41bC0xLjE0LTNIOS4xN2wtMS4xMiAzSDUuOTZsNS4xMS0xM2gxLjg2bDUuMTEgMTN6Ii8+PC9zdmc+
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      fonts.googleapis.com
// @connect      fonts.gstatic.com
// @downloadURL https://update.greasyfork.org/scripts/529951/Font%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/529951/Font%20Customizer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Storage keys
  const STORAGE_KEY_PREFIX = "fontCustomizer_";
  const ENABLED_SUFFIX = "_enabled";
  const FONT_SUFFIX = "_font";
  const FONT_LIST_KEY = "fontCustomizer_globalFonts";

  // Common web fonts from Google Fonts
  const WEB_FONTS = [
    {
      name: "Roboto",
      family: "Roboto, sans-serif",
      url: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
    },
    {
      name: "Open Sans",
      family: "'Open Sans', sans-serif",
      url: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap",
    },
    {
      name: "Lato",
      family: "Lato, sans-serif",
      url: "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap",
    },
    {
      name: "Montserrat",
      family: "Montserrat, sans-serif",
      url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap",
    },
    {
      name: "Poppins",
      family: "Poppins, sans-serif",
      url: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
    },
    {
      name: "Source Sans Pro",
      family: "'Source Sans Pro', sans-serif",
      url: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap",
    },
    {
      name: "Ubuntu",
      family: "Ubuntu, sans-serif",
      url: "https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap",
    },
    {
      name: "Nunito",
      family: "Nunito, sans-serif",
      url: "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap",
    },
    {
      name: "Playfair Display",
      family: "'Playfair Display', serif",
      url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap",
    },
    {
      name: "Merriweather",
      family: "Merriweather, serif",
      url: "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap",
    },
  ];

  // Load a web font
  function loadWebFont(fontUrl) {
    GM_xmlhttpRequest({
      method: "GET",
      url: fontUrl,
      onload: function (response) {
        const style = document.createElement("style");
        style.textContent = response.responseText;
        document.head.appendChild(style);
      },
    });
  }

  // Get saved fonts or initialize with empty array
  function getSavedFonts() {
    return GM_getValue(FONT_LIST_KEY, []);
  }

  // Save a font to the list if it doesn't exist already
  function saveFontToList(font) {
    const fonts = getSavedFonts();
    if (!fonts.includes(font)) {
      fonts.push(font);
      GM_setValue(FONT_LIST_KEY, fonts);
    }
  }

  // Remove a font from the saved list
  function removeFontFromList(font) {
    const fonts = getSavedFonts();
    const index = fonts.indexOf(font);
    if (index !== -1) {
      fonts.splice(index, 1);
      GM_setValue(FONT_LIST_KEY, fonts);
    }
  }

  // Get current hostname
  const hostname = window.location.hostname;

  // Storage helper functions
  function getStorageKey(suffix) {
    return STORAGE_KEY_PREFIX + hostname + suffix;
  }

  function isEnabledForSite() {
    return localStorage.getItem(getStorageKey(ENABLED_SUFFIX)) === "true";
  }

  function setEnabledForSite(enabled) {
    localStorage.setItem(getStorageKey(ENABLED_SUFFIX), enabled.toString());
  }

  function getFontForSite() {
    return localStorage.getItem(getStorageKey(FONT_SUFFIX)) || "";
  }

  function setFontForSite(font) {
    localStorage.setItem(getStorageKey(FONT_SUFFIX), font);
  }

  // Apply font to the website
  function applyFont() {
    if (isEnabledForSite()) {
      const font = getFontForSite();
      GM_addStyle(`
        * {
          font-family: ${font} !important;
        }
      `);
    }
  }

  // Remove applied font styles
  function removeAppliedFont() {
    const styleId = "font-customizer-styles";
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
    applyStyles();
  }

  // Apply all necessary styles
  function applyStyles() {
    if (isEnabledForSite()) {
      const font = getFontForSite();
      const styleElement = document.createElement("style");
      styleElement.id = "font-customizer-styles";
      styleElement.textContent = `
        * {
          font-family: ${font} !important;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }

  // Menu command IDs
  let toggleCommandId = null;
  let fontCommandId = null;

  // Register menu commands
  function registerMenuCommands() {
    if (toggleCommandId !== null) {
      GM_unregisterMenuCommand(toggleCommandId);
    }
    if (fontCommandId !== null) {
      GM_unregisterMenuCommand(fontCommandId);
    }

    const enabled = isEnabledForSite();
    const toggleText = enabled
      ? "🟢 Enabled on the site"
      : "🔴 Disabled on the site";

    toggleCommandId = GM_registerMenuCommand(toggleText, function () {
      const newEnabledState = !enabled;
      setEnabledForSite(newEnabledState);

      if (newEnabledState) {
        applyStyles();
      } else {
        removeAppliedFont();
      }

      registerMenuCommands();
    });

    const currentFont = getFontForSite();
    // Truncate the font name if it's too long (more than x characters)
    const truncatedFont =
      currentFont && currentFont.length > 10
        ? currentFont.substring(0, 10) + "..."
        : currentFont || "None";

    fontCommandId = GM_registerMenuCommand(
      `✨ Select Font (Current: ${truncatedFont})`,
      showFontSelector
    );
  }

  // Create and show font selector popup
  function showFontSelector() {
    // Remove existing popup if any
    const existingPopup = document.getElementById("font-customizer-popup");
    if (existingPopup) {
      existingPopup.remove();
    }

    // Create popup container
    const popup = document.createElement("div");
    popup.id = "font-customizer-popup";

    // Add styles for the popup
    GM_addStyle(`
      #font-customizer-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--popup-bg, #ffffff);
        color: var(--popup-text, #000000);
        border: 1px solid var(--popup-border, #cccccc);
        border-radius: 12px;
        padding: 24px;
        z-index: 9999;
        min-width: 380px;
        width: 400px;
        height: fit-content;
        overflow-y: auto;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        animation: popup-fade-in 0.2s ease-out;
      }

      @keyframes popup-fade-in {
        from { opacity: 0; transform: translate(-50%, -48%); }
        to { opacity: 1; transform: translate(-50%, -50%); }
      }

      #font-customizer-popup h2 {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        color: var(--popup-title, inherit);
      }

      #font-customizer-popup .font-input-container {
        margin-bottom: 16px;
      }

      #font-customizer-popup .font-input {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--popup-border, #cccccc);
        border-radius: 8px;
        box-sizing: border-box;
        font-size: 14px;
        transition: border-color 0.2s;
        margin-bottom: 8px;
      }

      #font-customizer-popup .font-input:focus {
        border-color: var(--popup-button, #4a86e8);
        outline: none;
        box-shadow: 0 0 0 2px rgba(74, 134, 232, 0.2);
      }

      #font-customizer-popup .add-font-button {
        display: block;
        width: 100%;
        padding: 8px 16px;
        background-color: var(--popup-button, #4a86e8);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: background-color 0.2s, transform 0.1s;
      }

      #font-customizer-popup .add-font-button:hover {
        background-color: var(--popup-button-hover, #3b78e7);
      }

      #font-customizer-popup .add-font-button:active {
        transform: scale(0.98);
      }

      #font-customizer-popup .section-title {
        font-size: 16px;
        font-weight: 600;
        margin: 16px 0 8px 0;
        color: var(--popup-title, inherit);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      #font-customizer-popup .section-title .title-with-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      #font-customizer-popup .toggle-section{
        cursor: pointer;
        border: 1px solid var(--popup-border, #cccccc);
        border-radius: 8px;
        padding: 4px 8px;
        font-size: 12px;
        font-weight: 600;
        color: var(--popup-text-secondary);
      }
      #font-customizer-popup .toggle-section:hover {
        background-color: var(--popup-hover, #f5f5f5);
      }

      #font-customizer-popup .info-icon {
        cursor: help;
        color: var(--popup-text-secondary);
        font-size: 14px;
        position: relative;
      }

      #font-customizer-popup .info-tooltip {
        visibility: hidden;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: calc(100% + 8px);
        color: var(--popup-tooltip-text);
        padding: 8px 12px;
        background-color: var(--popup-tooltip-bg);
        border-radius: 6px;
        font-size: 12px;
        font-weight: normal;
        white-space: normal;
        text-wrap: wrap;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.2s, visibility 0.2s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        width: 250px;
        line-height: 1.4;
      }

      #font-customizer-popup .info-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 5px;
        border-style: solid;
        border-color: var(--popup-tooltip-bg) transparent transparent transparent;
      }

      #font-customizer-popup .info-icon:hover .info-tooltip {
        visibility: visible;
        opacity: 1;
      }

      #font-customizer-popup .no-fonts-message {
        color: var(--popup-text-secondary, #666666);
        font-style: italic;
        text-align: center;
        padding: 16px 0;
      }

      #font-customizer-popup ul {
        list-style: none;
        padding: 0;
        margin: 0 0 16px 0;
        max-height: 200px;
        overflow-y: auto;
        border-radius: 8px;
        border: 1px solid var(--popup-border, #eaeaea);
      }

      #font-customizer-popup ul:empty {
        display: none;
      }

      #font-customizer-popup ul::-webkit-scrollbar {
        width: 8px;
      }

      #font-customizer-popup ul::-webkit-scrollbar-track {
        background: var(--popup-scrollbar-track, #f1f1f1);
        border-radius: 0 8px 8px 0;
      }

      #font-customizer-popup ul::-webkit-scrollbar-thumb {
        background: var(--popup-scrollbar-thumb, #c1c1c1);
        border-radius: 4px;
      }

      #font-customizer-popup ul::-webkit-scrollbar-thumb:hover {
        background: var(--popup-scrollbar-thumb-hover, #a1a1a1);
      }

      #font-customizer-popup li {
        padding: 10px 16px;
        cursor: pointer;
        transition: all 0.15s ease;
        border-bottom: 1px solid var(--popup-border, #eaeaea);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      #font-customizer-popup li:last-child {
        border-bottom: none;
      }

      #font-customizer-popup li:hover {
        background-color: var(--popup-hover, #f5f5f5);
      }

      #font-customizer-popup li.selected {
        background-color: var(--popup-selected, #e8f0fe);
        font-weight: 500;
      }

      #font-customizer-popup li.selected .font-name::before {
        content: "✓";
        margin-right: 8px;
        color: var(--popup-check, #4a86e8);
        font-weight: bold;
      }

      #font-customizer-popup li:not(.selected) .font-name {
        padding-left: 24px;
      }

      #font-customizer-popup .font-actions {
        display: flex;
        opacity: 0;
        transition: opacity 0.2s;
      }

      #font-customizer-popup li:hover .font-actions {
        opacity: 1;
      }

      #font-customizer-popup .delete-font {
        color: var(--popup-delete, #e53935);
        cursor: pointer;
        font-size: 16px;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      #font-customizer-popup .delete-font:hover {
        background-color: var(--popup-delete-hover, rgba(229, 57, 53, 0.1));
      }

      #font-customizer-popup .close-button {
        display: block;
        width: 100%;
        margin: 16px auto 0;
        padding: 12px 16px;
        background-color: var(--popup-button-secondary, #757575);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 15px;
        transition: background-color 0.2s, transform 0.1s;
      }

      #font-customizer-popup .close-button:hover {
        background-color: var(--popup-button-secondary-hover, #616161);
      }

      #font-customizer-popup .close-button:active {
        transform: scale(0.98);
      }

      #font-customizer-popup .web-font-item {
        font-family: inherit;
      }

      #font-customizer-popup .web-font-item .font-name {
        font-family: inherit;
      }

      /* Dark mode detection and styles */
      @media (prefers-color-scheme: dark) {
        #font-customizer-popup {
          --popup-bg: #222222;
          --popup-text: #ffffff;
          --popup-text-secondary: #aaaaaa;
          --popup-title: #ffffff;
          --popup-border: #444444;
          --popup-hover: #333333;
          --popup-selected: #2c3e50;
          --popup-check: #64b5f6;
          --popup-button: #4a86e8;
          --popup-button-hover: #3b78e7;
          --popup-button-secondary: #616161;
          --popup-button-secondary-hover: #757575;
          --popup-delete: #f44336;
          --popup-delete-hover: rgba(244, 67, 54, 0.2);
          --popup-scrollbar-track: #333333;
          --popup-scrollbar-thumb: #555555;
          --popup-scrollbar-thumb-hover: #666666;
          --popup-tooltip-bg: #4a4a4a;
          --popup-tooltip-text: #ffffff;
        }
      }

      /* Light mode styles */
      @media (prefers-color-scheme: light) {
        #font-customizer-popup {
          --popup-bg: #ffffff;
          --popup-text: #333333;
          --popup-text-secondary: #666666;
          --popup-title: #222222;
          --popup-border: #eaeaea;
          --popup-hover: #f5f5f5;
          --popup-selected: #e8f0fe;
          --popup-check: #4a86e8;
          --popup-button: #4a86e8;
          --popup-button-hover: #3b78e7;
          --popup-button-secondary: #757575;
          --popup-button-secondary-hover: #616161;
          --popup-delete: #e53935;
          --popup-delete-hover: rgba(229, 57, 53, 0.1);
          --popup-scrollbar-track: #f1f1f1;
          --popup-scrollbar-thumb: #c1c1c1;
          --popup-scrollbar-thumb-hover: #a1a1a1;
          --popup-tooltip-bg: #ffffff;
          --popup-tooltip-text: #333333;
        }
      }

      /* Overlay to prevent clicking outside */
      #font-customizer-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        animation: overlay-fade-in 0.2s ease-out;
      }

      @keyframes overlay-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `);

    // Create overlay to prevent clicking outside
    const overlay = document.createElement("div");
    overlay.id = "font-customizer-overlay";
    document.body.appendChild(overlay);

    // Add click event to overlay to close popup
    overlay.addEventListener("click", closePopup);

    // Create popup content
    popup.innerHTML = `
      <h2>Font Customizer</h2>
      <div class="font-input-container">
        <input type="text" id="new-font-input" class="font-input" placeholder="Enter font name (e.g., Arial, sans-serif)">
        <button id="add-font-button" class="add-font-button">Add & Apply Font</button>
      </div>
      <div class="section-title">
        <div class="title-with-info">
          <span>Your Saved Fonts</span>
          <span class="info-icon">ℹ️
            <span class="info-tooltip">Custom fonts will only work if they are installed on your system. Use exact font names for best results.</span>
          </span>
        </div>
        <span class="toggle-section" id="toggle-saved">Hide</span>
      </div>
      <ul id="saved-fonts-list"></ul>
      <div id="no-saved-fonts" class="no-fonts-message">No saved fonts or Hiden yet. Add one above!</div>
      <div class="section-title">
        <div class="title-with-info">
          <span>Web Fonts</span>
          <span class="info-icon">ℹ️
            <span class="info-tooltip">These fonts will be loaded from Google Fonts when selected. They work on any system but require internet connection.</span>
          </span>
        </div>
        <span class="toggle-section" id="toggle-web">Show</span>
      </div>
      <ul id="web-fonts-list" style="display: none;"></ul>
      <button class="close-button" id="close-popup">Close</button>
    `;

    document.body.appendChild(popup);

    // Get current font and saved fonts
    const currentFont = getFontForSite();
    const savedFonts = getSavedFonts();

    // Populate saved fonts list
    const savedFontsList = document.getElementById("saved-fonts-list");
    const noSavedFonts = document.getElementById("no-saved-fonts");

    // Show/hide no fonts message
    if (savedFonts.length === 0) {
      noSavedFonts.style.display = "block";
    } else {
      noSavedFonts.style.display = "none";
    }

    // Add saved fonts to the list
    savedFonts.forEach((font) => {
      addFontToList(font, savedFontsList, true);
    });

    // Add web fonts to the list
    const webFontsList = document.getElementById("web-fonts-list");
    WEB_FONTS.forEach((font) => {
      addFontToList(font.name, webFontsList, false, font);
    });

    // Toggle sections
    document
      .getElementById("toggle-saved")
      .addEventListener("click", function () {
        const savedList = document.getElementById("saved-fonts-list");
        const noSaved = document.getElementById("no-saved-fonts");
        const isHidden = savedList.style.display === "none";

        savedList.style.display = isHidden ? "block" : "none";
        noSaved.style.display =
          isHidden && getSavedFonts().length === 0 ? "block" : "none";
        this.textContent = isHidden ? "Hide" : "Show";
      });

    document
      .getElementById("toggle-web")
      .addEventListener("click", function () {
        const webList = document.getElementById("web-fonts-list");
        const isHidden = webList.style.display === "none";

        webList.style.display = isHidden ? "block" : "none";
        this.textContent = isHidden ? "Hide" : "Show";
      });

    // Handle new font input
    const newFontInput = document.getElementById("new-font-input");
    const addFontButton = document.getElementById("add-font-button");

    // Focus the input field
    newFontInput.focus();

    // Add font when button is clicked
    addFontButton.addEventListener("click", addNewFont);

    // Add font when Enter is pressed
    newFontInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        addNewFont();
      }
    });

    // Function to add a font to the list
    function addFontToList(font, listElement, isSaved = false, webFont = null) {
      const li = document.createElement("li");
      if (webFont) {
        li.classList.add("web-font-item");
        li.style.fontFamily = webFont.family;
      }

      li.innerHTML = `
        <span class="font-name">${font}</span>
        ${
          isSaved
            ? `
          <div class="font-actions">
            <span class="delete-font" title="Remove font">🗑️</span>
          </div>
        `
            : ""
        }
      `;

      if (font === currentFont) {
        li.classList.add("selected");
      }

      // Select font when clicked
      li.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-font")) {
          return;
        }

        // Remove selected class from all items
        document
          .querySelectorAll("#font-customizer-popup li")
          .forEach((item) => {
            item.classList.remove("selected");
          });

        // Add selected class to clicked item
        li.classList.add("selected");

        // Set the selected font
        if (webFont) {
          setFontForSite(webFont.family);
          loadWebFont(webFont.url);
        } else {
          setFontForSite(font);
        }

        // Apply the font if enabled
        if (isEnabledForSite()) {
          removeAppliedFont();
          applyStyles();
        }

        // Update menu commands
        registerMenuCommands();
      });

      // Delete font when delete button is clicked (only for saved fonts)
      if (isSaved) {
        const deleteButton = li.querySelector(".delete-font");
        deleteButton.addEventListener("click", (e) => {
          e.stopPropagation();

          removeFontFromList(font);
          li.remove();

          if (font === currentFont) {
            const remainingFonts = getSavedFonts();
            if (remainingFonts.length > 0) {
              setFontForSite(remainingFonts[0]);
              const firstFont = document.querySelector("#saved-fonts-list li");
              if (firstFont) {
                firstFont.classList.add("selected");
              }
            } else {
              setFontForSite("");
            }

            if (isEnabledForSite()) {
              removeAppliedFont();
              applyStyles();
            }

            registerMenuCommands();
          }

          if (savedFontsList.children.length === 0) {
            noSavedFonts.style.display = "block";
          }
        });
      }

      listElement.appendChild(li);
    }

    // Function to add a new font
    function addNewFont() {
      const fontName = newFontInput.value.trim();
      if (fontName) {
        saveFontToList(fontName);
        newFontInput.value = "";
        noSavedFonts.style.display = "none";
        addFontToList(fontName, savedFontsList, true);
        setFontForSite(fontName);

        document
          .querySelectorAll("#font-customizer-popup li")
          .forEach((item) => {
            item.classList.remove("selected");
          });

        const newFontElement = Array.from(
          document.querySelectorAll("#saved-fonts-list li")
        ).find((li) => li.querySelector(".font-name").textContent === fontName);
        if (newFontElement) {
          newFontElement.classList.add("selected");
        }

        if (isEnabledForSite()) {
          removeAppliedFont();
          applyStyles();
        }

        registerMenuCommands();
      }
    }

    // Function to close the popup
    function closePopup() {
      const popup = document.getElementById("font-customizer-popup");
      const overlay = document.getElementById("font-customizer-overlay");
      if (popup) popup.remove();
      if (overlay) overlay.remove();
    }

    // Close button functionality
    document
      .getElementById("close-popup")
      .addEventListener("click", closePopup);

    // Prevent closing when clicking on the popup itself
    popup.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Allow Escape key to close the popup
    document.addEventListener("keydown", function handleEscape(e) {
      if (e.key === "Escape") {
        closePopup();
        document.removeEventListener("keydown", handleEscape);
      }
    });
  }

  // Initialize
  function init() {
    registerMenuCommands();
    applyStyles();

    const observer = new MutationObserver(function (mutations) {
      if (!isEnabledForSite()) return;

      const styleElement = document.getElementById("font-customizer-styles");
      if (!styleElement) {
        applyStyles();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  // Run the script
  init();
})();
