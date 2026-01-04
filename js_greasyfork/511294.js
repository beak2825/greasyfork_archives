// ==UserScript==
// @name         Virtupets Lookup
// @namespace    https://greasyfork.org/en/users/1376035-geezaac
// @version      v1.1
// @description  Appends Virtupets.net lookup option to search helper icons
// @author       Isaac
// @match        https://grundos.cafe/*
// @match        https://www.grundos.cafe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511294/Virtupets%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/511294/Virtupets%20Lookup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get all divs with the class 'searchhelp'
    var divs = document.querySelectorAll('.searchhelp');

    divs.forEach(function(div) {
        // Get the item name from the div's ID
        // Assuming the ID is in the format 'Item-links'
        var id = div.id;
        var itemName = id.substring(0, id.length-6); // Remove '-links' to get the item name

        // Now create the new <a> and <img> elements
        var a = document.createElement('a');
        a.href = 'https://virtupets.net/search?q=' + itemName; // Customize the link using the item name
        a.target = '_blank'; // Optional: open link in a new tab

        // Create a new <img> element
        var img = document.createElement('img');
        img.src = 'https://virtupets.net/assets/images/vp.png'; // Set the image source
        img.alt = 'Search Virtupets'; // Set the alt text
        img.className = 'search-helper-virtupets'; // Set a class if needed
        img.title = 'Virtupets Search'; // Set the title attribute for the image

        // Append the <img> to the <a> element
        a.appendChild(img);

        // Append the <a> element to the div
        div.appendChild(a);
    });
})();