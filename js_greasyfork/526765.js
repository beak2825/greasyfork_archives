// ==UserScript==
// @name         Image Info
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Display image dimensions and size
// @author       Ram (https://www.soren.in)
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526765/Image%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/526765/Image%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getImageInfo(img) {
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        let size = null;

        fetch(img.src, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    size = response.headers.get('content-length');
                    if (size) {
                        size = formatBytes(parseInt(size, 10));
                        displayInfo(img, width, height, size);
                    } else {
                        displayInfo(img, width, height, "Size Unavailable");
                    }
                } else {
                    displayInfo(img, width, height, "Size Unavailable");
                }
            })
            .catch(error => {
                console.error("Error fetching image size:", error);
                displayInfo(img, width, height, "Size Unavailable");
            });
    }

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return "0 Bytes";

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    function displayInfo(img, width, height, size) {
        let infoDiv = document.createElement('div');
        infoDiv.style.cssText = `
            position: absolute;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px;
            font-size: 12px;
            z-index: 9999;
            pointer-events: none;
            white-space: nowrap;
        `;

        infoDiv.innerHTML = `
            ${width} x ${height}<br>
            ${size}<br>
        `;

        infoDiv.style.top = img.offsetTop + "px";
        infoDiv.style.left = img.offsetLeft + "px";

        img.parentNode.insertBefore(infoDiv, img.nextSibling);

        img.addEventListener('load', function() {
            infoDiv.style.top = img.offsetTop + "px";
            infoDiv.style.left = img.offsetLeft + "px";
        });

        img.addEventListener('error', function() {
            infoDiv.remove();
        });
    }

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            getImageInfo(img);
        } else {
            img.addEventListener('load', () => getImageInfo(img));
        }
    });

})();