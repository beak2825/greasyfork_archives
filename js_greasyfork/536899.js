// ==UserScript==
// @name         Auto-Save
// @namespace    bennoghg
// @match        https://map-making.app/maps/*
// @grant        none
// @version      1.0
// @author       BennoGHG
// @license      MIT
// @description  Auto-Save Feature (changeable Polling and debounce time)
// @downloadURL https://update.greasyfork.org/scripts/536899/Auto-Save.user.js
// @updateURL https://update.greasyfork.org/scripts/536899/Auto-Save.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ═══ Configuration & State Management ═══
  const STORAGE_KEY = 'mapmaking-autosave-settings';
  const MIN_POLLING = 200, MAX_POLLING = 10000;
  const MIN_DEBOUNCE = 200, MAX_DEBOUNCE = 30000;

  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const settings = JSON.parse(saved);
        return {
          pollingInterval: Math.max(MIN_POLLING, Math.min(MAX_POLLING, settings.pollingInterval || 1000)),
          debounceMs: Math.max(MIN_DEBOUNCE, Math.min(MAX_DEBOUNCE, settings.debounceMs || 3000)),
          autosaveEnabled: settings.autosaveEnabled !== false
        };
      }
    } catch (error) {
      console.warn('[AutoSave] Failed to load settings:', error);
    }
    return { pollingInterval: 1000, debounceMs: 3000, autosaveEnabled: true };
  }

  function saveSettings() {
    try {
      const settings = { pollingInterval, debounceMs, autosaveEnabled };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('[AutoSave] Failed to save settings:', error);
    }
  }

  const initialSettings = loadSettings();
  let pollingInterval = initialSettings.pollingInterval;
  let debounceMs = initialSettings.debounceMs;
  let autosaveEnabled = initialSettings.autosaveEnabled;
  let lastCount = null;
  let saveTimer = null;
  let pollTimer = null;

  function findSaveButton() {
    return Array.from(document.querySelectorAll('button'))
      .find(btn => btn.textContent.trim() === 'Save');
  }

  function findCountsElement() {
    return document.querySelector('span.map-meta__count');
  }

  function triggerSave() {
    const saveBtn = findSaveButton();
    if (saveBtn && !saveBtn.disabled) {
      saveBtn.click();
      console.log('[AutoSave] Save triggered');
    }
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (autosaveEnabled) triggerSave();
    }, debounceMs);
  }

  // Main polling function - checks for changes
  function checkForChanges() {
    if (!autosaveEnabled) return;

    const countsElement = findCountsElement();
    if (!countsElement) {
      lastCount = null;
      return;
    }

    const currentCount = countsElement.textContent.trim();
    if (lastCount === null || currentCount !== lastCount) {
      lastCount = currentCount;
      scheduleSave();
    }
  }

  // Start the polling loop
  function startPolling() {
    clearInterval(pollTimer);
    pollTimer = setInterval(checkForChanges, pollingInterval);
  }

  // ═══ UI Creation and Management ═══
  function createUI() {
    if (document.querySelector('.autosave-ui')) return; // Already exists

    const saveBtn = findSaveButton();
    if (!saveBtn) return; // Save button not ready yet

    const toolbar = saveBtn.parentElement;
    toolbar.style.display = 'flex';
    toolbar.style.alignItems = 'center';

    const ui = document.createElement('div');
    ui.className = 'autosave-ui';
    ui.innerHTML = `
      <div class="autosave-toggle">
        <input type="checkbox" id="autosave-checkbox" ${autosaveEnabled?'checked':''}/>
        <label for="autosave-checkbox" class="toggle-switch">
          <span class="toggle-slider"></span>
        </label>
        <span class="toggle-label">Auto Save</span>
      </div>
      <button class="settings-btn" type="button">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1m15.5-6.5L19 4.5m-14 14 2.5-2.5m0-11L4.5 19.5m14-14L16.5 7.5"></path>
        </svg>
      </button>
      <div class="settings-panel">
        <div class="settings-content">
          <div class="setting-group">
            <label>Polling Interval</label>
            <div class="input-group">
              <input type="number" value="${pollingInterval}" min="${MIN_POLLING}" max="${MAX_POLLING}" step="100" class="poll-input"/>
              <span class="unit">ms</span>
            </div>
          </div>
          <div class="setting-group">
            <label>Debounce Delay</label>
            <div class="input-group">
              <input type="number" value="${debounceMs}" min="${MIN_DEBOUNCE}" max="${MAX_DEBOUNCE}" step="100" class="debounce-input"/>
              <span class="unit">ms</span>
            </div>
          </div>
        </div>
      </div>
    `;
    toolbar.insertBefore(ui, saveBtn);

    // Only inject styles once
    if (!document.getElementById('autosave-ui-styles')) {
      injectStyles();
    }

    setupEventHandlers(ui);
  }

  // Inject CSS styles for the UI
  function injectStyles() {
    const style = document.createElement('style');
    style.id = 'autosave-ui-styles';
    style.textContent = `
        .autosave-ui {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0 4px;
          padding: 4px 8px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          user-select: none;
        }

        .autosave-toggle {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .autosave-toggle input[type="checkbox"] {
          display: none;
        }

        .toggle-switch {
          position: relative;
          width: 28px;
          height: 14px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toggle-slider {
          position: absolute;
          top: 1px;
          left: 1px;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .autosave-toggle input:checked + .toggle-switch {
          background: #10b981;
        }

        .autosave-toggle input:checked + .toggle-switch .toggle-slider {
          transform: translateX(14px);
        }

        .toggle-label {
          color: rgba(255, 255, 255, 0.9);
          font-size: 12px;
          font-weight: 500;
        }

        .settings-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .settings-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.9);
          transform: translateY(-1px);
        }

        .settings-panel {
          position: absolute;
          bottom: calc(100% + 8px);
          right: 0;
          width: 240px;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px) scale(0.95);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          z-index: 1000;
        }

        .autosave-ui.open .settings-panel {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .settings-content {
          padding: 16px;
        }

        .setting-group {
          margin-bottom: 20px;
        }

        .setting-group:last-child {
          margin-bottom: 0;
        }

        .setting-group label {
          display: block;
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-group {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 0 12px;
          transition: all 0.2s ease;
        }

        .input-group:focus-within {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .input-group input {
          flex: 1;
          background: none;
          border: none;
          color: white;
          font-size: 14px;
          font-weight: 500;
          padding: 12px 0;
          outline: none;
        }

        .input-group input::-webkit-outer-spin-button,
        .input-group input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .input-group input[type=number] {
          -moz-appearance: textfield;
        }

        .unit {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
          font-weight: 500;
          margin-left: 8px;
        }

        /* Click outside to close */
        .settings-panel::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
        }
      `;
    document.head.appendChild(style);
  }

  // Set up all event handlers for the UI
  function setupEventHandlers(ui) {
    const checkbox = ui.querySelector('#autosave-checkbox');
    const settingsBtn = ui.querySelector('.settings-btn');
    const panel = ui.querySelector('.settings-panel');
    const pollInput = ui.querySelector('.poll-input');
    const debounceInput = ui.querySelector('.debounce-input');

    // Toggle auto-save on/off
    checkbox.addEventListener('change', () => {
      autosaveEnabled = checkbox.checked;
      saveSettings();
    });

    // Show/hide settings panel
    settingsBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      ui.classList.toggle('open');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (event) => {
      if (!ui.contains(event.target)) {
        ui.classList.remove('open');
      }
    });

    // Update polling interval
    pollInput.addEventListener('input', () => {
      const value = parseInt(pollInput.value, 10);
      if (value >= MIN_POLLING && value <= MAX_POLLING) {
        pollingInterval = value;
        startPolling();
        saveSettings();
      }
    });

    // Update debounce delay
    debounceInput.addEventListener('input', () => {
      const value = parseInt(debounceInput.value, 10);
      if (value >= MIN_DEBOUNCE && value <= MAX_DEBOUNCE) {
        debounceMs = value;
        saveSettings();
      }
    });
  }

  // ═══ Initialization ═══
  function initialize() {
    // Try to inject UI every 500ms until toolbar is ready
    const uiInjectionInterval = setInterval(() => {
      createUI();
      // Stop trying after UI is successfully created
      if (document.querySelector('.autosave-ui')) {
        clearInterval(uiInjectionInterval);
      }
    }, 500);

    // Start polling for changes
    startPolling();

    console.log('[AutoSave] v2.1 initialized - Waiting for toolbar...');
  }
  // Start the script
  initialize();

})();