// ==UserScript==
// @name         Twitch Directory AutoRefresh
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Autorefresh Twitch directory and automatically click away pending drops notifications
// @author       sdk
// @match        https://www.twitch.tv/*
// @grant        none
// @homepage     https://greasyfork.org/en/scripts/496422-twitch-directory-auto-refresh
// @downloadURL https://update.greasyfork.org/scripts/496422/Twitch%20Directory%20AutoRefresh.user.js
// @updateURL https://update.greasyfork.org/scripts/496422/Twitch%20Directory%20AutoRefresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('autorefresh', window.location)
    // Wait for 5 minutes then refresh the page
    setInterval(function() {

        console.log('autorefresh2', window.location)
        if (window.location.pathname.startsWith('/directory/')){
            // location.reload();
            console.log('autorefresh3', window.location)

            document.querySelector('a[data-a-target="following-overview-tab"]').click();
            setTimeout(() => document.querySelector('a[data-a-target="following-live-tab"]').click(), 100);
        }

        var notifs = parseInt(document.querySelector('nav div.onsite-notifications div.onsite-notifications__badge')?.textContent) || 0;
        if (notifs >= 1) {
            console.log('notifs', notifs);

            document.querySelector('button[aria-label="Open Notifications"]')?.click();
            setTimeout(()=> {
                console.log('markread?', document.querySelector('#OnsiteNotificationPopover-header')?.parentElement.firstChild, document.querySelector('#OnsiteNotificationPopover-header')?.parentElement.firstChild.querySelector('button'));
                document.querySelector('#OnsiteNotificationPopover-header')?.parentElement.firstChild.querySelector('button')?.click()
                document.querySelector('button[aria-label="Open Notifications"]')?.click();
            }, 50)
        }

    }, 310*1000); //  = 5 minutes

})();

