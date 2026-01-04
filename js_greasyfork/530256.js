// ==UserScript==
// @name         Adulttime Grid View
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a "Grid View" button next to the scene title that, when pressed, automatically opens the carousel (if needed) and then launches a grid overlay. In the grid overlay the images are shown inside cells with a fixed height increased by 50% so that both vertical and landscape images appear larger and are not cut off. The grid overlay also retains its scroll position between openings. The carousel overlay includes mouse-wheel zoom (centered on the mouse pointer) and drag functionality.
// @match        https://members.adulttime.com/*
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530256/Adulttime%20Grid%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/530256/Adulttime%20Grid%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentCarouselImages = [];
    let gridScrollPosition = 0; // To store grid overlay scroll position

    // Hide the default carousel container (if any)
    function hideDefaultCarousel() {
        const defaultCarousel = document.querySelector('#pageOverlaySlot');
        if (defaultCarousel) {
            defaultCarousel.style.display = 'none';
        }
    }

    // Extract image URLs from the carousel (if already open)
    function extractCarouselImages() {
        const imageNodes = document.querySelectorAll('#pageOverlaySlot .image-gallery-slide img.image-gallery-image');
        const urls = [];
        imageNodes.forEach(img => {
            if (img.src && !urls.includes(img.src)) {
                urls.push(img.src);
            }
        });
        return urls;
    }

    // Recursively click the "next" arrow until all images have been loaded.
    function loadAllCarouselImages(callback) {
        const activeImg = document.querySelector('.image-gallery-slide.image-gallery-center img.image-gallery-image');
        if (!loadAllCarouselImages.firstSrc && activeImg) {
            loadAllCarouselImages.firstSrc = activeImg.src;
        }
        if (activeImg && loadAllCarouselImages.called && activeImg.src === loadAllCarouselImages.firstSrc) {
            callback();
            return;
        }
        loadAllCarouselImages.called = true;
        const nextArrow = document.querySelector('a.next-Link:not(.disabled-Link)');
        if (nextArrow) {
            nextArrow.click();
            setTimeout(() => {
                loadAllCarouselImages(callback);
            }, 1000);
        } else {
            callback();
        }
    }

    // Create grid overlay container with fixed cell height (increased by 50%) and scroll retention.
    function createOverlayContainer(images) {
        let container = document.getElementById('gridOverlayContainer');
        if (container) container.remove();

        container = document.createElement('div');
        container.id = 'gridOverlayContainer';
        Object.assign(container.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            zIndex: '9999',
            display: 'grid',
            // Set fixed cell width using auto-fit; using minmax with 600px as minimum (50% more than 400px)
            gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
            gap: '10px',
            padding: '20px',
            overflowY: 'auto'
        });

        // Listen for scroll events to update scroll retention.
        container.addEventListener('scroll', () => {
            gridScrollPosition = container.scrollTop;
        });

        // For each image, wrap it in a cell container.
        images.forEach(src => {
            const cell = document.createElement('div');
            // Fixed cell height: assume original vertical cell height was 375px; increased by 50% becomes 562.5px.
            cell.style.height = '562.5px';
            cell.style.overflow = 'hidden';
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';

            const img = document.createElement('img');
            img.src = src;
            // Ensure image fits inside the cell without cropping.
            img.style.maxHeight = '100%';
            img.style.maxWidth = '100%';
            img.style.objectFit = 'contain';
            img.style.cursor = 'pointer';
            // On clicking an image, remove grid overlay and open custom carousel at that image.
            img.addEventListener('click', () => {
                container.remove();
                const closeBtn = document.getElementById('gridOverlayCloseButton');
                if (closeBtn) closeBtn.remove();
                createCustomCarousel(images.indexOf(src));
            });
            cell.appendChild(img);
            container.appendChild(cell);
        });

        // Reapply stored scroll position, if any.
        setTimeout(() => {
            container.scrollTop = gridScrollPosition;
        }, 0);

        document.body.appendChild(container);

        // Add a persistent close button for grid overlay.
        const closeBtn = document.createElement('button');
        closeBtn.id = 'gridOverlayCloseButton';
        closeBtn.textContent = 'Close Grid';
        closeBtn.style.cssText =
            'position: fixed; top: 20px; right: 20px; z-index: 10000; padding: 10px 20px; font-size: 16px; cursor: pointer;';
        closeBtn.addEventListener('click', () => {
            container.remove();
            closeBtn.remove();
        });
        document.body.appendChild(closeBtn);
    }

    // Create a custom carousel overlay with zoom (based on mouse position) and drag.
    function createCustomCarousel(startIndex) {
        hideDefaultCarousel();
        let currentIndex = startIndex;
        const carouselContainer = document.createElement('div');
        carouselContainer.id = 'customCarouselContainer';
        Object.assign(carouselContainer.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '10000',
            overflow: 'hidden'
        });

        const carouselImage = document.createElement('img');
        carouselImage.id = 'customCarouselImage';
        carouselImage.src = currentCarouselImages[currentIndex];
        carouselImage.style.maxWidth = '90%';
        carouselImage.style.maxHeight = '90%';
        carouselImage.style.objectFit = 'contain';
        carouselImage.draggable = false;

        // Setup transform parameters for zoom and drag.
        let scale = 1, translateX = 0, translateY = 0, startX, startY;
        carouselImage.style.transformOrigin = '0 0';
        carouselImage.style.transition = 'transform 0.1s ease-out';

        // Mouse wheel zoom (centered on mouse pointer)
        carouselImage.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = carouselImage.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            const newScale = Math.max(1, scale + delta);
            const ratio = newScale / scale;
            // Adjust translation so that zoom centers on mouse pointer.
            translateX = offsetX - ratio * (offsetX - translateX);
            translateY = offsetY - ratio * (offsetY - translateY);
            scale = newScale;
            carouselImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        });

        // Drag functionality: update translation on mouse move.
        carouselImage.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        function onMouseMove(e) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            carouselImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        }
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        carouselContainer.appendChild(carouselImage);

        // Left arrow button for carousel navigation.
        const leftButton = document.createElement('button');
        leftButton.textContent = '<';
        leftButton.style.cssText =
            'position: absolute; left: 20px; top: 50%; transform: translateY(-50%); font-size: 30px; background: transparent; border: none; color: white; cursor: pointer;';
        leftButton.addEventListener('click', () => {
            // Reset zoom/drag on image change.
            scale = 1; translateX = 0; translateY = 0;
            currentIndex = (currentIndex - 1 + currentCarouselImages.length) % currentCarouselImages.length;
            carouselImage.src = currentCarouselImages[currentIndex];
            carouselImage.style.transform = `translate(0px, 0px) scale(1)`;
        });
        carouselContainer.appendChild(leftButton);

        // Right arrow button for carousel navigation.
        const rightButton = document.createElement('button');
        rightButton.textContent = '>';
        rightButton.style.cssText =
            'position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 30px; background: transparent; border: none; color: white; cursor: pointer;';
        rightButton.addEventListener('click', () => {
            scale = 1; translateX = 0; translateY = 0;
            currentIndex = (currentIndex + 1) % currentCarouselImages.length;
            carouselImage.src = currentCarouselImages[currentIndex];
            carouselImage.style.transform = `translate(0px, 0px) scale(1)`;
        });
        carouselContainer.appendChild(rightButton);

        // Close carousel button.
        const closeCarouselBtn = document.createElement('button');
        closeCarouselBtn.textContent = 'Close Carousel';
        closeCarouselBtn.style.cssText =
            'position: fixed; top: 20px; right: 20px; z-index: 11000; padding: 10px 20px; font-size: 16px; cursor: pointer;';
        closeCarouselBtn.addEventListener('click', () => {
            carouselContainer.remove();
            closeCarouselBtn.remove();
            // When closing carousel, reopen the grid overlay with scroll retention.
            createOverlayContainer(currentCarouselImages);
        });
        document.body.appendChild(carouselContainer);
        document.body.appendChild(closeCarouselBtn);

        // Keyboard navigation for left/right arrows and escape.
        function keyHandler(e) {
            if (e.key === 'ArrowLeft') leftButton.click();
            else if (e.key === 'ArrowRight') rightButton.click();
            else if (e.key === 'Escape') closeCarouselBtn.click();
        }
        document.addEventListener('keydown', keyHandler);
    }

    // Toggle grid overlay: load carousel images then open grid overlay.
    function toggleOverlay() {
        hideDefaultCarousel();
        loadAllCarouselImages(() => {
            const images = extractCarouselImages();
            currentCarouselImages = images.slice();
            if (images.length > 0) {
                createOverlayContainer(images);
            } else {
                alert('No carousel images found.');
            }
        });
    }

    // Launch grid overlay automatically – if no carousel image is active, simulate a click on first thumbnail.
    function launchGridOverlay() {
        let activeImg = document.querySelector('.image-gallery-slide.image-gallery-center img.image-gallery-image');
        if (!activeImg) {
            const firstThumb = document.querySelector('.PhotosetGallery-Image-BackgroundBox img');
            if (firstThumb) {
                firstThumb.click();
                const checkActive = setInterval(() => {
                    activeImg = document.querySelector('.image-gallery-slide.image-gallery-center img.image-gallery-image');
                    if (activeImg) {
                        clearInterval(checkActive);
                        toggleOverlay();
                    }
                }, 500);
            } else {
                alert('No carousel thumbnail found.');
            }
        } else {
            toggleOverlay();
        }
    }

    // Add a "Grid View" button next to the scene title.
    function addGridButton() {
        const targetSelector = 'h1.Title.PhotosetGallery-PhotosetTitle-Title';
        function insertButton() {
            const titleElement = document.querySelector(targetSelector);
            if (titleElement && !document.getElementById('gridViewButton')) {
                const gridButton = document.createElement('button');
                gridButton.id = 'gridViewButton';
                gridButton.textContent = 'Grid View';
                // Style the button to be a bit larger and with a yellow background.
                gridButton.style.cssText = `
                    margin-left: 20px;
                    padding: 8px 16px;
                    font-size: 16px;
                    cursor: pointer;
                    background-color: yellow;
                    border: 1px solid #999;
                    border-radius: 4px;
                    font-weight: bold;
                    vertical-align: middle;
                `;
                gridButton.addEventListener('click', launchGridOverlay);
                titleElement.parentElement.insertBefore(gridButton, titleElement.nextSibling);
                return true;
            }
            return false;
        }
        if (insertButton()) return;
        const observer = new MutationObserver((mutations, obs) => {
            if (insertButton()) {
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        const pollInterval = setInterval(() => {
            if (insertButton()) {
                clearInterval(pollInterval);
            }
        }, 500);
    }

    if (document.readyState !== 'loading') {
        addGridButton();
    } else {
        document.addEventListener('DOMContentLoaded', addGridButton);
    }
})();
