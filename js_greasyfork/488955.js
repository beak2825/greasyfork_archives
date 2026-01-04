// ==UserScript==
// @name         亚马逊Asin导出
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add a button to the page; clicking it extracts all ASIN values, combines them with Amazon product URL, displays for easy copying, and auto-closes the display on copy.
// @author       You
// @match        https://www.amazon.com/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.co.uk/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/488955/%E4%BA%9A%E9%A9%AC%E9%80%8AAsin%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/488955/%E4%BA%9A%E9%A9%AC%E9%80%8AAsin%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the display element for Amazon product links, ASIN count, and additional functionalities
    function createDisplayElement(asinLinks) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.padding = '10px';
        container.style.backgroundColor = 'white';
        container.style.border = '1px solid black';
        container.style.zIndex = '10000';
        container.style.overflow = 'auto';
        container.style.maxHeight = '90vh';

        // Display the count of ASINs found
        const countDisplay = document.createElement('p');
        countDisplay.textContent = `ASINs found: ${asinLinks.length}`;
        container.appendChild(countDisplay);

        const textArea = document.createElement('textarea');
        textArea.value = asinLinks.join('\n');
        textArea.rows = '20';
        textArea.cols = '50';
        textArea.style.marginTop = '10px';

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy to Clipboard';
        copyButton.onclick = function() {
            textArea.select();
            document.execCommand('copy');
            // Do not remove the container after copying
        };

        const openButton = document.createElement('button');
        openButton.textContent = 'Open All Links';
        openButton.onclick = function() {
            asinLinks.forEach(link => window.open(link, '_blank'));
            // Do not remove the container after opening all links
        };

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Data';
        clearButton.onclick = function() {
            localStorage.removeItem('asinLinks'); // Clears the saved ASIN data
            // Do not remove the container after clearing the data, just update the displayed text
            textArea.value = '';
            countDisplay.textContent = 'ASINs found: 0';
        };

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close Window';
        closeButton.onclick = function() {
            container.remove(); // Closes the container
        };

        container.appendChild(textArea);
        container.appendChild(copyButton);
        container.appendChild(openButton); // Add the open all links button to the container
        container.appendChild(clearButton); // Add the clear data button to the container
        container.appendChild(closeButton); // Add the close window button to the container
        document.body.appendChild(container);
    }

    // Function to extract ASIN values, generate Amazon product links, and support pagination
    function generateAmazonLinks() {
        const targetElements = document.querySelectorAll('[data-asin]');
        const asinLinks = JSON.parse(localStorage.getItem('asinLinks') || '[]');

        targetElements.forEach(element => {
            const asin = element.getAttribute('data-asin');
            if (asin && !asinLinks.includes(`https://www.amazon.com/gp/product/${asin}`)) {
                asinLinks.push(`https://www.amazon.com/gp/product/${asin}`);
            }
        });

        localStorage.setItem('asinLinks', JSON.stringify(asinLinks));

        if (asinLinks.length > 0) {
            createDisplayElement(asinLinks);
        }
    }

    // Function to create the button that will trigger the generation of Amazon links
    function createExtractionButton() {
        const button = document.createElement('button');
        button.textContent = 'Generate Amazon Links';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';

        button.onclick = generateAmazonLinks;

        document.body.appendChild(button);
    }

    // Add the button to the page
    createExtractionButton();
})();
