// ==UserScript==
// @name         4chan manga reader
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Dual-page manga reading mode for 4chan threads with navigation controls and backlinks display
// @author       sakanon
// @match        *://boards.4chan.org/a/thread/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505808/4chan%20manga%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/505808/4chan%20manga%20reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let active = false;
    let currentIndex = 0;
    let images = [];
    let loadedImages = [];
    let isLoading = false; // Track loading state

    document.addEventListener('keydown', (e) => {
        if (e.key === '`') {
            !active ? enterReadingMode() : exitReadingMode();
        }
    });

    async function enterReadingMode() {
        active = true;
        document.body.style.overflowY = 'hidden';

        images = Array.from(document.querySelectorAll('a.fileThumb')).map(a => {
            const post = a.closest('.post');
            let originalMessageLink = "";
            if (post.querySelector('.postMessage').innerHTML.trim() !== "") {
                originalMessageLink = `<span><a href="#${post.id}" class="quotelink">>>O </a></span>`;
            }
            return {
                src: a.href.endsWith('.webm') ? a.href.replace('.webm', 's.jpg') : a.href,
                postId: post.id,
                backlinks: originalMessageLink + (post.querySelector('.backlink')?.innerHTML || "")
            };
        });

        if (loadedImages.length === 0) {
            loadedImages = new Array(images.length).fill(false);
        }

        currentIndex = 0;
        await showImages();
        document.addEventListener('keydown', navigateImages);
    }

    function exitReadingMode() {
        active = false;
        document.body.style.overflowY = 'auto';

        const overlay = document.getElementById('reading-overlay');
        if (overlay) overlay.remove();
        document.removeEventListener('keydown', navigateImages);
    }

    async function showImages() {
        isLoading = true; // Set loading state to true

        const overlay = document.getElementById('reading-overlay') || createOverlay();
        overlay.innerHTML = ''; // Clear previous images

        // Show loading text
        const loadingText = document.createElement('div');
        loadingText.innerText = 'Loading...';
        loadingText.style.color = 'white';
        loadingText.style.fontSize = '24px';
        loadingText.style.position = 'absolute';
        loadingText.style.top = '50%';
        loadingText.style.left = '50%';
        loadingText.style.transform = 'translate(-50%, -50%)';
        overlay.appendChild(loadingText);

        document.body.appendChild(overlay);

        try {
            // Create elements for the first image
            const img1 = await createImage(images[currentIndex].src);
            const img1Backlinks = createBacklinks(images[currentIndex].backlinks, true);
            loadedImages[currentIndex] = true;

            // Create elements for the second image (if it exists and both images are portrait)
            const img2 = ((currentIndex != 0) && (currentIndex + 1 < images.length) && await isPortrait(images[currentIndex].src) && await isPortrait(images[currentIndex + 1].src)) ? await createImage(images[currentIndex + 1].src) : null;
            const img2Backlinks = img2 ? createBacklinks(images[currentIndex + 1].backlinks, false) : null;
            if (img2) loadedImages[currentIndex + 1] = true;

            // Remove loading text once images are loaded
            overlay.innerHTML = '';

            const pageWrapper = document.createElement('div');
            pageWrapper.style.display = 'flex';
            pageWrapper.style.justifyContent = 'center';
            pageWrapper.style.flexDirection = 'row-reverse'; // For right to left reading

            if (img1) pageWrapper.appendChild(img1);
            if (img2) pageWrapper.appendChild(img2);

            overlay.appendChild(pageWrapper);
            if (img1Backlinks) overlay.appendChild(img1Backlinks);
            if (img2Backlinks) overlay.appendChild(img2Backlinks);

            overlay.appendChild(createPageNumber(currentIndex, true));
            if (img2) overlay.appendChild(createPageNumber(currentIndex + 1, false));

        } catch (error) {
            console.error('Error loading images:', error);
        } finally {
            isLoading = false; // Set loading state to false after images are loaded
        }
    }

    async function navigateImages(e) {
        if (e.key === 'ArrowLeft' && currentIndex + 1 < images.length && (!isLoading || loadedImages[currentIndex + 1])) {
            currentIndex += (await isPortrait(images[currentIndex].src) && currentIndex != 0 && await isPortrait(images[currentIndex + 1].src)) + 1;
            await showImages();
        } else if (e.key === 'ArrowRight' && currentIndex > 0 && (!isLoading || loadedImages[currentIndex - 1])) {
            currentIndex -= (await isPortrait(images[currentIndex].src) && (currentIndex - 1) > 0 && await isPortrait(images[currentIndex - 1].src)) + 1;
            await showImages();
        } else if (e.key === 'Escape') {
            exitReadingMode();
        } else if (e.key === 'o' && !isLoading) {
            offsetPages();
        } else if (e.key === 'f') {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
        } else if (e.key === 'g') {
            const index = prompt('Enter page number:');
            if (index) {
                goToIndex(parseInt(index) - 1);
            }
        }
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'reading-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        overlay.style.zIndex = 9998;
        overlay.style.overflowY = 'hidden';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        return overlay;
    }

    async function createImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                img.style.maxHeight = '100vh';
                img.style.maxWidth = (img.width < img.height) ? '50vw' : '100vw';
                resolve(img);
            };
            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
            img.src = src;
        });
    }

    function createBacklinks(backlinksHtml, isRight) {
        if (!backlinksHtml) return null;
        const backlinksDiv = document.createElement('div');
        backlinksDiv.innerHTML = backlinksHtml;
        backlinksDiv.style.margin = '5px';
        backlinksDiv.style.cursor = 'pointer';
        backlinksDiv.className = 'backlink';
        backlinksDiv.style.position = 'fixed';
        backlinksDiv.style.top = '0';
        backlinksDiv.style.width = '50%';
        if (isRight) {
            backlinksDiv.style.right = '0';
            backlinksDiv.style.textAlign = 'right';
        } else {
            backlinksDiv.style.left = '0';
        }

        // Add hover event to display post content
        backlinksDiv.querySelectorAll('.quotelink').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const postId = link.href.split('#')[1];
                const post = document.getElementById(postId);
                if (post) {
                    const tooltip = createTooltip(post.innerHTML);
                    if (isRight) {
                        tooltip.style.right = `${window.innerWidth - e.clientX}px`;
                    } else {
                        tooltip.style.left = `${e.clientX}px`;
                    }
                    link.appendChild(tooltip);
                }
            });
            link.addEventListener('mouseleave', () => {
                const tooltip = link.querySelector('.tooltip');
                if (tooltip) tooltip.remove();
            });
        });

        return backlinksDiv;
    }

    function createPageNumber(index, isRight) {
        const pageNumber = document.createElement('div');
        pageNumber.innerText = `${index + 1}`;
        pageNumber.style.position = 'fixed';
        pageNumber.style.bottom = '0';
        pageNumber.style.fontSize = '0.8em';
        pageNumber.style.color = 'white';
        pageNumber.style.padding = '5px';
        if (isRight) {
            pageNumber.style.right = '0';
        } else {
            pageNumber.style.left = '0';
        }
        return pageNumber;
    }

    function createTooltip(content) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = content;
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px';
        tooltip.style.zIndex = '10000';
        tooltip.style.fontSize = '10pt';
        tooltip.style.wordBreak = 'break-word';
        tooltip.style.minWidth = '300px';
        return tooltip;
    }

    async function isPortrait(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
                img.src = src;
            img.onload = () => {
                resolve(img.width < img.height);
            };
            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
        });
    }

    function offsetPages() {
        currentIndex += 1;
        showImages();
    }

    function goToIndex(index) {
        currentIndex = index;
        showImages();
    }
})();