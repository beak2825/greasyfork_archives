// ==UserScript==
// @name         Patreon Attachment Downloader
// @namespace    https://github.com/dear-clouds/mio-userscripts
// @version      1.0
// @description  Download all Patreon post attachments as a ZIP file
// @author       Mio.
// @supportURL   https://github.com/dear-clouds/mio-userscripts/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=patreon.com
// @license      GPL-3.0
// @match        *://*.patreon.com/posts/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/513744/Patreon%20Attachment%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/513744/Patreon%20Attachment%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    window.addEventListener('load', function() {
        const attachmentContainer = document.querySelector('div[data-tag="post-attachments"]');
        if (attachmentContainer) {
            const downloadButton = document.createElement('button');
            downloadButton.innerText = 'Download All Attachments as ZIP';
            downloadButton.style.marginTop = '10px';
            downloadButton.style.padding = '10px';
            downloadButton.style.backgroundColor = 'var(--component-button-action-default)';
            downloadButton.style.color = 'var(--component-button-onAction-default)';
            downloadButton.style.border = 'none';
            downloadButton.style.borderRadius = 'var(--global-radius-md)';
            downloadButton.style.cursor = 'pointer';

            downloadButton.addEventListener('click', function() {
                downloadAttachmentsAsZip(downloadButton);
            });
            attachmentContainer.appendChild(downloadButton);
        }
    });

    function downloadAttachmentsAsZip(downloadButton) {
        const attachmentLinks = Array.from(document.querySelectorAll('a[data-tag="post-attachment-link"]'));
        if (attachmentLinks.length === 0) {
            alert('No attachments found on this page.');
            return;
        }

        // Disable the button and indicate loading
        downloadButton.disabled = true;
        downloadButton.style.cursor = 'not-allowed';
        downloadButton.innerText = 'Downloading...';

        const zip = new JSZip();
        let downloaded = 0;
        const postTitleElement = document.querySelector('span[data-tag="post-title"]');
        const postTitle = postTitleElement ? postTitleElement.innerText.trim().replace(/[^a-zA-Z0-9_\-\s]/g, '') : 'patreon_attachments';
        const zipFilename = `${postTitle}.zip`;

        attachmentLinks.forEach((link) => {
            const url = link.href;
            const filename = link.innerText.trim().replace(/[^a-zA-Z0-9_\-\.\s]/g, '') || `attachment_${downloaded + 1}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: function(response) {
                    zip.file(filename, response.response);
                    downloaded++;

                    if (downloaded === attachmentLinks.length) {
                        zip.generateAsync({ type: 'blob' }).then(function(content) {
                            saveAs(content, zipFilename);
                            // Re-enable the button and reset text
                            downloadButton.disabled = false;
                            downloadButton.style.cursor = 'pointer';
                            downloadButton.innerText = 'Download All Attachments as ZIP';
                        });
                    }
                },
                onerror: function() {
                    alert('Failed to download an attachment.');
                    // Re-enable the button and reset text if an error occurs
                    downloadButton.disabled = false;
                    downloadButton.style.cursor = 'pointer';
                    downloadButton.innerText = 'Download All Attachments as ZIP';
                }
            });
        });
    }
})();
