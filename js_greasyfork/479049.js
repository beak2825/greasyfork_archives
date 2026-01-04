// ==UserScript==
// @name         Crunchyroll video overlay visibility toggle
// @namespace    https://github.com/RequiemOfSpirit
// @version      1.0.2
// @description  Adds an event listener on the Crunchyroll video player on the letter `h` to toggle video overlay visibility
// @author       RequiemOfSpirit
// @homepage     https://github.com/RequiemOfSpirit/Userscripts
// @match        https://static.crunchyroll.com/vilos-*
// @license      MIT
// @icon         https://upload.wikimedia.org/wikipedia/commons/7/75/Cib-crunchyroll_%28CoreUI_Icons_v1.0.0%29_orange.svg
// @downloadURL https://update.greasyfork.org/scripts/479049/Crunchyroll%20video%20overlay%20visibility%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/479049/Crunchyroll%20video%20overlay%20visibility%20toggle.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.addEventListener('keyup', (e) => {
    if (e.key !== 'h') {
      return;
    }

    const overlay = document.querySelector('#velocity-controls-package');
    if (overlay == undefined) {
      return;
    }

    overlay.style.visibility = (overlay.style.visibility === 'hidden') ? 'visible' : 'hidden';
  });
})();
