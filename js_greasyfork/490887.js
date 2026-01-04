// ==UserScript==
// @name         Steam Search Button for F95Zone (Deprecated)
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Add a button to search Google using the title of the game on F95Zone, to see if it has been released on Steam 
// @author       FunkyJustin
// @match        https://f95zone.to/threads/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490887/Steam%20Search%20Button%20for%20F95Zone%20%28Deprecated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/490887/Steam%20Search%20Button%20for%20F95Zone%20%28Deprecated%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to search Google with the game title on Steam
    function searchSteamForTitle() {
        // Get the game title text
        var gameTitleElement = document.querySelector('h1.p-title-value');
        var gameTitle = gameTitleElement.textContent.trim();

        // Remove elements with the class "label"
        var labels = gameTitleElement.querySelectorAll('.label');
        labels.forEach(function(label) {
            label.remove();
        });

        // Get the modified game title
        var gameTitleForSearch = gameTitleElement.textContent.trim();

        // Remove everything inside square brackets and the brackets themselves for the search query
        gameTitleForSearch = gameTitleForSearch.replace(/\[.*?\]/g, '');

        // Construct the Google search URL
        var searchQuery = encodeURIComponent(gameTitleForSearch + ' site:store.steampowered.com');
        var searchUrl = 'https://www.google.com/search?q=' + searchQuery;

        // Open the search URL in a new tab
        window.open(searchUrl, '_blank');
    }

    // Create and append the search button
    var searchButton = document.createElement('button');
    searchButton.textContent = 'Search Steam';
    searchButton.style.marginLeft = '10px';
    searchButton.addEventListener('click', searchSteamForTitle);
    
    var gameTitleContainer = document.querySelector('div.p-title > h1.p-title-value').parentNode;
    gameTitleContainer.appendChild(searchButton);
})();
