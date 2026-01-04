// ==UserScript==
// @name         Twitch
// @namespace    https://greasyfork.org/users/878514
// @version      20220913
// @description  Auto Claim Twitch Drop
// @author       Velens
// @match        https://www.twitch.tv/drops/inventory
// @icon         https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @grant        none
// @run-at       document-end
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/451302/Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/451302/Twitch.meta.js
// ==/UserScript==

const claimButton = '[data-test-selector="DropsCampaignInProgressRewardPresentation-claim-button"]';
var onMutate = function(mutationsList) {
	mutationsList.forEach(mutation => {
		if(document.querySelector(claimButton)) document.querySelector(claimButton).click();
	})
}
var observer = new MutationObserver(onMutate);
observer.observe(document.body, {childList: true, subtree: true});

setInterval(function() {window.location.reload();}, 1*60000);