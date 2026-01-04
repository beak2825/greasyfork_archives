// ==UserScript==
// @name         Geoguessr UI Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Removes things like the maprunner background, geocoins and the shop and the edit avatar button from Geoguessr.com
// @author       TheM1sty
// @match        https://www.geoguessr.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475364/Geoguessr%20UI%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/475364/Geoguessr%20UI%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the specified HTML element
    function removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    // Function to remove the specified button
    function removeShopButton() {
        var buttons = document.querySelectorAll('button.game-menu-button_button__WPwVi');
        buttons.forEach(function(button) {
            var buttonText = button.textContent.trim();
            var tabindex = button.getAttribute('tabindex');
            if (buttonText === 'FreeShop' && tabindex === '0') {
                button.parentElement.parentElement.remove();
            }
        });
    }

    // Function to remove elements by class name
    function removeElementsByClassName(className) {
        var elements = document.getElementsByClassName(className);
        for (var i = elements.length - 1; i >= 0; i--) {
            elements[i].remove();
        }
    }

    // Function to remove the Edit Avatar button
    function removeEditAvatarButton() {
        var editAvatarDiv = document.querySelector('div.profile-header_actions__SXInb');
        if (editAvatarDiv) {
            editAvatarDiv.remove();
        }
    }

    // Callback function to be executed when mutations are observed
    function mutationCallback(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // New elements have been added, attempt to remove them
                removeElementsByClassName('promo-deal-button_root__GX98M');
                removeShopButton();
                removeEditAvatarButton();
            }
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    var observer = new MutationObserver(mutationCallback);

    // Start observing changes in the entire document
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Initially attempt to remove the elements
    removeShopButton();
    removeElementsByClassName('promo-deal-button_root__GX98M');
    removeEditAvatarButton();

    // Additional code from the first and second snippets
    const coinCountElement = document.querySelector('.coin-count_root__ADyUV');
    if (coinCountElement) {
        removeElement(coinCountElement);
    }

    const avatarElement = document.querySelector('.maprunner-start-page_avatarWrapper__sQsZv');
    if (avatarElement) {
        removeElement(avatarElement);
    }

    const backgroundElement = document.querySelector('.maprunner-signed-in-start-page_backgroundWrapper__LOeXW');
    if (backgroundElement) {
        removeElement(backgroundElement);
    }
})();
