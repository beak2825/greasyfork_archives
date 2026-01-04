// ==UserScript==
// @name         TorrentBD Shoutbox Prevent Idle Pause
// @version      1.3
// @description  Disables shoutbox auto-pause by faking activity
// @author       5ifty6ix
// @namespace    5ifty6ix
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541516/TorrentBD%20Shoutbox%20Prevent%20Idle%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/541516/TorrentBD%20Shoutbox%20Prevent%20Idle%20Pause.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function simulateActivity() {
        const event = new Event('mousemove');
        document.dispatchEvent(event);
    }

    // Fire fake mousemove every 10 seconds to stay "active"
    setInterval(simulateActivity, 10000);

    // Also block known pause functions if they exist
    const observer = new MutationObserver(() => {
        const overlay = document.querySelector('#shoutbox-idle-overlay, .shoutbox-idle, .idle-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
