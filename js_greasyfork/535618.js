// ==UserScript==
// @name         Dice-A-Roo AP
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      2025-05-11
// @description  Plays Dice-A-Roo
// @match        https://www.grundos.cafe/games/dicearoo/*
// @match        https://www.grundos.cafe/games/play_dicearoo/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535618/Dice-A-Roo%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/535618/Dice-A-Roo%20AP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    function clicking(element){
        setTimeout(function () {
            if ($(element).length == 1) {
                console.log(element)
                $(element).click()
            }
        }, getRandomInt(1000, 3000));
    }

    clicking(`[value="Lets Play!"]`);
    clicking(`[value="Roll Again"]`);
    clicking(`[value="Press Me"]`);

})();