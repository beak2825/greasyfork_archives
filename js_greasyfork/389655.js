// ==UserScript==
// @name         Screw v.redd.it
// @version      0.3.1
// @description  Auto downvote v.redd.it links
// @author       Aj :^)
// @special_thanks Pegasus_Epsilon
// @include        *reddit.com/*
// @namespace https://greasyfork.org/users/310751
// @downloadURL https://update.greasyfork.org/scripts/389655/Screw%20vreddit.user.js
// @updateURL https://update.greasyfork.org/scripts/389655/Screw%20vreddit.meta.js
// ==/UserScript==

(function() {
'use strict';
    let buttonCache = [];

    var computeButtons = function() {
        let buttons = [],els;
        els = [...document.querySelectorAll('a[href="/domain/v.redd.it/"')];
        for (let i = 0; i < els.length; i++) {
            let button = els[i].parentNode.parentNode.parentNode.parentNode.parentNode.querySelector(".unvoted>.arrow.down");
            if (button) {
                buttons.push(button);
            }
        }
        return buttons;
    }

    var nextVote = function () {
        if ((!buttonCache.length && !(buttonCache = computeButtons()).length)) {
            return setTimeout(nextVote, 5000);
        }

        buttonCache.shift().click();

        setTimeout(nextVote, 1000 + Math.random() * 2000);
    }
    nextVote();
})();