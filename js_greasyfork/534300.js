// ==UserScript==
// @name         Twitch Directory AutoRefresh
// @namespace    http://tampermonkey.net/
// @version      2025-09-21
// @description  Autorefresh Twitch directory and automatically click show more + away pending drops notifications
// @icon         https://www.google.com/s2/favicons?domain=www.twitch.tv
// @author       esdeka
// @license      MIT
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534300/Twitch%20Directory%20AutoRefresh.user.js
// @updateURL https://update.greasyfork.org/scripts/534300/Twitch%20Directory%20AutoRefresh.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    console.log('autorefresh', window.location)
    // Wait for 5 minutes then refresh the page
    var repeat = function () {

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

        document.querySelectorAll('.side-nav-show-more-toggle__button > button').forEach((ShowMore) => {
          console.log('clicking show more')
          for (let i = 1; i < 12; i++) { setTimeout(()=>{ShowMore.click()}, i * 200); }
        });

    }

    setTimeout(repeat, 10*1000);
    setInterval(repeat, 310*1000); //  = 5 minutes
 
})();
