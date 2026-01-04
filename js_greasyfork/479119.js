// ==UserScript==
// @name         Azuka text converter
// @name:en      Azuka text converter
// @name:es      Azuka texto convertido
// @namespace    https://www.youtube.com/channel/UCJOpqFOvjhUda11rk2j5P6A
// @version      1.2
// @description  Convert text to multicolor in Discord using ANSI CODE
// @description:en  Convert text to multicolor in Discord using ANSI CODE
// @description:es  Convertir texto a multicolor en Discord usando ANSI CODE
// @author       AzukaTems
// @license      MIT
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479119/Azuka%20text%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/479119/Azuka%20text%20converter.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let isMinimized = false;

    const css = `
        #multicolor-text-converter {
            position: fixed;
            bottom: 10px;
            left: 10px;
            z-index: 999;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease-in-out;
        }
        #multicolor-text-converter.minimized {
            width: 50px;
            height: 50px;
            padding: 5px;
            overflow: hidden;
        }
        #multicolor-text-converter textarea {
            width: 100%;
            height: 100px;
            margin-bottom: 10px;
            resize: vertical;
        }
        #multicolor-text-converter button {
            background-color: #007BFF;
            color: #fff;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
        }
        #minimize-button {
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
        }
    `;

    function toggleMinimize() {
        const menuUI = document.getElementById('multicolor-text-converter');
        isMinimized = !isMinimized;
        if (isMinimized) {
            menuUI.classList.add('minimized');
        } else {
            menuUI.classList.remove('minimized');
        }
    }

    function convertToMulticolor() {
        const inputText = document.getElementById('text-input').value;
        const multicolorText = '```ansi\n' + inputText.split('').map((char, index) => {
            const colorCode = (index % 7) + 31;
            return `\x1b[${colorCode}m${char}\x1b[0m`;
        }).join('') + '```';
        const textarea = document.createElement('textarea');
        textarea.value = multicolorText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Texto convertido y copiado al portapapeles');
    }

    const menuUI = document.createElement('div');
    menuUI.id = 'multicolor-text-converter';
    menuUI.innerHTML = `
        <button id="minimize-button" title="Minimizar/Maximizar">&#x25B2;</button>
        <h3>Azuka Text</h3>
        <textarea id="text-input" placeholder="Escribe tu texto aquí"></textarea>
        <button id="convert-button">Convertir y Copiar</button>
    `;

    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);

    document.body.appendChild(menuUI);

    document.getElementById('convert-button').addEventListener('click', convertToMulticolor);
    document.getElementById('minimize-button').addEventListener('click', toggleMinimize);
})();
