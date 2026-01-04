// ==UserScript==
// @name         view vote counts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  view vote counts without clicking in stackoverflow
// @author       You
// @match        https://stackoverflow.com/questions/*
// @icon         https://www.google.com/s2/favicons?domain=stackoverflow.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436945/view%20vote%20counts.user.js
// @updateURL https://update.greasyfork.org/scripts/436945/view%20vote%20counts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const clickVote = function() {
        let el = document.querySelector('.js-vote-count.c-pointer');
        if(el) {
            el.click();
            setTimeout(function(){clickVote();}, 1500);
        }
    }

    window.onload = function() {
        clickVote();
    };
})();