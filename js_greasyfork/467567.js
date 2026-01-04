// ==UserScript==
// @name         FreeGOGPcGames Timer Bypass
// @license MIT
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Script to bypass the timer on the FreeGogPcGames download page website.
// @author       Wizzergod
// @match        http*://*.freegogpcgames.*/download-gen.php?url=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freegogpcgames.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467567/FreeGOGPcGames%20Timer%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/467567/FreeGOGPcGames%20Timer%20Bypass.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Находим элемент с id "DLINK"
    var divElement = document.getElementById('DLINK');

    // Заменяем класс элемента на "fade-in"
    if (divElement) {
        divElement.classList.remove('hide');
        divElement.classList.add('fade-in');
    }
})();
