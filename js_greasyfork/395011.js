// ==UserScript==
// @name         Twitch Channel points
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Twitch channel points accepter
// @author       Stuffa1991
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395011/Twitch%20Channel%20points.user.js
// @updateURL https://update.greasyfork.org/scripts/395011/Twitch%20Channel%20points.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    if (MutationObserver) console.log('Auto claimer is enabled.');

    const observer = new MutationObserver(mutations => {
        setTimeout(() => {
            const bonus = document.getElementsByClassName('claimable-bonus__icon');
            for (var i = 0; i < bonus.length; i++) {
                if (i == 0) console.log('Claimed!');
                bonus[i].click()
            }
        }, Math.random() * 1000 + 2500);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();