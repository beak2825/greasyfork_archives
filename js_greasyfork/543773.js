// ==UserScript==
// @name         Matrix Fondo para Drawaria
// @namespace    PanelJuanfer-MatrixDraw
// @version      1.0
// @description  Transforma el fondo de Drawaria en un Matrix oscuro con animación
// @author       Juan
// @match        https://drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543773/Matrix%20Fondo%20para%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/543773/Matrix%20Fondo%20para%20Drawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Estilos Matrix
    const style = document.createElement('style');
    style.textContent = `
        body {
            background-color: #000 !important;
            overflow: hidden;
        }
        #matrixCanvas {
            position: fixed;
            top: 0;
            left: 0;
            z-index: -1;
            width: 100%;
            height: 100%;
        }
    `;
    document.head.appendChild(style);

    // Canvas Matrix
    const canvas = document.createElement('canvas');
    canvas.id = 'matrixCanvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width, height;
    const letters = 'アカサタナハマヤラワABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 14;
    let columns;
    let drops = [];

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = Math.floor(width / fontSize);
        drops = Array(columns).fill(1);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50);
})();
