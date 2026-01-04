// ==UserScript==
// @name         Fuck JAVMost
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       metafox12345
// @match        https://*.javmost.com/star/*
// @match        https://*.javmost.com/category/*
// @match        https://*.javmost.com/maker/*
// @match        https://*.javmost.com/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373500/Fuck%20JAVMost.user.js
// @updateURL https://update.greasyfork.org/scripts/373500/Fuck%20JAVMost.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    function killAds() {
        requestIdleCallback(() => {
            const cards = document.querySelectorAll('.card');
            for (const card of cards) {
                const adLinks = [...card.querySelectorAll('a[alt]')].filter(x => {
                    // JAV identifier
                    const alt = x.getAttribute('alt');
                    return /[a-zA-Z]+\-\d+/.exec(alt) != null && !x.href.endsWith(alt);
                });
                for (const link of adLinks) {
                    link.href = document.location.origin + '/' + link.getAttribute('alt');
                    console.log('🗡 [Fuck JAVMost] Killed one ad');
                }
            }
        });
    }
    killAds();

    const observer = new MutationObserver(() => {
        console.log('🗡 [Fuck JAVMost] Observed DOM mutation.')
        killAds();
    });
    observer.observe(document.querySelector('#content-update'), {
        childList: true,
    });
})();