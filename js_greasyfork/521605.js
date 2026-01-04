// ==UserScript==
// @name        Trump block blocker & keyword blocker for use on news.google.com 
// @version     1.9
// @description Automatically hides stories on people topics you don't want to see or hear about
// @include     https://news.google.com/*
// @grant       none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/521605/Trump%20block%20blocker%20%20keyword%20blocker%20for%20use%20on%20newsgooglecom.user.js
// @updateURL https://update.greasyfork.org/scripts/521605/Trump%20block%20blocker%20%20keyword%20blocker%20for%20use%20on%20newsgooglecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default words to filter
    const defaultWordsToFilter = [
        'trump', 'transgender', 'elon musk', 'mtg', 'marjorie',
        'scotus', 'supreme court', 'putin', 'newsmax', 'hegseth',
        'rfk', 'kennedy', 'ukraine', 'zelensky', 'migrant',
        'immigrant', 'migration', 'abortion', 'fox news', 'january 6',
        'guilfoyle', 'jan. 6', 'immigration', 'pelosi', 'republican',
        'republicans', 'dreamers', 'aoc', 'gop', 'biden',
        'inauguration', 'maga', 'democrats', 'democratic party', 'manchin', 'dems', 'democrat', 'trump\'s', 'musk\'s', 'DNC', 'Luigi', 'mangione',
        'gaetz', 'deportation', 'deportations', 'sanctuary', 'deported','ICE'
    ];

    // Get the word list from localStorage, or use the default
    let wordsToFilter = JSON.parse(localStorage.getItem('wordsToFilter')) || defaultWordsToFilter;

    let instancesRemoved = 0;

    function isPageStillLoading() {
        const loadingIndicators = document.querySelectorAll('.loading,.loading-spinner,.infinite-scroll-loading');
        return loadingIndicators.length > 0;
    }

    function scrollToBottom() {
        window.scrollTo(0, document.documentElement.scrollHeight);
    }

    function loadEntirePage() {
        const interval = setInterval(() => {
            scrollToBottom();
            if (!isPageStillLoading()) {
                clearInterval(interval);
            }
        }, 1000);
    }

    function containsFilteredWord(text) {
        const lowerText = text.toLowerCase();
        return wordsToFilter.some(word => lowerText.includes(word));
    }

    function disableAndReplaceWords() {
        const links = document.getElementsByTagName('a');
        for (let link of links) {
            if (containsFilteredWord(link.textContent) || containsFilteredWord(link.href)) {
                let blockParent = link.closest('div, p, section, article, aside, header, footer, main, nav, form');
                
                if (blockParent) {
                    const images = blockParent.getElementsByTagName('img');
                    for (let img of images) {
                        img.style.display = 'none';
                    }
                    blockParent.style.display = 'none';
                }

                link.textContent = '-';
                link.style.pointerEvents = 'none';
                link.style.color = 'gray';
                link.style.textDecoration = 'none';
                link.onclick = function(e) {
                    e.preventDefault();
                };

                instancesRemoved++;
            }
        }
    }

    function replaceWords() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        const wordPattern = new RegExp(`\\b(${wordsToFilter.join('|').replace(/\s+/g, '\\s*')})(?:'s)?\\b`, 'gi');
        
        let node;
        while (node = walker.nextNode()) {
            const originalText = node.nodeValue;
            node.nodeValue = node.nodeValue.replace(wordPattern, 'yyy');
            
            if (originalText !== node.nodeValue) {
                instancesRemoved++;
            }
        }
    }

    function showItemsReplacedMessage() {
        const message = document.createElement('div');
        message.textContent = `${instancesRemoved}`;
        message.style.position = 'fixed';
        message.style.top = '10px';
        message.style.right = '10px';
        message.style.backgroundColor = '#4CAF50';
        message.style.color = 'white';
        message.style.padding = '10px 20px';
        message.style.borderRadius = '5px';
        message.style.zIndex = '9998';
        message.style.fontSize = '16px';
        message.style.fontWeight = 'bold';
        message.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        document.body.appendChild(message);

        setTimeout(() => {
            message.style.transition = 'opacity 1s';
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 1000);
        }, 6000);
    }

    // Add the Edit Keywords menu
    function addEditMenu() {
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit Keywords';
        editButton.style.position = 'fixed';
        editButton.style.top = '10px';
        editButton.style.left = '10px';
        editButton.style.backgroundColor = 'blue';
        editButton.style.color = 'white';
        editButton.style.border = 'none';
        editButton.style.padding = '10px 20px';
        editButton.style.fontSize = '16px';
        editButton.style.zIndex = '9999';
        document.body.appendChild(editButton);

        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        modal.style.zIndex = '10000';
        modal.style.display = 'none';
        document.body.appendChild(modal);

        const textArea = document.createElement('textarea');
        textArea.value = wordsToFilter.join('\n');
        textArea.style.width = '300px';
        textArea.style.height = '200px';
        modal.appendChild(textArea);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.marginTop = '10px';
        modal.appendChild(saveButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.marginTop = '10px';
        cancelButton.style.marginLeft = '10px';
        modal.appendChild(cancelButton);

        editButton.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        saveButton.addEventListener('click', () => {
            wordsToFilter = textArea.value.split('\n').map(word => word.trim().toLowerCase());
            localStorage.setItem('wordsToFilter', JSON.stringify(wordsToFilter));
            modal.style.display = 'none';
            alert('Keyword list updated!');
        });

        cancelButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Add reload button
    function addReloadButton() {
        const reloadButton = document.createElement('button');
        reloadButton.textContent = 'Reload';
        reloadButton.style.position = 'fixed';
        reloadButton.style.top = '10px';
        reloadButton.style.left = '50%';
        reloadButton.style.transform = 'translateX(-50%)';
        reloadButton.style.backgroundColor = 'blue';
        reloadButton.style.color = 'white';
        reloadButton.style.border = 'none';
        reloadButton.style.padding = '10px 20px';
        reloadButton.style.fontSize = '16px';
        reloadButton.style.zIndex = '9999';
        reloadButton.addEventListener('click', () => {
            location.reload();
        });
        document.body.appendChild(reloadButton);
    }

    // Add scroll to top button
    function addSTButton() {
        const stButton = document.createElement('button');
        stButton.textContent = 'ST';
        stButton.style.position = 'fixed';
        stButton.style.bottom = '10px';
        stButton.style.right = '10px';
        stButton.style.backgroundColor = 'red';
        stButton.style.color = 'white';
        stButton.style.border = 'none';
        stButton.style.padding = '10px 20px';
        stButton.style.fontSize = '16px';
        stButton.style.zIndex = '9999';
        stButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        document.body.appendChild(stButton);
    }

    // Execute filtering and modify content
    function runProcess() {
        loadEntirePage();
        waitAndExecute(() => {
            disableAndReplaceWords();
            replaceWords();

            setTimeout(() => {
                showItemsReplacedMessage();
            }, 1000);
        });
    }

    function waitAndExecute(callback) {
        setTimeout(callback, 2000);
    }

    function waitForPageLoad(callback) {
        if (document.readyState === 'complete') {
            callback();
        } else {
            window.addEventListener('load', callback);
        }
    }

    waitForPageLoad(function() {
        setTimeout(() => {
            addEditMenu();
            addReloadButton();
            addSTButton();
        }, 3000);

        runProcess();
    });
})();
