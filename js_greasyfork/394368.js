// ==UserScript==
// @name         Twitch Auto Rewarding
// @namespace    https://github.com/gslin/twitch-auto-rewarding-userscript
// @version      0.20230320.0
// @description  Auto rewarding channel points on Twitch.
// @author       Gea-Suan Lin <gslin@gslin.com>
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/394368/Twitch%20Auto%20Rewarding.user.js
// @updateURL https://update.greasyfork.org/scripts/394368/Twitch%20Auto%20Rewarding.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        let el = document.querySelector('div.claimable-bonus__icon')?.closest('button');
        if (el) {
            console.debug('Twitch Auto Rewarding clicked a button.');
            el.click();
        }
    }, 1000);
})();
