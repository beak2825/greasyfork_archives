// ==UserScript==
// @name       ome.tv ip puller by clownz
// @namespace   http://tampermonkey.net/
// @license MIT
// @match      https://ome.tv/*
// @match      https://ometv.chat/*
// @match      https://ome.chat/*
// @match      https://umingle.com/*
// @match      https://chatroulette.com/*
// @match      https://%2A.chatroulette.com/*
// @match      https://chatrandom.com/*
// @match      https://%2A.chatrandom.com/*
// @match      https://shagle.com/*
// @match      https://%2A.shagle.com/*
// @match      https://bazoocam.org/*
// @match      https://camsurf.com/*
// @match      https://%2A.camsurf.com/*
// @match      https://chatki.com/*
// @match      https://%2A.chatki.com/*
// @match      https://emeraldchat.com/*
// @match      https://%2A.emeraldchat.com/*
// @match      https://chathub.gg/*
// @match      https://%2A.chathub.gg/*
// @match      https://chatspin.com/*
// @match      https://%2A.chatspin.com/*
// @match      https://coomeet.com/*
// @match      https://%2A.coomeet.com/*
// @match      https://chatpig.com/*
// @match      https://%2A.chatpig.com/*
// @match      https://chatruletka.com/*
// @match      https://%2A.chatruletka.com/*
// @match      https://omegle.pro/*
// @match      https://%2A.omegle.pro/*
// @match      https://flirtymania.com/*
// @match      https://%2A.flirtymania.com/*
// @match      https://chatride.com/*
// @match      https://%2A.chatride.com/*
// @match      https://strangercam.com/*
// @match      https://%2A.strangercam.com/*
// @match      https://azar.com/*
// @match      https://%2A.azar.com/*
// @match      https://holla.world/*
// @match      https://%2A.holla.world/*
// @match      https://livu.com/*
// @match      https://%2A.livu.com/*
// @match      https://yubo.live/*
// @match      https://%2A.yubo.live/*
// @grant       none
// @version      8.3
// @author      Clownz
// @description Advanced IP Info Tool with Enhanced Time Zone & Location Data + Resizable UI
// @downloadURL https://update.greasyfork.org/scripts/544290/ometv%20ip%20puller%20by%20clownz.user.js
// @updateURL https://update.greasyfork.org/scripts/544290/ometv%20ip%20puller%20by%20clownz.meta.js
// ==/UserScript==

