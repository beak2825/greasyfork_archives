// ==UserScript==
// @name         Shahid Series Downloader with JSON Export
// @namespace    https://greasyfork.org/en/scripts/520694-shahid-series-downloader-with-json-export
// @version      1.8
// @description  Add a button to download episodes' details from Shahid series page as JSON without links.
// @author       Your Name
// @match        https://shahid.mbc.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520694/Shahid%20Series%20Downloader%20with%20JSON%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/520694/Shahid%20Series%20Downloader%20with%20JSON%20Export.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to scrape episode data
    function scrapeEpisodes() {
        const episodes = [];
        const items = document.querySelectorAll('.carousel-item a[href*="/player/episodes"]');

        items.forEach(item => {
            const titleElement = item.querySelector('.font-shahidBold');
            const descriptionDetailElement = item.parentElement.querySelector('h3.text-light-blue-1'); // للوصف التفصيلي
            const descriptionGeneralElement = item.parentElement.querySelector('h3.text-white'); // للوصف العام

            // اختيار الوصف التفصيلي إن وُجد، وإلا استخدام الوصف العام
            const description = descriptionDetailElement
                ? descriptionDetailElement.textContent.trim()
                : descriptionGeneralElement
                ? descriptionGeneralElement.textContent.trim()
                : 'No description';

            // استخراج رقم الحلقة من العنوان
            const rawTitle = titleElement ? titleElement.textContent.trim() : 'No title';
            const episodeNumberMatch = rawTitle.match(/\d+/);
            const episodeNumber = episodeNumberMatch ? episodeNumberMatch[0] : 'Unknown';

            // استخراج عنوان الحلقة وإزالة الرقم منه
            const episodeTitle = rawTitle.replace(/الحلقة\s*\d+/i, '').trim();
            const finalEpisodeTitle = episodeTitle
                ? `الحلقة ${episodeNumber} - ${episodeTitle}`
                : `الحلقة ${episodeNumber}`;

            const episode = {
                episodeNumber: episodeNumber,
                episodeTitle: finalEpisodeTitle,
                description: description
            };
            episodes.push(episode);
        });

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

        popup.document.write('</body></html>');
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

    // Create and add a button to the page
    function addDownloadButton() {
        const button = document.createElement('button');
        button.textContent = 'إتمام التحميل';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '10px';
        button.style.zIndex = '10000';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#0c9';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '16px';
        button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';

        button.addEventListener('click', () => {
            const episodes = scrapeEpisodes();
            displayEpisodes(episodes);
        });

        document.body.appendChild(button);
    }

    // Add the button once the page is loaded
    window.addEventListener('load', () => {
        addDownloadButton();
    });
})();
