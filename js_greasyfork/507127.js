// ==UserScript==
// @name         Sticker Menu Drawaria
// @namespace    http://tampermonkey.net/
// @version      2024-09-06
// @description  Use Stickers in Drawaria online!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507127/Sticker%20Menu%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/507127/Sticker%20Menu%20Drawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Array de URLs de los stickers
    const stickers = [
        "https://i.gifer.com/origin/f5/f5baef4b6b6677020ab8d091ef78a3bc_w200.webp",
        "https://i.gifer.com/origin/95/952780ba778267ca60b2c8e94dece14b_w200.webp",
        "https://i.gifer.com/origin/a5/a55b0d1e8dbb607c2a205b092ad18bc7_w200.webp",
        "https://i.gifer.com/origin/60/600d072d11a7a433f8f5ec979bdd44f2_w200.webp",
        "https://i.gifer.com/origin/3f/3fcf565ccc553afcfd89858c97304705_w200.webp",
        "https://i.gifer.com/origin/22/22133af5b0f5dfa0021a84d4c886b42b_w200.webp",
        "https://i.gifer.com/origin/f5/f5026f5ddbdfacfeab04e4d078175c15_w200.webp",
        "https://i.gifer.com/origin/3b/3b2adebdeba786705de52d65b0896b3e_w200.webp"
    ];

    // Crear el contenedor de stickers
    const stickerMenu = document.createElement('div');
    stickerMenu.style.position = 'fixed';
    stickerMenu.style.top = '10px';
    stickerMenu.style.left = '10px';
    stickerMenu.style.backgroundColor = '#f0f0f0';
    stickerMenu.style.padding = '10px';
    stickerMenu.style.border = '2px solid #333';
    stickerMenu.style.borderRadius = '8px';
    stickerMenu.style.zIndex = '1000';
    stickerMenu.style.display = 'flex';
    stickerMenu.style.width = '400px';  // Ancho fijo para el contenedor
    stickerMenu.style.height = 'auto';
    stickerMenu.style.overflow = 'auto';  // Permitir desplazamiento si hay muchos stickers
    stickerMenu.style.transition = 'transform 0.3s ease';
    stickerMenu.style.transform = 'translateX(0)';  // Inicialmente visible

    // Crear botón para abrir y cerrar el menú
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Stickers';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '10px';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.backgroundColor = '#333';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '8px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.zIndex = '1001';

    let menuVisible = true;

    toggleButton.addEventListener('click', () => {
        if (menuVisible) {
            stickerMenu.style.transform = 'translateX(-410px)';  // Ocultar el menú
        } else {
            stickerMenu.style.transform = 'translateX(0)';  // Mostrar el menú
        }
        menuVisible = !menuVisible;
    });

    // Función para colocar el sticker en el canvas de Drawaria
    function addStickerToCanvas(stickerUrl) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = stickerUrl;
        img.onload = function() {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);  // Dibuja la imagen en el canvas
        };
    }

    // Añadir los stickers al menú
    stickers.forEach(stickerUrl => {
        const stickerImg = document.createElement('img');
        stickerImg.src = stickerUrl;
        stickerImg.style.width = '50px';
        stickerImg.style.height = '50px';
        stickerImg.style.marginRight = '5px';
        stickerImg.style.cursor = 'pointer';

        // Añadir evento para colocar el sticker en el canvas
        stickerImg.addEventListener('click', () => {
            addStickerToCanvas(stickerImg.src);
        });

        stickerMenu.appendChild(stickerImg);
    });

    // Añadir el menú y el botón al documento
    document.body.appendChild(stickerMenu);
    document.body.appendChild(toggleButton);

    // Ajustar el tamaño del canvas
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.height = 650;
        canvas.width = 780;
    }
})();
