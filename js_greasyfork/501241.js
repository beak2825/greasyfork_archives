// ==UserScript==
// @name         Import multiple decks to Duelingbook
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Script that loops the process of importing cards in order to allow multiple imports at once
// @author       Andrino Cauduro - https://github.com/AndrinoC
// @match        https://www.duelingbook.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501241/Import%20multiple%20decks%20to%20Duelingbook.user.js
// @updateURL https://update.greasyfork.org/scripts/501241/Import%20multiple%20decks%20to%20Duelingbook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the inputOK function
    function inputOK() {
        hideDisplayBoxes();
        input_callback && input_callback();
    }

    // Create control panel
    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.top = '10px';
    controlPanel.style.right = '10px';
    controlPanel.style.zIndex = '10000';
    controlPanel.style.backgroundColor = 'white';
    controlPanel.style.border = '1px solid black';
    controlPanel.style.padding = '15px';
    controlPanel.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.5)';
    controlPanel.style.width = '150px';
    controlPanel.style.textAlign = 'center';
    controlPanel.style.transition = 'width 0.3s'; 
    document.body.appendChild(controlPanel);

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.left = '-5px';
    closeButton.style.fontSize = '14px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '10001'; 
    controlPanel.appendChild(closeButton);

    // Create File Input button (hidden)
    const fileInputButton = document.createElement('input');
    fileInputButton.type = 'file';
    fileInputButton.style.fontSize = '20px';
    fileInputButton.style.width = '100%';
    fileInputButton.style.display = 'none';
    fileInputButton.multiple = true;
    fileInputButton.accept = '.ydk';
    fileInputButton.id = 'file-input';
    controlPanel.appendChild(fileInputButton);

    // Create Label to act as button
    const fileInputLabel = document.createElement('label');
    fileInputLabel.textContent = 'Choose .ydk files';
    fileInputLabel.htmlFor = 'file-input';
    fileInputLabel.style.fontSize = '20px';
    fileInputLabel.style.width = '100%';
    fileInputLabel.style.display = 'inline-block';
    fileInputLabel.style.backgroundColor = '#007bff';
    fileInputLabel.style.cursor = 'pointer';
    controlPanel.appendChild(fileInputLabel);

    // Create Status label
    const statusLabel = document.createElement('div');
    statusLabel.style.position = 'relative';
    statusLabel.textContent = 'Status: Waiting for file';
    statusLabel.style.fontSize = '10px';
    statusLabel.style.marginTop = '10px';
    controlPanel.appendChild(statusLabel);

    // Function to transform YDK content to JSON
    function ydkToJson(ydkContent) {
        const main = [];
        const extra = [];
        const side = [];
        let section = 'main';

        ydkContent.split('\n').forEach(line => {
            line = line.trim();
            if (line === '#main') section = 'main';
            else if (line === '#extra') section = 'extra';
            else if (line === '!side') section = 'side';
            else if (line && !line.startsWith('#')) {
                const cardId = parseInt(line, 10);
                if (!isNaN(cardId)) {
                    if (section === 'main') main.push(cardId);
                    else if (section === 'extra') extra.push(cardId);
                    else if (section === 'side') side.push(cardId);
                }
            }
        });

        return { main, extra, side };
    }

    // Function to import YDK content
    function importYDK(ydkContent, deckName) {
        const { main, extra, side } = ydkToJson(ydkContent);

        window.importYDK = function(content) {
            const cardIds = { main: [], extra: [], side: [] };
            const sections = { '#main': 'main', '#extra': 'extra', '!side': 'side' };
            let section = 'main';

            Object.entries(sections).forEach(([marker, type]) => {
                const start = content.indexOf(marker);
                const end = content.indexOf(Object.keys(sections).find(k => k !== marker), start + marker.length) || content.length;
                const sectionContent = content.slice(start + marker.length, end).trim();
                sectionContent.split('\n').forEach(line => {
                    const cardId = parseInt(line.trim(), 10);
                    if (!isNaN(cardId)) cardIds[type].push(cardId);
                });
            });

            ['main', 'extra', 'side'].forEach(type => {
                cardIds[type] = cardIds[type].map(cardId => {
                    const card = getCardByPasscode(cardId);
                    return card ? card.id : null;
                }).filter(id => id !== null);
            });

            importedCards = cardIds;
            importedDeckName = deckName;
            importDeckE();
            inputOK(); 
        };

        window.importYDK(ydkContent);

        // Reset the file input button and update status
        fileInputButton.value = '';
        statusLabel.textContent = 'Status: Ready for new file';
    }

    // Function to process files (single .ydk or array of promises for .ydk files)
    function processFiles(files) {
        if (!Array.isArray(files)) files = [files];
        let fileIndex = 0;
        const delay = 500; // Delay before processing the next file

        function importNextFile() {
            if (fileIndex < files.length) {
                files[fileIndex].then(({ content, name }) => {
                    importYDK(content, name);
                    fileIndex++;
                    setTimeout(importNextFile, delay); 
                });
            } else {
                statusLabel.textContent = 'Status: All files processed';
            }
        }

        importNextFile();
    }

    // Function to extract deck name from file name
    function getDeckName(fileName) {
        return fileName.replace('.ydk', '');
    }

    // Function to read file content and name
    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({ content: e.target.result, name: getDeckName(file.name) });
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    // Event listener for file input
    fileInputButton.addEventListener('change', (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            statusLabel.textContent = 'Status: Processing files...';
            const ydkFiles = files.filter(file => file.name.endsWith('.ydk'));

            if (ydkFiles.length > 0) {
                processFiles(ydkFiles.map(readFile));
            } else {
                statusLabel.textContent = 'Status: No .ydk files found';
            }
        }
    });

    // Minimize/Maximize functionality
    let isMinimized = false;

    closeButton.addEventListener('click', () => {
        if (isMinimized) {
            controlPanel.style.width = '150px';
            statusLabel.style.display = 'block';
            fileInputLabel.style.display = 'inline-block';
            fileInputButton.style.display = 'none'; // Ensure file input button stays hidden
        } else {
            controlPanel.style.width = '30px';
            statusLabel.style.display = 'none';
            fileInputLabel.style.display = 'none';
            fileInputButton.style.display = 'none';
        }
        isMinimized = !isMinimized;
    });

})();
