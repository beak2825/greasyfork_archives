// ==UserScript==
// @name         Twitch Auto Claim Drop
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  This script will check for the updates on the invertory page and claim rewards when received.
// @author       DarkJS
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=mozilla.org
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/439734/Twitch%20Auto%20Claim%20Drop.user.js
// @updateURL https://update.greasyfork.org/scripts/439734/Twitch%20Auto%20Claim%20Drop.meta.js
// ==/UserScript==

const rewardButton = '[data-test-selector="DropsCampaignInProgressRewardPresentation-claim-button"]';
const timeCheck = 5; // In minutes
const shareButton = '[data-a-target="share-button"]';

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

if (window.location.pathname === '/drops/inventory')
{
    let checkChanges = (mutationsList) =>
    {
        for (const mutation of mutationsList)
        {
            if(document.querySelector(rewardButton) !== null)
            {
                document.querySelector(rewardButton).click();
                console.log('Congratulations, you have received a gift!');
                return true;
            }
        }
    };
    let verifyChanges = new MutationObserver(checkChanges);
    verifyChanges.observe(document.body, config);

    setInterval(function()
    {
        window.location.reload();
    }, timeCheck * 60000);
}
else
{
    setInterval(function()
    {
        if (document.querySelector(shareButton) !== null)
        {
            document.querySelector(shareButton).click();
        }
    }, 10000);
}