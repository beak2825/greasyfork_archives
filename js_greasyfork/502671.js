// ==UserScript==
// @name         Anna's Archive Download Button for Z-Library
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a download button to Anna's Archive on z-library pages with book takedowns
// @author       You
// @match        *://singlelogin.re/*
// @match        *://singlelogin.rs/*
// @match        *://z-lib.gs/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/502671/Anna%27s%20Archive%20Download%20Button%20for%20Z-Library.user.js
// @updateURL https://update.greasyfork.org/scripts/502671/Anna%27s%20Archive%20Download%20Button%20for%20Z-Library.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Get the text from the h1 element
        var bookTitleElement = document.querySelector('h1[itemprop="name"]');
        if (!bookTitleElement) return;

        var bookTitle = bookTitleElement.textContent.trim();
        var searchUrl = 'https://annas-archive.org/search?q=' + encodeURIComponent(bookTitle);

        // Create the button
        var button = document.createElement('button');
        button.innerText = "Anna's Archive Download";
        button.style.display = 'block';
        button.style.margin = '10px 0';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';

        // Add click event to the button
        button.addEventListener('click', function() {
            window.open(searchUrl, '_blank');
        });

        // Insert the button above the specified box
        var container = document.querySelector('.cBox1.deletedByMessage');
        if (container) {
            container.parentNode.insertBefore(button, container);
        }
    }, false);
})();
