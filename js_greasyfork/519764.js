// ==UserScript==
// @name         XHamster Mobile Tweaks
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Remove promo messages, allow links to open in the same window, remove unwanted elements
// @author       CurlyWurly
// @match        *://xhamster.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519764/XHamster%20Mobile%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/519764/XHamster%20Mobile%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements
    function removeElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    }

    // Function to clean thumb list
    function cleanThumbList() {
        const thumbLists = document.querySelectorAll('.thumb-list-mobile.thumb-list');
        thumbLists.forEach(list => {
            const items = list.children;
            for (let i = items.length - 1; i >= 0; i--) {
                const item = items[i];
                const hasCorrectClasses = 
                    item.classList.contains('thumb-list-mobile-item') && 
                    item.classList.contains('thumb-list-mobile-item--type-video');
                
                if (!hasCorrectClasses) {
                    item.remove();
                }
            }
        });
    }

    // Function to clean layout bottom section
    function cleanLayoutBottom() {
        const layoutBottom = document.querySelector('[data-role="layout-bottom"]');
        if (layoutBottom) {
            const categoriesList = layoutBottom.querySelector('#type_categories_list');
            const pagination = layoutBottom.querySelector('.mobile-pagination');
            
            // Remove all children except pagination and categories list
            Array.from(layoutBottom.children).forEach(child => {
                if (child !== categoriesList && child !== pagination) {
                    child.remove();
                }
            });
        }
    }

    // Function to modify links
    function modifyLinks() {
        const links = document.querySelectorAll('a[target="_blank"]');
        links.forEach(link => link.setAttribute('target', '_self'));
    }

    // Create a mutation observer to handle dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        removeElements('[data-role="promo-messages-wrapper"]');
        removeElements('aside');
        cleanThumbList();
        cleanLayoutBottom();
        modifyLinks();
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial cleanup
    removeElements('[data-role="promo-messages-wrapper"]');
    removeElements('aside');
    cleanThumbList();
    cleanLayoutBottom();
    modifyLinks();
})();
