// ==UserScript==
// @name         bd button
// @version      1.1.2
// @description  bd button remapper
// @author       Egelman
// @include      https://*.grepolis.com/game/*
// @grant        none
// @namespace    https://greasyfork.org/users/983723
// @downloadURL https://update.greasyfork.org/scripts/454969/bd%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/454969/bd%20button.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    document.addEventListener('keypress', (event) => {
        try{
            if (event.key === 'p') {
                // var next = document.getElementsByClassName('btn_next');
                if (document.getElementsByClassName('btn_next')) {
                    document.getElementsByClassName('btn_next')[0].click();
                }
            } else if (event.key === 'o') {
                // var prev = document.getElementsByClassName('btn_prev');
                if (document.getElementsByClassName('btn_prev')) {
                    document.getElementsByClassName('btn_prev')[0].click();
                }
            }
        } catch (err) {
            console.log("bd window is not open");
        }
        
    })
})();