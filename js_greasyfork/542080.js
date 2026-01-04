// ==UserScript==
// @name         Agar.io Skin con Borde Personalizado
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Subir imagen como skin y aplicar borde blanco o negro según el color elegido (1 o 2)
// @author       ChatGPT Adaptado para José Andre
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542080/Agario%20Skin%20con%20Borde%20Personalizado.user.js
// @updateURL https://update.greasyfork.org/scripts/542080/Agario%20Skin%20con%20Borde%20Personalizado.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Esperar a que cargue el DOM
    const checkDOM = setInterval(() => {
        const parent = document.querySelector('.form-group.clearfix');
        const colorSelector = document.querySelector('#color');
        const saveButton = document.querySelector('button[data-itr="save"]');

        if (parent && colorSelector && saveButton) {
            clearInterval(checkDOM);

            // Crear botón para subir imagen
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.marginLeft = '10px';
            input.id = 'customSkinUpload';

            // Insertar botón al lado del de 'Save'
            saveButton.parentNode.insertBefore(input, saveButton.nextSibling);

            // Crear lienzo temporal para aplicar borde
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 512;
            canvas.height = 512;

            input.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        // Dibujar imagen circular
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(256, 256, 230, 0, Math.PI * 2);
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(img, 0, 0, 512, 512);
                        ctx.restore();

                        // Detectar color elegido: 1 -> blanco, 2 -> negro
                        const colorValue = parseInt(colorSelector.value);
                        if (colorValue === 1) {
                            ctx.strokeStyle = 'white';
                        } else if (colorValue === 2) {
                            ctx.strokeStyle = 'black';
                        } else {
                            ctx.strokeStyle = 'transparent';
                        }

                        ctx.lineWidth = 16;
                        ctx.beginPath();
                        ctx.arc(256, 256, 230, 0, Math.PI * 2);
                        ctx.stroke();

                        // Convertir a dataURL
                        const finalImage = canvas.toDataURL('image/png');

                        // Asignar la imagen a la skin
                        localStorage.setItem('customSkinDataURL', finalImage);

                        // Mostrar en el círculo visual
                        const skinPreview = document.querySelector('.circle.bordered');
                        if (skinPreview) skinPreview.src = finalImage;
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
    }, 500);
})();
