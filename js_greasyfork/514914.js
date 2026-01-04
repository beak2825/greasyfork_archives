// ==UserScript==
// @name         Confrérie des Traducteurs - MO2 Handler
// @namespace    https://discord.gg/sJDzeCZCa3
// @version      1.1
// @description  Allows downloading translations from the Confrérie directly into MO2
// @author       chunchunmaru (alexbdka)
// @icon         https://i.ibb.co/55r0z7m/confrerie-des-traducteurs-small.png
// @match        https://www.confrerie-des-traducteurs.fr/*/mods/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514914/Confr%C3%A9rie%20des%20Traducteurs%20-%20MO2%20Handler.user.js
// @updateURL https://update.greasyfork.org/scripts/514914/Confr%C3%A9rie%20des%20Traducteurs%20-%20MO2%20Handler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the game category and initialize game ID and download URL
    const gameCategory = window.location.pathname.split('/')[1];
    let gameId = null;
    let downloadUrl = null;

    /**
     * Determine game ID and download URL based on game category
     */
    function setupGameDownloadInfo() {
        const gameMappings = {
            'skyrim': {
                gameId: 'skyrimse',
                selector: "body > section > main > div > div > div > div:nth-of-type(3) > a"
            },
            'oblivion': {
                gameId: 'oblivion',
                selector: "body > section > main > section:nth-of-type(2) > div:nth-of-type(3) > a"
            },
            'morrowind': {
                gameId: 'morrowind',
                selector: "body > section > main > section:nth-of-type(2) > div:nth-of-type(3) > a"
            },
            'fallout-new-vegas': {
                gameId: 'falloutnv',
                selector: "body > section > main > section:nth-of-type(2) > div:nth-of-type(3) > a"
            },
            'fallout3': {
                gameId: 'fallout4',
                selector: "body > section > main > section:nth-of-type(2) > div:nth-of-type(3) > a"
            },
            'fallout4': {
                gameId: 'fallout4',
                selector: "body > section > main > section:nth-of-type(2) > div:nth-of-type(3) > a"
            }
        };

        for (const [category, config] of Object.entries(gameMappings)) {
            if (gameCategory.includes(category)) {
                gameId = config.gameId;
                const linkElement = document.querySelector(config.selector);
                downloadUrl = linkElement ? linkElement.href : null;
                console.log("[INFO] game ID : ", gameId);
                console.log("[INFO] download URL : ", downloadUrl);
                return;
            }
        }

        console.log("[ERROR] Unsupported game");
    }

    /**
     * Create the download button container
     * @param {string} modManagerLink - Link to open in Mod Organizer 2
     * @returns {HTMLElement} Button container element
     */
    function createDownloadButtonContainer(modManagerLink) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '1000';

        const button = document.createElement('button');
        button.innerHTML = `
            <span style="display: flex; align-items: center; font-family: 'Brush Script MT', cursive; color: #4b3929;">
                <img src="https://i.ibb.co/55r0z7m/confrerie-des-traducteurs-small.png" alt="Confrérie" style="vertical-align: middle; width: 40px; height: 40px; margin-right: 10px;">
                Télécharger<br>avec<br>MO2
            </span>
        `;
        button.style.margin = '5px';
        button.style.padding = '15px 20px';
        button.style.backgroundColor = '#e6ccaa';
        button.style.color = '#4b3929';
        button.style.border = '2px solid #4b3929';
        button.style.borderRadius = '10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';

        // Add click event listener to open mod manager link
        button.addEventListener('click', () => {
            window.open(modManagerLink, '_blank');
        });

        container.appendChild(button);
        return container;
    }

    // Initialize game download information
    setupGameDownloadInfo();

    // Check if a download URL was found
    if (downloadUrl) {
        // Encode the download URL to make it safe for use in a link
        const encodedUrl = encodeURIComponent(downloadUrl);

        // Construct the mod manager link with the game ID and encoded URL
        const modManagerLink = 'modl://' + gameId + '/?url=' + encodedUrl + ".7z";
        console.log("[INFO] mod manager link : ", modManagerLink);

        // Create and append download button
        const container = createDownloadButtonContainer(modManagerLink);
        document.body.appendChild(container);
    } else {
        console.log("[WARN] No download link found.");
    }
})();
