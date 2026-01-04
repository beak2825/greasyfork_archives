// ==UserScript==
// @name         Thothub - Add Download Button
// @namespace    Thothub - Add Download Button
// @version      0.1
// @description  Add a download button to the video player
// @author       You
// @include      *thothub.*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/477937/Thothub%20-%20Add%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/477937/Thothub%20-%20Add%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        // Get the video source URL
        var videoSrc = document.querySelector('video').src; //alternatively .fp-engine
        if (!videoSrc) {
            console.error('Video source not found');
            return;
        }

        // Create the Download list item
        var downloadListItem = document.createElement('li');
        downloadListItem.innerHTML = `<a href="${videoSrc}" download>Download Video</a>`;

        // Find the Favourites button dropdown
        var favouritesDropdown = document.querySelector('.btn-favourites ul');
        if (!favouritesDropdown) {
            console.error('Favourites dropdown not found');
            return;
        }

        // Append the Download option to the dropdown
        favouritesDropdown.appendChild(downloadListItem);
    }, 4000);
})();