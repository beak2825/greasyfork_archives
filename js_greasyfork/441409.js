// ==UserScript==
// @name         Twitch TV Scripts
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds some useful hotkeys to Twitch
// @author       Nicholas Eidler
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441409/Twitch%20TV%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/441409/Twitch%20TV%20Scripts.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function () {
  'use strict';

  /**
   * DOM node selectors.
   */
  const SELECTORS = Object.freeze({
    BODY: 'body',
    CHAT_SIDEBAR_TOGGLE_BTN: '.right-column__toggle-visibility button',
    SETTINGS_BTN: '[data-a-target="player-settings-button"]',
    THEATRE_MODE_BUTTON: '[data-a-target="player-theatre-mode-button"]',
    PIP_BUTTON: 'button[aria-label="Picture in Picture"]',
    VIDEO: 'video',
  });

  const POPOUT_PLAYER_BUTTON_TEXT = 'Popout Player';

  /**
   * Whether the user has entered full screen.
   */
  let isInTheatreFullScreen = false;

  /**
   * Simulates a click event on a single element.
   *
   * @param {String|HTMLElement} selectorOrElement Single element selector string or element
   */
  function simulateClick(selectorOrElement) {
    const elem =
      typeof selectorOrElement === 'string'
        ? document.querySelector(selectorOrElement)
        : selectorOrElement;
    const evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    elem.dispatchEvent(evt);
  }

  /**
   * Whether or not the target element is some sort of text input field.
   *
   * @param {HTMLElement} target Target element
   */
  function isNotTextbox(target) {
    if (!(target instanceof HTMLElement)) {
      throw new TypeError(
        `${target} expected to be a DOM node, was ${typeof target}`
      );
    }

    return target.nodeName !== 'TEXTAREA' && target.nodeName !== 'INPUT' && !target.dataset.slateEditor;
  }

  /**
   * Calls given function on `el` node `keydown` event that is not on a text input element and matches the given `key`.
   *
   * @param {HTMLElement} el HTML Element target
   * @param {String} key Key character value
   * @param {Function} callback Callback function
   */
  function onKeydownNoInput(el, key, callback) {
    el.addEventListener('keydown', (ev) => {
      if (ev.key === key && !ev.ctrlKey && isNotTextbox(ev.target)) {
        callback();

        return false;
      }
    });
  }

  // ---------------------------------------------- EXECUTION AREA ----------------------------------------------

  const bodyEl = document.querySelector('body');

  // Toggle sidebar chat visibility
  onKeydownNoInput(bodyEl, 'c', () =>
    simulateClick(SELECTORS.CHAT_SIDEBAR_TOGGLE_BTN)
  );

  // Toggle theater mode
  onKeydownNoInput(bodyEl, 't', async () => {
    const clickTheatreButtonWhenItAppears = async () => {
      while (true) {
        try {
          simulateClick(SELECTORS.THEATRE_MODE_BUTTON);
          break;
        } catch (err) {
          await new Promise((resolve) => setTimeout(resolve, 5));
        }
      }
    };

    try {
      if (isInTheatreFullScreen) {
        await document.exitFullscreen();
        clickTheatreButtonWhenItAppears();
        isInTheatreFullScreen = false;
      } else {
        simulateClick(SELECTORS.THEATRE_MODE_BUTTON);
        await document.querySelector(SELECTORS.BODY).requestFullscreen();
        isInTheatreFullScreen = true;
      }
    } catch (e) {
      isInTheatreFullScreen = false;
    }
  });

  // Scroll video player into view
  onKeydownNoInput(bodyEl, 'v', () => {
    document.querySelector(SELECTORS.VIDEO).scrollIntoView();
  });

  // Popout video player
  onKeydownNoInput(bodyEl, 'o', () => {
    // Popout button is apparently not rendered unless the overflow menu is triggered
    simulateClick(SELECTORS.SETTINGS_BTN);

    const buttonEls = [...document.querySelectorAll('button')];
    const popoutPlayerButtonEl = buttonEls.filter(
      (el) => el.innerText === POPOUT_PLAYER_BUTTON_TEXT
    )[0];

    // Click popout button
    simulateClick(popoutPlayerButtonEl);
  });

  // Trigger Picture in Picture (pip)
  onKeydownNoInput(bodyEl, 'p', () => {
    simulateClick(SELECTORS.PIP_BUTTON);
  });
})();
