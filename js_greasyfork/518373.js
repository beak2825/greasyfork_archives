// ==UserScript==
// @name         Crunchyroll Arabic Episode Titles and Descriptions Extractor
// @namespace    https://greasyfork.org/en/scripts/518373-crunchyroll-arabic-episode-titles-and-descriptions-extractor
// @version      1.9
// @description  Extract titles, episode numbers, and descriptions of all episodes on Crunchyroll and save them as JSON
// @author       Abu3safeer
// @match        https://www.crunchyroll.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518373/Crunchyroll%20Arabic%20Episode%20Titles%20and%20Descriptions%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/518373/Crunchyroll%20Arabic%20Episode%20Titles%20and%20Descriptions%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to download data as JSON file
    function downloadJSON(data, filename) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", filename);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    // Function to extract titles, episode numbers, and descriptions
    function extractEpisodeInfo() {
        const episodes = [];
        const elements = document.querySelectorAll('div[class*="playable-card-hover__body"]');

        elements.forEach(element => {
            const titleElement = element.querySelector('h3[data-t="episode-title"]');
            const descriptionElement = element.querySelector('p[data-t="description"]');

            if (titleElement && descriptionElement) {
                const titleText = titleElement.textContent.trim();
                const titleMatch = titleText.match(/ح(\d+)\s*-\s*(.*)/);
                if (titleMatch) {
                    const episodeNumber = titleMatch[1];
                    const episodeTitle = titleMatch[2];
                    const description = descriptionElement.textContent.trim();
                    episodes.push({ episodeNumber, episodeTitle, description });
                }
            }
        });

        console.log('Episodes:', episodes);
        displayEpisodes(episodes); // Display episodes in a popup
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

    // Function to create and add the button to the page
    function createButton() {
        const button = document.createElement('button');
        button.id = 'episodeInfoButton'; // Add an ID to identify the button later
        button.innerHTML = 'Get Episodes Info';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', extractEpisodeInfo);
        document.body.appendChild(button);
    }

    // Observe the DOM for changes and ensure the button is present
    function ensureButtonPresence() {
        if (!document.getElementById('episodeInfoButton')) {
            createButton();
        }
    }

    // Add the button to the page when it loads
    window.addEventListener('load', createButton);

    // Observe DOM changes to re-add the button if it gets removed
    const observer = new MutationObserver(ensureButtonPresence);
    observer.observe(document.body, { childList: true, subtree: true });
})();
