// ==UserScript==
// @name         LPSG Video Unlocker
// @namespace    MBing & CurlyWurly
// @version      3.8
// @description  Automatically unlocks and enhances your LPSG browsing experience
// @author       MBing & CurlyWurly
// @match        https://www.lpsg.com/*
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pjxzdmcgdmlld0JveD0iMCAwIDI1NiAyNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgZmlsbD0ibm9uZSIgaGVpZ2h0PSIyNTYiIHdpZHRoPSIyNTYiLz48cGF0aCBkPSJNOTMuMiwxMjIuOEE3MC4zLDcwLjMsMCwwLDEsODgsOTZhNzIsNzIsMCwxLDEsNzIsNzIsNzAuMyw3MC4zLDAsMCwxLTI2LjgtNS4yaDBMMTIwLDE3Nkg5NnYyNEg3MnYyNEgzMlYxODRsNjEuMi02MS4yWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZENzAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMTYiLz48Y2lyY2xlIGN4PSIxODAiIGN5PSI3NiIgcj0iMTIiIGZpbGw9IiNGRkQ3MDAiLz48L3N2Zz4=
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519756/LPSG%20Video%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/519756/LPSG%20Video%20Unlocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const volume = 0.1;
    const formats = ['mp4', 'm4v', 'mov'];

    var easterEggPoster = document.getElementsByClassName("video-easter-egg-poster");
    var videoDiv = [];
    var imageUrl;
    var newDiv;

    // Create video elements with all format sources
    for (var i = easterEggPoster.length - 1; i > -1; i--) {
        imageUrl = easterEggPoster[i].children[0].src;
        let sourceElements = formats.map(format => {
            let videoUrl = imageUrl.replace("attachments/posters", "video")
                .replace("/lsvideo/thumbnails", "lsvideo/videos")
                .replace(".jpg", `.${format}`);

            // Set correct MIME type for each format
            let mimeType;
            switch (format) {
                case 'mp4':
                    mimeType = 'video/mp4';
                    break;
                case 'm4v':
                    mimeType = 'video/x-m4v';
                    break;
                case 'mov':
                    mimeType = 'video/quicktime';
                    break;
            }

            return `<source data-src="${videoUrl}" src="${videoUrl}" type="${mimeType}">`;
        }).join('');

        videoDiv[i] = `<video onloadstart="this.volume=${volume}" 
            style="width: 100%; height: auto; display: block;" 
            playsinline
            controls="" 
            data-xf-init="video-init" 
            data-poster="${imageUrl}" 
            class="message-cell--main-video" 
            poster="${imageUrl}">
            ${sourceElements}
            <div class="bbMediaWrapper-fallback">Your browser is not able to display this video.</div>
        </video>`;

        newDiv = document.createElement("div");
        newDiv.setAttribute("class", "newVideoDiv");
        newDiv.innerHTML = videoDiv[i];
        easterEggPoster[i].parentElement.parentElement.append(newDiv);
    }

    // Remove original elements
    for (i = easterEggPoster.length - 1; i > -1; i--) {
        easterEggPoster[i].parentElement.parentElement.removeChild(easterEggPoster[i].parentElement);
    }

    // Remove blockers and overlays
    ['video-easter-egg-blocker', 'video-easter-egg-overlay'].forEach(className => {
        var elements = document.getElementsByClassName(className);
        for (var j = elements.length - 1; j > -1; j--) {
            elements[j].parentElement.removeChild(elements[j]);
        }
    });

    // Set volume for all video players
    var allVideoPlayers = document.getElementsByTagName('video');
    for (i = allVideoPlayers.length - 1; i > -1; i--) {
        allVideoPlayers[i].volume = volume;
    }

    // Enhanced image loading
    function unlockAllImages() {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.loading = 'eager';
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }

    // Add this function to create the media gallery button and functionality
    function createMediaButton() {
        // Create button
        const mediaBtn = document.createElement("a");
        mediaBtn.innerHTML = '<span class="button-text"><i class="fa--xf fas fa-images" aria-hidden="true"></i><span class="u-srOnly">Media</span></span>';
        mediaBtn.className = "button--scroll ripple-JsOnly button";
        mediaBtn.style.cssText = "margin: 2px;";

        mediaBtn.addEventListener('click', () => {
            // Create gallery container
            const gallery = document.createElement("div");
            gallery.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.9);
            z-index: 9999;
            overflow-y: auto;
            padding: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        `;

            // Collect all media in order of appearance
            // Collect all media in order of appearance
            const media = [...document.querySelectorAll('.message-cell--main img, .message-cell--main video')]
                .filter(element => {
                    // Only include images with '/attachments/' in URL and all videos
                    return element.tagName.toLowerCase() === 'video' ||
                        (element.tagName.toLowerCase() === 'img' && element.src.includes('/attachments/'));
                });

            // Add media to gallery in original order
            media.forEach(element => {
                const clone = element.cloneNode(true);
                clone.style.width = '100%';
                clone.style.height = 'auto';
                clone.style.maxHeight = '500px';
                clone.style.objectFit = 'contain';

                // If it's an image, wrap it in a clickable link to the full version
                if (element.tagName.toLowerCase() === 'img') {
                    // Find the parent anchor tag that contains the full image URL
                    const parentAnchor = element.closest('a[href*="/attachments/"]');
                    if (parentAnchor) {
                        const wrapper = document.createElement('a');
                        wrapper.href = parentAnchor.href;
                        wrapper.target = '_blank';
                        wrapper.style.cursor = 'pointer';
                        wrapper.appendChild(clone);
                        gallery.appendChild(wrapper);
                    } else {
                        gallery.appendChild(clone);
                    }
                } else {
                    gallery.appendChild(clone);
                }
            });



            // Add close button
            const closeBtn = document.createElement("button");
            closeBtn.innerHTML = "✖️";
            closeBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px;
            background: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10000;
        `;
            closeBtn.onclick = () => document.body.removeChild(gallery);

            gallery.appendChild(closeBtn);
            document.body.appendChild(gallery);
        });

        // Add button to scroll buttons container
        const scrollButtons = document.querySelector('.u-scrollButtons');
        if (scrollButtons) {
            scrollButtons.appendChild(mediaBtn);
        }
    }

    // Run image loading immediately and after a delay to catch dynamic content
    unlockAllImages();
    setTimeout(unlockAllImages, 1000);
    createMediaButton();
})();