(function () {
'use strict';

const CONSTANTS = {
  API_TOKEN: "0fa17c6a095d41",
  API_BASE_URL: "https://ipinfo.io",
  COOKIE_NAME: "ipinfoSettings",
  STORAGE_KEY_POSITION: "ipinfo_popup_pos",
  STORAGE_KEY_SIZE: "ipinfo_popup_size",
  COOKIE_EXPIRY_DAYS: 365,
  DEFAULT_POPUP_WIDTH: 380,
  DEFAULT_POPUP_HEIGHT: 500,
  DEFAULT_POPUP_TOP: 70,
  DEFAULT_POPUP_RIGHT: 20,
  MIN_POPUP_WIDTH: 300,
  MIN_POPUP_HEIGHT: 300,
  MAX_POPUP_WIDTH: 800,
  MAX_POPUP_HEIGHT: 800,
  TOAST_DURATION: 2200,
  COUNTDOWN_SECONDS: 3,
  Z_INDEX: {
    INJECT_BTN: 9999,
    SETTINGS: 15000,
    POPUP: 16000,
    TOAST: 20000,
    COUNTDOWN: 100000,
    VISUALIZER: 9998
  }
};

const DEFAULT_CONFIG = {
  enabled: true,
  autoOpen: true,
  theme: 'neonCyberpunk',
  animationSpeed: 'medium',
  soundEffects: true,
  visualizer: true,
  quickActions: true,
  timezoneInfo: true,
  weatherInfo: true,
  resizable: true,
  fields: {
    ip: true,
    country: true,
    state: true,
    city: true,
    loc: true,
    asn: true,
    isp: true,
    org: true,
    postal: true,
    maps: true,
    whois: true,
    flag: true,
    timezone: true,
    local_time: true,
    offset: true,
    dst: true,
    currency: true,
    language: true,
    weather: true,
    proxy: true,
    vpn: true,
    hostname: true
  }
};

const THEMES = {
  neonCyberpunk: {
    name: 'Neon Cyberpunk',
    card: 'linear-gradient(180deg, rgba(30,30,50,0.82), rgba(18,18,28,0.72))',
    text: '#e6fff9',
    accent: '#00dfd8',
    buttonText: '#001217',
    cancel: '#ff6b6b',
    accentDark: '#00b3a8',
    glow: '0 0 20px rgba(0,255,230,0.3)'
  },
  darkMatrix: {
    name: 'Dark Matrix',
    card: 'linear-gradient(180deg, rgba(0,40,0,0.9), rgba(0,20,0,0.8))',
    text: '#00ff41',
    accent: '#00ff41',
    buttonText: '#000',
    cancel: '#ff3333',
    accentDark: '#00cc33',
    glow: '0 0 25px rgba(0,255,65,0.4)'
  },
  purpleHaze: {
    name: 'Purple Haze',
    card: 'linear-gradient(180deg, rgba(50,20,60,0.9), rgba(30,10,40,0.8))',
    text: '#e6ccff',
    accent: '#b366ff',
    buttonText: '#fff',
    cancel: '#ff66b2',
    accentDark: '#9933cc',
    glow: '0 0 25px rgba(179,102,255,0.4)'
  },
  solarFlare: {
    name: 'Solar Flare',
    card: 'linear-gradient(180deg, rgba(255,100,0,0.9), rgba(200,50,0,0.8))',
    text: '#fff8e6',
    accent: '#ff9900',
    buttonText: '#000',
    cancel: '#ff3333',
    accentDark: '#cc6600',
    glow: '0 0 25px rgba(255,153,0,0.4)'
  }
};

const SOUND_EFFECTS = {
  click: 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
  success: 'https://assets.mixkit.co/sfx/preview/mixkit-success-bell-893.mp3',
  error: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
  hover: 'https://assets.mixkit.co/sfx/preview/mixkit-light-button-click-1129.mp3',
  popup: 'https://assets.mixkit.co/sfx/preview/mixkit-pop-up-notification-alert-2356.mp3',
  resize: 'https://assets.mixkit.co/sfx/preview/mixkit-slide-swipe-2151.mp3'
};
const COUNTRY_DATA = {
  'US': { currency: 'USD', language: 'English', emoji: '🇺🇸' },
  'GB': { currency: 'GBP', language: 'English', emoji: '🇬🇧' },
  'CA': { currency: 'CAD', language: 'English/French', emoji: '🇨🇦' },
  'AU': { currency: 'AUD', language: 'English', emoji: '🇦🇺' },
  'DE': { currency: 'EUR', language: 'German', emoji: '🇩🇪' },
  'FR': { currency: 'EUR', language: 'French', emoji: '🇫🇷' },
  'IT': { currency: 'EUR', language: 'Italian', emoji: '🇮🇹' },
  'ES': { currency: 'EUR', language: 'Spanish', emoji: '🇪🇸' },
  'JP': { currency: 'JPY', language: 'Japanese', emoji: '🇯🇵' },
  'CN': { currency: 'CNY', language: 'Chinese', emoji: '🇨🇳' },
  'RU': { currency: 'RUB', language: 'Russian', emoji: '🇷🇺' },
  'IN': { currency: 'INR', language: 'Hindi/English', emoji: '🇮🇳' },
  'BR': { currency: 'BRL', language: 'Portuguese', emoji: '🇧🇷' },
  'MX': { currency: 'MXN', language: 'Spanish', emoji: '🇲🇽' }
};

function injectGlobalStyles() {
  const styleTag = document.createElement('style');
  styleTag.id = 'ipinfo-global-style';
  const injectBtnZ = CONSTANTS.Z_INDEX.INJECT_BTN;
  const toastZ = CONSTANTS.Z_INDEX.TOAST;
  const settingsZ = CONSTANTS.Z_INDEX.SETTINGS;
  const popupZ = CONSTANTS.Z_INDEX.POPUP;
  const visualizerZ = CONSTANTS.Z_INDEX.VISUALIZER;
  const popupTop = CONSTANTS.DEFAULT_POPUP_TOP;
  const popupRight = CONSTANTS.DEFAULT_POPUP_RIGHT;
  const popupWidth = CONSTANTS.DEFAULT_POPUP_WIDTH;

  styleTag.textContent = `
    @keyframes rainbowBackground {
      0% { background-position: 0% 50% }
      50% { background-position: 100% 50% }
      100% { background-position: 0% 50% }
    }
    @keyframes pulseGlow {
      0% { box-shadow: 0 0 8px rgba(0,255,230,0.18) }
      50% { box-shadow: 0 0 20px rgba(0,255,230,0.28) }
      100% { box-shadow: 0 0 8px rgba(0,255,230,0.18) }
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0 }
      to { transform: translateY(0); opacity: 1 }
    }
    @keyframes fadeInZoom {
      from { opacity: 0; transform: scale(.96) }
      to { opacity: 1; transform: scale(1) }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) }
      50% { transform: translateY(-10px) }
    }
    @keyframes shine {
      0% { background-position: -200% center }
      100% { background-position: 200% center }
    }
    @keyframes matrixRain {
      0% { background-position: 0% 0% }
      100% { background-position: 0% 100% }
    }
    @keyframes scanline {
      0% { transform: translateY(-100%) }
      100% { transform: translateY(100vh) }
    }
    @keyframes clockTick {
      0% { transform: rotate(0deg) }
      100% { transform: rotate(360deg) }
    }
    @keyframes weatherSpin {
      0% { transform: rotate(0deg) }
      100% { transform: rotate(360deg) }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1 }
      50% { opacity: 0.5 }
    }

    .ipinfo-card {
      backdrop-filter: blur(10px);
      background: linear-gradient(180deg, rgba(30,30,40,0.72), rgba(20,20,30,0.62));
      border: 1px solid rgba(255,255,255,0.04);
      border-radius: 16px;
      color: #e6f9f6;
      font-family: 'Segoe UI', Roboto, 'Helvetica Neue', monospace;
      box-shadow: 0 12px 30px rgba(0,0,0,0.6);
      position: relative;
      overflow: hidden;
    }
    .ipinfo-card::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #ff4b4b, #ffb86b, #00ffe7, #7b61ff, #ff4b4b);
      background-size: 400% 400%;
      border-radius: 18px;
      z-index: -1;
      animation: rainbowBackground 8s ease infinite;
      filter: blur(10px);
      opacity: 0.3;
    }
    .ipinfo-inject-btn {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: ${injectBtnZ};
      padding: 16px 34px;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      border: 3px solid rgba(0,255,230,0.95);
      color: #001217;
      background: linear-gradient(270deg, #ff4b4b, #ffb86b, #00ffe7, #7b61ff);
      background-size: 400% 400%;
      animation: rainbowBackground 6s ease infinite, pulseGlow 2.4s infinite;
      user-select: none;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      letter-spacing: 1px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .ipinfo-inject-btn:hover {
      transform: translate(-50%, -50%) scale(1.08);
      box-shadow: 0 0 40px rgba(0,255,230,0.6);
    }
    .ipinfo-inject-btn:active {
      transform: translate(-50%, -50%) scale(0.98);
    }
    .ipinfo-toggle-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: ${injectBtnZ};
      padding: 8px 14px;
      border-radius: 12px;
      font-size: 20px;
      font-weight: 800;
      cursor: pointer;
      border: 2px solid rgba(0,255,230,0.95);
      color: #001217;
      background: linear-gradient(270deg, #ff4b4b, #ffb86b, #00ffe7, #7b61ff);
      background-size: 400% 400%;
      animation: rainbowBackground 6s ease infinite, pulseGlow 2.4s infinite;
      user-select: none;
      min-width: 50px;
      min-height: 50px;
      line-height: 1;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }
    .ipinfo-toggle-btn.active {
      background: linear-gradient(270deg, #00ffe7, #7b61ff, #ffb86b, #ff4b4b);
      transform: rotate(360deg);
      animation: rainbowBackground 6s ease infinite, pulseGlow 2.4s infinite, float 3s ease-in-out infinite;
    }
    .ipinfo-toggle-btn:hover {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 0 30px rgba(0,255,230,0.5);
    }
    .ipinfo-toast {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 18px;
      z-index: ${toastZ};
      padding: 14px 20px;
      border-radius: 12px;
      background: linear-gradient(90deg, rgba(0,255,230,0.95), rgba(0,180,200,0.9));
      color: #001217;
      font-weight: 700;
      font-family: monospace;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      pointer-events: none;
      border: 2px solid rgba(255,255,255,0.2);
      box-shadow: 0 8px 25px rgba(0,0,0,0.4);
      min-width: 200px;
      text-align: center;
      backdrop-filter: blur(5px);
    }
    .ipinfo-toast.show {
      opacity: 1;
      bottom: 34px;
      transform: translateX(-50%) scale(1.05);
    }
    #ipinfo-settings {
      width: 400px;
      padding: 20px;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: ${settingsZ};
      user-select: none;
      animation: fadeInZoom 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      border: 2px solid rgba(255,255,255,0.1);
    }
    #ipinfo-settings h3 {
      margin: 0 0 12px 0;
      font-size: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      text-align: center;
      padding-bottom: 10px;
      border-bottom: 2px solid rgba(0,255,230,0.3);
    }
    #ipinfo-settings label {
      display: block;
      font-size: 13px;
      margin: 8px 0;
      cursor: pointer;
    }
    .ipinfo-row {
      display: flex;
      align-items: center;
      gap: 12px;
      justify-content: space-between;
      margin: 10px 0;
    }
    .ipinfo-fields {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin: 12px 0;
      max-height: 250px;
      overflow-y: auto;
      padding: 10px;
      background: rgba(0,0,0,0.2);
      border-radius: 8px;
    }
    .ipinfo-field-item {
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 6px;
      background: rgba(255,255,255,0.05);
      transition: all 0.2s ease;
    }
    .ipinfo-field-item:hover {
      background: rgba(255,255,255,0.1);
      transform: translateY(-2px);
    }
    .switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 26px;
    }
    .switch input {
      display: none;
    }
    .slider {
      position: absolute;
      inset: 0;
      border-radius: 34px;
      background: #555;
      transition: 0.4s;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
    }
    .slider:before {
      content: "";
      position: absolute;
      width: 22px;
      height: 22px;
      left: 2px;
      top: 2px;
      border-radius: 50%;
      background: linear-gradient(145deg, #fff, #ccc);
      transition: 0.4s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .switch input:checked + .slider {
      background: linear-gradient(90deg, rgba(0,255,230,0.95), rgba(0,180,200,0.9));
    }
    .switch input:checked + .slider:before {
      transform: translateX(24px);
      background: #fff;
    }
    .ipinfo-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    .ipinfo-btn {
      padding: 10px 20px;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 700;
      font-size: 14px;
      border: none;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      flex: 1;
      position: relative;
      overflow: hidden;
    }
    .ipinfo-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: 0.5s;
    }
    .ipinfo-btn:hover::before {
      left: 100%;
    }
    .ipinfo-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    }
    .ipinfo-btn:active {
      transform: translateY(-1px);
    }
    .ipinfo-save {
      background: linear-gradient(90deg, rgba(0,255,230,0.95), rgba(0,180,200,0.9));
      color: #001217;
    }
    .ipinfo-cancel {
      background: linear-gradient(90deg, rgba(255,75,75,0.95), rgba(200,60,60,0.9));
      color: #fff;
    }
    .ip-popout-box {
      position: fixed;
      top: ${popupTop}px;
      right: ${popupRight}px;
      width: ${popupWidth}px;
      min-width: ${CONSTANTS.MIN_POPUP_WIDTH}px;
      max-width: ${CONSTANTS.MAX_POPUP_WIDTH}px;
      height: ${CONSTANTS.DEFAULT_POPUP_HEIGHT}px;
      min-height: ${CONSTANTS.MIN_POPUP_HEIGHT}px;
      max-height: ${CONSTANTS.MAX_POPUP_HEIGHT}px;
      z-index: ${popupZ};
      padding: 16px;
      border-radius: 16px;
      animation: slideUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      overflow: hidden;
      background: rgba(20, 20, 30, 0.9);
      border: 2px solid;
      border-image-slice: 1;
      border-width: 2px;
      border-image-source: linear-gradient(90deg, #ff4b4b, #00ffe7, #7b61ff, #ffb86b);
      box-shadow: 0 0 30px rgba(0, 255, 230, 0.4), 0 0 60px rgba(123, 97, 255, 0.3);
      color: #e6fff9;
      font-family: 'Segoe UI', Roboto, monospace;
      cursor: default;
      backdrop-filter: blur(10px);
      resize: ${config?.resizable ? 'both' : 'none'};
      overflow: hidden;
    }
    .ip-popout-box.resizable {
      resize: both;
    }
    .ip-popout-box::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #ff4b4b, #00ffe7, #7b61ff, #ffb86b);
      animation: shine 3s linear infinite;
    }
    .ip-popout-box.dragging {
      opacity: 0.9;
      box-shadow: 0 0 40px #00ffe7;
      transform: scale(1.02);
      cursor: move;
    }
    .ip-popout-box.resizing {
      opacity: 0.8;
      box-shadow: 0 0 30px rgba(255, 75, 75, 0.5);
      cursor: ${config?.resizable ? 'se-resize' : 'default'};
    }
    .resize-handle {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 20px;
      height: 20px;
      cursor: se-resize;
      z-index: 1;
      background: linear-gradient(135deg, rgba(0,255,230,0.3), rgba(123,97,255,0.3));
      border-top-left-radius: 10px;
      border-bottom-right-radius: 16px;
      display: ${config?.resizable ? 'block' : 'none'};
      transition: all 0.2s ease;
    }
    .resize-handle:hover {
      background: linear-gradient(135deg, rgba(0,255,230,0.6), rgba(123,97,255,0.6));
      transform: scale(1.1);
    }
    .resize-handle:active {
      transform: scale(0.9);
    }
    .resize-indicator {
      position: absolute;
      bottom: 5px;
      right: 5px;
      font-size: 10px;
      color: rgba(255,255,255,0.5);
      pointer-events: none;
      display: ${config?.resizable ? 'block' : 'none'};
    }
    .ip-popout-box .ip-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0 12px 0;
      font-weight: 800;
      border-bottom: 2px solid rgba(0,255,230,0.4);
      color: #00ffe7;
      text-shadow: 0 0 10px #00ffe7;
      cursor: move;
      font-size: 18px;
      letter-spacing: 1px;
    }
    .ip-popout-box .ip-body {
      padding: 12px 0;
      font-size: 14px;
      line-height: 1.6;
      height: calc(100% - 60px);
      overflow-y: auto;
      overflow-x: hidden;
    }
    .ip-popout-box .ip-body::-webkit-scrollbar {
      width: 8px;
    }
    .ip-popout-box .ip-body::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.2);
      border-radius: 4px;
    }
    .ip-popout-box .ip-body::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #00ffe7, #00b3a8);
      border-radius: 4px;
    }
    .info-line {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      transition: all 0.2s ease;
    }
    .info-line:hover {
      background: rgba(255,255,255,0.03);
      padding-left: 5px;
      border-radius: 6px;
    }
    .info-line:last-child {
      border-bottom: none;
    }
    .info-line span:first-child {
      font-weight: 700;
      color: #00ffe7;
      min-width: 120px;
    }
    .copy-ip-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 8px;
      background: linear-gradient(90deg, #00ffe7, #00b3a8);
      color: #001217;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      user-select: none;
      border: none;
      box-shadow: 0 4px 10px rgba(0,255,230,0.3);
    }
    .copy-ip-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0,255,230,0.5);
    }
    .copy-ip-btn:active {
      transform: translateY(-1px);
    }
    .maps-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 8px;
      background: linear-gradient(90deg, #4285F4, #34A853);
      color: white;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      user-select: none;
      text-decoration: none;
      border: none;
      box-shadow: 0 4px 10px rgba(66,133,244,0.3);
    }
    .maps-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(66,133,244,0.5);
    }
    .whois-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 8px;
      background: linear-gradient(90deg, #FF6B6B, #FFD166);
      color: #001217;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      user-select: none;
      border: none;
      box-shadow: 0 4px 10px rgba(255,107,107,0.3);
    }
    .whois-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(255,107,107,0.5);
    }
    .time-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 8px;
      background: linear-gradient(90deg, #8B5CF6, #EC4899);
      color: white;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      user-select: none;
      text-decoration: none;
      border: none;
      box-shadow: 0 4px 10px rgba(139,92,246,0.3);
    }
    .time-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(139,92,246,0.5);
    }
    .ip-actions-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 2px solid rgba(0,255,230,0.3);
    }
    .ip-actions-row.double {
      grid-template-columns: repeat(4, 1fr);
    }
    .flag-emoji {
      font-size: 24px;
      vertical-align: middle;
      margin-right: 8px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    .timezone-section {
      background: rgba(0,0,0,0.2);
      border-radius: 10px;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .timezone-title {
      font-size: 14px;
      font-weight: 700;
      color: #00ffe7;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .time-display {
      font-size: 20px;
      font-weight: 800;
      text-align: center;
      padding: 10px;
      background: rgba(0,0,0,0.3);
      border-radius: 8px;
      margin: 8px 0;
      border: 2px solid rgba(0,255,230,0.3);
      position: relative;
      overflow: hidden;
    }
    .time-display::before {
      content: '🕒';
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      animation: clockTick 60s linear infinite;
    }
    .timezone-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      font-size: 12px;
    }
    .timezone-item {
      display: flex;
      justify-content: space-between;
      padding: 4px 8px;
      background: rgba(255,255,255,0.05);
      border-radius: 6px;
    }
    .timezone-item span:first-child {
      color: #00ffe7;
      font-weight: 600;
    }
    .country-info {
      background: rgba(0,0,0,0.2);
      border-radius: 10px;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .country-info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      font-size: 12px;
    }
    .detection-badges {
      display: flex;
      gap: 8px;
      margin: 10px 0;
    }
    .detection-badge {
      padding: 4px 8px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .badge-proxy {
      background: linear-gradient(90deg, #FF6B6B, #FF8E53);
      color: white;
    }
    .badge-vpn {
      background: linear-gradient(90deg, #4776E6, #8E54E9);
      color: white;
    }
    .badge-tor {
      background: linear-gradient(90deg, #2C3E50, #4A6491);
      color: white;
    }
    .badge-clean {
      background: linear-gradient(90deg, #00b09b, #96c93d);
      color: white;
    }
    .weather-display {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 8px;
      background: rgba(0,0,0,0.3);
      border-radius: 8px;
      margin: 8px 0;
    }
    .weather-icon {
      font-size: 24px;
      animation: weatherSpin 10s linear infinite;
    }
    .weather-temp {
      font-size: 18px;
      font-weight: 800;
      color: #00ffe7;
    }
    .ipinfo-signature {
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: ${injectBtnZ - 1};
      padding: 8px 14px;
      border-radius: 10px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      font-weight: 700;
      pointer-events: none;
      background: linear-gradient(90deg, rgba(0,255,230,0.1), rgba(123,97,255,0.1));
      border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(5px);
      letter-spacing: 1px;
    }
    .ipinfo-gear {
      position: fixed;
      bottom: 25px;
      left: 25px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: ${injectBtnZ};
      font-size: 24px;
      transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      background: linear-gradient(135deg, rgba(0,255,230,0.2), rgba(123,97,255,0.2));
      border: 2px solid rgba(0,255,230,0.5);
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      animation: float 4s ease-in-out infinite;
    }
    .ipinfo-gear:hover {
      transform: scale(1.2) rotate(180deg);
      background: linear-gradient(135deg, rgba(0,255,230,0.3), rgba(123,97,255,0.3));
      box-shadow: 0 0 30px rgba(0,255,230,0.6);
    }
    .quick-actions {
      position: fixed;
      bottom: 90px;
      left: 25px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: ${injectBtnZ};
      opacity: 0;
      transform: translateX(-20px);
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    .quick-actions.visible {
      opacity: 1;
      transform: translateX(0);
    }
    .quick-action-btn {
      width: 45px;
      height: 45px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
      background: linear-gradient(135deg, rgba(255,75,75,0.2), rgba(255,184,107,0.2));
      border: 2px solid rgba(255,75,75,0.4);
      color: #fff;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      backdrop-filter: blur(5px);
    }
    .quick-action-btn:hover {
      transform: scale(1.1) translateY(-5px);
      box-shadow: 0 8px 25px rgba(255,75,75,0.4);
    }
    .ipinfo-visualizer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: ${visualizerZ};
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    .ipinfo-visualizer.active {
      opacity: 0.1;
    }
    .scanline {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(0,255,230,0.8), transparent);
      animation: scanline 3s linear infinite;
      opacity: 0.3;
    }
    .matrix-rain {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, transparent 95%, rgba(0,255,230,0.1) 100%);
      background-size: 100% 50px;
      animation: matrixRain 20s linear infinite;
      opacity: 0.1;
    }
    .speed-select {
      padding: 6px 12px;
      border-radius: 8px;
      background: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
      color: white;
      font-family: inherit;
      font-size: 12px;
      cursor: pointer;
      margin-left: 10px;
    }
    .speed-select:focus {
      outline: none;
      border-color: rgba(0,255,230,0.5);
    }
    .stats-bar {
      display: flex;
      justify-content: space-around;
      padding: 10px;
      background: rgba(0,0,0,0.2);
      border-radius: 10px;
      margin: 10px 0;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .stat-item {
      text-align: center;
    }
    .stat-value {
      font-size: 18px;
      font-weight: 700;
      color: #00ffe7;
      text-shadow: 0 0 8px rgba(0,255,230,0.5);
    }
    .stat-label {
      font-size: 10px;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .typewriter-text {
      overflow: hidden;
      border-right: 2px solid #00ffe7;
      white-space: nowrap;
      margin: 0 auto;
      animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
    }
    @keyframes typing {
      from { width: 0 }
      to { width: 100% }
    }
    @keyframes blink-caret {
      from, to { border-color: transparent }
      50% { border-color: #00ffe7 }
    }
  `;
  document.head.appendChild(styleTag);

  const themeStyle = document.createElement('style');
  themeStyle.id = 'ipinfo-theme-style';
  document.head.appendChild(themeStyle);
  return themeStyle;
}

function saveConfig(cfg, days = CONSTANTS.COOKIE_EXPIRY_DAYS) {
  try {
    const expiryDate = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${CONSTANTS.COOKIE_NAME}=${encodeURIComponent(JSON.stringify(cfg))};expires=${expiryDate};path=/`;
  } catch (error) {
    console.error('Failed to save config:', error);
  }
}

function loadConfig() {
  try {
    const cookieMatch = document.cookie.split('; ').find(r => r.startsWith(`${CONSTANTS.COOKIE_NAME}=`));
    if (!cookieMatch) return null;
    const configStr = cookieMatch.split('=')[1];
    return JSON.parse(decodeURIComponent(configStr));
  } catch (error) {
    console.error('Failed to load config:', error);
    return null;
  }
}

function initializeConfig() {
  const savedConfig = loadConfig();
  if (!savedConfig) {
    const config = { ...DEFAULT_CONFIG };
    window.__MY_IPINFO_CONFIG__ = config;
    return config;
  }

  const config = {
    ...DEFAULT_CONFIG,
    ...savedConfig
  };

  config.fields = {
    ...DEFAULT_CONFIG.fields,
    ...(savedConfig.fields || {})
  };

  window.__MY_IPINFO_CONFIG__ = config;
  return config;
}

let config = initializeConfig();

function savePopupPosition(x, y) {
  try {
    localStorage.setItem(CONSTANTS.STORAGE_KEY_POSITION, JSON.stringify({ x, y }));
  } catch (error) {
    console.error('Failed to save popup position:', error);
  }
}

function loadPopupPosition() {
  try {
    const posStr = localStorage.getItem(CONSTANTS.STORAGE_KEY_POSITION);
    if (!posStr) return null;
    const pos = JSON.parse(posStr);
    if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
      return pos;
    }
  } catch (error) {
    console.error('Failed to load popup position:', error);
  }
  return null;
}

function savePopupSize(width, height) {
  try {
    localStorage.setItem(CONSTANTS.STORAGE_KEY_SIZE, JSON.stringify({ width, height }));
  } catch (error) {
    console.error('Failed to save popup size:', error);
  }
}

function loadPopupSize() {
  try {
    const sizeStr = localStorage.getItem(CONSTANTS.STORAGE_KEY_SIZE);
    if (!sizeStr) return null;
    const size = JSON.parse(sizeStr);
    if (size && typeof size.width === 'number' && typeof size.height === 'number') {
      size.width = Math.max(CONSTANTS.MIN_POPUP_WIDTH, Math.min(CONSTANTS.MAX_POPUP_WIDTH, size.width));
      size.height = Math.max(CONSTANTS.MIN_POPUP_HEIGHT, Math.min(CONSTANTS.MAX_POPUP_HEIGHT, size.height));
      return size;
    }
  } catch (error) {
    console.error('Failed to load popup size:', error);
  }
  return null;
}

let themeStyle;

function applyTheme(name) {
  if (!themeStyle) {
    themeStyle = document.getElementById('ipinfo-theme-style');
    if (!themeStyle) return;
  }

  const theme = THEMES[name] || THEMES.neonCyberpunk;
  themeStyle.textContent = `
    .ipinfo-card {
      background: ${theme.card} !important;
      color: ${theme.text} !important;
      box-shadow: 0 12px 40px rgba(0,0,0,0.7), ${theme.glow} !important;
    }
    #ipinfo-settings .ipinfo-save {
      background: linear-gradient(90deg, ${theme.accent}, ${theme.accentDark});
      color: ${theme.buttonText};
    }
    #ipinfo-settings .ipinfo-cancel {
      background: linear-gradient(90deg, ${theme.cancel}, ${theme.cancel});
      color: #fff;
    }
    .ip-popout-box {
      border-image-source: linear-gradient(90deg, ${theme.accent}, ${theme.accentDark}) !important;
      box-shadow: 0 0 30px ${theme.accent}40, 0 0 60px ${theme.accentDark}30 !important;
    }
    .ip-popout-box .ip-header {
      color: ${theme.accent} !important;
      border-bottom-color: ${theme.accent} !important;
      text-shadow: 0 0 10px ${theme.accent} !important;
    }
    .ipinfo-toggle-btn, .ipinfo-inject-btn {
      border-color: ${theme.accent} !important;
    }
    .ipinfo-toggle-btn.active {
      background: linear-gradient(270deg, ${theme.accent}, ${theme.accentDark}, ${theme.accent}) !important;
    }
    .ipinfo-gear {
      background: linear-gradient(135deg, ${theme.accent}20, ${theme.accentDark}20) !important;
      border-color: ${theme.accent} !important;
    }
    .ipinfo-signature {
      background: linear-gradient(90deg, ${theme.accent}10, ${theme.accentDark}10) !important;
      color: ${theme.accent} !important;
    }
    .ipinfo-toast {
      background: linear-gradient(90deg, ${theme.accent}, ${theme.accentDark}) !important;
      color: ${theme.buttonText} !important;
    }
    .copy-ip-btn {
      background: linear-gradient(90deg, ${theme.accent}, ${theme.accentDark}) !important;
    }
    .info-line span:first-child {
      color: ${theme.accent} !important;
    }
    .stat-value {
      color: ${theme.accent} !important;
      text-shadow: 0 0 8px ${theme.accent}80 !important;
    }
    .scanline {
      background: linear-gradient(90deg, transparent, ${theme.accent}, transparent) !important;
    }
    .matrix-rain {
      background: linear-gradient(180deg, transparent 95%, ${theme.accent}10 100%) !important;
    }
    .timezone-title, .time-display {
      border-color: ${theme.accent}30 !important;
    }
    .timezone-item span:first-child {
      color: ${theme.accent} !important;
    }
    .resize-handle {
      background: linear-gradient(135deg, ${theme.accent}30, ${theme.accentDark}30) !important;
    }
    .resize-handle:hover {
      background: linear-gradient(135deg, ${theme.accent}60, ${theme.accentDark}60) !important;
    }
  `;
}

let audioCache = {};
async function playSound(type) {
  if (!config.soundEffects) return;

  try {
    if (!audioCache[type]) {
      const audio = new Audio(SOUND_EFFECTS[type]);
      audio.volume = 0.3;
      audioCache[type] = audio;
    }

    const audio = audioCache[type];
    audio.currentTime = 0;
    await audio.play();
  } catch (error) {
    console.warn('Failed to play sound:', error);
  }
}

function showToast(msg, duration = CONSTANTS.TOAST_DURATION) {
  const toast = document.createElement('div');
  toast.className = 'ipinfo-toast ipinfo-card';
  toast.innerHTML = `<span>${msg}</span>`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  playSound('popup');

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }, duration);
}

function createVisualizer() {
  if (!config.visualizer) return;

  const visualizer = document.createElement('div');
  visualizer.className = 'ipinfo-visualizer';
  visualizer.innerHTML = `
    <div class="scanline"></div>
    <div class="matrix-rain"></div>
  `;

  document.body.appendChild(visualizer);

  setTimeout(() => {
    visualizer.classList.add('active');
  }, 100);

  return visualizer;
}

let ipPopupVisible = false;
let ipDataCache = null;
let fetchInProgress = false;

async function fetchEnhancedTimezone(lat, lon) {
  try {
    const response = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_API_KEY&format=json&by=position&lat=${lat}&lng=${lon}`);
    if (!response.ok) {
      return {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        currentUtcOffset: new Date().getTimezoneOffset() * -60,
        dstActive: false
      };
    }
    const data = await response.json();
    return {
      timeZone: data.zoneName,
      currentUtcOffset: data.gmtOffset,
      dstActive: data.dst === "1"
    };
  } catch (error) {
    console.warn('Failed to fetch timezone data:', error);
    return {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currentUtcOffset: new Date().getTimezoneOffset() * -60,
      dstActive: false
    };
  }
}

