// ==UserScript==
// @name         Koharu Artist URL Collector
// @namespace    https://koharu.to/
// @version      1.7.2.1
// @description  Collect URLs from koharu.to artist pages and store them in GM_storage
// @license      MIT
// @author       viatana35
// @match        https://hoshino.one/tag/artist:*
// @match        https://hoshino.one/tag/circle:*
// @match        https://shupogaki.moe/tag/artist:*
// @match        https://shupogaki.moe/tag/circle:*
// @match        https://niyaniya.moe/tag/artist:*
// @match        https://niyaniya.moe/tag/circle:*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/503955/Koharu%20Artist%20URL%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/503955/Koharu%20Artist%20URL%20Collector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const urlKey = 'koharuUrls';
    const continueKey = 'continue_treatment';
    const artistsLibKey = 'artists_lib';
    let urlList = GM_getValue(urlKey, []);
    let continueTreatment = GM_getValue(continueKey, false);
    let artistsLib = GM_getValue(artistsLibKey, []);
    let isProcessing = false; // Flag to prevent infinite loop
    let lastProcessedUrl = '';

    // Function to process the current page and store English articles
    function processPage() {
        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            //const isEnglish = article.querySelector('a > header > h3 > span > svg[id="flag-icons-gb"]');
            const isEnglish = article.querySelector('a > div > main > div > div > svg[id="flag-icons-gb"]');
            if (isEnglish) {
                const articleUrl = article.querySelector('a').href;
                if (!urlList.includes(articleUrl)) {
                    urlList.push(articleUrl);
                }
            }
        });

        GM_setValue(urlKey, urlList);
    }

    // Function to navigate to the next page
    function goToNextPage() {
        const paginationList = document.querySelector('footer > nav > ul');
        if (paginationList) {
            const paginationItems = paginationList.children;
            const lastItem = paginationItems[paginationItems.length - 1]; // On prend le dernier élément de la liste

            const nextPageLink = lastItem.querySelector('a');
            if (nextPageLink) {
                const currentPageNumber = parseInt(new URL(window.location.href).searchParams.get('page') || '1', 10);
                const nextPageNumber = parseInt(new URL(nextPageLink.href).searchParams.get('page'), 10);

                if (nextPageNumber === currentPageNumber + 1) {
                    console.log(currentPageNumber, "->", nextPageNumber);
                    GM_setValue(continueKey, true);
                    window.location.href = nextPageLink.href;
                } else {
                    console.log("end of treatment 1");
                    saveArtistData();
                    GM_setValue(continueKey, false); // Pas de page suivante
                }
            } else {
                saveArtistData();
                GM_setValue(continueKey, false); // Pas de lien pour la page suivante
            }
        }
        else {
            console.log("end of treatment 2");
            saveArtistData();
            GM_setValue(continueKey, false); // Pas de page suivante
        }
    }

    function treatArtist() {
        // If there is no pagination list, check if the URL contains "&page"
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('page')) {
            showPopup("please go to page one to treat artist");
        } else {
            console.log("beginning of the treatment");
            processPage();
            goToNextPage();
        }
    }

    function getArtistName() {
        let artistName = null;

        // Get the pathname from the window location
        const pathname = window.location.pathname;

        // Check if the pathname starts with '/tag/'
        if (pathname.startsWith('/tag/')) {
            // Extract the part after '/tag/'
            const tagPart = pathname.substring('/tag/'.length);

            // Check if the tag part starts with 'artist:' or 'circle:'
            if (tagPart.startsWith('artist:') || tagPart.startsWith('circle:')) {
                // Extract the artist or circle name
                artistName = tagPart.split(':')[1];

                // Remove caret and dollar sign characters from the artist name
                artistName = artistName.replace(/[\^$]/g, '');
            }
        }

        return artistName;
    }


    function showPopup(message) {
        const popup = document.createElement('div');
        popup.id = 'popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#f1f1f1';
        popup.style.padding = '20px';
        popup.style.border = '1px solid #ccc';
        popup.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        popup.style.zIndex = '1001';
        popup.style.textAlign = 'center';
        popup.style.color = 'black'; // Set text color to black
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.3s ease-in-out';
        popup.textContent = message;

        document.body.appendChild(popup);

        // Fade in the popup
        setTimeout(() => {
            popup.style.opacity = '1';
        }, 10);

        // Fade out and remove the popup after 5 seconds
        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 300);
        }, 5000);
    }




    // Function to save the current artist's data
    function saveArtistData() {
        const artistName = getArtistName();
        if (artistName && urlList.length > 0) {
            const artistData = {
                artist: artistName,
                lst_dl: urlList
            };

            artistsLib = GM_getValue(artistsLibKey, []);
            // Add the artist data to the artistsLib
            artistsLib.push(artistData);

            // Save the updated artistsLib
            GM_setValue(artistsLibKey, artistsLib);

            // Clear the URL list for the next artist
            GM_setValue(urlKey, []);
            urlList = [];

            showPopup(`Artist ${artistName} has been processed.`);

            clearButton.disabled = false;

        }
    }

    // Function to handle automatic processing if continue_treatment is true
    function handleAutoProcessing() {
        if (isProcessing) return; // Prevent multiple processing
        isProcessing = true;

        const currentUrl = window.location.href;
        if (currentUrl !== lastProcessedUrl && continueTreatment) {
            lastProcessedUrl = currentUrl;
            processPage();
            goToNextPage();
        } else {
            isProcessing = false;
            return;
        }

        isProcessing = false;
    }

    // Function to download the artists_lib as a JSON file
    function downloadArtistsLib() {
        const artistsLibData = GM_getValue(artistsLibKey, []);
        const jsonContent = JSON.stringify(artistsLibData, null, 2); // Pretty print JSON with indentation
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'artists_lib.json';
        a.click();

        URL.revokeObjectURL(url); // Clean up the URL object
    }

    function clearList() {
        if (confirm('Do you really want to clear the list ?')) {
            GM_deleteValue(urlKey);
            GM_deleteValue(artistsLibKey);
            urlList = [];
            artistsLib = [];
            clearButton.disabled = true;
            showPopup("list cleared");
        }
    }

    // Create a container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'sticky';
    buttonContainer.style.top = '0';
    buttonContainer.style.backgroundColor = '#f1f1f1';
    buttonContainer.style.padding = '10px';
    buttonContainer.style.zIndex = 1000;
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.alignItems = 'center';
    document.body.prepend(buttonContainer);

    // Create a button to process the artist's pages
    const processButton = document.createElement('button');
    processButton.textContent = 'Treat artist';
    processButton.style.margin = '0 10px';
    processButton.style.padding = '10px';
    processButton.style.backgroundColor = '#4CAF50';
    processButton.style.color = 'white';
    processButton.style.border = 'none';
    processButton.style.cursor = 'pointer';
    processButton.onclick = () => {
        GM_setValue(continueKey, true);
        treatArtist();
    };
    buttonContainer.appendChild(processButton);

    // Create a button to clear the list and artists_lib
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear list';
    clearButton.style.margin = '0 10px';
    clearButton.style.padding = '10px';
    clearButton.style.backgroundColor = '#f44336';
    clearButton.style.color = 'white';
    clearButton.style.border = 'none';
    clearButton.style.cursor = 'pointer';
    clearButton.disabled = artistsLib.length === 0;
    clearButton.onclick = clearList;
    buttonContainer.appendChild(clearButton);

    // Create a button to download the artists_lib JSON
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download the list';
    downloadButton.style.margin = '0 10px';
    downloadButton.style.padding = '10px';
    downloadButton.style.backgroundColor = '#2196F3';
    downloadButton.style.color = 'white';
    downloadButton.style.border = 'none';
    downloadButton.style.cursor = 'pointer';
    downloadButton.onclick = downloadArtistsLib;
    buttonContainer.appendChild(downloadButton);

    // Enable the clear button if the list contains elements
    if (artistsLib.length > 0) {
        clearButton.disabled = false;
    }

    // Observe the second div inside the body, which contains the section that gets replaced
    const targetDiv = document.querySelector('body > div:nth-of-type(2)');

    if (targetDiv) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    console.log('DOM changed');
                    handleAutoProcessing();
                }
            });
        });
    
        observer.observe(targetDiv, { childList: true, subtree: true });
    }

    // Initial processing
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM fully loaded and parsed');
        handleAutoProcessing();
    });



})();
