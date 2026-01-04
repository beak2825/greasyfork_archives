// ==UserScript==
// @name         Toonily Manga Loader
// @namespace    github.com/longkidkoolstar
// @version      1.1
// @description  Forces Toonily to load all manga images at once and dynamically loads them into a single page strip with a stats window.
// @author       longkidkoolstar
// @match        https://toonily.com/webtoon/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/js/all.min.js
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513226/Toonily%20Manga%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/513226/Toonily%20Manga%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let imageUrls = [];
    let loadedImages = 0;
    let totalImages = 0;
    let reloadMode = false;

    // Function to simulate click on the "Load All Images" switch
    function enableLoadAllImages() {
        const loadAllImagesButton = document.querySelector('#btn-lazyload-controller');
        if (loadAllImagesButton && loadAllImagesButton.querySelector('.fa-toggle-off')) {
            loadAllImagesButton.click(); // Simulate clicking to enable "Load All Images"
            console.log("Forcing 'Load All Images'...");
        }
    }

    // Hooking into XMLHttpRequest to capture all image URLs from AJAX responses
    function interceptAjaxRequests() {
        const originalOpen = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this.addEventListener('load', function() {
                if (url.includes('/chapters/manga')) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(this.responseText, 'text/html');
                    const imgs = doc.querySelectorAll('img.wp-manga-chapter-img');

                    imgs.forEach(img => {
                        const imgUrl = img.src.trim();
                        if (!imageUrls.includes(imgUrl)) {
                            imageUrls.push(imgUrl);
                        }
                    });
                }
            });

            return originalOpen.apply(this, [method, url, ...args]);
        };
    }

    // Function to remove all other HTML elements except for the manga container
    function removeOtherElements() {
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach(child => {
            if (!child.id || child.id !== 'manga-container') {
                child.remove();
            }
        });
    }

    // Helper function to create a page container for each image
    function createPageContainer(pageUrl) {
        const container = document.createElement('div');
        container.className = 'manga-page-container';

        const img = document.createElement('img');
        img.src = pageUrl;
        img.style.maxWidth = '100%';
        img.style.display = 'block';
        img.style.margin = '0px auto';  //Note: The 0px dictates the space between images and the auto center them

        img.onload = function() {
            loadedImages++;
            updateStats(); // Update the stats when an image is fully loaded
        };

        addClickEventToImage(img);

        container.appendChild(img);
        return container;
    }

    // Function to extract already loaded image URLs from the page
    function extractImageUrlsFromPage() {
        const images = document.querySelectorAll('.reading-content img.wp-manga-chapter-img');
        images.forEach(img => {
            const src = img.src.trim();
            if (src.startsWith('https://cdn.toonily.com/chapters/manga') && !imageUrls.includes(src)) {
                imageUrls.push(src);
            }
        });
        totalImages = imageUrls.length;
    }

// Helper function to create an exit button
function createExitButton() {
    const exitButton = document.createElement('button');
    exitButton.textContent = 'Exit';
    exitButton.style.backgroundColor = '#e74c3c';
    exitButton.style.color = '#fff';
    exitButton.style.border = 'none';
    exitButton.style.padding = '10px';
    exitButton.style.margin = '10px auto';
    exitButton.style.display = 'block';  // Center the button
    exitButton.style.cursor = 'pointer';
    exitButton.style.borderRadius = '5px';

    exitButton.addEventListener('click', function() {
        window.location.reload();  // Reload the page when clicked
    });

    return exitButton;
}

