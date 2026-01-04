// ==UserScript==
// @name         arca.live Base64 Decoder and Add Download Link
// @namespace    ar64dec
// @version      0.1
// @description  Decode base64 text and add a download link in a specified format in the article-body class
// @author       Anonymous
// @license      MIT
// @icon         https://arca.live/static/favicon-192.png?t=1bfefb27f768be916f521c0f8ca088160144c7d4
// @match        https://arca.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489941/arcalive%20Base64%20Decoder%20and%20Add%20Download%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/489941/arcalive%20Base64%20Decoder%20and%20Add%20Download%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to decode base64
    function decodeBase64(base64String) {
        return atob(base64String);
    }

    // Function to create line breaks
    function createLineBreaks(num) {
        let lineBreaks = [];
        for (let i = 0; i < num; i++) {
            lineBreaks.push(document.createElement('br'));
        }
        return lineBreaks;
    }

    // Function to add download link
    function addDownloadLink(encodedUrl, parentNode) {
        let decodedUrl = decodeBase64(encodedUrl);

        // Trim the first 8 characters of the encodedUrl
        let trimmedEncodedUrl = encodedUrl.substr(0, 15) + "...";;

        // Create line breaks before and after the download button
        let lineBreaksBefore = createLineBreaks(2);
        let lineBreaksAfter = createLineBreaks(2);

        // Append line breaks before the download button
        lineBreaksBefore.forEach(function(lineBreak) {
            parentNode.appendChild(lineBreak);
        });

        // Create download link
        let downloadLink = document.createElement('a');
        downloadLink.href = decodedUrl;
        downloadLink.target = '_blank';
        downloadLink.innerText = 'Download: ' + trimmedEncodedUrl;
        downloadLink.classList.add('download-button'); // Add class for styling

        // Apply CSS styles
        downloadLink.style.backgroundColor = '#008d59';
        downloadLink.style.border = 'none';
        downloadLink.style.color = '#FFFFFF';
        downloadLink.style.padding = '14px 32px';
        downloadLink.style.textAlign = 'center';
        downloadLink.style.transitionDuration = '0.4s';
        downloadLink.style.margin = '16px 0';
        downloadLink.style.textDecoration = 'none';
        downloadLink.style.fontSize = '18px';
        downloadLink.style.fontWeight = 'bold';
        downloadLink.style.cursor = 'pointer';
        downloadLink.style.borderRadius = '12px';
        downloadLink.style.marginTop = '24px';
        downloadLink.style.whiteSpace = 'nowrap'; // Prevent text wrapping
        // Add hover effect
        downloadLink.style.transition = 'background-color 0.4s';
        downloadLink.style.webkitTransition = 'background-color 0.4s';

        // Add hover style
        downloadLink.addEventListener('mouseenter', function() {
            downloadLink.style.backgroundColor = '#005435';
        });

        // Revert to original style on mouse leave
        downloadLink.addEventListener('mouseleave', function() {
            downloadLink.style.backgroundColor = '#008d59';
        });

        if (encodedUrl.startsWith('aHR0cHM6L')) {
            // Append download link to parent node
            parentNode.appendChild(downloadLink);
        };

        // Append line breaks after the download button
        lineBreaksAfter.forEach(function(lineBreak) {
            parentNode.appendChild(lineBreak);
        });
    }



    // Find all elements with class 'article-body'
    let articleBodies = document.getElementsByClassName('article-body');

    // Iterate through each 'article-body' element
    for (let i = 0; i < articleBodies.length; i++) {
        let articleBody = articleBodies[i];

        // Get text content of 'article-body'
        let textContent = articleBody.textContent;

        // Find base64 strings in text content
        let base64Regex = /([A-Za-z0-9+/]{4}){8,}(?:=+|[!-9,-;=?-~]){0,2}/g;
        let base64Matches = textContent.match(base64Regex);

        // If base64 strings are found, decode and add download link
        if (base64Matches !== null) {
            base64Matches.forEach(function(encodedUrl) {
                addDownloadLink(encodedUrl, articleBody);
            });
        }
    }
})();
