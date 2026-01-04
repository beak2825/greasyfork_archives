// ==UserScript==
// @name        Generate Table of Contents for ar5iv
// @namespace   awyugan
// @description Generates a table of contents for ar5iv papers, displayed on the left side of the page.
// @match    https://ar5iv.labs.arxiv.org/*
// @license MIT
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/469405/Generate%20Table%20of%20Contents%20for%20ar5iv.user.js
// @updateURL https://update.greasyfork.org/scripts/469405/Generate%20Table%20of%20Contents%20for%20ar5iv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a div for the table of contents
    var tocDiv = document.createElement('div');
    tocDiv.style.position = 'fixed';
    tocDiv.style.left = '0';
    tocDiv.style.top = '0';
    tocDiv.style.border = '1px solid black';
    tocDiv.style.padding = '10px';
    tocDiv.style.backgroundColor = '#f9f9f9';
    tocDiv.style.width = '200px';
    tocDiv.style.height = '100vh';
    tocDiv.style.overflow = 'auto';

    // Create a title for the table of contents
    var tocTitle = document.createElement('h2');
    tocTitle.textContent = 'Table of Contents';
    tocDiv.appendChild(tocTitle);

    // Get all h1, h2, h3, h4, h5 and h6 elements
    var headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    // Create a link for each heading and add it to the table of contents
    headings.forEach(function(heading, index) {
        var link = document.createElement('a');
        link.textContent = heading.textContent;
        link.href = '#heading' + index;

        // Add an id to the heading so the link can refer to it
        heading.id = 'heading' + index;

        // Adjust link style based on heading level
        var headingLevel = parseInt(heading.tagName[1]);
        link.style.display = 'block';
        link.style.textIndent = (headingLevel - 1) * 10 + 'px';
        link.style.fontSize = (7 - headingLevel) + 'pt';

        tocDiv.appendChild(link);
    });

    // Add the table of contents to the body
    document.body.appendChild(tocDiv);
})();
