// ==UserScript==
// @name         Orochi Auto Prover (15 min)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Auto refresh + auto click Prove button on Orochi OnProver every 15 mins
// @match        https://onprover.orochi.network/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542191/Orochi%20Auto%20Prover%20%2815%20min%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542191/Orochi%20Auto%20Prover%20%2815%20min%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('✅ Orochi Auto Prover script loaded!');

    let clicked = false;

    // Keep checking every second until the Prove button appears
    const interval = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.textContent.trim().toLowerCase().includes('prove')) {
                btn.click();
                console.log('✅ Clicked Prove button!');
                clicked = true;
                clearInterval(interval);
            }
        });

        if (!clicked) {
            console.log('🔄 Prove button not found yet, retrying...');
        }
    }, 1000); // Check every 1 second

    // Auto-refresh every 15 minutes (15 * 60 * 1000 ms)
    setTimeout(function(){
        console.log('⏰ 15 mins passed, refreshing...');
        location.reload();
    }, 15 * 60 * 1000);
})();