// ==UserScript==
// @name         Auto Click (mobile)
// @description  Auto click enter on mobile
// @version      1.1
// @include      https://*/game.php*
// @namespace https://greasyfork.org/users/1388899
// @downloadURL https://update.greasyfork.org/scripts/514952/Auto%20Click%20%28mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/514952/Auto%20Click%20%28mobile%29.meta.js
// ==/UserScript==
 
(function() {
 
    'use strict';
 
    // Create button
 
    let button = document.createElement("button");
 
    button.innerText = "Start";
 
    button.style.position = "fixed";
 
    button.style.bottom = "20px";
 
    button.style.left = "20px";
 
    button.style.padding = "8px 8px";
 
    button.style.fontSize = "13px";
 
    button.style.zIndex = "1000";
 
    button.style.backgroundColor = "#4CAF50";
 
    button.style.color = "white";
 
    button.style.border = "none";
 
    button.style.borderRadius = "5px";
 
    button.style.cursor = "pointer";
 
    document.body.appendChild(button);
 
    let isRunning = false;
 
    let intervalId;
 
    function pressEnterRandomly() {
 
        const randomDelay = Math.floor(Math.random() * (350 - 200 + 1)) + 200; // Random delay between 200-350 ms
 
        document.dispatchEvent(new KeyboardEvent('keydown', {
 
            key: 'Enter',
 
            code: 'Enter',
 
            which: 13,
 
            keyCode: 13,
 
            bubbles: true
 
        }));
 
        intervalId = setTimeout(pressEnterRandomly, randomDelay);
 
    }
 
    // Toggle the Enter key press on and off
 
    button.addEventListener("click", function() {
 
        if (isRunning) {
 
            clearTimeout(intervalId);
 
            button.innerText = "Start";
 
            isRunning = false;
 
        } else {
 
            pressEnterRandomly();
 
            button.innerText = "Stop";
 
            isRunning = true;
 
        }
 
    });
 
})();