// ==UserScript==
// @name         Redirect YouTube to Front-End
// @version      0.5
// @description  Redirect YouTube URLs to specified front-end instance.
// @author       seaque
// @license      MIT
// @namespace    https://github.com/seaque/tampermonkey-scripts
// @match        *://*.youtube.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/a/a6/YouTube_social_dark_square_%282017%29.svg
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/457203/Redirect%20YouTube%20to%20Front-End.user.js
// @updateURL https://update.greasyfork.org/scripts/457203/Redirect%20YouTube%20to%20Front-End.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default front-end instance
    // Change it to whatever you like.
    const frontEndInstance = "inv.nadeko.net";

    const redirectToFrontEnd = () => {
        const url = new URL(window.location.href);
        if (url.hostname === "www.youtube.com" && url.pathname === "/watch") {
            const videoId = url.searchParams.get("v");
            if (videoId) {
                const frontEndUrl = `https://${frontEndInstance}/watch?v=${videoId}`;
                window.location.replace(frontEndUrl);
            }
        }
    };

    redirectToFrontEnd();
})();