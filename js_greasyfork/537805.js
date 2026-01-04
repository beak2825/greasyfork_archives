// ==UserScript==
// @name         Agar.io Custom Skin Border (Only via Game System)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Subir imagen como skin sin modificarla, aplicando borde con el sistema del juego. Color 1=blanco, Color 2=negro.
// @author       OpenAI - Personalizado
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537805/Agario%20Custom%20Skin%20Border%20%28Only%20via%20Game%20System%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537805/Agario%20Custom%20Skin%20Border%20%28Only%20via%20Game%20System%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const waitForElement = (selector, callback) => {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 500);
    };

    waitForElement('#canvas', () => {
        const observer = new MutationObserver(() => {
            const saveBtn = document.querySelector('.btn.btn-success[onclick*="save"]');
            const existingUpload = document.getElementById('custom-skin-upload');

            if (saveBtn && !existingUpload) {
                const uploadInput = document.createElement('input');
                uploadInput.type = 'file';
                uploadInput.accept = 'image/*';
                uploadInput.style.marginRight = '10px';
                uploadInput.id = 'custom-skin-upload';

                uploadInput.addEventListener('change', async function () {
                    const file = this.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const imageData = e.target.result;
                        localStorage.setItem('customSkinImage', imageData);
                        alert('✅ Imagen cargada. Ahora presiona "Save" para aplicar la skin.');
                    };
                    reader.readAsDataURL(file);
                });

                saveBtn.parentNode.insertBefore(uploadInput, saveBtn);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });

    // Hookear la función Save para aplicar la skin con borde del sistema
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
        if (key === 'selectedColor') {
            const colorNum = parseInt(value);
            if (colorNum === 1) {
                value = '#FFFFFF'; // blanco
            } else if (colorNum === 2) {
                value = '#000000'; // negro
            }
        }
        return originalSetItem.apply(this, [key, value]);
    };

    // Aplicar la imagen cargada cuando se haga clic en Save
    document.addEventListener('click', function (e) {
        if (e.target && e.target.matches('.btn.btn-success[onclick*="save"]')) {
            const imgData = localStorage.getItem('customSkinImage');
            if (imgData) {
                localStorage.setItem('customSkin', imgData);
                alert('✅ Skin personalizada aplicada con borde del sistema.');
            }
        }
    });
})();
