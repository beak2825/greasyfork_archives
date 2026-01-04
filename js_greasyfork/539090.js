// ==UserScript==
// @name         Torn Battle Result Hotkeys
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Use Q/W/E keys to quickly choose battle result: Leave, Mug, or Hospitalize
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539090/Torn%20Battle%20Result%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/539090/Torn%20Battle%20Result%20Hotkeys.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Listen for keydown events
  document.addEventListener('keydown', function(event) {
    // Ignore key presses inside input fields
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return;
    }

    const key = event.key.toLowerCase();
    let action = null;

    if (key === 'q') action = 'leave';
    if (key === 'w') action = 'mug';
    if (key === 'e') action = 'hospitalize';

    if (!action) return;

    // Find all relevant buttons
    const button = [...document.querySelectorAll('button.torn-btn')].find(btn =>
      btn.textContent.toLowerCase().includes(action)
    );

    if (button) {
      event.preventDefault();
      button.click();
      console.log(`✅ Pressed ${key.toUpperCase()} → ${action}`);
    }
  });
})();