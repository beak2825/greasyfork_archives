// ==UserScript==
// @name         Agar.io Skin Creator - Subir Imagen Mejorado Android
// @namespace    agario.upload.borde.v5
// @version      5.0
// @description  Subir imagen como skin personalizada con borde (blanco, negro, u otro), 100% funcional en Android y Firefox
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539449/Agario%20Skin%20Creator%20-%20Subir%20Imagen%20Mejorado%20Android.user.js
// @updateURL https://update.greasyfork.org/scripts/539449/Agario%20Skin%20Creator%20-%20Subir%20Imagen%20Mejorado%20Android.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const interval = setInterval(() => {
        const saveBtn = document.querySelector('button[onclick*="saveSkin"]');
        const borderBtn = document.querySelector('button[aria-label="Border"]');
        const existingUploadBtn = document.getElementById('subirImagenBtn');

        if (saveBtn && borderBtn && !existingUploadBtn) {
            clearInterval(interval);

            // Crear input oculto
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';
            input.id = 'inputSubidaSkin';
            document.body.appendChild(input);

            // Crear botón de subir imagen
            const subirBtn = document.createElement('button');
            subirBtn.textContent = 'Subir imagen';
            subirBtn.id = 'subirImagenBtn';
            subirBtn.style.marginLeft = '8px';
            subirBtn.style.padding = '6px 12px';
            subirBtn.style.fontSize = '14px';
            subirBtn.style.borderRadius = '8px';
            subirBtn.style.border = '1px solid #ccc';
            subirBtn.style.backgroundColor = '#f0f0f0';
            subirBtn.style.cursor = 'pointer';
            subirBtn.style.fontWeight = 'bold';

            // Insertar botón después de "Save"
            saveBtn.parentElement.insertBefore(subirBtn, saveBtn.nextSibling);

            // Acción al hacer clic
            subirBtn.onclick = () => input.click();

            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function (event) {
                    const img = new Image();
                    img.onload = function () {
                        const size = 512;
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = size;
                        canvas.height = size;

                        // Detectar color seleccionado (0=blanco, 1=negro, resto=original)
                        const colores = document.querySelectorAll('.skin-color-picker > div');
                        let bordeColor = '#000000';
                        colores.forEach((el, i) => {
                            if (el.classList.contains('selected')) {
                                if (i === 0) bordeColor = '#FFFFFF';
                                else if (i === 1) bordeColor = '#000000';
                                else bordeColor = getComputedStyle(el).backgroundColor;
                            }
                        });

                        // Fondo borde
                        ctx.beginPath();
                        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
                        ctx.fillStyle = bordeColor;
                        ctx.fill();

                        // Imagen redonda encima
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(size / 2, size / 2, size / 2 - 12, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(img, 0, 0, size, size);
                        ctx.restore();

                        // Subir imagen como skin
                        const dataURL = canvas.toDataURL('image/png');
                        window.uploadSkinFromBase64?.(dataURL);
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
    }, 1500);
})();
