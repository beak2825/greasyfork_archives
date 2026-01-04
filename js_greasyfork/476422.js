// ==UserScript==
// @name         E.A5.
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Adicionar estoque automaticamente.
// @author       XFairesV1
// @match        https://ggmax.com.br/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getResourceText
// @license      EAfaires
// @downloadURL https://update.greasyfork.org/scripts/476422/EA5.user.js
// @updateURL https://update.greasyfork.org/scripts/476422/EA5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        color: #333;
        text-align: center;
        padding: 20px;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        font-family: sans-serif;
        font-size: 16px;
        line-height: 1.4;
        max-width: 80%;
    `;

    const popupText = document.createElement('h1');
    popupText.innerHTML = 'Estoque automático';
    popupText.style.cssText = `
        margin-bottom: 0px;
        font-size: 30px;
        color: black;
    `;

    popup.appendChild(popupText);

    const subtitle = document.createElement('h3');
    subtitle.innerText = '🍕Feito pelo XFaires 🕊️';
    subtitle.style.color = 'black';
    subtitle.style.fontSize = '20px';
    popup.appendChild(subtitle);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'X';
    closeButton.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;
        padding: 8px 8px;
        font-size: 20px;
        font-weight: bold;
        color: #333;
        background: transparent;
        border: none;
        cursor: pointer;
    `;

    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    popup.appendChild(closeButton);

    const fileButton = document.createElement('button');
    fileButton.innerHTML = 'Adicionar estoque';
    fileButton.style.cssText = `
        margin-top: 0px;
        padding: 10px;
        font-size: 16px;
        font-weight: bold;
        background: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;

    popup.appendChild(document.createElement('br'));
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.style.display = 'none';

    input.oninput = () => {
        const file = input.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            const numeros = reader.result.split('\n');
            numeros.forEach((numero, indice) => {
                setTimeout(() => {
                    adicionarNumero(numero.trim());
                }, (indice + 1) * 2);
            });
        };
    };

    fileButton.onclick = () => {
        document.body.appendChild(input);
        input.click();
    };

    popup.appendChild(fileButton);
    document.addEventListener('keydown', (event) => {
        if (event.keyCode === 36) {
            popup.style.display = 'block';
        }
    });

    popup.style.display = 'none';
    document.body.appendChild(popup);

window.adicionarNumero = function(numero) {
    const lastInputElement = document.querySelectorAll('textarea.form-control');
    const lastTextArea = lastInputElement[lastInputElement.length - 1];

    if (numero.includes('*')) {
        const lines = numero.split('*');
        lines.forEach((line, index) => {
            lastTextArea.value += line.trim();
            if (index < lines.length - 1) {
                lastTextArea.value += '\n'; // Pula a linha entre as partes
            }
        });
    } else {
        lastTextArea.value = numero;
    }

    lastTextArea.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('a.add-button').click();
};


})();
