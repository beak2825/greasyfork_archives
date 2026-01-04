// ==UserScript==
// @name         BruneThemer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change background color and font of websites
// @author       Brune & ChatGPT
// @match        *://*/*
// @grant        none
// @license      BruneThemer © 2024 by BruneGaming
// @downloadURL https://update.greasyfork.org/scripts/485144/BruneThemer.user.js
// @updateURL https://update.greasyfork.org/scripts/485144/BruneThemer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function createButton() {
        const button = document.createElement('button');
        button.id = 'themesButton';
        button.textContent = 'THEMES';
        document.body.appendChild(button);
        button.addEventListener('click', toggleThemesMenu);
    }

    function createThemesMenu() {
        const themesMenu = document.createElement('div');
        themesMenu.id = 'themesMenu';
        themesMenu.style.display = 'none';

        const themesContent = document.createElement('div');
        themesContent.id = 'themesContent';
        themesMenu.appendChild(themesContent);

        const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', 'rainbow'];

        colors.forEach(color => {
            const colorCircle = document.createElement('div');
            colorCircle.className = 'colorCircle';
            if (color === 'rainbow') {
                colorCircle.style.backgroundImage = 'linear-gradient(to right, violet, indigo, blue, green, yellow, orange, red)';
            } else {
                colorCircle.style.backgroundColor = color;
            }
            colorCircle.onclick = () => changeBackgroundColor(color);
            themesContent.appendChild(colorCircle);
        });

        const closeButton = document.createElement('div');
        closeButton.id = 'closeButton';
        closeButton.textContent = '[X] Close';
        closeButton.onclick = toggleThemesMenu;
        themesContent.appendChild(closeButton);

        document.body.appendChild(themesMenu);
    }

    function toggleThemesMenu() {
        const themesMenu = document.getElementById('themesMenu');
        const body = document.body;

        if (themesMenu.style.display === 'none') {
            themesMenu.style.display = 'block';
            body.style.filter = 'blur(5px)';
        } else {
            themesMenu.style.display = 'none';
            body.style.filter = 'none';
        }
    }

    function changeBackgroundColor(color) {
        document.body.style.backgroundColor = color;

        // Change font for each color
        switch (color) {
            case '#000000':
                document.body.style.fontFamily = 'Arial, sans-serif';
                break;
            case '#ff0000':
                document.body.style.fontFamily = 'Comic Sans MS, cursive';
                break;
            case '#00ff00':
                document.body.style.fontFamily = 'Georgia, serif';
                break;
            case '#0000ff':
                document.body.style.fontFamily = 'Courier New, monospace';
                break;
            case '#ffff00':
                document.body.style.fontFamily = 'Impact, fantasy';
                break;
            case '#ff00ff':
                document.body.style.fontFamily = 'Times New Roman, serif';
                break;
            case 'rainbow':
                document.body.style.fontFamily = 'Verdana, sans-serif';
                break;
            default:
                break;
        }
    }

    addStyle(`
        #themesButton {
            display: block;
            position: fixed;
            top: 10px;
            right: 10px;
            cursor: pointer;
            background-color: #333;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            z-index: 9999;
        }

        #themesMenu {
            display: none;
            position: fixed;
            top: 50px;
            right: 10px;
            z-index: 9999;
        }

        #themesContent {
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }

        .colorCircle {
            display: inline-block;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 5px;
            cursor: pointer;
        }

        #closeButton {
            display: block;
            margin-top: 10px;
            cursor: pointer;
            color: black;
            text-align: center;
        }

        #closeButton:hover {
            color: red;
        }
    `);

    createButton();
    createThemesMenu();

})();
