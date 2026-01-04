// ==UserScript==
// @name         RPGLand RPG filter
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2024-10-08
// @description  Filters by RPGLand type
// @author       YamiSparrow
// @match        https://rpgland.org/land.php?rpgs=2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rpgland.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511700/RPGLand%20RPG%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/511700/RPGLand%20RPG%20filter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  ['p', 'e', 'a', 'c', 'oe'].forEach((currentButton) => {
    const iconSelector = `.container-fluid .icon.${currentButton}`;
    const chatButton = document.querySelector(iconSelector).cloneNode();
    
    if (!chatButton) {
        return;
    }

    chatButton.style = 'padding: 8px; cursor: pointer;';

    const navElement = document.querySelectorAll('#navMain > .navbar-nav')[0];
    navElement.appendChild(chatButton);

    chatButton.addEventListener('click', () => {
      document.querySelectorAll(iconSelector).forEach((play) => {
        play.closest('.rl-undercover-link').classList.toggle('d-none');
      });
    });
  });
})();