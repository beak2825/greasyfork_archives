// ==UserScript==
// @name            AIease Unlock Download - Bypass Account
// @namespace       Violentmonkey Scripts
// @version         1.0.1
// @description     Override Download button functionality
// @author          sneffel
// @match           https://www.aiease.ai/app/apply-ai-filters
// @grant           GM_download
// @downloadURL https://update.greasyfork.org/scripts/518975/AIease%20Unlock%20Download%20-%20Bypass%20Account.user.js
// @updateURL https://update.greasyfork.org/scripts/518975/AIease%20Unlock%20Download%20-%20Bypass%20Account.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const handleDownloadButton = (button) => {
        const newButton = button.cloneNode(true);
        button.replaceWith(newButton);
        newButton.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            downloadImage();
        });
    };

    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            const downloadDiv = Array.from(document.querySelectorAll('div')).find(el => el.textContent.trim() === "Download");
            if (downloadDiv && !downloadDiv.dataset.handled) {
                downloadDiv.dataset.handled = 'true';
                handleDownloadButton(downloadDiv);
                observer.disconnect(); // Stop observing after handling the element
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function downloadImage() {
      console.log("downloadImage()")
      const img = document.querySelector('img[src^="https://pub-static.aiease.ai"]');
      if (img) {
        const url = new URL(img.src);
        const filename = url.pathname.split('/').pop();
        GM_download(img.src, filename);
      }
    }

})();