// Function to load all manga images into a single strip
function loadMangaImages() {
    const mangaContainer = document.createElement('div');
    mangaContainer.id = 'manga-container';
    document.body.appendChild(mangaContainer);

    imageUrls.forEach((url, index) => {
        const pageContainer = createPageContainer(url);

        // Add exit button to the first loaded page
        if (index === 0) {
            const topExitButton = createExitButton();
            mangaContainer.appendChild(topExitButton);
        }

        mangaContainer.appendChild(pageContainer);

        // Add exit button to the last loaded page
        if (index === imageUrls.length - 1) {
            const bottomExitButton = createExitButton();
            mangaContainer.appendChild(bottomExitButton);
        }
    });

    removeOtherElements(); // Remove all other page elements after loading
}


    // Function to update the stats window
    function updateStats() {
        const statsPages = document.querySelector('.ml-stats-pages');
        const loadingImages = document.querySelector('.ml-loading-images');
        const totalImagesDisplay = document.querySelector('.ml-total-images');
        if (statsPages) statsPages.textContent = `${loadedImages}/${totalImages} loaded`;
        if (loadingImages) loadingImages.textContent = `${totalImages - loadedImages} images loading`;
        if (totalImagesDisplay) totalImagesDisplay.textContent = `${totalImages} images in chapter`;
    }

    // Function to create the stats window
    async function createStatsWindow() {
        const statsWindow = document.createElement('div');
        statsWindow.className = 'ml-stats';
        statsWindow.style.position = 'fixed';
        statsWindow.style.bottom = '10px';
        statsWindow.style.right = '10px';
        statsWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        statsWindow.style.padding = '1px';
        statsWindow.style.color = 'white';
        statsWindow.style.borderRadius = '8px';
        statsWindow.style.zIndex = '9999';
        statsWindow.style.transition = 'opacity 0.3s';
        statsWindow.style.opacity = '0.5';

        statsWindow.addEventListener('mouseenter', function() {
            statsWindow.style.opacity = '1';
        });

        statsWindow.addEventListener('mouseleave', function() {
            statsWindow.style.opacity = '0.5';
        });

        const statsWrapper = document.createElement('div');
        statsWrapper.style.display = 'flex';
        statsWrapper.style.alignItems = 'center'; // Center vertically
        const collapseButton = document.createElement('span');
        collapseButton.className = 'ml-stats-collapse';
        collapseButton.title = 'Hide stats';
        collapseButton.textContent = '>>';
        collapseButton.style.cursor = 'pointer';
        collapseButton.style.marginRight = '10px'; // Space between button and content
        collapseButton.addEventListener('click', async function() {
            contentContainer.style.display = contentContainer.style.display === 'none' ? 'block' : 'none';
            collapseButton.textContent = contentContainer.style.display === 'none' ? '<<' : '>>';
            await GM.setValue('statsCollapsed', contentContainer.style.display === 'none');
        });
        (async () => {
            const isCollapsed = await GM.getValue('statsCollapsed', false);
            contentContainer.style.display = isCollapsed ? 'none' : 'block';
            collapseButton.textContent = isCollapsed ? '<<' : '>>';
        })();

        const contentContainer = document.createElement('div');
        contentContainer.className = 'ml-stats-content';

        const statsText = document.createElement('span');
        statsText.className = 'ml-stats-pages';
        statsText.textContent = `0/0 loaded`; // Initial stats

        const infoButton = document.createElement('i');
        infoButton.innerHTML = '<i class="fas fa-question-circle"></i>';
        infoButton.title = 'See userscript information and help';
        infoButton.style.marginLeft = '5px';
        infoButton.style.marginRight = '5px'; // Add space to the right
        infoButton.addEventListener('click', function() {
            alert('This userscript loads manga pages in a single view. Click on an image to reload.');
        });

        const moreStatsButton = document.createElement('i');
        moreStatsButton.innerHTML = '<i class="fas fa-chart-pie"></i>';
        moreStatsButton.title = 'See detailed page stats';
        moreStatsButton.style.marginRight = '5px'; // Add space to the right
        moreStatsButton.addEventListener('click', function() {
            const statsBox = document.querySelector('.ml-floating-msg');
            statsBox.style.display = statsBox.style.display === 'block' ? 'none' : 'block';
        });

        const refreshButton = document.createElement('i');
        refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
        refreshButton.title = 'Click an image to reload it.';
        refreshButton.addEventListener('click', function() {
            reloadMode = !reloadMode;
            refreshButton.style.color = reloadMode ? 'orange' : '';
            console.log(`Reload mode is now ${reloadMode ? 'enabled' : 'disabled'}.`);
        });

        const miniExitButton = document.createElement('button');
        miniExitButton.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        miniExitButton.title = 'Exit the Manga Loader';
        miniExitButton.style.marginLeft = '10px'; // Space between other buttons
        miniExitButton.style.backgroundColor = '#e74c3c';  // Red color for the button
        miniExitButton.style.color = '#fff';
        miniExitButton.style.border = 'none';
        miniExitButton.style.padding = '1px 5px';
        miniExitButton.style.borderRadius = '5px';
        miniExitButton.style.cursor = 'pointer';

        miniExitButton.addEventListener('click', function() {
            window.location.reload();  // Refresh the page
        });

        contentContainer.appendChild(statsText);
        contentContainer.appendChild(infoButton);
        contentContainer.appendChild(moreStatsButton);
        contentContainer.appendChild(refreshButton);
        contentContainer.appendChild(miniExitButton);  // Add mini exit button to the content

        statsWrapper.appendChild(collapseButton);
        statsWrapper.appendChild(contentContainer);
        statsWindow.appendChild(statsWrapper);

        const statsBox = document.createElement('pre');
        statsBox.className = 'ml-box ml-floating-msg';
        statsBox.innerHTML = `<strong>Stats:</strong><br><span class="ml-loading-images">0 images loading</span><br><span class="ml-total-images">0 images in chapter</span><br><span class="ml-loaded-pages">0 pages parsed</span>`;
        statsBox.style.display = 'none'; // Initially hidden
        statsWindow.appendChild(statsBox);

        document.body.appendChild(statsWindow);
    }

    // Add the click event to images
    function addClickEventToImage(image) {
        image.addEventListener('click', function() {
            if (reloadMode) {
                const imgSrc = image.dataset.src || image.src;
                image.src = ''; // Clear the src to trigger reload
                setTimeout(() => {
                    image.src = imgSrc; // Retry loading after clearing
                }, 100); // Short delay to ensure proper reload
            }
        });
    }

    // Create and add the "Load Manga" button
    const loadMangaButton = document.createElement('button');
    loadMangaButton.textContent = 'Load Manga';
    loadMangaButton.style.position = 'fixed';
    loadMangaButton.style.bottom = '10px';
    loadMangaButton.style.right = '10px';
    loadMangaButton.style.zIndex = '9999';
    loadMangaButton.style.padding = '10px';
    loadMangaButton.style.backgroundColor = '#f39c12';
    loadMangaButton.style.border = 'none';
    loadMangaButton.style.borderRadius = '5px';
    loadMangaButton.style.cursor = 'pointer';

    // Add hover effect to the button
    loadMangaButton.addEventListener('mouseover', function() {
        loadMangaButton.style.backgroundColor = '#ff5500';
    });

    loadMangaButton.addEventListener('mouseout', function() {
        loadMangaButton.style.backgroundColor = '#f39c12';
    });

    const mangaInfo = document.querySelector("body > div.wrap > div > div > div > div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary");
    if (!mangaInfo) {
        document.body.appendChild(loadMangaButton);

        loadMangaButton.addEventListener('click', async function() {
            enableLoadAllImages(); // Force the site to load all images
            interceptAjaxRequests(); // Hook into AJAX requests to capture image URLs
            extractImageUrlsFromPage(); // Initially extract image URLs from the page

            loadMangaImages(); // Load all collected images
            loadMangaButton.remove(); // Remove the button after loading
            await createStatsWindow(); // Create the stats window
        });
    }

    // Wait for the DOM to finish loading before adding the button
    window.addEventListener('DOMContentLoaded', function() {
        if (!mangaInfo) {
            document.body.appendChild(loadMangaButton);
        }
    });

})();
