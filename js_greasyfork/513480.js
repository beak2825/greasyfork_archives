// ==UserScript==
// @name         Drawaria Video Importer
// @namespace    http://tampermonkey.net/
// @version      2024-10-21
// @description  Import your videos in drawaria and wartch them!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513480/Drawaria%20Video%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/513480/Drawaria%20Video%20Importer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear la interfaz básica
    const editorUI = document.createElement('div');
    editorUI.style.position = 'fixed';
    editorUI.style.top = '10px';
    editorUI.style.right = '10px';
    editorUI.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    editorUI.style.color = 'white';
    editorUI.style.padding = '10px';
    editorUI.style.borderRadius = '5px';
    editorUI.style.zIndex = '1000';

    // Botón para cargar video
    const loadVideoButton = document.createElement('button');
    loadVideoButton.textContent = 'Import Video';
    loadVideoButton.style.marginRight = '10px';

    // Botón para agregar efecto
    const addEffectButton = document.createElement('button');
    addEffectButton.textContent = 'Subscribe YoutubeDrawaria';
    addEffectButton.style.marginRight = '10px';

    // Botón para exportar video
    const exportVideoButton = document.createElement('button');
    exportVideoButton.textContent = 'Like my Videos';

    // Agregar botones a la interfaz
    editorUI.appendChild(loadVideoButton);
    editorUI.appendChild(addEffectButton);
    editorUI.appendChild(exportVideoButton);

    // Agregar la interfaz al cuerpo del documento
    document.body.appendChild(editorUI);

    // Agregar un input para cargar archivos
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'video/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    let videoElement = null;
    let ffmpeg = null;

    // Lógica para cargar el video
    loadVideoButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const videoURL = URL.createObjectURL(file);
            videoElement = document.createElement('video');
            videoElement.src = videoURL;
            videoElement.controls = true;
            videoElement.style.width = '100%';
            videoElement.style.marginTop = '10px';
            editorUI.appendChild(videoElement);

            // Inicializar ffmpeg.js
            const { createFFmpeg, fetchFile } = FFmpeg;
            ffmpeg = createFFmpeg({ log: true });
            await ffmpeg.load();
            ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));
        }
    });

    // Lógica para agregar un efecto
    addEffectButton.addEventListener('click', async () => {
        if (videoElement && ffmpeg) {
            // Aplicar un efecto simple (invertir colores)
            await ffmpeg.run('-i', 'input.mp4', '-vf', 'negate', 'output.mp4');
            const data = ffmpeg.FS('readFile', 'output.mp4');
            const videoURL = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            videoElement.src = videoURL;
        } else {
            alert('Subscribe: https://www.youtube.com/@YouTubeDrawaria');
        }
    });

    // Lógica para exportar el video
    exportVideoButton.addEventListener('click', () => {
        if (videoElement && ffmpeg) {
            const data = ffmpeg.FS('readFile', 'output.mp4');
            const blob = new Blob([data.buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'output.mp4';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            alert('Like my videos: https://www.youtube.com/@YouTubeDrawaria/videos');
        }
    });
})();