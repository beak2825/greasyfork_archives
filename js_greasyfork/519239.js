// ==UserScript==
// @name         Allover30 Images & Videos
// @namespace    https://greasyfork.org/en/users/1384264-atman
// @version      2025-01-13
// @description  Access full-size content and add download buttons
// @author       atman
// @match        https://new.allover30.com/model-pages/*
// @match        https://new.allover30.com/Model_Directory*
// @match        https://new.allover30.com/Recent_Updates*
// @match        https://tour.allover30.com/Model-Pages/*
// @grant        GM.xmlHttpRequest
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/519239/Allover30%20Images%20%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/519239/Allover30%20Images%20%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants and Selectors
    const MODEL_BOXES = document.querySelectorAll('.modelBox:not(.disabled)');
    const PHOTO_BOXES = document.querySelectorAll('.modelBox:not(.vid):not(.disabled)');
    const OLD_SITE_IMAGES = document.querySelectorAll('img.border');
    const STUDIO_NUMBERS = [2, 5, 14, 39, 44, 45, 46, 48, 50, 51, 52];

    // Shared state
    let setNumber = null;

    // Fetch studio number by checking image URLs
    async function checkStudioNumber() {
        if (!PHOTO_BOXES.length) return;

        const imgSrc = PHOTO_BOXES[0].querySelector('img').src;
        const [, letter, model, set] = imgSrc.match(/allover30.com\/(.)\/(\w+)\/(\d+)(?=\/cover)/) || [];
        if (!letter || !model || !set) return;

        const urlPromises = STUDIO_NUMBERS.map(number =>
            new Promise(resolve => {
                GM.xmlHttpRequest({
                    method: 'HEAD',
                    url: `https://members.allover30.com/media/${letter}/${model}/${set}/1536/${model}${number}${set}_1.jpg`,
                    onload: response => resolve(response.status === 200 ? number : null),
                    onerror: () => resolve(null)
                });
            })
        );

        const results = await Promise.all(urlPromises);
        setNumber = results.find(num => num !== null);
        if (setNumber) {
            console.log(`STUDIO/Photographer number: ${setNumber}`);
        } else {
            // Extract model name from current URL and redirect
            const currentUrl = window.location.href;
            const modelMatch = currentUrl.match(/model-pages\/([^/]+)/);
            if (modelMatch) {
                const modelName = modelMatch[1]
                .split('-') // Split at dashes
                .map(part => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize each part
                .join(''); // Join without dashes
                window.location.href = `https://tour.allover30.com/Model-Pages/${modelName}/`;
            }
        }
    }

    // Update links for model boxes (photos and videos)
    function updateModelBoxLinks() {
        MODEL_BOXES.forEach(box => {
            const img = box.querySelector('img');
            const modelPLink = box.querySelector('.modelP a');
            const [, letter, model, set] = img.src.match(/allover30.com\/(.)\/(\w+)\/(\d+)(?=\/cover)/) || [];
            if (!letter || !model || !set || !setNumber) return;

            const baseUrl = `https://members.allover30.com/media/${letter}/${model}/${set}`;
            const isPhoto = box.querySelector('.modelttl').textContent.includes('Photo');
            const detailsList = box.querySelector('.modelPdtls');

            if (isPhoto) {
                modelPLink.href = `${baseUrl}/4800/${model}${setNumber}${set}_1.jpg`;
                modelPLink.target = '_blank';
                detailsList.appendChild(createDownloadButton(`${baseUrl}/4800/${model}-${set}-4800.zip`, 'Download ZIP'));
            } else {
                modelPLink.href = `${baseUrl}/${model}-${set}-720.mp4`;
                modelPLink.target = '_blank';
                detailsList.appendChild(createDownloadButton(`${baseUrl}/${model}-${set}-720.mp4`, '720p', true));
                detailsList.appendChild(createDownloadButton(`${baseUrl}/${model}-${set}-1080.mp4`, '1080p', true));
                detailsList.appendChild(createDownloadButton(`${baseUrl}/${model}-${set}-4k.mp4`, '4K', true));
            }
        });
    }

    // Recent Updates
    function updateRecentUpdatesLinks() {
        const models = document.querySelectorAll('.mostRecent .darkGbox .gpvBox');
        models.forEach((model, index) => {
            const nameLink = model.querySelector('.deTtl a');
            const imageSpan = model.querySelector('span');
            const image = imageSpan ? imageSpan.querySelector('img') : null;

            if (!nameLink) return;

            const modelName = nameLink.textContent.trim();
            const newHref = `https://www.google.com/search?q=${encodeURIComponent('site:*.allover30.com/model-pages ' + modelName)}`;

            nameLink.href = newHref;
            nameLink.target = '_blank';

            if (imageSpan && image && image.parentElement.tagName !== 'A') {
                const imageLink = document.createElement('a');
                imageLink.href = newHref;
                imageLink.target = '_blank';
                imageSpan.insertBefore(imageLink, image);
                imageLink.appendChild(image);
            }
        });
        console.log('Models found:', models.length);
    }


    // Update links for model directory
    function updateModelLinks() {
        const models = document.querySelectorAll('.allModels li');
        models.forEach(model => {
            const imageLink = model.querySelector('a');
            const nameLink = model.querySelector('.amTtl a');
            if (!nameLink) return;

            const modelName = nameLink.textContent.trim();
            const newHref = `https://www.google.com/search?q=${encodeURIComponent('site:*.allover30.com/model-pages ' + modelName)}`;

            nameLink.href = newHref;
            nameLink.target = '_blank';
            if (imageLink) {
                imageLink.href = newHref;
                imageLink.target = '_blank';
            }
        });
        console.log('Models found:', models.length);
    }

    // Update links for old site layout
    function updateOldSiteLinks() {
        OLD_SITE_IMAGES.forEach(img => {
            const [, model, studio, setNum] = img.src.match(/index\/(\w{6})(\w{3})(\w{6})/) || [];
            if (!model || !studio || !setNum) return;

            const letter = model.charAt(0);
            const resolution = setNum < 5000 ? 1536 : setNum < 17500 ? 2400 : 4800;
            const baseUrl = `https://members.allover30.com/media/${letter}/${model}/${setNum}`;
            const previousTr = img.closest('tr')?.previousElementSibling;
            if (!previousTr) return;

            if (previousTr.textContent.includes('PICTURES')) {
                const link = document.createElement('a');
                link.href = `${baseUrl}/${resolution}/${model}${studio}${setNum}001.jpg`;
                link.target = '_blank';
                link.appendChild(img.cloneNode());
                img.parentNode.replaceChild(link, img);

                const downloadButton = createDownloadButton(`${baseUrl}/${model}${studio}_${setNum}_${resolution}.zip`);
                link.parentNode.insertBefore(downloadButton, link.nextSibling);
            } else if (previousTr.textContent.includes('MOVIE')) {
                const link = document.createElement('a');
                link.href = `${baseUrl}/wmv/${model}${studio}${setNum}001.wmv`;
                link.target = '_blank';
                link.appendChild(img.cloneNode());
                img.parentNode.replaceChild(link, img);

                const wmvButton = createDownloadButton(`${baseUrl}/wmv/${model}${studio}${setNum}001.wmv`, 'WMV', true);
                const mpgButton = createDownloadButton(`${baseUrl}/mpg/${model}${studio}${setNum}001.mpg`, 'MPG', true);
                link.parentNode.insertBefore(wmvButton, link.nextSibling);
                link.parentNode.insertBefore(mpgButton, link.nextSibling);
            }
        });
    }

    // Poll for changes in model directory and recent updates
    function startPolling() {
        const isModelDirectory = window.location.href.includes('Model_Directory');
        const isRecentUpdates = window.location.href.includes('Recent_Updates');

        let lastModelCount = isModelDirectory ? document.querySelectorAll('.allModels li').length : 0;
        let lastRecentCount = isRecentUpdates ? document.querySelectorAll('.mostRecent .darkGbox .gpvBox').length : 0;

        setInterval(() => {
            if (isModelDirectory) {
                const currentModelCount = document.querySelectorAll('.allModels li').length;
                if (currentModelCount !== lastModelCount) {
                    updateModelLinks();
                    lastModelCount = currentModelCount;
                }
            }

            if (isRecentUpdates) {
                const currentRecentCount = document.querySelectorAll('.mostRecent .darkGbox .gpvBox').length;
                if (currentRecentCount !== lastRecentCount) {
                    updateRecentUpdatesLinks();
                    lastRecentCount = currentRecentCount;
                }
            }
        }, 1000);
    }

    // Utility: Create a styled download button
    function createDownloadButton(url, text = 'Download ZIP', isVideo = false) {
        const button = document.createElement('a');
        button.href = url;
        button.textContent = text;
        button.style.cssText = `
            display: ${isVideo ? 'inline-block' : 'block'};
            ${isVideo ? 'max-width: 30%;' : 'width: 90%;'}
            margin: ${isVideo ? '6px' : '5px'};
            padding: 10px 6px;
            background: linear-gradient(90deg, #00d478, #297d58);
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            transition: background 0.5s linear;
        `;
        return button;
    }

    // Utility: Replace image with clickable link
    function replaceImageWithLink(img, url) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.appendChild(img.cloneNode());
        img.parentNode.replaceChild(link, img);
    }

    // Cleanup: Remove unwanted elements
    function cleanupPage() {
        document.querySelectorAll('a[href*="signup.php"]').forEach(link => {
            if (link.querySelector('img[src*="join.gif"]')) link.remove();
        });
        const paypal = document.querySelector('.paypal');
        if (paypal) paypal.remove();
    }

    // Main execution
    async function main() {
        const currentUrl = window.location.href;

        if (currentUrl.includes('model-pages')) {
            await checkStudioNumber();
            if (setNumber) updateModelBoxLinks();
        }
        if (currentUrl.includes('Model_Directory')) {
            updateModelLinks();
            startPolling();
        }

        if (currentUrl.includes('Recent_Updates')) {
            startPolling();
        }
        if (currentUrl.includes('Model-Pages')) {
            updateOldSiteLinks();
        }
        cleanupPage();
    }

    // Ensure script runs
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();