// ==UserScript==
// @name Auto Claim Twitch drop
// @description Auto Claim Twitch drop in inventory
// @version 0.0.0.3
// @icon https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @author JAS1998
// @copyright 2023+ , JAS1998
// @namespace https://greasyfork.org/users/4792
// @license CC BY-NC-ND 4.0; http://creativecommons.org/licenses/by-nc-nd/4.0/
// @compatible Chrome tested with Tampermonkey
// @contributionURL https://www.paypal.com/donate?hosted_button_id=9JEGCDFJJHWU8
// @run-at document-end
// @include *twitch.tv/drops/inventory*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/448887/Auto%20Claim%20Twitch%20drop.user.js
// @updateURL https://update.greasyfork.org/scripts/448887/Auto%20Claim%20Twitch%20drop.meta.js
// ==/UserScript==

/* jshint esversion: 9 */

const claimButton = '[data-test-selector="DropsCampaignInProgressRewardPresentation-claim-button"]';

var onMutate = function(mutationsList) {
    mutationsList.forEach(mutation => {
        if(document.querySelector(claimButton)) {
            document.querySelector(claimButton).click();
            location.reload();
        }
    });
};

var observer = new MutationObserver(onMutate);
observer.observe(document.body, {childList: true, subtree: true});

setInterval(function() {
    window.location.reload();
}, 300000);
