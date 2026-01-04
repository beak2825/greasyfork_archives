// ==UserScript==
// @name         Agar.io Subir Skin con Borde Personalizado
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Subir imagen como skin con borde del color elegido (negro, blanco, etc.) en el creador de skins
// @author       ChatGPT
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538654/Agario%20Subir%20Skin%20con%20Borde%20Personalizado.user.js
// @updateURL https://update.greasyfork.org/scripts/538654/Agario%20Subir%20Skin%20con%20Borde%20Personalizado.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const waitForEditor = setInterval(() => {
        const borderColors = document.querySelector('.skin-editor-color-picker');
        const saveBtn = document.querySelector('button[onclick*="save"]');
        // Verificamos que estamos en el creador de skins
        if (borderColors && saveBtn && !document.getElementById('uploadSkinBtn')) {
            // Crear botón de subir imagen
            const uploadBtn = document.createElement('button');
            uploadBtn.textContent = 'Subir imagen';
            uploadBtn.id = 'uploadSkinBtn';
            uploadBtn.style.marginTop = '10px';
            uploadBtn.style.padding = '6px';
            uploadBtn.style.fontSize = '14px';
            uploadBtn.style.cursor = 'pointer';
            uploadBtn.style.display = 'block';

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            uploadBtn.onclick = () => fileInput.click();

            fileInput.onchange = function(e) {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function(evt) {
                    const imgData = evt.target.result;

                    // Obtener color seleccionado
                    const selectedColor = getComputedStyle(
                        document.querySelector('.skin-editor-color-picker input:checked + label')
                    ).backgroundColor;

                    // Crear canvas y aplicar borde
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const size = 512; // Cambiado a 512x512
                    canvas.width = canvas.height = size;
                    const img = new Image();

                    img.onload = function() {
                        ctx.clearRect(0, 0, size, size);
                        // Borde
                        ctx.beginPath();
                        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
                        ctx.fillStyle = selectedColor;
                        ctx.fill();

                        // Imagen centrada
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(img, 0, 0, size, size);
                        ctx.restore();

                        // Cargar como skin personalizada
                        const dataURL = canvas.toDataURL('image/png');
                        const preview = document.querySelector('.skin-editor-preview img');
                        if (preview) preview.src = dataURL;

                        // Guardar la imagen como PNG
                        const link = document.createElement('a');
                        link.href = dataURL;
                        link.download = 'skin_con_borde.png'; // Nombre del archivo PNG
                        link.click();
                    };
                    img.src = imgData;
                };
                reader.readAsDataURL(file);
            };

            borderColors.appendChild(uploadBtn);
            document.body.appendChild(fileInput);
        }
    }, 1000);
})();
