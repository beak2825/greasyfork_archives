// ==UserScript==
// @name         Text Explainer Settings
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  Settings module for Text Explainer
// @author       RoCry
// @license      MIT
// ==/UserScript==

class TextExplainerSettings {
  constructor(defaultConfig = {}) {
    this.defaultConfig = Object.assign({
      model: "openai-large",
      apiKey: "fake",
      baseUrl: "https://text.pollinations.ai/openai#",
      provider: "openai",
      language: "Chinese",
      shortcut: {
        key: "d",
        ctrlKey: false,
        altKey: true,
        shiftKey: false,
        metaKey: false
      },
      floatingButton: {
        enabled: true,
        size: "medium", // small, medium, large
      }
    }, defaultConfig);

    this.config = this.load();
  }

  /**
   * Load settings from storage
   */
  load() {
    try {
      const savedConfig = typeof GM_getValue === 'function'
        ? GM_getValue('explainerConfig', {})
        : JSON.parse(localStorage.getItem('explainerConfig') || '{}');
      return Object.assign({}, this.defaultConfig, savedConfig);
    } catch (e) {
      console.error('Error loading settings:', e);
      return Object.assign({}, this.defaultConfig);
    }
  }

  /**
   * Save settings to storage
   */
  save() {
    try {
      if (typeof GM_setValue === 'function') {
        GM_setValue('explainerConfig', this.config);
      } else {
        localStorage.setItem('explainerConfig', JSON.stringify(this.config));
      }
      return true;
    } catch (e) {
      console.error('Error saving settings:', e);
      return false;
    }
  }

  /**
   * Get setting value
   */
  get(key) {
    return this.config[key];
  }

  /**
   * Set setting value
   */
  set(key, value) {
    this.config[key] = value;
    return this;
  }

  /**
   * Update multiple settings at once
   */
  update(settings) {
    Object.assign(this.config, settings);
    return this;
  }

  /**
   * Reset settings to defaults
   */
  reset() {
    this.config = Object.assign({}, this.defaultConfig);
    return this;
  }

  /**
   * Get all settings
   */
  getAll() {
    return Object.assign({}, this.config);
  }

