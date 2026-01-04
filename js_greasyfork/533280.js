// ==UserScript==
    // @name         百度优化
    // @namespace    http://tampermonkey.net/
    // @version      1.2
    // @description  Optimizes Baidu by preventing unnecessary horizontal scrolling and removing blank space on image detail pages, and dynamically hides the placeholder text in Baidu's search input field
    // @author       Grok
    // @match        https://www.baidu.com/*
    // @match        https://image.baidu.com/search/detail*
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533280/%E7%99%BE%E5%BA%A6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/533280/%E7%99%BE%E5%BA%A6%E4%BC%98%E5%8C%96.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        // Function to fix overflow on image detail pages
        function fixOverflow() {
            // Target the main container that may cause scrolling
            const containers = document.querySelectorAll('body, .img-detail-container, .img-container, [style*="overflow"]');
            containers.forEach(container => {
                if (container) {
                    // Disable horizontal overflow
                    container.style.overflowX = 'hidden';
                    // Ensure container width is limited to viewport
                    container.style.maxWidth = '100vw';
                    // Remove any inline width that causes overflow
                    if (container.style.width && container.style.width.includes('px')) {
                        container.style.width = '100%';
                    }
                }
            });

            // Ensure the image itself doesn't cause overflow
            const img = document.querySelector('.main_img, .img-detail-img');
            if (img) {
                img.style.maxWidth = '100%';
                img.style.width = 'auto';
            }

            // Prevent horizontal scrolling on the body
            document.body.style.overflowX = 'hidden';
        }

        // Function to remove placeholder in search input
        function removePlaceholder() {
            const input = document.getElementById('kw');
            if (input && input.hasAttribute('placeholder')) {
                input.removeAttribute('placeholder');
            }
        }

        // Run both functions based on the page
        function optimizeBaidu() {
            // Run placeholder removal on main search page
            if (window.location.href.includes('www.baidu.com')) {
                removePlaceholder();
            }

            // Run overflow fix on image detail page
            if (window.location.href.includes('image.baidu.com/search/detail')) {
                fixOverflow();
            }
        }

        // Run on initial load
        optimizeBaidu();

        // Observe DOM changes for dynamic content
        const observer = new MutationObserver(optimizeBaidu);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['placeholder']
        });

        // Run after DOM is fully loaded
        document.addEventListener('DOMContentLoaded', optimizeBaidu);
    })();