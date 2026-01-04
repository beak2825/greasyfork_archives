// ==UserScript==
// @name         Melee Auto-Download Printouts
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automatically downloads the raw HTML of the Melee multi-print pages.
// @author       Dan Collins <dcollins@batwing.tech>
// @website      https://github.com/dcollinsn/melee-tampermonkey
// @match        https://melee.gg/Tournament/MultiPrint/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mtgmelee.com
// @grant        GM_xmlhttpRequest
// @connect      self
// @downloadURL https://update.greasyfork.org/scripts/514777/Melee%20Auto-Download%20Printouts.user.js
// @updateURL https://update.greasyfork.org/scripts/514777/Melee%20Auto-Download%20Printouts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to sanitize the filename by removing invalid characters
    function sanitizeFilename(filename) {
        // Replace invalid characters with underscores
        return filename.replace(/[\s\\/:*?"<>|]/g, '_');
    }

    // Function to inline any stylesheets
    async function inlineCSS(htmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const asyncQueries = [];

        // For each stylesheet
        const stylesheets = doc.querySelectorAll('link[rel="stylesheet"]');
        stylesheets.forEach((linkElement) => {
            const href = linkElement.href;

            // Get the stylesheet
            const query = new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: href,
                    onload: function(response) {
                        if (response.status == 200) {
                            // Insert it in place of the link
                            const styleElement = doc.createElement('style');
                            styleElement.type = 'text/css';
                            styleElement.textContent = response.responseText;
                            // Callback closes over linkelement from the parent foreach
                            linkElement.parentNode.replaceChild(styleElement, linkElement);
                        } else {
                            console.warn('Failed to fetch CSS from:', href);
                        }
                        resolve();
                    },
                    onerror: function() {
                        console.error('Error fetching CSS from:', href);
                        resolve();
                    }
                });
            });

            asyncQueries.push(query);
        });

        // Wait for annoying async things
        await Promise.all(asyncQueries);

        // Return the text of the file we want to download
        return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
    }

    // Main function to execute the download
    async function downloadPageWithInlinedCSS() {
        // Find the name of the printout. This is the title of the first
        // page of the download, which may not be super accurate for
        // multi-print setups, but it will have at least the event name and
        // hopefully the round number.
        const tdElement = document.querySelector('td.tournament-name-label');

        let tournamentName = tdElement.textContent.trim();
        tournamentName = sanitizeFilename(tournamentName);
        const filename = `${tournamentName}.html`;

        // Get the raw HTML content of the page
        const htmlContent = document.documentElement.outerHTML;

        // Inline CSS into the HTML content
        const htmlWithInlinedCSS = await inlineCSS(htmlContent);

        // Create a Blob from the HTML content
        const blob = new Blob([htmlWithInlinedCSS], { type: 'text/html' });

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;

        // Set the download attribute with the filename
        link.download = filename;

        // Create and click a link to execute the attachment download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Execute the main function
    downloadPageWithInlinedCSS();
})();
