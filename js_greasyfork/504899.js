// ==UserScript==
// @name        downloadArxivPDF
// @namespace   Violentmonkey Scripts
// @match       *://arxiv.org/abs/*
// @grant       none
// @version     1.1
// @author      low_mist
// @description 8/24/2024, 6:08:47 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504899/downloadArxivPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/504899/downloadArxivPDF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract PDF link and title
    function extractData() {
        // Get PDF link
        const pdfLinkElement = document.querySelector("a[href*='/pdf/']");
        if (!pdfLinkElement) {
            console.error("PDF download link not found");
            return null;
        }
        const pdfLink = pdfLinkElement.getAttribute("href");

        // Get title
        const titleElement = document.querySelector("h1.title.mathjax");
        if (!titleElement) {
            console.error("Title element not found");
            return null;
        }
        titleElement.textContent = titleElement.textContent.replace(/^[^:]*:/, " ");
        const title = titleElement.textContent.trim().replace(/[^a-zA-Z0-9]+/g, " "); // Sanitize title

        return { pdfLink, title };
    }

    // Function to create and add the download button
    function addDownloadButton() {
        // Create button
        const button = document.createElement('button');
        button.textContent = 'Download PDF';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';

        // Add event listener to the button
        button.addEventListener('click', () => {
            const data = extractData();
            if (data) {
                const url = `https://arxiv.org${data.pdfLink}`;
                const filename = `${data.title}.pdf`;

                // Create a link element and trigger the download
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });

        // Add button to the page
        document.body.appendChild(button);
    }

    // Run the function to add the download button
    addDownloadButton();
})();