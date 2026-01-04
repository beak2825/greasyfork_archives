// ==UserScript==
// @name         Google Maps Images Downloader
// @namespace    http://tampermonkey.net/
// @version      2025-06-20
// @description  Click three-dots-button on an image -> Report -> Dowload
// @author       Roddy
// @match        https://www.google.com/local/imagery/report/*
// @icon         https://www.google.com/images/branding/product/ico/maps15_bnuw3a_32dp.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540257/Google%20Maps%20Images%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/540257/Google%20Maps%20Images%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceAfterLastToken(str, token, new_suffix) {
        const index = str.lastIndexOf(token);
        if (index === -1) {
            // Token not found, return original string
            return str;
        } else {
            return str.substring(0, index + token.length) + new_suffix;
        }
    }

    function getImageFilename() {
        const parsedUrl = new URL(window.location.href);
        const params = parsedUrl.searchParams;

        // fid stands for "feature id", "feature" being something on the map.
        const fid = params.get('fid');
        // id of the image..
        const imageKey = params.get('image_key');

        return 'gm-' + fid + '_' + imageKey + '.jpg';
    }

    async function onLoad() {
        let img = document.getElementById('preview-image');

        // Compute the full-size image URL.
        // Replaces for example the "=w400-h180-k-no" suffix with "=w0":
        // Thanks to theavideverything:
        // https://www.reddit.com/r/GoogleMaps/comments/1flinml/comment/mh5yj5k/
        const imageUrl = replaceAfterLastToken(img.src, "=w", "0");

        console.log('displayed image:', img.src);
        console.log('full image:     ', imageUrl);

        // Download the image as a blob, to be able to save it under a custom name.
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const imageBlob = await response.blob();

        // Create div for placing the Download link.
        let div = document.createElement("div");
        div.style = 'text-align: right; padding-top: 2rem; padding-bottom: 2rem; font-size: 2rem;';

        // Place the div after (below) the image.
        img.parentNode.insertBefore(div, img.nextSibling);

        // Add a Download link.
        let link = document.createElement("a");
        link.innerText = "💾 Download";
        link.href = URL.createObjectURL(imageBlob);
        link.download = getImageFilename();
        div.appendChild(link);
    }
    window.addEventListener('load', onLoad);
})();