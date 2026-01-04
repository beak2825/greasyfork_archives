// ==UserScript==
// @name         arXiv to Papers.cool Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to arXiv.org pages to redirect to papers.cool
// @author       Remy X  https://github.com/redreamality
// @match        https://arxiv.org/abs/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512195/arXiv%20to%20Paperscool%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/512195/arXiv%20to%20Paperscool%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    var button = document.createElement('button');
    button.innerHTML = 'Go to Papers.cool';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Append the button to the body
    document.body.appendChild(button);

    // Add click event to the button
    button.addEventListener('click', function() {
        var currentUrl = window.location.href;
        var newUrl = currentUrl.replace('https://arxiv.org/abs/', 'https://papers.cool/arxiv/');
        window.location.href = newUrl;
    });
})();