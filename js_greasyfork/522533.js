// ==UserScript==
// @name         Yes, I'm here, YouTube Music
// @namespace    https://gitlab.com/user890104
// @version      20250801
// @description  Clicks on the annoying button for you
// @author       Vencislav Atanasov
// @license      MIT
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522533/Yes%2C%20I%27m%20here%2C%20YouTube%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/522533/Yes%2C%20I%27m%20here%2C%20YouTube%20Music.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tag = '[Yes, I\'m here, YouTube Music] ';

    console.log(`${tag}Script loaded`);

    setInterval(() => {
        const popup = document.querySelector('yt-formatted-string.ytmusic-you-there-renderer');

        if (!popup) {
            return;
        }

        const button = popup?.nextElementSibling?.querySelector('button');

        if (!button) {
            return;
        }

        button.click();
        console.log(`${tag}Yes button clicked`);
    }, 1_000);
})();