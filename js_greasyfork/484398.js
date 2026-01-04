// ==UserScript==
// @name         Roblox group claimer with auto join, and discord webhooks
// @namespace    Roblox group claimer
// @version      2
// @description  Finds unclaimed roblox groups and sends them to a webhook, or auto joins them!
// @author       ._._.dustin
// @match        https://roblox.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @contributionURL https://www.buymeacoffee.com/dustin21335
// @downloadURL https://update.greasyfork.org/scripts/484398/Roblox%20group%20claimer%20with%20auto%20join%2C%20and%20discord%20webhooks.user.js
// @updateURL https://update.greasyfork.org/scripts/484398/Roblox%20group%20claimer%20with%20auto%20join%2C%20and%20discord%20webhooks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const useDiscordWebhook = true; // Set to true if you want to use a discord webhook
    const autoClaim = true; // Set to true if you want to auto claim groups

    const webhookURL = 'DISCORD_WEBHOOK'; // Put discord webhook where DISCORD_WEBHOOK is
    const threads = 5;

    function groupFinder(id) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://www.roblox.com/groups/group.aspx?gid=${id}`,
            onload: function(response) {
                if (response.responseText.includes('owned')) {
                } else {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://groups.roblox.com/v1/groups/${id}`,
                        onload: function(groupResponse) {
                            const data = JSON.parse(groupResponse.responseText);
                            if (!groupResponse.responseText.includes('isLocked') && groupResponse.responseText.includes('owner')) {
                                if (data.publicEntryAllowed && data.owner === null) {
                                    console.log(`[+] Hit: ${id}`);
                                    if (useDiscordWebhook) {
                                        sendWebhook(`@everyone Hit: https://www.roblox.com/groups/group.aspx?gid=${id}`);
                                    }
                                    if (autoClaim) {
                                        autoClaimGroup(id);
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    function sendWebhook(message) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: webhookURL,
            data: JSON.stringify({ content: message }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

function autoClaimGroup(id) {
    setTimeout(function() {
        window.location.href = `https://www.roblox.com/groups/${id}`;
    }, 1000);
    setTimeout(function() {
        document.getElementById('group-join-button').click();
        document.querySelector('.icon-more').click();
        setTimeout(function() {
            const claimOwnershipBtn = document.querySelector('#claim-ownership button');
            if (claimOwnershipBtn) {
                claimOwnershipBtn.click();
                console.log("Group claimed!");
            } else {
                console.log("Failed to claim :C");
            }
        }, 890);
    }, 2000);
}

    function main() {
        setInterval(() => {
            const ids = Array.from({ length: threads * 2 }, () => Math.floor(Math.random() * (1150000 - 1000000 + 1)) + 1000000);
            ids.forEach(id => groupFinder(id));
        }, 5000);
    }

    main();

})();
