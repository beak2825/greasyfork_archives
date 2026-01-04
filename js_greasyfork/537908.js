// ==UserScript==
// @name         Agario Custom Skin (borde real junto a Save)
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  Subir imagen personalizada con borde del color elegido, botón junto a "Save"
// @author       ChatGPT + Tú
// @match        *://*.agar.io/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/537908/Agario%20Custom%20Skin%20%28borde%20real%20junto%20a%20Save%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537908/Agario%20Custom%20Skin%20%28borde%20real%20junto%20a%20Save%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function insertUploadButton() {
        const colorPickerContainer = document.querySelector('#nick + div');
        const saveButton = document.querySelector('#mainPanel .btn.btn-primary');

        if (!colorPickerContainer || !saveButton) return;

        // Crear input oculto
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        // Crear botón "Subir imagen"
        const uploadButton = document.createElement('button');
        uploadButton.innerText = 'Subir imagen';
        uploadButton.className = 'btn btn-success';
        uploadButton.style.marginLeft = '10px';

        // Acción al hacer clic en el botón
        uploadButton.onclick = () => fileInput.click();

        fileInput.onchange = () => {
            const file = fileInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const skinURL = e.target.result;

                // Leer el color de borde elegido
                const selectedColor = localStorage.getItem("cellColor") || "1";
                let borderColor = 0;
                if (selectedColor === "1") borderColor = 2; // blanco
                else if (selectedColor === "2") borderColor = 1; // negro
                else borderColor = parseInt(selectedColor);

                try {
                    unsafeWindow.core.registerSkin(null, "%SkinPersonalizada", skinURL, borderColor, null);
                    unsafeWindow.core.loadSkin("%SkinPersonalizada");
                } catch (err) {
                    console.error("Error al cargar la skin personalizada:", err);
                }
            };
            reader.readAsDataURL(file);
        };

        // Insertar al lado del botón "Save"
        saveButton.parentNode.insertBefore(uploadButton, saveButton.nextSibling);
        saveButton.parentNode.insertBefore(fileInput, uploadButton.nextSibling);
    }

    const waitForMenu = setInterval(() => {
        if (document.querySelector('#mainPanel') && unsafeWindow.core?.registerSkin) {
            clearInterval(waitForMenu);
            insertUploadButton();
        }
    }, 1000);
})();
