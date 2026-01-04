// ==UserScript==
// @name         Agario - Subir Skin con Borde por Color Seleccionado
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Subir skin personalizada con borde blanco (color 1), negro (color 2), o el color seleccionado desde el 3 en adelante. Botón debajo del selector de color.
// @author       GPT
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537666/Agario%20-%20Subir%20Skin%20con%20Borde%20por%20Color%20Seleccionado.user.js
// @updateURL https://update.greasyfork.org/scripts/537666/Agario%20-%20Subir%20Skin%20con%20Borde%20por%20Color%20Seleccionado.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const waitForElement = (selector, callback) => {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    function createUploadButton(colorContainer) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        const uploadBtn = document.createElement('button');
        uploadBtn.textContent = 'Subir imagen';
        uploadBtn.style.marginTop = '10px';
        uploadBtn.style.display = 'block';
        uploadBtn.style.width = '100%';

        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', event => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = e => {
                const imageData = e.target.result;
                localStorage.setItem('customSkinImage', imageData);
                applySkinWithBorder();
            };
            reader.readAsDataURL(file);
        });

        colorContainer.parentElement.appendChild(fileInput);
        colorContainer.parentElement.appendChild(uploadBtn);
    }

    function getColorFromElement(el) {
        const style = window.getComputedStyle(el);
        return style.backgroundColor;
    }

    function applySkinWithBorder() {
        const imgData = localStorage.getItem('customSkinImage');
        if (!imgData) return;

        const selectedIndex = parseInt(localStorage.getItem('selectedColor') || '0', 10);
        let borderColor = null;

        if (selectedIndex === 0) borderColor = '#FFFFFF'; // Blanco
        else if (selectedIndex === 1) borderColor = '#000000'; // Negro
        else {
            const allColors = document.querySelectorAll('.skin-color-options > div');
            const selected = allColors[selectedIndex];
            if (selected) {
                borderColor = getColorFromElement(selected);
            }
        }

        const img = new Image();
        img.src = imgData;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const size = 256;
            const borderSize = 20;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            // Dibujar borde
            if (borderColor) {
                ctx.beginPath();
                ctx.arc(size / 2, size / 2, (size - borderSize) / 2 + borderSize / 2, 0, Math.PI * 2);
                ctx.fillStyle = borderColor;
                ctx.fill();
            }

            // Imagen circular
            ctx.save();
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, (size - borderSize) / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, 0, 0, size, size);
            ctx.restore();

            const finalImg = canvas.toDataURL('image/png');
            localStorage.setItem('customSkinImageFinal', finalImg);

            const skinInput = document.querySelector('input[name="skin"]');
            if (skinInput) {
                skinInput.value = finalImg;
                skinInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        };
    }

    function hookColorSelector(container) {
        container.addEventListener('click', () => {
            const active = container.querySelector('.active');
            if (active) {
                const index = Array.from(container.children).indexOf(active);
                localStorage.setItem('selectedColor', index);
                applySkinWithBorder();
            }
        });
    }

    waitForElement('.skin-color-options', container => {
        hookColorSelector(container);
        createUploadButton(container);
    });

})();
