// ==UserScript==
// @name         Bite VIP - Subir Skin Personalizada con Borde según Color
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Subir imagen personalizada y aplicar borde del color seleccionado en Bite VIP
// @author       Tu nombre
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538128/Bite%20VIP%20-%20Subir%20Skin%20Personalizada%20con%20Borde%20seg%C3%BAn%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/538128/Bite%20VIP%20-%20Subir%20Skin%20Personalizada%20con%20Borde%20seg%C3%BAn%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Esperar a que el menú de skins se cargue
    const waitForMenu = setInterval(() => {
        const colorPicker = document.querySelector('input[type="color"]');
        const saveButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes("Save"));

        if (colorPicker && saveButton) {
            clearInterval(waitForMenu);

            // Crear input para subir imagen
            const uploadInput = document.createElement('input');
            uploadInput.type = 'file';
            uploadInput.accept = 'image/*';
            uploadInput.style.display = 'none';

            const uploadButton = document.createElement('button');
            uploadButton.textContent = 'Subir imagen';
            uploadButton.style.marginLeft = '8px';

            // Cuando se selecciona la imagen
            uploadInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function(e) {
                    const base64Image = e.target.result;
                    localStorage.setItem('customSkinImage', base64Image);
                    alert("Imagen cargada correctamente. Presiona Save.");
                };
                reader.readAsDataURL(file);
            });

            uploadButton.addEventListener('click', () => uploadInput.click());

            // Insertar botón junto a "Save"
            saveButton.parentNode.insertBefore(uploadButton, saveButton.nextSibling);
            document.body.appendChild(uploadInput);

            // Interceptar carga de skin personalizada
            const originalImage = Image.prototype.src;
            Object.defineProperty(Image.prototype, 'src', {
                set: function(value) {
                    const customImage = localStorage.getItem('customSkinImage');
                    if (customImage && value.includes('/skins/')) {
                        this.onload = null;
                        this.src = customImage;
                        localStorage.removeItem('customSkinImage');
                    } else {
                        this.setAttribute('src', value);
                    }
                },
                get: function() {
                    return this.getAttribute('src');
                }
            });
        }
    }, 500);
})();
