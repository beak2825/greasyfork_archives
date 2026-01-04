// ==UserScript==
// @name         Agar.io Skin con Borde Estilo Bite VIP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Subir imagen como skin con borde como Bite VIP (Color 1=Blanco, Color 2=Negro, etc.)
// @author       ChatGPT
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543073/Agario%20Skin%20con%20Borde%20Estilo%20Bite%20VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/543073/Agario%20Skin%20con%20Borde%20Estilo%20Bite%20VIP.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const tryInject = setInterval(() => {
        const skinCanvas = document.querySelector('canvas');
        const saveButton = document.querySelector('button[onclick*="saveSkin"]');

        if (!skinCanvas || !saveButton) return;

        clearInterval(tryInject);

        // Crear input de subida
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.marginLeft = '10px';
        input.style.marginTop = '5px';

        // Insertar al lado del botón Save
        saveButton.parentNode.insertBefore(input, saveButton.nextSibling);

        input.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const size = 256;
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');

                    // Obtener color seleccionado
                    const selectedColor = getColorFromEditor();

                    // Dibujar borde circular
                    ctx.beginPath();
                    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fillStyle = selectedColor;
                    ctx.fill();

                    // Dibujar imagen encima
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(size / 2, size / 2, size / 2 - 12, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(img, 0, 0, size, size);
                    ctx.restore();

                    // Mostrar la imagen en el editor
                    const imgData = canvas.toDataURL();
                    const imageElement = document.querySelector('img.skin-preview');
                    if (imageElement) {
                        imageElement.src = imgData;
                    }

                    // Guardar imagen editada en el input del juego
                    const inputField = document.querySelector('input.skin-url');
                    if (inputField) {
                        inputField.value = imgData;
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });

        function getColorFromEditor() {
            const selected = document.querySelector('.skin-color.selected');
            if (!selected) return '#FFFFFF';

            const index = Array.from(selected.parentNode.children).indexOf(selected);

            // Comportamiento estilo Bite VIP:
            if (index === 0) return '#FFFFFF'; // Blanco
            if (index === 1) return '#000000'; // Negro

            // Los demás colores se toman del botón
            const bg = window.getComputedStyle(selected).backgroundColor;
            return rgbToHex(bg);
        }

        function rgbToHex(rgb) {
            const result = rgb.match(/\d+/g).map(Number);
            return (
                '#' +
                result
                    .map((x) => {
                        const hex = x.toString(16);
                        return hex.length === 1 ? '0' + hex : hex;
                    })
                    .join('')
            );
        }
    }, 1000);
})();
