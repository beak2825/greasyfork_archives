// ==UserScript==
// @name         YouTube Download Button
// @namespace    icycoldveins
// @version      0.4
// @description  Adds a download button to YouTube videos
// @author       icycoldveins
// @match        https://www.youtube.com/watch?v=*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476858/YouTube%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/476858/YouTube%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDownloadButton() {
        if (document.getElementById('downloadBtn')) return; // If button already exists, exit the function

        let downloadLink = document.createElement('a');
        downloadLink.setAttribute('id', 'downloadBtn');
        downloadLink.setAttribute('href', `https://www.y2mate.com/youtube/${window.location.search.split('v=')[1]}`);
        downloadLink.setAttribute('target', '_blank');
        downloadLink.innerText = 'Download Video';
        downloadLink.style.display = 'block';
        downloadLink.style.marginTop = '10px';
        downloadLink.style.background = '#ff0000';
        downloadLink.style.color = '#ffffff';
        downloadLink.style.padding = '5px 10px';
        downloadLink.style.textAlign = 'center';
        downloadLink.style.borderRadius = '2px';
        downloadLink.style.textDecoration = 'none';

        let parentDiv = document.querySelector('ytd-subscribe-button-renderer');
        if (parentDiv) {
            parentDiv.parentElement.insertBefore(downloadLink, parentDiv.nextSibling);
        }
    }

    // Since YouTube is a single-page application and it dynamically loads content,
    // we use a MutationObserver to listen for changes and add the download button when necessary.
    const targetNode = document.getElementById('content');
    const config = { attributes: true, childList: true, subtree: true };

    const callback = function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                addDownloadButton();
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    // Add the download button initially
    addDownloadButton();

})();
