// ==UserScript==
// @name         bd button
// @version      1.0
// @description  bd button remapper
// @author       Egelman
// @include https://*.grepolis.com/game/*
// @grant        none
// @namespace https://greasyfork.org/users/983723
// @downloadURL https://update.greasyfork.org/scripts/454896/bd%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/454896/bd%20button.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    document.addEventListener('keydown', (event) => {
        if (event.key === 'p') {
            var next = document.getElementsByClassName('btn_next');
            if (next.length === 1 && next[0] != null) {
                next[0].click();
            }
        } else if (event.key === 'o') {
            var prev = document.getElementsByClassName('btn_prev');
            if (prev.length === 1 && prev[0] != null) {
                prev[0].click();
            }
        }
    })
})();