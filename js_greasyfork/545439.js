// ==UserScript==
// @name         Agma.io Infinite Mass & Skin Changer Mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Infinite mass, skin changer, and bypass chat censor mod for Agma.io - Author: S E N S E
// @author       S E N S E
// @match        https://agma.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agma.io
// @grant        none
// @license      S E N S E
// @downloadURL https://update.greasyfork.org/scripts/545439/Agmaio%20Infinite%20Mass%20%20Skin%20Changer%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/545439/Agmaio%20Infinite%20Mass%20%20Skin%20Changer%20Mod.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // Settings saved in localStorage
  const realSettings = {
    infiniteMass: false,
    skinChanger: false,
    bypassChatCensor: false,
  };

  const settings = new Proxy(realSettings, {
    set(target, prop, value) {
      const res = Reflect.set(target, prop, value);
      localStorage.setItem('agmaModSettings', JSON.stringify(realSettings));
      return res;
    }
  });

  // Load settings from localStorage
  const storedSettings = localStorage.getItem('agmaModSettings');
  if (storedSettings) {
    try {
      const parsed = JSON.parse(storedSettings);
      Object.assign(settings, parsed);
    } catch (e) {
      localStorage.removeItem('agmaModSettings');
    }
  }

  // Hook WebSocket to inject infinite mass cheat
  let gameSocket = null;
  let originalSend = WebSocket.prototype.send;
  WebSocket.prototype.send = function (...args) {
    if (this.url.includes('agma.io')) {
      gameSocket = this;
    }
    return originalSend.apply(this, args);
  };

  function sendInfiniteMass() {
    if (gameSocket && gameSocket.readyState === WebSocket.OPEN) {
      // Agma uses Uint8Array messages, send a custom message to gain mass
      // The exact message depends on Agma's protocol (this is a simple example)
      // Adjust the payload bytes below to fit Agma's infinite mass command
      const infiniteMassCommand = new Uint8Array([17]); // example opcode for mass (change if needed)
      gameSocket.send(infiniteMassCommand);
    }
  }

  // Periodically send infinite mass command if enabled
  setInterval(() => {
    if (settings.infiniteMass) {
      sendInfiniteMass();
    }
  }, 1000);

  // Skin changer hook
  // For demonstration, we override skin change packets or patch the game's skin selector
  // This part requires inspecting agma.io's client code to hook properly
  // Here's a naive example replacing skin ID in outgoing packets

  const originalSetUint8 = DataView.prototype.setUint8;
  DataView.prototype.setUint8 = function(offset, value) {
    if (settings.skinChanger && offset === 1) {
      // Replace skin ID with a random skin from 1 to 50 (example range)
      value = Math.floor(Math.random() * 50) + 1;
    }
    return originalSetUint8.apply(this, [offset, value]);
  };

  // Bypass chat censor example: replace bad words in chat input before sending
  // For agma.io, chat may not be heavily censored, but here's a placeholder
  const chatInput = document.querySelector('input.chat-input'); // adjust selector
  if (chatInput) {
    const originalValueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    Object.defineProperty(chatInput, 'value', {
      get() {
        if (settings.bypassChatCensor) {
          // Replace censored words here or return uncensored value
          return originalValueDescriptor.get.call(this);
        } else {
          return originalValueDescriptor.get.call(this);
        }
      },
      set(value) {
        // You can sanitize or bypass censor here if needed
        originalValueDescriptor.set.call(this, value);
      }
    });
  }

  // Add simple settings UI in the page
  function createSettingsUI() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.backgroundColor = 'rgba(0,0,0,0.7)';
    container.style.color = 'white';
    container.style.padding = '10px';
    container.style.borderRadius = '8px';
    container.style.zIndex = 9999;
    container.style.fontFamily = 'Arial, sans-serif';

    container.innerHTML = `<b>Agma Mod Settings</b><br>`;

    Object.keys(settings).forEach((key) => {
      const label = document.createElement('label');
      label.style.display = 'block';
      label.style.marginTop = '6px';
      label.style.cursor = 'pointer';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = settings[key];
      checkbox.style.marginRight = '6px';
      checkbox.onchange = () => {
        settings[key] = checkbox.checked;
      };

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())));

      container.appendChild(label);
    });

    document.body.appendChild(container);
  }

  // Wait for document ready to inject UI
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    createSettingsUI();
  } else {
    window.addEventListener('DOMContentLoaded', createSettingsUI);
  }

})();