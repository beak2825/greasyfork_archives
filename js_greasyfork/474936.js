// ==UserScript==
// @name         Seterra Hack
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.2
// @description  simple hack for seterra. colours the correct country/location in black, then white when clicked.
// @author       azzlam
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474936/Seterra%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/474936/Seterra%20Hack.meta.js
// ==/UserScript==

setInterval(() => {
    // [class^='container_sizeMedium']:nth-child(2)
    const gameHeader = document.querySelector("#__next [class^='seterra'] [class^='seterra_content'] [class^='seterra_main'] [class^='game-container'] [class^='game-container'] [class^='game-page_gameAreaWrapper'] [class^='game-area_gameWrapper'] [class^='game-header_wrapper']");
    if (gameHeader) {
        const currentQuestionId = gameHeader.getAttribute('data-current-question-id').replace(/ /g, "_");
        const correct = document.querySelector("#".concat(currentQuestionId));
        if (correct) {
            correct.addEventListener('click', function() {
                correct.style.setProperty("--fill-color", "white");
            });
            correct.style.setProperty("--fill-color", "black");
            const correctDot = correct.querySelector("[class^='hitbox-dot']");
            if (correctDot) {
                correctDot.addEventListener('click', function() {
                    correctDot.style.display = "none";
                });
            correctDot.style.fill = "black";
            }
        } else {
            console.log("current qId not found");
        }
    } else {
        console.log("game element not found");
    }

}, 150);