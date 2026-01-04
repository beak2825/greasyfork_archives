// ==UserScript==
// @name         Listar palavras com @ e salvar em .txt
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Lista palavras com "@" em um canal do Discord e permite salvar em um arquivo de texto
// @author       Jeiel Miranda
// @match        https://discord.com/*
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466509/Listar%20palavras%20com%20%40%20e%20salvar%20em%20txt.user.js
// @updateURL https://update.greasyfork.org/scripts/466509/Listar%20palavras%20com%20%40%20e%20salvar%20em%20txt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const createFloatingWindow = () => {
        const floatingWindow = document.createElement('div');
        floatingWindow.id = 'floatingWindow';
        floatingWindow.style.position = 'fixed';
        floatingWindow.style.bottom = '20px';
        floatingWindow.style.right = '20px';
        floatingWindow.style.width = '300px';
        floatingWindow.style.height = '200px';
        floatingWindow.style.backgroundColor = 'white';
        floatingWindow.style.border = '1px solid black';
        floatingWindow.style.overflow = 'scroll';
        floatingWindow.style.padding = '10px';
        document.body.appendChild(floatingWindow);
        return floatingWindow;
    };

    const createSaveButton = () => {
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Salvar em .txt';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.padding = '10px 20px';
        saveButton.style.textAlign = 'center';
        saveButton.style.textDecoration = 'none';
        saveButton.style.display = 'inline-block';
        saveButton.style.fontSize = '16px';
        saveButton.style.marginTop = '10px';
        saveButton.style.cursor = 'pointer';
        saveButton.addEventListener('click', saveWordList);
        return saveButton;
    };

    const updateWordList = () => {
        const words = [];
        const messages = document.querySelectorAll('[class*="message-"]');
        for (const message of messages) {
            const messageText = message.textContent.trim();
            const messageWords = messageText.split(' ');
            for (const word of messageWords) {
                if (word.includes('@')) {
                    words.push(word);
                }
            }
        }
        return words;
    };

    const renderWordList = (wordList) => {
        const floatingWindow = document.getElementById('floatingWindow');
        floatingWindow.innerHTML = '';
        for (const word of wordList) {
            const wordElement = document.createElement('p');
            wordElement.textContent = word;
            floatingWindow.appendChild(wordElement);
        }
        const saveButton = createSaveButton();
        floatingWindow.appendChild(saveButton);
    };

    const observeDOMChanges = () => {
        const targetNode = document.getElementById('app-mount');
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver(() => {
            const wordList = updateWordList();
            renderWordList(wordList);
        });
        observer.observe(targetNode, config);
    };

    const saveWordList = () => {
        const wordList = updateWordList();
        const content = wordList.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'Arroba.txt';
        downloadLink.click();
        URL.revokeObjectURL(url);
    };

    const initializeScript = () => {
        const floatingWindow = createFloatingWindow();
        const wordList = updateWordList();
        renderWordList(wordList);
        observeDOMChanges();
    };

    initializeScript();
})();
