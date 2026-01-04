// ==UserScript==
// @name         Agar.io Custom Skin Uploader with Border Fix
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Subir imagen como skin personalizada con bordes blancos o negros según color elegido (1=blanco, 2=negro)
// @author       Adaptado por ChatGPT
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537675/Agario%20Custom%20Skin%20Uploader%20with%20Border%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/537675/Agario%20Custom%20Skin%20Uploader%20with%20Border%20Fix.meta.js
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

    function createUploadButton() {
        const saveBtn = document.querySelector('.btn.btn-info.btn-save');
        if (!saveBtn || document.getElementById('custom-skin-upload')) return;

        const uploadInput = document.createElement('input');
        uploadInput.type = 'file';
        uploadInput.accept = 'image/*';
        uploadInput.style.display = 'none';
        uploadInput.id = 'custom-skin-upload';

        const uploadBtn = document.createElement('button');
        uploadBtn.textContent = 'Subir imagen';
        uploadBtn.className = 'btn btn-primary';
        uploadBtn.style.marginLeft = '10px';
        uploadBtn.onclick = () => uploadInput.click();

        uploadInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async function (e) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const size = 256;
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');

                    // Obtener color seleccionado
                    const selectedColorIndex = getSelectedColorIndex();
                    const borderColor = selectedColorIndex === 1 ? '#FFFFFF' : selectedColorIndex === 2 ? '#000000' : null;

                    // Dibujar borde si corresponde
                    if (borderColor) {
                        const borderWidth = 16;
                        ctx.beginPath();
                        ctx.arc(size / 2, size / 2, size / 2 - borderWidth / 2, 0, Math.PI * 2);
                        ctx.strokeStyle = borderColor;
                        ctx.lineWidth = borderWidth;
                        ctx.stroke();
                        ctx.closePath();
                    }

                    // Recortar imagen en círculo
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(size / 2, size / 2, size / 2 - 16, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(img, 0, 0, size, size);
                    ctx.restore();

                    // Subir como skin personalizada
                    const dataUrl = canvas.toDataURL('image/png');
                    const localStorageKey = 'customSkinData';
                    localStorage.setItem(localStorageKey, dataUrl);

                    // Aplicar al juego automáticamente
                    const skinInput = document.querySelector('input[placeholder="URL de skin personalizada"], input[placeholder="Custom skin URL"]');
                    if (skinInput) {
                        skinInput.value = dataUrl;
                        skinInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });

        saveBtn.parentNode.insertBefore(uploadBtn, saveBtn.nextSibling);
        saveBtn.parentNode.insertBefore(uploadInput, uploadBtn.nextSibling);
    }

    function getSelectedColorIndex() {
        const selected = document.querySelector('.skin-color.selected');
        if (!selected) return 0;
        const index = Array.from(document.querySelectorAll('.skin-color')).indexOf(selected);
        return index + 1;
    }

    waitForElement('.btn.btn-info.btn-save', createUploadButton);
})();
