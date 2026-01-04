// ==UserScript==
// @name        MooMoo.io - 1.8.0 Toggle Menus
// @author      Seryo
// @description Press "." to Toggle the Store menu and Press "," to Toggle the Alliance menu
// @version     0.1
// @match       *://*.moomoo.io/*
// @namespace   https://greasyfork.org/users/1190411
// @icon        https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @run-at      document-end
// @license     MIT
// @grant       GM_info
// @downloadURL https://update.greasyfork.org/scripts/476901/MooMooio%20-%20180%20Toggle%20Menus.user.js
// @updateURL https://update.greasyfork.org/scripts/476901/MooMooio%20-%20180%20Toggle%20Menus.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let allianceMenu = document.getElementById('allianceMenu');
  let storeMenu = document.getElementById('storeMenu');

  document.addEventListener('keydown', function (event) {
    if (shouldHandleMenus(event)) {
      if (event.key === ',') {
        toggleMenu(allianceMenu, storeMenu);
      } else if (event.key === '.') {
        toggleMenu(storeMenu, allianceMenu);
      }
    }
  });

  function shouldHandleMenus(event) {
    const chatboxActive = document.activeElement.id.toLowerCase() === 'chatbox';
    const allianceInputActive = document.activeElement.id.toLowerCase() === 'allianceinput';

    return !chatboxActive && !allianceInputActive;
  }

  function toggleMenu(menu, otherMenu) {
    if (menu.style.display === 'none' || menu.style.display === '') {
      menu.style.display = 'block';
      if (otherMenu.style.display !== 'none') {
        otherMenu.style.display = 'none';
      }
    } else {
      menu.style.display = 'none';
    }
  }
})();