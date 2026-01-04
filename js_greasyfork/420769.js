// ==UserScript==
// @name         Twitch Embeds CTA Blocker
// @namespace    Dostream
// @version      0.0.1
// @description  Block Twitch embeds CTA modals and purple screens
// @author       Dostream
// @match        *://player.twitch.tv/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/420769/Twitch%20Embeds%20CTA%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/420769/Twitch%20Embeds%20CTA%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.core-error>div>div, .core-error>div>div p {display: none !important;}');

    const origFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = (url, init, ...args) => {
        if (typeof url === "string") {
            if (url.includes("/access_token")) {
                url = url.replace("player_type=embed", "player_type=site");
            } else if (
                url.includes("/gql") &&
                init &&
                typeof init.body === "string" &&
                init.body.includes("PlaybackAccessToken")
            ) {
                const newBody = JSON.parse(init.body);
                newBody.variables.playerType = "site";
                init.body = JSON.stringify(newBody);
            }
        }
        return origFetch(url, init, ...args);
    };
})();