// ==UserScript==
// @name         Higher/Lower Autoplayer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This scripts autoplays Higher or Lower when there are turns left
// @author       Gnorbu
// @match        https://www1.flightrising.com/play/higher-or-lower
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412229/HigherLower%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/412229/HigherLower%20Autoplayer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setTimeout(play, 1500);

})();

function play(){
    var checkTurns = document.querySelector('#higher-lower-turns').querySelector('strong').textContent.trim() != '0';
    var checkNewGame = document.querySelector('#higher-lower-button-retry');
    var higherButton = document.querySelector('#higher-lower-button-higher');
    var lowerButton = document.querySelector('#higher-lower-button-lower');

    if (checkTurns && !checkNewGame){
        var cardLeft = document.querySelector('#higher-lower-card-left').src;
        var cardLeftNum = parseInt(cardLeft.match(/card-left-(.*)\./)[1]);
        cardLeftNum > 6 ? lowerButton.click() : higherButton.click();
    } else if (checkTurns && checkNewGame){
        checkNewGame.click();
    }
}