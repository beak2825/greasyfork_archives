// ==UserScript==
// @name         Add YouTube Thumbnail to Video Description
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds the video's thumbnail to the description of the video that you are currently watching.
// @author       Kyle Nakamura
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459456/Add%20YouTube%20Thumbnail%20to%20Video%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/459456/Add%20YouTube%20Thumbnail%20to%20Video%20Description.meta.js
// ==/UserScript==


function awaitElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


// On document load...
(function() {
    'use strict';

    // Wait for description container div to load
    awaitElement('div #description').then((descriptionContainer) => {
        // Wait for description contents to load
        awaitElement('div #description-inner').then(_ => {
            const thumbnailPreview = document.createElement('img'),
                  videoID = new URLSearchParams(window.location.search).get('v'),
                  imgSD = `https://img.youtube.com/vi/${videoID}/sddefault.jpg`,
                  imgHD = `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;

            descriptionContainer.style.display = 'flex';
            descriptionContainer.style.flexDirection = 'row';
            descriptionContainer.style.justifyContent = 'space-between';

            thumbnailPreview.src = imgSD;
            thumbnailPreview.style.height = '100px';
            thumbnailPreview.style.cursor = 'pointer';
            thumbnailPreview.onclick = _ => {
                window.open(imgHD, '_blank');
            };

            descriptionContainer.append(thumbnailPreview);
        });
    });
})();