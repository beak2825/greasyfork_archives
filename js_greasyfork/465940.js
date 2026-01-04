// ==UserScript==
// @name         Twitch Drop Inventory Page Claimer
// @version      0.1
// @description  Clicks the Claim Now Button
// @author       meario
// @match        https://www.twitch.tv/drops/inventory*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/en/users/1076715-meario
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465940/Twitch%20Drop%20Inventory%20Page%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/465940/Twitch%20Drop%20Inventory%20Page%20Claimer.meta.js
// ==/UserScript==

const claimButtonText = 'Claim Now';
var onMutate = function(mutationsList) {
	mutationsList.forEach(mutation => {
    var claimButtons = Array.from(document.querySelectorAll('button')).filter(el => el.textContent === claimButtonText);
    claimButtons.forEach(button => button.click())
	})
}
var observer = new MutationObserver(onMutate);
observer.observe(document.body, {childList: true, subtree: true});

setInterval(function() {
                  window.location.reload();
                }, 5*60000);
