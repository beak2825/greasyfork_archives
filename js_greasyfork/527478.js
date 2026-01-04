// ==UserScript==
// @name         ShopGoodwill Disable Slideshow and Gallery Tweaks
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Disables slideshow transitions, prevents auto-start on ShopGoodwill item pages, adds scroll wheel navigation for the gallery, prevents page scrolling when the gallery is open, and allows clicking on the large gallery image to close the gallery.
// @author       Your Name
// @match        https://shopgoodwill.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527478/ShopGoodwill%20Disable%20Slideshow%20and%20Gallery%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/527478/ShopGoodwill%20Disable%20Slideshow%20and%20Gallery%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Gallery Tweaks Script Started');

    let lastUrl = location.href; // Store the initial URL

    function checkUrlChange() {
        if (location.href !== lastUrl) {
            console.log('URL changed:', location.href);
            lastUrl = location.href;
            handlePageChange();
        }
    }

    setInterval(checkUrlChange, 1000); // Check for URL changes every second

    function handlePageChange() {
        if (location.pathname.startsWith("/item/")) {
            console.log('Detected an item page, applying tweaks');
            applyGalleryTweaks();
        }
    }

    function applyGalleryTweaks() {
        console.log('Applying gallery tweaks');

        // Inject CSS to disable transitions
        const css = `
            .ngx-gallery-animation-slide .ngx-gallery-image {
                -webkit-transition: none !important;
                transition: none !important;
            }
        `;
        let style = document.getElementById('disable-gallery-transitions');
        if (!style) {
            style = document.createElement('style');
            style.id = 'disable-gallery-transitions';
            style.type = 'text/css';
            style.textContent = css;
            document.head.appendChild(style);
        }

        // Function to simulate a constant mouseenter event
        function simulateMouseEnter() {
            const targetElement = document.querySelector('div.ngx-gallery-image:nth-child(1)');
            if (targetElement) {
                const mouseEnterEvent = new MouseEvent('mouseenter', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                targetElement.dispatchEvent(mouseEnterEvent);
            }
        }

        // Prevent multiple intervals from stacking
        if (!window.simulateMouseEnterInterval) {
            window.simulateMouseEnterInterval = setInterval(simulateMouseEnter, 100);
        }

        // Function to handle scroll wheel events
        function handleScrollWheel(event) {
            // Check if the large gallery is open by looking for the `ngx-gallery-active` class
            const galleryOpen = document.querySelector('ngx-gallery-preview.ngx-gallery-active');
            if (!galleryOpen) return; // Exit if the gallery is not open

            // Selectors for the left and right arrows
            const rightArrow = document.querySelector('ngx-gallery-arrows.ng-star-inserted:nth-child(1) > div:nth-child(2) > div:nth-child(1)');
            const leftArrow = document.querySelector('ngx-gallery-arrows.ng-star-inserted:nth-child(1) > div:nth-child(1) > div:nth-child(1)');

            if (event.deltaY > 0 && rightArrow) {
                // Scroll down - click right arrow
                rightArrow.click();
                event.preventDefault(); // Prevent default scroll behavior
            } else if (event.deltaY < 0 && leftArrow) {
                // Scroll up - click left arrow
                leftArrow.click();
                event.preventDefault(); // Prevent default scroll behavior
            }
        }

        // Prevent duplicate event listeners
        document.removeEventListener('wheel', handleScrollWheel);
        document.addEventListener('wheel', handleScrollWheel, { passive: false });

        // Function to close the gallery when clicking on the large gallery image
        function closeGalleryOnImageClick() {
            const galleryImage = document.querySelector('.ngx-gallery-preview-img');
            if (galleryImage && !galleryImage.dataset.clickHandlerAdded) {
                galleryImage.addEventListener('click', () => {
                    const closeButton = document.querySelector('.ngx-gallery-close');
                    if (closeButton) {
                        closeButton.click(); // Simulate a click on the close button
                    }
                });
                galleryImage.dataset.clickHandlerAdded = "true"; // Prevent multiple event bindings
            }
        }

        // Observe DOM changes to ensure the gallery image is available
        const observer = new MutationObserver(closeGalleryOnImageClick);
        observer.observe(document.body, { childList: true, subtree: true });

        // Run closeGalleryOnImageClick immediately in case the element is already present
        closeGalleryOnImageClick();
    }

    handlePageChange(); // Run once at the start

})();
