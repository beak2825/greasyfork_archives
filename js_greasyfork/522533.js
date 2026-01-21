// ==UserScript==
// @name         Yes, I'm here, YouTube Music
// @namespace    https://gitlab.com/user890104
// @version      20260120
// @description  Clicks on the annoying buttons for you
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
        // Still watching? Video will pause soon
        const notification = document.querySelector('yt-formatted-string.yt-notification-action-renderer');

        if (notification?.offsetParent !== null) {
            const notificationButton = notification?.parentElement?.nextElementSibling?.querySelector('button');

            if (notificationButton) {
                notificationButton.click();
                console.log(`${tag}[Notification] Yes button clicked`);
            }
        }

        // Video paused. Continue watching?
        const popup = document.querySelector('yt-formatted-string.ytmusic-you-there-renderer');

        if (popup?.offsetParent !== null) {
            const popupButton = popup?.nextElementSibling?.querySelector('button');

            if (popupButton) {
                popupButton.click();
                console.log(`${tag}[Popup] Yes button clicked`);
            }
        }

    }, 1_000);
})();