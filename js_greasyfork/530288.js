// ==UserScript==
// @name         Torn.com Background Theme Editor
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Change Torn's background with predefined themes and custom colors
// @author       TR0LL [2561502]
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/530288/Torncom%20Background%20Theme%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/530288/Torncom%20Background%20Theme%20Editor.meta.js
// ==/UserScript==

(function() {
  "use strict";

  const CONFIG = {
    defaultBgColor: "#191919",
    darkModeBgColor: "#242424",
    selectorContentContainer: ".content.responsive-sidebar-container.logged-in",
    themes: {
      pureBlack: { name: "Pure Black", color: "#000000" },
      midnightBlue: { name: "Midnight Blue", color: "#1a2a42" },
      princess: { name: "Princess", color: "#c80e71" },
      custom: { name: "Custom", color: null }
    }
  };

  const state = {
    bgColor: GM_getValue("bgColor", "#191919"),
    currentTheme: GM_getValue("currentTheme", null),
    isObserving: false,
    isPanelVisible: false
  };

  const domCache = { contentContainer: null, bodyElement: null };

  function getContentContainer() {
    return domCache.contentContainer || (domCache.contentContainer = document.querySelector(CONFIG.selectorContentContainer));
  }

  function getBodyElement() {
    return domCache.bodyElement || (domCache.bodyElement = document.getElementById('body') || document.body);
  }

  function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }

  function isDarkModeActive() {
    const bodyElement = getBodyElement();
    return bodyElement && bodyElement.classList.contains('dark-mode');
  }

  function getAutoDetectedColor() {
    return isDarkModeActive() ? CONFIG.darkModeBgColor : CONFIG.defaultBgColor;
  }

  function applyBackgroundColor(color) {
    const contentContainer = getContentContainer();
    if (contentContainer) {
      contentContainer.style.backgroundColor = color;
      return true;
    }
    return false;
  }

  function saveBackgroundColor(color, themeName = null) {
    if (!/^#[0-9A-F]{6}$/i.test(color)) return false;
    state.bgColor = color;
    GM_setValue("bgColor", color);
    if (themeName !== undefined) {
      state.currentTheme = themeName;
      GM_setValue("currentTheme", themeName);
    }
    return applyBackgroundColor(color);
  }

  function getCurrentThemeColor() {
    if (state.currentTheme === "custom") {
      return state.bgColor;
    } else if (state.currentTheme && CONFIG.themes[state.currentTheme]) {
      return CONFIG.themes[state.currentTheme].color;
    } else {
      return getAutoDetectedColor();
    }
  }

  const observer = new MutationObserver((mutations) => {
    const shouldReapply = mutations.some(mutation =>
      (mutation.type === 'childList' && mutation.addedNodes.length > 0) ||
      (mutation.type === 'attributes' &&
       (mutation.attributeName === 'style' ||
        mutation.attributeName === 'class'))
    );

    if (shouldReapply && state.currentTheme) {
      applyBackgroundColor(getCurrentThemeColor());
    }
  });

  function startObserving() {
    if (state.isObserving) return;

    const contentContainer = getContentContainer();
    if (contentContainer) {
      observer.observe(contentContainer, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: true,
        subtree: false
      });

      const bodyElement = getBodyElement();
      if (bodyElement) {
        observer.observe(bodyElement, {
          attributes: true,
          attributeFilter: ['class'],
          subtree: false
        });
      }

      state.isObserving = true;
    }
  }

  function createUI() {
    addStyles();

    const toggleButton = document.createElement("div");
    toggleButton.className = "bg-theme-toggle";
    toggleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    document.body.appendChild(toggleButton);

    const panel = document.createElement("div");
    panel.id = "bg-theme-panel";
    panel.className = "bg-theme-panel";

    let panelHTML = `
      <div class="bg-theme-header">
        <span>Background Theme</span>
        <span class="bg-theme-close">×</span>
      </div>
      <div class="bg-theme-content">
        <div class="bg-theme-group">
          <label for="bg-theme-select">Theme:</label>
          <select id="bg-theme-select" class="bg-theme-select">`;

    Object.keys(CONFIG.themes).forEach(themeKey => {
      const selected = themeKey === state.currentTheme ? 'selected' : '';
      panelHTML += `<option value="${themeKey}" ${selected}>${CONFIG.themes[themeKey].name}</option>`;
    });

    panelHTML += `
          </select>
        </div>

        <div id="custom-color-group" class="bg-theme-group" style="display: ${state.currentTheme === 'custom' ? 'block' : 'none'}">
          <label for="bg-theme-color">Custom Color:</label>
          <div class="bg-theme-color-preview" id="color-preview"></div>
          <div class="bg-theme-color-inputs">
            <input type="color" id="bg-theme-color-picker" value="${state.bgColor}">
            <input type="text" id="bg-theme-hex" value="${state.bgColor}" placeholder="#RRGGBB">
          </div>
        </div>

        <div class="bg-theme-buttons">
          <button id="bg-theme-reset" class="bg-theme-button">Reset to Default</button>
          <button id="bg-theme-save" class="bg-theme-button bg-theme-save">Save</button>
        </div>

        <div id="bg-theme-save-indicator" class="bg-theme-save-indicator">Saved!</div>
        <div class="bg-theme-credit">TR0LL [2561502]</div>
      </div>
    `;

    panel.innerHTML = panelHTML;
    document.body.appendChild(panel);

    const themeSelect = document.getElementById('bg-theme-select');
    const colorGroup = document.getElementById('custom-color-group');
    const colorPreview = document.getElementById('color-preview');
    const colorPicker = document.getElementById('bg-theme-color-picker');
    const hexInput = document.getElementById('bg-theme-hex');
    const resetButton = document.getElementById('bg-theme-reset');
    const saveButton = document.getElementById('bg-theme-save');
    const saveIndicator = document.getElementById('bg-theme-save-indicator');

    colorPreview.style.backgroundColor = state.bgColor;

    toggleButton.addEventListener('click', () => {
      state.isPanelVisible = !state.isPanelVisible;
      panel.classList.toggle('visible', state.isPanelVisible);
    });

    panel.querySelector('.bg-theme-close').addEventListener('click', () => {
      state.isPanelVisible = false;
      panel.classList.remove('visible');
    });

    themeSelect.addEventListener('change', function() {
      const selectedTheme = this.value;
      state.currentTheme = selectedTheme;
      colorGroup.style.display = selectedTheme === 'custom' ? 'block' : 'none';

      if (selectedTheme === 'custom') {
        colorPicker.value = state.bgColor;
        hexInput.value = state.bgColor;
        colorPreview.style.backgroundColor = state.bgColor;
        applyBackgroundColor(state.bgColor);
      } else if (selectedTheme && CONFIG.themes[selectedTheme]) {
        const themeColor = CONFIG.themes[selectedTheme].color;
        colorPicker.value = themeColor;
        hexInput.value = themeColor;
        colorPreview.style.backgroundColor = themeColor;
        applyBackgroundColor(themeColor);
      }
    });

    const throttledColorApply = throttle((newColor) => {
      state.bgColor = newColor;
      hexInput.value = newColor;
      colorPreview.style.backgroundColor = newColor;
      applyBackgroundColor(newColor);
    }, 50);

    colorPicker.addEventListener('input', function() {
      throttledColorApply(this.value);
    });

    colorPicker.addEventListener('change', function() {
      const newColor = this.value;
      state.bgColor = newColor;
      hexInput.value = newColor;
      colorPreview.style.backgroundColor = newColor;
      applyBackgroundColor(newColor);
    });

    hexInput.addEventListener('input', function() {
      let value = this.value;
      if (!value.startsWith('#') && value.length > 0) {
        value = '#' + value;
        this.value = value;
      }
      if (/^#[0-9A-Fa-f]{6}$/i.test(value)) {
        colorPicker.value = value;
        colorPreview.style.backgroundColor = value;
        state.bgColor = value;
        applyBackgroundColor(value);
      }
    });

    resetButton.addEventListener('click', () => {
      applyBackgroundColor('');
      state.currentTheme = null;
      GM_setValue("currentTheme", null);

      const themeSelect = document.getElementById('bg-theme-select');
      if (themeSelect) {
        themeSelect.selectedIndex = -1;
      }

      const colorGroup = document.getElementById('custom-color-group');
      if (colorGroup) {
        colorGroup.style.display = 'none';
      }

      const saveIndicator = document.getElementById('bg-theme-save-indicator');
      if (saveIndicator) {
        saveIndicator.textContent = "Reset! Using default background.";
        saveIndicator.classList.add('visible');
        setTimeout(() => {
          saveIndicator.textContent = "Saved!";
          saveIndicator.classList.remove('visible');
        }, 2000);
      }
    });

    saveButton.addEventListener('click', () => {
      if (state.currentTheme === 'custom') {
        saveBackgroundColor(colorPicker.value, 'custom');
      } else if (state.currentTheme && CONFIG.themes[state.currentTheme]) {
        saveBackgroundColor(CONFIG.themes[state.currentTheme].color, state.currentTheme);
      }

      saveIndicator.classList.add('visible');
      setTimeout(() => {
        saveIndicator.classList.remove('visible');
      }, 2000);

      state.isPanelVisible = false;
      panel.classList.remove('visible');
    });

    return panel;
  }

  function addStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `.bg-theme-toggle{position:fixed;right:10px;top:100px;width:32px;height:32px;background-color:#333;border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:9998;box-shadow:0 2px 5px rgba(0,0,0,.3);transition:transform .2s}.bg-theme-toggle:hover{transform:scale(1.1)}.bg-theme-panel{position:fixed;right:-250px;top:100px;width:220px;background-color:#222;border-radius:5px;z-index:9999;box-shadow:0 4px 10px rgba(0,0,0,.3);color:#eee;font-family:Arial,sans-serif;font-size:13px;transition:right .3s ease}.bg-theme-panel.visible{right:10px}.bg-theme-header{display:flex;justify-content:space-between;align-items:center;padding:10px 15px;border-bottom:1px solid #444;font-weight:700}.bg-theme-close{cursor:pointer;font-size:20px;width:20px;height:20px;line-height:20px;text-align:center}.bg-theme-close:hover{color:#f44}.bg-theme-content{padding:15px}.bg-theme-group{margin-bottom:15px}.bg-theme-group label{display:block;margin-bottom:5px;font-weight:700;color:#ccc}.bg-theme-select{width:100%;padding:7px;background-color:#333;border:1px solid #444;color:#eee;border-radius:3px}.bg-theme-color-preview{height:25px;width:100%;margin-bottom:8px;border:1px solid #444;border-radius:3px}.bg-theme-color-inputs{display:flex;gap:8px}#bg-theme-color-picker{width:40px;height:30px;padding:0;border:1px solid #444;cursor:pointer}#bg-theme-hex{flex:1;padding:6px 8px;background-color:#333;border:1px solid #444;color:#eee;border-radius:3px;font-family:monospace}.bg-theme-buttons{display:flex;gap:10px;margin-top:15px}.bg-theme-button{flex:1;padding:8px 0;background-color:#444;border:none;border-radius:3px;color:#eee;font-weight:700;cursor:pointer;transition:background-color .2s}.bg-theme-button:hover{background-color:#555}.bg-theme-save{background-color:#4caf50}.bg-theme-save:hover{background-color:#3e8e41}.bg-theme-save-indicator{text-align:center;margin-top:10px;color:#4caf50;opacity:0;transition:opacity .3s;font-weight:700}.bg-theme-save-indicator.visible{opacity:1}.bg-theme-credit{margin-top:10px;text-align:center;font-size:11px;color:#777}@media (max-width:768px){.bg-theme-toggle{width:28px;height:28px;right:5px;top:70px}.bg-theme-panel{width:190px}.bg-theme-panel.visible{right:5px}}`;
    document.head.appendChild(styleElement);
  }

  function init() {
    if (state.currentTheme) {
      const currentColor = getCurrentThemeColor();

      if (!applyBackgroundColor(currentColor)) {
        window.addEventListener("DOMContentLoaded", () => {
          applyBackgroundColor(getCurrentThemeColor());
          startObserving();
        });
      } else {
        startObserving();
      }
    } else {
      startObserving();
    }

    const currentUrl = window.location.href;
    if (currentUrl.includes("/preferences.php") || currentUrl.includes("/profiles.php?XID=")) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createUI);
      } else {
        createUI();
      }
    }
  }

  init();
})();