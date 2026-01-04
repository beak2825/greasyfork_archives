// ==UserScript==
// @name         Newgrounds Audio Download Fix
// @namespace    https://greasyfork.org/users/246635
// @version      1.1
// @description  Adds a direct download button to audio pages on Newgrounds for songs that won't allow it.
// @author       _darkuwu
// @match        https://www.newgrounds.com/audio/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514415/Newgrounds%20Audio%20Download%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/514415/Newgrounds%20Audio%20Download%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', main);

    function main() {
        // Check if the download button already exists
        if (document.querySelector('.icon-download')) return;

        // Get the pod-head div to place the new button
        const podHead = document.querySelector('.pod-head');
        if (!podHead) return;

        // Find the share button to place our new button next to it
        const shareButton = podHead.querySelector('.icon-share');
        if (!shareButton) return;


        const downloadButton = document.createElement('span');
        downloadButton.innerHTML = `
            <a class="icon-download" href="#" title="Download this song" rel="nofollow">
                Download this song
            </a>
        `;

        // Insert the download button next to the share button
        shareButton.insertAdjacentElement('afterend', downloadButton);

        // Find the audio URL from the meta tag
        const audioMeta = document.querySelector('meta[property="og:audio"]');
        if (!audioMeta) return;

        let audioUrl = audioMeta.getAttribute('content').split('?')[0]; // Trim to ".mp3"

        // Get the song ID from the filename
        const filename = audioUrl.split('/').pop().match(/^(\d+)_/)?.[1] || 'unknown';


        const anchor = downloadButton.querySelector('.icon-download');
        anchor.href = audioUrl;
        anchor.setAttribute('download', `${filename}.mp3`);


        anchor.addEventListener('click', function(event) {
            event.preventDefault();

            // Force download using a temporary <a> element
            const tempLink = document.createElement('a');
            tempLink.href = audioUrl;
            tempLink.download = `${filename}.mp3`;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
        });
    }
})();