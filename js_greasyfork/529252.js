// ==UserScript==
// @name         KDS-T Viewer Downloader + Screenshot (Limitado por iframes)
// @namespace    kds-t-viewer-downloader
// @version      0.5
// @description  Intenta descargar <img> o capturar con html2canvas, pero NO funcionará si el manga está en un iframe de otro dominio.
// @match        https://kds-t.jp/viewer/*
// @require      https://cdn.jsdelivr.net/npm/jszip@3/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2/dist/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529252/KDS-T%20Viewer%20Downloader%20%2B%20Screenshot%20%28Limitado%20por%20iframes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529252/KDS-T%20Viewer%20Downloader%20%2B%20Screenshot%20%28Limitado%20por%20iframes%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CREAR BOTONES ---
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Descargar Imágenes <img>';
    styleButton(downloadBtn, 10);

    const screenshotBtn = document.createElement('button');
    screenshotBtn.textContent = 'Captura de Pantalla (html2canvas)';
    styleButton(screenshotBtn, 60);

    document.body.appendChild(downloadBtn);
    document.body.appendChild(screenshotBtn);

    // --- EVENTO: DESCARGAR IMÁGENES (DIRECTAS) ---
    downloadBtn.addEventListener('click', async () => {
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Descargando...';

        try {
            // Buscar <img> en la página
            const imgElements = Array.from(document.querySelectorAll('img'));
            const imageUrls = imgElements.map(img => img.src).filter(src => src);

            if (!imageUrls.length) {
                alert('No se encontraron imágenes <img>. Probablemente el visor use <canvas> o un iframe distinto.');
                resetDownloadBtn();
                return;
            }

            console.log('Imágenes encontradas:', imageUrls);

            // Crear el ZIP
            const zip = new JSZip();
            for (let i = 0; i < imageUrls.length; i++) {
                const url = imageUrls[i];
                console.log(`Descargando imagen ${i+1}: ${url}`);
                const response = await fetch(url);
                const blob = await response.blob();
                const fileName = String(i+1).padStart(3, '0') + '.jpg';
                zip.file(fileName, blob);
            }

            // Generar el ZIP
            const zipContent = await zip.generateAsync({ type: 'blob' });
            saveAs(zipContent, 'kds_t_imagenes.zip');
            alert(`Descarga completa: ${imageUrls.length} imágenes.`);
        } catch (error) {
            console.error('Error al descargar imágenes:', error);
            alert('Ocurrió un error. Revisa la consola para más detalles.');
        }

        resetDownloadBtn();
    });

    // --- EVENTO: CAPTURA DE PANTALLA (HTML2CANVAS) ---
    screenshotBtn.addEventListener('click', async () => {
        screenshotBtn.disabled = true;
        screenshotBtn.textContent = 'Capturando...';

        try {
            // html2canvas NO puede ver dentro de iframes de otro dominio
            const canvas = await html2canvas(document.body, {
                useCORS: true
            });
            canvas.toBlob(function(blob) {
                saveAs(blob, 'captura_kds_t.png');
            });
            alert('Captura finalizada. Imagen guardada como captura_kds_t.png');
        } catch (error) {
            console.error('Error en la captura de pantalla:', error);
            alert('Ocurrió un error. Revisa la consola para más detalles.');
        }

        resetScreenshotBtn();
    });

    // --- FUNCIONES DE ESTILO Y RESETEO ---
    function styleButton(btn, topPx) {
        btn.style.position = 'fixed';
        btn.style.top = `${topPx}px`;
        btn.style.right = '10px';
        btn.style.zIndex = '9999';
        btn.style.background = '#6e8efb';
        btn.style.color = '#fff';
        btn.style.padding = '8px 12px';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
    }

    function resetDownloadBtn() {
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Descargar Imágenes <img>';
    }

    function resetScreenshotBtn() {
        screenshotBtn.disabled = false;
        screenshotBtn.textContent = 'Captura de Pantalla (html2canvas)';
    }
})();
