// ==UserScript==
// @name         DMOJ Question Copier
// @version      1.1
// @author       Badbird5907
// @source       https://gist.github.com/Badbird5907/7fd28dcda1c92d5393863743b23d26db
// @namespace    badbird.dev
// @license      MIT
// @description  Adds a button to copy the current question to the clipboard on DMOJ problem pages.
// @match        https://dmoj.ca/problem/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/460265/DMOJ%20Question%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/460265/DMOJ%20Question%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ids and classes listed here are excluded
    var blacklistedIds = []
    var blacklistedClassNames = ['copy-clipboard']

    // Create the button element
    var button = document.createElement('button');
    button.textContent = 'Copy Question';
    button.style.marginLeft = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '5px 10px';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';

    // Add the button to the page
    var buttonContainer = document.querySelector('.problem-title');
    buttonContainer.appendChild(button);

    // Add a click event listener to the button
    button.addEventListener('click', function() {
        // Get the question data
        var questionData = '';
        var contentBodyParent = document.getElementsByClassName("content-description")[0];
        var contentBody = contentBodyParent.querySelector('div');
        var allElements = contentBody.querySelectorAll('*');
        for (var i = 0; i < allElements.length; i++) {
            var element = allElements[i];
            if (blacklistedIds.includes(element.id) || blacklistedClassNames.includes(element.className)) {
                i += element.querySelectorAll('*').length; // skip this element and all of its children
                continue;
            }
            if (element.children.length && !element.textContent.trim()) {
                // if the element has children but no text, skip it
                continue;
            }
            if (element.children.length) {
                // if the element has children, append its own text and skip its children
                questionData += element.innerText.trim() + '\n';
                i += element.querySelectorAll('*').length; // skip children
                continue;
            }
            questionData += element.innerText.trim() + '\n';
        }

        // Copy the question data to the clipboard
        GM_setClipboard(questionData, 'text');
        // Change the button text to indicate success
        button.textContent = 'Copied!';
        setTimeout(function() {
            button.textContent = 'Copy Question';
        }, 1000);
    });
})();
