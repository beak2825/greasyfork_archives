// ==UserScript==
// @name         Chat color changer
// @namespace    Chat color changer
// @version      0.0.1
// @description  Change the color of chat
// @author       Aijaz Aiyan
// @match        https://vectaria.io/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541548/Chat%20color%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/541548/Chat%20color%20changer.meta.js
// ==/UserScript==

(() => {
  const config = {
    font: 'Segoe UI, sans-serif',
    chatFont: "'Orbitron', monospace",
    neonColor: '#00ffff',
    versionLabel: 'Made by Efelling'
  };

  const createStyle = (id, css) => {
    let style = document.getElementById(id);
    if (style) {
      style.textContent = css;
    } else {
      style = document.createElement('style');
      style.id = id;
      style.textContent = css;
      document.head.appendChild(style);
    }
    return style;
  };

  const updateChatColor = (color) => {
    createStyle('chat-style', `
      .chat-container {
        max-height: 600px !important;
        overflow-y: auto !important;
      }
      .chat-container, .chat, #chat, .chat-wrapper, .chat-box,
      .chat-input, input.chat-input, textarea.chat-input,
      .chat-message, .chat-msg, .message, .chat-line, .chat-text {
        font-family: ${config.chatFont} !important;
        color: ${color} !important;
        text-shadow: 0 0 3px ${color}aa !important;
      }
      .chat-container ::-webkit-scrollbar {
        width: 8px;
      }
      .chat-container ::-webkit-scrollbar-thumb {
        background: ${color};
        border-radius: 12px;
        box-shadow: 0 0 5px ${color}aa;
      }
    `);
  };

  // === Inventory Theme Style ===
  createStyle('inventory-style', `
    .inventory-slot, .inventory-item, .slot, .item {
      background-color: rgba(0,0,0,0.4) !important;
      border: 2px solid ${config.neonColor} !important;
      box-shadow: 0 0 12px ${config.neonColor}cc, inset 0 0 6px ${config.neonColor}aa !important;
      border-radius: 6px !important;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }
    .inventory-slot:hover, .inventory-item:hover {
      transform: scale(1.05);
      box-shadow: 0 0 16px ${config.neonColor}, inset 0 0 8px ${config.neonColor} !important;
    }
    .inventory-slot img, .inventory-item img, .item img {
      background-color: transparent !important;
    }
    .item-count, .item-label {
      color: ${config.neonColor} !important;
      text-shadow: 0 0 4px ${config.neonColor}88 !important;
      font-weight: bold !important;
    }
  `);

  // === Version Tag Display ===
  const versionTag = document.createElement('div');
  versionTag.textContent = config.versionLabel;
  Object.assign(versionTag.style, {
    position: "fixed",
    bottom: "10px",
    right: "10px",
    color: config.neonColor,
    fontWeight: "bold",
    fontSize: "14px",
    fontFamily: config.font,
    textShadow: `0 0 6px ${config.neonColor}`,
    userSelect: "none",
    pointerEvents: "none",
    zIndex: 99999
  });
  document.body.appendChild(versionTag);

  // === Color Picker UI ===
  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.value = "#00ffdd";
  Object.assign(colorPicker.style, {
    position: "fixed",
    bottom: "10px",
    left: "10px",
    zIndex: 99999,
    width: "36px",
    height: "36px",
    border: "none",
    cursor: "pointer",
    background: "none"
  });
  colorPicker.addEventListener("input", () => {
    updateChatColor(colorPicker.value);
    localStorage.setItem("customChatColor", colorPicker.value);
  });
  document.body.appendChild(colorPicker);

  // === Load saved color or default ===
  const savedColor = localStorage.getItem("customChatColor") || colorPicker.value;
  colorPicker.value = savedColor;
  updateChatColor(savedColor);
})();
