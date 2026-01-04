// ==UserScript==
// @name         Agar.io: Subir Imagen con Botón de Borde Personalizado
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Añade un botón para subir imagen en Agar.io debajo del selector de colores y permite elegir el borde.
// @author       You
// @match        https://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538134/Agario%3A%20Subir%20Imagen%20con%20Bot%C3%B3n%20de%20Borde%20Personalizado.user.js
// @updateURL https://update.greasyfork.org/scripts/538134/Agario%3A%20Subir%20Imagen%20con%20Bot%C3%B3n%20de%20Borde%20Personalizado.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Esperar a que la página se cargue completamente
    window.addEventListener('load', function() {

        // Crear el botón "Subir Imagen"
        const uploadButton = document.createElement('button');
        uploadButton.innerText = 'Subir Imagen';
        uploadButton.style.position = 'absolute';
        uploadButton.style.padding = '10px';
        uploadButton.style.borderRadius = '5px';
        uploadButton.style.border = '2px solid #000';
        uploadButton.style.backgroundColor = '#fff';
        uploadButton.style.cursor = 'pointer';
        uploadButton.style.zIndex = '1000';

        // Posicionar el botón debajo del selector de colores
        const colorSelector = document.querySelector('.color-selector'); // Ajustar según la clase del selector de colores
        if (colorSelector) {
            const rect = colorSelector.getBoundingClientRect();
            uploadButton.style.left = `${rect.left}px`;
            uploadButton.style.top = `${rect.bottom + 10}px`;  // 10px debajo del selector de colores
            document.body.appendChild(uploadButton);
        }

        // Crear un contenedor para los botones de color del borde
        const colorBorderContainer = document.createElement('div');
        colorBorderContainer.style.position = 'absolute';
        colorBorderContainer.style.top = `${uploadButton.offsetTop + uploadButton.offsetHeight + 10}px`;
        colorBorderContainer.style.left = `${uploadButton.style.left}`;
        colorBorderContainer.style.zIndex = '1000';
        colorBorderContainer.style.display = 'flex';

        // Crear botones para los colores del borde
        const colors = ['white', 'black', 'red', 'blue', 'green', 'yellow'];
        colors.forEach(color => {
            const colorButton = document.createElement('button');
            colorButton.innerText = color.charAt(0).toUpperCase() + color.slice(1);
            colorButton.style.padding = '5px';
            colorButton.style.margin = '5px';
            colorButton.style.backgroundColor = color;
            colorButton.style.border = '1px solid #000';
            colorButton.style.cursor = 'pointer';
            colorButton.style.color = '#fff';
            colorButton.style.borderRadius = '5px';

            // Aplicar color de borde al hacer clic en el botón
            colorButton.addEventListener('click', function() {
                setSkinBorder(color);
            });

            colorBorderContainer.appendChild(colorButton);
        });

        document.body.appendChild(colorBorderContainer);

        // Función para cambiar el borde de la skin según el color seleccionado
        let selectedBorderColor = '';

        function setSkinBorder(color) {
            selectedBorderColor = color;
            console.log(`Borde seleccionado: ${color}`);
        }

        // Acción al hacer clic en el botón para subir imagen
        uploadButton.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';

            // Mostrar el selector de archivos
            fileInput.click();

            fileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = new Image();
                        img.src = e.target.result;
                        img.onload = function() {
                            // Aquí deberías integrar la imagen con Agar.io
                            console.log('Imagen subida', img.src);
                            console.log('Borde aplicado:', selectedBorderColor);
                        };
                    };
                    reader.readAsDataURL(file);
                }
            });
        });

    });
})();
