// ==UserScript==
// @name         PDF Viewer Embedder
// @namespace    *
// @version      1.7
// @author       zinchaiku
// @description  Embeds PDFs directly in the page instead of downloading, with fallback and cleanup
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534406/PDF%20Viewer%20Embedder.user.js
// @updateURL https://update.greasyfork.org/scripts/534406/PDF%20Viewer%20Embedder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentBlobUrl = null;

    function showPDF(srcUrl, isBlob = false) {
        const existing = document.getElementById('tampermonkey-pdf-viewer');
        if (existing) existing.remove();

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

        const iframe = document.createElement('iframe');
        iframe.src = srcUrl;
        iframe.style.width = '80vw';
        iframe.style.height = '90vh';
        iframe.style.border = 'none';
        iframe.style.background = '#fff';
        overlay.appendChild(iframe);

        // Fallback if iframe fails to load (e.g. X-Frame-Options)
        iframe.onerror = () => {
            overlay.remove();
            if (isBlob && currentBlobUrl) {
                URL.revokeObjectURL(currentBlobUrl);
                currentBlobUrl = null;
            }
            window.open(srcUrl, '_blank');
        };

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close PDF';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '200px';
        closeBtn.style.zIndex = 100000;
        closeBtn.style.padding = '2px 6px';
        closeBtn.style.fontSize = '1.2em';
        closeBtn.onclick = () => {
            overlay.remove();
            if (isBlob && currentBlobUrl) {
                URL.revokeObjectURL(currentBlobUrl);
                currentBlobUrl = null;
            }
        };
        overlay.appendChild(closeBtn);

        // "Open in New Tab" button
        const newTabBtn = document.createElement('button');
        newTabBtn.textContent = 'Open in New Tab';
        newTabBtn.style.position = 'absolute';
        newTabBtn.style.top = '20px';
        newTabBtn.style.right = '40px';
        newTabBtn.style.zIndex = 100000;
        newTabBtn.style.padding = '2px 6px';
        newTabBtn.style.fontSize = '1.2em';
        newTabBtn.onclick = () => {
            window.open(srcUrl, '_blank');
        };
        overlay.appendChild(newTabBtn);

        document.body.appendChild(overlay);

        // Track for cleanup
        if (isBlob) {
            currentBlobUrl = srcUrl;
        } else {
            currentBlobUrl = null;
        }
    }

    function isPDFLink(href) {
        try {
            const url = new URL(href, window.location.href);
            return url.pathname.toLowerCase().endsWith('.pdf');
        } catch {
            return false;
        }
    }

    function attachPDFInterceptors() {
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || link.dataset.tmPdfBound) return;

            const isWrapper = href.includes('_download.html');
            const isDirectPDF = isPDFLink(href);

            if (isWrapper || isDirectPDF) {
                link.dataset.tmPdfBound = "1";

                link.addEventListener('click', function (e) {
                    e.preventDefault();

                    if (isDirectPDF) {
                        showPDF(link.href);
                    } else {
                        fetch(link.href, { credentials: 'include' })
                            .then(res => {
                                const contentType = res.headers.get('Content-Type') || '';
                                if (contentType.includes('pdf')) {
                                    return res.blob().then(blob => {
                                        const blobUrl = URL.createObjectURL(blob);
                                        showPDF(blobUrl, true);
                                    });
                                } else {
                                    window.location.href = link.href;
                                }
                            })
                            .catch(err => {
                                alert("Could not open PDF: " + err);
                                window.location.href = link.href;
                            });
                    }
                });
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const viewer = document.getElementById('tampermonkey-pdf-viewer');
            if (viewer) {
                viewer.remove();
                if (currentBlobUrl) {
                    URL.revokeObjectURL(currentBlobUrl);
                    currentBlobUrl = null;
                }
            }
        }
    });

    attachPDFInterceptors();
    const observer = new MutationObserver(attachPDFInterceptors);
    observer.observe(document.body, { childList: true, subtree: true });
})();
