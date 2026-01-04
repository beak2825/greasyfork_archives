// ==UserScript==
// @name         Pikabu Purifier
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Скрывает посты с рейтингом ниже установленного
// @author       Kam1k4dze
// @match        https://pikabu.ru/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468458/Pikabu%20Purifier.user.js
// @updateURL https://update.greasyfork.org/scripts/468458/Pikabu%20Purifier.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Add custom CSS styles
    GM_addStyle(`
    #rating::-webkit-inner-spin-button,
    #rating::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    #rating {
      -moz-appearance: textfield;
    }
  `);

    function checkMobile() {

        const scriptElements = document.getElementsByTagName("script");
        const importedScripts = [];

        for (let i = 0; i < scriptElements.length; i++) {
            const scriptSrc = scriptElements[i].src;
            if (scriptSrc) {
                if (scriptSrc.includes('mobile')) {
                    return true;
                }
            }
        }

        return false;


    }
    var mobile = checkMobile();
    // Create the custom menu item
    var customMenuItem = document.createElement('div');
    customMenuItem.className = 'sidebar-block sidebar-block_border sidebar-block__content menu menu_vertical';
    customMenuItem.innerHTML = '<a class="menu__item"><label for="rating">Минимальный рейтинг:  </label><input type="number" id="rating" name="rating" value="0" step="1" style="width: 60px;border: thin solid;border-radius: 5px;text-align:center;background: transparent;font-size: 14px;border-color: #21262a;height: 26px"></a>';
    if (mobile) {

        const headerElement = document.querySelector('header.header');
        // Insert the custom menu item after the header
        headerElement.parentNode.insertBefore(customMenuItem, headerElement.nextSibling);


    } else {
        // Append the custom menu item to the sidebar
        var sidebarBlock = document.querySelector('.sidebar-block.sidebar-block_border');
        sidebarBlock.parentNode.insertBefore(customMenuItem, sidebarBlock);
    }
    // Get the rating input element
    var ratingInput = document.getElementById('rating');

    // Retrieve the minimum rating value from storage or use the default value
    var minimumRating = GM_getValue('minimumRating', 0);
    ratingInput.value = minimumRating;

    // Event listener for changes in the rating input
    ratingInput.addEventListener('change', function(event) {
        minimumRating = parseInt(event.target.value);
        GM_setValue('minimumRating', minimumRating);
        delStories();
        console.log('Minimum Rating: ' + minimumRating);
    });

    // Select the element you want to observe
    var containerElement = document.querySelector('.stories-feed__container');

    // Check if the element exists
    if (containerElement) {
        // Initial filtering of stories
        delStories();

        // Create a new MutationObserver instance
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check if the target element was changed
                if (mutation.target === containerElement) {
                    delStories();
                }
            });
        });

        // Configure the observer to watch for changes in the target element
        var config = {
            childList: true,
            subtree: true
        };

        // Start observing the target element
        observer.observe(containerElement, config);
    }

    // Function to filter and delete stories
    function delStories() {
        if (containerElement) {
            var storyElements = containerElement.querySelectorAll('.story');
            storyElements.forEach(function(storyElement) {
                // Get the "data-rating" attribute value
                var rating = storyElement.getAttribute('data-rating');
                if (rating === null || parseInt(rating) < minimumRating) {
                    storyElement.remove();
                    console.log('Deleted:', rating);
                }
            });
        }
    }
})();