// ==UserScript==
// @name         YouTube Chapters to JSON
// @version      1.4
// @description  Extract YouTube video chapters as JSON with manual trigger and download option, button placed under video, and dynamic file name with spaces replaced by underscores.
// @author       Mazen Tamer
// @match        https://www.youtube.com/watch*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1408089
// @downloadURL https://update.greasyfork.org/scripts/520103/YouTube%20Chapters%20to%20JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/520103/YouTube%20Chapters%20to%20JSON.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to parse timestamp into milliseconds
    function parseTimestamp(timeString) {
        const parts = timeString.split(':').reverse();
        let milliseconds = 0;
        if (parts[0]) milliseconds += parseInt(parts[0], 10) * 1000; // Seconds
        if (parts[1]) milliseconds += parseInt(parts[1], 10) * 60 * 1000; // Minutes
        if (parts[2]) milliseconds += parseInt(parts[2], 10) * 60 * 60 * 1000; // Hours
        return milliseconds;
    }

    // Function to extract chapters and return as JSON
    function extractChapters() {
        const chapters = [];
        const chapterElements = document.querySelectorAll('ytd-macro-markers-list-item-renderer');

        chapterElements.forEach(chapter => {
            const titleElement = chapter.querySelector('h4.macro-markers');
            const timeElement = chapter.querySelector('div#time');

            if (titleElement && timeElement) {
                const title = titleElement.title;
                const timestamp = parseTimestamp(timeElement.textContent.trim());

                // Check if the chapter already exists
                const existingChapter = chapters.find(ch => ch.timestamp === timestamp && ch.title === title);
                if (!existingChapter) {
                    chapters.push({ title, timestamp });
                }
            }
        });

        return chapters;
    }

    // Function to download the chapters JSON as a file
    function downloadJSON(chapters) {
        const json = JSON.stringify(chapters, null, 2);

        // Get the video title from the page and use it as the filename
        const videoTitle = document.title.replace(' - YouTube', '').replace(/[\/:*?"<>|]/g, '').replace(/\s+/g, '_'); // Replace spaces with underscores
        const filename = `${videoTitle}-chapters.json`;

        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    // Function to add the button directly under the video player
    function addButton() {
        const controlsContainer = document.querySelector('ytd-player');
        if (controlsContainer) {
            // Create the button
            const button = document.createElement('button');
            button.textContent = 'Extract Chapters & Download JSON';
            button.style.position = 'absolute';
            button.style.left = '50%';
            button.style.transform = 'translateX(-50%)';
            button.style.marginTop = '10px';
            button.style.padding = '10px';
            button.style.backgroundColor = '#FF0000';
            button.style.color = '#FFF';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.zIndex = 1000;

            // Add event listener to extract chapters and download JSON on click
            button.addEventListener('click', () => {
                const chapters = extractChapters();
                if (chapters.length > 0) {
                    downloadJSON(chapters);
                } else {
                    alert('No chapters found!');
                }
            });

            // Append the button below the video controls
            controlsContainer.appendChild(button);
        }
    }

    // Wait for YouTube page to load and then add the button
    window.addEventListener('load', () => {
        setTimeout(addButton, 3000);  // Wait a bit for the video page elements to load
    });
})();