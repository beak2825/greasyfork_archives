// ==UserScript==
// @name         Extractor de Contenido de Waze Discuss (desde Archivos TXT)
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  Extrae contenido (texto e imágenes incrustadas) de posts del foro Waze Discuss (URLs desde archivos .txt) y genera archivos HTML.
// @author       Annthizze
// @license      MIT
// @match        *://www.waze.com/discuss/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/536891/Extractor%20de%20Contenido%20de%20Waze%20Discuss%20%28desde%20Archivos%20TXT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536891/Extractor%20de%20Contenido%20de%20Waze%20Discuss%20%28desde%20Archivos%20TXT%29.meta.js
// ==/UserScript==

/*
MIT License
Copyright (c) 2024 Annthizze
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

console.log(">>> WAZE EXTRACTOR SCRIPT (v0.9.1) PARSED AND EXECUTING IIFE <<<");

(function() {
    try {
        'use strict';
        console.log("--- WAZE EXTRACTOR SCRIPT START (v0.9.1) ---");

        const SCRIPT_STATE_KEY = 'forumContentExtractorState_v4_9_1';
        let buttonAddInterval;

        // --- Funciones de la Barra de Progreso ---
        function showProgressBar() {
            let overlay = document.getElementById('custom-progress-overlay-waze');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'custom-progress-overlay-waze';
                overlay.style.position = 'fixed';
                overlay.style.bottom = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.padding = '10px 0';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
                overlay.style.zIndex = '10001';
                overlay.style.display = 'flex';
                overlay.style.justifyContent = 'center';
                overlay.style.alignItems = 'center';
                overlay.style.color = '#fff';

                const progressBarContainer = document.createElement('div');
                progressBarContainer.id = 'custom-progress-bar-waze';
                progressBarContainer.style.width = 'clamp(350px, 80%, 700px)';
                progressBarContainer.style.backgroundColor = '#333';
                progressBarContainer.style.padding = '20px';
                progressBarContainer.style.borderRadius = '8px';
                progressBarContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
                progressBarContainer.style.textAlign = 'left';
                progressBarContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

                const overallProgressText = document.createElement('div');
                overallProgressText.id = 'custom-overall-progress-text-waze';
                overallProgressText.style.marginBottom = '8px';
                overallProgressText.style.fontSize = '15px';
                overallProgressText.style.fontWeight = 'bold';
                progressBarContainer.appendChild(overallProgressText);

                const currentFileProgressText = document.createElement('div');
                currentFileProgressText.id = 'custom-current-file-progress-text-waze';
                currentFileProgressText.style.marginBottom = '10px';
                currentFileProgressText.style.fontSize = '13px';
                progressBarContainer.appendChild(currentFileProgressText);

                const progressVisual = document.createElement('div');
                progressVisual.style.width = '100%';
                progressVisual.style.backgroundColor = '#555';
                progressVisual.style.borderRadius = '4px';
                progressVisual.style.height = '22px';
                progressVisual.style.overflow = 'hidden';

                const progressVisualInner = document.createElement('div');
                progressVisualInner.id = 'custom-progress-visual-inner-waze';
                progressVisualInner.style.width = '0%';
                progressVisualInner.style.height = '100%';
                progressVisualInner.style.backgroundColor = '#007bff';
                progressVisualInner.style.borderRadius = '4px';
                progressVisualInner.style.transition = 'width 0.2s ease-in-out, background-color 0.2s ease-in-out';
                progressVisual.appendChild(progressVisualInner);
                progressBarContainer.appendChild(progressVisual);

                const closeButton = document.createElement('button');
                closeButton.id = 'custom-progress-close-waze';
                closeButton.textContent = 'Cerrar';
                closeButton.style.marginTop = '20px';
                closeButton.style.padding = '10px 18px';
                closeButton.style.border = 'none';
                closeButton.style.borderRadius = '4px';
                closeButton.style.background = '#6c757d';
                closeButton.style.color = 'white';
                closeButton.style.cursor = 'pointer';
                closeButton.style.float = 'right';
                closeButton.onclick = hideProgressBar;
                progressBarContainer.appendChild(closeButton);

                overlay.appendChild(progressBarContainer);
                document.body.appendChild(overlay);
            }
            overlay.style.display = 'flex';
            updateProgressBar(0, 1, 0, 1, "Iniciando proceso...", "");
        }

        function updateProgressBar(fileNum, totalFiles, linkNum, totalLinksInFile, overallMessage, currentFileMessage) {
            const overlay = document.getElementById('custom-progress-overlay-waze');
            if (!overlay || overlay.style.display === 'none') return;

            const overallTextElement = document.getElementById('custom-overall-progress-text-waze');
            const currentFileTextElement = document.getElementById('custom-current-file-progress-text-waze');
            const visualInner = document.getElementById('custom-progress-visual-inner-waze');

            if (overallTextElement) overallTextElement.textContent = overallMessage;
            if (currentFileTextElement) currentFileTextElement.textContent = currentFileMessage;

            if (visualInner) {
                const percentage = totalLinksInFile > 0 ? (linkNum / totalLinksInFile) * 100 : 0;
                visualInner.style.width = `${percentage}%`;
                if (linkNum === totalLinksInFile && totalLinksInFile > 0) {
                    visualInner.style.backgroundColor = '#28a745'; // Verde para completado
                    setTimeout(() => {
                        // Volver a azul solo si hay más archivos Y la barra sigue siendo verde
                        if (fileNum < totalFiles && visualInner.style.backgroundColor === 'rgb(40, 167, 69)') {
                            visualInner.style.backgroundColor = '#007bff';
                        }
                    }, 700); // Un poco más de tiempo para ver el verde
                } else if (linkNum < totalLinksInFile) {
                    visualInner.style.backgroundColor = '#007bff'; // Azul para en progreso
                } else if (totalLinksInFile === 0) { // Si el archivo no tenía enlaces válidos
                     visualInner.style.width = `100%`;
                     visualInner.style.backgroundColor = '#ffc107'; // Amarillo para advertencia
                }
            }
        }

        function setProgressCompleteAll(message) {
            const overlay = document.getElementById('custom-progress-overlay-waze');
            if (!overlay || overlay.style.display === 'none') return;
            const overallTextElement = document.getElementById('custom-overall-progress-text-waze');
            const currentFileTextElement = document.getElementById('custom-current-file-progress-text-waze');
            const visualInner = document.getElementById('custom-progress-visual-inner-waze');

            if (overallTextElement) overallTextElement.textContent = message;
            if (currentFileTextElement) currentFileTextElement.textContent = "Todos los archivos procesados.";
            if (visualInner) {
                visualInner.style.width = '100%';
                visualInner.style.backgroundColor = '#28a745';
            }
        }

        function hideProgressBar() {
            const overlay = document.getElementById('custom-progress-overlay-waze');
            if (overlay) {
                overlay.style.display = 'none';
            }
        }

        function fetchImageAsBase64(imageUrl) {
            return new Promise((resolve, reject) => {
                if (!imageUrl || typeof imageUrl !== 'string') {
                    console.warn(`[Base64 Fetch] URL de imagen inválida proporcionada: ${imageUrl}`);
                    reject(`URL de imagen inválida: ${imageUrl}`);
                    return;
                }
                if (imageUrl.startsWith('data:')) {
                    resolve(imageUrl);
                    return;
                }
                let absoluteImageUrl = imageUrl;
                if (imageUrl.startsWith('/')) {
                    try {
                        absoluteImageUrl = new URL(imageUrl, window.location.origin).href;
                    } catch (e) {
                        console.error(`[Base64 Fetch] Error creando URL absoluta para ${imageUrl}:`, e);
                        reject(`Error creando URL absoluta: ${e.message}`);
                        return;
                    }
                }

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: absoluteImageUrl,
                    responseType: 'blob',
                    overrideMimeType: 'application/octet-stream',
                    timeout: 30000,
                    onload: function(response) {
                        if (response.status === 200 || response.status === 0) {
                            const reader = new FileReader();
                            reader.onloadend = function() { resolve(reader.result); };
                            reader.onerror = function(error) {
                                console.error(`[Base64 Fetch] FileReader error for ${absoluteImageUrl}:`, error);
                                reject(`FileReader error: ${error.toString()}`);
                            };
                            reader.readAsDataURL(response.response);
                        } else {
                            console.error(`[Base64 Fetch] Failed to fetch image ${absoluteImageUrl}. Status: ${response.status}`);
                            reject(`Failed to fetch image: ${response.status}`);
                        }
                    },
                    onerror: function(error) {
                        console.error(`[Base64 Fetch] GM_xmlhttpRequest error for ${absoluteImageUrl}:`, error);
                        reject(`GM_xmlhttpRequest error: ${error.error || 'Unknown network error'}`);
                    },
                    onabort: function() {
                        console.warn(`[Base64 Fetch] Image fetch aborted for ${absoluteImageUrl}`);
                        reject('Image fetch aborted');
                    },
                    ontimeout: function() {
                        console.warn(`[Base64 Fetch] Image fetch timed out for ${absoluteImageUrl}`);
                        reject('Image fetch timed out');
                    }
                });
            });
        }

        async function extractContentAndEmbedImagesInTab() {
            const pageUrl = window.location.href;
            let extractedArticlesData = [];
            let pageTitle = "Título no encontrado";
            let statusObject = {
                action: 'contentExtracted',
                sourceUrl: pageUrl,
                pageTitle: pageTitle,
                articlesData: [],
                error: null
            };

            console.log(`[Extractor Tab - ${pageUrl}] INICIO de extractContentAndEmbedImagesInTab.`);
            GM_log(`[Extractor Tab - ${pageUrl}] INICIO de extractContentAndEmbedImagesInTab.`);
            try {
                console.log(`[Extractor Tab - ${pageUrl}] Intentando extraer título.`);
                const titleElement = document.querySelector('.title-wrapper a.fancy-title span[dir="auto"], .title-wrapper h1[data-topic-id] a.fancy-title');
                if (titleElement) {
                    pageTitle = titleElement.textContent.trim();
                } else {
                    const h1Title = document.querySelector('.title-wrapper h1[data-topic-id]');
                    if (h1Title) {
                        const tempH1 = h1Title.cloneNode(true);
                        tempH1.querySelectorAll('.topic-statuses, .topic-category, .topic-header-extra').forEach(el => el.remove());
                        pageTitle = tempH1.textContent.trim();
                    }
                }
                statusObject.pageTitle = pageTitle;
                console.log(`[Extractor Tab - ${pageUrl}] Título encontrado: "${pageTitle}"`);

                const articles = Array.from(document.querySelectorAll('article[id^="post_"]')); // Convertir a Array para usar map
                console.log(`[Extractor Tab - ${pageUrl}] Artículos encontrados: ${articles.length}`);
                GM_log(`[Extractor Tab - ${pageUrl}] Artículos encontrados: ${articles.length}`);

                // Procesar artículos secuencialmente para mejor manejo de promesas de imágenes
                for (const article of articles) {
                    const postId = article.id;
                    const contentArea = article.querySelector('.cooked');
                    console.log(`[Extractor Tab - ${pageUrl}] Procesando artículo: ${postId}`);

                    if (contentArea) {
                        const clonedContentArea = contentArea.cloneNode(true);
                        const imagesInContent = Array.from(clonedContentArea.querySelectorAll('img'));
                        // console.log(`[Extractor Tab - ${pageUrl}] Imágenes en ${postId}: ${imagesInContent.length}`);

                        // Esperar a que todas las imágenes de ESTE artículo se procesen
                        await Promise.allSettled(imagesInContent.map(async (img) => {
                            const originalSrc = img.getAttribute('src');
                            if (originalSrc) {
                                try {
                                    const dataUrl = await fetchImageAsBase64(originalSrc);
                                    img.src = dataUrl;
                                } catch (error) {
                                    console.warn(`[Extractor Tab - ${pageUrl}] No se pudo convertir imagen para ${postId} (src: ${originalSrc.substring(0,50)}...):`, error);
                                    const errorSpan = document.createElement('span');
                                    errorSpan.style.color = 'red'; errorSpan.style.fontSize = '0.8em';
                                    errorSpan.textContent = ` [Error al cargar imagen: ${originalSrc.substring(0,30)}...] `;
                                    if(img.parentNode) img.parentNode.insertBefore(errorSpan, img.nextSibling);
                                }
                            }
                        }));
                        extractedArticlesData.push({ postId: postId, htmlContent: clonedContentArea.innerHTML });
                        console.log(`[Extractor Tab - ${pageUrl}] Contenido de ${postId} con imágenes procesadas.`);
                    } else { console.warn(`[Extractor Tab - ${pageUrl}] No se encontró .cooked en: ${postId}`); }
                }
                console.log(`[Extractor Tab - ${pageUrl}] Todos los artículos procesados.`);
                statusObject.articlesData = extractedArticlesData;

            } catch (e) {
                console.error(`[Extractor Tab - ${pageUrl}] ERROR CATASTRÓFICO durante la extracción:`, e);
                GM_log(`[Extractor Tab - ${pageUrl}] ERROR CATASTRÓFICO: ${e.message} ${e.stack}`);
                statusObject.error = e.message ? `${e.message} (Stack: ${e.stack})` : "Error desconocido en la pestaña de extracción.";
            } finally {
                console.log(`[Extractor Tab - ${pageUrl}] FINALLY: Enviando estado. Error: ${statusObject.error || 'Ninguno'}. Artículos: ${statusObject.articlesData.length}.`);
                GM_log(`[Extractor Tab - ${pageUrl}] FINALLY: Enviando estado. Error: ${statusObject.error || 'Ninguno'}. Artículos: ${statusObject.articlesData.length}.`);
                try {
                    GM_setValue(SCRIPT_STATE_KEY, JSON.stringify(statusObject));
                    console.log(`[Extractor Tab - ${pageUrl}] GM_setValue ejecutado con éxito.`);
                } catch (e_setvalue) {
                    console.error(`[Extractor Tab - ${pageUrl}] ERROR AL EJECUTAR GM_setValue:`, e_setvalue);
                    GM_log(`[Extractor Tab - ${pageUrl}] ERROR AL EJECUTAR GM_setValue: ${e_setvalue.message}`);
                }
            }
        }

        function generateAndDownloadHtml(dataForFile, baseFileName) {
            if (!dataForFile || dataForFile.length === 0) {
                console.warn(`No se extrajo contenido para ${baseFileName} o todas las páginas fallaron.`);
                return;
            }
            const fileName = `${baseFileName}.html`;
            let htmlContent = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Contenido de ${baseFileName} - Waze Discuss</title><style>
                            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; margin: 0; padding: 0; line-height: 1.6; background-color: #f8f8f8; color: #333; }
                            header { background-color: #333; color: white; padding: 1em; text-align: center; }
                            .container { max-width: 900px; margin: 20px auto; padding: 20px; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                            .page-entry { margin-bottom: 40px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
                            .page-source-url { margin-bottom: 5px; padding: 8px; background-color: #e9ecef; border-left: 4px solid #007bff; font-size: 0.9em; word-break: break-all; }
                            .page-source-url a { color: #0056b3; text-decoration: none; font-weight: bold; }
                            .page-source-url a:hover { text-decoration: underline; }
                            .page-title-header { font-size: 1.8em; color: #333; margin-top: 10px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
                            .post-article { margin-bottom: 25px; padding: 15px; border: 1px solid #e1e1e1; border-radius: 5px; background-color: #fdfdfd; }
                            .post-article h3.post-id-header { margin-top: 0; color: #555; font-size: 0.95em; border-bottom: 1px dotted #ccc; padding-bottom: 8px; margin-bottom: 12px; font-weight: normal; }
                            .cooked { font-size: 16px; color: #222; } .cooked p { margin: 0 0 1em 0; }
                            .cooked a { color: #007bff; text-decoration: none; } .cooked a:hover { text-decoration: underline; }
                            .cooked img { max-width: 100%; height: auto; margin: 0.5em 0; border: 1px solid #ddd; border-radius: 4px; display: block; background-color: #f9f9f9; }
                            .cooked blockquote { border-left: 4px solid #ccc; padding: 0.5em 1em; margin: 1em 0; background-color: #f9f9f9; color: #555; }
                            .cooked pre { background-color: #f5f5f5; padding: 1em; overflow-x: auto; border-radius: 4px; border: 1px solid #eee; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace; font-size: 0.9em;}
                            .cooked ul, .cooked ol { margin: 1em 0 1em 1.5em; padding-left: 1.5em; } .cooked li { margin-bottom: 0.5em; }
                            .cooked hr { border: 0; border-top: 1px solid #eee; margin: 2em 0; }
                            .cooked table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
                            .cooked th, .cooked td { border: 1px solid #ddd; padding: 8px; text-align: left; } .cooked th { background-color: #f2f2f2; }
                            .cooked h1, .cooked h2, .cooked h3, .cooked h4, .cooked h5, .cooked h6 { margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.3; color: #111; }
                            .cooked .emoji { width: 1.2em; height: 1.2em; vertical-align: -0.2em; }
                            .cooked { overflow-wrap: break-word; word-wrap: break-word; }
                            </style></head><body><header><h1>Contenido Extraído para ${baseFileName}</h1></header><div class="container">`;

            dataForFile.forEach(pageData => {
                htmlContent += `<section class="page-entry"><div class="page-source-url">
                            <p>Origen: <a href="${pageData.sourcePostUrl}" target="_blank">${pageData.sourcePostUrl}</a></p></div>
                            <h2 class="page-title-header">${pageData.pageTitle || "Título no disponible"}</h2>`;
                if (pageData.articles && pageData.articles.length > 0) {
                    pageData.articles.forEach(articleData => {
                        htmlContent += `<article class="post-article" id="source-${articleData.postId.replace('post_', 'article-')}">
                                    <h3 class="post-id-header">ID del Post: ${articleData.postId}</h3>
                                    <div class="cooked">${articleData.htmlContent}</div></article>`;
                    });
                } else {
                    htmlContent += `<p style="color: red; padding-left: 15px;">No se encontró contenido o hubo error.</p>`;
                    if(pageData.error) htmlContent += `<p style="color: orange; padding-left: 15px;">Detalle: ${pageData.error}</p>`;
                }
                htmlContent += `</section>`;
            });
            htmlContent += `</div></body></html>`;

            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = fileName; document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log(`Archivo HTML "${fileName}" generado.`);
        }

        async function processLinksForFile(links, baseFileName, fileNum, totalFiles) {
            let currentFileProcessedData = [];
            const totalLinksInThisFile = links.length;
            console.log(`[Extractor Main] Iniciando processLinksForFile para "${baseFileName}". Enlaces: ${totalLinksInThisFile}`);

            for (let i = 0; i < links.length; i++) {
                const url = links[i];
                const currentLinkNumInFile = i + 1;

                updateProgressBar(fileNum, totalFiles, currentLinkNumInFile, totalLinksInThisFile,
                    `Procesando Archivo ${fileNum} de ${totalFiles}: "${baseFileName}.txt"`,
                    `Enlace ${currentLinkNumInFile} de ${totalLinksInThisFile}: ${url.substring(0, 50)}...`);

                if (!url.includes('/t/')) {
                    console.warn(`[Extractor Main] URL omitida en ${baseFileName}.txt (no es /t/): ${url}`);
                    currentFileProcessedData.push({ sourcePostUrl: url, pageTitle: "N/A - URL Omitida", articles: [], error: "URL no válida (formato incorrecto)" });
                    await new Promise(resolve => setTimeout(resolve, 50));
                    continue;
                }

                GM_setValue(SCRIPT_STATE_KEY, JSON.stringify({ action: 'waitingForContent', forUrl: url }));
                console.log(`[Extractor Main] Abriendo pestaña para: ${url}`);
                const tab = GM_openInTab(url, { active: false, insert: true, setParent: true });
                let attempts = 0; const maxAttempts = 180; let extractedState = null; // Aumentado a ~6 minutos

                console.log(`[Extractor Main] Esperando estado de ${url} (max ${maxAttempts} intentos)`);
                while (attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 segundos por intento
                    const rawState = GM_getValue(SCRIPT_STATE_KEY, null);
                    if (attempts % 5 === 0) { // Loguear cada 10 segundos
                        console.log(`[Extractor Main] Intento ${attempts+1} para ${url}. RawState: ${rawState ? rawState.substring(0,100) + '...' : 'null'}`);
                    }
                    if (rawState) {
                        try {
                            extractedState = JSON.parse(rawState);
                            if (extractedState.sourceUrl === url && extractedState.action === 'contentExtracted') {
                                console.log(`[Extractor Main] Estado CORRECTO recibido de ${url}.`);
                                break;
                            } else {
                                extractedState = null;
                            }
                        } catch (e) {
                            console.error(`[Extractor Main] Error parseando estado para ${url}: ${e}. RawState: ${rawState}`);
                            extractedState = null;
                        }
                    }
                    attempts++;
                }
                if (attempts >= maxAttempts && !extractedState) {
                    console.warn(`[Extractor Main] TIMEOUT esperando estado para ${url} después de ${maxAttempts} intentos.`);
                }

                if (tab && typeof tab.close === 'function') { try { tab.close(); } catch (e) { /* Silenciar */ } }
                else if (tab && !tab.closed) { console.warn("[Extractor Main] La pestaña no se pudo cerrar programáticamente: ", tab); }


                if (extractedState && extractedState.action === 'contentExtracted') {
                    if (extractedState.error) {
                        console.error(`[Extractor Main] Error reportado por la pestaña ${url}: ${extractedState.error}`);
                        currentFileProcessedData.push({ sourcePostUrl: url, pageTitle: extractedState.pageTitle || "Error en Pestaña", articles: [], error: `Error en pestaña: ${extractedState.error}` });
                    } else if (extractedState.articlesData) {
                        currentFileProcessedData.push({
                            sourcePostUrl: extractedState.sourceUrl,
                            pageTitle: extractedState.pageTitle,
                            articles: extractedState.articlesData
                        });
                    } else {
                        console.warn(`[Extractor Main] Estado 'contentExtracted' de ${url} pero sin articlesData ni error explícito.`);
                        currentFileProcessedData.push({ sourcePostUrl: url, pageTitle: extractedState.pageTitle || "Datos Incompletos", articles: [], error: "Datos incompletos desde la pestaña (sin articlesData)." });
                    }
                } else {
                    console.warn(`[Extractor Main] Timeout o estado incorrecto final para: ${url}.`);
                    currentFileProcessedData.push({ sourcePostUrl: url, pageTitle: "Error en Extracción", articles: [], error: "Timeout o fallo al obtener datos de la pestaña." });
                }
                await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300)); // Pausa más corta entre enlaces
            }
            generateAndDownloadHtml(currentFileProcessedData, baseFileName);
            updateProgressBar(fileNum, totalFiles, totalLinksInThisFile, totalLinksInThisFile,
                `Archivo ${fileNum} de ${totalFiles}: "${baseFileName}.txt" completado.`,
                `Se generó "${baseFileName}.html".`);
        }

        async function processFiles(fileList) {
            showProgressBar();
            const totalFiles = fileList.length;
            for (let i = 0; i < totalFiles; i++) {
                const file = fileList[i];
                const fileNum = i + 1;
                const baseFileName = file.name.replace(/\.txt$/i, '');

                updateProgressBar(fileNum, totalFiles, 0, 1,
                    `Leyendo Archivo ${fileNum} de ${totalFiles}: "${file.name}"`,
                    "Preparando enlaces...");

                const reader = new FileReader();
                await new Promise((resolveFileProcessing, rejectFileProcessing) => {
                    reader.onload = async (e) => {
                        try {
                            const urlsString = e.target.result;
                            const urls = urlsString.replace(/\r\n/g, '\n').split('\n')
                                            .map(url => url.trim())
                                            .filter(url => url && url.startsWith('https://www.waze.com/discuss/t/'));
                            if (urls.length > 0) {
                                await processLinksForFile(urls, baseFileName, fileNum, totalFiles);
                            } else {
                                console.warn(`No se encontraron URLs válidas en ${file.name}`);
                                updateProgressBar(fileNum, totalFiles, 1, 1,
                                    `Archivo ${fileNum} de ${totalFiles}: "${file.name}" (sin URLs válidas)`,
                                    "No se generó HTML.");
                                await new Promise(r => setTimeout(r, 1500));
                            }
                            resolveFileProcessing();
                        } catch (processError) {
                            console.error(`Error procesando los enlaces del archivo ${file.name}:`, processError);
                            updateProgressBar(fileNum, totalFiles, 1, 1,
                                `Error procesando Archivo ${fileNum} de ${totalFiles}: "${file.name}"`,
                                `Error interno: ${processError.message}`);
                            await new Promise(r => setTimeout(r, 1500));
                            rejectFileProcessing(processError);
                        }
                    };
                    reader.onerror = async (e) => {
                        console.error(`Error leyendo el archivo ${file.name}:`, e);
                        updateProgressBar(fileNum, totalFiles, 1, 1,
                            `Error leyendo Archivo ${fileNum} de ${totalFiles}: "${file.name}"`,
                            "No se pudo procesar este archivo.");
                        await new Promise(r => setTimeout(r, 1500));
                        rejectFileProcessing(e);
                    };
                    reader.readAsText(file);
                });
                 if (i < totalFiles - 1) { // Pausa entre archivos, excepto para el último
                    console.log(`[Extractor Main] Pausa antes del siguiente archivo.`);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            setProgressCompleteAll(`¡Proceso finalizado! Se procesaron ${totalFiles} archivo(s).`);
            GM_setValue(SCRIPT_STATE_KEY, JSON.stringify({ action: 'idle' }));
        }

        function showFileInputDialog() {
            const existingDialog = document.getElementById('custom-file-input-dialog-waze');
            if (existingDialog) existingDialog.remove();

            const dialogOverlay = document.createElement('div');
            dialogOverlay.id = 'custom-file-input-dialog-waze';
            dialogOverlay.style.position = 'fixed'; dialogOverlay.style.top = '0'; dialogOverlay.style.left = '0';
            dialogOverlay.style.width = '100%'; dialogOverlay.style.height = '100%';
            dialogOverlay.style.backgroundColor = 'rgba(0,0,0,0.6)'; dialogOverlay.style.zIndex = '10000';
            dialogOverlay.style.display = 'flex'; dialogOverlay.style.alignItems = 'center'; dialogOverlay.style.justifyContent = 'center';

            const dialogContent = document.createElement('div');
            dialogContent.style.background = 'white'; dialogContent.style.padding = '25px'; dialogContent.style.borderRadius = '8px';
            dialogContent.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'; dialogContent.style.width = 'clamp(320px, 60vw, 600px)';
            dialogContent.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

            const title = document.createElement('h2');
            title.textContent = 'Seleccionar Archivos .txt con URLs';
            title.style.marginTop = '0'; title.style.marginBottom = '20px'; title.style.color = '#333';
            dialogContent.appendChild(title);

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'custom-file-input-waze';
            fileInput.multiple = true;
            fileInput.accept = '.txt';
            fileInput.style.display = 'block';
            fileInput.style.marginBottom = '20px';
            fileInput.style.padding = '10px';
            fileInput.style.border = '1px dashed #ccc';
            fileInput.style.borderRadius = '4px';
            fileInput.style.width = 'calc(100% - 22px)';
            dialogContent.appendChild(fileInput);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '20px'; buttonContainer.style.textAlign = 'right';

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancelar';
            cancelButton.style.padding = '10px 18px'; cancelButton.style.marginRight = '10px'; cancelButton.style.border = 'none';
            cancelButton.style.borderRadius = '4px'; cancelButton.style.background = '#6c757d'; cancelButton.style.color = 'white';
            cancelButton.style.cursor = 'pointer';
            cancelButton.onclick = () => dialogOverlay.remove();
            buttonContainer.appendChild(cancelButton);

            const processButton = document.createElement('button');
            processButton.textContent = 'Procesar Archivos';
            processButton.style.padding = '10px 18px'; processButton.style.border = 'none';
            processButton.style.borderRadius = '4px'; processButton.style.background = '#007bff'; processButton.style.color = 'white';
            processButton.style.cursor = 'pointer';

            processButton.onclick = () => {
                const files = fileInput.files;
                if (files.length === 0) {
                    alert("Por favor, selecciona al menos un archivo .txt.");
                    return;
                }
                dialogOverlay.remove();
                GM_setValue(SCRIPT_STATE_KEY, JSON.stringify({ action: 'idle' }));
                processFiles(files);
            };
            buttonContainer.appendChild(processButton);
            dialogContent.appendChild(buttonContainer);
            dialogOverlay.appendChild(dialogContent);
            document.body.appendChild(dialogOverlay);
        }

        function createActualButtonElement() {
            const button = document.createElement('button');
            button.id = 'custom-export-content-button-waze';
            button.className = 'btn no-text btn-icon icon btn-flat';
            button.title = 'Extraer Contenido desde Archivos .txt';
            button.innerHTML = `<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 1em; height: 1em; vertical-align: middle;"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>`;
            button.addEventListener('click', showFileInputDialog);
            return button;
        }

        function tryAddExportButton() {
            if (document.getElementById('custom-export-content-button-waze')) {
                return true;
            }
            const targetUl = document.querySelector('ul.icons.d-header-icons');
            if (targetUl) {
                const newLi = document.createElement('li');
                newLi.id = 'custom-export-content-li-waze';
                newLi.appendChild(createActualButtonElement());
                targetUl.prepend(newLi);
                console.log('[Extractor Contenido Waze] Botón añadido a ul.icons.d-header-icons.');
                return true;
            }
            const headerButtonsContainer = document.querySelector('.d-header .panel .header-buttons');
            if (headerButtonsContainer) {
                 headerButtonsContainer.prepend(createActualButtonElement());
                 console.log('[Extractor Contenido Waze] Botón añadido a .d-header .panel .header-buttons (fallback 1).');
                 return true;
            }
            const panelDiv = document.querySelector('.d-header div.panel[role="navigation"]');
             if (panelDiv) {
                const existingButton = panelDiv.querySelector('#custom-export-content-button-waze');
                if (!existingButton) {
                    panelDiv.prepend(createActualButtonElement());
                    console.log('[Extractor Contenido Waze] Botón añadido a .d-header .panel (fallback 2).');
                    return true;
                }
            }
            const dHeader = document.querySelector('.d-header');
            if (dHeader) {
                const existingButton = dHeader.querySelector('#custom-export-content-button-waze');
                 if (!existingButton) {
                    const buttonWrapper = document.createElement('div');
                    buttonWrapper.style.display = 'inline-block';
                    buttonWrapper.appendChild(createActualButtonElement());
                    dHeader.prepend(buttonWrapper);
                    console.log('[Extractor Contenido Waze] Botón añadido directamente a .d-header (fallback 3 - last resort).');
                    return true;
                }
            }
            return false;
        }

        // --- Lógica de Ejecución ---
        if (window.location.hostname === 'www.waze.com' && window.location.pathname.startsWith('/discuss')) {
            console.log('[Extractor Contenido Waze] Página de Waze Discuss detectada.');
            const currentStateRawButtonCheck = GM_getValue(SCRIPT_STATE_KEY, null);
            let isProcessingTabForButton = false;
            if (currentStateRawButtonCheck) {
                try {
                    const currentState = JSON.parse(currentStateRawButtonCheck);
                    if (currentState.action === 'waitingForContent' && window.location.href.startsWith(currentState.forUrl)) {
                        isProcessingTabForButton = true;
                    }
                } catch (e) { console.error("[Extractor Contenido Waze] Error parseando SCRIPT_STATE_KEY para chequeo de botón:", e); }
            }

            if (!isProcessingTabForButton) {
                console.log('[Extractor Contenido Waze] Preparando para añadir botón de exportación usando setInterval.');
                let attempts = 0;
                if (buttonAddInterval) clearInterval(buttonAddInterval);
                buttonAddInterval = setInterval(() => {
                    if (tryAddExportButton() || attempts >= 20) {
                        clearInterval(buttonAddInterval);
                        if (attempts >= 20 && !document.getElementById('custom-export-content-button-waze')) {
                            console.warn('[Extractor Contenido Waze] No se pudo añadir el botón después de varios intentos con setInterval.');
                        }
                    }
                    attempts++;
                }, 1000);
            }
        }

        const currentStateRawExtractCheck = GM_getValue(SCRIPT_STATE_KEY, null);
        if (currentStateRawExtractCheck &&
            window.location.hostname === 'www.waze.com' &&
            window.location.pathname.startsWith('/discuss/t/')) {
            try {
                const currentState = JSON.parse(currentStateRawExtractCheck);
                if (currentState.action === 'waitingForContent' && window.location.href.startsWith(currentState.forUrl)) {
                    console.log(`[Extractor Tab - ${window.location.href}] Pestaña de procesamiento detectada. Iniciando extracción en 5s.`);
                    setTimeout(extractContentAndEmbedImagesInTab, 5000);
                }
            } catch (e) { console.error("[Extractor Contenido Waze] Error parseando SCRIPT_STATE_KEY para chequeo de extracción:", e); }
        }

        const initialState = GM_getValue(SCRIPT_STATE_KEY, null);
        if (initialState) {
            try {
                if (JSON.parse(initialState).action === 'contentExtracted') {
                    GM_setValue(SCRIPT_STATE_KEY, JSON.stringify({ action: 'idle' }));
                }
            } catch (e) {
                 console.error("[Extractor Contenido Waze] Error parseando SCRIPT_STATE_KEY para reseteo a idle:", e);
                 GM_setValue(SCRIPT_STATE_KEY, JSON.stringify({ action: 'idle' }));
            }
        } else {
            GM_setValue(SCRIPT_STATE_KEY, JSON.stringify({ action: 'idle' }));
        }
        console.log('[Extractor Contenido Waze Discuss] Script cargado. Autor: Annthizze, Licencia: MIT. Versión: 0.8.9');

    } catch (e) {
        console.error("ERROR GLOBAL EN EL SCRIPT WAZE EXTRACTOR (v0.8.9):", e);
        GM_log("ERROR GLOBAL EN EL SCRIPT WAZE EXTRACTOR (v0.8.9): " + e.message + " Stack: " + e.stack);
    }
})();
