// ==UserScript==
// @name         bustimes.org - Reg Plate Hover Preview
// @version      2
// @namespace    https://bustimes.org/
// @description  Show Bing image preview for reg plate in Flickr search link.
// @match        https://bustimes.org/*
// @match        https://transportthing.uk/*
// @grant        GM_xmlhttpRequest
// @connect      bing.com
// @downloadURL https://update.greasyfork.org/scripts/539759/bustimesorg%20-%20Reg%20Plate%20Hover%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/539759/bustimesorg%20-%20Reg%20Plate%20Hover%20Preview.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .reg-hover-preview {
            position: absolute;
            border: 2px solid #333;
            background: #fff;
            z-index: 9999;
            width: 300px;
            height: 200px;
            display: none;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .reg-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #333;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    function createPopup() {
        const popup = document.createElement('div');
        popup.className = 'reg-hover-preview';

        const spinner = document.createElement('div');
        spinner.className = 'reg-spinner';

        const img = document.createElement('img');
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.display = 'none';

        popup.appendChild(spinner);
        popup.appendChild(img);
        document.body.appendChild(popup);

        return { popup, spinner, img };
    }

    function getPlateFromURL(url) {
        const match = decodeURIComponent(url).match(/text=([A-Z0-9]+)(?:[+% ]|$)/i);
        return match ? match[1] : null;
    }

    function fetchImageFromBing(plate, callback) {
    const url = window.location.href;
    let operator = "";

    // Use regex to extract the operator slug from the URL path
    const match = url.match(/\/operators\/([^\/]+)/);
    if (match && match[1]) {
        operator = match[1];  
    }

    const query = `${plate} ${operator}`;
    const searchURL = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;

    GM_xmlhttpRequest({
        method: "GET",
        url: searchURL,
        onload(res) {
            const doc = new DOMParser().parseFromString(res.responseText, "text/html");
            const img = doc.querySelector('img.mimg');
            callback(img?.src || null);
        }
    });
  }

    document.addEventListener('mouseover', function (e) {
        const link = e.target.closest('a[href*="flickr.com/search/?text="]');
        if (!link || link._hasHoverListener) return;

        link._hasHoverListener = true;

        link.addEventListener('mouseenter', (ev) => {
            const plate = getPlateFromURL(link.href);
            if (!plate) return;

            const { popup, spinner, img } = createPopup();

            popup.style.left = `${ev.pageX + 15}px`;
            popup.style.top = `${ev.pageY + 15}px`;
            popup.style.display = 'flex';
            spinner.style.display = 'block';
            img.style.display = 'none';
            img.src = '';

            fetchImageFromBing(plate, (imgSrc) => {
                if (imgSrc) {
                    img.onload = () => {
                        spinner.style.display = 'none';
                        img.style.display = 'block';
                    };
                    img.onerror = () => {
                        spinner.style.display = 'none';
                        popup.textContent = 'Image failed to load.';
                    };
                    img.src = imgSrc;
                } else {
                    spinner.style.display = 'none';
                    popup.textContent = 'No image found.';
                }
            });

            const moveHandler = (ev) => {
                popup.style.left = `${ev.pageX + 15}px`;
                popup.style.top = `${ev.pageY + 15}px`;
            };

            const leaveHandler = () => {
                popup.remove();
                link.removeEventListener('mousemove', moveHandler);
                link.removeEventListener('mouseleave', leaveHandler);
            };

            link.addEventListener('mousemove', moveHandler);
            link.addEventListener('mouseleave', leaveHandler);
        });
    });
})();
