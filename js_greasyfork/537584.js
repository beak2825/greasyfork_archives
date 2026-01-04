// ==UserScript==
// @name         Agar.io Custom Skin + Color Border
// @namespace    agario-custom-skin
// @version      1.0
// @description  Subir imagen personalizada con borde blanco o negro (según color 1 o 2) y botón debajo de los colores.
// @author       ChatGPT
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537584/Agario%20Custom%20Skin%20%2B%20Color%20Border.user.js
// @updateURL https://update.greasyfork.org/scripts/537584/Agario%20Custom%20Skin%20%2B%20Color%20Border.meta.js
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

    waitForElement('.agario-profile-panel', (panel) => {
        // Evitar múltiples inserciones
        if (document.getElementById('customSkinUpload')) return;

        // Crear input para subir imagen
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.id = 'customSkinUpload';
        input.style.marginTop = '10px';
        input.style.display = 'block';

        // Insertar debajo de los colores
        const colorPickerContainer = document.querySelector('.agario-profile-panel .btn-group-justified');
        if (colorPickerContainer) {
            colorPickerContainer.parentNode.insertBefore(input, colorPickerContainer.nextSibling);
        } else {
            panel.appendChild(input);
        }

        input.addEventListener('change', function () {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const imgData = e.target.result;
                localStorage.setItem('customSkinImage', imgData);
                alert('Imagen subida. ¡Ahora selecciona el color de borde!');
            };
            reader.readAsDataURL(file);
        });

        // Aplicar skin personalizada y borde correcto
        const observer = new MutationObserver(() => {
            const skinElement = document.querySelector('#canvas') || document.querySelector('.canvas');
            if (!skinElement) return;

            const imgData = localStorage.getItem('customSkinImage');
            if (!imgData) return;

            const ctx = skinElement.getContext?.('2d');
            if (!ctx) return;

            const img = new Image();
            img.src = imgData;
            img.onload = () => {
                // Detectar color seleccionado (colorId = 1 blanco, 2 negro)
                const selectedColor = parseInt(localStorage.getItem('cellColor') || "0", 10);

                // Dibujar imagen en el centro
                const centerX = skinElement.width / 2;
                const centerY = skinElement.height / 2;
                const radius = 80;

                ctx.clearRect(centerX - radius - 10, centerY - radius - 10, radius * 2 + 20, radius * 2 + 20);
                ctx.save();
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.clip();
                ctx.drawImage(img, centerX - radius, centerY - radius, radius * 2, radius * 2);
                ctx.restore();

                // Aplicar borde blanco o negro
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.lineWidth = 8;
                ctx.strokeStyle = (selectedColor === 1) ? '#FFFFFF' : (selectedColor === 2) ? '#000000' : 'transparent';
                ctx.stroke();
            };
        });

        const canvas = document.querySelector('#canvas') || document.querySelector('.canvas');
        if (canvas) observer.observe(canvas, { attributes: true, childList: true, subtree: true });
    });
})();
