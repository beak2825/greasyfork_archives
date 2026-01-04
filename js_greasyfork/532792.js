// ==UserScript==
// @name         TTK - Twitch To Kick: Multi Stream Auto Switcher 
// @namespace    http://tampermonkey.net/
// @version      4.1.0
// @description  Elegantly switches between Twitch and Kick streams with advanced management features, custom styling, and improved performance
// @author       Original: TheWhaleCow, Enhanced: Claude
// @match        https://www.twitch.tv/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532792/TTK%20-%20Twitch%20To%20Kick%3A%20Multi%20Stream%20Auto%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/532792/TTK%20-%20Twitch%20To%20Kick%3A%20Multi%20Stream%20Auto%20Switcher.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // =================== CONFIGURATION ===================
  const CONFIG = {
    storageKey: 'ttk-streamer-pairs',
    collapsedKey: 'ttk-collapsed',
    settingsVisibleKey: 'ttk-settings-visible',
    currentModeKey: 'ttk-current-mode',
    autoSwitchKey: 'ttk-auto-switch',
    checkInterval: 2000,
    initDelay: 1500,
    theme: {
      primary: '#9146FF',      // Twitch Purple
      secondary: '#00B140',    // Kick Green
      dark: '#18181B',         // Dark background
      light: '#EFEFF1',        // Light text
      border: '#3A3A3D',       // Border color
      success: '#00B140',      // Success color
      error: '#F43B47',        // Error color
      highlight: '#772CE8',    // Highlight color
    }
  };

  // =================== DATA MANAGEMENT ===================
  const Storage = {
    get: (key, defaultValue = null) => {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
      } catch (e) {
        console.error('TTK Storage error:', e);
        return defaultValue;
      }
    },

    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error('TTK Storage error:', e);
        return false;
      }
    },

    getPairs: () => Storage.get(CONFIG.storageKey, []),
    savePairs: (pairs) => Storage.set(CONFIG.storageKey, pairs),

    isCollapsed: () => Storage.get(CONFIG.collapsedKey, false),
    setCollapsed: (state) => Storage.set(CONFIG.collapsedKey, state),

    isSettingsVisible: () => Storage.get(CONFIG.settingsVisibleKey, false),
    setSettingsVisible: (state) => Storage.set(CONFIG.settingsVisibleKey, state),

    getCurrentMode: () => Storage.get(CONFIG.currentModeKey, 'auto'),
    setCurrentMode: (mode) => Storage.set(CONFIG.currentModeKey, mode),

    isAutoSwitchEnabled: () => Storage.get(CONFIG.autoSwitchKey, true),
    setAutoSwitchEnabled: (state) => Storage.set(CONFIG.autoSwitchKey, state)
  };

  // =================== STREAM MANAGEMENT ===================
  const StreamManager = {
    getCurrentChannel: () => {
      const match = window.location.pathname.match(/^\/([a-zA-Z0-9_]+)$/);
      return match ? match[1].toLowerCase() : null;
    },

    getPairForCurrentChannel: () => {
      const currentChannel = StreamManager.getCurrentChannel();
      if (!currentChannel) return null;

      const pairs = Storage.getPairs();
      return pairs.find(p => p.twitch?.toLowerCase() === currentChannel);
    },

    isTwitchPlayerOffline: () => {
      // Multiple selectors for better reliability
      return !!(
        document.querySelector('[data-test-selector="offline-channel-video"]') ||
        document.querySelector('.channel-status-info [data-a-target="player-overlay-content-gate"]') ||
        Array.from(document.querySelectorAll('.channel-info-content')).some(el =>
          el.textContent.includes('offline') || el.textContent.includes('not available')
        )
      );
    },

    kickStreamURL: (channel) => `https://player.kick.com/${channel}?muted=false`,
    twitchStreamURL: (channel) => `https://player.twitch.tv/?channel=${channel}&parent=twitch.tv&muted=false`,

    replacePlayerWithStream: (url) => {
      const player = document.querySelector('.video-player__container');
      if (!player) return false;

      // Check if we already have our custom player
      const existingOverlay = document.getElementById('ttk-player-overlay');
      if (existingOverlay) {
        const existingIframe = existingOverlay.querySelector('iframe');
        if (existingIframe && existingIframe.src === url) return false;

        existingOverlay.innerHTML = '';
      } else {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'ttk-player-overlay';
        overlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          background: #000;
        `;
        player.style.position = 'relative';
        player.appendChild(overlay);
      }

      // Try to pause/mute all video and audio elements in the original player
      const videoElements = player.querySelectorAll('video');
      videoElements.forEach(video => {
        if (video) {
          try {
            if (!video.paused) video.pause();
            video.muted = true;
            video.volume = 0;
            // Disconnect any event listeners if possible
            if (video.pause) video.pause = () => {};
            if (video.play) video.play = () => {};
          } catch (e) {
            console.error('Error pausing video:', e);
          }
        }
      });

      // Try to pause the player if it has a React instance
      try {
        const twitchPlayer = document.querySelector('[data-a-player-type="site"]');
        if (twitchPlayer && twitchPlayer._reactInstance && typeof twitchPlayer._reactInstance.pausePlayer === 'function') {
          twitchPlayer._reactInstance.pausePlayer();
        }
      } catch (e) {
        console.error('Error accessing Twitch player:', e);
      }

      // Create iframe in the overlay
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.cssText = 'height:100%; width:100%; border:none;';
      iframe.setAttribute('allowfullscreen', 'true');
      document.getElementById('ttk-player-overlay').appendChild(iframe);

      UI.showNotification(`Stream changed to ${url.includes('kick') ? 'Kick' : 'Twitch'}`);
      return true;
    },

    switchToTwitch: () => {
      const current = StreamManager.getCurrentChannel();
      if (!current) return false;

      Storage.setCurrentMode('twitch');
      UI.updateModeIndicator('twitch');
      return StreamManager.replacePlayerWithStream(StreamManager.twitchStreamURL(current));
    },

    switchToKick: () => {
      const pair = StreamManager.getPairForCurrentChannel();
      if (!pair || !pair.kick) return false;

      Storage.setCurrentMode('kick');
      UI.updateModeIndicator('kick');
      return StreamManager.replacePlayerWithStream(StreamManager.kickStreamURL(pair.kick));
    },

    autoSwitch: () => {
      if (!Storage.isAutoSwitchEnabled()) return;

      const currentChannel = StreamManager.getCurrentChannel();
      if (!currentChannel) return;

      const pair = StreamManager.getPairForCurrentChannel();
      if (!pair || !pair.kick) return;

      const currentMode = Storage.getCurrentMode();

      // If mode is already set to kick or twitch, respect that choice
      if (currentMode === 'kick') {
        StreamManager.switchToKick();
        return;
      } else if (currentMode === 'twitch') {
        StreamManager.switchToTwitch();
        return;
      }

      // Auto mode - check if Twitch stream is offline
      if (StreamManager.isTwitchPlayerOffline()) {
        StreamManager.switchToKick();
      } else {
        StreamManager.switchToTwitch();
      }
    }
  };

  // =================== USER INTERFACE ===================
  const UI = {
    styles: `
      .ttk-container {
        position: fixed;
        right: 20px;
        top: 80px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 9999;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        transition: transform 0.3s ease;
      }

      .ttk-collapsed {
        transform: translateX(calc(100% + 10px));
      }

      .ttk-button {
        padding: 8px 12px;
        font-size: 13px;
        font-weight: 600;
        border-radius: 6px;
        color: white;
        border: none;
        cursor: pointer;
        user-select: none;
        transition: all 0.2s ease;
        width: 160px;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }

      .ttk-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }

      .ttk-button:active {
        transform: translateY(0);
      }

      .ttk-twitch-button {
        background-color: ${CONFIG.theme.primary};
      }

      .ttk-twitch-button:hover {
        background-color: #772CE8;
      }

      .ttk-kick-button {
        background-color: ${CONFIG.theme.secondary};
      }

      .ttk-kick-button:hover {
        background-color: #008A2D;
      }

      .ttk-auto-button {
        background-color: #555555;
      }

      .ttk-auto-button:hover {
        background-color: #666666;
      }

      .ttk-icon {
        font-size: 16px;
        display: inline-flex;
      }

      .ttk-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-left: auto;
        background-color: #888;
      }

      .ttk-indicator.active {
        background-color: #4ade80;
        box-shadow: 0 0 6px #4ade80;
      }

      .ttk-toggle {
        position: fixed;
        top: 120px;
        right: 20px;
        z-index: 10000;
        background: ${CONFIG.theme.dark};
        color: ${CONFIG.theme.light};
        border: 1px solid ${CONFIG.theme.border};
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }

      .ttk-toggle:hover {
        background: #333;
        transform: scale(1.1);
      }

      .ttk-settings-button {
        position: fixed;
        top: 160px;
        right: 20px;
        z-index: 10000;
        background: ${CONFIG.theme.dark};
        color: ${CONFIG.theme.light};
        border: 1px solid ${CONFIG.theme.border};
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }

      .ttk-settings-button:hover {
        background: #333;
        transform: scale(1.1);
      }

      .ttk-settings-panel {
        position: fixed;
        top: 200px;
        right: 20px;
        width: 320px;
        background: ${CONFIG.theme.dark};
        color: ${CONFIG.theme.light};
        border: 1px solid ${CONFIG.theme.border};
        border-radius: 10px;
        padding: 16px;
        z-index: 10000;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        display: none;
        max-height: 60vh;
        overflow-y: auto;
      }

      .ttk-settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid ${CONFIG.theme.border};
      }

      .ttk-settings-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
      }

      .ttk-close-button {
        background: none;
        border: none;
        color: ${CONFIG.theme.light};
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }

      .ttk-pair {
        background: #252528;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 12px;
        border: 1px solid ${CONFIG.theme.border};
      }

      .ttk-pair-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .ttk-pair-number {
        font-weight: 600;
        font-size: 14px;
      }

      .ttk-delete-pair {
        background: none;
        border: none;
        color: #f87171;
        cursor: pointer;
        font-size: 14px;
        padding: 0;
      }

      .ttk-input-group {
        margin-bottom: 8px;
      }

      .ttk-input-label {
        display: block;
        margin-bottom: 4px;
        font-size: 12px;
        color: #a0a0a5;
      }

      .ttk-input {
        width: 100%;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid ${CONFIG.theme.border};
        background: #1a1a1c;
        color: ${CONFIG.theme.light};
        font-size: 13px;
      }

      .ttk-input:focus {
        outline: none;
        border-color: ${CONFIG.theme.highlight};
      }

      .ttk-button-row {
        display: flex;
        gap: 8px;
        margin-top: 16px;
      }

      .ttk-action-button {
        flex: 1;
        padding: 8px 12px;
        border-radius: 4px;
        border: none;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }

      .ttk-primary-button {
        background: ${CONFIG.theme.primary};
        color: white;
      }

      .ttk-primary-button:hover {
        background: #772CE8;
      }

      .ttk-secondary-button {
        background: #3A3A3D;
        color: ${CONFIG.theme.light};
      }

      .ttk-secondary-button:hover {
        background: #4A4A4D;
      }

      .ttk-danger-button {
        background: #dc2626;
        color: white;
      }

      .ttk-danger-button:hover {
        background: #b91c1c;
      }

      .ttk-switch-container {
        display: flex;
        align-items: center;
        margin: 16px 0;
        justify-content: space-between;
      }

      .ttk-switch-label {
        font-size: 14px;
      }

      .ttk-switch {
        position: relative;
        display: inline-block;
        width: 46px;
        height: 24px;
      }

      .ttk-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .ttk-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #3A3A3D;
        transition: .4s;
        border-radius: 34px;
      }

      .ttk-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }

      input:checked + .ttk-slider {
        background-color: ${CONFIG.theme.secondary};
      }

      input:focus + .ttk-slider {
        box-shadow: 0 0 1px ${CONFIG.theme.secondary};
      }

      input:checked + .ttk-slider:before {
        transform: translateX(22px);
      }

      .ttk-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 16px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 10001;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      }

      .ttk-notification.show {
        opacity: 1;
        transform: translateY(0);
      }

      #ttk-player-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9;
        background: #000;
      }
    `,

    init: () => {
      // Add styles
      if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(UI.styles);
      } else {
        const style = document.createElement('style');
        style.textContent = UI.styles;
        document.head.appendChild(style);
      }

      UI.createButtons();
      UI.createToggles();
      UI.createSettingsPanel();
    },

    createButtons: () => {
      const container = document.createElement('div');
      container.id = 'ttk-container';
      container.className = 'ttk-container';
      if (Storage.isCollapsed()) container.classList.add('ttk-collapsed');

      // Kick button
      const kickBtn = document.createElement('button');
      kickBtn.className = 'ttk-button ttk-kick-button';
      kickBtn.innerHTML = '<span class="ttk-icon">⚡</span> Switch to Kick <span class="ttk-indicator" id="ttk-kick-indicator"></span>';
      kickBtn.onclick = StreamManager.switchToKick;

      // Twitch button
      const twitchBtn = document.createElement('button');
      twitchBtn.className = 'ttk-button ttk-twitch-button';
      twitchBtn.innerHTML = '<span class="ttk-icon">👾</span> Switch to Twitch <span class="ttk-indicator" id="ttk-twitch-indicator"></span>';
      twitchBtn.onclick = StreamManager.switchToTwitch;

      // Auto button
      const autoBtn = document.createElement('button');
      autoBtn.className = 'ttk-button ttk-auto-button';
      autoBtn.innerHTML = '<span class="ttk-icon">🔄</span> Auto Switch <span class="ttk-indicator" id="ttk-auto-indicator"></span>';
      autoBtn.onclick = () => {
        Storage.setCurrentMode('auto');
        UI.updateModeIndicator('auto');
        StreamManager.autoSwitch();
      };

      container.appendChild(twitchBtn);
      container.appendChild(kickBtn);
      container.appendChild(autoBtn);
      document.body.appendChild(container);

      UI.updateModeIndicator(Storage.getCurrentMode());
    },

    updateModeIndicator: (mode) => {
      const twitchIndicator = document.getElementById('ttk-twitch-indicator');
      const kickIndicator = document.getElementById('ttk-kick-indicator');
      const autoIndicator = document.getElementById('ttk-auto-indicator');

      if (twitchIndicator) twitchIndicator.classList.toggle('active', mode === 'twitch');
      if (kickIndicator) kickIndicator.classList.toggle('active', mode === 'kick');
      if (autoIndicator) autoIndicator.classList.toggle('active', mode === 'auto');
    },

    createToggles: () => {
      // Collapse toggle button
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'ttk-toggle';
      toggleBtn.id = 'ttk-toggle';
      toggleBtn.innerText = Storage.isCollapsed() ? '❯' : '❮';
      toggleBtn.onclick = () => {
        const container = document.getElementById('ttk-container');
        const isCollapsed = container.classList.contains('ttk-collapsed');
        container.classList.toggle('ttk-collapsed', !isCollapsed);
        toggleBtn.innerText = isCollapsed ? '❮' : '❯';
        Storage.setCollapsed(!isCollapsed);
      };
      document.body.appendChild(toggleBtn);

      // Settings button
      const settingsBtn = document.createElement('button');
      settingsBtn.className = 'ttk-settings-button';
      settingsBtn.innerText = '⚙️';
      settingsBtn.onclick = () => {
        const panel = document.getElementById('ttk-settings-panel');
        const isVisible = panel.style.display === 'block';
        panel.style.display = isVisible ? 'none' : 'block';
        Storage.setSettingsVisible(!isVisible);

        if (!isVisible) {
          UI.refreshPairsList();
        }
      };
      document.body.appendChild(settingsBtn);
    },

    createSettingsPanel: () => {
      const panel = document.createElement('div');
      panel.id = 'ttk-settings-panel';
      panel.className = 'ttk-settings-panel';
      if (Storage.isSettingsVisible()) panel.style.display = 'block';

      // Header
      const headerHTML = `
        <div class="ttk-settings-header">
          <h3 class="ttk-settings-title">TTK Stream Switcher Settings</h3>
          <button class="ttk-close-button" id="ttk-close-settings">×</button>
        </div>
      `;

      // Auto-switch toggle
      const autoSwitchHTML = `
        <div class="ttk-switch-container">
          <span class="ttk-switch-label">Enable auto-switching</span>
          <label class="ttk-switch">
            <input type="checkbox" id="ttk-auto-switch-toggle" ${Storage.isAutoSwitchEnabled() ? 'checked' : ''}>
            <span class="ttk-slider"></span>
          </label>
        </div>
      `;

      // Pairs list container
      const pairsListHTML = `
        <div id="ttk-pairs-container"></div>
      `;

      // Action buttons
      const buttonsHTML = `
        <div class="ttk-button-row">
          <button id="ttk-add-pair" class="ttk-action-button ttk-primary-button">
            <span>+</span> Add Pair
          </button>
          <button id="ttk-save-all" class="ttk-action-button ttk-secondary-button">
            <span>💾</span> Save All
          </button>
        </div>
      `;

      panel.innerHTML = headerHTML + autoSwitchHTML + pairsListHTML + buttonsHTML;
      document.body.appendChild(panel);

      // Event listeners
      document.getElementById('ttk-close-settings').onclick = () => {
        panel.style.display = 'none';
        Storage.setSettingsVisible(false);
      };

      document.getElementById('ttk-auto-switch-toggle').onchange = (e) => {
        Storage.setAutoSwitchEnabled(e.target.checked);
      };

      document.getElementById('ttk-add-pair').onclick = () => {
        const pairs = Storage.getPairs();
        pairs.push({ twitch: '', kick: '' });
        Storage.savePairs(pairs);
        UI.refreshPairsList();
      };

      document.getElementById('ttk-save-all').onclick = () => {
        UI.savePairs();
      };

      UI.refreshPairsList();
    },

    refreshPairsList: () => {
      const container = document.getElementById('ttk-pairs-container');
      if (!container) return;

      container.innerHTML = '';
      const pairs = Storage.getPairs();

      if (pairs.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 20px; color: #a0a0a5;">
            No streamer pairs added yet. Click "Add Pair" to get started.
          </div>
        `;
        return;
      }

      pairs.forEach((pair, index) => {
        const pairElement = document.createElement('div');
        pairElement.className = 'ttk-pair';
        pairElement.innerHTML = `
          <div class="ttk-pair-header">
            <span class="ttk-pair-number">Pair #${index + 1}</span>
            <button class="ttk-delete-pair" data-index="${index}">Delete</button>
          </div>
          <div class="ttk-input-group">
            <label class="ttk-input-label">Twitch Username</label>
            <input type="text" class="ttk-input ttk-twitch-input" data-index="${index}" value="${pair.twitch || ''}">
          </div>
          <div class="ttk-input-group">
            <label class="ttk-input-label">Kick Username</label>
            <input type="text" class="ttk-input ttk-kick-input" data-index="${index}" value="${pair.kick || ''}">
          </div>
        `;
        container.appendChild(pairElement);
      });

      // Add event listeners to delete buttons
      document.querySelectorAll('.ttk-delete-pair').forEach(btn => {
        btn.onclick = (e) => {
          const index = parseInt(e.target.getAttribute('data-index'));
          const pairs = Storage.getPairs();
          pairs.splice(index, 1);
          Storage.savePairs(pairs);
          UI.refreshPairsList();
        };
      });
    },

    savePairs: () => {
      const twitchInputs = document.querySelectorAll('.ttk-twitch-input');
      const kickInputs = document.querySelectorAll('.ttk-kick-input');
      const pairs = [];

      for (let i = 0; i < twitchInputs.length; i++) {
        const twitch = twitchInputs[i].value.trim();
        const kick = kickInputs[i].value.trim();

        if (twitch || kick) {
          pairs.push({ twitch, kick });
        }
      }

      Storage.savePairs(pairs);
      UI.showNotification('Settings saved successfully!');
    },

    showNotification: (message, duration = 3000) => {
      // Remove any existing notification
      const existingNotification = document.querySelector('.ttk-notification');
      if (existingNotification) {
        existingNotification.remove();
      }

      const notification = document.createElement('div');
      notification.className = 'ttk-notification';
      notification.textContent = message;
      document.body.appendChild(notification);

      // Force reflow before adding the show class
      notification.offsetHeight;
      notification.classList.add('show');

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, duration);
    }
  };

  // =================== INITIALIZATION ===================
  function initialize() {
    UI.init();

    // Set up auto-switch monitoring
    setInterval(() => {
      const currentChannel = StreamManager.getCurrentChannel();
      if (currentChannel) {
        StreamManager.autoSwitch();
      }
    }, CONFIG.checkInterval);

    // Initial check
    setTimeout(() => {
      StreamManager.autoSwitch();
    }, CONFIG.initDelay);
  }

  // Execute when DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();