// ==UserScript==
// @name         Auto click bonus points on Twitch.tv after random delay
// @namespace    https://greasyfork.org/users/552550
// @version      20.19.1
// @description  Auto clicks after random delay, adapted from https://greasyfork.org/en/scripts/392555-auto-click-bonus-points-on-twitch-tv/code
// @author       Nallep
// @match        https://www.twitch.tv/*
// @run-at       document-start
// @icon         data:image/svg+xml;utf8,<svg class="tw-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><g><path fill-rule="evenodd" d="M16.503 3.257L18 7v11H2V7l1.497-3.743A2 2 0 015.354 2h9.292a2 2 0 011.857 1.257zM5.354 4h9.292l1.2 3H4.154l1.2-3zM4 9v7h12V9h-3v4H7V9H4zm7 0v2H9V9h2z" clip-rule="evenodd"></path></g></svg>
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402777/Auto%20click%20bonus%20points%20on%20Twitchtv%20after%20random%20delay.user.js
// @updateURL https://update.greasyfork.org/scripts/402777/Auto%20click%20bonus%20points%20on%20Twitchtv%20after%20random%20delay.meta.js
// ==/UserScript==

const button = '.claimable-bonus__icon';
var onMutate = function(mutationsList) {
	mutationsList.forEach(mutation => {
		if(document.querySelector(button)) {
            var timeout= ((Math.random() * 30000) + 2000);
            setTimeout(function(){ document.querySelector(button).click(); }, timeout);
        }
	})
}
var observer = new MutationObserver(onMutate);
observer.observe(document.body, {childList: true, subtree: true});