// ==UserScript==
// @name         Skin Border Mejorado
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Aplica automáticamente un borde circular a la skin en Agar.io y permite descargarla.
// @author       Tu nombre
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538034/Skin%20Border%20Mejorado.user.js
// @updateURL https://update.greasyfork.org/scripts/538034/Skin%20Border%20Mejorado.meta.js
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
        const borderColorInput = document.createElement('input');
        borderColorInput.type = 'color';
        borderColorInput.value = '#000000';
        borderColorInput.title = 'Color del borde';
        borderColorInput.style.marginLeft = '10px';

        const borderWidthInput = document.createElement('input');
        borderWidthInput.type = 'number';
        borderWidthInput.value = '2';
        borderWidthInput.min = '1';
        borderWidthInput.max = '10';
        borderWidthInput.style.width = '50px';
        borderWidthInput.style.marginLeft = '10px';
        borderWidthInput.title = 'Grosor del borde';

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Descargar skin';
        downloadButton.style.marginLeft = '10px';

        colorContainer.appendChild(borderColorInput);
        colorContainer.appendChild(borderWidthInput);
        colorContainer.appendChild(downloadButton);

        // Función para aplicar borde a la imagen
        const applyBorder = () => {
            const skinImg = document.querySelector('.skinPreview img');
            if (skinImg) {
                skinImg.style.border = `${borderWidthInput.value}px solid ${borderColorInput.value}`;
                skinImg.style.borderRadius = '50%';
            }
        };

        // Aplicar automáticamente el borde al cambiar los valores
        borderColorInput.addEventListener('input', applyBorder);
        borderWidthInput.addEventListener('input', applyBorder);

        // Observar cambios en la imagen (por si se sube una nueva)
        const observer = new MutationObserver(applyBorder);
        const targetNode = document.querySelector('.skinPreview');
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
        }

        // Descargar la skin con borde como PNG
        downloadButton.addEventListener('click', () => {
            const skinImg = document.querySelector('.skinPreview img');
            if (!skinImg) return;

            const canvas = document.createElement('canvas');
            const size = 256;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.src = skinImg.src;
            image.onload = () => {
                ctx.beginPath();
                ctx.arc(size / 2, size / 2, size / 2 - parseInt(borderWidthInput.value), 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(image, 0, 0, size, size);

                ctx.lineWidth = parseInt(borderWidthInput.value);
                ctx.strokeStyle = borderColorInput.value;
                ctx.beginPath();
                ctx.arc(size / 2, size / 2, size / 2 - parseInt(borderWidthInput.value) / 2, 0, Math.PI * 2);
                ctx.stroke();

                const link = document.createElement('a');
                link.download = 'skin_con_borde.png';
                link.href = canvas.toDataURL();
                link.click();
            };
        });

        // Aplicar el borde una vez al cargar
        applyBorder();
    });
})();
