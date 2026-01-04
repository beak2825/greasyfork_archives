// ==UserScript==
// @name        Wawa Downloader
// @namespace   Violentmonkey Scripts
// @match       https://www.wawacity.*/*&id=*
// @grant       none
// @version     0.4
// @author      mctypon
// @description Batch download 1fichier links from Wawa movies, shows and animes sections in a vstream compatible format.
// @icon        https://www.wawacity.tokyo/favicon32.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498606/Wawa%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/498606/Wawa%20Downloader.meta.js
// ==/UserScript==
(function() {
    'use strict';
    /* UI */
    // Download Button
    var downloadButton = document.createElement("button");
    downloadButton.innerHTML = "Download";

    // Download style
    downloadButton.style.position = "fixed";
    downloadButton.style.top = "10px";
    downloadButton.style.right = "10px";
    downloadButton.style.zIndex = "10000";
    downloadButton.style.padding = "8px 16px";
    downloadButton.style.fontSize = "14px";
    downloadButton.style.color = "#fff";
    downloadButton.style.backgroundColor = "#28a745"; // Green color
    downloadButton.style.border = "none";
    downloadButton.style.borderRadius = "5px";
    downloadButton.style.cursor = "pointer";
    downloadButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    downloadButton.style.transition = "background-color 0.3s, box-shadow 0.3s";

    // Hover effect
    downloadButton.addEventListener("mouseover", function() {
        downloadButton.style.backgroundColor = "#218838"; // Darker green color on hover
        downloadButton.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
    });
    downloadButton.addEventListener("mouseout", function() {
        downloadButton.style.backgroundColor = "#28a745";
        downloadButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    });

    document.body.appendChild(downloadButton);

    /* Helpers */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function getLink(button) {
        let link = button.getAttribute('data-href');
        if (link) {
            const afIndex = link.indexOf('&af=');
            if (afIndex !== -1) {
                link = link.substring(0, afIndex);
            }
            return link.replace(/\s+/g, '');
        }
        return null;
    }
    
    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    async function handleButtonClick(button) {
        let link = button.getAttribute('data-href');
        if (link && link.includes('dl-protect')) {
            button.click();
            let wait = Math.floor(Math.random() * 6) + 5;
            await sleep(wait * 1000);
        }
    }
   
    /* Main */
    async function clickLinks() {
        const table = document.getElementById('DDLLinks');
        if (!table) {
            console.error('Table with id "DDLLinks" not found.');
            return;
        }
    
        const titleSpan = document.querySelector('h1.wa-block-title > span:nth-child(1)');
        if (!titleSpan) {
            console.error('Title span not found.');
            return;
        }
    
        const titleText = titleSpan.textContent.trim();
        const [category, fullTitle] = titleText.split(' » ');
        const type = category.toLowerCase() === 'animés' ? 'anime' : category.toLowerCase() === 'films' ? 'film' : 'serie';
    
        if (type === "film") {
            const title = fullTitle.split('[')[0].trim();
            let linkRows = table.querySelectorAll("tr");
    
            for (const linkRow of linkRows) {
                if (linkRow.textContent.trim().includes("1fichier")) {
                    const movieTd = linkRow.querySelector('td:first-child');
                    let button = movieTd.querySelector('button');
    
                    await handleButtonClick(button);
    
                    button = movieTd.querySelector('button.btn-copy-clipboard');
                    const link = getLink(button);
    
                    if (link) {
                        const output = `CAT;TITLE;SAISON;URLS\n${type};${title};;"${link}"`;
                        console.log(output);
                        downloadFile(`${title}.txt`, output);
                    }
                }
            }
        } else {
            const title = fullTitle.split(' - ')[0].trim();
            const startIndex = parseInt(prompt("Enter the episode number to start from:"), 10);
            if (isNaN(startIndex) || startIndex < 1) {
                console.error('Invalid start index.');
                return;
            }
            const seasonElement = document.querySelector('.detail-list > li:nth-child(3) > b:nth-child(2)');
            const season = seasonElement ? seasonElement.textContent.trim() : 'Unknown';
            const episodeRows = table.querySelectorAll('tbody > tr.title.episode-title');
    
            let episodeLinks = [];
            let linkRows = table.querySelectorAll("tr");
            for (const linkRow of linkRows) {
                if (linkRow.textContent.trim().includes("1fichier")) {
                    const episodeLink = linkRow.querySelector('td:first-child');
                    episodeLinks.push(episodeLink);
                }
            }
    
            for (let i = startIndex - 1; i < episodeLinks.length; i++) {
                const episodeRow = episodeRows[i];
                if (episodeRow.getAttribute("class").includes("active")) {
                    episodeRow.click();
                    await sleep(200);
                }
                let button = episodeLinks[i].querySelector('button');
                if (button) {
                    await handleButtonClick(button);
                }
            }
    
            let links = {};
            let index = 1;
            for (const episodeLink of episodeLinks) {
                const button = episodeLink.querySelector(".btn-copy-clipboard");
                if(button){
                    const link = getLink(button);
                    if (link) {
                        links[index++] = link;
                    } else {
                        index++;
                    }
                }else{
                    index++;
                }
            }
    
            const formattedLinks = JSON.stringify(links);
            const output = `CAT;TITLE;SAISON;URLS\n${type};${title};${season};${formattedLinks}`;
            console.log(output);
    
            downloadFile(`${title} S${season}.txt`, output);
        }
    }
    
    // Event listeners
    downloadButton.addEventListener("click", clickLinks);
})();