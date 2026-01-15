// ==UserScript==
// @name         Text Explainer Settings
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Settings module for Text Explainer
// @author       RoCry
// @license      MIT
// ==/UserScript==

class TextExplainerSettings {
  constructor(defaultConfig = {}) {
    this.storageKey = 'explainerConfig';
    this.storage = this.createStorage();

    this.defaultConfig = this.normalizeConfig({
      model: 'openai-large',
      apiKey: 'fake',
      baseUrl: 'https://text.pollinations.ai/openai#',
      provider: 'openai',
      language: 'Chinese',
      shortcut: {
        key: 'd',
        ctrlKey: false,
        altKey: true,
        shiftKey: false,
        metaKey: false
      },
      floatingButton: {
        enabled: true,
        size: 'medium'
      },
      ...defaultConfig
    });

    this.config = this.load();
  }

  createStorage() {
    if (typeof GM_getValue === 'function' && typeof GM_setValue === 'function') {
      return {
        get: (key, fallback) => GM_getValue(key, fallback),
        set: (key, value) => GM_setValue(key, value)
      };
    }

    if (typeof localStorage !== 'undefined') {
      return {
        get: (key, fallback) => {
          const raw = localStorage.getItem(key);
          if (raw === null) return fallback;
          try {
            return JSON.parse(raw);
          } catch (error) {
            throw new Error(`Invalid JSON in localStorage for ${key}`);
          }
        },
        set: (key, value) => {
          localStorage.setItem(key, JSON.stringify(value));
        }
      };
    }

    throw new Error('No storage available for TextExplainerSettings');
  }

  normalizeConfig(config) {
    const shortcut = { ...this.defaultConfig?.shortcut, ...(config.shortcut || {}) };
    const floatingButton = { ...this.defaultConfig?.floatingButton, ...(config.floatingButton || {}) };

    return {
      ...config,
      shortcut,
      floatingButton
    };
  }

  load() {
    const savedConfig = this.storage.get(this.storageKey, null);
    if (savedConfig === null) {
      return this.defaultConfig;
    }

    if (!savedConfig || typeof savedConfig !== 'object') {
      throw new Error('Invalid settings data in storage');
    }

    return this.normalizeConfig({
      ...this.defaultConfig,
      ...savedConfig
    });
  }

  save() {
    this.storage.set(this.storageKey, this.config);
  }

  get(key) {
    return this.config[key];
  }

  set(key, value) {
    this.config[key] = value;
    return this;
  }

  update(settings) {
    this.config = this.normalizeConfig({
      ...this.config,
      ...settings
    });
    return this;
  }

  reset() {
    this.config = { ...this.defaultConfig };
    return this;
  }

  getAll() {
    if (typeof structuredClone === 'function') {
      return structuredClone(this.config);
    }
    return JSON.parse(JSON.stringify(this.config));
  }

  openDialog(onSave = null) {
    const existingDialog = document.getElementById('explainer-settings-dialog');
    if (existingDialog) existingDialog.remove();

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
        height: 28px;
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

    const shortcut = this.config.shortcut || this.defaultConfig.shortcut;
    const floatingButton = this.config.floatingButton || this.defaultConfig.floatingButton;

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

    const byId = (id) => document.getElementById(id);

    byId('explainer-settings-save').addEventListener('click', () => {
      const shortcutSettings = {
        key: byId('explainer-shortcut-key').value.toLowerCase(),
        ctrlKey: byId('explainer-shortcut-ctrl').checked,
        altKey: byId('explainer-shortcut-alt').checked,
        shiftKey: byId('explainer-shortcut-shift').checked,
        metaKey: byId('explainer-shortcut-meta').checked
      };

      const floatingButtonSettings = {
        enabled: byId('explainer-floating-enabled').checked,
        size: byId('explainer-floating-size').value
      };

      this.update({
        language: byId('explainer-language').value,
        model: byId('explainer-model').value,
        apiKey: byId('explainer-api-key').value,
        baseUrl: byId('explainer-base-url').value,
        provider: byId('explainer-provider').value,
        shortcut: shortcutSettings,
        floatingButton: floatingButtonSettings
      });

      this.save();
      dialog.remove();
      styleElement.remove();

      if (typeof onSave === 'function') {
        onSave(this.config);
      }
    });

    byId('explainer-settings-cancel').addEventListener('click', () => {
      dialog.remove();
      styleElement.remove();
    });

    const keyInput = byId('explainer-shortcut-key');
    keyInput.addEventListener('input', () => {
      if (keyInput.value.length > 0) {
        keyInput.value = keyInput.value.charAt(0).toLowerCase();
      }
    });

    byId('explainer-language').focus();
  }
}

window.TextExplainerSettings = TextExplainerSettings;

if (typeof module !== 'undefined') {
  module.exports = TextExplainerSettings;
}
