// ==UserScript==
// @name         Grundos Cafe Dice-a-roo and Gormball keyboard controls
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Keyboard controls for dice-a-roo and gormball
// @author       Dij
// @match        https://www.grundos.cafe/games/dicearoo/
// @match        https://www.grundos.cafe/games/play_dicearoo/
// @match        https://www.grundos.cafe/games/gormball/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @icon         https://www.grundos.cafe/static/images/favicon.66a6c5f11278.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489417/Grundos%20Cafe%20Dice-a-roo%20and%20Gormball%20keyboard%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/489417/Grundos%20Cafe%20Dice-a-roo%20and%20Gormball%20keyboard%20controls.meta.js
// ==/UserScript==
/* global $ */
/*
1 Thyassa
2 Brian
3 Gargarox
4 Farvin III
5 Ember
6 COOL Zargrold
7 Ursula
8 Kevin
*/
let preferredPlayer = 3;

(function() {
    'use strict';
    document.addEventListener("keydown", (event) => {
        // press enter
        if (event.key === 'Enter') {
            if(event.target.type === "text") {
                return; // Do not run if currently typing in a textbox
            }
            let chooseAGorm = $(`.gormball_player[data-id="${preferredPlayer}"]`);
            if (chooseAGorm.length > 0) {
                chooseAGorm.click();
                setTimeout(1000);
                return;
            }
            let doIt = $("#page_content .button-group input[type=\"submit\"], #page_content .button-group input[type=\"button\"]").first();
            if(doIt.length > 0) {
                doIt.click();
            }
            setTimeout(1000);
        }
    });

})();