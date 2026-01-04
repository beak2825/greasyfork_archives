// ==UserScript==
// @name         Robloxify
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Make bopimo robloxifyed.
// @author       Teemsploit
// @match        https://www.bopimo.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523985/Robloxify.user.js
// @updateURL https://update.greasyfork.org/scripts/523985/Robloxify.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function resetLinkText() {
        const links = document.querySelectorAll('a');
        links.forEach((link) => {
            if (link.textContent) {
                link.textContent = link.textContent
                    .replace(/coin/gi, 'robux')
                    .replace(/level/gi, 'game')
                    .replace(/bopimo/gi, 'roblox')
                    .replace(/user/gi, 'player')
                    .replace(/lobby/gi, 'game hub')
                    .replace(/shop/gi, 'store')
                    .replace(/skin/gi, 'avatar')
                    .replace(/Forums/gi, 'Community')
                    .replace(/Users/gi, 'Players')
                    .replace(/Download/gi, 'Install')
                    .replace(/Upgrade/gi, 'Premium');
            }
        });
    }

    resetLinkText();
})();