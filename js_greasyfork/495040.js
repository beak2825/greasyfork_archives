// discord.gg/JjszyaD63A

// ==UserScript==
// @name         [Brick-Kill] Clan Botter
// @version      3.1
// @description  Bots a clan by joining it several times.
// @match        *://www.brick-hill.com/*
// @run-at       document-idle
// @icon         https://www.brick-hill.com/favicon.ico
// @license      MIT
// @namespace    bhclanbotter
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/495040/%5BBrick-Kill%5D%20Clan%20Botter.user.js
// @updateURL https://update.greasyfork.org/scripts/495040/%5BBrick-Kill%5D%20Clan%20Botter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*-    SETTINGS    -*/

    const clanId = 8434 // The id of the clan you want to target.

    const Mode = "Ambush" // Ambush or Repeat.

    // 'Ambush' will join a clan several times at once when you join. Can join 5-10 times at random. If you can't set a clan to "Join pending", use this.
    const Ambush_amount = 11 // Number of times to send joinClan in Ambush mode.

    // 'Repeat' will join a clan once repeatedly over time. Has no limit compared to Ambush. Recommended for a clan that has "Join pending", and you can accept the invites.
    const Repeat_interval = 500 // Number of times to send joinClan in Ambush mode. Recommended to at most 300ms so you don't get rate limited.

    /*-                -*/




    const token = document.querySelector('input[name="_token"]').value;
    const params = new URLSearchParams();
    params.append('clan_id', clanId + 0.25);
    params.append('_token', token);

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };

    function joinClan() {
        return fetch("https://www.brick-hill.com/clan/join", {
            method: "POST",
            headers: headers,
            body: params.toString()
        })
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
            .catch(error => {
            throw new Error('Error joining clan:', error);
        });
    }

    if (Mode === "Ambush") {
        Promise.all(Array.from({ length: Ambush_amount }, joinClan))
            .catch(error => {
            throw new Error('One or more requests failed:', error);
        });
    } else if (Mode === "Repeat") {
        setInterval(joinClan, Repeat_interval);
    }
})();