// ==UserScript==
// @name         Agar.io Custom Skin Border
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Agrega bordes personalizables a las skins en Agar.io
// @author       Tú
// @match        https://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537900/Agario%20Custom%20Skin%20Border.user.js
// @updateURL https://update.greasyfork.org/scripts/537900/Agario%20Custom%20Skin%20Border.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear los botones
    const uploadButton = document.createElement('button');
    uploadButton.innerText = 'Subir imagen';
    uploadButton.style.margin = '10px';

    const whiteBorderButton = document.createElement('button');
    whiteBorderButton.innerText = 'Borde Blanco';
    whiteBorderButton.style.margin = '10px';

    const blackBorderButton = document.createElement('button');
    blackBorderButton.innerText = 'Borde Negro';
    blackBorderButton.style.margin = '10px';

    // Insertar los botones en la interfaz
    const controlPanel = document.querySelector('.settings');
    if (controlPanel) {
        controlPanel.appendChild(uploadButton);
        controlPanel.appendChild(whiteBorderButton);
        controlPanel.appendChild(blackBorderButton);
    }

    // Función para subir la imagen
    uploadButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imgUrl = e.target.result;
                    // Subir la imagen y aplicarla como skin
                    applyCustomSkin(imgUrl);
                };
                reader.readAsDataURL(file);
            }
        });

        input.click();
    });

    // Función para aplicar la skin personalizada
    function applyCustomSkin(imgUrl) {
        // Código para aplicar la skin personalizada en el juego
        window.localStorage.setItem('customSkin', imgUrl);
        document.querySelector('canvas').style.backgroundImage = `url(${imgUrl})`;
    }

    // Función para aplicar borde blanco
    whiteBorderButton.addEventListener('click', () => {
        applyBorder('white');
    });

    // Función para aplicar borde negro
    blackBorderButton.addEventListener('click', () => {
        applyBorder('black');
    });

    // Función para aplicar el borde a la skin
    function applyBorder(color) {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = window.localStorage.getItem('customSkin');

        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Aplicar borde
            ctx.strokeStyle = color;
            ctx.lineWidth = 10;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
        };
    }
})();
