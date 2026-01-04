// ==UserScript==
// @name         Song Maker - 8 Octaves (Modify on Button Click)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Sets max octave to 8
// @author       Anonymous
// @match        https://musiclab.chromeexperiments.com/Song-Maker/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491508/Song%20Maker%20-%208%20Octaves%20%28Modify%20on%20Button%20Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491508/Song%20Maker%20-%208%20Octaves%20%28Modify%20on%20Button%20Click%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function modifySettingsModal() {
    // Find the settings modal element
    const settingsModal = document.getElementById('settings-modal');

    if (settingsModal) {
      // **Do not modify ID (recommended):**
        settingsModal.id = '';

      const octaveInput = document.getElementById('octaves');
      if (octaveInput) {
        // Set max to 8
        octaveInput.max = 8;
        // Set the value to 8
        octaveInput.value = 8;
      } else {
        console.warn('Octave input element not found.');
      }
    } else {
      console.warn('Settings modal element not found.');
    }
  }

  const settingsButton = document.getElementById('settings-button');
  if (settingsButton) {
    settingsButton.addEventListener('click', function() {
        console.log('Modified settings')
      // Set a delay before running the script (adjust as needed)
      const delay = 50;
      setTimeout(modifySettingsModal, delay);
    });
  } else {
    console.warn('Settings button element not found.');
  }
})();
