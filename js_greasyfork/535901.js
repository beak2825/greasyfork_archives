// ==UserScript==
// @name         BaseTao Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds download buttons to BaseTao order image pages
// @match        https://www.basetao.com/best-taobao-agent-service/purchase/order_img/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535901/BaseTao%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/535901/BaseTao%20Image%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Styles
    GM_addStyle(`
        .btn-primary.custom-download {
            background-color: #5143d9 !important;
            border-color: #5143d9 !important;
            color: white;
            padding: 0.5rem 1rem;
            font-size: 1rem;
            border-radius: 0.5rem;
            display: inline-flex;
            align-items: center;
            cursor: not-allowed;
            margin-right: 0.75rem;
            transition: background-color 0.3s ease, border-color 0.3s ease;
        }
        .btn-primary.custom-download[data-state="ready"] {
            background-color: #f0ac19 !important;
            border-color: #f0ac19 !important;
            cursor: pointer;
        }
        .btn-primary.custom-download[data-state="ready"]:hover {
            background-color: #c48a0b !important;
            border-color: #c48a0b !important;
        }

        .image-download-wrapper {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            margin-top: 0.25rem;
            margin-bottom: 1rem;
            padding-right: 0.25rem;
            position: relative;
            z-index: 2;
        }

        .image-download-wrapper a i {
            font-size: 1.25rem;
            transition: color 0.3s ease;
            color: #5143d9 !important;
        }

        .image-download-wrapper[data-state="ready"] a i {
            color: #f0ac19 !important;
        }

        .image-download-wrapper[data-state="ready"] a:hover i {
            color: #c48a0b !important;
        }
    `);

    let downloadBtn;

    function createDownloadAllButton() {
        const goBackBtn = document.querySelector('button.btn.btn-primary.float-end');
        if (!goBackBtn || document.getElementById('downloadAllImagesBtn')) return;

        downloadBtn = document.createElement('button');
        downloadBtn.type = 'button';
        downloadBtn.className = 'btn btn-primary custom-download float-end me-2';
        downloadBtn.id = 'downloadAllImagesBtn';
        downloadBtn.setAttribute('data-state', 'disabled');
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<i class="fa-solid fa-download me-2"></i>Download All Images';

        goBackBtn.parentNode.insertBefore(downloadBtn, goBackBtn.nextSibling);
    }

    function enableDownloadAllButton() {
        if (!downloadBtn) return;

        downloadBtn.removeAttribute('disabled');
        downloadBtn.setAttribute('data-state', 'ready');

        downloadBtn.addEventListener('click', () => {
            const images = document.querySelectorAll('.card img');
            images.forEach((img, index) => {
                const link = document.createElement('a');
                link.href = img.src;
                link.download = `image_${index + 1}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        });
    }

    function createDownloadIconsPlaceholders() {
        const cards = document.querySelectorAll('.card.card-element-hover');

        cards.forEach((card, index) => {
            if (card.dataset.downloadAdded === "true") return;

            const wrapper = document.createElement('div');
            wrapper.className = 'image-download-wrapper';
            wrapper.setAttribute('data-state', 'disabled');

            const link = document.createElement('a');
            link.href = "#";
            link.title = "Download image";

            const icon = document.createElement('i');
            icon.className = 'bi bi-download fs-5';
            link.appendChild(icon);

            wrapper.appendChild(link);
            card.parentNode.insertBefore(wrapper, card.nextSibling);
            card.dataset.downloadAdded = "true";
        });
    }

    function enableDownloadIcons() {
        const cards = document.querySelectorAll('.card.card-element-hover');

        cards.forEach((card, index) => {
            const img = card.querySelector('img');
            const wrapper = card.parentNode.querySelector('.image-download-wrapper');

            if (!img || !wrapper) return;

            const link = wrapper.querySelector('a');
            wrapper.setAttribute('data-state', 'ready');

            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const tempLink = document.createElement('a');
                tempLink.href = img.src;
                tempLink.download = `image_${index + 1}.jpg`;
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
            });
        });
    }

     createDownloadAllButton();
    createDownloadIconsPlaceholders();

    function checkAndEnableIfImagesLoaded() {
        const imgCards = document.querySelectorAll('.card.card-element-hover img');
        if (imgCards.length > 0) {
            enableDownloadAllButton();
            enableDownloadIcons();
        }
    }

    // Fallback in case images already exist
    checkAndEnableIfImagesLoaded();

    // Use MutationObserver for fast detection
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('.card.card-element-hover')) {
                        createDownloadIconsPlaceholders();
                        checkAndEnableIfImagesLoaded();
                    }
                });
            }
        }
    });

    // Start observing main container
    const container = document.querySelector('#app, body, .container, .row'); // Adjust as needed
    if (container) {
        observer.observe(container, {
            childList: true,
            subtree: true
        });
    }
})();
