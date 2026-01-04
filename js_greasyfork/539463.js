// ==UserScript==
// @name         Agar.io image to custom skin (modificado con bordes)
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Subir imagen como skin personalizada y aplicar color de borde (negro, blanco, otros)
// @author       New Jack 🕹️ + modificado por ChatGPT
// @match        https://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539463/Agario%20image%20to%20custom%20skin%20%28modificado%20con%20bordes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539463/Agario%20image%20to%20custom%20skin%20%28modificado%20con%20bordes%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Esperar a que cargue el editor de skins
    const interval = setInterval(() => {
        const skinEditor = document.querySelector('.skin-editor-content');
        const saveButton = document.querySelector('.skin-editor-content button.save');

        if (skinEditor && saveButton && !document.getElementById('uploadImageButton')) {
            clearInterval(interval);

            // Crear input de imagen
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';

            // Agregar input al body
            document.body.appendChild(input);

            // Botón "Subir imagen"
            const uploadBtn = document.createElement('button');
            uploadBtn.textContent = 'Subir imagen';
            uploadBtn.id = 'uploadImageButton';
            uploadBtn.style.marginLeft = '8px';
            uploadBtn.style.padding = '6px 10px';
            uploadBtn.style.fontSize = '14px';

            saveButton.parentNode.insertBefore(uploadBtn, saveButton.nextSibling);

            uploadBtn.addEventListener('click', () => {
                input.click();
            });

            input.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.querySelector('.skin-editor-canvas canvas');
                        const ctx = canvas.getContext('2d');

                        const size = canvas.width;
                        ctx.clearRect(0, 0, size, size);

                        // Dibujar borde según color seleccionado
                        const selectedColor = document.querySelector('.skin-editor-colors .selected');
                        const colorStyle = getComputedStyle(selectedColor).backgroundColor;

                        // Dibujar borde
                        ctx.beginPath();
                        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI);
                        ctx.fillStyle = colorStyle;
                        ctx.fill();

                        // Dibujar imagen encima
                        const circleRadius = size * 0.4;
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(size / 2, size / 2, circleRadius, 0, 2 * Math.PI);
                        ctx.clip();

                        ctx.drawImage(img, size * 0.1, size * 0.1, size * 0.8, size * 0.8);
                        ctx.restore();
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
    }, 500);
})();
