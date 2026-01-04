// ==UserScript==
// @name         Zaka-Zaka auto-join gift giveaway
// @namespace    tampermonkey-scripts
// @version      1.2
// @description  This script complements this one https://greasyfork.org/en/scripts/466333-zaka-zaka-gift-auto-participate
// @author       Role_Play
// @match        https://zaka-zaka.com/game/gifts/*
// @exclude      https://zaka-zaka.com/game/gifts/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466334/Zaka-Zaka%20auto-join%20gift%20giveaway.user.js
// @updateURL https://update.greasyfork.org/scripts/466334/Zaka-Zaka%20auto-join%20gift%20giveaway.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const joinButton = document.querySelector('.gifts-detail-btn span');

    if (joinButton) {
        joinButton.click();
        setTimeout(() => {
            window.location.href = 'https://zaka-zaka.com/game/gifts/';
        }, 1000);
    }
})();
