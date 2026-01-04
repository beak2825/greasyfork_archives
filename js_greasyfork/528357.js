
// ==UserScript==
// @name         Letterboxd to The Pirate Bay and ASSRT Search
// @match        https://letterboxd.com/film/*
// @grant        none
// @version      1.1
// @author       You (modified by AI)
// @description  Adds buttons to Letterboxd film pages to search for the film on The Pirate Bay and ASSRT.
// @namespace https://greasyfork.org/users/971939
// @downloadURL https://update.greasyfork.org/scripts/528357/Letterboxd%20to%20The%20Pirate%20Bay%20and%20ASSRT%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/528357/Letterboxd%20to%20The%20Pirate%20Bay%20and%20ASSRT%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const filmTitleElement = document.querySelector('h1.headline-1');
    if (!filmTitleElement) {
        return;
    }
    const filmTitle = filmTitleElement.textContent.trim();

    // --- Pirate Bay Search Button ---
    function createSearchButton(text, url, color) {
        const searchButton = document.createElement('a');
        searchButton.textContent = text;
        searchButton.style.backgroundColor = color;
        searchButton.style.color = 'white';
        searchButton.style.padding = '5px 10px';
        searchButton.style.marginLeft = '10px';
        searchButton.style.borderRadius = '5px';
        searchButton.style.textDecoration = 'none';
        searchButton.style.fontWeight = 'bold';
        searchButton.href = url;
        searchButton.target = '_blank';
        return searchButton;
    }

    const tpbButton = createSearchButton(
        'Search on TPB',
        `https://thepiratebay.org/search.php?q=${encodeURIComponent(filmTitle)}&all=on&search=Pirate+Search&page=0&orderby=`,
        'green'
    );


    // --- ASSRT Search Button ---
    const assrtButton = createSearchButton(
        'Search on ASSRT',
        `https://secure.assrt.net/sub/?searchword=${encodeURIComponent(filmTitle)}`,
        'blue'  // Different color for ASSRT
    );


    // --- Add Buttons to Page ---
    // Insert after the title, or next to "Watch film" button if it exists.
    const insertionPoint = document.querySelector(".film-watch-links") || filmTitleElement;
    const parent = insertionPoint.parentNode;

    if (insertionPoint === filmTitleElement) {
        parent.insertBefore(tpbButton, filmTitleElement.nextSibling);
        parent.insertBefore(assrtButton, tpbButton.nextSibling); // Insert ASSRT button after TPB
    } else {
        parent.insertBefore(tpbButton, insertionPoint.nextSibling);
        parent.insertBefore(assrtButton, tpbButton.nextSibling);
    }

})();
