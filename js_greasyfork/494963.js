// ==UserScript==
// @name         Netflix Enchantments
// @namespace    http://tampermonkey.net/
// @version      0.4.5
// @description  Enhancements for Netflix video player: skip intro, skip outro, and more.
// @author       JJJ
// @match        https://www.netflix.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/494963/Netflix%20Enchantments.user.js
// @updateURL https://update.greasyfork.org/scripts/494963/Netflix%20Enchantments.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
    enableSkipRecap: GM_getValue('enableSkipRecap', true),
    enableSkipIntro: GM_getValue('enableSkipIntro', true),
    enableSkipOutro: GM_getValue('enableSkipOutro', true),
    cancelFullscreen: GM_getValue('cancelFullscreen', false),
    hideGames: GM_getValue('hideGames', true),
  };

  const SELECTORS = {
    skipRecapButton: '[data-uia="player-skip-recap"]',
    skipIntroButton: '[data-uia="player-skip-intro"]',
    skipOutroButton: '.color-primary.hasLabel.hasIcon.ltr-1jtux27',
    fullscreenView: '.watch-video--player-view',
    gamesSection: '.lolomoRow[data-list-context*="games"]'
  };

  function createSettingsDialog() {
    const dialogHTML = `
      <div id="netflixEnchantmentsDialog" class="dpe-dialog">
        <h3>Netflix Enchantments</h3>
        ${createToggle('enableSkipRecap', 'Skip Recap', 'Automatically skip episode recaps')}
        ${createToggle('enableSkipIntro', 'Skip Intro', 'Automatically skip the intro of episodes')}
        ${createToggle('enableSkipOutro', 'Skip Outro', 'Automatically skip the outro of episodes')}
        ${createToggle('cancelFullscreen', 'Cancel Fullscreen', 'Automatically exit fullscreen mode')}
        ${createToggle('hideGames', 'Hide Games', 'Hide the games section')}
        <div class="dpe-button-container">
          <button id="saveSettingsButton" class="dpe-button dpe-button-save">Save</button>
          <button id="cancelSettingsButton" class="dpe-button dpe-button-cancel">Cancel</button>
        </div>
      </div>
    `;

    const styleSheet = `
      <style>
        .dpe-dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid #444;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
          z-index: 9999;
          color: white;
          width: 300px;
          font-family: Arial, sans-serif;
        }
        .dpe-dialog h3 {
          margin-top: 0;
          font-size: 1.4em;
          text-align: center;
          margin-bottom: 20px;
        }
        .dpe-checkbox-container {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        .dpe-checkbox-container input[type="checkbox"] {
          margin-right: 10px;
        }
        .dpe-button-container {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        .dpe-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1em;
          transition: background-color 0.3s;
        }
        .dpe-button-save {
          background-color: #0078d4;
          color: white;
        }
        .dpe-button-save:hover {
          background-color: #005a9e;
        }
        .dpe-button-cancel {
          background-color: #d41a1a;
          color: white;
        }
        .dpe-button-cancel:hover {
          background-color: #a61515;
        }
        .dpe-toggle-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .dpe-toggle-label {
          flex-grow: 1;
        }
        .dpe-toggle {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }
        .dpe-toggle input {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          margin: 0;
        }
        .dpe-toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 24px;
        }
        .dpe-toggle-slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        .dpe-toggle input:checked + .dpe-toggle-slider {
          background-color: #0078d4;
        }
        .dpe-toggle input:checked + .dpe-toggle-slider:before {
          transform: translateX(26px);
        }
      </style>
    `;

    const dialogWrapper = document.createElement('div');
    dialogWrapper.innerHTML = styleSheet + dialogHTML;
    document.body.appendChild(dialogWrapper);

    // Add event listeners to toggles
    document.querySelectorAll('.dpe-toggle input').forEach(toggle => {
      toggle.addEventListener('change', (event) => {
        const { id, checked } = event.target;
        CONFIG[id] = checked; // Update the CONFIG object with the new value
      });
    });

    // Add event listeners to buttons
    document.getElementById('saveSettingsButton').addEventListener('click', saveAndCloseDialog);
    document.getElementById('cancelSettingsButton').addEventListener('click', closeDialog);
  }

  function createToggle(id, label, title) {
    return `
      <div class="dpe-toggle-container" title="${title}">
        <label class="dpe-toggle">
          <input type="checkbox" id="${id}" ${CONFIG[id] ? 'checked' : ''}>
          <span class="dpe-toggle-slider"></span>
        </label>
        <label for="${id}" class="dpe-toggle-label">${label}</label>
      </div>
    `;
  }

  function saveAndCloseDialog() {
    Object.keys(CONFIG).forEach(key => {
      CONFIG[key] = document.getElementById(key).checked;
      GM_setValue(key, CONFIG[key]);
    });
    closeDialog();
  }

  function closeDialog() {
    const dialog = document.getElementById('netflixEnchantmentsDialog');
    if (dialog) {
      dialog.remove();
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  }

  function clickButton(selector) {
    const button = document.querySelector(selector);
    if (button) {
      button.click();
    }
  }

  function enterFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    }
  }

  function exitFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  function hideGamesSection() {
    const gamesSections = document.querySelectorAll(SELECTORS.gamesSection);
    gamesSections.forEach(section => {
      if (section && CONFIG.hideGames) {
        section.style.display = 'none';
      }
    });
  }

  function handleSkipActions() {
    try {
      if (CONFIG.enableSkipRecap) {
        clickButton(SELECTORS.skipRecapButton);
      }

      if (CONFIG.enableSkipIntro) {
        clickButton(SELECTORS.skipIntroButton);
      }

      if (CONFIG.enableSkipOutro) {
        clickButton(SELECTORS.skipOutroButton);
      }

      if (document.querySelector(SELECTORS.fullscreenView)) {
        enterFullscreen();
      }

      if (CONFIG.cancelFullscreen && document.fullscreenElement) {
        exitFullscreen();
      }

      if (CONFIG.hideGames) {
        hideGamesSection();
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  const observer = new MutationObserver(handleSkipActions);
  observer.observe(document.body, { childList: true, subtree: true });

  GM_registerMenuCommand('Netflix Enchantments Settings', createSettingsDialog);

  let isSettingsDialogOpen = false;

  function toggleSettingsDialog() {
    const dialog = document.getElementById('netflixEnchantmentsDialog');
    if (dialog) {
      dialog.remove();
    } else {
      createSettingsDialog();
    }
  }

  document.addEventListener('keyup', (event) => {
    if (event.key === 'F2') {
      toggleSettingsDialog();
    } else if (event.key === 'Escape') {
      exitFullscreen();
      closeDialog();
    }
  });

})();