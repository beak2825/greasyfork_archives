// ==UserScript==
// @name         YNJN Híbrido (IMG + Canvas) Downloader
// @namespace    ynjn-downloader
// @version      1.4
// @description  Descarga más imágenes: <img> y <canvas> grandes de capítulos YNJN en un ZIP
// @match        https://ynjn.jp/*
// @require      https://cdn.jsdelivr.net/npm/jszip@3/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2/dist/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527279/YNJN%20H%C3%ADbrido%20%28IMG%20%2B%20Canvas%29%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/527279/YNJN%20H%C3%ADbrido%20%28IMG%20%2B%20Canvas%29%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ajusta estos valores si quieres filtrar por un tamaño menor o mayor
    const MIN_WIDTH  = 200;
    const MIN_HEIGHT = 200;

    function waitForPageLoad(callback) {
        if (document.readyState === 'complete') {
            callback();
        } else {
            window.addEventListener('load', callback);
        }
    }

    waitForPageLoad(() => {
        console.log("🔰 [YNJN Híbrido] Script activo.");

        // Crear botón flotante
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Descargar Páginas (IMG+Canvas)';
        downloadBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: #e63946;
            color: #fff;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        document.body.appendChild(downloadBtn);

        downloadBtn.addEventListener('click', async () => {
            downloadBtn.disabled = true;
            downloadBtn.textContent = 'Cargando y detectando...';

            // 1. Hacer scroll infinito para cargar todo
            await infiniteScroll();

            // 2. Recolectar imágenes <img> grandes
            const bigImgUrls = gatherBigImages(MIN_WIDTH, MIN_HEIGHT);
            console.log(`[YNJN Híbrido] <img> detectadas: ${bigImgUrls.length}`);

            // 3. Recolectar <canvas> grandes
            const bigCanvas = gatherBigCanvas(MIN_WIDTH, MIN_HEIGHT);
            console.log(`[YNJN Híbrido] <canvas> detectados: ${bigCanvas.length}`);

            // Si no hay nada, avisar
            if (!bigImgUrls.length && !bigCanvas.length) {
                alert(`⚠️ No se encontraron <img> ni <canvas> mayores a ${MIN_WIDTH}×${MIN_HEIGHT}.`);
                resetButton();
                return;
            }

            // 4. Descargar en un ZIP
            try {
                await downloadAllAsZip(bigImgUrls, bigCanvas);
            } catch (err) {
                console.error('❌ Error al descargar:', err);
                alert('⚠️ Error al descargar. Revisa la consola (F12) para más detalles.');
            }

            resetButton();
        });
    });

    /**
     * Scroll infinito: se repite hasta que la altura de la página no cambie
     * o se alcance un número máximo de intentos.
     */
    async function infiniteScroll() {
        return new Promise(resolve => {
            let lastHeight = 0;
            let sameCount = 0;
            const distance = 600;
            const maxTries = 10;

            const timer = setInterval(() => {
                const currentHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);

                // Si la altura no cambió, contamos un intento
                if (document.body.scrollHeight === currentHeight) {
                    sameCount++;
                } else {
                    sameCount = 0;
                }

                // Si llevamos muchos intentos sin cambio, paramos
                if (sameCount >= 3) {
                    clearInterval(timer);
                    setTimeout(resolve, 1000); // Esperar un poco más
                }

            }, 700);
        });
    }

    /**
     * Recolectar URLs de <img> que tengan un ancho/alto >= minW, minH.
     */
    function gatherBigImages(minW, minH) {
        const imgs = Array.from(document.querySelectorAll('img'));
        const result = [];
        for (const img of imgs) {
            if (img.naturalWidth >= minW && img.naturalHeight >= minH) {
                // Usamos .src como URL
                result.push(img.src);
            }
        }
        return Array.from(new Set(result)); // quitar duplicados
    }

    /**
     * Recolectar <canvas> con ancho/alto >= minW, minH.
     */
    function gatherBigCanvas(minW, minH) {
        const canvases = Array.from(document.querySelectorAll('canvas'));
        return canvases.filter(cv => cv.width >= minW && cv.height >= minH);
    }

    /**
     * Descarga en un ZIP:
     * - <img> como JPG
     * - <canvas> como PNG
     */
    async function downloadAllAsZip(imgUrls, canvasEls) {
        const zip = new JSZip();
        let imgCount = 0;
        let canvasCount = 0;

        // 1) Descargar cada imagen <img> como .jpg
        for (let i = 0; i < imgUrls.length; i++) {
            const url = imgUrls[i];
            try {
                const resp = await fetch(url);
                const blob = await resp.blob();
                const filename = `img_${String(i+1).padStart(3, '0')}.jpg`;
                zip.file(filename, blob);
                imgCount++;
            } catch (err) {
                console.error(`Error al descargar ${url}`, err);
            }
        }

        // 2) Guardar cada <canvas> como PNG
        for (let c = 0; c < canvasEls.length; c++) {
            const cv = canvasEls[c];
            try {
                // Intentar convertir a DataURL PNG
                const dataURL = cv.toDataURL('image/png');
                // Pasar DataURL a Blob
                const blob = await (await fetch(dataURL)).blob();
                const filename = `canvas_${String(c+1).padStart(3, '0')}.png`;
                zip.file(filename, blob);
                canvasCount++;
            } catch (err) {
                console.error(`Error al convertir canvas #${c+1}`, err);
            }
        }

        // 3) Generar el ZIP
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, 'ynjn_pages.zip');
        alert(`✅ Descarga completa: ${imgCount} <img> + ${canvasCount} <canvas>`);
    }

    function resetButton() {
        const btn = document.querySelector('button');
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Descargar Páginas (IMG+Canvas)';
        }
    }
})();
