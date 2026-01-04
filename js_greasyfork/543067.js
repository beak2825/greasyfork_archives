// ==UserScript==
// @name         Agar.io Skin Editor - Custom Image with Border Color (Bite VIP Style)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sube una imagen como skin personalizada con borde del color seleccionado (como Bite VIP)
// @author       nop
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543067/Agario%20Skin%20Editor%20-%20Custom%20Image%20with%20Border%20Color%20%28Bite%20VIP%20Style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543067/Agario%20Skin%20Editor%20-%20Custom%20Image%20with%20Border%20Color%20%28Bite%20VIP%20Style%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForEditor() {
        const interval = setInterval(() => {
            const skinCanvas = document.querySelector('canvas');
            const colorPicker = document.querySelector('div[class*="ColorSelector"]');
            const saveButton = document.querySelector('button:contains("Save")');

            if (skinCanvas && colorPicker && saveButton) {
                clearInterval(interval);
                initCustomSkinUploader(skinCanvas, colorPicker, saveButton);
            }
        }, 500);
    }

    function initCustomSkinUploader(canvas, colorPicker, saveBtn) {
        // Crear input de imagen
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.marginLeft = '10px';
        input.title = 'Sube tu imagen como skin personalizada';

        // Insertar al lado del botón Save
        saveBtn.parentNode.insertBefore(input, saveBtn.nextSibling);

        input.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    drawSkinWithBorder(img, canvas);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function drawSkinWithBorder(image, canvas) {
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const borderSize = 8;

        // Obtener color del borde
        const colorCircle = document.querySelector('div[class*="ColorSelector"] div[style*="background-color"]');
        const borderColor = window.getComputedStyle(colorCircle).backgroundColor;

        // Limpiar canvas
        ctx.clearRect(0, 0, size, size);

        // Dibujar borde circular
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
        ctx.fillStyle = borderColor;
        ctx.fill();
        ctx.closePath();

        // Dibujar imagen recortada circular encima
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - borderSize, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(image, 0, 0, size, size);
        ctx.restore();
    }

    waitForEditor();
})();
