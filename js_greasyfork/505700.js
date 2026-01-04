// ==UserScript==
// @name         Zhihu Cleaner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clean Zhihu by removing specified elements and hiding images periodically for better reading experience.
// @author       You
// @match        https://www.zhihu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505700/Zhihu%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/505700/Zhihu%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove and hide elements
    function removeAndHideElements() {
        // Array of class names to remove
        var classesToRemove = [
            'ztext AuthorInfo-badgeText css-14ur8a8',
            'AuthorInfo',
            'Question-sideColumn Question-sideColumn--sticky css-1qyytj7',
            'Reward-tagline',
            'Reward-rewardBtn',
            'Reward-countZero'


        ];

        // Loop through each class and remove the elements
        classesToRemove.forEach(function(className) {
            // Select all elements with the class name
            var elements = document.querySelectorAll('.' + className.split(' ').join('.'));

            // Remove each element
            elements.forEach(function(element) {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
        });

        // Hide ContentItem-actions elements
        var contentItemActions = document.querySelectorAll('.ContentItem-actions');
        contentItemActions.forEach(function(element) {
            element.style.display = 'none';
        });

        // Hide all images on the page
        var images = document.querySelectorAll('img');
        images.forEach(function(img) {
            img.style.display = 'none';
        });

        console.log('Specified elements removed, ContentItem-actions hidden, and all images hidden.');
    }

    // Initial execution
    removeAndHideElements();

    // Execute every 5 seconds
    setInterval(removeAndHideElements, 5000);
})();
