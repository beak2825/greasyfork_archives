// ==UserScript==
// @name         Skin Border Integrado
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Agrega selector de borde al lado de la selección de color de skin personalizada en Agar.io
// @author       Tu nombre
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538029/Skin%20Border%20Integrado.user.js
// @updateURL https://update.greasyfork.org/scripts/538029/Skin%20Border%20Integrado.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const waitForElement = (selector, callback) => {
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            }
        }, 500);
    };

    waitForElement('.skinColors', (colorContainer) => {
        // Crear selector de color
        const borderColorInput = document.createElement('input');
        borderColorInput.type = 'color';
        borderColorInput.value = '#000000';
        borderColorInput.title = 'Color del borde';
        borderColorInput.style.marginLeft = '10px';

        // Crear campo de grosor
        const borderWidthInput = document.createElement('input');
        borderWidthInput.type = 'number';
        borderWidthInput.value = '2';
        borderWidthInput.min = '1';
        borderWidthInput.max = '10';
        borderWidthInput.style.width = '50px';
        borderWidthInput.style.marginLeft = '10px';
        borderWidthInput.title = 'Grosor del borde';

        // Crear botón
        const applyBorderButton = document.createElement('button');
        applyBorderButton.textContent = 'Aplicar borde';
        applyBorderButton.style.marginLeft = '10px';

        // Insertar controles
        colorContainer.appendChild(borderColorInput);
        colorContainer.appendChild(borderWidthInput);
        colorContainer.appendChild(applyBorderButton);

        // Funcionalidad del botón
        applyBorderButton.addEventListener('click', () => {
            const skinImg = document.querySelector('.skinPreview img');
            if (skinImg) {
                skinImg.style.border = `${borderWidthInput.value}px solid ${borderColorInput.value}`;
                skinImg.style.borderRadius = '50%'; // Redondear para que el borde sea circular
            }
        });
    });
})();

