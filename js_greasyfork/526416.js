// ==UserScript==
// @name        WhatsApp Fullscreen
// @homepage    https://codeberg.org/mthsk/userscripts/src/branch/master/whatsapp-fullscreen
// @match       *://web.whatsapp.com/*
// @grant       none
// @version     2025.02
// @author      mthsk
// @description Removes the white space in WhatsApp Web.
// @license     AGPL-3.0-or-later
// @namespace https://greasyfork.org/users/751327
// @downloadURL https://update.greasyfork.org/scripts/526416/WhatsApp%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/526416/WhatsApp%20Fullscreen.meta.js
// ==/UserScript==
/**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function() {
    "use strict";
    function applyStyles(targetElement) {
      targetElement.style.width = '100%';
      targetElement.style.maxWidth = '100%';
      targetElement.style.height = '100%';
      targetElement.style.maxHeight = '100%';
      targetElement.style.position = 'absolute';
      targetElement.style.top = '0';
      targetElement.style.left = '0';
    }

    const observer = new MutationObserver((mutationsList, observer) => {
      const targetElement = document.querySelector('div[id="app"] > div > div > div[tabindex="-1"]');

      if (targetElement) {
        applyStyles(targetElement);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
})();