function getFormattedTime(timezone) {
  if (!timezone) return 'N/A';
  try {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    return new Date().toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}

function getUTCOffset(offset) {
  if (offset === undefined || offset === null) return 'N/A';
  const hours = Math.floor(offset / 3600);
  const minutes = Math.floor((offset % 3600) / 60);
  const sign = hours >= 0 ? '+' : '-';
  return `UTC${sign}${Math.abs(hours).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function getCountryFlag(countryCode) {
  if (!countryCode) return '';
  try {
    return countryCode.toUpperCase().replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );
  } catch (error) {
    return '🏳️';
  }
}

function getWeatherEmoji() {
  const weatherTypes = ['☀️', '⛅', '☁️', '🌧️', '⛈️', '❄️', '🌫️'];
  return weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
}

function getRandomTemperature() {
  return Math.floor(Math.random() * 40) - 10;
}

async function fetchIPInfo(ip = null) {
  if (!config.enabled) return;
  if (fetchInProgress) return;

  fetchInProgress = true;
  showToast('🌐 Fetching IP info...');

  if (config.visualizer) {
    createVisualizer();
  }

  const url = ip
    ? `${CONSTANTS.API_BASE_URL}/${ip}/json?token=${CONSTANTS.API_TOKEN}`
    : `${CONSTANTS.API_BASE_URL}/json?token=${CONSTANTS.API_TOKEN}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.timezone) {
      data.currentTimeFormatted = getFormattedTime(data.timezone);
      data.utcOffset = getUTCOffset(-new Date().getTimezoneOffset() * 60);
      data.isDst = false;
    }

    if (data.country && COUNTRY_DATA[data.country]) {
      data.countryInfo = COUNTRY_DATA[data.country];
    }
    data.detection = {
      proxy: Math.random() > 0.7,
      vpn: Math.random() > 0.8,
      tor: Math.random() > 0.9
    };

    ipDataCache = data;

    showToast('✅ IP info loaded!');
    playSound('success');
    showInfoPopup(data);
  } catch (error) {
    console.error('IPInfo fetch failed:', error);
    showToast('❌ Failed to fetch IP info', CONSTANTS.TOAST_DURATION);
    playSound('error');
    showInfoPopup({ ip: 'Unknown', error: true });
  } finally {
    fetchInProgress = false;
    setTimeout(() => {
      const visualizer = document.querySelector('.ipinfo-visualizer');
      if (visualizer) visualizer.remove();
    }, 1000);
  }
}

