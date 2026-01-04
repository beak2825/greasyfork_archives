// ==UserScript==
// @name         Gelbooru Favorite Shortcut
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.1
// @description  Adds a keybind shortcut for adding images to favorites on Gelbooru.com
// @author       YourName
// @match        https://gelbooru.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490513/Gelbooru%20Favorite%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/490513/Gelbooru%20Favorite%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the keybind shortcut (you can change this to your preference)
    const shortcutKey = 'f';

    // Function to add an image to favorites
    function addToFavorites() {
        // Identify the anchor element that corresponds to "Add to favorites" and trigger a click event
        const addToFavoritesButton = document.querySelector("a[onclick*='addFav']");
        if (addToFavoritesButton) {
            addToFavoritesButton.click();
        }
    }

    // Listen for keydown events
    document.addEventListener('keydown', function(event) {
        // Check if the pressed key matches the shortcut key and if an input field is not focused
        if (event.key === shortcutKey && document.activeElement.tagName !== 'INPUT') {
            // Prevent default browser behavior for this key
            event.preventDefault();
            // Add the image to favorites
            addToFavorites();
        }
    });
})();