// ==UserScript==
// @name         Custom Abyss-Lab VN settings
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds custom settings to abyss-lab.app make the horrible VN engine more usable.
// @author       GillianMC
// @match        *://*.abyss-lab.app/honkai3rd/novels/ae
// @match        *://abyss-lab.app/honkai3rd/novels/ae
// @match        *://*.abyss-lab.app/honkai3rd/novels/duriduri
// @match        *://abyss-lab.app/honkai3rd/novels/duriduri
// @icon         https://www.google.com/s2/favicons?sz=64&domain=abyss-lab.app
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526474/Custom%20Abyss-Lab%20VN%20settings.user.js
// @updateURL https://update.greasyfork.org/scripts/526474/Custom%20Abyss-Lab%20VN%20settings.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const settings = JSON.parse(localStorage.getItem('abyssLabSettings')) || {
    fontSize: 1.5,
    lineHeight: 2.5,
    fontFamily: 'htmlHeitiFamily',
    customFont: '',
    paddingTop: 0,
    uiRestylingEnabled: true,
  };

  let areSettingsOpen = false;
  let originalStyles = {};

  function modifyCSSRule(selector, property, value) {
    for (let sheet of document.styleSheets) {
      if (sheet.href && (sheet.href.includes('gameDurandal.css') || (sheet.href.includes('game.css')))) {
        try {
          for (let i = 0; i < sheet.cssRules.length; i++) {
            let rule = sheet.cssRules[i];
            if (rule.selectorText === selector) {
              rule.style[property] = value;
              return;
            }
          }
        } catch (e) {
          console.warn(`Unable to modify ${property} for ${selector}:`, e);
        }
      }
    }
  }

  function applySettings() {
    modifyCSSRule('.dialog-text', 'font-size', `${settings.fontSize}rem`);
    modifyCSSRule('.dialog-text', 'line-height', `${settings.lineHeight}rem`);
    modifyCSSRule('.dialog-text', 'font-family', settings.fontFamily === 'Custom' ? settings.customFont : settings.fontFamily);
    modifyCSSRule('.dialog-text', 'padding-top', `${settings.paddingTop}rem`);
    modifyCSSRule('.dialog-chara-text', 'font-family', settings.fontFamily === 'Custom' ? settings.customFont : settings.fontFamily);
    modifyCSSRule('.history-text', 'font-size', `${settings.fontSize}rem`);
    modifyCSSRule('.history-text', 'line-height', `${settings.lineHeight}rem`);
    modifyCSSRule('.history-text', 'font-family', settings.fontFamily === 'Custom' ? settings.customFont : settings.fontFamily);
    modifyCSSRule('.history-text', 'padding-top', `${settings.paddingTop}rem`);

    if (settings.uiRestylingEnabled) {
      // Apply UI restyling
      modifyCSSRule('.dialog', 'bottom', `0rem`);
      modifyCSSRule('.dialog-overflow', 'height', `4.8rem`);
      modifyCSSRule('.buttonBar', 'width', `13rem`);
      modifyCSSRule('.buttonBar', 'height', `1.3rem`);
      modifyCSSRule('.buttonBar', 'top', `unset`);
      modifyCSSRule('.buttonBar', 'left', `37.6%`);
      modifyCSSRule('.buttonBar', 'margin', `unset`);
      modifyCSSRule('.buttonBar', 'bottom', `0.1rem`);
      modifyCSSRule('.dialog-btn', 'left', `0`);
      modifyCSSRule('.dialog-btn-history', 'width', `2.31rem`);
      modifyCSSRule('.dialog-btn-history', 'left', `0`);
      modifyCSSRule('.dialog-btn-skip', 'width', `2.31rem`);
      modifyCSSRule('.dialog-btn-skip', 'left', `2rem`);
      modifyCSSRule('.dialog-btn-autoplay', 'width', `2.31rem`);
      modifyCSSRule('.dialog-btn-autoplay', 'left', `4rem`);
      modifyCSSRule('.record_btn', 'width', `2.31rem`);
      modifyCSSRule('.record_btn', 'left', `6rem`);
      modifyCSSRule('.read_record_btn', 'width', `2.31rem`);
      modifyCSSRule('.read_record_btn', 'left', `8rem`);
      modifyCSSRule('.home_btn', 'width', `1.8rem`);
      modifyCSSRule('.home_btn', 'height', `1.8rem`);
    } else {
      // Reset UI restyling to default
      modifyCSSRule('.dialog', 'bottom', `1rem`);
      modifyCSSRule('.dialog-overflow', 'height', `5rem`);
      modifyCSSRule('.buttonBar', 'width', `40rem`);
      modifyCSSRule('.buttonBar', 'height', `3.6rem`);
      modifyCSSRule('.buttonBar', 'top', `0`);
      modifyCSSRule('.buttonBar', 'left', `0`);
      modifyCSSRule('.buttonBar', 'margin', `0.1rem`);
      modifyCSSRule('.buttonBar', 'bottom', `unset`);
      modifyCSSRule('.dialog-btn', 'left', `12.8rem`);
      modifyCSSRule('.dialog-btn-history', 'width', `6.4rem`);
      modifyCSSRule('.dialog-btn-history', 'left', `unset`);
      modifyCSSRule('.dialog-btn-skip', 'width', `6.4rem`);
      modifyCSSRule('.dialog-btn-skip', 'left', `0`);
      modifyCSSRule('.dialog-btn-autoplay', 'width', `6.4rem`);
      modifyCSSRule('.dialog-btn-autoplay', 'left', `6.4rem`);
      modifyCSSRule('.record_btn', 'width', `6.4rem`);
      modifyCSSRule('.record_btn', 'left', `0`);
      modifyCSSRule('.read_record_btn', 'width', `6.4rem`);
      modifyCSSRule('.read_record_btn', 'left', `6.4rem`);
      modifyCSSRule('.home_btn', 'width', `3.6rem`);
      modifyCSSRule('.home_btn', 'height', `3.6rem`);
    }
  }

  const settingsButton = document.createElement('button');
  settingsButton.textContent = '⚙️';
  Object.assign(settingsButton.style, {
    position: 'absolute', bottom: '0.1rem', right: '0.1rem', zIndex: '1000',
    fontSize: '0.6em', cursor: 'pointer', backgroundColor: 'transparent',
    border: 'none', color: '#fff'
  });

  const frameDiv = document.querySelector('.frame');
  (frameDiv || document.body).appendChild(settingsButton);

  const settingsMenu = document.createElement('div');
  Object.assign(settingsMenu.style, {
    position: 'absolute', bottom: '1.5rem', right: '0.6rem', backgroundColor: 'rgba(0, 0, 0, 0.8)',
    border: '0.1em solid #fff', padding: '1rem',
    zIndex: '1000', display: 'none', color: '#fff', fontSize: '0.75rem', width: '16em'
  });
  settingsMenu.innerHTML = `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem">Settings</h3>
    <label style="font-size: 0.7rem">Font Size: <span id="fontSizeValue" style="font-size: 0.7rem">${settings.fontSize}</span>rem</label>
    <input type="range" id="fontSize" min="0.3" max="3" step="0.1" value="${settings.fontSize}" style="width: 100%;">
    <br>
    <label style="font-size: 0.7rem">Line Spacing: <span id="lineHeightValue" style="font-size: 0.7rem">${settings.lineHeight}</span>rem</label>
    <input type="range" id="lineHeight" min="1" max="4" step="0.1" value="${settings.lineHeight}" style="width: 100%;">
    <br>
    <label style="font-size: 0.7rem">Top Padding: <span id="paddingTopValue" style="font-size: 0.7rem">${settings.paddingTop}</span>rem</label>
    <input type="range" id="paddingTop" min="0" max="2" step="0.1" value="${settings.paddingTop}" style="width: 100%;">
    <br>
    <label style="font-size: 0.7rem">Font Family:</label>
    <select id="fontFamily" style="width: 100%; font-size: 0.7rem;">
      <option value="htmlHeitiFamily">Default (htmlHeitiFamily)</option>
      <option value="Arial">Arial</option>
      <option value="Times New Roman">Times New Roman</option>
      <option value="Courier New">Courier New</option>
      <option value="Verdana">Verdana</option>
      <option value="Georgia">Georgia</option>
      <option value="Comic Sans MS">Comic Sans MS</option>
      <option value="sans-serif">System Sans-Serif</option>
      <option value="serif">System Serif</option>
      <option value="monospace">System Monospace</option>
      <option value="Custom">Custom</option>
    </select>
    <br>
    <div id="customFontContainer" style="display: none;">
      <label style="font-size: 0.7rem">Custom Font:</label>
      <input type="text" id="customFont" placeholder="Enter custom font name" style="width: 100%; font-size: 0.7em;">
    </div>
    <br>
    <label style="font-size: 0.7rem">UI Restyling:</label>
    <input type="checkbox" id="uiRestylingToggle" ${settings.uiRestylingEnabled ? 'checked' : ''}>
  `;

  (frameDiv || document.body).appendChild(settingsMenu);
  document.getElementById('fontFamily').value = settings.fontFamily;
  const customFontContainer = document.getElementById('customFontContainer');
  const customFontInput = document.getElementById('customFont');
  customFontInput.value = settings.customFont || '';
  customFontContainer.style.display = settings.fontFamily === 'Custom' ? 'block' : 'none';

  settingsButton.addEventListener('click', () => {
    settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
    areSettingsOpen = settingsMenu.style.display === 'none' ? false : true;
  });

  document.getElementById('fontSize').addEventListener('input', (e) => {
    settings.fontSize = parseFloat(e.target.value);
    document.getElementById('fontSizeValue').textContent = e.target.value;
    applySettings();
    localStorage.setItem('abyssLabSettings', JSON.stringify(settings));
  });

  document.getElementById('lineHeight').addEventListener('input', (e) => {
    settings.lineHeight = parseFloat(e.target.value);
    document.getElementById('lineHeightValue').textContent = e.target.value;
    applySettings();
    localStorage.setItem('abyssLabSettings', JSON.stringify(settings));
  });

  document.getElementById('paddingTop').addEventListener('input', (e) => {
    settings.paddingTop = parseFloat(e.target.value);
    document.getElementById('paddingTopValue').textContent = e.target.value;
    applySettings();
    localStorage.setItem('abyssLabSettings', JSON.stringify(settings));
  });

  document.getElementById('fontFamily').addEventListener('change', (e) => {
    settings.fontFamily = e.target.value;
    customFontContainer.style.display = e.target.value === 'Custom' ? 'block' : 'none';
    applySettings();
    localStorage.setItem('abyssLabSettings', JSON.stringify(settings));
  });

  document.getElementById('customFont').addEventListener('input', (e) => {
    settings.customFont = e.target.value;
    if (settings.fontFamily === 'Custom') {
      applySettings();
      localStorage.setItem('abyssLabSettings', JSON.stringify(settings));
    }
  });

  document.getElementById('uiRestylingToggle').addEventListener('change', (e) => {
    settings.uiRestylingEnabled = e.target.checked;
    applySettings();
    localStorage.setItem('abyssLabSettings', JSON.stringify(settings));
  });

  // Create the hide button
  const hideButton = document.createElement('button');
  hideButton.textContent = 'Hide';
  Object.assign(hideButton.style, {
    position: 'absolute', bottom: '0.1rem', left: '0.1rem', zIndex: '1000',
    fontSize: '0.6em', cursor: 'pointer', backgroundColor: 'transparent',
    border: 'none', color: '#fff'
  });

  (frameDiv || document.body).appendChild(hideButton);

  // Create the overlay layer
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0)', zIndex: '9999', display: 'none'
  });

  (frameDiv || document.body).appendChild(overlay);

  function hideElements() {
    const elementsToHide = [
      '.dialog', '.buttonBar', '.dialog-btn', '.record_btn', '.read_record_btn', '.home_btn', '.history'
    ];

    elementsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // Store the original display style
        originalStyles[selector] = element.style.display;
        // Hide the element
        element.style.display = 'none';
      });
    });

    hideButton.style.display = 'none';
    settingsButton.style.display = 'none';
    settingsMenu.style.display = 'none';
    overlay.style.display = 'block'; // Show the overlay
  }

  // Function to restore elements
  function restoreElements() {
    Object.keys(originalStyles).forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // Restore the original display style
        element.style.display = originalStyles[selector];
      });
    });

    hideButton.style.display = 'block';
    if (areSettingsOpen == true){
        settingsMenu.style.display = 'block';
    }
    settingsButton.style.display = 'block';
    overlay.style.display = 'none'; // Hide the overlay
  }

  // Add event listener to hide button
  hideButton.addEventListener('click', hideElements);

  // Add event listener to overlay to restore elements
  overlay.addEventListener('click', restoreElements);

  applySettings();
})();