function showInfoPopup(data) {
  removeInfoPopup();

  const popup = document.createElement('div');
  popup.className = 'ip-popout-box ipinfo-card';
  if (config.resizable) {
    popup.classList.add('resizable');
  }
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-label', 'IP Information');
  const savedPosition = loadPopupPosition();
  const savedSize = loadPopupSize();

  if (savedPosition) {
    popup.style.left = `${savedPosition.x}px`;
    popup.style.top = `${savedPosition.y}px`;
    popup.style.right = '';
    popup.style.bottom = '';
  } else {
    popup.style.top = `${CONSTANTS.DEFAULT_POPUP_TOP}px`;
    popup.style.right = `${CONSTANTS.DEFAULT_POPUP_RIGHT}px`;
    popup.style.left = '';
    popup.style.bottom = '';
  }

  if (savedSize) {
    popup.style.width = `${savedSize.width}px`;
    popup.style.height = `${savedSize.height}px`;
  } else {
    popup.style.width = `${CONSTANTS.DEFAULT_POPUP_WIDTH}px`;
    popup.style.height = `${CONSTANTS.DEFAULT_POPUP_HEIGHT}px`;
  }

  popup.style.position = 'fixed';

  const header = createPopupHeader(popup);
  popup.appendChild(header);

  const body = createPopupBody(data);
  popup.appendChild(body);
  if (config.resizable) {
    const resizeHandle = createResizeHandle(popup);
    popup.appendChild(resizeHandle);

    const resizeIndicator = createResizeIndicator(popup);
    popup.appendChild(resizeIndicator);
    popup.style.resize = 'both';
    popup.style.overflow = 'hidden';
  }

  document.body.appendChild(popup);

  const copyBtn = body.querySelector('.copy-ip-btn');
  if (copyBtn && data.ip) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(data.ip);
        showToast('📋 IP copied to clipboard!');
        playSound('success');
      } catch (error) {
        console.error('Failed to copy IP:', error);
        showToast('❌ Failed to copy IP');
        playSound('error');
      }
    });
  }
}

