// ==UserScript==
// @name         Vidsrc TMDB & IMDb Integration
// @namespace    http://tampermonkey.net/
// @version      2024-09-11
// @description  Stream Movies and TV Shows directly on IMDb and TMDB in upto 1080p! No more shady websites with horrible ads and malware.
// @author       nour
// @match        https://www.themoviedb.org/*
// @match        https://www.imdb.com/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// @downloadURL https://update.greasyfork.org/scripts/507209/Vidsrc%20TMDB%20%20IMDb%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/507209/Vidsrc%20TMDB%20%20IMDb%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // modal structure
    const modal = document.createElement('div');
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.zIndex = '10004';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

    const modalContent = document.createElement('div');
    modalContent.style.position = 'absolute';
    modalContent.style.top = '50%';
    modalContent.style.left = '50%';
    modalContent.style.transform = 'translate(-50%, -50%)';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '1111px';
    modalContent.style.height = '90%';
    modalContent.style.maxHeight = '687px';
    modalContent.style.backgroundColor = '#000000';
    modalContent.style.border = '1px solid #000000';
    modalContent.style.borderRadius = '5px';
    modalContent.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';

    const modalHeader = document.createElement('div');
    modalHeader.style.padding = '10px';
    modalHeader.style.backgroundColor = '#000000';
    modalHeader.style.color = '#FFFFFF';
    modalHeader.style.borderBottom = '1px solid #000000';
    modalHeader.style.display = 'flex';
    modalHeader.style.justifyContent = 'space-between';
    modalHeader.style.alignItems = 'center';

    const modalTitle = document.createElement('span');
    modalTitle.textContent = 'Vidsrc #1 Provider for your Streaming Needs';
    modalTitle.style.fontWeight = 'bold';

    const closeButton = document.createElement('span');
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '20px';

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = 'calc(100% - 41px)'; // Subtract header height
    iframe.style.border = 'none';
    iframe.allowFullscreen = true;

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(iframe);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Function to create the Watch Now button content
    function createWatchNowButtonContent(isIMDb) {
        if (isIMDb) {
            return `
                <button style="
                    background-color: #f5c518;
                    color: #000000;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    display: inline-flex;
                    align-items: center;
                    margin-left: 10px;
                ">
                    <i class="fas fa-play-circle" style="margin-right: 5px;"></i>
                    Watch Now
                </button>
            `;
        } else {
            const icon = '<i class="fas fa-play-circle" style="font-size: 36px; color: white;"></i>';
            return `
                <div class="text_wrapper">
                    <div class="button">
                        <div class="provider">
                            ${icon}
                        </div>
                        <div class="text">
                            <span>
                                <h4>Watch Now</h4>
                                <h3>Watch with Vidsrc</h3>
                            </span>
                        </div>
                    </div>
                </div>`;
        }
    }

    // Function to insert or replace the button
    function insertOrReplaceButton() {
        const contentType = getContentType();
        if (contentType === 'episode') {
            console.log("TV Episode detected, not showing button");
            return; // Don't show button for TV episodes
        }

        if (window.location.hostname === 'www.themoviedb.org') {
            insertTMDBButton();
        } else if (window.location.hostname === 'www.imdb.com') {
            insertIMDbButton();
        }
    }

    // Function to insert button for TMDB
    function insertTMDBButton() {
        const posterWrapper = document.querySelector('.poster_wrapper');
        if (posterWrapper) {
            let ottOffer = posterWrapper.querySelector('.ott_offer');
            if (!ottOffer) {
                ottOffer = document.createElement('div');
                ottOffer.className = 'ott_offer';
                posterWrapper.insertBefore(ottOffer, posterWrapper.firstChild);
            } else {
                const existingLink = ottOffer.querySelector('a');
                if (existingLink) {
                    existingLink.removeAttribute('href');
                    existingLink.style.cursor = 'pointer';
                }
            }

            ottOffer.innerHTML = createWatchNowButtonContent(false);

            const oldElement = ottOffer;
            const newElement = oldElement.cloneNode(true);
            oldElement.parentNode.replaceChild(newElement, oldElement);

            newElement.addEventListener('click', showModal);

            newElement.style.position = 'relative';
            newElement.style.zIndex = '10';
            newElement.style.marginBottom = '10px';
            newElement.style.cursor = 'pointer';
        }
    }

    // Function to insert button for IMDb
    function insertIMDbButton() {
        const titleElement = document.querySelector('.hero__primary-text');
        if (titleElement) {
            const watchNowButton = document.createElement('span');
            watchNowButton.innerHTML = createWatchNowButtonContent(true);
            watchNowButton.style.display = 'inline-block';
            watchNowButton.style.verticalAlign = 'middle';

            titleElement.insertAdjacentElement('afterend', watchNowButton);

            watchNowButton.querySelector('button').addEventListener('click', showModal);
        }
    }

    // Function to get ID (TMDB or IMDb)
    function getId() {
        if (window.location.hostname === 'www.themoviedb.org') {
            const match = window.location.pathname.match(/\/(movie|tv)\/(\d+)/);
            return match ? match[2] : null;
        } else if (window.location.hostname === 'www.imdb.com') {
            const match = window.location.pathname.match(/\/title\/(tt\d+)/);
            return match ? match[1] : null;
        }
        return null;
    }

    // Function to determine if it's a movie or TV show
function getContentType() {
    console.log("Starting getContentType function");
    console.log("Current URL:", window.location.href);
    console.log("Document title:", document.title);

    if (window.location.hostname === 'www.themoviedb.org') {
        console.log("Detected TMDB");
        const isMovie = window.location.pathname.includes('/movie/');
        console.log("Is movie path:", isMovie);
        return isMovie ? 'movie' : 'tv';
    } else if (window.location.hostname === 'www.imdb.com') {
        console.log("Detected IMDb");
        const title = document.title;
        console.log("Full title:", title);
        if (title.includes("TV Episode")) {
            console.log("Detected TV Episode");
            return 'episode';
        }
        const isSeries = title.includes("TV Series");
        console.log("Title includes 'TV Series':", isSeries);
        return isSeries ? 'tv' : 'movie';
    }

    console.log("Unknown website");
    return null;
}

// Test the function
const result = getContentType();
console.log("Final result:", result);

// Function to show modal
function showModal() {
    const id = getId();
    const contentType = getContentType();
    let baseUrl;

    // Set baseUrl based on the contentType
    if (contentType === 'tv') {
        baseUrl = 'https://vidsrc.me/embed/';
    } else {
        baseUrl = 'https://vidsrc.xyz/embed/';
    }

    if (id) {
        const isIMDb = window.location.hostname === 'www.imdb.com';
        const idParam = isIMDb ? id : `${contentType}?tmdb=${id}`;
        iframe.src = `${baseUrl}${idParam}`;
        modal.style.display = 'block';
    }
}

    // Function to initialize the script
    function init() {
        insertOrReplaceButton();
    }

    // Use a MutationObserver to detect when the relevant elements are added to the DOM
    const observer = new MutationObserver((mutations, obs) => {
        const relevantElement = window.location.hostname === 'www.themoviedb.org'
            ? document.querySelector('.poster_wrapper')
            : document.querySelector('.hero__primary-text');

        if (relevantElement) {
            init();
            obs.disconnect(); // Stop observing once we've found and modified the relevant element
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Close modal on close button click
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        iframe.src = ''; // Clear the iframe source when closing
    });

    // Close modal when clicking outside of it
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            iframe.src = ''; // Clear the iframe source when closing
        }
    });
})();