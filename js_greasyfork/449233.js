// ==UserScript==
// @name         Youtube Thumbnail Search
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Search youtube thumbnail image using google image
// @author       Tanuki
// @match       *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @namespace   https://greasyfork.org/id/scripts/449233-youtube-thumbnail-search
// @homepage    https://greasyfork.org/id/scripts/449233-youtube-thumbnail-search
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/449233/Youtube%20Thumbnail%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/449233/Youtube%20Thumbnail%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Embed Google Fonts stylesheet for Material Icons
    let link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Icons';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    window.addEventListener("scroll",function(){
        // Select all ytd-thumbnail elements
        let thumbnails = document.querySelectorAll('ytd-thumbnail');

        // Iterate over each thumbnail element
        thumbnails.forEach(thumbnail => {
            // Find the img element within the thumbnail element
            let imgElement = thumbnail.querySelector('img');
            // Get the src attribute of the img element
            if (imgElement) {
                var imgSrc = imgElement.src;
                let thumbnailImg = imgElement.querySelector('yt-image');
                if (thumbnailImg){
                    imgSrc = thumbnailImg.querySelector('img').src;
                }
                if (!imgSrc && thumbnail.nextElementSibling && thumbnail.nextElementSibling.tagName === 'YTD-PLAYLIST-THUMBNAIL') {
                    let playlist = thumbnail.nextElementSibling.querySelector('ytd-playlist-video-thumbnail-renderer');
                    if (playlist) {
                        let thumbnailPlaylist = playlist.querySelector('yt-image');
                        if (thumbnailPlaylist){
                            imgSrc = thumbnailPlaylist.querySelector('img').src;
                        }
                    }
                }
                // Remove any parameters from the image source
                //imgSrc = imgSrc.split('?')[0];
                // Check if the URL contains "oar" in the filename
                if (!imgSrc.includes('/oar')) {
                    // Replace the filename with "maxresdefault.jpg"
                    imgSrc = imgSrc.replace(/\/[^\/]+\.jpg/, '/maxresdefault.jpg');
                }

                // Check if the TanTools div exists
                let tanToolsDiv = thumbnail.parentNode.parentNode.querySelector('.tan-tools');
                // Remove existing tanToolsDiv if it exists
                if (tanToolsDiv) {
                    tanToolsDiv.remove();
                }
                // Create a new div element for TanTools with buttons
                tanToolsDiv = document.createElement('div');
                tanToolsDiv.className = 'tan-tools'; // Add a class name to the div
                tanToolsDiv.dataset.layer = '6'; // Add data-layer attribute
                tanToolsDiv.style.cssText = 'position: absolute; left: 0; top: 0; z-index: 5; width: 100%; height:10%;'; // Combine style properties

                // Create a new button element for 'Search Img' with a search icon
                let searchButton = document.createElement('button');
                searchButton.style.cssText = 'background: none; border: none; cursor: pointer;'; // Transparent button
                searchButton.addEventListener('click', function() {
                    window.open('https://lens.google.com/uploadbyurl?url=' + encodeURIComponent(imgSrc), '_blank');
                });
                let searchIcon = document.createElement('i');
                searchIcon.className = 'material-icons';
                searchIcon.style.color = 'white'; // Set the icon color
                searchIcon.textContent = 'search'; // Set the icon text
                searchButton.appendChild(searchIcon);
                tanToolsDiv.appendChild(searchButton);

                // Create a new button element for 'View Image' with a view icon
                let viewButton = document.createElement('button');
                viewButton.style.cssText = 'background: none; border: none; cursor: pointer;'; // Transparent button
                viewButton.addEventListener('click', function() {
                    window.open(imgSrc, '_blank');
                });
                let viewIcon = document.createElement('i');
                viewIcon.className = 'material-icons';
                viewIcon.style.color = 'white'; // Set the icon color
                viewIcon.textContent = 'visibility'; // Set the icon text
                viewButton.appendChild(viewIcon);
                tanToolsDiv.appendChild(viewButton);

                // Append the TanTools div to the parent element
                thumbnail.parentNode.parentNode.appendChild(tanToolsDiv);
            }
        });


    })

})();