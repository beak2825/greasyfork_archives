// ==UserScript==
// @name         Torn Company Autofill
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Autofills player name once per session, saves last input temporarily (no debug panel, clean version)
// @author       Garrincha [539752]
// @match        https://www.torn.com/companies.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539107/Torn%20Company%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/539107/Torn%20Company%20Autofill.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let lastSavedValue = '';
  let hasAutofilled = false;
  const DEBOUNCE_DELAY = 600;
  let debounceTimer = null;

  function setTemporaryValue(val) {
    if (val && val !== lastSavedValue) {
      lastSavedValue = val;
    }
  }

  function fillInput(input) {
    if (!hasAutofilled && input && input.value.trim() === '' && lastSavedValue) {
      input.value = lastSavedValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      hasAutofilled = true;
    }
  }

  function monitorFinalValue(input) {
    if (!input || input._autoSaveBound) return;
    input._autoSaveBound = true;

    let lastValue = input.value;

    const checkAndSave = () => {
      const newVal = input.value.trim();
      if (newVal && newVal !== lastValue) {
        lastValue = newVal;
        setTemporaryValue(newVal);
      }
    };

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(checkAndSave, DEBOUNCE_DELAY);
    });

    input.addEventListener('blur', () => {
      setTimeout(checkAndSave, 100);
    });
  }

  function processNewElements(node) {
    if (!(node instanceof HTMLElement)) return;

    const input = node.matches?.('input.user-id') ? node : node.querySelector?.('input.user-id');
    if (input) {
      fillInput(input);
      monitorFinalValue(input);
    }
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        processNewElements(node);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(() => {
    const input = document.querySelector('input.user-id');
    if (input) {
      fillInput(input);
      monitorFinalValue(input);
    }
  }, 1000);
})();