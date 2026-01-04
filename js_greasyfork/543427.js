
// ==UserScript==
// @name         Serenity Client
// @version      1.2.1
// @description  A feature-rich client for Bloxd.io
// @author       Serenity Development
// @match        *://*.bloxd.io/*
// @match        *://*.bloxdhop.io/*
// @match        *://*.bloxdk12.com/*
// @match        *://*.doodlecube.io/*
// @match        *://*.eviltower.io/*
// @match        *://1219647973806571553.discordsays.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1497646
// @downloadURL https://update.greasyfork.org/scripts/543427/Serenity%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/543427/Serenity%20Client.meta.js
// ==/UserScript==

//  discord.gg/serenityclient

(()=>{var U=`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --primary: #5E72EB; /* A nice modern blue */
  --primary-dark: #4D5DBF;
  --accent: #E54B4B; /* A contrasting accent color */
  --panel-base: #1e2129; /* Default dark background color */
  --panel-opacity: 0.85; /* Default opacity */
  --background: rgba(20, 22, 28, 0.9);
  --panel: rgba(30, 33, 41, var(--panel-opacity));
  --hover: rgba(255, 255, 255, 0.05);
  --border: rgba(255, 255, 255, 0.07);
  --shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
  --text: #EAEAEA;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --radius: 10px;
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  --notification-success-bg: rgba(63, 154, 86, 0.15);
  --notification-success-icon: #5cb85c;
  --notification-warning-bg: rgba(205, 163, 74, 0.15);
  --notification-warning-icon: #f0ad4e;
  --notification-error-bg: rgba(201, 79, 79, 0.15);
  --notification-error-icon: #d9534f;
  --notification-info-bg: rgba(94, 114, 235, 0.15);
  --notification-info-icon: var(--primary);
}

.serenity-hidden {
  display: none !important;
}

/* Overlay that covers the entire screen with heavy blur */
.serenity-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(10, 12, 16, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 9998;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.serenity-overlay.visible {
  opacity: 1;
}

/* Main container for the UI */
.serenity-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  display: flex;
  gap: 0; /* Remove gap for a more integrated look */
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  z-index: 9999;
  color: var(--text);
  opacity: 0;
  transition: var(--transition);
  max-height: 75vh;
  overflow: hidden;
  width: 70%;
  max-width: 1000px;
}

.serenity-container:not(.settings-view-active) .serenity-content {
  background-image: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 60%);
  background-size: 150% 150%;
  animation: fluid-hero 8s ease-in-out infinite;
}

.serenity-container.visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.serenity-container.settings-view-active .serenity-sidebar {
    display: none;
}

/* Left sidebar with categories */
.serenity-sidebar {
  display: flex;
  flex-direction: column;
  min-width: 200px;
  background-color: rgba(25, 28, 36, 0.5); /* Slightly different shade */
  padding: 15px;
  border-right: 1px solid var(--border);
}

.serenity-sidebar-footer {
    margin-top: auto;
    padding-top: 15px;
    border-top: 1px solid var(--border);
}

.serenity-logo {
  margin-bottom: 20px;
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.serenity-logo h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: var(--text);
  text-shadow: 0 0 10px var(--primary);
  transition: transform 0.2s ease-in-out;
}

.serenity-logo a {
    text-decoration: none;
}

.serenity-logo a:hover h1 {
    transform: scale(1.2);
}

.serenity-logo span {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
}

.serenity-category {
  padding: 12px 15px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
}

.serenity-category:hover {
  background-color: var(--hover);
  border-color: var(--border);
}

.serenity-category.active {
  background-color: var(--primary);
  color: #fff;
  box-shadow: 0 4px 20px rgba(94, 114, 235, 0.3);
}

.serenity-category-icon {
  margin-right: 12px;
  font-size: 16px;
  width: 20px; /* Ensure icons align */
  text-align: center;
  opacity: 0.9;
}

.serenity-category-icon i {
  font-weight: 900; /* Required for Font Awesome solid icons */
}

/* Right content area with modules */
.serenity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 20px;
}

.serenity-content::-webkit-scrollbar {
  width: 5px;
}

.serenity-content::-webkit-scrollbar-track {
  background: transparent;
}

.serenity-content::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 10px;
}

.serenity-content::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
}

.serenity-section {
  margin-bottom: 25px;
}

.serenity-section-header {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.serenity-search-bar {
  background: rgba(0,0,0,0.2);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  transition: var(--transition);
  width: 250px;
}

.serenity-search-bar:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(0,0,0,0.3);
}

.serenity-right-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.serenity-config-btn i {
  font-weight: 900;
}

.serenity-config-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  z-index: 10003;
  width: 480px;
  animation: fadeIn 0.1s ease-out;
  display: flex;
  flex-direction: column;
}

.serenity-config-popup-header {
  padding: 12px 15px;
  font-weight: 600;
  border-bottom: 1px solid var(--border);
  text-align: center;
}

.serenity-config-popup-header button {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 20px;
  cursor: pointer;
}

.serenity-config-popup-body {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.serenity-config-settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 15px;
}

.serenity-config-toggle-setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.serenity-config-manual-actions {
  display: flex;
  gap: 10px;
}

.serenity-config-manual-actions button {
  flex-grow: 1;
  padding: 8px 15px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background-color: var(--panel);
  color: var(--text);
  cursor: pointer;
  font-weight: 600;
  transition: var(--transition);
}

.serenity-config-manual-actions button:hover {
  background-color: var(--hover);
}

.serenity-config-popup-body textarea {
  width: 100%;
  min-height: 120px;
  resize: vertical;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: var(--text);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  box-sizing: border-box;
}

.serenity-config-popup-actions {
  display: flex;
  gap: 10px;
}

.serenity-config-popup-actions button {
  padding: 8px 15px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: var(--transition);
}

/* This targets the Import button */
.serenity-config-popup-actions button:first-child {
  background-color: var(--primary);
  color: #fff;
}

.serenity-config-popup-actions button:first-child:hover {
  background-color: var(--primary-dark);
}

/* This targets the Export button */
.serenity-config-popup-actions button:last-child {
  background-color: var(--panel);
  color: var(--text);
  border: 1px solid var(--border);
}

.serenity-config-popup-actions button:last-child:hover {
  background-color: var(--hover);
}

.serenity-config-popup-footer {
  padding: 15px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.serenity-config-back-btn {
  background-color: var(--panel);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 8px 15px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.serenity-config-back-btn:hover {
  background-color: var(--hover);
}

.serenity-modules {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}

/* Module cards */
.serenity-module {
  background-color: var(--panel);
  border-radius: var(--radius);
  padding: 16px;
  transition: var(--transition);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

.serenity-module:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  border-color: var(--primary);
}

.serenity-module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.serenity-module-name {
  font-weight: 600;
  font-size: 15px;
}

.serenity-module-toggle {
  position: relative;
  width: 44px; /* Slightly smaller */
  height: 22px;
  cursor: pointer;
}

.serenity-toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  transition: var(--transition);
  border-radius: 22px;
  border: 1px solid var(--border);
}

.serenity-toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: var(--text-secondary);
  transition: var(--transition);
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.serenity-module-toggle.enabled .serenity-toggle-slider {
  background-color: var(--primary);
  border-color: var(--primary-dark);
}

.serenity-module-toggle.enabled .serenity-toggle-slider:before {
  transform: translateX(22px);
  background-color: #fff;
}

.serenity-module-description {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* New controls for settings button next to the toggle */
.serenity-module-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.serenity-module-settings-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: var(--transition);
  font-size: 14px;
}

.serenity-module:hover .serenity-module-settings-btn {
  opacity: 1;
}

.serenity-module-settings-btn:hover {
  color: var(--text);
  background-color: var(--hover);
}

/* Header for the dedicated settings view */
.serenity-settings-header {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

.serenity-back-btn {
  background: var(--panel);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition);
  font-size: 14px;
  font-weight: 600;
}

.serenity-back-btn:hover {
  background: var(--hover);
  border-color: var(--primary);
}

/* HUD Editor styles */
.serenity-hud-editor-btn i {
  font-weight: 900;
}

.serenity-hud-editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(10, 12, 16, 0.8);
  backdrop-filter: blur(16px);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.serenity-hud-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: -1;
}

.serenity-hud-done-btn {
  position: absolute;
  bottom: 30px;
  background-color: var(--primary);
  color: #fff;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 20px rgba(94, 114, 235, 0.4);
}

.serenity-hud-done-btn:hover {
  background-color: var(--primary-dark);
}

/* HUD Settings Popup */
.serenity-hud-settings-popup {
  position: fixed;
  background-color: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px;
  z-index: 10002;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 200px;
  box-shadow: var(--shadow);
  animation: fadeIn 0.1s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* New header for the HUD settings popup */
.serenity-hud-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  background-color: rgba(0,0,0,0.2);
  border-bottom: 1px solid var(--border);
  font-weight: 600;
  font-size: 13px;
}

.serenity-hud-popup-close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.serenity-hud-popup-close-btn:hover {
  color: var(--text);
}

.serenity-hud-popup-body {
  padding: 10px;
}

.serenity-hud-popup-footer {
  padding: 10px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
}

.serenity-hud-popup-reset-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background-color 0.2s;
}

.serenity-hud-popup-reset-btn:hover {
  background: var(--primary-dark);
}

.serenity-config-popup-footer {
  padding: 15px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.serenity-config-back-btn {
  background-color: var(--panel);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 8px 15px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.serenity-config-back-btn:hover {
  background-color: var(--hover);
}

/* Compact styles for settings inside the HUD popup */
.serenity-hud-settings-popup .serenity-setting {
  padding: 4px 2px;
  border-bottom: none;
}

.serenity-hud-settings-popup .serenity-setting-label {
  font-size: 13px;
}

.serenity-hud-settings-popup .serenity-setting-description {
  display: none;
}

.serenity-module-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.serenity-setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--border);
}

.serenity-setting:last-child {
  border-bottom: none;
}

.serenity-setting-info {
  flex: 1;
}

.serenity-setting-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.serenity-setting-description {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
}

.serenity-setting-control {
  flex-basis: 40%;
}

/* Generic input styles */
.serenity-select, .serenity-text-input {
  width: 100%;
  background: rgba(0,0,0,0.2);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 6px;
  padding: 8px;
  font-size: 13px;
  transition: var(--transition);
}

.serenity-select:focus, .serenity-text-input:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(0,0,0,0.3);
}

/* Checkbox specific styles */
.serenity-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background-color: rgba(0,0,0,0.2);
  border: 1px solid var(--border);
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  transition: var(--transition);
}

.serenity-checkbox:checked {
  background-color: var(--primary);
  border-color: var(--primary-dark);
}

.serenity-checkbox:checked::before {
  content: '\u2713';
  font-size: 14px;
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Slider specific styles */
.serenity-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: rgba(0,0,0,0.3);
  border-radius: 3px;
  outline: none;
  transition: opacity .2s;
}

.serenity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--primary);
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid var(--background);
}

.serenity-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--primary);
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid var(--background);
}

/* Custom Color Picker with Alpha Support */
.serenity-color-picker-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.serenity-color-swatch {
  width: 100%;
  height: 28px;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  /* Checkerboard background to show transparency */
  background-image: 
    linear-gradient(45deg, #333 25%, transparent 25%), 
    linear-gradient(-45deg, #333 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #333 75%), 
    linear-gradient(-45deg, transparent 75%, #333 75%);
  background-size: 12px 12px;
  background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
  position: relative;
  overflow: hidden;
}

.serenity-color-swatch::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: currentColor;
}

.serenity-color-popup {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px;
  z-index: 10005; /* Above other UI */
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 160px;
}

.serenity-color-popup input[type="color"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  height: 30px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.serenity-color-popup input[type="color"]::-webkit-color-swatch {
  border-radius: 5px;
  border: 1px solid var(--border);
}

.serenity-color-popup input[type="color"]::-moz-color-swatch {
  border-radius: 5px;
  border: 1px solid var(--border);
}

.serenity-color-popup .serenity-slider {
  margin: 0;
}

/* Color Picker specific styles */
.serenity-color-picker {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  height: 28px;
  background-color: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
}

.serenity-color-picker::-webkit-color-swatch {
  border-radius: 5px;
  border: none;
}

.serenity-color-picker::-moz-color-swatch {
  border-radius: 5px;
  border: none;
}

.cps-counter-display {
  position: fixed;
  z-index: 9997;
  user-select: none;
}

.serenity-interface-display {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
}

.serenity-interface-logo {
  background-color: var(--accent-color, var(--primary));
  color: #fff;
  width: 2em;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.2em;
  font-weight: 800;
}

.serenity-interface-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.serenity-interface-name {
  font-weight: 700;
  color: var(--accent-color, var(--primary));
}

.serenity-interface-gamemode {
  font-weight: 700;
}

.serenity-interface-lobby {
  opacity: 0.7;
  font-size: 0.9em;
}

/* Chat Module Styles */
.serenity-chat-container {
  position: absolute;
  width: 350px;
  max-width: 25%;
  z-index: 1000;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.serenity-chat-messages {
  background-color: var(--panel);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: auto;
  width: 100%;
}

.serenity-chat-message {
  padding: 2px 0;
  font-size: var(--chat-font-size, 14px);
  color: #fff;
  display: flex;
  align-items: baseline;
  gap: 8px;
  line-height: 1.4;
}

.serenity-message-content {
  flex-grow: 1;
  white-space: normal;
  word-wrap: break-word;
}

.serenity-message-own-name {
  color: var(--accent, #E54B4B) !important;
  font-weight: 700;
}

.serenity-message-tag {
  color: #a970e3 !important; /* A nice purple */
  font-weight: 600;
}

.serenity-message-timestamp {
  font-size: 0.8em;
  opacity: 0.6;
}

.serenity-chat-input-wrapper {
  display: flex;
}

.serenity-chat-input {
  flex-grow: 1;
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: var(--chat-font-size, 14px);
  outline: none;
  transition: var(--transition);
  pointer-events: auto;
}

.serenity-chat-input:focus {
  border-color: var(--primary);
}

/* Global styles */
body {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
}

body.serenity-no-scroll {
  overflow: hidden;
}

/* Ensure the font is loaded */

/* Keystrokes Module */
.keystrokes-display {
  --key-size: 52px;
  --key-padding: 2px;
  --key-radius: 8px;
  --key-border: rgba(255, 255, 255, 0.1);
  --key-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  --key-shadow-pressed: 0 2px 4px rgba(0, 0, 0, 0.4);
  --key-transition: all 0.12s cubic-bezier(0.34, 1.56, 0.64, 1);
  --blur-intensity: 10px;
  --key-bg: var(--panel);
  --key-active-bg: var(--primary);
  --key-text: var(--text);
  font-family: 'Inter', 'Segoe UI', sans-serif;
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 5;
  pointer-events: none;
  user-select: none;
}

.keystrokes-row {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.keystrokes-key {
  position: relative;
  width: var(--key-size);
  height: var(--key-size);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--key-text);
  border-radius: var(--key-radius);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  user-select: none;
  border: none;
  background: var(--panel);
  transition: var(--key-transition);
  overflow: hidden;
  transform: translateY(0);
  box-shadow: var(--key-shadow);
}

.keystrokes-key::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary);
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: -1;
  border-radius: var(--key-radius);
}

.keystrokes-key.active {
  transform: translateY(2px);
  box-shadow: var(--key-shadow-pressed), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  color: white;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}

.keystrokes-key.active::before {
  opacity: 1;
}

.keystrokes-key.space-key {
  width: calc(var(--key-size) * 3 + 10px);
}

.keystrokes-row.mouse-row {
  margin-top: 2px;
}

.keystrokes-key.mouse-button {
  flex: 1;
  min-width: calc((var(--key-size) * 3 + 10px - 5px) / 2);
}

.keystrokes-display:not(.show-mouse) .mouse-row {
  display: none;
}

.keystrokes-display.no-animations .keystrokes-key {
  transition: none !important;
}

/* Notification System */
.serenity-notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10005;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.serenity-notification {
  display: flex;
  align-items: center;
  width: 350px;
  background: var(--panel);
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  color: var(--text);
  overflow: hidden;
  position: relative;
  opacity: 0;
  padding: 12px;
  gap: 12px;
}

.serenity-notification.exiting {
    pointer-events: none;
}

.serenity-notification-icon-wrapper {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--notification-info-bg);
}

.serenity-notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--notification-info-icon);
}

.serenity-notification-icon svg {
  width: 22px;
  height: 22px;
}

.serenity-notification-content {
  padding: 0;
  flex-grow: 1;
}

.serenity-notification-title {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 2px;
}

.serenity-notification-message {
  font-size: 14px;
  line-height: 1.4;
  color: var(--text-secondary);
}

.serenity-notification-message b {
    color: var(--text);
    font-weight: 600;
}

.serenity-notification-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.7;
  transition: var(--transition);
}

.serenity-notification-close:hover {
  opacity: 1;
  color: var(--text);
}

.serenity-notification-timer {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  background-color: var(--notification-info-icon);
  opacity: 0.6;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* Notification Types */
.serenity-notification-success .serenity-notification-icon-wrapper { background-color: var(--notification-success-bg); }
.serenity-notification-success .serenity-notification-icon { color: var(--notification-success-icon); }
.serenity-notification-success .serenity-notification-timer { background-color: var(--notification-success-icon); }

.serenity-notification-warning .serenity-notification-icon-wrapper { background-color: var(--notification-warning-bg); }
.serenity-notification-warning .serenity-notification-icon { color: var(--notification-warning-icon); }
.serenity-notification-warning .serenity-notification-timer { background-color: var(--notification-warning-icon); }

.serenity-notification-error .serenity-notification-icon-wrapper { background-color: var(--notification-error-bg); }
.serenity-notification-error .serenity-notification-icon { color: var(--notification-error-icon); }
.serenity-notification-error .serenity-notification-timer { background-color: var(--notification-error-icon); }

/* Animations */
@keyframes serenity-notification-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes serenity-notification-out {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* ArrayList Module - v2 */
.serenity-arraylist-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9995;
  pointer-events: none;
  font-weight: 600;
  line-height: 1.4;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-end;
}

.serenity-arraylist-item {
  position: relative;
  padding: 4px 12px;
  background-color: var(--panel);
  border-radius: 6px;
  transition: all 0.3s ease;
  overflow: hidden;
  padding-right: 18px; /* Make space for border */
}

.serenity-arraylist-border {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 4px;
}

.serenity-arraylist-container.with-shadow .serenity-arraylist-item {
  text-shadow: 0 1px 3px rgba(0,0,0,0.6);
}

/* New Config Screen Styles */
.serenity-config-screen {
    flex-direction: column;
    width: 60%;
    max-width: 800px;
    height: 70vh;
    max-height: 600px;
}

.serenity-config-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    height: 60px;
}

.serenity-config-title {
    font-size: 20px;
    font-weight: 700;
}

.serenity-config-tabs {
    display: flex;
    gap: 5px;
}

.serenity-config-tab {
    padding: 8px 18px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    border-radius: 8px;
    transition: var(--transition);
}

.serenity-config-tab:hover {
    background: var(--hover);
    color: var(--text);
}

.serenity-config-tab.active {
    background: var(--primary);
    color: #fff;
    box-shadow: 0 2px 10px rgba(94, 114, 235, 0.3);
}

.serenity-config-close-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 22px;
    cursor: pointer;
    transition: var(--transition);
    padding: 10px;
    border-radius: 50%;
}

.serenity-config-close-btn:hover {
    color: var(--text);
    background-color: var(--hover);
}

.serenity-config-content {
    flex-grow: 1;
    padding: 25px;
    overflow-y: auto;
}

.serenity-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 18px;
    color: var(--text-secondary);
    user-select: none;
}

/* Theme Editor Styles */
.serenity-theme-editor {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.serenity-section-subheader {
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
}

.serenity-subheader-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
}

.serenity-subheader-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
}

.serenity-theme-control {
    display: flex;
    align-items: center;
}

.serenity-theme-color-picker {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 60px;
    height: 40px;
    background-color: transparent;
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
}
.serenity-theme-color-picker::-webkit-color-swatch {
    border-radius: 7px;
    border: none;
}
.serenity-theme-color-picker::-moz-color-swatch {
    border-radius: 7px;
    border: none;
}

.serenity-themes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
}

.serenity-theme-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background-color: var(--panel);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
    cursor: pointer;
    transition: var(--transition);
}

.serenity-theme-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    border-color: var(--primary);
}

.serenity-theme-preview {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    flex-shrink: 0;
}

/* New Config Screen Styles */
.serenity-config-screen-content {
    display: flex;
    gap: 25px;
    height: 100%;
}

.serenity-config-tabs-vertical {
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-right: 1px solid var(--border);
    padding-right: 25px;
    flex-shrink: 0;
}

.serenity-config-tab {
    padding: 10px 20px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    border-radius: 8px;
    transition: var(--transition);
}

.serenity-config-tab:hover {
    background: var(--hover);
    color: var(--text);
}

.serenity-config-tab.active {
    background: var(--primary);
    color: #fff;
    box-shadow: 0 2px 10px rgba(94, 114, 235, 0.3);
}

.serenity-config-tab-content {
    flex-grow: 1;
    overflow-y: auto;
    padding: 5px;
}

.serenity-config-content {
    flex-grow: 1;
    padding: 25px;
    overflow-y: auto;
    user-select: none;
}

/* Config Editor Styles */
.serenity-config-editor {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
}

.serenity-config-column {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.serenity-config-controls-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    border: 1px solid var(--border);
}

.serenity-config-toggle-setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--panel);
    padding: 15px;
    border-radius: var(--radius);
    border: 1px solid var(--border);
}

.serenity-config-manual-actions {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.serenity-btn {
    padding: 10px 20px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background-color: var(--panel);
    color: var(--text);
    cursor: pointer;
    font-weight: 600;
    transition: var(--transition);
}

.serenity-btn:hover {
    background-color: var(--hover);
    border-color: var(--primary);
}

.serenity-btn-primary {
    background-color: var(--primary);
    border-color: var(--primary);
    color: #fff;
}

.serenity-btn-primary:hover {
    background-color: var(--primary-dark);
}

.serenity-import-export-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.serenity-import-export textarea {
    width: 100%;
    min-height: 100px;
    resize: vertical;
    background: rgba(0,0,0,0.2);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 14px;
    box-sizing: border-box;
}

.serenity-import-export-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

/* Theme Editor Styles */
.serenity-theme-editor {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

/* Hotbar Module Styles */
.serenity-hotbar-wrapper {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px; /* Add some space between aura bar and hotbar */
    pointer-events: none;
    user-select: none;
}

.serenity-hotbar-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    pointer-events: auto;
}

.serenity-hotbar-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.serenity-hotbar-filler {
    flex-grow: 1;
    max-width: 20px;
}

.serenity-hotbar-items {
    display: flex;
    align-items: center;
    gap: var(--hotbar-slot-spacing);
}

.serenity-hotbar-slot {
    position: relative;
    width: var(--hotbar-slot-size);
    height: var(--hotbar-slot-size);
    background-color: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all 0.15s ease-out;
}

.serenity-hotbar-slot.selected {
    border-color: var(--primary);
    box-shadow: 0 0 8px var(--primary);
}

.serenity-hotbar-item-img {
    width: 80%;
    height: 80%;
    object-fit: contain;
    image-rendering: pixelated;
}

.serenity-slot-number {
    position: absolute;
    bottom: 2px;
    right: 4px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 10px;
    font-weight: bold;
    z-index: 1;
    text-shadow: 0 0 2px #000;
}

.serenity-slot-amount {
    position: absolute;
    top: 2px;
    left: 4px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 12px;
    font-weight: bold;
    z-index: 1;
    text-shadow: 1px 1px 2px #000;
}

.serenity-hotbar-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
}

.serenity-hotbar-button-icon {
    position: relative;
    color: #fff;
    font-size: 18px;
}

.serenity-hotbar-key-helper {
    position: absolute;
    bottom: -12px;
    right: -8px;
    font-size: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 3px;
    padding: 1px 4px;
    font-weight: bold;
}

.hotbar-style-compact .serenity-hotbar-slot {
    border-radius: 2px;
    margin: 0 1px !important;
}

.hotbar-style-compact .serenity-hotbar-button {
    border-radius: 2px;
}

.hotbar-style-modern .serenity-hotbar-slot {
    background-color: rgba(20, 22, 30, 0.7);
    border-radius: 8px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
}

.hotbar-style-modern .serenity-hotbar-slot.selected {
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(94, 114, 235, 0.3);
}

.hotbar-style-modern .serenity-hotbar-button {
    background-color: rgba(20, 22, 30, 0.7);
    border-radius: 8px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Aura Bar Styles */
.serenity-aura-bar {
    width: 250px;
    height: 18px;
    background-color: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 2px;
    position: relative;
    overflow: hidden;
}

.serenity-aura-bar-background {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
}

.serenity-aura-bar-progress {
    height: 100%;
    background-color: var(--primary);
    transition: width 0.3s ease-in-out;
}

.serenity-aura-bar-text {
    position: relative;
    z-index: 1;
    width: 100%;
    text-align: center;
    color: #fff;
    font-weight: bold;
    font-size: 12px;
    text-shadow: 0 0 3px #000;
}

/* Fluid Hero Animation */
@keyframes fluid-hero {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.serenity-theme-panel-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: center;
}

.serenity-theme-control-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.serenity-theme-control-group label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
}

.serenity-waypoint-static {
  --waypoint-color: #5E72EB;
  position: fixed;
  z-index: 9996;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  user-select: none;
}

.waypoint-static-icon {
  width: 48px;
  height: 48px;
  color: var(--waypoint-color);
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
}

.waypoint-static-text {
  background-color: rgba(20, 22, 28, 0.7);
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  margin-top: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  white-space: nowrap;
}

.waypoint-static-title {
  display: block;
}

.waypoint-static-distance {
  display: block;
  font-size: 12px;
  opacity: 0.7;
}

/* Waypoint Manager UI */
.serenity-waypoint-general-settings {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border);
}

.serenity-waypoint-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.serenity-waypoint-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.serenity-waypoint-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: var(--panel);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.serenity-waypoint-color-preview {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid var(--background);
}

.serenity-waypoint-info {
  flex-grow: 1;
}

.serenity-waypoint-info .title {
  font-weight: 600;
  font-size: 15px;
}

.serenity-waypoint-info .coords {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
}

.serenity-waypoint-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.serenity-waypoint-controls button {
  background: var(--hover);
  border: none;
  color: var(--text-secondary);
  width: 30px;
  height: 30px;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition);
}

.serenity-waypoint-controls button:hover {
  background: var(--primary);
  color: #fff;
}

.coord-inputs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

/* Keybind Editor Styles */
.serenity-keybind-editor {
    display: flex;
    flex-direction: column;
    gap: 20px;
    /* Allow the container to shrink and enable scrolling on its child */
    height: 100%;
    min-height: 0;
}

.serenity-keybind-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    overflow-y: auto;
    padding-right: 10px; /* Space for scrollbar */
}

.serenity-keybind-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--panel);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
}

.serenity-keybind-name {
    font-weight: 600;
    font-size: 14px;
}

.serenity-keybind-button {
    background: rgba(0,0,0,0.2);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    padding: 6px 12px;
    border-radius: 6px;
    min-width: 60px;
    text-align: center;
    cursor: pointer;
    transition: var(--transition);
}

.serenity-keybind-button:hover {
    background-color: var(--hover);
    color: var(--text);
}

.serenity-keybind-button.binding {
    background-color: var(--primary);
    color: #fff;
    border-color: var(--primary-dark);
}
`;var ge={name:"ClickGUI",category:"Visual",description:"The main user interface for the client.",enabled:!0,element:null,overlay:null,activeCategory:"Visual",activeSettingsModule:null,isEditingHUD:!1,activeHUDSettingsPopup:null,searchQuery:"",isGuiOpen:!1,isCleaningUp:!1,activeConfigTab:"Themes",activeView:"modules",onEnable(e){if(!(this.isCleaningUp||this.element)){if(this.isGuiOpen=!0,document.body.classList.add("serenity-no-scroll"),document.pointerLockElement&&document.exitPointerLock(),!document.getElementById("font-awesome-link")){let t=document.createElement("link");t.id="font-awesome-link",t.rel="stylesheet",t.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css",document.head.appendChild(t)}this.createGUI(e),this.updateContent(e),setTimeout(()=>{this.overlay&&this.overlay.classList.add("visible"),this.element&&this.element.classList.add("visible")},50)}},onDisable(e){this.isGuiOpen=!1,this.exitHUDeditor(e),document.body.classList.remove("serenity-no-scroll");let t=document.getElementById("noa-canvas");t&&!document.pointerLockElement&&(t.requestPointerLock(),t.click()),this.cleanup()},cleanup(){this.overlay&&!this.isCleaningUp&&(this.isCleaningUp=!0,this.overlay.classList.remove("visible"),this.element.classList.remove("visible"),setTimeout(()=>{this.overlay&&document.body.removeChild(this.overlay),this.element&&document.body.removeChild(this.element),this.overlay=null,this.element=null,this.isCleaningUp=!1,document.body.classList.remove("serenity-no-scroll");let e=document.getElementById("font-awesome-link");e&&document.head.removeChild(e)},300))},createGUI(e){this.overlay=document.createElement("div"),this.overlay.className="serenity-overlay",document.body.appendChild(this.overlay),this.element=document.createElement("div"),this.element.className="serenity-container";let t=this.createSidebar(e);this.element.appendChild(t);let i=this.createContent(e);this.element.appendChild(i),document.body.appendChild(this.element)},createSidebar(e){let t=document.createElement("div");t.className="serenity-sidebar";let i=document.createElement("div");i.className="serenity-logo",i.innerHTML=`
      <a href="https://discord.gg/serenityclient" target="_blank"><h1>Serenity</h1></a>
      <span>CLIENT v1.2</span>
    `,t.appendChild(i);let n=e.categories,o={Visual:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="width: 1.2em; height: 1.2em; vertical-align: middle; margin-right: 12px;"><path fill="currentColor" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>',Utility:'<i class="fas fa-cog"></i>',Combat:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 1.2em; height: 1.2em; vertical-align: middle; margin-right: 12px;"><path fill="currentColor" d="M256 0c17.7 0 32 14.3 32 32l0 10.4c93.7 13.9 167.7 88 181.6 181.6l10.4 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-10.4 0c-13.9 93.7-88 167.7-181.6 181.6l0 10.4c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-10.4C130.3 455.7 56.3 381.7 42.4 288L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l10.4 0C56.3 130.3 130.3 56.3 224 42.4L224 32c0-17.7 14.3-32 32-32zM107.4 288c12.5 58.3 58.4 104.1 116.6 116.6l0-20.6c0-17.7 14.3-32 32-32s32 14.3 32 32l0 20.6c58.3-12.5 104.1-58.4 116.6-116.6L384 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l20.6 0C392.1 165.7 346.3 119.9 288 107.4l0 20.6c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-20.6C165.7 119.9 119.9 165.7 107.4 224l20.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-20.6 0zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',Player:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width: 1.2em; height: 1.2em; vertical-align: middle; margin-right: 12px;"><path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>',Movement:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width: 1.2em; height: 1.2em; vertical-align: middle; margin-right: 12px;"><path fill="currentColor" d="M320 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM125.7 175.5c9.9-9.9 23.4-15.5 37.5-15.5c1.9 0 3.8 .1 5.6 .3L137.6 254c-9.3 28 1.7 58.8 26.8 74.5l86.2 53.9-25.4 88.8c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l28.7-100.4c5.9-20.6-2.6-42.6-20.7-53.9L238 299l30.9-82.4 5.1 12.3C289 264.7 323.9 288 362.7 288l21.3 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-21.3 0c-12.9 0-24.6-7.8-29.5-19.7l-6.3-15c-14.6-35.1-44.1-61.9-80.5-73.1l-48.7-15c-11.1-3.4-22.7-5.2-34.4-5.2c-31 0-60.8 12.3-82.7 34.3L57.4 153.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l23.1-23.1zM91.2 352L32 352c-17.7 0-32 14.3-32 32s14.3 32 32 32l69.6 0c19 0 36.2-11.2 43.9-28.5L157 361.6l-9.5-6c-17.5-10.9-30.5-26.8-37.9-44.9L91.2 352z"/></svg>'};n.forEach(d=>{let l=document.createElement("div");l.className=`serenity-category ${d===this.activeCategory?"active":""}`;let c=o[d]||o.Utility;l.innerHTML=`
        <span class="serenity-category-icon">${c}</span>
        ${d}
      `,l.addEventListener("click",()=>{document.querySelectorAll(".serenity-category").forEach(p=>{p.classList.remove("active")}),l.classList.add("active"),this.activeCategory=d,this.activeSettingsModule=null,this.searchQuery="",this.closeHUDSettingsPopup(),this.updateContent(e)}),t.appendChild(l)});let s=document.createElement("div");s.className="serenity-sidebar-footer";let r=document.createElement("div");r.className="serenity-category serenity-hud-editor-btn",r.innerHTML='<svg class="serenity-category-icon" style="width: 1.2em; margin-right: 12px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l176 0-10.7 32L160 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-69.3 0L336 416l176 0c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0zM512 64l0 224L64 288 64 64l448 0z"/></svg> HUD Editor',r.addEventListener("click",()=>{this.isEditingHUD=!0,this.renderHUDeditor(e)}),s.appendChild(r);let a=document.createElement("div");return a.className="serenity-category serenity-config-btn",a.innerHTML='<svg class="serenity-category-icon" style="width: 1.2em; margin-right: 12px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M308.5 135.3c7.1-6.3 9.9-16.2 6.2-25c-2.3-5.3-4.8-10.5-7.6-15.5L304 89.4c-3-5-6.3-9.9-9.8-14.6c-5.7-7.6-15.7-10.1-24.7-7.1l-28.2 9.3c-10.7-8.8-23-16-36.2-20.9L199 27.1c-1.9-9.3-9.1-16.7-18.5-17.8C173.9 8.4 167.2 8 160.4 8l-.7 0c-6.8 0-13.5 .4-20.1 1.2c-9.4 1.1-16.6 8.6-18.5 17.8L115 56.1c-13.3 5-25.5 12.1-36.2 20.9L50.5 67.8c-9-3-19-.5-24.7 7.1c-3.5 4.7-6.8 9.6-9.9 14.6l-3 5.3c-2.8 5-5.3 10.2-7.6 15.6c-3.7 8.7-.9 18.6 6.2 25l22.2 19.8C32.6 161.9 32 168.9 32 176s.6 14.1 1.7 20.9L11.5 216.7c-7.1 6.3-9.9 16.2-6.2 25c2.3 5.3 4.8 10.5 7.6 15.6l3 5.2c3 5.1 6.3 9.9 9.9 14.6c5.7 7.6 15.7 10.1 24.7 7.1l28.2-9.3c10.7 8.8 23 16 36.2 20.9l6.1 29.1c1.9 9.3 9.1 16.7 18.5 17.8c6.7 .8 13.5 1.2 20.4 1.2s13.7-.4 20.4-1.2c9.4-1.1 16.6-8.6 18.5-17.8l6.1-29.1c13.3-5 25.5-12.1 36.2-20.9l28.2 9.3c9 3 19 .5 24.7-7.1c3.5-4.7 6.8-9.5 9.8-14.6l3.1-5.4c2.8-5 5.3-10.2 7.6-15.5c3.7-8.7 .9-18.6-6.2-25l-22.2-19.8c1.1-6.8 1.7-13.8 1.7-20.9s-.6-14.1-1.7-20.9l22.2-19.8zM112 176a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM504.7 500.5c6.3 7.1 16.2 9.9 25 6.2c5.3-2.3 10.5-4.8 15.5-7.6l5.4-3.1c5-3 9.9-6.3 14.6-9.8c7.6-5.7 10.1-15.7 7.1-24.7l-9.3-28.2c8.8-10.7 16-23 20.9-36.2l29.1-6.1c9.3-1.9 16.7-9.1 17.8-18.5c.8-6.7 1.2-13.5 1.2-20.4s-.4-13.7-1.2-20.4c-1.1-9.4-8.6-16.6-17.8-18.5L583.9 307c-5-13.3-12.1-25.5-20.9-36.2l9.3-28.2c3-9 .5-19-7.1-24.7c-4.7-3.5-9.6-6.8-14.6-9.9l-5.3-3c-5-2.8-10.2-5.3-15.6-7.6c-8.7-3.7-18.6-.9-25 6.2l-19.8 22.2c-6.8-1.1-13.8-1.7-20.9-1.7s-14.1 .6-20.9 1.7l-19.8-22.2c-6.3-7.1-16.2-9.9-25-6.2c-5.3 2.3-10.5 4.8-15.6 7.6l-5.2 3c-5.1 3-9.9 6.3-14.6 9.9c-7.6 5.7-10.1 15.7-7.1 24.7l9.3 28.2c-8.8 10.7-16 23-20.9 36.2L315.1 313c-9.3 1.9-16.7 9.1-17.8 18.5c-.8 6.7-1.2 13.5-1.2 20.4s.4 13.7 1.2 20.4c1.1 9.4 8.6 16.6 17.8 18.5l29.1 6.1c5 13.3 12.1 25.5 20.9 36.2l-9.3 28.2c-3 9-.5 19 7.1 24.7c4.7 3.5 9.5 6.8 14.6 9.8l5.4 3.1c5 2.8 10.2 5.3 15.5 7.6c8.7 3.7 18.6 .9 25-6.2l19.8-22.2c6.8 1.1 13.8 1.7 20.9 1.7s14.1-.6 20.9-1.7l19.8 22.2zM464 304a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg> Settings',a.addEventListener("click",()=>{this.activeView="settings",this.updateContent(e)}),s.appendChild(a),t.appendChild(s),t},exitHUDeditor(e){if(!this.isEditingHUD)return;let t=document.querySelector(".serenity-hud-editor-overlay");t&&document.body.removeChild(t),this.isEditingHUD=!1,this.closeHUDSettingsPopup(),this.overlay&&(this.overlay.style.zIndex="1000000000"),e.list().forEach(i=>{i.enabled&&i.element&&(i.element.style.zIndex=i.name==="ArmorHUD"||i.name==="CPSCounter"||i.name==="FPSCounter"||i.name==="Interface"?9997:"",i.element.style.pointerEvents="none",i.element.style.cursor="",i.element.onmousedown=null)})},renderHUDeditor(e){this.element.style.display="none",this.overlay&&(this.overlay.style.zIndex="-1");let t=document.createElement("div");t.className="serenity-hud-editor-overlay",document.body.appendChild(t);let i=document.createElement("div");i.className="serenity-hud-grid",t.appendChild(i),e.list().forEach(o=>{o.enabled&&o.element&&(o.element.style.zIndex=10001,o.element.style.pointerEvents="auto",this.makeElementDraggable(o.element,o,e))});let n=document.createElement("button");n.className="serenity-hud-done-btn",n.textContent="Done",n.addEventListener("click",()=>{this.exitHUDeditor(e),this.element.style.display="flex",this.element.style.pointerEvents="auto",this.element.style.zIndex="1000000001"}),t.appendChild(n)},makeElementDraggable(e,t,i){if(!e||t.name==="ClickGUI")return;let n=0,o=0,s=0,r=0,a=c=>{c.preventDefault(),s=c.clientX,r=c.clientY;let p=e.getBoundingClientRect();e.style.top=`${p.top}px`,e.style.left=`${p.left}px`,e.style.bottom="auto",e.style.right="auto",document.onmouseup=l,document.onmousemove=d},d=c=>{c.preventDefault(),n=s-c.clientX,o=r-c.clientY,s=c.clientX,r=c.clientY;let p=e.offsetTop-o,u=e.offsetLeft-n,h=window.innerWidth,m=window.innerHeight,g=e.offsetWidth,f=e.offsetHeight;if(u=Math.max(0,Math.min(u,h-g)),p=Math.max(0,Math.min(p,m-f)),e.style.top=`${p}px`,e.style.left=`${u}px`,this.activeHUDSettingsPopup&&this.activeHUDSettingsPopup.moduleName===t.name){let y=this.activeHUDSettingsPopup.element,b=y.offsetWidth,v=u+g+10;v+b>h&&(v=u-b-10),y.style.top=`${p}px`,y.style.left=`${v}px`}},l=()=>{document.onmouseup=null,document.onmousemove=null,i.updateModulePosition(t.name,e.offsetLeft,e.offsetTop)};e.onmousedown=a,e.oncontextmenu=c=>{c.preventDefault(),this.showHUDSettingsPopup(c,t,i,e)},e.style.cursor="move"},showHUDSettingsPopup(e,t,i,n){this.closeHUDSettingsPopup();let o=document.createElement("div");o.className="serenity-hud-settings-popup";let s=document.createElement("div");s.className="serenity-hud-popup-header";let r=document.createElement("span");r.textContent=t.name;let a=document.createElement("button");a.className="serenity-hud-popup-close-btn",a.innerHTML="&times;",a.onclick=()=>this.closeHUDSettingsPopup(),s.appendChild(r),s.appendChild(a),o.appendChild(s);let d=document.createElement("div");d.className="serenity-hud-popup-body",t.settings.forEach(g=>{let f=this.createSettingElement(t,g,i);f&&d.appendChild(f)}),o.appendChild(d);let l=document.createElement("div");l.className="serenity-hud-popup-footer";let c=document.createElement("button");c.className="serenity-hud-popup-reset-btn",c.textContent="Reset to Defaults",c.onclick=()=>{i.resetModuleSettings(t.name),this.showHUDSettingsPopup(e,i.get(t.name),i,n)},l.appendChild(c),o.appendChild(l),document.body.appendChild(o);let p=n.getBoundingClientRect(),u=window.innerWidth,h=o.offsetWidth,m=p.left+p.width+10;m+h>u&&(m=p.left-h-10),o.style.top=`${p.top}px`,o.style.left=`${m}px`,this.activeHUDSettingsPopup={element:o,moduleName:t.name}},closeHUDSettingsPopup(){this.activeHUDSettingsPopup&&(document.body.removeChild(this.activeHUDSettingsPopup.element),this.activeHUDSettingsPopup=null)},createContent(e){let t=document.createElement("div");return t.className="serenity-content",this.populateModulesContent(t,e),t},updateContent(e){let t=this.element.querySelector(".serenity-content");t.innerHTML="",this.activeView==="settings"?this.element.classList.add("settings-view-active"):this.element.classList.remove("settings-view-active"),this.activeSettingsModule?this.populateSettingsContent(t,e):this.activeView==="settings"?this.renderSettingsScreen(t,e):this.populateModulesContent(t,e)},renderSettingsScreen(e,t){let i=document.createElement("div");i.className="serenity-settings-header";let n=document.createElement("button");n.className="serenity-back-btn",n.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="width: 0.7em; height: 0.7em; margin-right: 8px; vertical-align: middle;"><path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg> Back',n.addEventListener("click",()=>{this.activeView="modules",this.activeSettingsModule=null,this.updateContent(t)});let o=document.createElement("span");o.textContent="Settings",i.appendChild(n),i.appendChild(o),e.appendChild(i);let s=document.createElement("div");s.className="serenity-config-screen-content";let r=document.createElement("div");r.className="serenity-config-tabs-vertical",r.innerHTML=`
        <button class="serenity-config-tab active" data-tab="Themes">Themes</button>
        <button class="serenity-config-tab" data-tab="Config">Config</button>
        <button class="serenity-config-tab" data-tab="Keybinds">Keybinds</button>
        <button class="serenity-config-tab" data-tab="Scripting">Scripting</button>
    `,s.appendChild(r);let a=document.createElement("div");a.className="serenity-config-tab-content",s.appendChild(a),e.appendChild(s),r.querySelectorAll(".serenity-config-tab").forEach(d=>{d.addEventListener("click",()=>{r.querySelectorAll(".serenity-config-tab").forEach(l=>l.classList.remove("active")),d.classList.add("active"),this.activeConfigTab=d.dataset.tab,this.renderConfigContent(t)})}),this.renderConfigContent(t)},renderConfigContent(e){let t=this.element.querySelector(".serenity-config-tab-content");if(t)switch(t.innerHTML="",this.activeConfigTab){case"Themes":this.renderThemesContent(t,e);break;case"Config":this.renderConfigSubContent(t,e);break;case"Keybinds":this.renderKeybindsContent(t,e);break;case"Scripting":this.renderScriptingContent(t,e);break}},renderThemesContent(e,t){let i=document.createElement("div");i.className="serenity-theme-editor";let n=this.createSectionHeader("Accent Color","Sets the main color for UI elements.");i.appendChild(n);let o=document.createElement("div");o.className="serenity-theme-control";let s=document.createElement("input");s.type="color",s.className="serenity-theme-color-picker",s.value=getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(),s.addEventListener("input",y=>{let b=y.target.value;document.documentElement.style.setProperty("--primary",b),document.documentElement.style.setProperty("--primary-dark",this.shadeColor(b,-20)),t.saveConfiguration()}),o.appendChild(s),i.appendChild(o);let r=this.createSectionHeader("Panel Style","Customize the look of UI backgrounds.");i.appendChild(r);let a=document.createElement("div");a.className="serenity-theme-panel-controls";let d=document.createElement("div");d.className="serenity-theme-control-group",d.innerHTML="<label>Panel Color</label>";let l=document.createElement("input");l.type="color",l.className="serenity-theme-color-picker";let c=getComputedStyle(document.documentElement).getPropertyValue("--panel-base").trim();l.value=c,l.addEventListener("input",y=>{document.documentElement.style.setProperty("--panel-base",y.target.value),t.saveConfiguration()}),d.appendChild(l),a.appendChild(d);let p=document.createElement("div");p.className="serenity-theme-control-group",p.innerHTML="<label>Panel Opacity</label>";let u=document.createElement("input");u.type="range",u.className="serenity-slider",u.min=0,u.max=1,u.step=.01;let h=getComputedStyle(document.documentElement).getPropertyValue("--panel-opacity").trim();u.value=h,u.addEventListener("input",y=>{document.documentElement.style.setProperty("--panel-opacity",y.target.value),t.saveConfiguration()}),p.appendChild(u),a.appendChild(p),i.appendChild(a);let m=this.createSectionHeader("Themes","Select from a pre-made color scheme.");i.appendChild(m);let g=document.createElement("div");g.className="serenity-themes-grid",[{name:"Serenity",color:"#5E72EB"},{name:"Sunset",color:"#E54B4B"},{name:"Emerald",color:"#3f9a56"},{name:"Goldenrod",color:"#cda34a"},{name:"Amethyst",color:"#9b59b6"}].forEach(y=>{let b=document.createElement("div");b.className="serenity-theme-card",b.innerHTML=`<div class="serenity-theme-preview" style="background-color: ${y.color};"></div><span>${y.name}</span>`,b.addEventListener("click",()=>{document.documentElement.style.setProperty("--primary",y.color),document.documentElement.style.setProperty("--primary-dark",this.shadeColor(y.color,-20)),s.value=y.color,t.saveConfiguration()}),g.appendChild(b)}),i.appendChild(g),e.appendChild(i)},renderKeybindsContent(e,t){e.innerHTML="";let i=t.keybindManager,n=document.createElement("div");n.className="serenity-keybind-editor";let o=this.createSectionHeader("Module Keybinds","Click a key to set a new bind. Press ESC to cancel, or Backspace/Delete to unbind.");n.appendChild(o);let s=document.createElement("div");s.className="serenity-keybind-list",t.list().filter(a=>a.name!=="ClickGUI").sort((a,d)=>a.name.localeCompare(d.name)).forEach(a=>{let d=document.createElement("div");d.className="serenity-keybind-item";let l=document.createElement("span");l.className="serenity-keybind-name",l.textContent=a.name;let c=document.createElement("button");c.className="serenity-keybind-button";let p=i.getBind(a.name);c.textContent=p?this.formatKeyCode(p):"None",c.onclick=()=>{document.querySelectorAll(".serenity-keybind-button").forEach(u=>u.disabled=!0),c.textContent="[...]",c.classList.add("binding"),c.disabled=!1,i.startBinding(a.name,()=>{this.renderKeybindsContent(e,t)})},d.appendChild(l),d.appendChild(c),s.appendChild(d)}),n.appendChild(s),e.appendChild(n)},formatKeyCode(e){return e.startsWith("Key")?e.substring(3):e.startsWith("Digit")?e.substring(5):e.startsWith("Numpad")?`Num ${e.substring(6)}`:e},createSectionHeader(e,t){let i=document.createElement("div");return i.className="serenity-section-subheader",i.innerHTML=`
        <div class="serenity-subheader-title">${e}</div>
        <div class="serenity-subheader-subtitle">${t}</div>
      `,i},renderConfigSubContent(e,t){let i=document.createElement("div");i.className="serenity-config-editor";let n=document.createElement("div");n.className="serenity-config-column";let o=this.createSectionHeader("General","Manage how your configuration is handled.");n.appendChild(o);let s=document.createElement("div");s.className="serenity-config-controls-grid";let r=this.createToggleSetting("Auto Save","Automatically save changes.",t.autoSave,b=>{t.autoSave=b,t.forceSaveConfiguration()});s.appendChild(r);let a=this.createToggleSetting("Auto Load","Load config on startup.",t.autoLoad,b=>{t.autoLoad=b,t.forceSaveConfiguration()});s.appendChild(a),n.appendChild(s);let d=this.createSectionHeader("Manual Control","Manually save or load the current config.");n.appendChild(d);let l=document.createElement("div");l.className="serenity-config-manual-buttons";let c=document.createElement("button");c.className="serenity-btn",c.textContent="Force Save",c.onclick=()=>{t.forceSaveConfiguration(),c.textContent="Saved!",setTimeout(()=>{c.textContent="Force Save"},2e3)},l.appendChild(c);let p=document.createElement("button");p.className="serenity-btn",p.textContent="Force Load",p.onclick=()=>t.loadConfiguration(),l.appendChild(p);let u=document.createElement("button");u.className="serenity-btn serenity-btn-danger",u.textContent="Reset All",u.onclick=()=>{confirm("Are you sure you want to reset all settings to their defaults? This action cannot be undone.")&&(t.loadConfiguration({}),setTimeout(()=>{window.location.reload()},500))},l.appendChild(u),n.appendChild(l),i.appendChild(n);let h=document.createElement("div");h.className="serenity-config-column";let m=this.createSectionHeader("Import / Export","Share your configuration with others.");h.appendChild(m);let g=document.createElement("div");g.className="serenity-import-export-buttons";let f=document.createElement("button");f.className="serenity-btn serenity-btn-primary",f.innerHTML='<i class="fas fa-upload"></i> Import from File',f.onclick=()=>{let b=document.createElement("input");b.type="file",b.accept=".json",b.onchange=v=>{let C=v.target.files[0];if(!C)return;let w=new FileReader;w.onload=x=>{try{t.importConfiguration(x.target.result),alert("Configuration imported successfully!")}catch{alert("Failed to import configuration. The file may be corrupt or improperly formatted.")}},w.readAsText(C)},b.click()};let y=document.createElement("button");y.className="serenity-btn",y.innerHTML='<i class="fas fa-download"></i> Export to File',y.onclick=()=>{let b=t.exportConfiguration(),v=JSON.stringify(b,null,2);navigator.clipboard.writeText(v).then(()=>{this.notifications.show({title:"Config Exported",message:"Configuration copied to clipboard.",type:"success"})});let C=new Blob([v],{type:"application/json"}),w=URL.createObjectURL(C),x=document.createElement("a");x.href=w,x.download="serenity-config.json",document.body.appendChild(x),x.click(),document.body.removeChild(x),URL.revokeObjectURL(w)},g.appendChild(f),g.appendChild(y),h.appendChild(g),i.appendChild(h),e.appendChild(i)},renderScriptingContent(e,t){e.innerHTML='<div class="serenity-placeholder">Scripting coming soon...</div>'},shadeColor(e,t){let i=parseInt(e.substring(1,3),16),n=parseInt(e.substring(3,5),16),o=parseInt(e.substring(5,7),16);i=parseInt(i*(100+t)/100),n=parseInt(n*(100+t)/100),o=parseInt(o*(100+t)/100),i=i<255?i:255,n=n<255?n:255,o=o<255?o:255;let s=i.toString(16).length==1?"0"+i.toString(16):i.toString(16),r=n.toString(16).length==1?"0"+n.toString(16):n.toString(16),a=o.toString(16).length==1?"0"+o.toString(16):o.toString(16);return"#"+s+r+a},populateModulesContent(e,t){let i=document.createElement("div");i.className="serenity-section-header";let n=document.createElement("span");n.textContent=this.activeCategory;let o=document.createElement("input");o.type="text",o.className="serenity-search-bar",o.placeholder="Search...",o.value=this.searchQuery,o.addEventListener("input",r=>{this.searchQuery=r.target.value,this.filterAndRenderModules(t)}),i.appendChild(n),i.appendChild(o),e.appendChild(i);let s=document.createElement("div");s.className="serenity-modules",e.appendChild(s),this.filterAndRenderModules(t)},filterAndRenderModules(e){let t=this.element.querySelector(".serenity-modules");if(!t)return;t.innerHTML="",e.getModulesByCategory(this.activeCategory).filter(o=>o.name.toLowerCase().includes(this.searchQuery.toLowerCase())).forEach(o=>{let s=this.createModuleCard(o,e);t.appendChild(s)})},createModuleCard(e,t){let i=document.createElement("div");i.className="serenity-module";let n=document.createElement("div");n.className="serenity-module-header";let o=document.createElement("div");o.className="serenity-module-name",o.textContent=e.name,n.appendChild(o);let s=document.createElement("div");if(s.className="serenity-module-controls",e.settings.length>0){let a=document.createElement("button");a.className="serenity-module-settings-btn",a.innerHTML='<i class="fas fa-cog"></i>',a.addEventListener("click",d=>{d.stopPropagation(),this.activeSettingsModule=e,this.updateContent(t)}),s.appendChild(a)}let r=document.createElement("div");if(r.className=`serenity-module-toggle ${e.enabled?"enabled":""}`,r.innerHTML='<span class="serenity-toggle-slider"></span>',r.addEventListener("click",()=>{t.toggle(e.name),r.classList.toggle("enabled")}),s.appendChild(r),n.appendChild(s),i.appendChild(n),e.description){let a=document.createElement("div");a.className="serenity-module-description",a.textContent=e.description,i.appendChild(a)}return i},populateSettingsContent(e,t){let i=this.activeSettingsModule;if(!i)return;let n=document.createElement("div");n.className="serenity-section";let o=document.createElement("div");o.className="serenity-settings-header";let s=document.createElement("button");s.className="serenity-back-btn",s.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="width: 0.7em; height: 0.7em; margin-right: 8px; vertical-align: middle;"><path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg> Back',s.addEventListener("click",()=>{this.activeSettingsModule=null,this.updateContent(t)});let r=document.createElement("span");r.textContent=`${i.name} Settings`,o.appendChild(s),o.appendChild(r),n.appendChild(o);let a=document.createElement("div");a.className="serenity-module-settings",i.name==="Waypoint"?this.renderWaypointManager(a,t):i.settings.forEach(d=>{let l=this.createSettingElement(i,d,t);if(l){if(d.condition){let c=d.condition(i.settings.reduce((p,u)=>({...p,[u.id]:u.value}),{}));l.style.display=c?"":"none"}a.appendChild(l)}}),n.appendChild(a),e.appendChild(n)},renderWaypointManager(e,t){e.innerHTML="";let i=t.get("Waypoint");if(!i)return;let n=document.createElement("div");n.className="serenity-waypoint-general-settings",i.settings.filter(d=>d.type!=="info").forEach(d=>{let l=this.createSettingElement(i,d,t);n.appendChild(l)}),e.appendChild(n);let o=document.createElement("div");o.className="serenity-waypoint-actions";let s=document.createElement("button");s.className="serenity-btn serenity-btn-primary",s.textContent="Add at Current Location",s.onclick=()=>{let d=i.getCurrentPlayerPosition();d?(i.addWaypoint({...d}),this.renderWaypointManager(e,t)):alert("Could not get player position.")};let r=document.createElement("button");r.className="serenity-btn",r.textContent="Create Manually",r.onclick=()=>{i.addWaypoint({}),this.renderWaypointManager(e,t)},o.appendChild(s),o.appendChild(r),e.appendChild(o);let a=document.createElement("div");a.className="serenity-waypoint-list",i.getWaypoints().forEach(d=>{let l=document.createElement("div");l.className="serenity-waypoint-item";let c=document.createElement("div");c.className="serenity-waypoint-color-preview",c.style.backgroundColor=d.color;let p=document.createElement("div");p.className="serenity-waypoint-info",p.innerHTML=`
        <span class="title">${d.title}</span>
        <span class="coords">X: ${d.x}, Y: ${d.y}, Z: ${d.z}</span>
      `;let u=document.createElement("div");u.className="serenity-waypoint-controls";let h=document.createElement("input");h.type="checkbox",h.className="serenity-checkbox",h.checked=d.enabled,h.onchange=f=>{i.updateWaypoint(d.id,{enabled:f.target.checked})};let m=document.createElement("button");m.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor"><path d="M402.6 83.2l90.2 90.2c12.5 12.5 12.5 32.8 0 45.3l-283.2 283.2c-12.5 12.5-32.8 12.5-45.3 0L32.2 368.2c-12.5-12.5-12.5-32.8 0-45.3l283.2-283.2c12.5-12.5 32.8-12.5 45.3 0zm47.4 18.7c-9.2-9.2-22.9-11.9-35.8-9.8l-15.6 15.6 100.2 100.2 15.6-15.6c2.1-12.9-.6-26.6-9.8-35.8l-55.2-55.2zM384 346.7L128 480H0V352l256-256L384 346.7z"/></svg>',m.onclick=()=>this.showWaypointEditPopup(d,t);let g=document.createElement("button");g.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>',g.onclick=()=>{confirm(`Are you sure you want to delete "${d.title}"?`)&&(i.removeWaypoint(d.id),this.renderWaypointManager(e,t))},u.appendChild(h),u.appendChild(m),u.appendChild(g),l.appendChild(c),l.appendChild(p),l.appendChild(u),a.appendChild(l)}),e.appendChild(a)},showWaypointEditPopup(e,t){let i=t.get("Waypoint"),n=document.createElement("div");n.className="serenity-config-popup",n.innerHTML=`
          <div class="serenity-config-popup-header">
              <span>Edit Waypoint</span>
          </div>
          <div class="serenity-config-popup-body">
              <input type="text" id="wp-title" class="serenity-text-input" placeholder="Title" value="${e.title}">
              <div class="coord-inputs">
                  <input type="text" id="wp-x" class="serenity-text-input" placeholder="X" value="${e.x}">
                  <input type="text" id="wp-y" class="serenity-text-input" placeholder="Y" value="${e.y}">
                  <input type="text" id="wp-z" class="serenity-text-input" placeholder="Z" value="${e.z}">
              </div>
              <input type="color" id="wp-color" value="${e.color}">
          </div>
          <div class="serenity-config-popup-footer">
              <button id="wp-cancel" class="serenity-btn">Cancel</button>
              <button id="wp-save" class="serenity-btn serenity-btn-primary">Save</button>
          </div>
      `;let o=document.createElement("div");o.className="serenity-overlay visible",o.style.zIndex="10001",document.body.appendChild(o),document.body.appendChild(n);let s=()=>{document.body.removeChild(n),document.body.removeChild(o),this.updateContent(t)};n.querySelector("#wp-save").onclick=()=>{let r={title:n.querySelector("#wp-title").value,x:n.querySelector("#wp-x").value,y:n.querySelector("#wp-y").value,z:n.querySelector("#wp-z").value,color:n.querySelector("#wp-color").value};i.updateWaypoint(e.id,r),s()},n.querySelector("#wp-cancel").onclick=s},createSettingElement(e,t,i){let n=document.createElement("div");n.className="serenity-setting",n.dataset.settingId=t.id;let o=document.createElement("div");o.className="serenity-setting-info";let s=document.createElement("label");if(s.className="serenity-setting-label",s.textContent=t.name,o.appendChild(s),t.description){let a=document.createElement("p");a.className="serenity-setting-description",a.textContent=t.description,o.appendChild(a)}n.appendChild(o);let r=document.createElement("div");switch(r.className="serenity-setting-control",t.type){case"boolean":let a=document.createElement("input");a.type="checkbox",a.checked=t.value,a.className="serenity-checkbox",a.addEventListener("change",u=>{i.updateModuleSetting(e.name,t.id,u.target.checked),this.updateConditionalSettings(e,i)}),r.appendChild(a);break;case"slider":let d=document.createElement("input");d.type="range",d.min=t.min,d.max=t.max,d.step=t.step,d.value=t.value,d.className="serenity-slider",d.addEventListener("input",u=>{i.updateModuleSetting(e.name,t.id,parseFloat(u.target.value))}),r.appendChild(d);break;case"select":let l=document.createElement("select");l.className="serenity-select",t.options.forEach(u=>{let h=document.createElement("option");h.value=u,h.textContent=u,t.value===u&&(h.selected=!0),l.appendChild(h)}),l.addEventListener("change",u=>{i.updateModuleSetting(e.name,t.id,u.target.value),this.updateConditionalSettings(e,i)}),r.appendChild(l);break;case"text":let c=document.createElement("input");c.type="text",c.value=t.value,c.className="serenity-text-input",c.addEventListener("change",u=>{i.updateModuleSetting(e.name,t.id,u.target.value)}),r.appendChild(c);break;case"color":let p=this.createColorPicker(e,t,i);r.appendChild(p);break}return n.appendChild(r),n},updateConditionalSettings(e,t){let i=e.settings.reduce((o,s)=>({...o,[s.id]:s.value}),{}),n=this.element.querySelector(".serenity-module-settings");e.settings.forEach(o=>{if(o.condition){let s=n.querySelector(`[data-setting-id="${o.id}"]`);s&&(s.style.display=o.condition(i)?"":"none")}})},createColorPicker(e,t,i){let n=document.createElement("div");n.className="serenity-color-picker-wrapper";let o=document.createElement("div");o.className="serenity-color-swatch",o.style.color=t.value;let s=this.createColorPopup(e,t,i,o);return o.addEventListener("click",r=>{r.stopPropagation();let a=document.querySelector(".serenity-color-popup");a&&a!==s&&a.remove(),document.querySelector(".serenity-color-popup")===s?s.remove():n.appendChild(s)}),n.appendChild(o),document.addEventListener("click",r=>{n.contains(r.target)||s.remove()}),n},createColorPopup(e,t,i,n){let o=document.createElement("div");o.className="serenity-color-popup";let s=document.createElement("input");s.type="color",s.value=this.rgbaToHex(t.value).hex;let r=document.createElement("input");r.type="range",r.className="serenity-slider",r.min=0,r.max=1,r.step=.01,r.value=this.rgbaToHex(t.value).alpha;let a=()=>{let d=s.value,l=parseFloat(r.value),c=this.hexToRgba(d,l);n.style.color=c,i.updateModuleSetting(e.name,t.id,c)};return s.addEventListener("input",a),r.addEventListener("input",a),o.appendChild(s),o.appendChild(r),o},hexToRgba(e,t){let i=parseInt(e.slice(1,3),16),n=parseInt(e.slice(3,5),16),o=parseInt(e.slice(5,7),16);return`rgba(${i}, ${n}, ${o}, ${t})`},rgbaToHex(e){if(e.startsWith("#"))return{hex:e,alpha:1};let t=e.match(/[\d.]+/g);if(!t||t.length<3)return{hex:"#000000",alpha:1};let i=parseInt(t[0]).toString(16).padStart(2,"0"),n=parseInt(t[1]).toString(16).padStart(2,"0"),o=parseInt(t[2]).toString(16).padStart(2,"0"),s=t.length>=4?parseFloat(t[3]):1;return{hex:`#${i}${n}${o}`,alpha:s}},createToggleSetting(e,t,i,n){let o=document.createElement("div");o.className="serenity-config-toggle-setting";let s=document.createElement("div");s.className="serenity-setting-info";let r=document.createElement("label");r.className="serenity-setting-label",r.textContent=e;let a=document.createElement("p");a.className="serenity-setting-description",a.textContent=t,s.appendChild(r),s.appendChild(a);let d=document.createElement("div");d.className="serenity-setting-control";let l=document.createElement("input");return l.type="checkbox",l.checked=i,l.className="serenity-checkbox",l.addEventListener("change",c=>{n(c.target.checked)}),d.appendChild(l),o.appendChild(s),o.appendChild(d),o}},A=ge;var be={name:"FPSCounter",category:"Visual",description:"Displays your current frames per second.",enabled:!1,defaultX:"90%",defaultY:"45%",settings:[{id:"color-mode",name:"Color Mode",type:"select",options:["Theme","Custom"],value:"Theme"},{id:"bg-color",name:"Background Color",type:"color",value:"rgba(30, 33, 41, 0.85)",condition:e=>e["color-mode"]==="Custom"},{id:"text-color",name:"Text Color",type:"color",value:"#EAEAEA",condition:e=>e["color-mode"]==="Custom"},{id:"font-size",name:"Font Size",type:"slider",value:14,min:8,max:24,step:1},{id:"padding",name:"Padding",type:"slider",value:8,min:0,max:20,step:1},{id:"border-radius",name:"Border Radius",type:"slider",value:10,min:0,max:20,step:1},{id:"border-width",name:"Border Width",type:"slider",value:1,min:0,max:5,step:1},{id:"border-color",name:"Border Color",type:"color",value:"rgba(255, 255, 255, 0.07)",condition:e=>e["color-mode"]==="Custom"},{id:"show-label",name:"Show Label",type:"boolean",value:!0},{id:"format",name:"Text Format",type:"text",value:"{label} {fps}",description:"Use {label} and {fps} as placeholders."},{id:"hide-game-fps",name:"Hide Game FPS Counter",type:"boolean",value:!0,description:"Hide the built-in game FPS counter"}],frameCount:0,lastTime:0,fps:0,element:null,frameCallback:null,gameFpsElements:null,gameFpsDisplayStyle:null,onEnable(){this.frameCount=0,this.lastTime=performance.now(),this.fps=0,this.createDisplay(),this.applyStyles(),this.frameCallback=this.countFrame.bind(this),requestAnimationFrame(this.frameCallback),this.updateGameFpsVisibility()},onDisable(){this.destroyDisplay(),this.frameCallback=null,this.restoreGameFpsCounter()},countFrame(e){this.frameCount++;let t=e-this.lastTime;t>=1e3&&(this.fps=Math.round(this.frameCount*1e3/t),this.frameCount=0,this.lastTime=e),this.frameCallback&&requestAnimationFrame(this.frameCallback)},onTick(){this.updateDisplay()},onSettingUpdate(e){this.applyStyles(),this.updateDisplay(),e==="hide-game-fps"&&this.updateGameFpsVisibility()},createDisplay(){this.element=document.createElement("div"),this.element.className="fps-counter-display",document.body.appendChild(this.element)},destroyDisplay(){this.element&&(document.body.removeChild(this.element),this.element=null)},updateGameFpsVisibility(){this.settings.reduce((t,i)=>({...t,[i.id]:i.value}),{})["hide-game-fps"]?this.hideGameFpsCounter():this.restoreGameFpsCounter()},hideGameFpsCounter(){let e=document.querySelector(".FpsWrapperDiv");e&&(this.gameFpsElements=e,this.gameFpsDisplayStyle=e.style.display,e.style.display="none")},restoreGameFpsCounter(){this.gameFpsElements&&(this.gameFpsElements.style.display=this.gameFpsDisplayStyle||"",this.gameFpsElements=null,this.gameFpsDisplayStyle=null)},updateDisplay(){if(this.element){let e=window.Serenity.instance.get("ClickGUI");if(!e||!e.isEditingHUD){let n=window.Serenity.instance.get(this.name);n.x!==null&&(this.element.style.left=typeof n.x=="string"?n.x:`${n.x}px`),n.y!==null&&(this.element.style.top=typeof n.y=="string"?n.y:`${n.y}px`)}let t=this.settings.reduce((n,o)=>({...n,[o.id]:o.value}),{}),i=t.format;t["show-label"]?i=i.replace("{label}","FPS:"):i=i.replace("{label}",""),i=i.replace("{fps}",this.fps),this.element.textContent=i.trim()}},applyStyles(){if(!this.element)return;let e=this.settings.reduce((t,i)=>({...t,[i.id]:i.value}),{});e["color-mode"]==="Theme"?(this.element.style.backgroundColor="var(--panel)",this.element.style.color="var(--text)",this.element.style.border=`${e["border-width"]}px solid var(--border)`):(this.element.style.backgroundColor=e["bg-color"],this.element.style.color=e["text-color"],this.element.style.border=`${e["border-width"]}px solid ${e["border-color"]}`),this.element.style.fontSize=`${e["font-size"]}px`,this.element.style.padding=`${e.padding}px`,this.element.style.borderRadius=`${e["border-radius"]}px`,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.style.zIndex=5,this.element.style.pointerEvents="none"}},G=be;var z=null;function k(){if(z)return z;let e=document.querySelectorAll(".ChatMessages .IndividualText"),t=Array.from(e).filter(i=>i.textContent?.includes(" joined"));if(t.length>0){let o=t[t.length-1].textContent.split(" joined")[0].trim();if(o)return z=o,o}return null}function W(e,t=20){let i=Date.now()/t;return`hsl(${(e*15+i)%360}, 90%, 65%)`}var fe={name:"Interface",category:"Visual",description:"Replaces the default in-game header with a customizable one.",enabled:!0,defaultX:2,defaultY:7,element:null,gameHeader:null,gameHeaderParent:null,gameHeaderNextSibling:null,lastPlayerName:null,observer:null,settings:[{id:"remove-header",name:"Remove Game Header",type:"boolean",value:!0,description:"For performance, move the header off-screen instead of just hiding it."},{id:"color-mode",name:"Color Mode",type:"select",options:["Theme","Custom"],value:"Theme"},{id:"bg-color",name:"Background Color",type:"color",value:"rgba(30, 33, 41, 0.85)",condition:e=>e["color-mode"]==="Custom"},{id:"text-color",name:"Text Color",type:"color",value:"#EAEAEA",condition:e=>e["color-mode"]==="Custom"},{id:"accent-color",name:"Accent Color",type:"color",value:"#5E72EB",condition:e=>e["color-mode"]==="Custom"},{id:"font-size",name:"Font Size",type:"slider",value:16,min:10,max:28,step:1},{id:"padding-y",name:"Padding (Y)",type:"slider",value:4,min:0,max:30,step:1},{id:"padding-x",name:"Padding (X)",type:"slider",value:6,min:0,max:30,step:1},{id:"border-radius",name:"Border Radius",type:"slider",value:10,min:0,max:20,step:1},{id:"border-width",name:"Border Width",type:"slider",value:1,min:0,max:5,step:1},{id:"border-color",name:"Border Color",type:"color",value:"rgba(255, 255, 255, 0.07)",condition:e=>e["color-mode"]==="Custom"},{id:"show-logo",name:"Show Logo",type:"boolean",value:!0},{id:"logo-text",name:"Logo Text",type:"text",value:"S",condition:e=>e["show-logo"]},{id:"show-name",name:"Show Name",type:"boolean",value:!0},{id:"show-gamemode",name:"Show Gamemode",type:"boolean",value:!0},{id:"show-lobby",name:"Show Lobby",type:"boolean",value:!0}],onEnable(){this.handleHeader(),this.observer=new MutationObserver(()=>this.handleHeader()),this.observer.observe(document.body,{childList:!0,subtree:!0}),this.createDisplay(),this.applyStyles()},onDisable(){this.observer&&(this.observer.disconnect(),this.observer=null),this.restoreHeader(),this.destroyDisplay()},onTick(){this.updateDisplay()},onSettingUpdate(e){e==="remove-header"&&this.handleHeader(),this.applyStyles(),this.updateDisplay(!0)},handleHeader(){let e=document.querySelector(".InGameHeaderContainer");e&&(this.gameHeader=e,this.settings.find(i=>i.id==="remove-header").value?(e.style.position="absolute",e.style.left="-9999px",e.style.top="-9999px",e.style.opacity="0"):e.style.display="none")},restoreHeader(){this.gameHeader&&(this.gameHeader.style.position="",this.gameHeader.style.left="",this.gameHeader.style.top="",this.gameHeader.style.opacity="",this.gameHeader.style.display="")},createDisplay(){this.element=document.createElement("div"),this.element.className="serenity-interface-display",this.element.style.top="20px",this.element.style.left="20px",document.body.appendChild(this.element)},destroyDisplay(){this.element&&(document.body.removeChild(this.element),this.element=null)},updateDisplay(e=!1){if(!this.element)return;let t=window.Serenity.instance.get("ClickGUI");if(!t||!t.isEditingHUD){let c=window.Serenity.instance.get(this.name);c.x!==null&&(this.element.style.left=`${c.x}px`),c.y!==null&&(this.element.style.top=`${c.y}px`)}let i=document.querySelector(".InGameHeaderGameName"),n=document.querySelector(".InGameHeaderLobbyName"),o=i?i.textContent:"Unknown",s=n?`(#${n.textContent})`:"",r=k(),a=this.settings.reduce((c,p)=>({...c,[p.id]:p.value}),{});r&&this.lastPlayerName!==r&&(this.lastPlayerName=r,e=!0);let d=`
            ${a["show-logo"]?`<div class="serenity-interface-logo">${a["logo-text"]}</div>`:""}
            <div class="serenity-interface-info">
                ${a["show-name"]&&r?`<div class="serenity-interface-name">${r}</div>`:""}
                ${a["show-gamemode"]?`<div class="serenity-interface-gamemode">${o}</div>`:""}
                ${a["show-lobby"]?`<div class="serenity-interface-lobby">${s}</div>`:""}
            </div>
        `,l=JSON.stringify(d);(this.lastHash!==l||e)&&(this.element.innerHTML=d,this.applyStyles(),this.lastHash=l)},applyStyles(){if(!this.element)return;let e=this.settings.reduce((i,n)=>({...i,[n.id]:n.value}),{});e["color-mode"]==="Theme"?(this.element.style.setProperty("--accent-color","var(--primary)"),this.element.style.backgroundColor="var(--panel)",this.element.style.color="var(--text)",this.element.style.border=`${e["border-width"]}px solid var(--border)`):(this.element.style.setProperty("--accent-color",e["accent-color"]),this.element.style.backgroundColor=e["bg-color"],this.element.style.color=e["text-color"],this.element.style.border=`${e["border-width"]}px solid ${e["border-color"]}`),this.element.style.fontSize=`${e["font-size"]}px`,this.element.style.padding=`${e["padding-y"]}px ${e["padding-x"]}px`,this.element.style.borderRadius=`${e["border-radius"]}px`,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.style.pointerEvents="none";let t=window.Serenity.instance.get("ClickGUI");(!t||!t.isEditingHUD)&&(this.element.style.zIndex=5)}},q=fe;var ve={name:"Chat",category:"Visual",description:"Replaces the default in-game chat with a customizable one.",enabled:!0,defaultX:4,defaultY:59,element:null,gameChat:null,chatObserver:null,mainObserver:null,customInput:null,settings:[{id:"hide-game-chat",name:"Hide Game Chat",type:"boolean",value:!0,description:"Hides the original in-game chat UI."},{id:"font-size",name:"Font Size",type:"slider",value:14,min:10,max:24,step:1},{id:"max-messages",name:"Max Messages",type:"slider",value:7,min:5,max:25,step:1},{id:"show-timestamps",name:"Show Timestamps",type:"boolean",value:!1}],onEnable(){this.createDisplay(),this.handleGameChat(),this.mainObserver=new MutationObserver(()=>this.handleGameChat()),this.mainObserver.observe(document.body,{childList:!0,subtree:!0})},onDisable(){this.mainObserver&&this.mainObserver.disconnect(),this.chatObserver&&this.chatObserver.disconnect(),this.restoreGameChat(),this.destroyDisplay()},onTick(){this.handleGameChat()},onFrame(){if(this.element){let e=window.Serenity.instance.get("ClickGUI");if(!e||!e.isEditingHUD){let t=window.Serenity.instance.get(this.name);t.x!==null&&(this.element.style.left=`${t.x}px`),t.y!==null&&(this.element.style.top=`${t.y}px`)}}},onSettingUpdate(){this.applyStyles(),this.handleGameChat()},createDisplay(){this.element=document.createElement("div"),this.element.className="serenity-chat-container",this.element.style.zIndex=5,document.body.appendChild(this.element);let e=document.createElement("div");e.className="serenity-chat-messages",this.element.appendChild(e),this.createCustomInput()},createCustomInput(){let e=document.createElement("div");e.className="serenity-chat-input-wrapper",this.customInput=document.createElement("input"),this.customInput.type="text",this.customInput.className="serenity-chat-input",this.customInput.placeholder="Send a message...",this.customInput.addEventListener("keydown",t=>{if(t.key==="Enter"){let i=document.querySelector(".ChatInput");if(i&&this.customInput.value){i.value=this.customInput.value;let n=new KeyboardEvent("keydown",{key:"Enter",code:"Enter",which:13,keyCode:13,bubbles:!0});i.dispatchEvent(n),this.customInput.value=""}}}),e.appendChild(this.customInput),this.element.appendChild(e)},syncInputVisibility(e){let t=this.element.querySelector(".serenity-chat-input-wrapper");e.style.display==="none"?t.style.display="none":(t.style.display="flex",setTimeout(()=>this.customInput.focus(),0))},destroyDisplay(){this.element&&(document.body.removeChild(this.element),this.element=null)},handleGameChat(){let e=document.querySelector(".Chat");if(!e){this.chatObserver&&(this.chatObserver.disconnect(),this.chatObserver=null),this.gameChat=null;return}this.gameChat!==e&&(this.chatObserver&&(this.chatObserver.disconnect(),this.chatObserver=null),this.gameChat=e,this.element&&(this.element.querySelector(".serenity-chat-messages").innerHTML=""));let t=this.settings.find(o=>o.id==="hide-game-chat").value;this.gameChat.style.visibility=t?"hidden":"visible",this.gameChat.style.pointerEvents=t?"none":"auto";let i=e.querySelector(".ChatMessages");i&&!this.chatObserver&&(this.element.querySelector(".serenity-chat-messages").innerHTML="",i.querySelectorAll(".MessageWrapper").forEach(o=>this.addMessage(o)),this.chatObserver=new MutationObserver(o=>{o.forEach(s=>{s.addedNodes.length&&s.addedNodes.forEach(r=>{r.nodeType===1&&r.classList.contains("MessageWrapper")&&this.addMessage(r)})})}),this.chatObserver.observe(i,{childList:!0}));let n=e.querySelector(".ChatInputWrapper");n&&this.syncInputVisibility(n)},restoreGameChat(){this.gameChat&&(this.gameChat.style.visibility="visible",this.gameChat.style.pointerEvents="auto")},addMessage(e){if(!this.element)return;let t=this.element.querySelector(".serenity-chat-messages"),i=document.createElement("div");i.className="serenity-chat-message";let n=document.createElement("div");n.className="serenity-message-content";let o=k();if(e.querySelectorAll(".IndividualText").forEach(r=>{let a=r.cloneNode(!0);o&&a.textContent===o&&a.classList.add("serenity-message-own-name"),/^\[.*\]$/.test(a.textContent)&&a.classList.add("serenity-message-tag"),n.appendChild(a)}),i.appendChild(n),this.settings.find(r=>r.id==="show-timestamps").value){let r=document.createElement("span");r.className="serenity-message-timestamp",r.textContent=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),i.insertBefore(r,n)}t.appendChild(i);let s=this.settings.find(r=>r.id==="max-messages").value;for(;t.children.length>s;)t.removeChild(t.firstChild)},applyStyles(){if(!this.element)return;let e=this.settings.reduce((t,i)=>({...t,[i.id]:i.value}),{});this.element.style.setProperty("--chat-font-size",`${e["font-size"]}px`)}},F=ve;var xe={name:"Keystrokes",category:"Combat",description:"Displays your keystrokes with a sexy, modern look.",enabled:!0,defaultX:8,defaultY:562,element:null,keys:{w:!1,a:!1,s:!1,d:!1," ":!1,lmb:!1,rmb:!1},boundKeyDown:null,boundKeyUp:null,boundMouseDown:null,boundMouseUp:null,settings:[{id:"show-mouse",name:"Show Mouse Buttons",type:"boolean",value:!0},{id:"scale",name:"Scale",type:"slider",value:1,min:.5,max:2,step:.1},{id:"opacity",name:"Opacity",type:"slider",value:.85,min:0,max:1,step:.05},{id:"enable-animations",name:"Enable Animations",type:"boolean",value:!0}],onEnable(){this.createDisplay(),this.applyStyles(),this.boundKeyDown=e=>this.updateKeyState(e.key.toLowerCase(),!0),this.boundKeyUp=e=>this.updateKeyState(e.key.toLowerCase(),!1),this.boundMouseDown=e=>{e.button===0&&this.updateKeyState("lmb",!0),e.button===2&&this.updateKeyState("rmb",!0)},this.boundMouseUp=e=>{e.button===0&&this.updateKeyState("lmb",!1),e.button===2&&this.updateKeyState("rmb",!1)},window.addEventListener("keydown",this.boundKeyDown),window.addEventListener("keyup",this.boundKeyUp),window.addEventListener("mousedown",this.boundMouseDown),window.addEventListener("mouseup",this.boundMouseUp)},onDisable(){this.destroyDisplay(),window.removeEventListener("keydown",this.boundKeyDown),window.removeEventListener("keyup",this.boundKeyUp),window.removeEventListener("mousedown",this.boundMouseDown),window.removeEventListener("mouseup",this.boundMouseUp)},onTick(){this.updateDisplayLocation()},onSettingUpdate(){this.applyStyles()},updateKeyState(e,t){this.keys.hasOwnProperty(e)&&(this.keys[e]=t,this.updateKeyVisuals())},createKey(e,t,...i){let n=document.createElement("div");return n.className=`keystrokes-key key-${t} ${i.join(" ")}`,n.textContent=e,n},createDisplay(){this.element=document.createElement("div"),this.element.className="keystrokes-display";let e=document.createElement("div");e.className="keystrokes-row",e.appendChild(this.createKey("W","w")),this.element.appendChild(e);let t=document.createElement("div");t.className="keystrokes-row",t.appendChild(this.createKey("A","a")),t.appendChild(this.createKey("S","s")),t.appendChild(this.createKey("D","d")),this.element.appendChild(t);let i=document.createElement("div");i.className="keystrokes-row mouse-row",i.appendChild(this.createKey("LMB","lmb","mouse-button")),i.appendChild(this.createKey("RMB","rmb","mouse-button")),this.element.appendChild(i);let n=document.createElement("div");n.className="keystrokes-row",n.appendChild(this.createKey("Space"," ","space-key")),this.element.appendChild(n),document.body.appendChild(this.element)},destroyDisplay(){this.element&&(document.body.removeChild(this.element),this.element=null)},updateDisplayLocation(){if(!this.element)return;let e=window.Serenity.instance.get("ClickGUI");if(!e||!e.isEditingHUD){let t=window.Serenity.instance.get(this.name);t.x!==null&&(this.element.style.left=`${t.x}px`),t.y!==null&&(this.element.style.top=`${t.y}px`)}},updateKeyVisuals(){if(this.element)for(let e in this.keys){let t=this.element.querySelector(`.key-${e}`);t&&t.classList.toggle("active",this.keys[e])}},applyStyles(){if(!this.element)return;let e=this.settings.reduce((t,i)=>({...t,[i.id]:i.value}),{});this.element.style.transform=`scale(${e.scale})`,this.element.style.opacity=e.opacity,this.element.classList.toggle("show-mouse",e["show-mouse"]),this.element.classList.toggle("no-animations",!e["enable-animations"])}},O=xe;var we={name:"ToggleSprint",category:"Movement",description:"Automatically sprints for you by simulating a Shift key press.",enabled:!0,sprinting:!1,sprintInterval:null,element:null,defaultX:"80%",defaultY:"80%",settings:[{id:"show-text",name:"Show Text",type:"boolean",value:!0},{id:"color-mode",name:"Color Mode",type:"select",options:["Theme","Custom"],value:"Theme",condition:e=>e["show-text"]},{id:"hud-text",name:"HUD Text",type:"text",value:"[Sprinting (Toggled)]",condition:e=>e["show-text"]},{id:"bg-color",name:"Background Color",type:"color",value:"rgba(30, 33, 41, 0.85)",condition:e=>e["show-text"]&&e["color-mode"]==="Custom"},{id:"text-color",name:"Text Color",type:"color",value:"rgba(234, 234, 234, 0.8)",condition:e=>e["show-text"]&&e["color-mode"]==="Custom"},{id:"font-size",name:"Font Size",type:"slider",value:16,min:8,max:24,step:1,condition:e=>e["show-text"]},{id:"padding",name:"Padding",type:"slider",value:8,min:0,max:20,step:1,condition:e=>e["show-text"]},{id:"border-radius",name:"Border Radius",type:"slider",value:10,min:0,max:20,step:1,condition:e=>e["show-text"]},{id:"border-width",name:"Border Width",type:"slider",value:1,min:0,max:5,step:1,condition:e=>e["show-text"]},{id:"border-color",name:"Border Color",type:"color",value:"rgba(255, 255, 255, 0.07)",condition:e=>e["show-text"]&&e["color-mode"]==="Custom"}],onEnable(){this.createDisplay()},onDisable(){this.sprinting&&this.stopSprinting(),this.destroyDisplay()},onTick(){let e=window.Serenity.instance.get("ClickGUI"),i=!(document.activeElement&&(["INPUT","TEXTAREA"].includes(document.activeElement.tagName)||document.activeElement.isContentEditable))&&(!e||!e.isGuiOpen);i&&!this.sprinting?this.startSprinting():!i&&this.sprinting&&this.stopSprinting(),i&&this.sprinting&&this.fireKeyDown(),this.updateDisplay()},onSettingUpdate(){this.applyStyles(),this.updateDisplay(!0)},startSprinting(){this.sprinting||(this.sprinting=!0,this.fireKeyDown(),this.sprintInterval=setInterval(()=>this.fireKeyDown(),200))},stopSprinting(){this.sprinting&&(this.sprinting=!1,this.sprintInterval&&(clearInterval(this.sprintInterval),this.sprintInterval=null),window.dispatchEvent(new KeyboardEvent("keyup",{key:"Shift",keyCode:16,code:"ShiftLeft",bubbles:!0})))},fireKeyDown(){window.dispatchEvent(new KeyboardEvent("keydown",{key:"Shift",keyCode:16,code:"ShiftLeft",bubbles:!0,repeat:!0}))},createDisplay(){this.element=document.createElement("div"),this.element.className="togglesprint-hud-display",document.body.appendChild(this.element),this.applyStyles()},destroyDisplay(){this.element&&(document.body.removeChild(this.element),this.element=null)},updateDisplay(){let e=this.settings.reduce((t,i)=>({...t,[i.id]:i.value}),{});if(!e["show-text"]){this.element&&(this.element.style.display="none");return}if(this.element||this.createDisplay(),this.element.style.display=this.enabled?"block":"none",this.enabled){this.element.textContent=e["hud-text"];let t=window.Serenity.instance.get("ClickGUI");if(!t||!t.isEditingHUD){let i=window.Serenity.instance.get(this.name);i.x!==null&&(this.element.style.left=typeof i.x=="string"?i.x:`${i.x}px`),i.y!==null&&(this.element.style.top=typeof i.y=="string"?i.y:`${i.y}px`)}}},applyStyles(){if(!this.element)return;let e=this.settings.reduce((t,i)=>({...t,[i.id]:i.value}),{});e["color-mode"]==="Theme"?(this.element.style.backgroundColor="var(--panel)",this.element.style.color="var(--text)",this.element.style.border=`${e["border-width"]}px solid var(--border)`):(this.element.style.backgroundColor=e["bg-color"],this.element.style.color=e["text-color"],this.element.style.border=`${e["border-width"]}px solid ${e["border-color"]}`),this.element.style.fontSize=`${e["font-size"]}px`,this.element.style.padding=`${e.padding}px`,this.element.style.borderRadius=`${e["border-radius"]}px`,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.style.pointerEvents="none",this.element.style.zIndex=5}},R=we;var Ce={name:"ArmorHUD",category:"Player",description:"Displays your currently equipped armor and selected item.",enabled:!1,observer:null,defaultX:"90%",defaultY:"50%",settings:[{id:"color-mode",name:"Color Mode",type:"select",options:["Theme","Custom"],value:"Theme"},{id:"show-selected",name:"Show Selected Item",type:"boolean",value:!0},{id:"display-style",name:"Display Style",type:"select",options:["Horizontal","Vertical"],value:"Vertical"},{id:"bg-color",name:"Background Color",type:"color",value:"rgba(30, 33, 41, 0.85)",condition:e=>e["color-mode"]==="Custom"},{id:"padding",name:"Padding",type:"slider",value:4,min:0,max:20,step:1},{id:"border-radius",name:"Border Radius",type:"slider",value:20,min:0,max:20,step:1},{id:"border-width",name:"Border Width",type:"slider",value:2,min:0,max:5,step:1},{id:"border-color",name:"Border Color",type:"color",value:"rgba(255, 255, 255, 0.07)",condition:e=>e["color-mode"]==="Custom"},{id:"item-size",name:"Item Size",type:"slider",value:64,min:16,max:64,step:1},{id:"item-spacing",name:"Item Spacing",type:"slider",value:0,min:0,max:20,step:1}],element:null,onEnable(){this.createDisplay(),this.applyStyles(),this.setupObserver()},onDisable(){this.observer&&(this.observer.disconnect(),this.observer=null),this.destroyDisplay()},onTick(){this.updateDisplay()},onSettingUpdate(){this.applyStyles(),this.updateDisplay(!0)},setupObserver(){let e=()=>{let t=document.querySelector(".HotBarGameItemsContainer");t&&!this.observer?(this.observer=new MutationObserver(i=>{i.some(o=>o.type==="attributes"&&o.attributeName==="class"&&o.target.classList.contains("InvenItem"))&&this.updateDisplay(!0)}),this.observer.observe(t,{attributes:!0,subtree:!0,attributeFilter:["class"]}),this.updateDisplay(!0)):t||setTimeout(e,500)};e()},createDisplay(){this.element=document.createElement("div"),this.element.className="armor-hud-display",document.body.appendChild(this.element)},destroyDisplay(){this.element&&(document.body.removeChild(this.element),this.element=null)},extractImage(e){if(!e)return null;let t=e.querySelector(".TwoDImageIcon");if(t){if(t.style.backgroundImage&&t.style.backgroundImage!=="none")return{type:"image",src:t.style.backgroundImage.slice(5,-2),filter:null};let o=e.querySelector(".TwoDItemGrayscaleVisiblePng"),s=e.querySelector(".TwoDItemGrayscale");if(o)return{type:"image",src:o.src,filter:s?s.style.filter:""}}let i=e.querySelector(".BlockItem");if(i&&i.style.backgroundImage&&i.style.backgroundImage!=="none")return{type:"image",src:i.style.backgroundImage.slice(5,-2),filter:null};let n=e.querySelector(".InvenItemUnfilled");return n?{type:"unfilled",src:n.style.backgroundImage.slice(5,-2)}:null},updateDisplay(e=!1){if(!this.element)return;let t=window.Serenity.instance.get("ClickGUI");if(!t||!t.isEditingHUD){let l=window.Serenity.instance.get(this.name);l.x!==null&&(this.element.style.left=typeof l.x=="string"?l.x:`${l.x}px`),l.y!==null&&(this.element.style.top=typeof l.y=="string"?l.y:`${l.y}px`)}let i=document.querySelector(".ArmourItemSlots"),o=(i?Array.from(i.querySelectorAll(".InvenItem")):[]).map(l=>this.extractImage(l)).filter(Boolean),r=window.Serenity.instance.get(this.name).settings.find(l=>l.id==="show-selected").value,a=[...o];if(r){let l=document.querySelector(".HotBarGameItemsContainer .InvenItem.Selected"),c=this.extractImage(l);c&&a.push(c)}let d=JSON.stringify(a);(d!==this.lastContentHash||e)&&(this.element.innerHTML="",a.forEach(l=>{if(!l)return;let c=document.createElement("div");if(c.style.position="relative",l.type==="image"&&l.filter){let p=this.settings.find(g=>g.id==="item-size").value,u=document.createElement("div");u.style.position="absolute",u.style.width="100%",u.style.height="100%",u.style.overflow="hidden";let h=document.createElement("img");h.src=l.src,h.style.width="100%",h.style.height="100%",h.style.imageRendering="pixelated",h.style.filter=l.filter.replace("1em",`${p}px`),h.style.marginLeft=`-${p}px`,u.appendChild(h),c.appendChild(u);let m=document.createElement("img");m.src=l.src,m.style.position="absolute",m.style.width="100%",m.style.height="100%",m.style.imageRendering="pixelated",m.style.mixBlendMode="multiply",c.appendChild(m)}else{let p=document.createElement("img");p.src=l.src,p.style.width="100%",p.style.height="100%",p.style.imageRendering="pixelated",c.appendChild(p)}this.element.appendChild(c)}),this.lastContentHash=d,this.applyStyles())},applyStyles(){if(!this.element)return;let e=this.settings.reduce((n,o)=>({...n,[o.id]:o.value}),{});e["color-mode"]==="Theme"?(this.element.style.backgroundColor="var(--panel)",this.element.style.border=`${e["border-width"]}px solid var(--border)`):(this.element.style.backgroundColor=e["bg-color"],this.element.style.border=`${e["border-width"]}px solid ${e["border-color"]}`),this.element.style.padding=`${e.padding}px`,this.element.style.borderRadius=`${e["border-radius"]}px`,this.element.style.display="flex",this.element.style.flexDirection=e["display-style"]==="Horizontal"?"row":"column",this.element.style.gap=`${e["item-spacing"]}px`,this.element.style.position="absolute",this.element.style.userSelect="none";let t=window.Serenity.instance.get("ClickGUI");(!t||!t.isEditingHUD)&&(this.element.style.zIndex=5),this.element.style.pointerEvents="none",this.element.querySelectorAll(".armor-hud-display > div").forEach(n=>{n.style.width=`${e["item-size"]}px`,n.style.height=`${e["item-size"]}px`})}},V=Ce;var K={name:"Coordinates",category:"Utility",description:"Displays your in-game X, Y, Z coordinates as customizable text.",enabled:!1,defaultX:408,defaultY:11,element:null,originalFillText:null,sourceCanvas:null,capturedTexts:[],lastCaptureTime:0,coordinates:{x:"0.00",y:"0.00",z:"0.00"},settings:[{id:"color-mode",name:"Color Mode",type:"select",options:["Theme","Custom"],value:"Theme"},{id:"bg-color",name:"Background Color",type:"color",value:"rgba(30, 33, 41, 0.85)",condition:e=>e["color-mode"]==="Custom"},{id:"text-color",name:"Text Color",type:"color",value:"#EAEAEA",condition:e=>e["color-mode"]==="Custom"},{id:"font-size",name:"Font Size",type:"slider",value:14,min:8,max:24,step:1},{id:"padding",name:"Padding",type:"slider",value:8,min:0,max:30,step:1},{id:"border-width",name:"Border Width",type:"slider",value:1,min:0,max:5,step:1},{id:"border-color",name:"Border Color",type:"color",value:"rgba(255, 255, 255, 0.07)",condition:e=>e["color-mode"]==="Custom"},{id:"border-radius",name:"Border Radius",type:"slider",value:10,min:0,max:20,step:1},{id:"opacity",name:"Opacity",type:"slider",value:1,min:0,max:1,step:.05},{id:"scale",name:"Scale",type:"slider",value:1,min:.5,max:2,step:.1},{id:"format",name:"Text Format",type:"text",value:"X: {x} Y: {y} Z: {z}",description:"Use {x}, {y}, and {z} as placeholders."},{id:"hide-original",name:"Hide Original Display",type:"boolean",value:!0,description:"Prevents the game from drawing its own coordinates."}],onEnable(){localStorage.setItem("bloxd-showCoordinates","true"),this.createDisplay(),this.applyStyles()},onDisable(){this.unpatchCanvas(),this.element&&(document.body.removeChild(this.element),this.element=null)},onTick(){let e=document.querySelector(".CoordinateCanvas");if(!e){this.sourceCanvas&&(this.unpatchCanvas(),this.sourceCanvas=null);return}e!==this.sourceCanvas&&(this.sourceCanvas&&this.unpatchCanvas(),this.sourceCanvas=e,this.patchCanvas())},onFrame(){this.updatePosition()},onSettingUpdate(){this.applyStyles(),this.updateDisplay()},patchCanvas(){if(!this.sourceCanvas||this.sourceCanvas._serenityCoordsPatched)return;let e=this.sourceCanvas.getContext("2d");if(!e||e.fillText._isSerenityCoordsWrapper)return;this.originalFillText=e.fillText;let t=this;e.fillText=function(i,n,o,s){let r=performance.now();r-t.lastCaptureTime>100&&(t.capturedTexts=[]),t.lastCaptureTime=r,/^-?\d+\.\d{2}$/.test(i)&&(t.capturedTexts.push(i),t.capturedTexts.length===3&&(t.coordinates={x:t.capturedTexts[0],y:t.capturedTexts[1],z:t.capturedTexts[2]},t.updateDisplay(),t.capturedTexts=[])),!(t.settings.reduce((d,l)=>({...d,[l.id]:l.value}),{})["hide-original"]&&/^-?\d+\.\d{2}$/.test(i))&&t.originalFillText.apply(this,arguments)},e.fillText._isSerenityCoordsWrapper=!0,this.sourceCanvas._serenityCoordsPatched=!0},unpatchCanvas(){if(this.sourceCanvas&&this.originalFillText){try{let e=this.sourceCanvas.getContext("2d");e&&e.fillText._isSerenityCoordsWrapper&&(e.fillText=this.originalFillText,delete e.fillText._isSerenityCoordsWrapper)}catch{}this.originalFillText=null,this.sourceCanvas&&(this.sourceCanvas._serenityCoordsPatched=!1)}},createDisplay(){this.element||(this.element=document.createElement("div"),document.body.appendChild(this.element),this.updateDisplay())},updateDisplay(){if(!this.element)return;let e=this.settings.reduce((t,i)=>({...t,[i.id]:i.value}),{});this.element.textContent=e.format.replace("{x}",this.coordinates.x).replace("{y}",this.coordinates.y).replace("{z}",this.coordinates.z)},updatePosition(){if(!this.element)return;let e=window.Serenity.instance.get("ClickGUI");if(!e||!e.isEditingHUD){let t=window.Serenity.instance.get(this.name);t.x!==null&&(this.element.style.left=`${t.x}px`),t.y!==null&&(this.element.style.top=`${t.y}px`)}},applyStyles(){if(!this.element)return;let e=this.settings.reduce((t,i)=>({...t,[i.id]:i.value}),{});this.element.style.position="absolute",this.element.style.zIndex=5,this.element.style.pointerEvents="none",this.element.style.userSelect="none",e["color-mode"]==="Theme"?(this.element.style.backgroundColor="var(--panel)",this.element.style.color="var(--text)",this.element.style.border=`${e["border-width"]}px solid var(--border)`):(this.element.style.backgroundColor=e["bg-color"],this.element.style.color=e["text-color"],this.element.style.border=`${e["border-width"]}px solid ${e["border-color"]}`),this.element.style.padding=`${e.padding}px`,this.element.style.borderRadius=`${e["border-radius"]}px`,this.element.style.transform=`scale(${e.scale})`,this.element.style.opacity=e.opacity,this.element.style.fontSize=`${e["font-size"]}px`,this.element.style.fontFamily="'Inter', 'Segoe UI', sans-serif",this.element.style.fontWeight="600",this.element.style.whiteSpace="nowrap"}};var ke={name:"CPSCounter",category:"Player",description:"Displays your clicks per second.",enabled:!1,defaultX:724,defaultY:726,settings:[{id:"color-mode",name:"Color Mode",type:"select",options:["Theme","Custom"],value:"Theme"},{id:"bg-color",name:"Background Color",type:"color",value:"rgba(30, 33, 41, 0.85)",condition:e=>e["color-mode"]==="Custom"},{id:"text-color",name:"Text Color",type:"color",value:"#EAEAEA",condition:e=>e["color-mode"]==="Custom"},{id:"font-size",name:"Font Size",type:"slider",value:14,min:8,max:24,step:1},{id:"padding",name:"Padding",type:"slider",value:8,min:0,max:20,step:1},{id:"border-radius",name:"Border Radius",type:"slider",value:10,min:0,max:20,step:1},{id:"border-width",name:"Border Width",type:"slider",value:1,min:0,max:5,step:1},{id:"border-color",name:"Border Color",type:"color",value:"rgba(255, 255, 255, 0.07)",condition:e=>e["color-mode"]==="Custom"},{id:"show-label",name:"Show Label",type:"boolean",value:!0},{id:"show-lmb",name:"Show LMB",type:"boolean",value:!0},{id:"show-rmb",name:"Show RMB",type:"boolean",value:!0},{id:"format",name:"Text Format",type:"text",value:"{label} {lmb} | {rmb}",description:"Use {label}, {lmb}, and {rmb} as placeholders."}],leftClicks:[],rightClicks:[],element:null,onEnable(){this.createDisplay(),this.applyStyles(),document.addEventListener("mousedown",this.handleMouseDown.bind(this))},onDisable(){this.destroyDisplay(),document.removeEventListener("mousedown",this.handleMouseDown.bind(this))},onTick(){let e=performance.now();this.leftClicks=this.leftClicks.filter(t=>e-t<1e3),this.rightClicks=this.rightClicks.filter(t=>e-t<1e3),this.updateDisplay()},onSettingUpdate(){this.applyStyles(),this.updateDisplay()},handleMouseDown(e){e.button===0?this.leftClicks.push(performance.now()):e.button===2&&this.rightClicks.push(performance.now())},createDisplay(){this.element=document.createElement("div"),this.element.className="cps-counter-display",document.body.appendChild(this.element)},destroyDisplay(){this.element&&(document.body.removeChild(this.element),this.element=null)},updateDisplay(){if(this.element){let e=window.Serenity.instance.get("ClickGUI");if(!e||!e.isEditingHUD){let n=window.Serenity.instance.get(this.name);n.x!==null&&(this.element.style.left=`${n.x}px`),n.y!==null&&(this.element.style.top=`${n.y}px`)}let t=this.settings.reduce((n,o)=>({...n,[o.id]:o.value}),{}),i=t.format;t["show-label"]?i=i.replace("{label}","CPS:"):i=i.replace("{label}",""),t["show-lmb"]?i=i.replace("{lmb}",this.leftClicks.length):i=i.replace("{lmb}",""),t["show-rmb"]?i=i.replace("{rmb}",this.rightClicks.length):i=i.replace("{rmb}",""),this.element.textContent=i.trim().replace(/\|/g,(n,o,s)=>{let r=s[o-1],a=s[o+1];return r&&r.trim()===""&&a&&a.trim()===""?"|":!r||r.trim()===""||!a||a.trim()===""?"":n}).trim()}},applyStyles(){if(!this.element)return;let e=this.settings.reduce((t,i)=>({...t,[i.id]:i.value}),{});e["color-mode"]==="Theme"?(this.element.style.backgroundColor="var(--panel)",this.element.style.color="var(--text)",this.element.style.border=`${e["border-width"]}px solid var(--border)`):(this.element.style.backgroundColor=e["bg-color"],this.element.style.color=e["text-color"],this.element.style.border=`${e["border-width"]}px solid ${e["border-color"]}`),this.element.style.fontSize=`${e["font-size"]}px`,this.element.style.padding=`${e.padding}px`,this.element.style.borderRadius=`${e["border-radius"]}px`,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.style.zIndex=5,this.element.style.pointerEvents="none"}},j=ke;var Se={name:"PingCounter",category:"Player",description:"Displays your network ping.",enabled:!1,defaultX:724,defaultY:726,settings:[{id:"color-mode",name:"Color Mode",type:"select",options:["Theme","Custom"],value:"Theme"},{id:"bg-color",name:"Background Color",type:"color",value:"rgba(30, 33, 41, 0.85)",condition:e=>e["color-mode"]==="Custom"},{id:"text-color",name:"Text Color",type:"color",value:"#EAEAEA",condition:e=>e["color-mode"]==="Custom"},{id:"font-size",name:"Font Size",type:"slider",value:14,min:8,max:24,step:1},{id:"padding",name:"Padding",type:"slider",value:8,min:0,max:20,step:1},{id:"border-radius",name:"Border Radius",type:"slider",value:10,min:0,max:20,step:1},{id:"border-width",name:"Border Width",type:"slider",value:1,min:0,max:5,step:1},{id:"border-color",name:"Border Color",type:"color",value:"rgba(255, 255, 255, 0.07)",condition:e=>e["color-mode"]==="Custom"},{id:"show-label",name:"Show Label",type:"boolean",value:!0},{id:"format",name:"Text Format",type:"text",value:"{label} {ping}ms",description:"Use {label} and {ping} as placeholders."},{id:"mod-credit",name:"Mod Made by GEORGECR and Casmyx",type:"info"}],ping:"--",element:null,pingIntervalId:null,onEnable(){this.createDisplay(),this.applyStyles(),this.updatePing(),this.pingIntervalId=setInterval(this.updatePing.bind(this),2e3)},onDisable(){this.destroyDisplay(),clearInterval(this.pingIntervalId)},onTick(){this.updateDisplay()},onSettingUpdate(){this.applyStyles(),this.updateDisplay()},createDisplay(){this.element=document.createElement("div"),this.element.className="ping-counter-display",document.body.appendChild(this.element)},destroyDisplay(){this.element&&(document.body.removeChild(this.element),this.element=null)},updatePing(){let e=Date.now();fetch(window.location.origin,{method:"HEAD",mode:"no-cors"}).then(()=>{this.ping=Date.now()-e}).catch(()=>{this.ping="--"})},updateDisplay(){if(this.element){let e=window.Serenity.instance.get("ClickGUI");if(!e||!e.isEditingHUD){let n=window.Serenity.instance.get(this.name);n.x!==null&&(this.element.style.left=`${n.x}px`),n.y!==null&&(this.element.style.top=`${n.y}px`)}let t=this.settings.reduce((n,o)=>({...n,[o.id]:o.value}),{}),i=t.format;i=i.replace("{label}",t["show-label"]?"Ping:":""),i=i.replace("{ping}",this.ping),this.element.textContent=i.trim()}},applyStyles(){if(!this.element)return;let e=this.settings.reduce((t,i)=>({...t,[i.id]:i.value}),{});e["color-mode"]==="Theme"?(this.element.style.backgroundColor="var(--panel)",this.element.style.color="var(--text)",this.element.style.border=`${e["border-width"]}px solid var(--border)`):(this.element.style.backgroundColor=e["bg-color"],this.element.style.color=e["text-color"],this.element.style.border=`${e["border-width"]}px solid ${e["border-color"]}`),this.element.style.fontSize=`${e["font-size"]}px`,this.element.style.padding=`${e.padding}px`,this.element.style.borderRadius=`${e["border-radius"]}px`,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.style.zIndex=5,this.element.style.pointerEvents="none"}},X=Se;var Ee={name:"FPSBooster",category:"Utility",description:"Optimizes game performance by adjusting resolution and other settings.",enabled:!1,canvas:null,settings:[{id:"resolutionScale",name:"Resolution Scale",description:"Lower values can improve performance at the cost of quality.",type:"slider",value:1,min:.1,max:1,step:.05}],onEnable(e){if(this.canvas=document.getElementById("noa-canvas"),!this.canvas){e.disable(this.name);return}this.canvas.dataset.originalWidth||(this.canvas.dataset.originalWidth=this.canvas.width,this.canvas.dataset.originalHeight=this.canvas.height)},onDisable(e){this.canvas&&this.canvas.dataset.originalWidth&&(this.canvas.width=parseInt(this.canvas.dataset.originalWidth,10),this.canvas.height=parseInt(this.canvas.dataset.originalHeight,10),delete this.canvas.dataset.originalWidth,delete this.canvas.dataset.originalHeight),this.canvas&&(this.canvas.style.width="",this.canvas.style.height=""),this.canvas=null},onSettingUpdate(e,t,i){},onTick(e,t){this.canvas&&this.enabled&&this.applySettings(t)},applySettings(e){if(!this.canvas||!this.canvas.dataset.originalWidth)return;let i=e.get(this.name).settings.find(a=>a.id==="resolutionScale").value,n=parseInt(this.canvas.dataset.originalWidth,10),o=parseInt(this.canvas.dataset.originalHeight,10),s=Math.round(n*i),r=Math.round(o*i);this.canvas.width!==s&&(this.canvas.width=s),this.canvas.height!==r&&(this.canvas.height=r),this.canvas.style.width!=="100%"&&(this.canvas.style.width="100%"),this.canvas.style.height!=="100%"&&(this.canvas.style.height="100%")}},Y=Ee;var Me={name:"AdBlocker",category:"Utility",description:"Blocks in-game ads and trackers by hiding elements and intercepting network requests.",enabled:!0,settings:[{id:"hide-page-ads",name:"Hide In-Page Ads",type:"boolean",value:!0,description:"Hides visible ad containers and popups."},{id:"block-network-ads",name:"Block Ad Network Requests",type:"boolean",value:!0,description:"Prevents the browser from requesting ads from known ad servers."}],originalFetch:window.fetch,originalXhrOpen:window.XMLHttpRequest.prototype.open,originalXhrSend:window.XMLHttpRequest.prototype.send,observer:null,adSelectors:[".SuperRankAdContainer",".AdBannerContainer",".PlaywireVideoWrapper",".UiRequests",".AdBanner",".GenericVideoWrapper","#bloxd-io_300x600_2",".InventoryAdOuter"],blockList:["googlesyndication.com","googletagservices.com","google-analytics.com","doubleclick.net","adinplay.com","playwire.com","amazon-adsystem.com","adnxs.com"],onEnable(){this.applySettings()},onDisable(){this.unpatchNetworkRequests(),this.observer&&(this.observer.disconnect(),this.observer=null)},onSettingUpdate(){this.applySettings()},applySettings(){let e=this.settings.reduce((t,i)=>({...t,[i.id]:i.value}),{});e["block-network-ads"]?this.patchNetworkRequests():this.unpatchNetworkRequests(),e["hide-page-ads"]?(this.hidePageAds(),this.setupObserver()):this.observer&&(this.observer.disconnect(),this.observer=null)},isBlocked(e){return this.blockList.some(t=>e.includes(t))},patchNetworkRequests(){let e=this;window.fetch=function(t,i){let n=typeof t=="string"?t:t.url;return e.isBlocked(n)?Promise.resolve(new Response(null,{status:204,statusText:"No Content"})):e.originalFetch.apply(this,arguments)},window.XMLHttpRequest.prototype.open=function(t,i){e.isBlocked(i)?this._isBlocked=!0:delete this._isBlocked,e.originalXhrOpen.apply(this,arguments)},window.XMLHttpRequest.prototype.send=function(){this._isBlocked||e.originalXhrSend.apply(this,arguments)}},unpatchNetworkRequests(){window.fetch=this.originalFetch,window.XMLHttpRequest.prototype.open=this.originalXhrOpen,window.XMLHttpRequest.prototype.send=this.originalXhrSend},hideElement(e){e.style.opacity!=="0"&&(e.style.opacity="0",e.style.pointerEvents="none")},hidePageAds(){this.adSelectors.forEach(e=>{document.querySelectorAll(e).forEach(t=>this.hideElement(t))})},setupObserver(){this.observer||(this.observer=new MutationObserver(e=>{for(let t of e)for(let i of t.addedNodes)i.nodeType===Node.ELEMENT_NODE&&this.adSelectors.forEach(n=>{i.matches(n)&&this.hideElement(i),i.querySelectorAll(n).forEach(o=>this.hideElement(o))})}),this.observer.observe(document.documentElement,{childList:!0,subtree:!0}))}},_=Me;var S="loglevel",D=class{static save(t){try{let i=JSON.stringify(t),n=btoa(i);localStorage.setItem(S,n)}catch{}}static load(){try{let t=localStorage.getItem(S);if(!t)return null;let i=atob(t);return JSON.parse(i)}catch{return localStorage.removeItem(S),null}}static reset(){try{localStorage.removeItem(S)}catch{}}},E=D;var Ie={name:"Crosshair",category:"Visual",description:"Replaces the default game crosshair with a custom one.",enabled:!1,element:null,gameCrosshair:null,gameCrosshairInitialDisplay:null,observer:null,settings:[{id:"hide-original",name:"Hide Original Crosshair",type:"boolean",value:!0},{id:"mode",name:"Mode",type:"select",value:"Cross",options:["Cross","Plus","Dot","Circle","T-Shape","Arrow","Custom Image"]},{id:"color-mode",name:"Color Mode",type:"select",options:["Theme","Custom"],value:"Theme",condition:e=>e.mode!=="Custom Image"},{id:"image-url",name:"Image URL",type:"text",value:"https://i.imgur.com/M8M4G3k.png",condition:e=>e.mode==="Custom Image"},{id:"size",name:"Size",type:"slider",value:12,min:1,max:100,step:1},{id:"color",name:"Color",type:"color",value:"#FFFFFF",condition:e=>e.mode!=="Custom Image"&&e["color-mode"]==="Custom"},{id:"thickness",name:"Thickness",type:"slider",value:2,min:1,max:20,step:1,condition:e=>["Cross","Plus","Circle","T-Shape"].includes(e.mode)},{id:"outline",name:"Outline",type:"boolean",value:!0,condition:e=>e.mode!=="Custom Image"},{id:"outline-color",name:"Outline Color",type:"color",value:"#000000",condition:e=>e.outline&&e.mode!=="Custom Image"&&e["color-mode"]==="Custom"}],onEnable(){this.createDisplay(),this.updateCrosshair(),this.handleGameCrosshair(),this.observer=new MutationObserver(()=>this.handleGameCrosshair()),this.observer.observe(document.body,{childList:!0,subtree:!0})},onDisable(){this.observer&&(this.observer.disconnect(),this.observer=null),this.destroyDisplay(),this.restoreGameCrosshair(),this.gameCrosshair=null,this.gameCrosshairInitialDisplay=null},onSettingUpdate(e){this.updateCrosshair(),e==="hide-original"&&this.handleGameCrosshair()},createDisplay(){this.element||(this.element=document.createElement("div"),this.element.className="serenity-crosshair",this.element.style.position="fixed",this.element.style.top="50%",this.element.style.left="50%",this.element.style.transform="translate(-50%, -50%)",this.element.style.pointerEvents="none",this.element.style.zIndex="9999",document.body.appendChild(this.element))},destroyDisplay(){this.element&&(document.body.removeChild(this.element),this.element=null)},handleGameCrosshair(){let e=this.settings.find(i=>i.id==="hide-original").value,t=document.querySelector(".CrossHair");e?t&&(this.gameCrosshair!==t&&(this.gameCrosshair=t,this.gameCrosshairInitialDisplay=t.style.display),this.gameCrosshair.style.display="none"):this.restoreGameCrosshair()},restoreGameCrosshair(){this.gameCrosshair&&(this.gameCrosshair.style.display=this.gameCrosshairInitialDisplay||"")},updateCrosshair(){if(!this.element)return;this.element.innerHTML="";let e=this.settings.reduce((c,p)=>({...c,[p.id]:p.value}),{}),{mode:t,size:i,color:n,thickness:o,outline:s,"outline-color":r,"image-url":a,"color-mode":d}=e;d==="Theme"&&t!=="Custom Image"&&(n=getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(),r="#000000");let l=s?`0px 0px 2px ${r}, 0px 0px 2px ${r}, 0px 0px 2px ${r}, 0px 0px 2px ${r}`:"none";switch(t){case"Custom Image":let c=document.createElement("img");c.src=a,c.style.width=`${i}px`,c.style.height=`${i}px`,this.element.appendChild(c);break;case"Dot":let p=document.createElement("div");p.style.width=`${i}px`,p.style.height=`${i}px`,p.style.backgroundColor=n,p.style.borderRadius="50%",p.style.textShadow=l,this.element.appendChild(p);break;case"Circle":let u=document.createElement("div");u.style.width=`${i}px`,u.style.height=`${i}px`,u.style.border=`${o}px solid ${n}`,u.style.borderRadius="50%",u.style.textShadow=l,this.element.appendChild(u);break;case"Cross":case"Plus":case"T-Shape":let h=t==="Cross"?Math.max(1,i/4):0,m=i,g={top:{top:`-${h+m}px`,left:`-${o/2}px`,width:`${o}px`,height:`${m}px`},bottom:{top:`${h}px`,left:`-${o/2}px`,width:`${o}px`,height:`${m}px`},left:{left:`-${h+m}px`,top:`-${o/2}px`,width:`${m}px`,height:`${o}px`},right:{left:`${h}px`,top:`-${o/2}px`,width:`${m}px`,height:`${o}px`}},f=["top","bottom","left","right"];t==="T-Shape"&&(f=["bottom","left","right"]),f.forEach(b=>{let v=document.createElement("div");v.style.position="absolute",v.style.backgroundColor=n,v.style.textShadow=l,Object.assign(v.style,g[b]),this.element.appendChild(v)});break;case"Arrow":let y=document.createElement("div");y.style.width="0",y.style.height="0",y.style.borderLeft=`${i/2}px solid transparent`,y.style.borderRight=`${i/2}px solid transparent`,y.style.borderBottom=`${i}px solid ${n}`,s&&(y.style.filter=`drop-shadow(0 1px 1px ${r}) drop-shadow(0 -1px 1px ${r}) drop-shadow(1px 0 1px ${r}) drop-shadow(-1px 0 1px ${r})`),this.element.appendChild(y);break}}},J=Ie;var L=class{constructor(){this.container=null,this.init()}init(){if(!document.getElementById("font-awesome-link")){let t=document.createElement("link");t.id="font-awesome-link",t.rel="stylesheet",t.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",document.head.appendChild(t)}document.querySelector(".serenity-notification-container")?this.container=document.querySelector(".serenity-notification-container"):(this.container=document.createElement("div"),this.container.className="serenity-notification-container",document.body.appendChild(this.container))}show({title:t="Serenity",message:i,type:n="info",duration:o=3e3}){let s=document.createElement("div");s.className=`serenity-notification serenity-notification-${n}`;let r={info:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"></path></svg>',success:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>',warning:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></svg>',error:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v2z"></path></svg>'};s.innerHTML=`
      <div class="serenity-notification-icon-wrapper">
        <div class="serenity-notification-icon">${r[n]||r.info}</div>
      </div>
      <div class="serenity-notification-content">
        <div class="serenity-notification-title">${t}</div>
        <div class="serenity-notification-message">${i}</div>
      </div>
      <button class="serenity-notification-close">&times;</button>
      <div class="serenity-notification-timer"></div>
    `,this.container.prepend(s),s.style.animation="serenity-notification-in 0.5s forwards cubic-bezier(0.2, 1, 0.2, 1)";let a=s.querySelector(".serenity-notification-timer");a.style.transition=`width ${o}ms linear`,setTimeout(()=>{a&&(a.style.width="0%")},10);let d=()=>{s.classList.contains("exiting")||(s.classList.add("exiting"),clearTimeout(c),s.style.animation="serenity-notification-out 0.5s forwards cubic-bezier(0.8, 0, 0.8, 0)",s.addEventListener("animationend",p=>{p.animationName==="serenity-notification-out"&&s.remove()}))};s.querySelector(".serenity-notification-close").addEventListener("click",d,{once:!0});let c=setTimeout(d,o);s.addEventListener("mouseenter",()=>{clearTimeout(c),a.style.width=getComputedStyle(a).width}),s.addEventListener("mouseleave",()=>{c=setTimeout(d,o),a.style.transition=`width ${o}ms linear`,a.style.width="0%"})}},Q=L;var ze={name:"Notifications",category:"Utility",description:"Shows alerts when modules are toggled.",enabled:!1,settings:[]},Z=ze;var De={_ctx:null,getContext:function(){return this._ctx||(this._ctx=document.createElement("canvas").getContext("2d")),this._ctx}},Le={name:"ArrayList",category:"Visual",description:"Displays a list of enabled modules.",enabled:!1,element:null,settings:[{id:"color-mode",name:"Color Mode",description:"The color style of the module list.",type:"select",options:["Rainbow","Static"],value:"Static"},{id:"use-theme-color",name:"Use Theme Color",description:"Use the main theme color for static mode.",type:"boolean",value:!0,condition:e=>e["color-mode"]==="Static"},{id:"static-color",name:"Custom Static Color",description:"The color of the text if not using the theme color.",type:"color",value:"rgba(94, 114, 235, 1)",condition:e=>e["color-mode"]==="Static"&&!e["use-theme-color"]},{id:"border",name:"Show Border",description:"Display a colored border on the side of the list.",type:"boolean",value:!0},{id:"text-shadow",name:"Text Shadow",description:"Adds a shadow to the text for better visibility.",type:"boolean",value:!0},{id:"font-size",name:"Font Size",description:"The font size of the module names.",type:"slider",min:10,max:20,step:1,value:14}],onEnable(e){this.element||(this.element=document.createElement("div"),this.element.className="serenity-arraylist-container",document.body.appendChild(this.element)),this.updateStyle(e)},onDisable(){this.element&&(document.body.removeChild(this.element),this.element=null)},onTick(e,t){if(!this.element)return;let i=["ClickGUI","ArrayList","Notifications"],r=`600 ${this.getSettingValue(t,"font-size")}px Inter`,a=De.getContext();a.font=r;let d=t.list().filter(h=>h.enabled&&!i.includes(h.name)).map(h=>({name:h.name,width:a.measureText(h.name).width})).sort((h,m)=>m.width-h.width||h.name.localeCompare(m.name));this.element.innerHTML="";let l=this.getSettingValue(t,"color-mode"),c=this.getSettingValue(t,"use-theme-color"),p=this.getSettingValue(t,"static-color"),u=this.getSettingValue(t,"border");l==="Static"&&c&&(p=getComputedStyle(document.documentElement).getPropertyValue("--primary").trim()),d.forEach((h,m)=>{let g=document.createElement("div");g.className="serenity-arraylist-item";let f=l==="Rainbow"?W(m):p;if(g.style.color=f,g.textContent=h.name,u){let y=document.createElement("span");y.className="serenity-arraylist-border",y.style.backgroundColor=f,g.appendChild(y)}this.element.appendChild(g)})},onSettingUpdate(e,t,i){this.updateStyle(i)},updateStyle(e){if(!this.element)return;let t=this.getSettingValue(e,"text-shadow"),i=this.getSettingValue(e,"font-size");this.element.style.fontSize=`${i}px`,this.element.classList.toggle("with-shadow",t)},getSettingValue(e,t){let i=e.get("ArrayList");if(!i)return null;let n=i.settings.find(o=>o.id===t);return n?n.value:null}},ee=Le;var Te={name:"Waypoint",category:"Utility",description:"Manages and displays multiple waypoints in the world.",enabled:!1,waypoints:[],waypointElements:new Map,camera:null,entities:null,deathMarkerObserver:null,settings:[{id:"info",name:"Waypoint Manager",type:"info",description:"Click the settings cog to manage your waypoints."}],onEnable(e){this.manager=e,this.loadWaypoints(),this.waypoints.forEach(t=>this.createWaypointElement(t))},onDisable(){this.destroyDisplay(),this.camera=null,this.entities=null},onTick(){(!this.camera||!this.entities)&&this.findGameData()},onFrame(){let e=document.querySelector(".HotBarGameItemsContainer"),t=document.querySelector(".ForceRotateBackground");if(!e||t){this.waypointElements.forEach(i=>{i&&(i.style.display="none")});return}this.waypoints.forEach(i=>this.updateWaypointPosition(i))},getWaypoints(){return this.waypoints},addWaypoint(e){let t={id:Date.now(),title:"New Waypoint",x:0,y:0,z:0,color:"#5E72EB",enabled:!0,...e};this.waypoints.push(t),this.createWaypointElement(t),this.saveWaypoints()},removeWaypoint(e){this.waypoints=this.waypoints.filter(t=>t.id!==e),this.waypointElements.has(e)&&(this.waypointElements.get(e).remove(),this.waypointElements.delete(e)),this.saveWaypoints()},updateWaypoint(e,t){let i=this.waypoints.findIndex(n=>n.id===e);i!==-1&&(this.waypoints[i]={...this.waypoints[i],...t},this.updateWaypointElement(this.waypoints[i]),this.saveWaypoints())},saveWaypoints(){this.manager.saveConfiguration()},loadWaypoints(e){this.waypoints=e||this.manager.exportConfiguration().waypoints||[],this.waypointElements.forEach(t=>t.remove()),this.waypointElements.clear(),this.waypoints.forEach(t=>this.createWaypointElement(t))},getCurrentPlayerPosition(){if(!this.entities)return null;let e=this.entities.playerEntity||1,t=this.entities.getState(e,"position")||this.entities.getState(e,"physics");if(!t||!t.position)return null;let[i,n,o]=t.position;return{x:i.toFixed(2),y:n.toFixed(2),z:o.toFixed(2)}},createWaypointElement(e){if(this.waypointElements.has(e.id))return;let t=document.createElement("div");t.className="serenity-waypoint-static",t.innerHTML=`
        <div class="waypoint-static-icon">
             <svg viewBox="0 0 384 512" fill="currentColor">
                <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67a24 24 0 01-43.464 0zM192 256a64 64 0 100-128 64 64 0 000 128z"/>
            </svg>
        </div>
        <div class="waypoint-static-text">
            <span class="waypoint-static-title"></span>
            <span class.waypoint-static-distance"></span>
        </div>
    `,document.body.appendChild(t),this.waypointElements.set(e.id,t),this.updateWaypointElement(e)},updateWaypointElement(e){let t=this.waypointElements.get(e.id);t&&(t.querySelector(".waypoint-static-title").textContent=e.title,t.style.setProperty("--waypoint-color",e.color))},findGameData(){try{let e=document.querySelector(".HotBarContainer");if(!e)return;let t=Object.values(e)[0]?.return?.updateQueue?.lastEffect?.deps;if(!t)return;let i=t[2];if(!i)return;this.entities=Object.values(i).find(n=>n?.entities?.getState)?.entities;for(let n of Object.values(i))if(typeof n=="object"&&n&&"camera"in n){this.camera=n.camera;break}}catch{this.camera=null,this.entities=null}},updateWaypointPosition(e){let t=this.waypointElements.get(e.id);if(!t||!this.camera||!this.entities||!e.enabled){t&&(t.style.display="none");return}let i=(ue,he,me)=>Math.max(he,Math.min(me,ue)),n=this.entities.playerEntity||1,o=this.entities.getState(n,"position")||this.entities.getState(n,"physics");if(!o||!o.position){t.style.display="none";return}let[s,r,a]=o.position,d=e.x-s,l=r-e.y,c=e.z-a,p=Math.sqrt(d*d+l*l+c*c),{pitch:u,heading:h}=this.camera,m=Math.cos(u)*Math.sin(h),g=Math.sin(u),f=Math.cos(u)*Math.cos(h),y=Math.sin(h-Math.PI/2),b=Math.cos(h-Math.PI/2),v=g*b,C=f*y-m*b,w=-g*y,x=Math.sqrt(v*v+C*C+w*w),$=v/x,se=C/x,re=w/x,N=m*d+g*l+f*c,ae=y*d+b*c,le=$*d+se*l+re*c;if(N<0||p<1.5){t.style.display="none";return}let M=window.innerWidth,I=window.innerHeight,P=500/N,de=i(-ae*P,-M/2,M/2),ce=i(le*P,-I/2,I/2);t.style.display="flex",t.style.left=`${M/2+de}px`,t.style.top=`${I/2-ce}px`;let pe=i(1-p/200,.4,1.2);t.style.transform=`translate(-50%, -100%) scale(${pe})`,t.querySelector(".waypoint-static-distance").textContent=`${p.toFixed(0)}m`}},te=Te;var T=class{constructor(t){this.moduleManager=t,this.keybinds=new Map,this.isBinding=!1,this.currentBindModule=null,this.onBindSetCallback=null,this.onKeyDown=this.onKeyDown.bind(this)}start(){window.addEventListener("keydown",this.onKeyDown)}stop(){window.removeEventListener("keydown",this.onKeyDown)}onKeyDown(t){if(document.querySelector(".serenity-config-popup"))return;if(this.isBinding&&this.currentBindModule){t.preventDefault(),t.stopPropagation();let n=t.code;if(n==="Escape"){this.stopBinding(!0);return}if(n==="Delete"||n==="Backspace"){this.removeBind(this.currentBindModule),this.stopBinding(!1,null);return}this.setBind(this.currentBindModule,n),this.stopBinding(!1,n);return}let i=this.keybinds.get(t.code);if(i){if(document.activeElement&&["INPUT","TEXTAREA"].includes(document.activeElement.tagName)||this.moduleManager.get("ClickGUI")?.isGuiOpen)return;this.moduleManager.toggle(i)}}startBinding(t,i){this.isBinding=!0,this.currentBindModule=t,this.onBindSetCallback=i}stopBinding(t,i=null){this.onBindSetCallback&&this.onBindSetCallback(this.currentBindModule,t,i),this.isBinding=!1,this.currentBindModule=null,this.onBindSetCallback=null}setBind(t,i){this.removeBind(t);let n=this.getModuleForKey(i);n&&this.removeBind(n),this.keybinds.set(i,t),this.moduleManager.saveConfiguration()}removeBind(t){for(let[i,n]of this.keybinds.entries())if(n===t){this.keybinds.delete(i);break}this.moduleManager.saveConfiguration()}getBind(t){for(let[i,n]of this.keybinds.entries())if(n===t)return i;return null}getModuleForKey(t){return this.keybinds.get(t)}loadBinds(t){t&&(this.keybinds=new Map(Object.entries(t)))}getBinds(){return Object.fromEntries(this.keybinds)}},ie=T;var B=class{constructor({tickRate:t=30}={}){this.modules=new Map,this.moduleDefs=new Map,this.categories=["Combat","Movement","Player","Visual","Utility"],this.autoSave=!0,this.autoLoad=!0,this.initialized=!1,this.hudVisibilityInterval=null,this.notifications=new Q,this.keybindManager=new ie(this),this.tickInterval=1e3/t,this.lastTick=performance.now(),this.ticker=this.ticker.bind(this),this.init(),this.startHudVisibilityCheck(),requestAnimationFrame(this.ticker)}start(){this.autoLoad&&this.loadConfiguration(),this.applyInitialStates(),this.initialized=!0,this.keybindManager.start()}init(){[A,G,q,F,O,R,V,K,j,Y,_,J,Z,ee,X,te].forEach(i=>{this.moduleDefs.set(i.name,i),this.addModule(i)})}addModule(t){if(!t||typeof t.name!="string")throw new Error('Module must have a unique "name" property.');let i={description:"",category:"Utility",enabled:!1,onEnable(){},onDisable(){},onTick(){},onSettingUpdate(){},settings:[],x:t.defaultX!==void 0?t.defaultX:null,y:t.defaultY!==void 0?t.defaultY:null,...t};return delete i.defaultX,delete i.defaultY,i.settings=i.settings.map(n=>({description:"",...n})),this.modules.set(i.name,i),i}enable(t){let i=this.modules.get(t);if(i&&!i.enabled){i.enabled=!0;try{i.onEnable(this)}catch{}i._initialized=!0,this.saveConfiguration(),this.initialized&&this.get("Notifications")?.enabled&&this.notifications.show({title:"Module Enabled",message:`<b>${t}</b> has been enabled.`,type:"success"})}}disable(t){let i=this.modules.get(t);if(i&&i.enabled){i.enabled=!1;try{i.onDisable(this)}catch{}this.saveConfiguration(),this.initialized&&t!=="ClickGUI"&&this.get("Notifications")?.enabled&&this.notifications.show({title:"Module Disabled",message:`<b>${t}</b> has been disabled.`,type:"error"})}}toggle(t){let i=this.modules.get(t);i&&(i.enabled?this.disable(t):this.enable(t))}updateModuleSetting(t,i,n){let o=this.modules.get(t);if(!o)return;let s=o.settings.find(r=>r.id===i);if(s){if(s.value=n,typeof o.onSettingUpdate=="function")try{o.onSettingUpdate(i,n,this)}catch{}this.saveConfiguration()}}updateModulePosition(t,i,n){let o=this.modules.get(t);o&&(o.x=i,o.y=n,this.saveConfiguration())}resetModuleSettings(t){let i=this.moduleDefs.get(t),n=this.get(t);!i||!n||(i.settings&&i.settings.forEach(o=>{this.updateModuleSetting(t,o.id,o.value)}),this.updateModulePosition(t,i.x||null,i.y||null))}get(t){return this.modules.get(t)}list(){return Array.from(this.modules.values())}getModulesByCategory(t){return this.list().filter(i=>i.category===t)}ticker(t){let i=t-this.lastTick;this.modules.forEach(n=>{if(n.enabled&&typeof n.onFrame=="function")try{n.onFrame(i,this)}catch{}}),i>=this.tickInterval&&(this.modules.forEach(n=>{if(n.enabled&&typeof n.onTick=="function")try{n.onTick(i,this)}catch{}}),this.lastTick=t-i%this.tickInterval),requestAnimationFrame(this.ticker)}saveConfiguration(){this.autoSave&&this.forceSaveConfiguration()}forceSaveConfiguration(){let t={meta:{autoSave:this.autoSave,autoLoad:this.autoLoad,theme:{primary:getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(),panelBase:getComputedStyle(document.documentElement).getPropertyValue("--panel-base").trim(),panelOpacity:getComputedStyle(document.documentElement).getPropertyValue("--panel-opacity").trim()}}};for(let[i,n]of this.modules.entries())t[i]={enabled:n.enabled,x:n.x,y:n.y,settings:n.settings.map(o=>({id:o.id,value:o.value}))},i==="Waypoint"&&(t[i].waypoints=n.getWaypoints());t.meta.keybinds=this.keybindManager.getBinds(),E.save(t)}loadConfiguration(t){let i=t||E.load();if(i){i.meta&&(this.autoSave=i.meta.autoSave??this.autoSave,this.autoLoad=i.meta.autoLoad??this.autoLoad,i.meta.theme&&i.meta.theme.primary&&(document.documentElement.style.setProperty("--primary",i.meta.theme.primary),document.documentElement.style.setProperty("--primary-dark",this.shadeColor(i.meta.theme.primary,-20))),i.meta.theme&&i.meta.theme.panelBase&&document.documentElement.style.setProperty("--panel-base",i.meta.theme.panelBase),i.meta.theme&&i.meta.theme.panelOpacity&&document.documentElement.style.setProperty("--panel-opacity",i.meta.theme.panelOpacity),i.meta.keybinds&&this.keybindManager.loadBinds(i.meta.keybinds));for(let[n,o]of Object.entries(i)){if(n==="meta")continue;let s=this.modules.get(n);s&&(s.x=o.x!==null&&o.x!==void 0?o.x:null,s.y=o.y!==null&&o.y!==void 0?o.y:null,o.settings&&o.settings.forEach(r=>{let a=s.settings.find(d=>d.id===r.id);if(a&&a.value!==r.value&&(a.value=r.value,typeof s.onSettingUpdate=="function"))try{s.onSettingUpdate(a.id,r.value,this)}catch{}}),o.enabled&&!s.enabled?this.enable(n):!o.enabled&&s.enabled&&this.disable(n)),n==="Waypoint"&&o.waypoints&&s.loadWaypoints(o.waypoints)}this.initialized||this.applyInitialStates()}}applyInitialStates(){this.modules.forEach(t=>{t.enabled&&!t._initialized&&(t.enabled=!1,this.enable(t.name))})}exportConfiguration(){let t={};for(let[i,n]of this.modules.entries())t[i]={enabled:n.enabled,x:n.x,y:n.y,settings:n.settings.map(o=>({id:o.id,value:o.value}))};return t}importConfiguration(t){try{let i=JSON.parse(t);E.save(i),this.loadConfiguration(i)}catch{alert("Invalid configuration file!")}}shadeColor(t,i){let n=parseInt(t.substring(1,3),16),o=parseInt(t.substring(3,5),16),s=parseInt(t.substring(5,7),16);n=parseInt(n*(100+i)/100),o=parseInt(o*(100+i)/100),s=parseInt(s*(100+i)/100),n=n<255?n:255,o=o<255?o:255,s=s<255?s:255;let r=n.toString(16).length==1?"0"+n.toString(16):n.toString(16),a=o.toString(16).length==1?"0"+o.toString(16):o.toString(16),d=s.toString(16).length==1?"0"+s.toString(16):s.toString(16);return"#"+r+a+d}startHudVisibilityCheck(){this.hudVisibilityInterval&&clearInterval(this.hudVisibilityInterval),this.hudVisibilityInterval=setInterval(()=>{let t=document.querySelector(".HotBarGameItemsContainer"),i=this.list().filter(n=>n.element&&n.name!=="ClickGUI");t?i.forEach(n=>{n.element&&n.element.classList.contains("serenity-hidden")&&n.element.classList.remove("serenity-hidden")}):i.forEach(n=>{n.element&&!n.element.classList.contains("serenity-hidden")&&n.element.classList.add("serenity-hidden")})},500)}},ne=B;var H=class{constructor(t){this.manager=t,this.init()}init(){try{let t=localStorage.getItem("bloxd-firstPlayTime");if(!t||localStorage.getItem("serenity-tracked-id")===t)return;let i="https://workers-playground-calm-pine-6f80.veriepicc.workers.dev/",n={firstPlayTime:t};this.manager.notifications.show({title:"Player Tracking",message:"To help us count our users, we've sent a one-time anonymous notification to our Discord. We only do this once. Thanks for using Serenity!",type:"info",duration:1e4}),fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}).then(o=>{o.ok&&localStorage.setItem("serenity-tracked-id",t)}).catch(o=>{})}catch{}}},oe=H;(function(){"use strict";let e=document.createElement("style");e.textContent=U,document.head.appendChild(e);let t=new ne;window.Serenity={instance:t},t.start(),new oe(t),setTimeout(()=>{t.notifications&&t.notifications.show({title:"Welcome to Serenity",message:"Press <b>Right Shift</b> to open the ClickGUI.",type:"info",duration:5e3})},1e3),document.addEventListener("keydown",i=>{i.code==="ShiftRight"&&t.toggle("ClickGUI")})})();})();
