// ==UserScript==
// @name         Flarex gold nick blinker(customizable)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  gold nick name flicker for flarex
// @author       Vaqu
// @match        https://flarex.fun/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485122/Flarex%20gold%20nick%20blinker%28customizable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/485122/Flarex%20gold%20nick%20blinker%28customizable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isGoldEnabled = true;
    let blinkInterval = 59; // Blink interval in milliseconds

    function toggleGoldNickname() {
        isGoldEnabled = !isGoldEnabled;
        let goldCheckbox = document.querySelector('#goldNick.save');
        /* copy and paste goldCheckBox, change "gold" to the color of your nick, right click on the nickname checkbox, copy the id, and replace '#goldNick.save' with the id.*/
        if (goldCheckbox) {
            goldCheckbox.checked = isGoldEnabled;
            goldCheckbox.dispatchEvent(new Event('change'));
        }/* copy and paste the text above ^^ and change every "goldCheckBox" with your new id*/
    }

    let blinker = setInterval(toggleGoldNickname, blinkInterval);
/* add the variable to the "setInterval" text*/
    // adding a stop button
    let stopButton = document.createElement('button');
    stopButton.innerText = 'Stop Blinking';
    stopButton.style.position = 'fixed';
    stopButton.style.top = '10px';
    stopButton.style.right = '10px';
    stopButton.style.zIndex = '9999';
    stopButton.onclick = function() {
        clearGoldNick()
    };
    function clearGoldNick() {
    clearInterval(blinker);
        blinker = false;
    }
    document.body.appendChild(stopButton);
    // adding a start button
        let startButton = document.createElement('button');
    startButton.innerText = 'Start Blinking';
    startButton.style.position = 'fixed';
    startButton.style.top = '50px';
    startButton.style.right = '10px';
    startButton.style.zIndex = '9999';
    startButton.onclick = function() {
         var blinker = setInterval(toggleGoldNickname, blinkInterval);
    };
    document.body.appendChild(stopButton);
    console.log("Script started ;D")
    if(blinker = false) {
        toggle.startButton();
    }

})();