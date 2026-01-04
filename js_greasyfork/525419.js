// ==UserScript==
// @name         Arxiv HTML Viewer Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a button to view HTML version of Arxiv papers
// @author       Your Name
// @match        https://arxiv.org/abs/*
// @match        https://arxiv.org/pdf/*
// @icon         https://www.w3.org/html/logo/downloads/HTML5_Logo_256.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525419/Arxiv%20HTML%20Viewer%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/525419/Arxiv%20HTML%20Viewer%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a new button element
    const button = document.createElement('button');
    button.textContent = '查看HTML';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.backgroundColor = '#4CAF50'; // Green
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.textAlign = 'center';
    button.style.textDecoration = 'none';
    button.style.display = 'inline-block';
    button.style.fontSize = '16px';
    button.style.margin = '4px 2px';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '12px';

    // Get the current URL and extract the arXiv ID
    const url = window.location.href;
    const arxivIdMatch = url.match(/\/(abs|pdf)\/([0-9]+\.[0-9]+)/);
    if (arxivIdMatch) {
        const arxivId = arxivIdMatch[2];

        // Add click event to the button
        button.onclick = () => {
            window.location.href = `https://ar5iv.labs.arxiv.org/html/${arxivId}`;
        };

        // Append the button to the document body
        document.body.appendChild(button);
    }
})();
