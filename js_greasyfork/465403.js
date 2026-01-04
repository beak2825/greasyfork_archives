// ==UserScript==
// @name         GitHub Docker Image Tag Copy Button
// @description  Adds a "copy" icon next to each Docker image tag on GitHub pages that list published Docker images.
// @version      2
// @match        https://github.com/*
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// @license      MIT
// @author       Howard D. Lince III
// @supportURL   https://twitter.com/HowardL3
// @namespace    https://github.com/howard3
// @downloadURL https://update.greasyfork.org/scripts/465403/GitHub%20Docker%20Image%20Tag%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/465403/GitHub%20Docker%20Image%20Tag%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCopyButton(tagEl) {
        // Create a "copy" button with an icon
        const copyBtn = document.createElement('button');
        copyBtn.classList.add('btn', 'btn-sm');
        copyBtn.style.marginRight = '10px';
        copyBtn.style.cursor = 'pointer';

        const copyIcon = document.createElement('i');
        copyIcon.classList.add('fas', 'fa-copy');
        copyIcon.style.marginRight = '5px';

        // Add the icon to the button
        copyBtn.appendChild(copyIcon);

        // Add a click event listener to copy the tag text to the clipboard
        copyBtn.addEventListener('click', () => {
            GM_setClipboard(tagEl.textContent.trim());
        });

        // Insert the "copy" button next to the Docker image tag
        tagEl.parentNode.insertBefore(copyBtn, tagEl.nextSibling);
    }

    function addCopyButtons(node) {
        // Find all elements that contain Docker image tags with links
        const tagEls = node.querySelectorAll('.Box-row a.Label');

        if (tagEls.length > 0) {
            // Loop through each Docker image tag element and add a "copy" button with an icon
            tagEls.forEach(addCopyButton);
        }
    }

    // Add copy buttons when the page first loads
    addCopyButtons(document);

    // Watch for changes to the DOM using a MutationObserver
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const addedNode of mutation.addedNodes) {
                    // Query the added node for Docker image tags with links and add copy buttons to them
                    addCopyButtons(addedNode);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
