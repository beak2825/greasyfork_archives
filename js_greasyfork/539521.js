// ==UserScript==
// @name         The West – Pin icon position fix (TW-DB)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Áthelyezi a TW-DB szkript pin ikonját, hogy ne takarja az alapjáték keresés gombját.
// @match        https://*.the-west.net/game.php*
// @match        https://*.the-west.hu/game.php*
// @match        https://*.the-west.de/game.php*
// @match        https://*.the-west.pl/game.php*
// @match        https://*.the-west.fr/game.php*
// @match        https://*.the-west.es/game.php*
// @match        https://*.the-west.cz/game.php*
// @match        https://*.the-west.com.br/game.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539521/The%20West%20%E2%80%93%20Pin%20icon%20position%20fix%20%28TW-DB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539521/The%20West%20%E2%80%93%20Pin%20icon%20position%20fix%20%28TW-DB%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function repositionPinBox() {
        const pinBox = document.querySelector('#CC_pin_items');
        if (pinBox) {
            pinBox.style.position = 'absolute';
            pinBox.style.left = '53px'; // módosítható, pl. right = '60px'
            pinBox.style.top = '442px';
            pinBox.style.zIndex = '9999';
        }
    }

    const initInterval = setInterval(() => {
        const pinBox = document.querySelector('#CC_pin_items');
        if (pinBox) {
            repositionPinBox();
            clearInterval(initInterval);
        }
    }, 500);

    const observer = new MutationObserver(() => {
        repositionPinBox();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
