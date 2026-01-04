// ==UserScript==
// @name         Modify Text Area from pixai prompts
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Modifica el tamaño de un área de texto y agrega un botón para alternar el tamaño uwu
// @author       Abejita
// @match        https://pixai.art/generator/image
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528269/Modify%20Text%20Area%20from%20pixai%20prompts.user.js
// @updateURL https://update.greasyfork.org/scripts/528269/Modify%20Text%20Area%20from%20pixai%20prompts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para crear el botón
    function createButton() {
        let buttonContainer = document.querySelector('.px-4.py-1.flex.gap-4.items-center .flex-1');
        if (buttonContainer && !document.querySelector('#toggleSizeButton')) {
            let button = document.createElement('button');
            button.id = 'toggleSizeButton';
            button.textContent = 'Agrandar';
            button.style.padding = '8px 18px';
            button.style.borderRadius = '5px';
            button.style.border = 'none';
            button.style.background = 'linear-gradient(to right, #ff7ec5, #c36bfb)';
            button.style.color = 'white';
            button.style.cursor = 'pointer';
            button.style.fontSize = '16px';
            button.style.margin = '10px';
            buttonContainer.appendChild(button);

            button.addEventListener('click', toggleSize);
        }
    }

    // Función para alternar el tamaño del área de texto
    function toggleSize() {
        let elements = document.querySelectorAll('textarea.w-full.min-h-\\[3em\\].max-h-\\[9em\\].dense\\:max-h-\\[5em\\].bg-transparent.outline-none.resize-none');
        elements.forEach(element => {
            if (element.style.height === '400px') {
                element.style.height = '120px';
                element.style.maxHeight = '2000px';//9em
                document.querySelector('#toggleSizeButton').textContent = 'Agrandar';
            } else {
                element.style.height = '400px';
                element.style.maxHeight = '2000px';
                document.querySelector('#toggleSizeButton').textContent = 'Reducir';
            }
        });
    }

    // Crear el botón al cargar la página completamente
    window.addEventListener('load', function() {
        setTimeout(createButton, 6000);
    });

    // Crear el botón al presionar F9
    document.addEventListener('keydown', function(event) {
        if (event.key === 'F9') {
            createButton();
        }
    });

    // Revisa cada 6 segundos para asegurarse de que el botón aparezca correctamente
    setInterval(createButton, 6000);
})();
