// ==UserScript==
// @name         DYSN (Disable YouTube Shorts Notifications)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Empêche les notifications pour les vidéos "Shorts" sur YouTube
// @author       yglsan
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-or-later           ### cf. terms of the Gnu General Public License between  /*       */ symbols ###
// @downloadURL https://update.greasyfork.org/scripts/525358/DYSN%20%28Disable%20YouTube%20Shorts%20Notifications%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525358/DYSN%20%28Disable%20YouTube%20Shorts%20Notifications%29.meta.js
// ==/UserScript==



/*
GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2025 yglsan

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/




(function() {
    'use strict';

   
   
    const SHORTS_SELECTOR = 'ytd-notification-renderer a[href*="/shorts/"]';
    const NOTIFICATIONS_CONTAINER = "ytd-notification-renderer";


    function removeShortsNotifications() {
        document.querySelectorAll(SHORTS_SELECTOR).forEach(link => {
            link.closest(NOTIFICATIONS_CONTAINER)?.remove();
        });
    }


    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches(NOTIFICATIONS_CONTAINER)) {
                    removeShortsNotifications();
                }
            });
        });
    });

    function startObserver() {
        const container = document.querySelector("#notifications");
        if (container) {
            observer.observe(container, { childList: true, subtree: true });
            removeShortsNotifications();
        } 
        
        else {
            setTimeout(startObserver, 500);
        }
    }

    startObserver();

    setInterval(removeShortsNotifications, 3000); 
})();
