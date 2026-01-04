// ==UserScript==
// @name         newiteractions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  custom word for iteractions on lolz.live
// @author       k3kzia
// @license      MIT
// @match        *://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      githubraw.com
// @connect      githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/522810/newiteractions.user.js
// @updateURL https://update.greasyfork.org/scripts/522810/newiteractions.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const defaultColors = {
        color1: '#ff0000',
        color2: '#00ff00',
        color3: '#0000ff',
        color4: '#ffff00'
    };

    function showColorPickers() {
        const colorPickerDiv = document.createElement('div');
        colorPickerDiv.style.position = 'fixed';
        colorPickerDiv.style.top = '50%';
        colorPickerDiv.style.left = '50%';
        colorPickerDiv.style.transform = 'translate(-50%, -50%)';
        colorPickerDiv.style.background = 'gray';
        colorPickerDiv.style.border = '1px solid black';
        colorPickerDiv.style.padding = '20px';
        colorPickerDiv.style.zIndex = '9999';

        const inputs = {};
        Object.keys(defaultColors).forEach((key, index) => {
            const colorLabel = document.createElement('label');
            colorLabel.textContent = `Color ${index + 1}: `;
            colorLabel.style.display = 'block';
            colorLabel.style.marginBottom = '5px';

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = GM_getValue(key, defaultColors[key]);
            colorInput.style.marginRight = '10px';

            inputs[key] = colorInput;

            colorPickerDiv.appendChild(colorLabel);
            colorPickerDiv.appendChild(colorInput);
        });

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.display = 'block';
        saveButton.style.marginTop = '20px';
        saveButton.onclick = () => {
            Object.keys(inputs).forEach(key => {
                GM_setValue(key, inputs[key].value);
            });
            alert('Colors saved!');
            document.body.removeChild(colorPickerDiv);
        };

        colorPickerDiv.appendChild(saveButton);
        document.body.appendChild(colorPickerDiv);
    }

    function collectWords() {
        const presetWords = ['k3kzia'];
        const presetString = presetWords.join(', ');

        let userInput = prompt("Please enter a list of words, separated by commas:", presetString);

        if (userInput) {
            const wordList = userInput.split(',').map(word => word.trim());
            GM_setValue('CUSTOM_WORD_LIST', wordList);
            alert('Word list saved!');
        } else {
            GM_setValue('CUSTOM_WORD_LIST', presetWords);
            alert('Using preset word list!');
        }
    }

    GM_registerMenuCommand('Set Colors', showColorPickers);
    GM_registerMenuCommand('Enter Word List', collectWords);

    const storedColors = {};
    Object.keys(defaultColors).forEach(key => {
        storedColors[key] = GM_getValue(key, defaultColors[key]);
    });

    let customWordList = GM_getValue('CUSTOM_WORD_LIST', null);

    if (!customWordList) {
        customWordList = ['k3kzia'];
        GM_setValue('CUSTOM_WORD_LIST', customWordList);
        alert('No word list found. Using preset word list.');
    }

    console.log('Current colors:', storedColors);
    console.log('Custom word list:', customWordList);

    const githubScriptUrl = "https://raw.githubusercontent.com/quickyyy/lolzmamonti/refs/heads/main/iteractions_test.js";

    GM_xmlhttpRequest({
        method: "GET",
        url: githubScriptUrl,
        onload: function (response) {
            if (response.status === 200) {
                console.log("Загрузил гитхаб скрипт.");
                const scriptContent = response.responseText
                    .replace(/{{CUSTOM_COLOR_1}}/g, storedColors.color1)
                    .replace(/{{CUSTOM_COLOR_2}}/g, storedColors.color2)
                    .replace(/{{CUSTOM_COLOR_3}}/g, storedColors.color3)
                    .replace(/{{CUSTOM_COLOR_4}}/g, storedColors.color4)
                    .replace(/{{CUSTOM_WORD_LIST}}/g, JSON.stringify(customWordList));

                console.log("Полученный скрипт:", scriptContent);

                eval(scriptContent);
            } else {
                console.error("Ошибка загрузки скрипта с гитхаба. Статус:", response.status);
            }
        },
        onerror: function () {
            console.error("Ошибка загрузки скрипта с гитхаба.");
        },
    });
})();
