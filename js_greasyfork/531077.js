// ==UserScript==
// @name         LemonChat Dark Mode
// @namespace    http://lemonchat.app/
// @version      1.0
// @description  Adds a dark theme toggle to LemonChat
// @author       JuliaBanana
// @match        https://lemonchat.app/*
// @icon         https://lemonchat.app/img/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531077/LemonChat%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/531077/LemonChat%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
  const darkThemeStyle = document.createElement('style');
  darkThemeStyle.id = 'dark-theme-style';
  darkThemeStyle.textContent = `
    body.dark-theme {
      background-color: #121212 !important;
      color: #e0e0e0 !important;
    }

    body.dark-theme .text-left.text-black.mb-2 {
      color: #a0a0a0 !important;
    }

    body.dark-theme header {
      background: linear-gradient(135deg, #303f9f 0%, #512da8 50%, #303f9f 100%) !important;
    }

    body.dark-theme main {
      background-color: #121212 !important;
    }

    body.dark-theme #video-container {
      background-color: #1e1e1e !important;
    }

    body.dark-theme #remote-video-container {
      background-color: #000000 !important;
    }

    body.dark-theme #self-video-container {
      background-color: #333333 !important;
    }

    body.dark-theme #chat_container {
      background-color: #1e1e1e !important;
      border-color: #333333 !important;
    }

    body.dark-theme #system_msg {
      color: #a0a0a0 !important;
    }

    body.dark-theme hr {
      border-color: #333333 !important;
    }

    body.dark-theme #msg_container > div {
      background-color: #2a2a2a !important;
      color: #e0e0e0 !important;
    }

    body.dark-theme #input_container {
      background-color: #1e1e1e !important;
      border-color: #333333 !important;
    }

    body.dark-theme #text {
      background-color: #2a2a2a !important;
      color: #e0e0e0 !important;
      border-color: #444444 !important;
    }

    body.dark-theme #text::placeholder {
      color: #909090 !important;
    }

    body.dark-theme #emoji {
      color: #909090 !important;
    }

    body.dark-theme .bg-gradient-to-r.from-indigo-500 {
      background-image: linear-gradient(to right, #303f9f, #512da8) !important;
    }

    body.dark-theme #loginModal .bg-white,
    body.dark-theme #settingsModal .bg-white,
    body.dark-theme #premiumModal .bg-white {
      background-color: #1e1e1e !important;
      color: #e0e0e0 !important;
    }

    body.dark-theme .text-gray-700,
    body.dark-theme .text-gray-600,
    body.dark-theme .text-gray-500 {
      color: #b0b0b0 !important;
    }

    body.dark-theme .bg-white {
      background-color: #1e1e1e !important;
    }

    body.dark-theme .bg-gray-200,
    body.dark-theme .bg-gray-100,
    body.dark-theme .bg-indigo-50 {
      background-color: #333333 !important;
    }

    body.dark-theme .border-gray-200 {
      border-color: #333333 !important;
    }

    body.dark-theme #settingsModal .border-indigo-100 {
      border-color: #444444 !important;
    }

    body.dark-theme emoji-picker {
      --background: #2a2a2a !important;
      --color: #e0e0e0 !important;
      --border-color: #444444 !important;
      --category-border-color: #444444 !important;
      --input-border-color: #444444 !important;
      --input-font-color: #e0e0e0 !important;
      --input-placeholder-color: #909090 !important;
    }
  `;
  document.head.appendChild(darkThemeStyle);

  const existingToggle = document.getElementById('theme-toggle-container');
  if (existingToggle) {
    existingToggle.remove();
  }

  const toggleContainer = document.createElement('div');
  toggleContainer.id = 'theme-toggle-container';
  toggleContainer.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 8px 12px;
    border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  `;

  const themeLabel = document.createElement('span');
  themeLabel.id = 'theme-label';
  themeLabel.style.cssText = `
    color: white;
    margin-right: 8px;
    font-size: 14px;
    font-weight: bold;
  `;
  themeLabel.textContent = 'Dark Mode';

  const switchLabel = document.createElement('label');
  switchLabel.style.cssText = `
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    margin: 0;
  `;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'theme-toggle-checkbox';
  checkbox.style.cssText = `
    opacity: 0;
    width: 0;
    height: 0;
  `;

  const toggleBg = document.createElement('span');
  toggleBg.id = 'toggle-background';
  toggleBg.style.cssText = `
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
  `;

  const toggleCircle = document.createElement('span');
  toggleCircle.id = 'toggle-circle';
  toggleCircle.style.cssText = `
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
    transform: translateX(0px);
  `;

  switchLabel.appendChild(checkbox);
  switchLabel.appendChild(toggleBg);
  switchLabel.appendChild(toggleCircle);

  toggleContainer.appendChild(themeLabel);
  toggleContainer.appendChild(switchLabel);

  document.body.appendChild(toggleContainer);

  function toggleTheme(isDark) {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    toggleCircle.style.transform = isDark ? 'translateX(20px)' : 'translateX(0px)';
    toggleBg.style.backgroundColor = isDark ? '#6366F1' : '#ccc';
    themeLabel.textContent = isDark ? 'Dark Mode' : 'Light Mode';

    localStorage.setItem('lemonchat-dark-theme', isDark ? 'true' : 'false');
  }

  checkbox.addEventListener('change', function() {
    toggleTheme(this.checked);
  });

  themeLabel.addEventListener('click', function(e) {
    e.preventDefault();
    checkbox.checked = !checkbox.checked;
    toggleTheme(checkbox.checked);
  });

  toggleContainer.addEventListener('click', function(e) {
    if (e.target !== checkbox) {
      e.preventDefault();
      checkbox.checked = !checkbox.checked;
      toggleTheme(checkbox.checked);
    }
  });

  const savedTheme = localStorage.getItem('lemonchat-dark-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultDark = savedTheme ? savedTheme === 'true' : prefersDark;

  checkbox.checked = defaultDark;
  toggleTheme(defaultDark);
})();