// ==UserScript==
// @name         BepisDB download counts
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add "Download count" under each entry on the page
// @author       drowned
// @match        https://db.bepis.moe/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475718/BepisDB%20download%20counts.user.js
// @updateURL https://update.greasyfork.org/scripts/475718/BepisDB%20download%20counts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set text color based on the year
    function setColorByYear(year, element) {
        const yearNum = parseInt(year, 10);
        if (yearNum >= 2023) {
            element.style.color = '#7CFC00';
        } else if (yearNum === 2022) {
            element.style.color = '#FFFF00';
        } else if (yearNum === 2021) {
            element.style.color = '#FFA500';
        } else if (yearNum <= 2020) {
            element.style.color = '#FF0000';
        }
    }

    // Select all card blocks on the page
    const cardBlocks = document.querySelectorAll('.card-block');

    // Regular expressions to match "Download count: #" and "Uploaded on: date"
    const downloadCountRegex = /Download count: ([\d,]+)/;
    const uploadedOnRegex = /Uploaded on ([\d/]+) [\d:]+[apmAPM]+/;

    // Iterate over each card block
    cardBlocks.forEach(block => {
        const hoverContainer = block.querySelector('.hover-container');
        if (hoverContainer) {
            const pictureElement = hoverContainer.querySelector('picture');
            if (pictureElement) {
                const titleText = pictureElement.getAttribute('title');
                const downloadCountMatch = titleText.match(downloadCountRegex);
                const uploadedOnMatch = titleText.match(uploadedOnRegex);

                if (downloadCountMatch || uploadedOnMatch) {
                    // Create and append the download count and upload date text
                    const infoElement = document.createElement('div');
                    infoElement.style.position = 'relative';
                    infoElement.style.top = '-10px';  // Adjust this value to position the text closer or farther from the thumbnail

                    const infoTextElement = document.createElement('p');
                    infoTextElement.style.margin = '0';  // Reduce margin to bring text closer
                    infoTextElement.style.backgroundColor = 'black';  // Set background color to black

                    let year = '';
                    if (uploadedOnMatch) {
                        year = uploadedOnMatch[1].split('/')[2];  // Extract the year
                        infoTextElement.textContent += uploadedOnMatch[1];  // Only the date
                    }

                    if (downloadCountMatch) {
                        infoTextElement.textContent += ' - ' + downloadCountMatch[1];  // Only the number
                    }

                    setColorByYear(year, infoTextElement);  // Set color based on the year

                    infoElement.appendChild(infoTextElement);
                    block.appendChild(infoElement);
                }
            }
        }
    });

})();