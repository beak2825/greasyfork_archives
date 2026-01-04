// ==UserScript==
// @name         Auto-Fill Filename Script
// @namespace    https://proxer.me/user/614329/
// @version      0.9
// @description  Füllt automatisch den titel in das Textfeld ein und überwacht kontinuierlich das Dateieingabefeld
// @author       Awesome18
// @match        https://proxer.me/uploadmanga*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480956/Auto-Fill%20Filename%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/480956/Auto-Fill%20Filename%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var lastGeneratedTitle = '';
    var lastFileName = '';
    var userEdited = false;

    function displayLastGeneratedTitle() {
        var textField = document.getElementById('uploadmanga_title');
        if (!textField) return;

        var existingDisplay = document.getElementById('last-chapter-display');
        if (!existingDisplay) {
            var displayArea = document.createElement('div');
            displayArea.id = 'last-chapter-display';
            displayArea.style.marginBottom = '10px';
            textField.parentNode.insertBefore(displayArea, textField);
        }

        existingDisplay = document.getElementById('last-chapter-display');
        existingDisplay.textContent = "Letztes generiertes Kapitel: " + lastGeneratedTitle;
    }

    function handleFileSelection() {
        var fileInput = document.getElementById('uploadmanga_chapter');
        var textField = document.getElementById('uploadmanga_title');
        if (!fileInput || !textField || fileInput.files.length === 0) return;

        var fileName = fileInput.files[0].name;
        if (fileName !== lastFileName) {
            if (fileName.includes('%')) {
                fileName = decodeFolderName(fileName);
            }
            lastFileName = fileName;
            fileName = fileName.replace(/\.zip$/i, '');

            var match = fileName.match(/(Kapitel|Chapter|Ch\.?|Episode|Ep\.?|Act)\s*(\d+(?:\.\d+)?)\s*(?:[-_:]\s*)?(?:(\||\-|:)\s*)?(.*)/i);

            if (match) {
                var chapterType = match[1];
                var chapterNumber = parseFloat(match[2]).toString();
                var separator = match[3] || '|';
                var title = (match[4] || '').trim().replace(/[:]/g, '');

                if (chapterType.match(/^ch\.?$/i)) chapterType = "Chapter";
                if (chapterType.match(/^ep\.?$/i)) chapterType = "Episode";

                var titleText = `${chapterType} ${chapterNumber}`;
                if (title) {
                    titleText += ` ${separator} ${title}`;
                }

                if (!userEdited) {
                    textField.value = titleText;
                }

                lastGeneratedTitle = titleText;
                displayLastGeneratedTitle();
            }
        }
    }

    function decodeFolderName(encodedName) {
        const match = encodedName.match(/^(Chapter \d+(\.\d+)?)/);
        let chapterPart = '';
        let restOfName = encodedName;

        if (match) {
            chapterPart = match[0];
            restOfName = encodedName.slice(chapterPart.length);
        }

        const decodedName = decodeURIComponent(restOfName);
        return chapterPart + decodedName;
    }
    function trackManualEdits() {
        var textField = document.getElementById('uploadmanga_title');
        if (!textField) return;

        textField.addEventListener('input', function() {
            userEdited = true;
        });

        textField.addEventListener('focus', function() {
            userEdited = true;
        });
    }
    setInterval(function() {
        var fileInput = document.getElementById('uploadmanga_chapter');
        if (fileInput) {
            handleFileSelection();
            displayLastGeneratedTitle();
        }
    }, 1000);

    trackManualEdits();

})();
