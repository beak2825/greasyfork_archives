// ==UserScript==
// @name         Wolfplay space to attack
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Simmilarly to my last user script, this one clicks the attack button when the player hits the spacebar or the enter key on their keyboard.
// @author       DasGurkenglas
// @match        https://wolfplaygame.com/battleground.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wolfplaygame.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444502/Wolfplay%20space%20to%20attack.user.js
// @updateURL https://update.greasyfork.org/scripts/444502/Wolfplay%20space%20to%20attack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("keydown", keyHandler, true);
    function keyHandler(event) {
        if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                document.querySelector("a.exlporebutton").click();
        }
    }
})();