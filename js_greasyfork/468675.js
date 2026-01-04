// ==UserScript==
// @name         Dr Frost Math Timestable Game Score Hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A score hack for the timestable game in dr frost math!
// @author       Jason Huang
// @match        https://www.drfrostmaths.com/timestables-game.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drfrostmaths.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468675/Dr%20Frost%20Math%20Timestable%20Game%20Score%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/468675/Dr%20Frost%20Math%20Timestable%20Game%20Score%20Hack.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    var score = parseInt(prompt("What score would you like to get? (Max 70, does not allow to submit after that.)"))
    async function performActions() {
        // Find the button element and click its
        var button = document.querySelector("a.very-large-button-variant");
        if (button) {
            button.click();

            // Wait for the button action to complete (if needed)
            await sleep(1000);

            // Find the element and retrieve its text content
            for (let i = 0; i < score; i++) {
                console.log("STEP");
                await sleep(180);
                var textBox = document.querySelector("input#calculator-display");
                var element = document.querySelector("#question");
                if (element) {
                    var textContent = (element.textContent || element.innerText).replace("×", "*").replace("÷", "/");

                    var answer = parseInt(eval(textContent));
                    console.log("Text content:", answer);
                    textBox.value = answer;

                    const enterKeyEvent = new KeyboardEvent("keyup", {
                        key: "Enter",
                        keyCode: 13,
                        bubbles: true,
                        cancelable: true,
                    });

                    textBox.dispatchEvent(enterKeyEvent);
                }
            }
        }
    }

    performActions();
})();
