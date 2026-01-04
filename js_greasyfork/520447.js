// ==UserScript==
// @name         elcinema Episode title and description Extractor
// @namespace    https://greasyfork.org/en/scripts/520447-elcinema-episode-title-and-description-extractor
// @version      1.9
// @description  Extract episode number, title, and description from elcinema.com and save to file
// @author       Your Name
// @match        https://elcinema.com/work/*/episodes
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520447/elcinema%20Episode%20title%20and%20description%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/520447/elcinema%20Episode%20title%20and%20description%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract episode data
    function extractEpisodeData() {
        const episodeContainers = document.querySelectorAll('.row');
        const episodes = [];

        episodeContainers.forEach((container, index) => {
            const episodeNumberElement = container.querySelector('ul.list-separator > li:nth-child(2)');
            const episodeTitleElement = container.querySelector('h6.text-center');
            const descriptionElement = container.querySelector('div.columns.large-9 > p');
            const nextSiblingElement = container.nextElementSibling; // This should be the button element

            if (episodeNumberElement && episodeTitleElement && descriptionElement && nextSiblingElement && nextSiblingElement.tagName === 'A') {
                const episodeNumber = episodeNumberElement.textContent.match(/#(\d+)/)[1].trim();
                const episodeTitle = episodeTitleElement.textContent.trim();
                const description = descriptionElement.textContent.trim();

                episodes.push({
                    episodeNumber,
                    episodeTitle,
                    description
                });

                // Debugging information for each episode
                console.log(`Episode ${index + 1}:`);
                console.log(`Number: ${episodeNumber}`);
                console.log(`Title: ${episodeTitle}`);
                console.log(`Description: ${description}`);
                console.log(`Details Link: ${nextSiblingElement.href}`); // For matching purposes
            } else {
                console.log(`Episode ${index + 1} is missing data.`);
            }
        });

        // Sort episodes by episode number to ensure correct order
        episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);

        return episodes;
    }

    // Display episodes in a popup
    function displayEpisodes(episodes) {
        const popup = window.open('', '_blank', 'width=800,height=600');
        popup.document.write('<html><head><title>Episodes List</title></head><body>');
        popup.document.write('<h1>Episodes List</h1>');
        popup.document.write('<ul>');

        episodes.forEach(ep => {
            popup.document.write(`
                <li>
                    <h3>${ep.episodeTitle}</h3>
                    <p>${ep.description}</p>
                </li>
                <hr>
            `);
        });

        popup.document.write('</ul>');

        // Add the JSON download button
        popup.document.write(`
            <button id="downloadJson" style="
                padding: 10px 20px;
                background-color: #0c9;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin-top: 20px;
            ">Download as JSON</button>
        `);

        popup.document.close();

        // Add JSON download functionality
        popup.document.getElementById('downloadJson').addEventListener('click', () => {
            const blob = new Blob([JSON.stringify(episodes, null, 2)], { type: 'application/json' });
            const link = popup.document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'episodes_titles.json';
            link.click();
        });
    }

    // Function to save data to a file
    function saveToFile(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Function to create the save button
    function createSaveButton() {
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Episode Data';
        saveButton.style.width = '100%';
        saveButton.style.padding = '10px';
        saveButton.style.margin = '10px 0';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';

        saveButton.addEventListener('click', () => {
            const episodes = extractEpisodeData();
            saveToFile(episodes, 'episodes_titles.json');
            displayEpisodes(episodes); // Display episodes in a popup
        });

        const splitElement = document.querySelector('hr.split');
        if (splitElement) {
            splitElement.parentNode.insertBefore(saveButton, splitElement.nextSibling);
        }
    }

    // Run the function to create the save button when the page loads
    window.addEventListener('load', createSaveButton);
})();
