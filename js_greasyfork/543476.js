// ==UserScript==
// @name         Agar.io - Subir Imagen como Skin Personalizada con Borde
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sube una imagen como skin personalizada y aplica color de borde (blanco, negro, otros).
// @author       GPT Pro
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543476/Agario%20-%20Subir%20Imagen%20como%20Skin%20Personalizada%20con%20Borde.user.js
// @updateURL https://update.greasyfork.org/scripts/543476/Agario%20-%20Subir%20Imagen%20como%20Skin%20Personalizada%20con%20Borde.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Esperar a que el DOM cargue completamente
    const waitForTarget = setInterval(() => {
        const saveButton = document.querySelector('button[class*="save"]');
        const colorPicker = document.querySelector('div[class*="ColorPicker-module__container"]');

        if (saveButton && colorPicker) {
            clearInterval(waitForTarget);

            // Crear botón de subir imagen
            const uploadBtn = document.createElement("input");
            uploadBtn.type = "file";
            uploadBtn.accept = "image/*";
            uploadBtn.style.marginLeft = "12px";
            uploadBtn.title = "Subir imagen como skin";
            uploadBtn.style.cursor = "pointer";

            // Insertar el botón al lado del botón Save
            saveButton.parentNode.insertBefore(uploadBtn, saveButton.nextSibling);

            // Escuchar cuando se sube la imagen
            uploadBtn.addEventListener("change", function (event) {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function (e) {
                    const imageData = e.target.result;

                    // Detectar color de borde
                    const colorIndex = [...colorPicker.querySelectorAll("button")].findIndex(btn => btn.classList.contains("selected")) + 1;
                    let borderColor = "#FF0000"; // por defecto rojo

                    if (colorIndex === 1) borderColor = "#FFFFFF"; // blanco
                    else if (colorIndex === 2) borderColor = "#000000"; // negro

                    // Crear skin circular con borde en canvas
                    const canvas = document.createElement("canvas");
                    const size = 256;
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext("2d");

                    const img = new Image();
                    img.onload = function () {
                        // Dibujar borde
                        ctx.beginPath();
                        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI);
                        ctx.fillStyle = borderColor;
                        ctx.fill();

                        // Crear máscara circular
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(size / 2, size / 2, size / 2 - 8, 0, 2 * Math.PI);
                        ctx.clip();

                        // Dibujar imagen dentro del círculo
                        ctx.drawImage(img, 0, 0, size, size);
                        ctx.restore();

                        // Convertir a base64
                        const finalImage = canvas.toDataURL("image/png");

                        // Insertar skin en el editor
                        const preview = document.querySelector('canvas');
                        if (preview) {
                            const previewCtx = preview.getContext("2d");
                            const skin = new Image();
                            skin.onload = function () {
                                previewCtx.clearRect(0, 0, preview.width, preview.height);
                                previewCtx.drawImage(skin, 0, 0, preview.width, preview.height);
                            };
                            skin.src = finalImage;
                        }

                        // Guardar skin automáticamente
                        localStorage.setItem("customSkinImage", finalImage);
                    };
                    img.src = imageData;
                };
                reader.readAsDataURL(file);
            });
        }
    }, 1000);
})();
