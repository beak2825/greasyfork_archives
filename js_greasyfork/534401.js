// ==UserScript==
// @name         Unibe ILIAS PDF Viewer Bypass (Intercept Links)
// @namespace    https://ilias.unibe.ch/
// @author       zinchaiku
// @version      1.4
// @description  Intercepts download links and opens PDFs in-browser
// @match        https://ilias.unibe.ch/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534401/Unibe%20ILIAS%20PDF%20Viewer%20Bypass%20%28Intercept%20Links%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534401/Unibe%20ILIAS%20PDF%20Viewer%20Bypass%20%28Intercept%20Links%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Adjust selector to match your download links
    document.querySelectorAll('a[href*="_download.html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            fetch(link.href, { credentials: 'include' })
                .then(res => {
                    const contentType = res.headers.get('Content-Type') || '';
                    if (contentType.includes('pdf')) {
                        return res.blob().then(blob => {
                            const blobUrl = URL.createObjectURL(blob);
                            window.open(blobUrl, '_blank');
                            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
                        });
                    } else {
                        // Not a PDF, fallback to normal navigation
                        window.location.href = link.href;
                    }
                });
        });
    });
})();
