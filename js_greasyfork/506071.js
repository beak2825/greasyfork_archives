// ==UserScript==
// @name         Website Design Customizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Customize the look of websites for yourself only
// @author       You
// @match        https://www.google.com/

// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506071/Website%20Design%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/506071/Website%20Design%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change the background color
    document.body.style.backgroundColor = "#f34f29f1";  // Light gray background

    // Change the font and size of all headings (h1, h2, h3, etc.)
    let headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(function(heading) {
        heading.style.fontFamily = 'Arial, sans-serif';  // Change the font
        heading.style.color = '#333';  // Change the color to dark gray
        heading.style.fontSize = '1.6em';  // Increase the font size
    });

    // Style all paragraph text
    let paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(function(paragraph) {
        paragraph.style.lineHeight = '1.6';  // Improve readability by increasing line height
        paragraph.style.fontSize = '16px';  // Set font size
        paragraph.style.color = '#444';  // Set font color to dark gray
    });

    // Customize links
    let links = document.querySelectorAll('a');
    links.forEach(function(link) {
        link.style.color = '#0073e6';  // Change link color to a blue shade
        link.style.textDecoration = 'none';  // Remove underlines from links
    });

    // Modify buttons
    let buttons = document.querySelectorAll('button');
    buttons.forEach(function(button) {
        button.style.backgroundColor = '#0073e6';  // Set background color
        button.style.color = '#fff';  // Set text color to white
        button.style.border = 'none';  // Remove borders
        button.style.padding = '10px 20px';  // Add padding
        button.style.borderRadius = '5px';  // Round the corners
        button.style.cursor = 'pointer';  // Make buttons look clickable
    });

    console.log("Custom styles applied!");

})();
