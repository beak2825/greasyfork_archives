// ==UserScript==
// @name         SteamWallpaperDeblur
// @namespace    http://tampermonkey.net/
// @version      0.51
// @description  移除Wallpaper Engine创意工坊中R18壁纸的缩略图模糊效果。(Removes blur effect from adult content images in Steam Wallpaper Engine workshop)
// @author       fly9593
// @match        https://steamcommunity.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474291/SteamWallpaperDeblur.user.js
// @updateURL https://update.greasyfork.org/scripts/474291/SteamWallpaperDeblur.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove blur effect from images
    function removeBlur() {
        var blurredImages = document.querySelectorAll('.ugc.has_adult_content img, .ugc.has_adult_content div.imgWallItem');
        blurredImages.forEach(function(image) {
            image.style.filter = 'none';
        });
    }

    // Call the removeBlur function initially
    removeBlur();

    // Use MutationObserver to watch for changes in the DOM
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // If new content is added, call removeBlur function
                removeBlur();
            }
        });
    });

    // Configure and start the observer
    var observerConfig = { childList: true, subtree: true };
    observer.observe(document.body, observerConfig);
})();
