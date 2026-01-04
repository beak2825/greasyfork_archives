// ==UserScript==
// @name         Gartic Phone Draw Bot
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatic Draw Bot for Gartic Phone
// @author       me
// @match        *://garticphone.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530858/Gartic%20Phone%20Draw%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/530858/Gartic%20Phone%20Draw%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const drawBotButton = document.createElement('button');
    drawBotButton.innerText = 'DRAWBOT';
    drawBotButton.style.position = 'absolute';
    drawBotButton.style.top = '10px';
    drawBotButton.style.right = '10px';
    drawBotButton.style.zIndex = '1000';
    document.body.appendChild(drawBotButton);

    const gui = document.createElement('div');
    gui.style.display = 'none';
    gui.style.position = 'absolute';
    gui.style.top = '50%';
    gui.style.left = '50%';
    gui.style.transform = 'translate(-50%, -50%)';
    gui.style.backgroundColor = 'white';
    gui.style.border = '1px solid black';
    gui.style.padding = '20px';
    gui.style.zIndex = '1001';
    document.body.appendChild(gui);

    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.accept = 'image/*';
    gui.appendChild(uploadInput);

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Image URL';
    gui.appendChild(urlInput);

    const uploadButton = document.createElement('button');
    uploadButton.innerText = 'Upload Image';
    gui.appendChild(uploadButton);

    drawBotButton.addEventListener('click', () => {
        gui.style.display = 'block';
    });

    document.addEventListener('click', (event) => {
        if (!gui.contains(event.target) && event.target !== drawBotButton) {
            gui.style.display = 'none';
        }
    });

    uploadButton.addEventListener('click', () => {
        const file = uploadInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                startDrawing(e.target.result);
            };
            reader.readAsDataURL(file);
        } else if (urlInput.value) {
            startDrawing(urlInput.value);
        }
    });

    function startDrawing(imageSrc) {
        const canvas = document.querySelector('canvas'); // Adjust selector as needed
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = imageSrc;
        img.onload = function() {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    }

    document.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    document.addEventListener('drop', (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                startDrawing(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
})();