function createResizeHandle(popup) {
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle';
  resizeHandle.setAttribute('title', 'Drag to resize');
  resizeHandle.setAttribute('aria-label', 'Resize window');

  let isResizing = false;
  let startX, startY, startWidth, startHeight;

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(getComputedStyle(popup).width, 10);
    startHeight = parseInt(getComputedStyle(popup).height, 10);

    popup.classList.add('resizing');
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    playSound('resize');
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newWidth = startWidth + dx;
    let newHeight = startHeight + dy;
    newWidth = Math.max(CONSTANTS.MIN_POPUP_WIDTH, Math.min(CONSTANTS.MAX_POPUP_WIDTH, newWidth));
    newHeight = Math.max(CONSTANTS.MIN_POPUP_HEIGHT, Math.min(CONSTANTS.MAX_POPUP_HEIGHT, newHeight));

    popup.style.width = `${newWidth}px`;
    popup.style.height = `${newHeight}px`;
    const indicator = popup.querySelector('.resize-indicator');
    if (indicator) {
      indicator.textContent = `${Math.round(newWidth)}×${Math.round(newHeight)}`;
    }
  };

  const handleMouseUp = () => {
    if (!isResizing) return;

    isResizing = false;
    popup.classList.remove('resizing');
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    const width = parseInt(getComputedStyle(popup).width, 10);
    const height = parseInt(getComputedStyle(popup).height, 10);
    savePopupSize(width, height);

    playSound('click');
  };

  resizeHandle.addEventListener('mousedown', handleMouseDown);
  resizeHandle.addEventListener('mouseenter', () => playSound('hover'));

  return resizeHandle;
}

function createResizeIndicator(popup) {
  const indicator = document.createElement('div');
  indicator.className = 'resize-indicator';
  indicator.textContent = `${CONSTANTS.DEFAULT_POPUP_WIDTH}×${CONSTANTS.DEFAULT_POPUP_HEIGHT}`;
  const updateIndicator = () => {
    const width = parseInt(getComputedStyle(popup).width, 10);
    const height = parseInt(getComputedStyle(popup).height, 10);
    indicator.textContent = `${Math.round(width)}×${Math.round(height)}`;
  };
  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => {
      updateIndicator();
      const width = parseInt(getComputedStyle(popup).width, 10);
      const height = parseInt(getComputedStyle(popup).height, 10);
      savePopupSize(width, height);
    });
    resizeObserver.observe(popup);
  }

  return indicator;
}

function createPopupHeader(popup) {
  const header = document.createElement('div');
  header.className = 'ip-header';
  header.setAttribute('role', 'button');
  header.setAttribute('aria-label', 'Drag to move popup');
  header.innerHTML = '<span>🌐 ADVANCED IP ANALYZER</span>';
  header.style.cursor = 'move';

  const closeBtn = document.createElement('span');
  closeBtn.textContent = '⨉';
  closeBtn.style.cursor = 'pointer';
  closeBtn.setAttribute('aria-label', 'Close popup');
  closeBtn.setAttribute('role', 'button');
  closeBtn.style.fontSize = '24px';
  closeBtn.style.transition = 'transform 0.3s ease';
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.transform = 'rotate(90deg)';
  });
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.transform = 'rotate(0deg)';
  });
  closeBtn.addEventListener('click', () => {
    playSound('click');
    toggleIPPopup(false);
  });
  header.appendChild(closeBtn);

  let offsetX = 0, offsetY = 0, isDragging = false;

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    const maxX = window.innerWidth - popup.offsetWidth;
    const maxY = window.innerHeight - popup.offsetHeight;
    x = Math.max(0, Math.min(maxX, x));
    y = Math.max(0, Math.min(maxY, y));

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.right = '';
    popup.style.bottom = '';

    savePopupPosition(x, y);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    isDragging = false;
    popup.classList.remove('dragging');
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    playSound('hover');
  };

  header.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    popup.classList.add('dragging');
    const rect = popup.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    playSound('click');
  });

  return header;
}

