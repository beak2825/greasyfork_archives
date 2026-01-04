// ==UserScript==
// @name        Avito.ma Enhanced - Dark Mode & Ad Controls
// @namespace   Violentmonkey Scripts
// @match       https://www.avito.ma/*
// @grant       none
// @version     2.4
// @license    MIT
// @description Enhanced userscript with dark mode and ad control buttons for avito.ma
// @downloadURL https://update.greasyfork.org/scripts/453112/Avitoma%20Enhanced%20-%20Dark%20Mode%20%20Ad%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/453112/Avitoma%20Enhanced%20-%20Dark%20Mode%20%20Ad%20Controls.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Initialize variables and settings
  let hiddenCount = 0;
  let totalAds = 0;
  let hideBoutiqueAds = localStorage.getItem("hideBoutiqueAds") === "true";
  let darkModeEnabled = localStorage.getItem("darkModeEnabled") === "true";
  let selectedTheme = localStorage.getItem("selectedTheme") || "Dark";

  const adGridSelector = ".sc-1nre5ec-1";
  const controlPanelId = "userscript-control-panel";

  // Define themes with all your specific elements included
  const themes = {
    'Dark': {
      name: 'Dark',
      styles: `
        /* General styles */
        body, html {
          background-color: black !important;
          color: #e0e0e0 !important;
        }
        /* Links */
        a {
          color: #bb86fc !important;
        }
        /* Headers and navigation */
        nav, header, .header, .sc-1eocodk-0, .sc-hsav2e-0 {
          background-color: #1e1e1e !important;
        }
        /* Main content */
        .content, .main-content, .sc-1nre5ec-1, .sc-1eocodk-1 {
          background-color: black !important;
        }
        /* Ad cards */
        .ad-item, .ad-card, .sc-1nre5ec-1 > div {
          background-color: black !important;
          color: #e0e0e0 !important;
        }
        /* Buttons */
        button, .button {
          background-color: black !important;
          color: #e0e0e0 !important;
        }
        /* Additional dark mode styles */
        /* Adjust images if necessary */
        img {
          filter: brightness(0.9);
        }
        /* Control Panel */
        #${controlPanelId} {
          background-color: black !important;
          color: #e0e0e0 !important;
        }
        /* Specific bottom background color */
        .sc-1dpjbly-0 {
          background-color: black !important;
        }
        /* Specific bottom recommendation background color */
        .similar-products, .similar-products *, .sc-14wc6tm-17, .sc-14wc6tm-17 * {
          background-color: black !important;
        }
      `
    },
    'Solarized Dark': {
      name: 'Solarized Dark',
      styles: `
        /* General styles */
        body, html {
          background-color: #002b36 !important;
          color: #839496 !important;
        }
        /* Links */
        a {
          color: #268bd2 !important;
        }
        /* Headers and navigation */
        nav, header, .header, .sc-1eocodk-0, .sc-hsav2e-0 {
          background-color: #073642 !important;
        }
        /* Main content */
        .content, .main-content, .sc-1nre5ec-1, .sc-1eocodk-1 {
          background-color: #002b36 !important;
        }
        /* Ad cards */
        .ad-item, .ad-card, .sc-1nre5ec-1 > div {
          background-color: #073642 !important;
          color: #839496 !important;
        }
        /* Buttons */
        button, .button {
          background-color: #586e75 !important;
          color: #eee8d5 !important;
        }
        /* Control Panel */
        #${controlPanelId} {
          background-color: #073642 !important;
          color: #839496 !important;
        }
        /* Specific bottom background color */
        .sc-1dpjbly-0 {
          background-color: #002b36 !important;
        }
        /* Specific bottom recommendation background color */
        .similar-products, .similar-products *, .sc-14wc6tm-17, .sc-14wc6tm-17 * {
          background-color: #002b36 !important;
        }
      `
    },
    'Dracula': {
      name: 'Dracula',
      styles: `
        /* General styles */
        body, html {
          background-color: #282a36 !important;
          color: #f8f8f2 !important;
        }
        /* Links */
        a {
          color: #bd93f9 !important;
        }
        /* Headers and navigation */
        nav, header, .header, .sc-1eocodk-0, .sc-hsav2e-0 {
          background-color: #44475a !important;
        }
        /* Main content */
        .content, .main-content, .sc-1nre5ec-1, .sc-1eocodk-1 {
          background-color: #282a36 !important;
        }
        /* Ad cards */
        .ad-item, .ad-card, .sc-1nre5ec-1 > div {
          background-color: #44475a !important;
          color: #f8f8f2 !important;
        }
        /* Buttons */
        button, .button {
          background-color: #6272a4 !important;
          color: #f8f8f2 !important;
        }
        /* Control Panel */
        #${controlPanelId} {
          background-color: #44475a !important;
          color: #f8f8f2 !important;
        }
        /* Specific bottom background color */
        .sc-1dpjbly-0 {
          background-color: #282a36 !important;
        }
        /* Specific bottom recommendation background color */
        .similar-products, .similar-products *, .sc-14wc6tm-17, .sc-14wc6tm-17 * {
          background-color: #282a36 !important;
        }
      `
    },
    'Nord': {
      name: 'Nord',
      styles: `
        /* General styles */
        body, html {
          background-color: #2e3440 !important;
          color: #d8dee9 !important;
        }
        /* Links */
        a {
          color: #81a1c1 !important;
        }
        /* Headers and navigation */
        nav, header, .header, .sc-1eocodk-0, .sc-hsav2e-0 {
          background-color: #3b4252 !important;
        }
        /* Main content */
        .content, .main-content, .sc-1nre5ec-1, .sc-1eocodk-1 {
          background-color: #2e3440 !important;
        }
        /* Ad cards */
        .ad-item, .ad-card, .sc-1nre5ec-1 > div {
          background-color: #3b4252 !important;
          color: #d8dee9 !important;
        }
        /* Buttons */
        button, .button {
          background-color: #4c566a !important;
          color: #d8dee9 !important;
        }
        /* Control Panel */
        #${controlPanelId} {
          background-color: #3b4252 !important;
          color: #d8dee9 !important;
        }
        /* Specific bottom background color */
        .sc-1dpjbly-0 {
          background-color: #2e3440 !important;
        }
        /* Specific bottom recommendation background color */
        .similar-products, .similar-products *, .sc-14wc6tm-17, .sc-14wc6tm-17 * {
          background-color: #2e3440 !important;
        }
      `
    }
  };

  // Function to filter ads
  function filterAds() {
    hiddenCount = 0;
    totalAds = 0;
    const adGrid = document.querySelector(adGridSelector);
    if (adGrid) {
      const ads = Array.from(adGrid.children);
      ads.forEach((ad) => {
        totalAds++;
        let hideAd = false;

        // Check for boutique ads
        if (hideBoutiqueAds) {
          if (
            ad.innerText.includes("Boutique") ||
            ad.querySelector('svg[aria-labelledby="Store2FillTitleID"]')
          ) {
            hideAd = true;
          }
        }

        // Hide or show the ad
        ad.style.display = hideAd ? "none" : "";
        if (hideAd) hiddenCount++;
      });
    }
    updateControlPanel();
  }

  // Function to update the control panel display
  function updateControlPanel() {
    let controlPanel = document.getElementById(controlPanelId);
    if (!controlPanel) {
      // Create control panel
      controlPanel = document.createElement("div");
      controlPanel.id = controlPanelId;

      // Style the control panel
      controlPanel.style.position = "fixed";
      controlPanel.style.bottom = "20px";
      controlPanel.style.right = "20px";
      controlPanel.style.backgroundColor = "";
      controlPanel.style.padding = "10px";
      controlPanel.style.borderRadius = "8px";
      controlPanel.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
      controlPanel.style.zIndex = "10000"; // Ensure it stays on top

      // Create elements
      const hiddenAdsText = document.createElement("div");
      hiddenAdsText.className = "hidden-ads-text";
      controlPanel.appendChild(hiddenAdsText);

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "button-container";
      controlPanel.appendChild(buttonContainer);

      const toggleBoutiqueAdsButton = document.createElement("button");
      toggleBoutiqueAdsButton.id = "toggleBoutiqueAds";
      toggleBoutiqueAdsButton.addEventListener("click", toggleBoutiqueAds);
      buttonContainer.appendChild(toggleBoutiqueAdsButton);

      const toggleDarkModeButton = document.createElement("button");
      toggleDarkModeButton.id = "toggleDarkMode";
      toggleDarkModeButton.addEventListener("click", toggleDarkMode);
      buttonContainer.appendChild(toggleDarkModeButton);

      // Theme selector
      const themeSelector = document.createElement("select");
      themeSelector.id = "themeSelector";

      // Populate the select with theme options
      for (const themeName in themes) {
        const option = document.createElement("option");
        option.value = themeName;
        option.textContent = themeName;
        themeSelector.appendChild(option);
      }

      themeSelector.value = selectedTheme;

      themeSelector.addEventListener("change", function () {
        selectedTheme = this.value;
        localStorage.setItem("selectedTheme", selectedTheme);
        if (darkModeEnabled) {
          applyDarkMode();
        }
      });

      controlPanel.appendChild(themeSelector);
      controlPanel.themeSelector = themeSelector;

      // Save references for updating
      controlPanel.hiddenAdsText = hiddenAdsText;
      controlPanel.toggleBoutiqueAdsButton = toggleBoutiqueAdsButton;
      controlPanel.toggleDarkModeButton = toggleDarkModeButton;

      // Inject styles for buttons
      injectStyles();

      // Append control panel to body
      document.body.appendChild(controlPanel);
    }

    // Update the text and button labels
    controlPanel.hiddenAdsText.textContent = `Total Store Ads Hidden: ${hiddenCount}`;
    controlPanel.toggleBoutiqueAdsButton.textContent = `${
      hideBoutiqueAds ? "Show" : "Hide"
    } Boutique Ads`;
    controlPanel.toggleDarkModeButton.textContent = `${
      darkModeEnabled ? "Disable" : "Enable"
    } Theme `;

    // Update theme selector visibility
    if (controlPanel.themeSelector) {
      controlPanel.themeSelector.value = selectedTheme;
      controlPanel.themeSelector.style.display = darkModeEnabled ? "block" : "none";
    }
  }

  // Toggle functions
  function toggleBoutiqueAds() {
    hideBoutiqueAds = !hideBoutiqueAds;
    localStorage.setItem("hideBoutiqueAds", hideBoutiqueAds);
    filterAds();
  }

  function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled;
    localStorage.setItem("darkModeEnabled", darkModeEnabled);
    applyDarkMode();
    updateControlPanel();
  }

  // Function to apply dark mode styles
  function applyDarkMode() {
    const themeStyleId = "theme-styles";
    let themeStyleElement = document.getElementById(themeStyleId);

    if (darkModeEnabled) {
      const theme = themes[selectedTheme];
      if (theme) {
        if (!themeStyleElement) {
          themeStyleElement = document.createElement("style");
          themeStyleElement.id = themeStyleId;
          themeStyleElement.type = "text/css";
          document.head.appendChild(themeStyleElement);
        }
        themeStyleElement.innerHTML = theme.styles;
      }
    } else {
      if (themeStyleElement) {
        themeStyleElement.parentNode.removeChild(themeStyleElement);
      }
    }
  }

  // Function to inject custom styles for buttons and UI
  function injectStyles() {
    const styleId = "userscript-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.type = "text/css";
      style.innerHTML = `
        #${controlPanelId} {
          font-size: 14px;
          font-weight: normal;
          font-family: Arial, sans-serif;
        }
        #${controlPanelId} .button-container {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        #${controlPanelId} button {
          background-color: #008CBA;
          border: none;
          color: white;
          padding: 6px 12px;
          text-align: center;
          text-decoration: none;
          font-size: 14px;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        #${controlPanelId} button:hover {
          background-color: #005f5f;
        }
        #${controlPanelId} select {
          margin-top: 10px;
          padding: 6px 12px;
          font-size: 14px;
          border-radius: 4px;
          border: 1px solid #ccc;
          cursor: pointer;
          width: 100%;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Set up a MutationObserver to monitor changes in the ad grid
  function observeAdGrid() {
    const adGrid = document.querySelector(adGridSelector);
    if (adGrid) {
      const observer = new MutationObserver(filterAds);
      observer.observe(adGrid, { childList: true, subtree: true });
    }
  }

  // Initial execution
  function init() {
    filterAds();
    applyDarkMode();
    observeAdGrid();
  }

  // Run init when the page has fully loaded
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    init();
  } else {
    window.addEventListener("DOMContentLoaded", init);
  }
})();
