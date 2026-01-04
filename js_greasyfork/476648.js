// ==UserScript==
// @name         Agma.io Gold Nickname Blinker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make your gold nickname in Agma.io blink
// @author       You
// @match        http://agma.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476648/Agmaio%20Gold%20Nickname%20Blinker.user.js
// @updateURL https://update.greasyfork.org/scripts/476648/Agmaio%20Gold%20Nickname%20Blinker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isGoldEnabled = true;
    let blinkInterval = 500; // Blink interval in milliseconds

    function toggleGoldNickname() {
        isGoldEnabled = !isGoldEnabled;
        let goldCheckbox = document.querySelector('#goldNick');
        if (goldCheckbox) {
            goldCheckbox.checked = isGoldEnabled;
            goldCheckbox.dispatchEvent(new Event('change'));
        }
    }

    let blinker = setInterval(toggleGoldNickname, blinkInterval);

    // Add a button to stop the blinking
    let stopButton = document.createElement('button');
    stopButton.innerText = 'Stop Blinking';
    stopButton.style.position = 'fixed';
    stopButton.style.top = '10px';
    stopButton.style.right = '10px';
    stopButton.style.zIndex = '9999';
    stopButton.onclick = function() {
        clearInterval(blinker);
    };
    document.body.appendChild(stopButton);
})();