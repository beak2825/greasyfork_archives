// ==UserScript==
// @name         Agar.io Skin Uploader (Bite VIP)  
// @namespace    http://tampermonkey.net/  
// @version      1.0  
// @description  Añade un botón “Subir imagen” junto a “Save” para cargar tu skin limpia y usar el borde Bite VIP (negro, blanco, etc.)  
// @author       ChatGPT (profesional)  
// @match        *://agar.io/*  
// @grant        none  
// @license      MIT  
// @downloadURL https://update.greasyfork.org/scripts/537256/Agario%20Skin%20Uploader%20%28Bite%20VIP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537256/Agario%20Skin%20Uploader%20%28Bite%20VIP%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Espera hasta que el editor de skins (canvas, colores y botón Save) esté disponible,
     * luego inyecta el botón de subida de imagen.
     */
    function waitForEditor() {
        const canvas = document.getElementById('skin-editor-canvas');
        const saveBtn = document.querySelector('.btn-save');
        const colorPanel = document.querySelector('.skin-border-option');

        if (canvas && saveBtn && colorPanel && !document.getElementById('tm-upload-btn')) {
            injectUploadButton(saveBtn);
        }
    }

    /**
     * Crea e inserta el input[type=file] junto al botón Save, con un pequeño margen.
     * @param {HTMLElement} saveBtn - El botón “Save” del editor.
     */
    function injectUploadButton(saveBtn) {
        // Crear el input de archivo
        const uploadInput = document.createElement('input');
        uploadInput.type = 'file';
        uploadInput.accept = 'image/*';
        uploadInput.id = 'tm-upload-btn';
        uploadInput.title = 'Subir imagen para skin';
        uploadInput.style.marginLeft = '8px';
        uploadInput.style.verticalAlign = 'middle';
        uploadInput.style.cursor = 'pointer';

        // Evento al seleccionar un archivo
        uploadInput.addEventListener('change', event => {
            const file = event.target.files[0];
            if (!file) return;
            loadImageToCanvas(file);
        });

        // Insertar después del botón Save
        saveBtn.parentNode.insertBefore(uploadInput, saveBtn.nextSibling);
    }

    /**
     * Lee el archivo como DataURL y dibuja la imagen en el canvas oficial.
     * @param {File} file - El archivo de imagen seleccionado.
     */
    function loadImageToCanvas(file) {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.getElementById('skin-editor-canvas');
                const ctx = canvas.getContext('2d');
                // Ajustar tamaño
                canvas.width = 512;
                canvas.height = 512;
                // Limpiar cualquier contenido previo
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Dibujar imagen limpia
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // Ahora solo falta pulsar “Save” para que Bite VIP aplique el borde elegido
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    }

    // Comprobar cada segundo hasta que el editor esté listo
    setInterval(waitForEditor, 1000);
})();
