// ==UserScript==
// @name         404 to Archive Redirecter
// @namespace    https://github.com/MathiasHM
// @version      1.1
// @description  Redirects to the most recent Internet Archive snapshot if a page shows 404 or Not Found error.
// @author       Mathias H. M.
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532935/404%20to%20Archive%20Redirecter.user.js
// @updateURL https://update.greasyfork.org/scripts/532935/404%20to%20Archive%20Redirecter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const currentURL = window.location.href;
    const archiveAPI = 'https://archive.org/wayback/available?url=';

    // Prevent redirect loop
    if (window.location.hostname.includes('web.archive.org')) return;

    const notFoundIndicators = [
        '404', 'not found', 'page not found', 'error 404',
        'requested url was not found', 'this page does not exist',
        'sorry, we couldn’t find', 'file not found', 'oops!', 'cannot be found'
    ];

    function isPage404() {
        const text = document.body?.innerText?.toLowerCase() || '';
        const title = document.title?.toLowerCase() || '';
        const url = window.location.href.toLowerCase();

        return notFoundIndicators.some(k =>
            text.includes(k) || title.includes(k) || url.includes(k)
        );
    }

    function redirectToArchiveSnapshot(snapshotUrl) {
        console.log(`[404 to Archive Redirecter] Redirecting to snapshot: ${snapshotUrl}`);
        window.location.href = snapshotUrl;
    }

    function showNoSnapshotFound() {
        alert("🚫 This page appears to be missing, and no Internet Archive snapshot was found.");
        console.warn("[404 to Archive Redirecter] No archive snapshot available.");
    }

    function checkArchive() {
        fetch(`${archiveAPI}${encodeURIComponent(currentURL)}`)
            .then(res => res.json())
            .then(data => {
                if (data?.archived_snapshots?.closest?.url) {
                    redirectToArchiveSnapshot(data.archived_snapshots.closest.url);
                } else {
                    showNoSnapshotFound();
                }
            })
            .catch(err => {
                console.error("[404 to Archive Redirecter] Error querying archive:", err);
            });
    }

    // Wait until the page loads before checking
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (isPage404()) {
                console.log("[404 to Archive Redirecter] Page appears to be missing. Checking archive...");
                checkArchive();
            }
        }, 1000);
    });
})();
