// ==UserScript==
// @name         WAM Util
// @namespace    http://tampermonkey.net/
// @version      2025-03-07
// @description  Utilities for Whatsamusic
// @author       skibidi
// @match        https://whatsamook.games/mu*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whatsamook.games
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529112/WAM%20Util.user.js
// @updateURL https://update.greasyfork.org/scripts/529112/WAM%20Util.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function pickRandomPlayer()
    {
        debugger;

        var playerElements = document.getElementsByClassName('divPlayerName');
        var rndPlayerIndex = Math.floor( Math.random() * playerElements.length);
        playerElements[rndPlayerIndex].click();
    }

    var rndButton = document.createElement('button');
    rndButton.textContent = 'Pick random player';
    rndButton.style.position = 'absolute';
    rndButton.style.top = '12px';
    rndButton.style.right = '10px';
    rndButton.style.zIndex = '9999';
    rndButton.style.border = '2px solid white';
    rndButton.style.color = 'white';
    rndButton.style.backgroundColor = 'black';
    rndButton.addEventListener('click', function(){
        pickRandomPlayer();
    });

    document.body.appendChild(rndButton);
})();