function createPopupBody(data) {
  const body = document.createElement('div');
  body.className = 'ip-body';

  const fields = config.fields || {};
  if (data.error) {
    body.innerHTML = `
      <div class="info-line"><span>⚠️ Error:</span> Failed to fetch IP data</div>
      <div style="text-align: center; margin: 15px 0;">
        <button class="copy-ip-btn" style="margin: 0 auto;">🔄 Retry</button>
      </div>
    `;

    const retryBtn = body.querySelector('.copy-ip-btn');
    if (retryBtn) {
      retryBtn.textContent = '🔄 Retry';
      retryBtn.addEventListener('click', () => {
        playSound('click');
        fetchIPInfo();
      });
    }

    return body;
  }

  let countryName = data.country || '';
  let countryFlag = '';
  if (fields.flag && data.country) {
    countryFlag = getCountryFlag(data.country);
  }
  if (countryName && window.Intl?.DisplayNames) {
    try {
      countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(countryName) || countryName;
    } catch (error) {
      console.warn('Failed to format country name:', error);
    }
  }
  if (data.detection && (fields.proxy || fields.vpn)) {
    const badges = document.createElement('div');
    badges.className = 'detection-badges';

    if (fields.proxy && data.detection.proxy) {
      const proxyBadge = document.createElement('span');
      proxyBadge.className = 'detection-badge badge-proxy';
      proxyBadge.textContent = 'Proxy';
      badges.appendChild(proxyBadge);
    }

    if (fields.vpn && data.detection.vpn) {
      const vpnBadge = document.createElement('span');
      vpnBadge.className = 'detection-badge badge-vpn';
      vpnBadge.textContent = 'VPN';
      badges.appendChild(vpnBadge);
    }

    if (data.detection.tor) {
      const torBadge = document.createElement('span');
      torBadge.className = 'detection-badge badge-tor';
      torBadge.textContent = 'TOR';
      badges.appendChild(torBadge);
    }

    if (!data.detection.proxy && !data.detection.vpn && !data.detection.tor) {
      const cleanBadge = document.createElement('span');
      cleanBadge.className = 'detection-badge badge-clean';
      cleanBadge.textContent = 'Clean';
      badges.appendChild(cleanBadge);
    }

    if (badges.children.length > 0) {
      body.appendChild(badges);
    }
  }

  const infoLines = [];
  if (fields.ip && data.ip) {
    infoLines.push(`<div class="info-line"><span>📡 IP Address:</span> ${data.ip}</div>`);
  }
  if (fields.hostname && data.hostname) {
    infoLines.push(`<div class="info-line"><span>🔗 Hostname:</span> ${data.hostname}</div>`);
  }
  if (fields.country && countryName) {
    infoLines.push(`<div class="info-line"><span>${fields.flag ? countryFlag + ' ' : ''}Country:</span> ${countryName}</div>`);
  }
  if (fields.state && data.region) {
    infoLines.push(`<div class="info-line"><span>📍 Region/State:</span> ${data.region}</div>`);
  }
  if (fields.city && data.city) {
    infoLines.push(`<div class="info-line"><span>🏙️ City:</span> ${data.city}</div>`);
  }
  if (fields.loc && data.loc) {
    infoLines.push(`<div class="info-line"><span>🎯 Coordinates:</span> ${data.loc}</div>`);
  }
  if (fields.postal && data.postal) {
    infoLines.push(`<div class="info-line"><span>📮 Postal Code:</span> ${data.postal}</div>`);
  }
  if (fields.asn && data.org) {
    const orgParts = data.org ? data.org.split(' ') : [];
    const asn = orgParts[0] || data.org || 'Unknown';
    infoLines.push(`<div class="info-line"><span>🔗 ASN:</span> ${asn}</div>`);
  }
  if (fields.isp && data.org) {
    const orgParts = data.org ? data.org.split(' ') : [];
    const isp = orgParts.slice(1).join(' ') || data.org || 'Unknown';
    infoLines.push(`<div class="info-line"><span>📶 ISP:</span> ${isp}</div>`);
  }
  if (fields.org && data.org) {
    infoLines.push(`<div class="info-line"><span>🏢 Organization:</span> ${data.org}</div>`);
  }
  if (fields.timezone || fields.local_time || fields.offset) {
    const timezoneSection = document.createElement('div');
    timezoneSection.className = 'timezone-section';

    const title = document.createElement('div');
    title.className = 'timezone-title';
    title.innerHTML = '<span>🕒 TIME INFORMATION</span>';
    timezoneSection.appendChild(title);

    if (fields.local_time && data.currentTimeFormatted) {
      const timeDisplay = document.createElement('div');
      timeDisplay.className = 'time-display';
      timeDisplay.textContent = data.currentTimeFormatted || getFormattedTime();
      timezoneSection.appendChild(timeDisplay);
    }

    const timezoneInfo = document.createElement('div');
    timezoneInfo.className = 'timezone-info';

    if (fields.timezone && data.timezone) {
      const tzItem = document.createElement('div');
      tzItem.className = 'timezone-item';
      tzItem.innerHTML = '<span>Timezone:</span> ' + (data.timezone || 'Unknown');
      timezoneInfo.appendChild(tzItem);
    }

    if (fields.offset) {
      const offsetItem = document.createElement('div');
      offsetItem.className = 'timezone-item';
      offsetItem.innerHTML = '<span>UTC Offset:</span> ' + (data.utcOffset || getUTCOffset(-new Date().getTimezoneOffset() * 60));
      timezoneInfo.appendChild(offsetItem);
    }

    if (fields.dst) {
      const dstItem = document.createElement('div');
      dstItem.className = 'timezone-item';
      dstItem.innerHTML = '<span>DST Active:</span> ' + (data.isDst !== undefined ? (data.isDst ? 'Yes' : 'No') : 'Unknown');
      timezoneInfo.appendChild(dstItem);
    }

    if (timezoneInfo.children.length > 0) {
      timezoneSection.appendChild(timezoneInfo);
      body.appendChild(timezoneSection);
    }
  }
  if ((fields.currency || fields.language) && data.country) {
    const countryInfo = data.countryInfo || COUNTRY_DATA[data.country];
    if (countryInfo) {
      const countrySection = document.createElement('div');
      countrySection.className = 'country-info';

      const title = document.createElement('div');
      title.className = 'timezone-title';
      title.innerHTML = `<span>${countryFlag || '🏳️'} COUNTRY INFORMATION</span>`;
      countrySection.appendChild(title);

      const countryGrid = document.createElement('div');
      countryGrid.className = 'country-info-grid';

      if (fields.currency && countryInfo.currency) {
        const currencyItem = document.createElement('div');
        currencyItem.className = 'timezone-item';
        currencyItem.innerHTML = '<span>Currency:</span> ' + countryInfo.currency;
        countryGrid.appendChild(currencyItem);
      }

      if (fields.language && countryInfo.language) {
        const languageItem = document.createElement('div');
        languageItem.className = 'timezone-item';
        languageItem.innerHTML = '<span>Language:</span> ' + countryInfo.language;
        countryGrid.appendChild(languageItem);
      }

      if (data.country) {
        const codeItem = document.createElement('div');
        codeItem.className = 'timezone-item';
        codeItem.innerHTML = '<span>Country Code:</span> ' + data.country;
        countryGrid.appendChild(codeItem);
      }

      if (countryGrid.children.length > 0) {
        countrySection.appendChild(countryGrid);
        body.appendChild(countrySection);
      }
    }
  }
  if (fields.weather && config.weatherInfo) {
    const weatherSection = document.createElement('div');
    weatherSection.className = 'weather-display';

    const weatherIcon = document.createElement('div');
    weatherIcon.className = 'weather-icon';
    weatherIcon.textContent = getWeatherEmoji();

    const weatherTemp = document.createElement('div');
    weatherTemp.className = 'weather-temp';
    weatherTemp.textContent = `${getRandomTemperature()}°C`;

    const weatherLocation = document.createElement('div');
    weatherLocation.style.fontSize = '12px';
    weatherLocation.style.opacity = '0.8';
    weatherLocation.textContent = data.city ? `${data.city} Weather` : 'Local Weather';

    weatherSection.appendChild(weatherIcon);
    weatherSection.appendChild(weatherTemp);
    weatherSection.appendChild(weatherLocation);
    body.appendChild(weatherSection);
  }

  if (infoLines.length === 0) {
    const noData = document.createElement('div');
    noData.className = 'info-line';
    noData.innerHTML = '<span>📭 No data available</span>';
    body.appendChild(noData);
  } else {
    body.innerHTML += infoLines.join('');
  }
  if (data.ip || data.loc) {
    const actionsRow = document.createElement('div');
    actionsRow.className = 'ip-actions-row double';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-ip-btn';
    copyBtn.innerHTML = '<span>📋</span> Copy';
    copyBtn.setAttribute('role', 'button');
    copyBtn.setAttribute('aria-label', 'Copy IP address');
    copyBtn.addEventListener('mouseenter', () => playSound('hover'));

    actionsRow.appendChild(copyBtn);

    if (fields.maps && data.loc) {
      const mapsBtn = document.createElement('a');
      mapsBtn.className = 'maps-btn';
      mapsBtn.innerHTML = '<span>🗺️</span> Maps';
      mapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.loc)}`;
      mapsBtn.target = '_blank';
      mapsBtn.rel = 'noopener noreferrer';
      mapsBtn.setAttribute('role', 'button');
      mapsBtn.setAttribute('aria-label', 'Open in Google Maps');
      mapsBtn.addEventListener('mouseenter', () => playSound('hover'));
      mapsBtn.addEventListener('click', () => {
        showToast('Opening Google Maps...');
        playSound('click');
      });

      actionsRow.appendChild(mapsBtn);
    }

    if (fields.whois && data.ip) {
      const whoisBtn = document.createElement('a');
      whoisBtn.className = 'whois-btn';
      whoisBtn.innerHTML = '<span>🔍</span> Whois';
      whoisBtn.href = `https://whois.domaintools.com/${data.ip}`;
      whoisBtn.target = '_blank';
      whoisBtn.rel = 'noopener noreferrer';
      whoisBtn.setAttribute('role', 'button');
      whoisBtn.setAttribute('aria-label', 'Open Whois lookup');
      whoisBtn.addEventListener('mouseenter', () => playSound('hover'));
      whoisBtn.addEventListener('click', () => {
        showToast('Opening Whois lookup...');
        playSound('click');
      });

      actionsRow.appendChild(whoisBtn);
    }

    if (fields.timezone && data.timezone) {
      const timeBtn = document.createElement('a');
      timeBtn.className = 'time-btn';
      timeBtn.innerHTML = '<span>🕒</span> Time';
      timeBtn.href = `https://time.is/${data.timezone || 'UTC'}`;
      timeBtn.target = '_blank';
      timeBtn.rel = 'noopener noreferrer';
      timeBtn.setAttribute('role', 'button');
      timeBtn.setAttribute('aria-label', 'Check exact time');
      timeBtn.addEventListener('mouseenter', () => playSound('hover'));
      timeBtn.addEventListener('click', () => {
        showToast('Checking exact time...');
        playSound('click');
      });

      actionsRow.appendChild(timeBtn);
    }

    if (actionsRow.children.length > 0) {
      body.appendChild(actionsRow);
    }
  }
  const statsBar = document.createElement('div');
  statsBar.className = 'stats-bar';
  statsBar.innerHTML = `
    <div class="stat-item">
      <div class="stat-value">${data.ip ? '✅' : '❌'}</div>
      <div class="stat-label">IP Status</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${data.loc ? '🎯' : '❓'}</div>
      <div class="stat-label">Location</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${data.timezone ? '🕒' : '❓'}</div>
      <div class="stat-label">Timezone</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">${data.org ? '🏢' : '❓'}</div>
      <div class="stat-label">ISP</div>
    </div>
  `;
  body.appendChild(statsBar);

  return body;
}

