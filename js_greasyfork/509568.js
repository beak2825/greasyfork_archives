// ==UserScript==
// @name         Auto Save New Videos - hailuoai.com
// @namespace    https://hailuoai.com/
// @version      1.4
// @description  Revisa cada 5 segundos si hay nuevos videos y los descarga automáticamente en https://hailuoai.com/video
// @author       https://doujinblog.org/
// @match        https://hailuoai.com/video
// @license      MIT
// @grant        https://doujinblog.org/
// @downloadURL https://update.greasyfork.org/scripts/509568/Auto%20Save%20New%20Videos%20-%20hailuoaicom.user.js
// @updateURL https://update.greasyfork.org/scripts/509568/Auto%20Save%20New%20Videos%20-%20hailuoaicom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variable para almacenar los videos que ya se han descargado
    const downloadedVideos = new Set();

    // Función para descargar un video
    function downloadVideo(videoUrl, fileName) {
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = fileName || 'video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Función que revisa la página en busca de nuevos videos
    function checkForNewVideos() {
        // Obtenemos todos los elementos <video> en la página
        const videos = document.querySelectorAll('video');

        videos.forEach(videoElement => {
            const videoUrl = videoElement.src;

            // Si el video tiene una URL y aún no ha sido descargado
            if (videoUrl && !downloadedVideos.has(videoUrl)) {
                // Agregamos el video a la lista de descargados
                downloadedVideos.add(videoUrl);

                // Descargamos el video automáticamente
                const timestamp = new Date().toISOString().replace(/:/g, '-');
                downloadVideo(videoUrl, `video-${timestamp}.mp4`);

                console.log(`Video descargado: ${videoUrl}`);
            }
        });
    }

    // Ejecutar la función de revisión cada 10 segundos
    setInterval(checkForNewVideos, 5000); // 5000 ms = 50 segundos

    console.log('El script está revisando nuevos videos cada 5 segundos.');
})();