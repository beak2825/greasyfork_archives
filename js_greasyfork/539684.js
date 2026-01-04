// ==UserScript==
// @name         Agar.io Crear Skin con Borde y Vista Previa
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Subir imagen, aplicar borde, ver en la bola del editor y descargar PNG
// @author       ChatGPT
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539684/Agario%20Crear%20Skin%20con%20Borde%20y%20Vista%20Previa.user.js
// @updateURL https://update.greasyfork.org/scripts/539684/Agario%20Crear%20Skin%20con%20Borde%20y%20Vista%20Previa.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function esperarEditor() {
        const intervalo = setInterval(() => {
            const canvas = document.querySelector('canvas');
            const panel = document.querySelector('.skinEditor') || document.querySelector('.canvas-box');
            const yaExiste = document.getElementById('customSkinTools');

            if (canvas && panel && !yaExiste) {
                clearInterval(intervalo);

                const contenedor = document.createElement('div');
                contenedor.id = 'customSkinTools';
                contenedor.style.marginTop = '10px';
                contenedor.style.textAlign = 'left';

                contenedor.innerHTML = `
                    <label>Subir imagen: <input type="file" id="imgInput" accept="image/*"></label><br>
                    <label>Color borde: <input type="color" id="borderColor" value="#ffffff"></label><br>
                    <label>Nombre del archivo: <input type="text" id="filename" placeholder="skin.png"></label><br>
                    <button id="generarSkin">Ver en bola + Descargar</button>
                `;

                panel.appendChild(contenedor);

                document.getElementById('generarSkin').onclick = () => {
                    const archivo = document.getElementById('imgInput').files[0];
                    const colorBorde = document.getElementById('borderColor').value;
                    const nombre = document.getElementById('filename').value || 'skin.png';

                    if (!archivo) return alert('Selecciona una imagen');

                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const imagen = new Image();
                        imagen.onload = function () {
                            const size = 512;
                            const canvasTemp = document.createElement('canvas');
                            canvasTemp.width = size;
                            canvasTemp.height = size;
                            const ctx = canvasTemp.getContext('2d');

                            // Fondo con borde
                            ctx.beginPath();
                            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
                            ctx.fillStyle = colorBorde;
                            ctx.fill();

                            // Imagen recortada
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(size / 2, size / 2, size / 2 - 12, 0, Math.PI * 2);
                            ctx.clip();
                            ctx.drawImage(imagen, 0, 0, size, size);
                            ctx.restore();

                            // Mostrar en bola (editor skin)
                            const ctxReal = canvas.getContext('2d');
                            ctxReal.clearRect(0, 0, canvas.width, canvas.height);
                            ctxReal.drawImage(canvasTemp, (canvas.width - size) / 2, (canvas.height - size) / 2, size, size);

                            // Descargar
                            const link = document.createElement('a');
                            link.download = nombre.endsWith('.png') ? nombre : nombre + '.png';
                            link.href = canvasTemp.toDataURL('image/png');
                            link.click();
                        };
                        imagen.src = e.target.result;
                    };
                    reader.readAsDataURL(archivo);
                };
            }
        }, 1000);
    }

    if (window.location.href.includes('agar.io')) {
        const observador = new MutationObserver(() => {
            esperarEditor();
        });

        observador.observe(document.body, { childList: true, subtree: true });
    }
})();
