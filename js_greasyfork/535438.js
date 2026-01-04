// ==UserScript==
// @name         Add "Friends That Play" Button on Steam Gamecards
// @namespace    https://github.com/encumber
// @version      1.3
// @description  Adds a "Friends That Play" button after the Store Page button, and removes the apphub_OtherSiteInfo div to avoid issues on Steam gamecards pages.
// @author       Nitoned
// @match        https://steamcommunity.com/id/*/gamecards/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535438/Add%20%22Friends%20That%20Play%22%20Button%20on%20Steam%20Gamecards.user.js
// @updateURL https://update.greasyfork.org/scripts/535438/Add%20%22Friends%20That%20Play%22%20Button%20on%20Steam%20Gamecards.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const yourid = "yourid"
    const appIdMatch = window.location.pathname.match(/\/gamecards\/(\d+)/);
    if (!appIdMatch) return;
    const appId = appIdMatch[1];

    const interval = setInterval(() => {
        // Remove any div with the class apphub_OtherSiteInfo
        const otherSiteDiv = document.querySelector('div.apphub_OtherSiteInfo');
        if (otherSiteDiv) {
            otherSiteDiv.remove();
        }

        // Look for the correct Store Page button
        const allLinks = document.querySelectorAll('a');
        let storePageButton = null;

        for (const link of allLinks) {
            const span = link.querySelector('span');
            if (span && span.textContent.trim() === 'Store Page') {
                storePageButton = link;
                break;
            }
        }

        if (storePageButton) {
            clearInterval(interval);

            const newLink = document.createElement('a');
            newLink.href = `https://steamcommunity.com/id/${yourid}/friendsthatplay/${appId}`;
            newLink.className = storePageButton.className;
            newLink.style.marginLeft = '6px';

            const newSpan = document.createElement('span');
            newSpan.className = storePageButton.querySelector('span')?.className || '';
            newSpan.textContent = 'Friends That Play';

            newLink.appendChild(newSpan);
            storePageButton.parentNode.insertBefore(newLink, storePageButton.nextSibling);
        }
    }, 500);
})();