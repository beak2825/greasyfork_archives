// ==UserScript==
// @name         Hide Reddit Notification Bell Icon and Count 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides the bell icon and its following separator on old Reddit
// @match        https://old.reddit.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542751/Hide%20Reddit%20Notification%20Bell%20Icon%20and%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/542751/Hide%20Reddit%20Notification%20Bell%20Icon%20and%20Count.meta.js
// ==/UserScript==

(function () {
    function hideBell() {
        let notif = document.querySelector('a#notifications');
        while (notif) {
            notif.style.display = 'none';
            const next = notif.nextElementSibling;
            if (next && (next.classList.contains('separator') || next.classList.contains('badge-count') || next.classList.contains('message-count'))) {
                next.style.display = 'none';
                notif = next;
            } else {
                notif = false;
            }
        }

    }

    // Run once and also when DOM updates
    hideBell();
    const observer = new MutationObserver(hideBell);
    observer.observe(document.body, {childList: true, subtree: true});
})();