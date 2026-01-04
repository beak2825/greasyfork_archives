// ==UserScript==
// @name         Remove Telemetr.io Blur and Notifications
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       sharmanhall
// @description  Removes blur effect and notifications on telemetr.io
// @match        https://telemetr.io/en/net/*
// @match        https://telemetr.io/en/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://telemetr.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510172/Remove%20Telemetrio%20Blur%20and%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/510172/Remove%20Telemetrio%20Blur%20and%20Notifications.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements() {
        // Remove blur div for /en/net/* pages
        const blurDivNet = document.querySelector('body > main > div > div.relative.min-h-\\[800px\\] > div.absolute.inset-0.z-20.flex.justify-center.items-start.p-2.top-\\[212px\\]');
        if (blurDivNet) {
            blurDivNet.remove();
        }

        // Remove blur div for /en/channels/* pages
        const blurDivChannels = document.querySelector('body > main > div.container.relative.my-16.min-h-\\[500px\\] > div.absolute.inset-0.z-20.flex.justify-center');
        if (blurDivChannels) {
            blurDivChannels.remove();
        }

        // Remove update notification and "Choose a Different Plan" overlay
        const notifications = document.querySelectorAll('.auth-plug');
        notifications.forEach(notification => notification.remove());
    }

    // Run the function immediately
    removeElements();

    // Set up a MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(removeElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();