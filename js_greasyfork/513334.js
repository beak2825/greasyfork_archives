// ==UserScript==
// @name         Auto-close Y2Mate + useless button remover
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Instantly remove Advanced Download button and handle downloads on y2mate.com
// @match        https://www.y2mate.com/*
// @license      MIT
// @grant        window.close
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/513334/Auto-close%20Y2Mate%20%2B%20useless%20button%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/513334/Auto-close%20Y2Mate%20%2B%20useless%20button%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set this to true for direct download, false for redirect
    const useDirectDownload = true;
        // Set this to true to allow the window to close after download, false to keep it open
    const allowWindowClose = true;

    function handleDirectDownload(url) {
        const filename = url.split('/').pop().split('?')[0] || 'download';

        GM_download({
            url: url,
            name: filename,
            onload: function() {
                console.log('Download started successfully');
                if (allowWindowClose) {
                window.close();
               }
            },
            onerror: function(error) {
                console.error('Download failed:', error);
                alert('Download failed. Please try again.');
            }
        });
    }

    function handleRedirect(url) {
        window.open(url, '_blank');
        if (allowWindowClose) {
        window.close();
        }
    }

    function removeAdvancedDownloadButton() {
        const advancedDownloadButton = document.querySelector('a.btn.btn-success[href^="https://www.vidcombo.com/download/install/"]');
        if (advancedDownloadButton) {
            const parentTd = advancedDownloadButton.closest('td');
            if (parentTd) {
                parentTd.remove();
            } else {
                advancedDownloadButton.remove();
            }
            console.log('Advanced Download button removed');
        }
    }
    function removeRowsWithoutButtons() {
    const rows = document.querySelectorAll('table.table.table-bordered tbody tr');
    rows.forEach(row => {
        const downloadButton = row.querySelector('button.btn.btn-success');
        if (!downloadButton) {
            row.remove();
        }
    });
}

    function handleDownloadButton(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            const downloadUrl = this.href;
            if (useDirectDownload) {
                handleDirectDownload(downloadUrl);
            } else {
                handleRedirect(downloadUrl);
            }
        });
    }

    function observeDOMChanges() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    removeAdvancedDownloadButton();
                    removeRowsWithoutButtons();

                    const downloadButtons = document.querySelectorAll('a.btn.btn-success.btn-file[target="_blank"][rel="nofollow"][type="button"]:not(.processed)');
                    downloadButtons.forEach(button => {
                        handleDownloadButton(button);
                        button.classList.add('processed');
                    });
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // Initial check and setup
    removeAdvancedDownloadButton();
    const initialButtons = document.querySelectorAll('a.btn.btn-success.btn-file[target="_blank"][rel="nofollow"][type="button"]');
    initialButtons.forEach(handleDownloadButton);
    removeRowsWithoutButtons();

    // Start observing the DOM for changes
    observeDOMChanges();
})();