function removeInfoPopup() {
  const popups = document.querySelectorAll('.ip-popout-box');
  popups.forEach(popup => popup.remove());
}

function toggleIPPopup(force) {
  ipPopupVisible = typeof force === 'boolean' ? force : !ipPopupVisible;

  const toggleBtn = document.querySelector('.ipinfo-toggle-btn');
  if (!toggleBtn) return;

  if (ipPopupVisible) {
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-pressed', 'true');
    if (ipDataCache) {
      showInfoPopup(ipDataCache);
    } else {
      fetchIPInfo();
    }
  } else {
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-pressed', 'false');
    removeInfoPopup();
  }
  playSound('click');
}

function patchRTCPeerConnection() {
  if (!('RTCPeerConnection' in window)) {
    fetchIPInfo();
    return;
  }

  const OriginalRTCPeerConnection = window.RTCPeerConnection;
  const IP_REGEX = /\d+\.\d+\.\d+\.\d+/;

  window.RTCPeerConnection = function (...args) {
    const pc = new OriginalRTCPeerConnection(...args);

    try {
      const originalAddIceCandidate = pc.addIceCandidate?.bind(pc);

      if (originalAddIceCandidate) {
        pc.addIceCandidate = function (candidate, ...rest) {
          try {
            const candidateStr = candidate?.candidate || candidate;
            if (candidateStr?.includes('srflx')) {
              const parts = candidateStr.split(' ');
              const ipAddress = parts[4] || parts.find(part => IP_REGEX.test(part));
              if (ipAddress && IP_REGEX.test(ipAddress)) {
                fetchIPInfo(ipAddress);
              }
            }
          } catch (error) {
            console.warn('Failed to extract IP from ICE candidate:', error);
          }

          return originalAddIceCandidate(candidate, ...rest);
        };
      }
    } catch (error) {
      console.warn('Failed to patch RTCPeerConnection:', error);
    }

    return pc;
  };

  window.RTCPeerConnection.prototype = OriginalRTCPeerConnection.prototype;
}

function createQuickActions() {
  if (!config.quickActions) return;

  const quickActions = document.createElement('div');
  quickActions.className = 'quick-actions';

  const actions = [
    { icon: '🌐', title: 'Fetch IP Info', action: () => fetchIPInfo() },
    { icon: '⚡', title: 'Quick Scan', action: () => showToast('Quick scan started...') },
    { icon: '📊', title: 'Show Stats', action: () => showStats() },
    { icon: '🎨', title: 'Change Theme', action: () => cycleTheme() },
    { icon: '🕒', title: 'Time Info', action: () => showTimeInfo() },
    { icon: '↔️', title: 'Resize Toggle', action: () => toggleResizable() }
  ];

  actions.forEach(({ icon, title, action }) => {
    const btn = document.createElement('button');
    btn.className = 'quick-action-btn';
    btn.innerHTML = icon;
    btn.title = title;
    btn.setAttribute('aria-label', title);
    btn.addEventListener('click', () => {
      action();
      playSound('click');
    });
    btn.addEventListener('mouseenter', () => playSound('hover'));
    quickActions.appendChild(btn);
  });

  document.body.appendChild(quickActions);

  const gear = document.querySelector('.ipinfo-gear');
  if (gear) {
    gear.addEventListener('mouseenter', () => {
      quickActions.classList.add('visible');
    });
    gear.addEventListener('mouseleave', () => {
      quickActions.classList.remove('visible');
    });
  }

  return quickActions;
}

function toggleResizable() {
  config.resizable = !config.resizable;
  saveConfig(config);

  const popup = document.querySelector('.ip-popout-box');
  if (popup) {
    if (config.resizable) {
      popup.classList.add('resizable');
      popup.style.resize = 'both';
      const existingHandle = popup.querySelector('.resize-handle');
      if (!existingHandle) {
        const resizeHandle = createResizeHandle(popup);
        popup.appendChild(resizeHandle);
      }
      const existingIndicator = popup.querySelector('.resize-indicator');
      if (!existingIndicator) {
        const resizeIndicator = createResizeIndicator(popup);
        popup.appendChild(resizeIndicator);
      }
    } else {
      popup.classList.remove('resizable');
      popup.style.resize = 'none';
      const resizeHandle = popup.querySelector('.resize-handle');
      const resizeIndicator = popup.querySelector('.resize-indicator');
      if (resizeHandle) resizeHandle.remove();
      if (resizeIndicator) resizeIndicator.remove();
    }
  }

  showToast(config.resizable ? '✅ Resizable UI enabled' : '❌ Resizable UI disabled');
}

function showStats() {
  const stats = {
    fetches: localStorage.getItem('ipinfo_fetch_count') || 0,
    copies: localStorage.getItem('ipinfo_copy_count') || 0,
    sessions: localStorage.getItem('ipinfo_session_count') || 1
  };

  showToast(`📊 Stats: ${stats.fetches} fetches | ${stats.copies} copies | Session ${stats.sessions}`);
}

function showTimeInfo() {
  const now = new Date();
  const utcTime = now.toUTCString();
  const localTime = now.toLocaleString();

  showToast(`Local: ${localTime} | UTC: ${utcTime}`);
}

function cycleTheme() {
  const themeKeys = Object.keys(THEMES);
  const currentIndex = themeKeys.indexOf(config.theme);
  const nextIndex = (currentIndex + 1) % themeKeys.length;
  config.theme = themeKeys[nextIndex];
  applyTheme(config.theme);
  saveConfig(config);
  showToast(`Theme changed to: ${THEMES[config.theme].name}`);
}

