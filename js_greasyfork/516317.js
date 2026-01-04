// ==UserScript==
// @name         print-kids PDF Link Copier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Aggregates all PDF file links on the current page and adds a single copy button to copy them all
// @author       You
// @match        *://*.print-kids.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516317/print-kids%20PDF%20Link%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/516317/print-kids%20PDF%20Link%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container to hold the PDF links and the copy button
    var container = document.createElement('div');
    container.id = 'pdf-link-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.backgroundColor = '#fff';
    container.style.border = '1px solid #ccc';
    container.style.padding = '10px';
    container.style.zIndex = '1000';
    container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';

    // Create a textarea to hold the PDF links
    var textarea = document.createElement('textarea');
    textarea.id = 'pdf-links-textarea';
    textarea.rows = 5;
    textarea.cols = 40;
    textarea.style.width = '100%';
    textarea.style.height = 'auto';
    textarea.style.resize = 'none';
    textarea.readOnly = true; // Make the textarea read-only

    // Create a copy button
    var copyButton = document.createElement('button');
    copyButton.textContent = '复制所有PDF链接';
    copyButton.style.marginTop = '10px';
    copyButton.style.padding = '5px 10px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.backgroundColor = '#007BFF';
    copyButton.style.color = '#fff';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '3px';

    // Add click event listener to the copy button
    copyButton.addEventListener('click', function() {
        // Get the text content of the textarea
        var linksText = textarea.value;

        // Copy the text to the clipboard
        navigator.clipboard.writeText(linksText).then(function() {
            alert('所有PDF链接已复制到剪贴板！');
        }).catch(function(err) {
            alert('复制失败: ' + err);
        });
    });

    // Append the textarea and copy button to the container
    container.appendChild(textarea);
    container.appendChild(copyButton);

    // Wait for the DOM to fully load
    window.addEventListener('load', function() {
        // Select all anchor elements with href ending in '.pdf'
        var pdfLinks = document.querySelectorAll('a[href$=".pdf"]');

        // Collect the PDF links into an array
        var pdfLinksArray = [];
        pdfLinks.forEach(function(link) {
            pdfLinksArray.push(link.href);
        });

        // Join the PDF links with newlines and set the textarea value
        textarea.value = pdfLinksArray.join('\n');

        // Append the container to the body (or any other suitable element)
        document.body.appendChild(container);
    });
})();