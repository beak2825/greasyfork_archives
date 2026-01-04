// ==UserScript==
// @name         Descarga el texto de YomiYasu
// @namespace    Descarga el texto de YomiYasu by Pedro from Aprender Japonés Rapido
// @version      0.1
// @description  Descarga el texto de YomiYasu con un comando
// @license      GNU GPLv3
// @author       Pedrubik🦙
// @match        https://manga.ajr.moe/api/static/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480140/Descarga%20el%20texto%20de%20YomiYasu.user.js
// @updateURL https://update.greasyfork.org/scripts/480140/Descarga%20el%20texto%20de%20YomiYasu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to save text to a file
    function saveTextToFile(text, filename) {
        const blob = new Blob([text], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a); // Ensure it's added to the DOM for Firefox
        a.click();
        document.body.removeChild(a); // Clean up after clicking
    }

    // Function to be called when the script is activated
    function DownloadTxt() {
        var textBoxes = document.querySelectorAll(".textBox");
        var textContent = "";
        textBoxes.forEach(function(textBox) {
            textContent += textBox.textContent + '\n';
        });


        if (textContent) {
            saveTextToFile(textContent, document.title + '.txt');

        } else {
            console.log(textContent);
            console.log(document.title + '.txt');
        }
    }

    const customKeyCode = 74; // 74 corresponds to the 'J' key
    const isCtrlKey = (event) => event.ctrlKey;
    const isAltKey = (event) => event.altKey;

    // Listen for keydown events on the document
    document.addEventListener('keydown', function(event) {
        if (event.keyCode === customKeyCode && isCtrlKey(event) && isAltKey(event)) {
            DownloadTxt();
            event.preventDefault(); // Prevent the default action for the key combination
        }
    });
})();
