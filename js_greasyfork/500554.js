// ==UserScript==
// @name         Aternos Mods Uploader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Agrega un botón de carga de mods en Aternos
// @author       QkulxVW
// @match        https://aternos.org/go/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500554/Aternos%20Mods%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/500554/Aternos%20Mods%20Uploader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crea el botón y agrega un evento al hacer clic
    const addButton = document.createElement('button');
    addButton.textContent = 'Subir Mods';
    addButton.addEventListener('click', function() {
        // Abre el cuadro de diálogo para seleccionar archivos
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true; // Permite seleccionar varios archivos
        fileInput.accept = '.jar'; // Filtra por archivos .jar (puedes ajustar esto)

        // Escucha el evento de cambio en el input de archivos
        fileInput.addEventListener('change', function(event) {
            const selectedFiles = event.target.files;
            // Aquí puedes procesar los archivos seleccionados (subirlos al servidor, etc.)
            console.log('Archivos seleccionados:', selectedFiles);
        });

        // Simula un clic en el input de archivos
        fileInput.click();
    });

    // Agrega el botón al panel de control de Aternos
    const controlPanel = document.querySelector('.control-panel'); // Ajusta el selector según la estructura real de Aternos
    if (controlPanel) {
        controlPanel.appendChild(addButton);
    }

    // Aquí puedes agregar más funcionalidades o modificar el script según tus necesidades
    // Por ejemplo, puedes combinar este script con otro que realice otras acciones en Aternos.
})();