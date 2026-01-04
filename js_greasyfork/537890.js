// ==UserScript==
// @name         Agar.io Custom Skin with Border (White/Black)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Subir una imagen y añadir borde blanco o negro en Agar.io
// @author       YourName
// @match        *://agar.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537890/Agario%20Custom%20Skin%20with%20Border%20%28WhiteBlack%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537890/Agario%20Custom%20Skin%20with%20Border%20%28WhiteBlack%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Agregar estilos para la interfaz dentro del juego (cerca del selector de color de skin)
    GM_addStyle(`
        #upload-skin-container {
            position: absolute;
            top: 50px; /* Ajustar esta posición si es necesario */
            left: 50px; /* Ajustar esta posición si es necesario */
            z-index: 9999;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 10px;
            border-radius: 5px;
            color: white;
        }
        #upload-skin-container input[type="file"] {
            margin-right: 10px;
        }
        #upload-skin-container select {
            margin-right: 10px;
        }
        #upload-skin-container button {
            margin-left: 10px;
            cursor: pointer;
        }
        #uploaded-image {
            margin-top: 10px;
            max-width: 200px;
            max-height: 200px;
            display: block;
        }
    `);

    // Crear la interfaz para cargar imagen y seleccionar el borde
    const uploadSkinContainer = document.createElement('div');
    uploadSkinContainer.id = 'upload-skin-container';
    uploadSkinContainer.innerHTML = `
        <input type="file" id="imageUpload" accept="image/*">
        <select id="borderSelect">
            <option value="none">Elegir borde (Negro o Blanco)</option>
            <option value="white">Borde blanco</option>
            <option value="black">Borde negro</option>
        </select>
        <button id="applySkinBtn">Aplicar skin</button>
        <img id="uploaded-image" src="" alt="Imagen cargada" style="display: none;">
    `;
    document.body.appendChild(uploadSkinContainer);

    let image = null;
    let borderColor = 'none';

    // Mostrar la imagen cargada
    document.getElementById('imageUpload').addEventListener('change', (event) => {
        const reader = new FileReader();
        reader.onload = function() {
            const img = new Image();
            img.onload = function() {
                image = img;
                const uploadedImageElement = document.getElementById('uploaded-image');
                uploadedImageElement.src = reader.result;
                uploadedImageElement.style.display = 'block';
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    });

    // Selección del color de borde
    document.getElementById('borderSelect').addEventListener('change', (event) => {
        borderColor = event.target.value;
    });

    // Función para aplicar la skin con borde
    document.getElementById('applySkinBtn').addEventListener('click', () => {
        if (image) {
            applySkinWithBorder(image, borderColor);
        } else {
            alert('Por favor, carga una imagen primero.');
        }
    });

    // Función para aplicar borde a la imagen usando canvas
    function applySkinWithBorder(img, borderColor) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const radius = Math.min(img.width, img.height) / 2;
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
        ctx.clip();

        // Dibujar la imagen recortada al círculo
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Aplicar borde si es necesario
        if (borderColor !== 'none') {
            ctx.lineWidth = 10;
            ctx.strokeStyle = borderColor;
            ctx.stroke();
        }

        // Convertir el canvas a imagen y aplicarla como skin
        const skinImage = new Image();
        skinImage.src = canvas.toDataURL();
        skinImage.onload = function() {
            // Aquí aplicar la imagen al juego
            // Suponiendo que hay una función para aplicar la skin en Agar.io
            applyCustomSkin(skinImage);
        };
    }

    // Función hipotética para aplicar la skin al juego (deberás adaptarla según el juego)
    function applyCustomSkin(skin) {
        // Aquí el código para aplicar la skin al juego (dependiendo de cómo Agar.io permita hacerlo)
        console.log('Aplicando skin personalizada al juego...', skin);
    }

    // Esperar a que el juego cargue para mostrar los botones
    function checkGameLoaded() {
        const gameCanvas = document.getElementById('canvas');
        if (gameCanvas) {
            // El juego se ha cargado, mostrar los botones
            uploadSkinContainer.style.display = 'block';
        } else {
            // El juego aún no se ha cargado, seguir esperando
            setTimeout(checkGameLoaded, 1000);
        }
    }

    // Llamar a la función que espera el juego cargado
    checkGameLoaded();
})();
