// ==UserScript==
// @name         Agar.io Custom Skin Border
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Agrega bordes personalizables a las skins en Agar.io, ubicando los botones junto al selector de color de la skin.
// @author       Tú
// @match        https://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537907/Agario%20Custom%20Skin%20Border.user.js
// @updateURL https://update.greasyfork.org/scripts/537907/Agario%20Custom%20Skin%20Border.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Esperar a que la página cargue completamente
    window.addEventListener('load', function() {
        // Esperar a que los elementos del DOM estén disponibles
        const interval = setInterval(() => {
            // Intentar encontrar el contenedor del selector de color de la skin
            const skinColorContainer = document.querySelector('.skin-color-container'); // Ajusta este selector según la estructura actual de la página

            if (skinColorContainer) {
                clearInterval(interval); // Detener el intervalo una vez que se encuentra el contenedor

                // Crear los botones
                const uploadButton = document.createElement('button');
                uploadButton.innerText = 'Subir imagen';
                uploadButton.style.margin = '5px';
                uploadButton.style.padding = '5px';

                const whiteBorderButton = document.createElement('button');
                whiteBorderButton.innerText = 'Borde Blanco';
                whiteBorderButton.style.margin = '5px';
                whiteBorderButton.style.padding = '5px';

                const blackBorderButton = document.createElement('button');
                blackBorderButton.innerText = 'Borde Negro';
                blackBorderButton.style.margin = '5px';
                blackBorderButton.style.padding = '5px';

                // Insertar los botones en el contenedor del selector de color de la skin
                skinColorContainer.appendChild(uploadButton);
                skinColorContainer.appendChild(whiteBorderButton);
                skinColorContainer.appendChild(blackBorderButton);

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
            }
        }, 1000); // Verificar cada segundo si el contenedor está disponible
    });
})();
