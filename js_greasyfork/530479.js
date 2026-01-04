// ==UserScript==
// @name         Nookies Gallery Auto Loader (Full Width Responsive Grid - 4 per row, Full Vertical Images)
// @namespace    http://tampermonkey.net/
// @version      0.27
// @description  Load gallery images on nookies.com by replacing thumbnail URLs with full‑size ones and displaying them in a full‑width responsive grid (4 per row). Vertical images won’t be cropped.
// @match        https://www.nookies.com/membersarea/gallery/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/530479/Nookies%20Gallery%20Auto%20Loader%20%28Full%20Width%20Responsive%20Grid%20-%204%20per%20row%2C%20Full%20Vertical%20Images%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530479/Nookies%20Gallery%20Auto%20Loader%20%28Full%20Width%20Responsive%20Grid%20-%204%20per%20row%2C%20Full%20Vertical%20Images%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject custom CSS to override container width and create a responsive flex grid.
    const style = document.createElement('style');
    style.innerHTML = `
        /* Use full width for the page content container */
        .page-content .container {
            max-width: 100% !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
        }
        /* Responsive flex grid for the gallery: 4 images per row */
        .flexy-gallery {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 10px !important;
          justify-content: center;
          padding: 10px;
        }
        /* Each gallery item takes roughly 25% of the width (minus gap adjustments) */
        .flexy-gallery .gallery-item {
          flex: 1 1 calc(25% - 20px) !important;
          max-width: calc(25% - 20px) !important;
          box-sizing: border-box;
        }
        /* Ensure images fill their container and display fully (no cropping for vertical images) */
        .flexy-gallery .gallery-item img {
          width: 100% !important;
          height: auto !important;
          max-height: none !important;
          object-fit: contain !important;
          display: block !important;
        }
        /* Fixed load button styling */
        #nookiesLoadButton {
          position: fixed !important;
          top: 10px !important;
          right: 10px !important;
          z-index: 100000 !important;
          padding: 10px !important;
          background-color: #007bff !important;
          color: #fff !important;
          border: none !important;
          border-radius: 5px !important;
          cursor: pointer !important;
        }
    `;
    document.head.appendChild(style);

    // When the page loads, update the initial images and add the load button.
    if (document.readyState === 'complete') {
        addLoadButton();
        updateInitialImages();
    } else {
        window.addEventListener('load', () => {
            addLoadButton();
            updateInitialImages();
        });
    }

    function logDebug(msg) {
        console.log("[NookiesGalleryAutoLoader] " + msg);
    }

    // Update a gallery item's image: remove restrictions and swap thumbnail URL for the full‑size image.
    function updateGalleryImage(item) {
        const img = item.querySelector('img');
        if (img) {
            img.classList.remove('img-fluid');
            img.removeAttribute('width');
            img.removeAttribute('height');
            img.removeAttribute('srcset');
            if (img.src.includes('/thumbs/')) {
                const oldSrc = img.src;
                img.src = img.src.replace('/thumbs/', '/');
                logDebug("Replaced image URL: from " + oldSrc + " to " + img.src);
            }
            // Force image styles to fill the container.
            img.style.width = "100%";
            img.style.height = "auto";
        }
    }

    // Update all gallery items already on the first page.
    function updateInitialImages() {
        const items = document.querySelectorAll('.flexy-gallery .gallery-item');
        items.forEach(updateGalleryImage);
    }

    // Determine the total number of pages from pagination.
    function getTotalPages() {
        let maxPage = 1;
        const pages = document.querySelectorAll('ul.pagination li.page-item');
        pages.forEach(li => {
            const num = parseInt(li.textContent.trim(), 10);
            if (!isNaN(num) && num > maxPage) {
                maxPage = num;
            }
        });
        logDebug("Total pages: " + maxPage);
        return maxPage;
    }

    // Fetch the HTML content of a gallery page.
    async function fetchGalleryPage(url) {
        try {
            logDebug("Fetching gallery page: " + url);
            const res = await fetch(url, { credentials: 'same-origin' });
            if (!res.ok) {
                logDebug("Error fetching " + url + ": " + res.status);
                return null;
            }
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const container = doc.querySelector('.flexy-gallery');
            if (!container) {
                logDebug("No gallery container found on " + url);
                return null;
            }
            return container.innerHTML;
        } catch (e) {
            logDebug("Fetch error: " + e);
            return null;
        }
    }

    // Load additional gallery pages.
    async function loadAllGalleryPages() {
        const totalPages = getTotalPages();
        if (totalPages <= 1) {
            logDebug("Only one page available.");
            return;
        }
        const gallery = document.querySelector('.flexy-gallery');
        if (!gallery) {
            logDebug("No gallery container found.");
            return;
        }
        const loader = document.createElement('div');
        loader.style.textAlign = "center";
        loader.style.padding = "10px";
        loader.textContent = "Loading all images...";
        gallery.parentNode.insertBefore(loader, gallery.nextSibling);

        const baseUrl = window.location.href.split('?')[0];
        for (let page = 2; page <= totalPages; page++) {
            const pageUrl = `${baseUrl}?page=${page}`;
            const content = await fetchGalleryPage(pageUrl);
            if (content) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                const items = tempDiv.querySelectorAll('.gallery-item');
                items.forEach(item => {
                    updateGalleryImage(item);
                    gallery.appendChild(item);
                });
                logDebug("Appended " + items.length + " items from page " + page);
            }
        }
        loader.textContent = "All images loaded.";
        document.querySelectorAll('ul.pagination').forEach(el => el.remove());
    }

    // Add a floating load button.
    function addLoadButton() {
        const oldBtn = document.getElementById('nookiesLoadButton');
        if (oldBtn) {
            oldBtn.remove();
        }
        const btn = document.createElement('button');
        btn.id = 'nookiesLoadButton';
        btn.textContent = 'Load All Images';
        btn.addEventListener('click', () => {
            btn.disabled = true;
            logDebug("Load button clicked.");
            loadAllGalleryPages();
        });
        document.body.appendChild(btn);
        logDebug("Load button added.");
    }
})();
