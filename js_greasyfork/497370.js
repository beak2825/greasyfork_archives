// ==UserScript==
// @name         HentaiNexus Image Fit to Screen
// @namespace    https://greasyfork.org/en/users/1314621
// @version      1.0
// @description  Resize images to fit the screen
// @author       paper-jam-spitball-soldier
// @match        *://hentainexus.com/read/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497370/HentaiNexus%20Image%20Fit%20to%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/497370/HentaiNexus%20Image%20Fit%20to%20Screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fitImageToScreen(img) {
        img.style.maxWidth = '100vw';

        // Calculate available height by subtracting the height of top and bottom elements
        const topElementsHeight = calculateTopElementsHeight();
        const bottomElementsHeight = calculateBottomElementsHeight();
        const availableHeight = window.innerHeight - topElementsHeight - bottomElementsHeight;

        img.style.maxHeight = `${availableHeight}px`;
        img.style.width = 'auto';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.marginLeft = 'auto';
        img.style.marginRight = 'auto';
    }

    function calculateTopElementsHeight() {
        // Adjust this selector to match the elements at the top of your page
        const topElements = document.querySelectorAll('.header, .navbar'); // Example selectors
        let totalHeight = 0;
        topElements.forEach(el => {
            totalHeight += el.offsetHeight;
        });
        return totalHeight;
    }

    function calculateBottomElementsHeight() {
        // Adjust this selector to match the elements at the bottom of your page
        const bottomElements = document.querySelectorAll('.footer'); // Example selectors
        let totalHeight = 0;
        bottomElements.forEach(el => {
            totalHeight += el.offsetHeight;
        });
        return totalHeight;
    }

    function applyResize() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            fitImageToScreen(img);
            // Scroll to image after it's fully loaded
            img.addEventListener('load', () => {
                scrollToImage(img);
            });
        });

        // Scroll to the first image
        if (images.length > 0) {
            scrollToImage(images[0]);
        }
    }

    function scrollToImage(img) {
        const imgRect = img.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const topElementsHeight = calculateTopElementsHeight();

        window.scrollTo({
            top: imgRect.top + scrollTop - topElementsHeight,
            behavior: 'smooth'
        });
    }

    // Initial resize of all images
    applyResize();

    // Resize images on window resize
    window.addEventListener('resize', applyResize);

    // Use a MutationObserver to detect new images
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName === 'IMG') {
                    fitImageToScreen(node);
                    // Scroll to image after it's fully loaded
                    node.addEventListener('load', () => {
                        scrollToImage(node);
                    });
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    node.querySelectorAll('img').forEach(img => {
                        fitImageToScreen(img);
                        // Scroll to image after it's fully loaded
                        img.addEventListener('load', () => {
                            scrollToImage(img);
                        });
                    });
                }
            });
        });
    });

    // Observe changes to the document body and its descendants
    observer.observe(document.body, { childList: true, subtree: true });
})();
