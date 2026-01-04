// ==UserScript==
// @name         Trade History Button
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  Adds a button that redirects you to previous trades with the user
// @author       You
// @match        https://www.chickensmoothie.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chickensmoothie.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519398/Trade%20History%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/519398/Trade%20History%20Button.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Configuration: Set to true/false to enable/disable the button on specific pages
    const config = {
        enableOnEditTrade: true,
        enableOnMemberList: true,
        enableOnViewTrade: true,
    };

    // Helper function to prevent page reload
    function createButton(tradeLink) {
        const btn = document.createElement("button");
        btn.innerHTML = "Trade History";
        btn.style.marginLeft = "10px";
        btn.style.verticalAlign = "middle";

        btn.onclick = (event) => {
            event.preventDefault(); // Prevent any default action of the button
            window.open(tradeLink); // Open the trade link in a new window
        };

        return btn;
    }

    // Add button for "edittrade" page
    if (config.enableOnEditTrade && window.location.href.includes("chickensmoothie.com/trades/edittrade.php")) {
        const headers = document.getElementsByClassName("header");

        if (headers.length > 0) {
            const targetHeader = (headers.length === 3) ? headers[1] : headers[0];
            const username = targetHeader.innerText.slice(22, -1).trim();
            const tradeLink = `https://www.chickensmoothie.com/trades/tradingcenter.php?partner=${encodeURIComponent(username)}`;
            const btn = createButton(tradeLink);

            targetHeader.appendChild(btn);
        }
    }

    // Add button for "memberlist" page
    if (config.enableOnMemberList && window.location.href.includes("chickensmoothie.com/Forum/memberlist.php")) {
        const pageBody = document.getElementById("page-body");
        if (pageBody) {
            const headings = pageBody.getElementsByTagName("h2");
            for (let heading of headings) {
                if (heading.innerText.startsWith("Viewing profile -")) {
                    const username = heading.innerText.replace("Viewing profile - ", "").trim();
                    const tradeLink = `https://www.chickensmoothie.com/trades/tradingcenter.php?partner=${encodeURIComponent(username)}`;
                    const btn = createButton(tradeLink);

                    heading.appendChild(btn);
                    break;
                }
            }
        }
    }

// Add button for "viewtrade" page
if (config.enableOnViewTrade && window.location.href.includes("chickensmoothie.com/trades/viewtrade.php")) {
    // Get all infoline elements
    const infolines = document.querySelectorAll('.infoline');

    // Find the index of the "view-trade-share-link-infoline"
    const targetInfolineIndex = Array.from(infolines).findIndex(infoline => infoline.classList.contains('view-trade-share-link-infoline'));

    // If we found the target infoline (it exists), we will target the one before it
    if (targetInfolineIndex > 0) {
        const infoline = infolines[targetInfolineIndex - 1]; // Get the last infoline before the target

        const usernameLink = infoline.querySelector('a');
        if (usernameLink) {
            const username = usernameLink.innerText.trim();
            const tradeLink = `https://www.chickensmoothie.com/trades/tradingcenter.php?partner=${encodeURIComponent(username)}`;
            const btn = createButton(tradeLink);

            const messageIntro = infoline.querySelector('.messageintro');
            if (messageIntro) {
                messageIntro.appendChild(btn);
            } else {
                infoline.appendChild(btn);
            }
        }
    }
}
})();
