// ==UserScript==
// @name         Unibe ILIAS PDF Viewer Embedder
// @namespace    https://ilias.unibe.ch/
// @version      1.3
// @author       zinchaiku
// @description  Embeds PDFs directly in the page instead of downloading
// @match        https://ilias.unibe.ch/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534399/Unibe%20ILIAS%20PDF%20Viewer%20Embedder.user.js
// @updateURL https://update.greasyfork.org/scripts/534399/Unibe%20ILIAS%20PDF%20Viewer%20Embedder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Helper to create and insert the PDF viewer
    function showPDF(blobUrl) {
        // Remove any existing viewer
        let existing = document.getElementById('tampermonkey-pdf-viewer');
        if (existing) existing.remove();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'tampermonkey-pdf-viewer';
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.8)';
        overlay.style.zIndex = 99999;
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = blobUrl;
        iframe.style.width = '80vw';
        iframe.style.height = '90vh';
        iframe.style.border = 'none';
        iframe.style.background = '#fff';
        overlay.appendChild(iframe);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close PDF';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '40px';
        closeBtn.style.zIndex = 100000;
        closeBtn.style.padding = '2px 6px';
        closeBtn.style.fontSize = '1.2em';
        closeBtn.onclick = () => {
            overlay.remove();
            URL.revokeObjectURL(blobUrl);
        };
        overlay.appendChild(closeBtn);

        document.body.appendChild(overlay);
    }

    // Attach to all download links (adjust selector as needed)
    function attachPDFInterceptors() {
        document.querySelectorAll('a[href*="_download.html"]').forEach(link => {
            // Avoid double-binding
            if (link.dataset.tmPdfBound) return;
            link.dataset.tmPdfBound = "1";

            link.addEventListener('click', function(e) {
                e.preventDefault();
                fetch(link.href, { credentials: 'include' })
                    .then(res => {
                        const contentType = res.headers.get('Content-Type') || '';
                        if (contentType.includes('pdf')) {
                            return res.blob().then(blob => {
                                const blobUrl = URL.createObjectURL(blob);
                                showPDF(blobUrl);
                            });
                        } else {
                            // Not a PDF, fallback to normal navigation
                            window.location.href = link.href;
                        }
                    })
                    .catch(err => {
                        alert("Could not open PDF: " + err);
                        window.location.href = link.href;
                    });
            });
        });
    }
    window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const viewer = document.getElementById('tampermonkey-pdf-viewer');
        if (viewer) viewer.remove();
    }
});

    // Run on page load and after AJAX navigation (if any)
    attachPDFInterceptors();
    // Optional: observe DOM changes for dynamically loaded links
    const observer = new MutationObserver(attachPDFInterceptors);
    observer.observe(document.body, { childList: true, subtree: true });
})();
