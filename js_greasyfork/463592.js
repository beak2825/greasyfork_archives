// ==UserScript==
// @name         魂斗罗30命
// @namespace    
// @license MIT
// @version      2.0
// @description  自动输入"上上下下左右左右BA"
// @author       CHATPGT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463592/%E9%AD%82%E6%96%97%E7%BD%9730%E5%91%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/463592/%E9%AD%82%E6%96%97%E7%BD%9730%E5%91%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a button to the page
    var button = document.createElement("button");
    button.innerText = "Konami Code";
    document.body.appendChild(button);
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.left = "10px";

    // Add a click event listener to the button
    button.addEventListener("click", function() {
        // Simulate the Konami Code key presses
        simulateKeyPress(38); // Up arrow
        simulateKeyPress(38); // Up arrow
        simulateKeyPress(40); // Down arrow
        simulateKeyPress(40); // Down arrow
        simulateKeyPress(37); // Left arrow
        simulateKeyPress(39); // Right arrow
        simulateKeyPress(37); // Left arrow
        simulateKeyPress(39); // Right arrow
        simulateKeyPress(66); // B key
        simulateKeyPress(65); // A key
    });

    // Function to simulate a key press
    function simulateKeyPress(keyCode) {
        var event = new KeyboardEvent("keydown", {
            keyCode: keyCode,
            which: keyCode
        });
        document.dispatchEvent(event);
    }
})();