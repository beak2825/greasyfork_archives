// ==UserScript==
// @name         Agario Skin personalizada (Botones al estilo segunda imagen)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Subir imagen como skin con borde blanco o negro, botones posicionados como en la imagen correcta.
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538038/Agario%20Skin%20personalizada%20%28Botones%20al%20estilo%20segunda%20imagen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538038/Agario%20Skin%20personalizada%20%28Botones%20al%20estilo%20segunda%20imagen%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const waitForButtons = setInterval(() => {
        const saveBtn = document.querySelector('.btn.btn-success.btn-block.btn-save');
        const colorBtn = document.querySelector('.btn.btn-info.btn-block.color');
        const playBtn = document.querySelector('#play');

        if (saveBtn && colorBtn && playBtn) {
            clearInterval(waitForButtons);

            // Crear input oculto
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';

            // Crear botón de subida
            const uploadBtn = document.createElement('button');
            uploadBtn.textContent = 'Subir imagen';
            uploadBtn.className = 'btn btn-warning';
            uploadBtn.style.marginRight = '8px';

            // Evento al hacer clic
            uploadBtn.onclick = () => fileInput.click();

            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function (e) {
                    const dataURL = e.target.result;
                    localStorage.setItem('customSkin', dataURL);

                    const colorId = parseInt(localStorage.getItem('cellColor') || '0', 10);
                    if (colorId === 1) {
                        localStorage.setItem('customSkinBorderColor', '#FFFFFF'); // blanco
                    } else if (colorId === 2) {
                        localStorage.setItem('customSkinBorderColor', '#000000'); // negro
                    } else {
                        localStorage.removeItem('customSkinBorderColor');
                    }

                    playBtn.click();
                };
                reader.readAsDataURL(file);
            });

            // Crear contenedor horizontal
            const btnContainer = document.createElement('div');
            btnContainer.style.display = 'flex';
            btnContainer.style.flexDirection = 'row';
            btnContainer.style.justifyContent = 'center';
            btnContainer.style.gap = '8px';
            btnContainer.style.marginTop = '10px';

            // Mover el botón "Save" al contenedor nuevo
            const clonedSave = saveBtn.cloneNode(true);
            saveBtn.style.display = 'none'; // Ocultamos el original
            btnContainer.appendChild(uploadBtn);
            btnContainer.appendChild(clonedSave);
            saveBtn.parentElement.appendChild(btnContainer);
            document.body.appendChild(fileInput);

            // Asegurar borde
            const origGetItem = localStorage.getItem.bind(localStorage);
            localStorage.getItem = function (key) {
                if (key === 'borderColor' && origGetItem('customSkinBorderColor')) {
                    return origGetItem('customSkinBorderColor');
                }
                return origGetItem(key);
            };
        }
    }, 500);
})();
