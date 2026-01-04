// ==UserScript==
// @name         VK Blur Remover
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Removes blur, overlays, and auto-play restrictions on VK videos, while preserving thumbnails.
// @author       1axx
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @match        https://vk.com/*
// @match        https://*.vkvideo.ru/*
// @match        *://vk.com/*
// @match        *://vk.ru/*
// @match        *://*.vk.com/*
// @match        *://*.vk.ru/*
// @match        *://*.vk-cdn.com/*
// @match        *://*.vk-cdn.net/*
// @match        *://*.mycdn.me/*
// @match        *://*.userapi.com/*
// @match        *://*.vkuseraudio.net/*
// @match        *://*.vkuseraudio.ru/*
// @match        *://*.vkuservideo.net/*
// @match        *://*.vkuser.net/*
// @match        *://*.pladform.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523218/VK%20Blur%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/523218/VK%20Blur%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Keywords
    const keywords = [
        'age-restricted',
        'blurred',
        'restriction',
        'video',
        'restricted',
        'VideoRestriction',
        'video_no_actions',
        'VideoRestriction__icon',
        'VideoRestriction__title',
        'VideoRestriction__boxWrap',
        'VideoRestriction__box',
        'VideoRestriction__icon--age',
        'VideoCard__privacy',
        'vkuiIcon--hide_outline_28',
        'vkitVideoCardPreviewImage__imgBlurred',
        'vkitVideoCardRestrictionOverlay__restriction',
        'vkitVideoCardRestrictionOverlay__restrictionLayoutLight',
        'vkitOverlay__root',
        'vkitVideoCardRestrictionOverlay__title',
        'VideoRestriction__button',
        'VideoCard__thumb',
        'VideoRestriction__thumb',
        'VideoPreview__video--ge4wE', 'VideoPreview__videoPage--mxbot', 'VideoPreview__videoBlur--zGUvo',
        'vkuiTappable', 'vkuiClickable__resetLinkStyle', 'vkuiClickable__host',
        'vkuiClickable__realClickable', 'vkui-focus-visible', 'vkuiRootComponent', 'VideoPreview__videoImage--L4wly', 'VideoPreview__videoImageBlur--0v1Uc', 'vkitPlaceholder__container--29Nwx', 'vkuiPlaceholder', 'vkuiPlaceholder__icon'
    ];

    // Function to process thumbnails
    function processThumbnails(element) {
        if (element.classList.contains('VideoRestriction__thumb') ||
           element.classList.contains('vkuiTappable__stateLayer')) {
            element.style.filter = 'none'; // Clear blur
            element.style.opacity = '1'; // Make visible
        }
    }

    // Function to handle removal of overlays and restrictions
    function processRestrictions(element) {
        const restrictedClasses = [
            'vkitVideoCardRestrictionOverlay__restriction',
            'vkitOverlay__root',
            'VideoRestriction__icon--age',
            'VideoRestriction__box',
            'VideoRestriction__title'
        ];

        restrictedClasses.forEach(cls => {
            if (element.classList.contains(cls)) {
                element.style.display = 'none'; // Completely hide
                element.style.pointerEvents = 'none';
            }
        });

        if (element.classList.contains('VideoRestriction__button')) {
            element.click(); // Auto-click to bypass restrictions
            console.log('Auto-clicked a restriction button');
        }
    }

    // Function to dynamically check and hide/remove based on content and attributes
    function processElements() {
        // Select all elements in the document
        const allElements = document.querySelectorAll('*');

        allElements.forEach(element => {
            let shouldRemove = false;
            let elementText = element.innerText || ''; // Get text inside the element
            let elementAttributes = Array.from(element.attributes); // Get attributes of the element

            // Check if element has text matching any keywords
            const lowerCaseText = elementText.toLowerCase();
            keywords.forEach(keyword => {
                if (lowerCaseText.includes(keyword)) {
                    shouldRemove = true;
                }
            });

            // Check if element's attributes contain any keywords (like titles, alt, etc.)
            elementAttributes.forEach(attr => {
                if (attr.value.toLowerCase().includes('blur') || attr.value.toLowerCase().includes('restriction')) {
                    shouldRemove = true;
                }
            });

            // If the element has specific content that matches the keywords, remove or hide it
            if (shouldRemove) {
                // Handle SVG icons with unwanted classes
                if (element.classList.contains('vkuiIcon--hide_outline_28')) {
                    element.remove();
                }
                // Handle blurred preview images
                else if (element.classList.contains('vkitVideoCardPreviewImage__imgBlurred--GNE6S', ' ')) {
                    element.style.filter = 'none'; // Remove blur effect
                    element.style.opacity = '1'; // Ensure full visibility
                }
                // Handle age-restricted overlay and other similar elements
                else if (element.classList.contains('vkitVideoCardRestrictionOverlay__restriction--EP1HY') ||
                         element.classList.contains('vkitVideoCardRestrictionOverlay__restrictionLayoutLight--IPSP6') ||
                         element.classList.contains('vkitOverlay__root--AjJAj') ||
                         element.classList.contains('VideoRestriction__icon.VideoRestriction__icon--age') ||
                         element.classList.contains('VideoRestriction__title') ||
                         element.classList.contains('VideoRestriction__box') ||
                         element.classList.contains('VideoCard__privacyIconWrapper') ||
                         element.classList.contains('vkuiTappable__stateLayer.vkuiTappable__ripple') ||
                         element.classList.contains('vkuiPlaceholder') ||
                         element.classList.contains('vkitVideoCardRestrictionOverlay__title--qz1zh')) {
                    element.style.display = 'none'; // Hide the overlay completely
                    element.style.pointerEvents = 'none';
                }
            }

            // Handle the specific thumbnail and restriction logic
            processThumbnails(element); // Handle thumbnails
            processRestrictions(element); // Handle overlays and other elements

            if (element.classList.contains('VideoRestriction__button')) {
                element.click();
                console.log('Auto-clicked the "Look" button');
            }
        });
    }

    // Wait
    window.addEventListener('load', function() {
        // Observe changes to the DOM and apply fixes dynamically
        const observer = new MutationObserver(processElements);
        observer.observe(document.body, { childList: true, subtree: true });
        processElements(); // Initial run to process existing content
    });
})();
