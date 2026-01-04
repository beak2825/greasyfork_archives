// ==UserScript==
// @name         Geoguessr UI Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove specified elements from Geoguessr.com
// @author       FacelessDev
// @match        https://www.geoguessr.com/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @downloadURL https://update.greasyfork.org/scripts/485417/Geoguessr%20UI%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/485417/Geoguessr%20UI%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the canvas element
    function removeCanvas() {
        var canvasElement = document.querySelector('canvas[data-engine="three.js r158"]');
        if (canvasElement) {
            canvasElement.remove();
        }
    }

    // Function to remove the button element
    function removeButton() {
        var buttonElement = document.querySelector('button.button_button__CnARx');
        if (buttonElement) {
            buttonElement.remove();
        }
    }

    // Function to remove the specified div element
    function removeAvatarDiv() {
        var avatarDiv = document.querySelector('div.maprunner-signed-in-start-page_avatar__gAHLT');
        if (avatarDiv) {
            avatarDiv.remove();
        }
    }

    // Function to remove the specified promo-deal button



    // Function to remove the specified coin count div
    function removeCoinCount() {
        var coinCountDiv = document.querySelector('div.coin-count_root__ADyUV');
        if (coinCountDiv) {
            coinCountDiv.remove();
        }
    }

    // Use MutationObserver to detect changes in the DOM
    var observer = new MutationObserver(function() {
        removeCanvas();
        removeButton();
        removeAvatarDiv();
        removeCoinCount();
    });

    // Configure the observer to watch for changes in the subtree
    var observerConfig = { childList: true, subtree: true };

    // Start observing the target node for configured mutations
    observer.observe(document.body, observerConfig);

    // If the document is already loaded, remove the elements immediately
    removeCanvas();
    removeButton();
    removeAvatarDiv();

    removeCoinCount();
})();