  /**
   * Open settings dialog
   */
  openDialog(onSave = null) {
    // First check if dialog already exists and remove it
    const existingDialog = document.getElementById('explainer-settings-dialog');
    if (existingDialog) existingDialog.remove();

    // Create dialog container
    const dialog = document.createElement('div');
    dialog.id = 'explainer-settings-dialog';
    dialog.style = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 12px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 10001;
      width: 400px;
      max-width: 90vw;
      max-height: 80vh;
      overflow-y: auto;
      font-family: system-ui, sans-serif;
      font-size: 14px;
    `;

    // Add dark mode support
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      #explainer-settings-dialog {
        color: #333;
      }
      #explainer-settings-dialog h3 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 16px;
      }
      #explainer-settings-dialog .row {
        display: flex;
        gap: 10px;
        margin-bottom: 8px;
      }
      #explainer-settings-dialog .col {
        flex: 1;
      }
      #explainer-settings-dialog label {
        display: block;
        margin: 4px 0 2px;
        font-weight: 500;
        font-size: 12px;
      }
      #explainer-settings-dialog input[type="text"],
      #explainer-settings-dialog select {
        width: 100%;
        padding: 4px 6px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 13px;
      }
      /* Fix for shortcut key width */
      #explainer-settings-dialog input#explainer-shortcut-key {
        width: 30px !important;
        min-width: 30px;
        max-width: 30px;
        text-align: center;
        padding: 4px 0;
      }
      #explainer-settings-dialog .buttons {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 12px;
      }
      #explainer-settings-dialog button {
        padding: 6px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
      }
      #explainer-settings-dialog button.primary {
        background-color: #4285f4;
        color: white;
      }
      #explainer-settings-dialog button.secondary {
        background-color: #f1f1f1;
        color: #333;
      }
      #explainer-settings-dialog .shortcut-section {
        display: flex;
        align-items: flex-end;
        gap: 15px;
        margin-bottom: 4px;
      }
      #explainer-settings-dialog .key-container {
        display: flex;
        flex-direction: column;
      }
      #explainer-settings-dialog .modifier-group {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 28px; /* Match the height of the input field */
      }
      #explainer-settings-dialog .modifier {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 2px;
      }
      #explainer-settings-dialog .modifier input[type="checkbox"] {
        margin: 0 0 2px;
      }
      #explainer-settings-dialog .modifier label {
        font-size: 11px;
        margin: 0;
        user-select: none;
      }
      #explainer-settings-dialog .section-title {
        font-weight: 600;
        margin-top: 12px;
        margin-bottom: 6px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 2px;
        font-size: 13px;
      }
      #explainer-settings-dialog .checkbox-label {
        display: flex;
        align-items: center;
        margin: 4px 0;
      }
      #explainer-settings-dialog .checkbox-label input {
        margin-right: 6px;
      }
      @media (prefers-color-scheme: dark) {
        #explainer-settings-dialog {
          background: #333;
          color: #eee;
        }
        #explainer-settings-dialog input[type="text"],
        #explainer-settings-dialog select {
          background: #444;
          color: #eee;
          border-color: #555;
        }
        #explainer-settings-dialog button.secondary {
          background-color: #555;
          color: #eee;
        }
        #explainer-settings-dialog .section-title {
          border-bottom-color: #555;
        }
      }
    `;
    document.head.appendChild(styleElement);

    // Prepare shortcut configuration
    const shortcut = this.config.shortcut || this.defaultConfig.shortcut;
    const floatingButton = this.config.floatingButton || this.defaultConfig.floatingButton;

    // Create dialog content with a more compact layout
    dialog.innerHTML = `
      <h3>Text Explainer Settings</h3>
      
      <div class="section-title">Language & API Settings</div>
      
      <div class="row">
        <div class="col">
          <label for="explainer-language">Language</label>
          <select id="explainer-language">
            <option value="Chinese" ${this.config.language === 'Chinese' ? 'selected' : ''}>Chinese</option>
            <option value="English" ${this.config.language === 'English' ? 'selected' : ''}>English</option>
            <option value="Japanese" ${this.config.language === 'Japanese' ? 'selected' : ''}>Japanese</option>
          </select>
        </div>
        <div class="col">
          <label for="explainer-provider">Provider</label>
          <select id="explainer-provider">
            <option value="gemini" ${this.config.provider === 'gemini' ? 'selected' : ''}>Gemini</option>
            <option value="openai" ${this.config.provider === 'openai' ? 'selected' : ''}>OpenAI</option>
            <option value="anthropic" ${this.config.provider === 'anthropic' ? 'selected' : ''}>Anthropic</option>
          </select>
        </div>
        <div class="col">
          <label for="explainer-model">Model</label>
          <input id="explainer-model" type="text" value="${this.config.model}">
        </div>
      </div>

      <div class="row">
        <div class="col">
          <label for="explainer-api-key">API Key</label>
          <input id="explainer-api-key" type="text" value="${this.config.apiKey || ''}">
          <p style="font-size: 11px; color: #666; margin-top: 0; margin-bottom: 8px;">
            Multiple keys supported, separated by commas
          </p>
        </div>
      </div>
      
      <div>
        <label for="explainer-base-url">API Base URL</label>
        <input id="explainer-base-url" type="text" value="${this.config.baseUrl}">
        <p style="font-size: 11px; color: #666; margin-top: 0; margin-bottom: 8px;">
          Ending with / ignores v1, ending with # forces use of input address
        </p>
      </div>
      
      <div class="section-title">Shortcut Settings</div>
      <div class="shortcut-section">
        <div class="key-container">
          <label for="explainer-shortcut-key">Key</label>
          <input id="explainer-shortcut-key" type="text" maxlength="1" value="${shortcut.key}">
        </div>
        
        <div class="modifier-group">
          <div class="modifier">
            <label for="explainer-shortcut-ctrl">⌃</label>
            <input type="checkbox" id="explainer-shortcut-ctrl" ${shortcut.ctrlKey ? 'checked' : ''}>
          </div>
          <div class="modifier">
            <label for="explainer-shortcut-alt">⌥</label>
            <input type="checkbox" id="explainer-shortcut-alt" ${shortcut.altKey ? 'checked' : ''}>
          </div>
          <div class="modifier">
            <label for="explainer-shortcut-shift">⇧</label>
            <input type="checkbox" id="explainer-shortcut-shift" ${shortcut.shiftKey ? 'checked' : ''}>
          </div>
          <div class="modifier">
            <label for="explainer-shortcut-meta">⌘</label>
            <input type="checkbox" id="explainer-shortcut-meta" ${shortcut.metaKey ? 'checked' : ''}>
          </div>
        </div>
      </div>
      <p style="font-size: 11px; color: #666; margin-top: 0; margin-bottom: 8px;">
        Tip: Choose a letter key (a-z) with at least one modifier key.
      </p>
      
      <div class="section-title">Touch Device Settings</div>
      <div class="row">
        <div class="col">
          <div class="checkbox-label">
            <input type="checkbox" id="explainer-floating-enabled" ${floatingButton.enabled ? 'checked' : ''}>
            <span>Show floating button</span>
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col">
          <label for="explainer-floating-size">Button Size</label>
          <select id="explainer-floating-size">
            <option value="small" ${floatingButton.size === 'small' ? 'selected' : ''}>Small</option>
            <option value="medium" ${floatingButton.size === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="large" ${floatingButton.size === 'large' ? 'selected' : ''}>Large</option>
          </select>
        </div>
      </div>
      
      <div class="buttons">
        <button id="explainer-settings-cancel" class="secondary">Cancel</button>
        <button id="explainer-settings-save" class="primary">Save</button>
      </div>
    `;

    document.body.appendChild(dialog);

    // Add event listeners
    document.getElementById('explainer-settings-save').addEventListener('click', () => {
      // Get shortcut settings
      const shortcutSettings = {
        key: document.getElementById('explainer-shortcut-key').value.toLowerCase(),
        ctrlKey: document.getElementById('explainer-shortcut-ctrl').checked,
        altKey: document.getElementById('explainer-shortcut-alt').checked,
        shiftKey: document.getElementById('explainer-shortcut-shift').checked,
        metaKey: document.getElementById('explainer-shortcut-meta').checked
      };

      // Get floating button settings
      const floatingButtonSettings = {
        enabled: document.getElementById('explainer-floating-enabled').checked,
        size: document.getElementById('explainer-floating-size').value,
      };

      // Update config with all form values
      this.update({
        language: document.getElementById('explainer-language').value,
        model: document.getElementById('explainer-model').value,
        apiKey: document.getElementById('explainer-api-key').value,
        baseUrl: document.getElementById('explainer-base-url').value,
        provider: document.getElementById('explainer-provider').value,
        shortcut: shortcutSettings,
        floatingButton: floatingButtonSettings
      });

      // Save to storage
      this.save();

      // Remove dialog
      dialog.remove();
      styleElement.remove();

      // Call save callback if provided
      if (typeof onSave === 'function') {
        onSave(this.config);
      }
    });

    document.getElementById('explainer-settings-cancel').addEventListener('click', () => {
      dialog.remove();
      styleElement.remove();
    });

    // Focus first field
    document.getElementById('explainer-language').focus();

    // Add validation for the shortcut key
    const keyInput = document.getElementById('explainer-shortcut-key');
    keyInput.addEventListener('input', () => {
      // Ensure it's a single character and convert to lowercase
      if (keyInput.value.length > 0) {
        keyInput.value = keyInput.value.charAt(0).toLowerCase();
      }
    });
  }
}

// Make available globally and as a module if needed
window.TextExplainerSettings = TextExplainerSettings;

if (typeof module !== 'undefined') {
  module.exports = TextExplainerSettings;
}
