// ==UserScript==
// @name         Roblox Friend Requests Counter
// @namespace    https://mopsfl.de
// @version      1.2
// @description  Count total friend requests on Roblox
// @author       mopsfl
// @match        *://*.roblox.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523673/Roblox%20Friend%20Requests%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/523673/Roblox%20Friend%20Requests%20Counter.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    async function fetchFriendRequests(cursor = "") {
        const url = `https://friends.roblox.com/v1/my/friends/requests?sortOrder=Desc&limit=100${cursor ? `&cursor=${cursor}` : ""}`;

        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    }

    async function main() {
        const cachedData = GM_getValue("friendRequestCount", null);
        const now = new Date().getTime();

        if (cachedData && now - cachedData.t < 5 * 60 * 1000) {
            console.log(`Using cached value: ${cachedData.v}`);
            waitForElm("#nav-friends > div.dynamic-width-item.align-right > span").then(el => {
                el.innerText = cachedData.v;
            });

            waitForElm("#friends-web-app > div > div.rbx-tabs-horizontal.rbx-scrollable-tabs-horizontal > div > div > div.friends-content.section > div > div > h2").then(el => {
                el.innerText = `Requests (${cachedData.v})`;
            });
            return;
        } else {
            waitForElm("#nav-friends > div.dynamic-width-item.align-right > span").then(el => {
                el.innerText = cachedData.v;
            });

            waitForElm("#friends-web-app > div > div.rbx-tabs-horizontal.rbx-scrollable-tabs-horizontal > div > div > div.friends-content.section > div > div > h2").then(el => {
                el.innerText = `Requests (${cachedData.v})`;
            });
        }

        console.log("Fetching all friend requests! This may take a few seconds...")

        let length = 0;
        let cursor = "";

        try {
            do {
                const response = await fetchFriendRequests(cursor);
                length += response.data.length;
                cursor = response.nextPageCursor;
            } while (cursor);

            GM_setValue("friendRequestCount", { v: length, t: now });

            waitForElm("#nav-friends > div.dynamic-width-item.align-right > span").then(el => {
                el.innerText = length;
            });

            waitForElm("#friends-web-app > div > div.rbx-tabs-horizontal.rbx-scrollable-tabs-horizontal > div > div > div.friends-content.section > div > div > h2").then(el => {
                el.innerText = `Requests (${length})`;
            });

            console.log(`Total friend requests: ${length}`);
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        }
    }

    main();
})();
