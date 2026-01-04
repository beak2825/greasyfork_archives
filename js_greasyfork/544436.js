// ==UserScript==
// @name         Drawaria: Otyano Screenshot Overlay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays draggable menu with screenshots Exposing Otyano click to place image on canvas.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://cdn5.vectorstock.com/i/1000x1000/63/94/exposed-rubber-stamp-vector-12386394.jpg
// @downloadURL https://update.greasyfork.org/scripts/544436/Drawaria%3A%20Otyano%20Screenshot%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/544436/Drawaria%3A%20Otyano%20Screenshot%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Lista de screenshots
    const screenshots = [
        "https://i.ibb.co/44MTZxt/Screenshot-2024-10-18-at-7-42-56-PM.png",
        "https://i.ibb.co/LzPL1y1/Screenshot-20241014-225811-Drawaria-Online.jpg",
        "https://i.ibb.co/31ZQQnL/Screenshot-20241011-005225-Drawaria-Online.jpg",
        "https://i.ibb.co/ScsbM5w/Screenshot-20240715-233611-Drawaria-Online.jpg",
        "https://i.ibb.co/x66hjMb/Screenshot-20240719-234836-Drawaria-Online.jpg",
        "https://i.ibb.co/ZgHJHtZ/Screenshot-2024-10-09-6-11-38-PM.png",
        "https://i.ibb.co/hDC0rxw/Screenshot-2024-10-09-6-12-52-PM.png",
        "https://i.ibb.co/0sW0q5V/Screenshot-2025-01-12-11-56-36-PM.png",
        "https://i.ibb.co/7pbQ4XQ/Screenshot-2025-01-12-11-51-46-PM.png",
        "https://i.ibb.co/B5Yjvmxg/IMG-1757.jpg",
        "https://i.ibb.co/HpRqYsCh/IMG-1756.jpg",
        "https://i.ibb.co/23m39SjK/c80d27e0-672d-11f0-8d47-cbcdc07da1cc-1753210692148.webp",
        "https://i.ibb.co/pY0nj25/c80d27e0-672d-11f0-8d47-cbcdc07da1cc-1753210717097.webp"
    ];

    // Estilos del menú
    const style = document.createElement('style');
    style.textContent = `
        #otyano-screenshot-menu {
            position: fixed;
            top: 80px;
            left: 50px;
            width: 260px;
            background: rgba(24,24,24,0.97);
            color: #fafafa;
            border: 2px solid #222;
            border-radius: 9px;
            z-index: 99999;
            box-shadow: 2px 7px 18px #000d;
            font-family: Arial, sans-serif;
            padding-bottom: 5px;
            user-select: none;
        }
        #otyano-screenshot-title {
            padding: 10px 17px;
            font-size: 17px;
            background:#152040;
            cursor: move;
            border-top-left-radius:9px;
            border-top-right-radius:9px;
            letter-spacing: 1px;
            font-weight: bold;
        }
        #otyano-screenshot-list {
            max-height: 250px;
            overflow-y: auto;
            padding: 7px 7px 7px 12px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: flex-start;
        }
        .otyano-screenshot-thumb {
            width: 56px;
            height: 44px;
            object-fit: cover;
            border: 2px solid #3cd8fe;
            border-radius: 4px;
            margin-bottom: 3px;
            cursor: pointer;
            transition: border 0.15s;
            background: #222;
            box-shadow: 0 1px 4px #0007;
        }
        .otyano-screenshot-thumb:hover {
            border: 2.5px solid #FF6E40;
        }
        .otyano-shot-caption {
            display: block;
            color: #e6e6e6;
            font-size: 12px;
            text-align: center;
            margin-top: 0;
            margin-bottom: 2px;
        }
    `;
    document.head.appendChild(style);

    // Crea el menú
    const menu = document.createElement('div');
    menu.id = 'otyano-screenshot-menu';

    const title = document.createElement('div');
    title.id = 'otyano-screenshot-title';
    title.textContent = 'Otyano Exposing Screenshots';

    const list = document.createElement('div');
    list.id = 'otyano-screenshot-list';

    // Llena el menú con las miniaturas
    screenshots.forEach((url, idx) => {
        const thumbWrapper = document.createElement('div');
        thumbWrapper.style.display = "flex";
        thumbWrapper.style.flexDirection = "column";
        thumbWrapper.style.alignItems = "center";

        const img = document.createElement('img');
        img.src = url;
        img.className = 'otyano-screenshot-thumb';
        img.alt = "Screenshot " + (idx+1);
        img.title = "Screenshot " + (idx+1);
        img.onclick = () => setScreenshotToCanvas(url);

        const caption = document.createElement('span');
        caption.className = 'otyano-shot-caption';
        caption.textContent = 'Screenshot ' + (idx+1);

        thumbWrapper.appendChild(img);
        thumbWrapper.appendChild(caption);
        list.appendChild(thumbWrapper);
    });

    menu.appendChild(title);
    menu.appendChild(list);
    document.body.appendChild(menu);

    // Hacer draggable el menú
    (() => {
        let dragging = false, offsetX = 0, offsetY = 0;
        title.addEventListener('mousedown', function(e) {
            dragging = true;
            offsetX = e.clientX - menu.offsetLeft;
            offsetY = e.clientY - menu.offsetTop;
            document.body.style.userSelect = "none";
        });

        document.addEventListener('mousemove', function(e) {
            if (!dragging) return;
            menu.style.left = (e.clientX - offsetX) + 'px';
            menu.style.top = (e.clientY - offsetY) + 'px';
        });

        document.addEventListener('mouseup', function() {
            dragging = false;
            document.body.style.userSelect = "";
        });
    })();

    function setScreenshotToCanvas(url) {
        const canvas = document.querySelector('canvas'); // Select the first canvas element found
        if (!canvas) {
            alert("No se encontró el canvas principal.");
            return;
        }

        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Set crossOrigin attribute to handle CORS
        img.onload = function() {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.onerror = function() {
            alert("No se pudo cargar la imagen.\nVerifica si la imagen permite uso cross-origin.");
        };
        img.src = url;
    }
})();