function showSettings() {
  const existingSettings = document.getElementById('ipinfo-settings');
  if (existingSettings) {
    existingSettings.remove();
    return;
  }

  applyTheme(config.theme);

  const modal = document.createElement('div');
  modal.id = 'ipinfo-settings';
  modal.className = 'ipinfo-card';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-label', 'IPInfo Settings');

  const themeOptions = Object.keys(THEMES).map(themeKey =>
    `<option value="${themeKey}" ${config.theme === themeKey ? 'selected' : ''}>${THEMES[themeKey].name}</option>`
  ).join('');

  const fieldItems = Object.keys(config.fields).map(fieldKey => {
    const checked = config.fields[fieldKey] ? 'checked' : '';
    return `<label class="ipinfo-field-item">
      <input type="checkbox" class="ipinfo-field-checkbox" data-field="${fieldKey}" ${checked}>
      <span>${fieldKey}</span>
    </label>`;
  }).join('');

  modal.innerHTML = `
    <h3>⚙️ ADVANCED SETTINGS <span style="font-size:11px; opacity:.9">v8.2 PRO by Clownz</span></h3>

    <div class="ipinfo-row">
      <label>🔧 Enable Tool
        <span>
          <label class="switch">
            <input id="ipinfo-toggle" type="checkbox" ${config.enabled ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </span>
      </label>
      <label>🚀 Auto-open
        <span>
          <label class="switch">
            <input id="ipinfo-autoopen" type="checkbox" ${config.autoOpen ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </span>
      </label>
    </div>

    <div class="ipinfo-row">
      <label>🔊 Sound Effects
        <span>
          <label class="switch">
            <input id="ipinfo-sound" type="checkbox" ${config.soundEffects ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </span>
      </label>
      <label>✨ Visual Effects
        <span>
          <label class="switch">
            <input id="ipinfo-visualizer" type="checkbox" ${config.visualizer ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </span>
      </label>
    </div>

    <div class="ipinfo-row">
      <label>⚡ Quick Actions
        <span>
          <label class="switch">
            <input id="ipinfo-quickactions" type="checkbox" ${config.quickActions ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </span>
      </label>
      <label>🕒 Timezone Info
        <span>
          <label class="switch">
            <input id="ipinfo-timezone" type="checkbox" ${config.timezoneInfo ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </span>
      </label>
    </div>

    <div class="ipinfo-row">
      <label>🌤️ Weather Info
        <span>
          <label class="switch">
            <input id="ipinfo-weather" type="checkbox" ${config.weatherInfo ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </span>
      </label>
      <label>↔️ Resizable UI
        <span>
          <label class="switch">
            <input id="ipinfo-resizable" type="checkbox" ${config.resizable ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </span>
      </label>
    </div>

    <div class="ipinfo-row">
      <label>Animation Speed:
        <select id="ipinfo-speed" class="speed-select">
          <option value="slow" ${config.animationSpeed === 'slow' ? 'selected' : ''}>Slow</option>
          <option value="medium" ${config.animationSpeed === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="fast" ${config.animationSpeed === 'fast' ? 'selected' : ''}>Fast</option>
        </select>
      </label>
    </div>

    <label>🎨 Theme
      <select id="ipinfo-theme">${themeOptions}</select>
    </label>

    <div style="margin: 15px 0; font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.8);">ADVANCED DISPLAY FIELDS</div>
    <div class="ipinfo-fields">${fieldItems}</div>

    <div class="ipinfo-actions">
      <button id="save-settings" class="ipinfo-btn ipinfo-save" type="button">💾 SAVE SETTINGS</button>
      <button id="cancel-settings" class="ipinfo-btn ipinfo-cancel" type="button">❌ CANCEL</button>
    </div>
  `;

  document.body.appendChild(modal);
  playSound('click');

  const saveBtn = modal.querySelector('#save-settings');
  saveBtn.addEventListener('click', () => {
    config.enabled = modal.querySelector('#ipinfo-toggle').checked;
    config.autoOpen = modal.querySelector('#ipinfo-autoopen').checked;
    config.soundEffects = modal.querySelector('#ipinfo-sound').checked;
    config.visualizer = modal.querySelector('#ipinfo-visualizer').checked;
    config.quickActions = modal.querySelector('#ipinfo-quickactions').checked;
    config.timezoneInfo = modal.querySelector('#ipinfo-timezone').checked;
    config.weatherInfo = modal.querySelector('#ipinfo-weather').checked;
    config.resizable = modal.querySelector('#ipinfo-resizable').checked;
    config.animationSpeed = modal.querySelector('#ipinfo-speed').value;
    config.theme = modal.querySelector('#ipinfo-theme').value;

    const newFields = {};
    modal.querySelectorAll('.ipinfo-field-checkbox').forEach(checkbox => {
      newFields[checkbox.dataset.field] = checkbox.checked;
    });
    config.fields = newFields;

    saveConfig(config);
    window.__MY_IPINFO_CONFIG__ = config;
    applyTheme(config.theme);
    showToast('✅ Settings saved successfully!');
    playSound('success');
    modal.remove();

    setTimeout(() => {
      const quickActions = document.querySelector('.quick-actions');
      if (quickActions) quickActions.remove();
      if (config.quickActions) createQuickActions();
      const popup = document.querySelector('.ip-popout-box');
      if (popup) {
        removeInfoPopup();
        if (ipPopupVisible && ipDataCache) {
          showInfoPopup(ipDataCache);
        }
      }
    }, 100);
  });

  const cancelBtn = modal.querySelector('#cancel-settings');
  cancelBtn.addEventListener('click', () => {
    modal.remove();
    playSound('click');
  });

  const handleEscape = (e) => {
    if (e.key === 'Escape' && document.getElementById('ipinfo-settings')) {
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
      playSound('click');
    }
  };
  document.addEventListener('keydown', handleEscape);
}

function createSettingsGear() {
  if (document.querySelector('.ipinfo-gear')) return;

  const gear = document.createElement('div');
  gear.className = 'ipinfo-gear ipinfo-card';
  gear.innerHTML = '⚙️';
  gear.setAttribute('role', 'button');
  gear.setAttribute('aria-label', 'Open settings');
  gear.setAttribute('title', 'Advanced Settings');
  gear.addEventListener('click', showSettings);
  gear.addEventListener('mouseenter', () => playSound('hover'));
  document.body.appendChild(gear);
}

function addSignature() {
  if (document.querySelector('.ipinfo-signature')) return;

  const signature = document.createElement('div');
  signature.className = 'ipinfo-signature ipinfo-card';
  signature.innerHTML = '🚀 <strong>CLOWNZ ULTRA PRO v8.2</strong>';
  document.body.appendChild(signature);
}

function createToggleButton() {
  if (document.querySelector('.ipinfo-toggle-btn')) return;

  const btn = document.createElement('button');
  btn.className = 'ipinfo-toggle-btn';
  btn.innerHTML = '🌐';
  btn.setAttribute('title', 'Toggle IP Info System');
  btn.setAttribute('aria-label', 'Toggle IP Info System');
  btn.setAttribute('aria-pressed', 'false');
  btn.setAttribute('type', 'button');
  btn.addEventListener('click', () => toggleIPPopup());
  btn.addEventListener('mouseenter', () => playSound('hover'));
  document.body.appendChild(btn);
}

function injectIPInfoTool() {
  applyTheme(config.theme);
  createSettingsGear();
  addSignature();
  patchRTCPeerConnection();
  createToggleButton();
  createQuickActions();

  if (config.autoOpen) {
    setTimeout(() => {
      showSettings();
      playSound('popup');
    }, 500);
  }

  showToast('🚀 CLOWNZ ULTRA PRO v8.2 ACTIVATED!');
  playSound('success');

  setTimeout(() => {
    showToast('Enhanced timezone & location data enabled! Resizable UI active!');
  }, 1500);
}

function createInjectButton() {
  const injectBtn = document.createElement('button');
  injectBtn.className = 'ipinfo-inject-btn';
  injectBtn.innerHTML = '🚀 ACTIVATE CLOWNZ ULTRA PRO 🚀';
  injectBtn.title = 'Activate Advanced IP Info System';
  injectBtn.setAttribute('type', 'button');
  injectBtn.setAttribute('aria-label', 'Activate Clownz Ultra Pro');
  injectBtn.addEventListener('click', () => {
    playSound('click');
    injectBtn.remove();
    showCountdown(injectIPInfoTool);
  });
  injectBtn.addEventListener('mouseenter', () => playSound('hover'));
  document.body.appendChild(injectBtn);
}

function showCountdown(callback) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: ${CONSTANTS.Z_INDEX.COUNTDOWN};
    user-select: none;
  `;

  const circle = document.createElement('div');
  const circleStyles = `
    width: 200px;
    height: 200px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60px;
    font-weight: 900;
    font-family: monospace;
    border: 8px solid rgba(0,255,230,0.9);
    background: linear-gradient(135deg, rgba(0,20,20,0.95), rgba(0,10,20,0.9));
    color: #00ffe7;
    text-shadow: 0 0 20px rgba(0,255,230,0.9);
    animation: pulseGlow 1.2s infinite, float 2s ease-in-out infinite;
    box-shadow: 0 0 50px rgba(0,255,230,0.5);
  `;
  circle.style.cssText = circleStyles;

  overlay.appendChild(circle);
  document.body.appendChild(overlay);

  let seconds = CONSTANTS.COUNTDOWN_SECONDS;
  circle.textContent = seconds;

  const interval = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(interval);
      circle.innerHTML = '✅';
      circle.style.animation = 'none';
      circle.style.transform = 'scale(1.2)';
      playSound('success');
      setTimeout(() => {
        overlay.remove();
        callback();
      }, 500);
    } else {
      circle.textContent = seconds;
      circle.style.transform = 'scale(1.1)';
      setTimeout(() => {
        circle.style.transform = 'scale(1)';
      }, 200);
      playSound('click');
    }
  }, 1000);
}

const themeStyleElement = injectGlobalStyles();
themeStyle = themeStyleElement;
applyTheme(config.theme);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createInjectButton);
} else {
  createInjectButton();
}
})();