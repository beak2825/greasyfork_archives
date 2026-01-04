// ==UserScript==
// @name         Auto Claim Twitch drop
// @version      0.69.700
// @description  Auto clicking "Claim Now" in the twitch inventory page
// @author       bAdRock,h3mul
// @match        https://www.twitch.tv/drops/inventory
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/1242491
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483734/Auto%20Claim%20Twitch%20drop.user.js
// @updateURL https://update.greasyfork.org/scripts/483734/Auto%20Claim%20Twitch%20drop.meta.js
// ==/UserScript==

const claimButtonLabelSelector = 'div[data-a-target="tw-core-button-label-text"]';
const claimButtonText = "Claim Now";

let claimScheduled = false;
const onMutation = function () {
    if (claimScheduled) return;
    // Schedule a claim in the future, allowing the mutations to pile up.
    setTimeout(() => {
        claimAll();
        claimScheduled = false;
    }, 1500);
    claimScheduled = true;
}

const claimAll = function() {
    console.log(`Claim all triggered`);
    const claimButtons = Array.from(document.querySelectorAll(claimButtonLabelSelector))
                              .filter(div => div.innerHTML == claimButtonText)
                              .map(div => div.closest('button'));
    if (!claimButtons.length) return
    console.log(`Found ${claimButtons.length} items to claim`);
    claimButtons.forEach(button => button.click());
}

var observer = new MutationObserver(onMutation);
observer.observe(document.querySelector('div.root'), {childList: true, subtree: true});

setInterval(function() {
    window.location.reload();
}, 15*60000);
