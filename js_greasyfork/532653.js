// ==UserScript==
// @name         GeoGuessr Leaderboard Cleaner
// @namespace    https://greasyfork.org/en/users/1323365
// @version      1.0.0
// @description  Finds alts and cheaters on the leaderboard and stops displaying them.
// @author       Funnier04
// @match        *://*.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532653/GeoGuessr%20Leaderboard%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/532653/GeoGuessr%20Leaderboard%20Cleaner.meta.js
// ==/UserScript==


// You can add users here that you don't want to show on the leaderboard. This will only show for you. Format: ["userId1","userId2"]
const personalBanList = [];


(function() {
    'use strict';
    let banList = [];
    const originalFetch = window.fetch;
    window.fetch = async function(resource, config) {
        if (typeof resource === "string" && (resource.match(/^https:\/\/www\.geoguessr\.com\/api\/v4\/ranked-system\/ratings\?offset=\d+&limit=11&country=[a-z]{2}$/) || resource.match(/^https:\/\/www\.geoguessr\.com\/api\/v4\/ranked-system\/ratings\?offset=\d+&limit=11/))) {
            const offset = parseInt(resource.match(/(?:\?offset=)(\d+)(?=&limit)/)[1], 10);;
            let searchType = ""
            if (resource.match(/^https:\/\/www\.geoguessr\.com\/api\/v4\/ranked-system\/ratings\?offset=\d+&limit=11&country=[a-z]{2}$/)) {
                searchType += "&country="+resource.match(/country=([a-z]{2})/)[1];
            }
            if (resource.match(/&gameMode=[^&]+$/)) {
                searchType += "&gameMode="+resource.match(/&gameMode=([^&]+)/)[1];
            }

            if (banList.length == 0) {
                const banListFetch = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQe7dtvSYKJHMmB0BRTxP3qU8UAota-7SBmKoY6rF1VXfnw_KMntmjsl1GICx-62Ckv2fUhZeNmv1JZ/pub?gid=0&single=true&output=csv');
                banList = (await banListFetch.text()).split("\r\n");
                banList = banList.concat(personalBanList);
            };

            let newLeaderboard = []
            for (let i = 0; i < Math.floor((offset + banList.length + 10) / 100)+1; i++) {
                let currentLeaderboard = await fetch('https://www.geoguessr.com/api/v4/ranked-system/ratings?offset='+i*100+'&limit=100'+searchType);
                let tempData = await currentLeaderboard.json();
                newLeaderboard = newLeaderboard.concat(tempData);
            }

            let shift = 0;
            for (let i = 0; i < newLeaderboard.length; i++) {
                newLeaderboard[i].position = i+1;
                for (let j = 0; j < banList.length; j++) {
                    if (newLeaderboard[i].userId == banList[j]) {
                        newLeaderboard.splice(i, 1);
                        shift++;
                        i--;
                        break;
                    }
                }
            }

            return new Response(JSON.stringify(newLeaderboard.slice(0+offset, 11+offset)), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return originalFetch.call(this, resource, config);
    };
})();