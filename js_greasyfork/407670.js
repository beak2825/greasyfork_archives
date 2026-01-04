// ==UserScript==
// @name         Hide Rating chess.com live game
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A Working script to hide rating of your oppenent in live game of chess.com
// @author       Aurelpt
// @include        https://www.chess.com/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/407670/Hide%20Rating%20chesscom%20live%20game.user.js
// @updateURL https://update.greasyfork.org/scripts/407670/Hide%20Rating%20chesscom%20live%20game.meta.js
// ==/UserScript==

(function() {
    'use strict';

function lookforrating(classe) {

    if (document.getElementsByClassName(classe)) {

        var all = document.getElementsByClassName(classe);

        for (let i = 0; i < all.length; i++) {

            all[i].innerHTML = "";
        }

    }

}

setInterval(() => {

    lookforrating("user-tagline-rating")
    lookforrating("user-rating")

}, 100);

})();