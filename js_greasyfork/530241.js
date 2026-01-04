// ==UserScript==
// @name         PerfectGonzo: View Photos Popup & Carousel (High Res, Fit Entire Image, Grid Toggle)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Adds a button that opens a fullscreen grid of high-res photos. Clicking a photo opens a carousel overlay that scales the image to fit without cropping. In the carousel, a "Grid View" button lets you return to the grid.
// @match        *://*.perfectgonzo.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530241/PerfectGonzo%3A%20View%20Photos%20Popup%20%20Carousel%20%28High%20Res%2C%20Fit%20Entire%20Image%2C%20Grid%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530241/PerfectGonzo%3A%20View%20Photos%20Popup%20%20Carousel%20%28High%20Res%2C%20Fit%20Entire%20Image%2C%20Grid%20Toggle%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the grid popup gallery
    function createPopupGallery(imageUrls) {
        // Create overlay for grid gallery
        const overlay = document.createElement('div');
        overlay.id = 'pgPhotoOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        overlay.style.zIndex = '10000';
        overlay.style.overflowY = 'auto';
        overlay.style.padding = '20px';

        // Close button for grid gallery
        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'X';
        closeBtn.style.position = 'fixed';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '20px';
        closeBtn.style.fontSize = '24px';
        closeBtn.style.background = 'transparent';
        closeBtn.style.color = '#fff';
        closeBtn.style.border = 'none';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.zIndex = '10001';
        overlay.appendChild(closeBtn);

        closeBtn.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });

        // Gallery container (grid layout)
        const galleryContainer = document.createElement('div');
        galleryContainer.style.display = 'flex';
        galleryContainer.style.flexWrap = 'wrap';
        galleryContainer.style.justifyContent = 'center';
        galleryContainer.style.gap = '20px';
        galleryContainer.style.marginTop = '60px'; // leave room for the close button
        overlay.appendChild(galleryContainer);

        imageUrls.forEach((url, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.style.flex = '1 1 auto';
            imgContainer.style.maxWidth = '400px';
            imgContainer.style.cursor = 'pointer';

            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Photo';
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.border = '2px solid #fff';
            img.style.boxShadow = '0 0 10px rgba(255,255,255,0.5)';
            img.style.transition = 'transform 0.2s ease-in-out';
            img.addEventListener('mouseover', () => { img.style.transform = 'scale(1.05)'; });
            img.addEventListener('mouseout', () => { img.style.transform = 'scale(1)'; });

            // When clicking the image, close the grid and open the carousel at this index.
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                document.body.removeChild(overlay);
                createCarousel(index, imageUrls);
            });

            imgContainer.appendChild(img);
            galleryContainer.appendChild(imgContainer);
        });

        document.body.appendChild(overlay);
    }

    // Function to create a fullscreen carousel overlay with a "Grid View" button
    function createCarousel(currentIndex, imageUrls) {
        // Create carousel overlay
        const carouselOverlay = document.createElement('div');
        carouselOverlay.id = 'pgCarouselOverlay';
        carouselOverlay.style.position = 'fixed';
        carouselOverlay.style.top = '0';
        carouselOverlay.style.left = '0';
        carouselOverlay.style.width = '100vw';
        carouselOverlay.style.height = '100vh';
        carouselOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        carouselOverlay.style.zIndex = '10001';
        carouselOverlay.style.display = 'flex';
        carouselOverlay.style.alignItems = 'center';
        carouselOverlay.style.justifyContent = 'center';

        // Container for image and controls
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        carouselOverlay.appendChild(container);

        // Image element with scaling that preserves aspect ratio
        const carouselImg = document.createElement('img');
        carouselImg.src = imageUrls[currentIndex];
        carouselImg.style.display = 'block';
        carouselImg.style.maxWidth = '100%';
        carouselImg.style.maxHeight = '100%';
        carouselImg.style.width = 'auto';
        carouselImg.style.height = 'auto';
        carouselImg.style.objectFit = 'contain';
        container.appendChild(carouselImg);

        // Left arrow
        const leftArrow = document.createElement('div');
        leftArrow.innerHTML = '&#10094;'; // left arrow symbol
        leftArrow.style.position = 'absolute';
        leftArrow.style.left = '20px';
        leftArrow.style.top = '50%';
        leftArrow.style.transform = 'translateY(-50%)';
        leftArrow.style.fontSize = '48px';
        leftArrow.style.color = '#fff';
        leftArrow.style.cursor = 'pointer';
        leftArrow.style.userSelect = 'none';
        container.appendChild(leftArrow);

        // Right arrow
        const rightArrow = document.createElement('div');
        rightArrow.innerHTML = '&#10095;'; // right arrow symbol
        rightArrow.style.position = 'absolute';
        rightArrow.style.right = '20px';
        rightArrow.style.top = '50%';
        rightArrow.style.transform = 'translateY(-50%)';
        rightArrow.style.fontSize = '48px';
        rightArrow.style.color = '#fff';
        rightArrow.style.cursor = 'pointer';
        rightArrow.style.userSelect = 'none';
        container.appendChild(rightArrow);

        // Close button
        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '30px';
        closeBtn.style.fontSize = '48px';
        closeBtn.style.color = '#fff';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.userSelect = 'none';
        container.appendChild(closeBtn);

        // New: "Grid View" button to go back to grid overlay.
        const gridViewBtn = document.createElement('button');
        gridViewBtn.innerText = 'Grid View';
        gridViewBtn.style.position = 'absolute';
        gridViewBtn.style.top = '20px';
        gridViewBtn.style.left = '30px';
        gridViewBtn.style.fontSize = '16px';
        gridViewBtn.style.padding = '8px 12px';
        gridViewBtn.style.background = '#ffa700';
        gridViewBtn.style.border = 'none';
        gridViewBtn.style.borderRadius = '5px';
        gridViewBtn.style.cursor = 'pointer';
        gridViewBtn.style.zIndex = '10002';
        container.appendChild(gridViewBtn);

        // Arrow navigation events
        leftArrow.addEventListener('click', function(e) {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
            carouselImg.src = imageUrls[currentIndex];
        });

        rightArrow.addEventListener('click', function(e) {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % imageUrls.length;
            carouselImg.src = imageUrls[currentIndex];
        });

        // Close carousel events
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(carouselOverlay);
        });
        carouselOverlay.addEventListener('click', function(e) {
            if (e.target === carouselOverlay) {
                document.body.removeChild(carouselOverlay);
            }
        });

        // "Grid View" button: remove carousel and reopen grid overlay
        gridViewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            document.body.removeChild(carouselOverlay);
            createPopupGallery(imageUrls);
        });

        document.body.appendChild(carouselOverlay);
    }

    // When the page loads, add the "View Photos" button
    window.addEventListener('load', function() {
        const btn = document.createElement('button');
        btn.innerText = 'View Photos';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px 15px';
        btn.style.background = '#ffa700';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        document.body.appendChild(btn);

        // On button click, gather high-res photo URLs from the Photos section
        btn.addEventListener('click', function() {
            let imageUrls = [];
            const photoAnchors = document.querySelectorAll('.bxslider_pics_fancybox a[href]');
            photoAnchors.forEach(anchor => {
                const url = anchor.href;
                if(url) {
                    imageUrls.push(url);
                }
            });
            imageUrls = [...new Set(imageUrls)]; // Remove duplicates
            if(imageUrls.length > 0) {
                createPopupGallery(imageUrls);
            } else {
                alert('No photos found.');
            }
        });
    });
})();
