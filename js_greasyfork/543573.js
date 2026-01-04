// ==UserScript==
// @name         Agario Skin Editor - Imagen con borde
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Subir imagen y aplicarla como skin con borde en el editor de dibujo de Agar.io
// @author       GPT
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543573/Agario%20Skin%20Editor%20-%20Imagen%20con%20borde.user.js
// @updateURL https://update.greasyfork.org/scripts/543573/Agario%20Skin%20Editor%20-%20Imagen%20con%20borde.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const checkInterval = setInterval(() => {
        const canvas = document.querySelector('canvas');
        const saveButton = document.querySelector('button:has-text("Save")') || document.querySelector('button[class*="save"]');

        if (canvas && saveButton && !document.getElementById('uploadCustomSkin')) {
            clearInterval(checkInterval);

            // Crear input de imagen
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.id = 'uploadCustomSkin';
            input.style.marginLeft = '12px';
            input.style.display = 'inline-block';
            input.title = 'Subir imagen como skin';

            // Insertar input después del botón "Save"
            saveButton.parentNode.insertBefore(input, saveButton.nextSibling);

            input.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = new Image();
                    img.onload = function () {
                        const ctx = canvas.getContext('2d');
                        const size = canvas.width;

                        // Detectar color del borde seleccionado
                        let borderColor = '#000000'; // negro por defecto
                        const borderBtn = document.querySelector('.borderColor.active') || document.querySelector('.borderColor[style*="border"]');
                        if (borderBtn) {
                            const style = window.getComputedStyle(borderBtn);
                            borderColor = style.backgroundColor || '#000000';
                        }

                        // Limpiar canvas
                        ctx.clearRect(0, 0, size, size);

                        // Fondo blanco o color actual del "background" si aplica
                        const bgBtn = document.querySelector('.backgroundColor.active');
                        if (bgBtn) {
                            const style = window.getComputedStyle(bgBtn);
                            ctx.fillStyle = style.backgroundColor || '#ffffff';
                            ctx.fillRect(0, 0, size, size);
                        }

                        // Recorte circular
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
                        ctx.closePath();
                        ctx.clip();

                        // Dibujar imagen centrada
                        ctx.drawImage(img, 0, 0, size, size);
                        ctx.restore();

                        // Dibujar borde
                        ctx.lineWidth = 12;
                        ctx.strokeStyle = borderColor;
                        ctx.beginPath();
                        ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
                        ctx.stroke();
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
    }, 1000);
})();
