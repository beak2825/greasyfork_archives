// ==UserScript==
// @name         Theme Auto Gradient
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Set your Gradient at lolz.live 
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @grant        GM_addStyle
// @author       coltonrampage
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504538/Theme%20Auto%20Gradient.user.js
// @updateURL https://update.greasyfork.org/scripts/504538/Theme%20Auto%20Gradient.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGradientMenu() {
        const menuContainer = document.createElement('div');
        menuContainer.className = 'fr-popup';
        menuContainer.style.display = 'none';
        menuContainer.innerHTML = `
            <div style="padding: 10px; max-width: 250px;">
                <h4 style="margin-top: 0; text-align: center;">Choose Gradient</h4>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <label style="margin-right: 10px;">Start Color:</label>
                    <input type="color" id="startColor" value="#ff0000" style="flex: 1;">
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px;">
                    <label style="margin-right: 10px;">End Color:</label>
                    <input type="color" id="endColor" value="#0000ff" style="flex: 1;">
                </div>
                <div id="gradientPreview" style="height: 40px; margin: 15px 0; border-radius: 6px; background: linear-gradient(to right, #ff0000, #0000ff);"></div>
                <button id="applyGradient" class="button primary mbottom">Apply Gradient</button>
                <button id="closeGradientMenu" class="PreviewButton JsOnly" style="margin-left: 10px;">Close</button>
            </div>
        `;
        document.body.appendChild(menuContainer);

        const startColorInput = document.getElementById('startColor');
        const endColorInput = document.getElementById('endColor');
        const gradientPreview = document.getElementById('gradientPreview');

        function updateGradientPreview() {
            gradientPreview.style.background = `linear-gradient(to right, ${startColorInput.value}, ${endColorInput.value})`;
        }

        startColorInput.addEventListener('input', updateGradientPreview);
        endColorInput.addEventListener('input', updateGradientPreview);

        document.getElementById('applyGradient').addEventListener('click', applyGradientToSelectedText);
        document.getElementById('closeGradientMenu').addEventListener('click', () => {
            menuContainer.style.display = 'none';
        });

        const gradientButton = document.querySelector('.gradient-button');
        gradientButton.addEventListener('click', (e) => {
            e.preventDefault();
            const rect = gradientButton.getBoundingClientRect();
            menuContainer.style.top = `${rect.bottom + window.scrollY}px`;
            menuContainer.style.left = `${rect.left + window.scrollX}px`;
            menuContainer.style.display = menuContainer.style.display === 'none' ? 'block' : 'none';
        });
    }

    function interpolateColor(color1, color2, factor) {
        const result = color1.slice(1).match(/.{2}/g).map((c, i) => {
            return Math.round(parseInt(c, 16) + factor * (parseInt(color2.slice(1).match(/.{2}/g)[i], 16) - parseInt(c, 16))).toString(16).padStart(2, '0');
        });
        return `#${result.join('')}`;
    }

    function applyGradientToSelectedText() {
        const startColor = document.getElementById('startColor').value;
        const endColor = document.getElementById('endColor').value;

        const editor = document.querySelector('.fr-element.fr-view');
        if (!editor) {
            alert('Не удалось найти элемент редактора. Убедитесь, что вы находитесь на нужной странице.');
            return;
        }

        const selectedText = window.getSelection().toString();

        if (!selectedText) {
            alert('Пожалуйста, выделите текст для применения градиента.');
            return;
        }

        const textLength = selectedText.length;
        let gradientText = '';

        for (let i = 0; i < textLength; i++) {
            const factor = i / (textLength - 1);
            const color = interpolateColor(startColor, endColor, factor);
            gradientText += `[COLOR=${color}]${selectedText[i]}[/COLOR]`;
        }

        const editorHtml = editor.innerHTML;
        const updatedHtml = editorHtml.replace(selectedText, gradientText);
        editor.innerHTML = updatedHtml;

        document.querySelector('.fr-popup').style.display = 'none';
    }

    function addToolbarButton() {
        const toolbar = document.querySelector('.fr-toolbar.fr-ltr.fr-desktop.fr-top.fr-basic');
        if (toolbar && toolbar.querySelector('.fal.fa-adjust')) {
            const button = document.createElement('button');
            button.className = 'gradient-button fr-command fr-btn';
            button.innerHTML = '<i class="fas fa-palette"></i>';
            toolbar.appendChild(button);

            addGradientMenu();
        }
    }

    window.addEventListener('load', addToolbarButton);

    GM_addStyle(`
        .gradient-button {
            cursor: pointer;
            padding: 5px 10px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-left: 5px;
        }
        .gradient-button:hover {
            background: #e0e0e0;
        }
        .button.primary.mbottom {
            color: white;
            text-decoration: none;
            background-color: rgb(34, 142, 93);
            padding: 0px 15px;
            border-style: none;
            border-radius: 8px;
            user-select: none;
            font-style: normal;
            text-align: center;
            outline: none;
            line-height: 34px;
            display: inline-block;
            cursor: pointer;
            box-sizing: border-box;
            vertical-align: top;
            -webkit-appearance: none !important;
            font-weight: 600;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            overflow: hidden;
            height: 34px;
        }
        .PreviewButton.JsOnly {
            color: white;
            text-decoration: none;
            background-color: rgb(54, 54, 54);
            padding: 0px 15px;
            border-style: none;
            border-radius: 6px;
            user-select: none;
            font-style: normal;
            text-align: center;
            outline: none;
            line-height: 34px;
            display: inline-block;
            cursor: pointer;
            box-sizing: border-box;
            vertical-align: top;
            -webkit-appearance: none !important;
            font-weight: 600;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            overflow: hidden;
            height: 34px;
        }
        input[type="color"] {
            -webkit-appearance: none;
            border: none;
            width: 100%;
            border-radius: 4px;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
        }
        input[type="color"]::-webkit-color-swatch-wrapper {
	        padding: 0;
        }
       input[type="color"]::-webkit-color-swatch {
	        border: none;
        }
    `);
})();
