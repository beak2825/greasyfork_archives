// ==UserScript==
// @name         Twitch Auto-claim
// @namespace    twitch-auto-drops
// @version      0.3
// @description  Will auto-claim drops from campaigns
// @author       PlatinumLyfe
// @run-at       document-idle
// @match        https://www.twitch.tv/drops/inventory
// @icon         https://static.twitchcdn.net/assets/favicon-16-52e571ffea063af7a7f4.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437692/Twitch%20Auto-claim.user.js
// @updateURL https://update.greasyfork.org/scripts/437692/Twitch%20Auto-claim.meta.js
// ==/UserScript==

(function(window, document) {
    'use strict';

    const claimButtonSelector = '[data-test-selector="DropsCampaignInProgressRewardPresentation-claim-button"]';
    var timeMins = 2.5;
    var timeScale = 0.5;
    console.log('Script running and checking for claimable drops...');

    setTimeout(function () {

        var claimButton = document.querySelector(claimButtonSelector);
        if (claimButton) {
            console.log('Claim found!');
            claimButton.click();
        } else {
            console.info('No claimable items found... sorry');
        }
        console.log('Refreshing page in ' + timeMins + ' minutes');
        setInterval(function () {
            timeMins = timeMins - timeScale;
            console.log('Refreshing page in ' + timeMins + ' minutes');
            if (timeMins <= 0) window.top.location.reload();
        }, 1000 * 60 * timeScale);
    }, 5000);
    // Sometimes this bugs and won't reload. This should fix.
    setTimeout(window.top.location.reload, (1000 * 60 * timeMins) + 5000);
    setTimeout(window.location.reload, (1000 * 60 * timeMins) + 5000);
})(window, document);