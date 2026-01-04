// ==UserScript==
// @name         MafiaOrder Auto Crime 2
// @namespace    Phantom Scripting
// @version      0.2
// @description  Automatically commit a crime in MafiaOrderwith
// @author       Phantom
// @match        https://www.mafiaorder.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480970/MafiaOrder%20Auto%20Crime%202.user.js
// @updateURL https://update.greasyfork.org/scripts/480970/MafiaOrder%20Auto%20Crime%202.meta.js
// ==/UserScript==


// Did some changes, did you notice them?

(function() {
    'use strict';

    const $ = window.jQuery;

    let a = false;
    let b = "";
    const c = 3000;

    async function d(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function e() {
        if (a) {
            return;
        }

        const f = $('a.btn.btn-xl.btn-default:contains("Commit Crime"):contains("20 Energy")'); //        Crime Level 'Energy based'
        const g = $('.alert-danger:contains("sent you to jail")').length > 0;

        if (g) {
            console.log("You are in jail, waiting for 30 seconds...");
            await d(30000); //                           Jail
            console.log("Jail time is up.");
            window.history.back();
        } else {
            console.log(`Waiting for 10 seconds...`);
            await d(10000); //                           Crime
        }

        if (f.length > 0 && f.attr('href').includes('_CSFR=')) {
            a = true;
            f.click();
            a = false;
        }
    }

    function h() {
        const i = window.location.href;
        const j = i.match(/_CSFR=([a-f0-9]+)/i);
        if (j) {
            return j[1];
        }
        return "";
    }

    const k = new MutationObserver(async (l, m) => {
        for (const n of l) {
            if (n.type === 'childList' && n.addedNodes.length > 0) {
                const o = h();
                if (o !== b) {
                    b = o;
                    setTimeout(() => {
                        e();
                    }, c);
                }
            }
        }
    });

    k.observe(document.body, { childList: true, subtree: true });

    $(document).ready(() => {
        e();
    });

})();
