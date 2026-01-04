// ==UserScript==
// @name         Aternos Mods Uploader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Agrega un botón de carga de mods en Aternos
// @author       QkulxVW
// @match        https://aternos.org/go/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500556/Aternos%20Mods%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/500556/Aternos%20Mods%20Uploader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addButton = document.createElement('button');
    addButton.textContent = 'Subir Mods';
    addButton.addEventListener('click', function() {
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true; 
        fileInput.accept = '.jar'; 

        fileInput.addEventListener('change', function(event) {
            const selectedFiles = event.target.files;
            console.log('Archivos seleccionados:', selectedFiles);
        });

        
        fileInput.click();
    });

    
    const controlPanel = document.querySelector('.control-panel');
    if (controlPanel) {
        controlPanel.appendChild(addButton);
    }

    
})();