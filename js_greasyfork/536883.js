// ==UserScript==
// @name         Extractor de Contenido de Foro Waze Discuss con enlaces http
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Extrae contenido (texto e imágenes incrustadas) de posts del foro de Waze Discuss y genera un archivo HTML. El textarea de URLs se vacía al finalizar.
// @author       Annthizze (Modificaciones por Asistente AI)
// @license      MIT
// @match        *://www.waze.com/discuss/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/536883/Extractor%20de%20Contenido%20de%20Foro%20Waze%20Discuss%20con%20enlaces%20http.user.js
// @updateURL https://update.greasyfork.org/scripts/536883/Extractor%20de%20Contenido%20de%20Foro%20Waze%20Discuss%20con%20enlaces%20http.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_STATE_KEY = 'forumContentExtractorState_v4';
    const URL_LIST_KEY = 'forumContentUrlListToScrape_v3'; // Clave para las URLs en el textarea
    let allProcessedPostsData = [];
    let buttonInterval;
    let initialParentInstructionForThisChildTab = null;

    // Variables para ETA
    let etaIntervalId = null;
    let batchStartTimeForEta = 0;
    let processedValidLinksForEta = 0;
    let totalValidLinksForEta = 0;

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return "Calculando...";
        }
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        let str = "";
        if (h > 0) str += `${h}h `;
        if (m > 0 || h > 0) str += `${m}m `;
        str += `${s}s`;
        return str.trim() || "0s";
    }

    function updateEtaTextDisplay(etaSeconds) {
        const etaElement = document.getElementById('custom-progress-eta-waze');
        if (etaElement) {
            if (etaSeconds === null) {
                etaElement.textContent = 'ETA: Calculando...';
            } else if (etaSeconds >= 0) {
                etaElement.textContent = `ETA: ${formatTime(etaSeconds)}`;
            } else {
                etaElement.textContent = 'ETA: Finalizado';
            }
        }
    }

    function startEtaTimer() {
        stopEtaTimer();
        if (totalValidLinksForEta <= 0) {
            updateEtaTextDisplay(-1);
            return;
        }
        updateEtaTextDisplay(null);
        etaIntervalId = setInterval(() => {
            if (processedValidLinksForEta === 0 && totalValidLinksForEta > 0) {
                updateEtaTextDisplay(null);
                return;
            }
            if (processedValidLinksForEta >= totalValidLinksForEta) {
                updateEtaTextDisplay(-1);
                stopEtaTimer();
                return;
            }
            const elapsedTime = (Date.now() - batchStartTimeForEta) / 1000;
            const avgTimePerLink = elapsedTime / processedValidLinksForEta;
            const remainingLinks = totalValidLinksForEta - processedValidLinksForEta;
            const estimatedRemainingSeconds = avgTimePerLink * remainingLinks;
            updateEtaTextDisplay(estimatedRemainingSeconds);
        }, 1000);
    }

    function stopEtaTimer() {
        if (etaIntervalId) {
            clearInterval(etaIntervalId);
            etaIntervalId = null;
        }
    }

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
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            overlay.style.zIndex = '10001';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            const progressBarContainer = document.createElement('div');
            progressBarContainer.id = 'custom-progress-bar-waze';
            progressBarContainer.style.width = 'clamp(300px, 80%, 600px)';
            progressBarContainer.style.backgroundColor = '#f3f3f3';
            progressBarContainer.style.padding = '15px';
            progressBarContainer.style.borderRadius = '8px';
            progressBarContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
            progressBarContainer.style.textAlign = 'center';
            progressBarContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';
            const progressText = document.createElement('div');
            progressText.id = 'custom-progress-text-waze';
            progressText.style.marginBottom = '5px';
            progressText.style.color = '#333';
            progressText.style.fontSize = '14px';
            progressBarContainer.appendChild(progressText);
            const etaTextElement = document.createElement('div');
            etaTextElement.id = 'custom-progress-eta-waze';
            etaTextElement.style.marginBottom = '10px';
            etaTextElement.style.color = '#555';
            etaTextElement.style.fontSize = '12px';
            progressBarContainer.appendChild(etaTextElement);
            const progressVisual = document.createElement('div');
            progressVisual.id = 'custom-progress-visual-waze';
            progressVisual.style.width = '100%';
            progressVisual.style.backgroundColor = '#ddd';
            progressVisual.style.borderRadius = '4px';
            progressVisual.style.height = '20px';
            progressVisual.style.overflow = 'hidden';
            const progressVisualInner = document.createElement('div');
            progressVisualInner.id = 'custom-progress-visual-inner-waze';
            progressVisualInner.style.width = '0%';
            progressVisualInner.style.height = '100%';
            progressVisualInner.style.backgroundColor = '#007bff';
            progressVisualInner.style.borderRadius = '4px';
            progressVisualInner.style.transition = 'width 0.3s ease-in-out, background-color 0.3s ease-in-out';
            progressVisual.appendChild(progressVisualInner);
            progressBarContainer.appendChild(progressVisual);
            const closeButton = document.createElement('button');
            closeButton.id = 'custom-progress-close-waze';
            closeButton.textContent = 'Cerrar';
            closeButton.style.marginTop = '15px';
            closeButton.style.padding = '8px 15px';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '4px';
            closeButton.style.background = '#6c757d';
            closeButton.style.color = 'white';
            closeButton.style.cursor = 'pointer';
            closeButton.onclick = () => {
                hideProgressBar();
                stopEtaTimer();
            };
            progressBarContainer.appendChild(closeButton);
            overlay.appendChild(progressBarContainer);
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'flex';
        const progressVisualInner = document.getElementById('custom-progress-visual-inner-waze');
        if (progressVisualInner) progressVisualInner.style.backgroundColor = '#007bff';
        updateProgressBar(0, 1, "Iniciando proceso...");
        updateEtaTextDisplay(null);
    }

    function updateProgressBar(current, total, message = null) {
        const overlay = document.getElementById('custom-progress-overlay-waze');
        if (!overlay || overlay.style.display === 'none') return;
        const textElement = document.getElementById('custom-progress-text-waze');
        const visualInner = document.getElementById('custom-progress-visual-inner-waze');
        if (textElement) {
            textElement.textContent = message || `Procesando ${current} de ${total}...`;
        }
        if (visualInner) {
            const percentage = total > 0 ? (current / total) * 100 : (current > 0 ? 100 : 0);
            visualInner.style.width = `${percentage}%`;
        }
    }

    function hideProgressBar() { stopEtaTimer(); const overlay = document.getElementById('custom-progress-overlay-waze'); if (overlay) { overlay.style.display = 'none'; } }
    function fetchImageAsBase64(imageUrl) { /* ... (sin cambios, omitido por brevedad) ... */ return new Promise((resolve, reject) => { if (imageUrl.startsWith('data:')) { resolve(imageUrl); return; } let absoluteImageUrl = imageUrl; if (imageUrl.startsWith('/')) { absoluteImageUrl = window.location.origin + imageUrl; } GM_xmlhttpRequest({ method: 'GET', url: absoluteImageUrl, responseType: 'blob', overrideMimeType: 'application/octet-stream', timeout: 30000, onload: function(response) { if (response.status === 200 || response.status === 0) { const reader = new FileReader(); reader.onloadend = function() { resolve(reader.result); }; reader.onerror = function(error) { console.error(`[Extractor Contenido] fetchImageAsBase64 - FileReader error for ${absoluteImageUrl}:`, error); reject(`FileReader error: ${error.toString()}`); }; reader.readAsDataURL(response.response); } else { console.error(`[Extractor Contenido] fetchImageAsBase64 - Failed to fetch image ${absoluteImageUrl}. Status: ${response.status} ${response.statusText}`); reject(`Failed to fetch image: ${response.status} ${response.statusText}`); } }, onerror: function(error) { console.error(`[Extractor Contenido] fetchImageAsBase64 - GM_xmlhttpRequest error for ${absoluteImageUrl}:`, error); reject(`GM_xmlhttpRequest error: ${error.error || 'Unknown GM_xmlhttpRequest error'}`); }, onabort: function() { console.warn(`[Extractor Contenido] fetchImageAsBase64 - Image fetch aborted for ${absoluteImageUrl}`); reject('Image fetch aborted'); }, ontimeout: function() { console.warn(`[Extractor Contenido] fetchImageAsBase64 - Image fetch timed out for ${absoluteImageUrl}`); reject('Image fetch timed out'); } }); }); }
    async function extractContentAndEmbedImagesInTab(parentInstruction) { /* ... (sin cambios, omitido por brevedad) ... */ const pageUrl = (parentInstruction && parentInstruction.forUrl) ? parentInstruction.forUrl : window.location.href; const batchIdToReport = (parentInstruction && parentInstruction.batchId) ? parentInstruction.batchId : null; console.log(`[Extractor Contenido - Hija ${pageUrl} (Batch: ${batchIdToReport})] Iniciando extracción.`); try { let extractedArticlesData = []; let pageTitle = "Título no encontrado"; console.log(`[Extractor Contenido - Hija ${pageUrl}] Buscando título...`); const titleElement = document.querySelector('.title-wrapper a.fancy-title span[dir="auto"], .title-wrapper h1[data-topic-id] a.fancy-title'); if (titleElement) { pageTitle = titleElement.textContent.trim(); } else { const h1Title = document.querySelector('.title-wrapper h1[data-topic-id]'); if (h1Title) { const tempH1 = h1Title.cloneNode(true); tempH1.querySelectorAll('.topic-statuses, .topic-category, .topic-header-extra').forEach(el => el.remove()); pageTitle = tempH1.textContent.trim(); } } console.log(`[Extractor Contenido - Hija ${pageUrl}] Título: "${pageTitle}"`); const articles = document.querySelectorAll('article[id^="post_"]'); console.log(`[Extractor Contenido - Hija ${pageUrl}] ${articles.length} artículos.`); if (articles.length === 0) { console.warn(`[Extractor Contenido - Hija ${pageUrl}] No se encontraron 'article[id^="post_"]'.`); } let pageProcessingPromises = []; for (let i = 0; i < articles.length; i++) { const article = articles[i]; const postId = article.id; console.log(`[Extractor Contenido - Hija ${pageUrl}] Art. ${i+1}/${articles.length}, ID: ${postId}`); const contentArea = article.querySelector('.cooked'); if (contentArea) { const clonedContentArea = contentArea.cloneNode(true); const imagesInContent = clonedContentArea.querySelectorAll('img'); console.log(`[Extractor Contenido - Hija ${pageUrl}] Art. ${postId}: ${imagesInContent.length} imágenes.`); let currentArticleImagePromises = []; imagesInContent.forEach((img, imgIdx) => { const originalSrc = img.getAttribute('src'); if (originalSrc) { console.log(`[Extractor Contenido - Hija ${pageUrl}] Art. ${postId}, Img ${imgIdx+1}: ${originalSrc.substring(0,100)}`); const promise = fetchImageAsBase64(originalSrc).then(dataUrl => { img.src = dataUrl; console.log(`[Extractor Contenido - Hija ${pageUrl}] Art. ${postId}, Img ${imgIdx+1}: OK.`); }).catch(error => { console.warn(`[Extractor Contenido - Hija ${pageUrl}] Art. ${postId}, Img ${imgIdx+1} ERROR: ${originalSrc.substring(0,50)}... :`, error); const errorSpan = document.createElement('span'); errorSpan.style.color = 'red'; errorSpan.style.fontSize = '0.8em'; errorSpan.textContent = ` [Err img: ${originalSrc.substring(0,30)}... (${error.toString().substring(0,30)})] `; if(img.parentNode) { img.parentNode.insertBefore(errorSpan, img.nextSibling); } }); currentArticleImagePromises.push(promise); } else { console.log(`[Extractor Contenido - Hija ${pageUrl}] Art. ${postId}, Img ${imgIdx+1}: No src.`); } }); const articlePromise = Promise.allSettled(currentArticleImagePromises).then((results) => { console.log(`[Extractor Contenido - Hija ${pageUrl}] Art. ${postId}: Promesas img resueltas.`); results.forEach(result => { if (result.status === 'rejected') { console.warn(`[Extractor Contenido - Hija ${pageUrl}] Art. ${postId}: Fallo promesa img:`, result.reason); } }); extractedArticlesData.push({ postId: postId, htmlContent: clonedContentArea.innerHTML }); }); pageProcessingPromises.push(articlePromise); } else { console.warn(`[Extractor Contenido - Hija ${pageUrl}] No .cooked: ${postId}`); } } Promise.allSettled(pageProcessingPromises).then(() => { console.log(`[Extractor Contenido - Hija ${pageUrl}] Procesamiento página OK. Enviando a principal.`); GM_setValue(SCRIPT_STATE_KEY, JSON.stringify({ action: 'contentExtracted', sourceUrl: pageUrl, pageTitle: pageTitle, articlesData: extractedArticlesData, batchId: batchIdToReport, timestamp: Date.now() })); }); } catch (error) { console.error(`[Extractor Contenido - Hija ${pageUrl}] ERROR CATASTRÓFICO:`, error); GM_setValue(SCRIPT_STATE_KEY, JSON.stringify({ action: 'extractionError', sourceUrl: pageUrl, error: error.toString() + (error.stack ? (' | Stack: ' + error.stack.substring(0, 200)) : ''), batchId: batchIdToReport, timestamp: Date.now() })); } }
    function generateAndDownloadHtml(successfullyExtractedCount, attemptedValidCount, skippedInvalidCount, totalInitial) { /* ... (sin cambios, omitido por brevedad) ... */ const actualContentEntries = allProcessedPostsData.filter(p => p.articles && p.articles.length > 0 && !p.error?.includes("URL no válida") && !p.error?.includes("formato incorrecto")); if (actualContentEntries.length === 0) { let message = "No se extrajo contenido procesable. "; if (totalInitial > 0 && skippedInvalidCount === totalInitial) { message += `Todas las ${totalInitial} URLs ingresadas eran inválidas o vacías.`; } else if (attemptedValidCount > 0 && successfullyExtractedCount === 0) { message += `Se intentaron procesar ${attemptedValidCount} URLs válidas, pero ninguna produjo contenido o todas fallaron (revise la consola para detalles).`; } else if (totalInitial === 0) { message = "No se ingresaron URLs para procesar."; } else { message += `Total URLs: ${totalInitial}, Válidas intentadas: ${attemptedValidCount}, Inválidas/Omitidas: ${skippedInvalidCount}.`; } alert(message); updateProgressBar(totalInitial, totalInitial, message); updateEtaTextDisplay(-1); const progressVisualInner = document.getElementById('custom-progress-visual-inner-waze'); if (progressVisualInner) progressVisualInner.style.backgroundColor = '#dc3545'; return; } const fileName = 'contenido_waze_discuss.html'; let htmlContent = ` <!DOCTYPE html> <html lang="es"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Contenido Extraído del Foro Waze Discuss</title> <style> body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; margin: 0; padding: 0; line-height: 1.6; background-color: #f8f8f8; color: #333; } header { background-color: #333; color: white; padding: 1em; text-align: center; } .container { max-width: 900px; margin: 20px auto; padding: 20px; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); } .page-entry { margin-bottom: 40px; border-bottom: 2px solid #007bff; padding-bottom: 20px; } .page-source-url { margin-bottom: 5px; padding: 8px; background-color: #e9ecef; border-left: 4px solid #007bff; font-size: 0.9em; word-break: break-all; } .page-source-url a { color: #0056b3; text-decoration: none; font-weight: bold; } .page-source-url a:hover { text-decoration: underline; } .page-title-header { font-size: 1.8em; color: #333; margin-top: 10px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee; } .post-article { margin-bottom: 25px; padding: 15px; border: 1px solid #e1e1e1; border-radius: 5px; background-color: #fdfdfd; } .post-article h3.post-id-header { margin-top: 0; color: #555; font-size: 0.95em; border-bottom: 1px dotted #ccc; padding-bottom: 8px; margin-bottom: 12px; font-weight: normal; } .cooked { font-size: 16px; color: #222; } .cooked p { margin: 0 0 1em 0; } .cooked a { color: #007bff; text-decoration: none; } .cooked a:hover { text-decoration: underline; } .cooked img { max-width: 100%; height: auto; margin: 0.5em 0; border: 1px solid #ddd; border-radius: 4px; display: block; background-color: #f9f9f9; } .cooked blockquote { border-left: 4px solid #ccc; padding: 0.5em 1em; margin: 1em 0; background-color: #f9f9f9; color: #555; } .cooked pre { background-color: #f5f5f5; padding: 1em; overflow-x: auto; border-radius: 4px; border: 1px solid #eee; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace; font-size: 0.9em;} .cooked ul, .cooked ol { margin: 1em 0 1em 1.5em; padding-left: 1.5em; } .cooked li { margin-bottom: 0.5em; } .cooked hr { border: 0; border-top: 1px solid #eee; margin: 2em 0; } .cooked table { border-collapse: collapse; width: 100%; margin-bottom: 1em; } .cooked th, .cooked td { border: 1px solid #ddd; padding: 8px; text-align: left; } .cooked th { background-color: #f2f2f2; } .cooked h1, .cooked h2, .cooked h3, .cooked h4, .cooked h5, .cooked h6 { margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.3; color: #111; } .cooked .emoji { width: 1.2em; height: 1.2em; vertical-align: -0.2em; } .cooked { overflow-wrap: break-word; word-wrap: break-word; } </style> </head> <body> <header><h1>Contenido Extraído del Foro Waze Discuss</h1></header> <div class="container"> `; allProcessedPostsData.forEach(pageData => { htmlContent += ` <section class="page-entry"> <div class="page-source-url"> <p>Origen: <a href="${pageData.sourcePostUrl}" target="_blank">${pageData.sourcePostUrl}</a></p> </div> <h2 class="page-title-header">${pageData.pageTitle || "Título no disponible"}</h2>`; if (pageData.articles && pageData.articles.length > 0) { pageData.articles.forEach(articleData => { htmlContent += ` <article class="post-article" id="source-${articleData.postId.replace('post_', 'article-')}"> <h3 class="post-id-header">ID del Post: ${articleData.postId}</h3> <div class="cooked"> ${articleData.htmlContent} </div> </article>`; }); } else { htmlContent += ` <p style="color: red; padding-left: 15px;">No se encontró contenido de artículos procesables o hubo un error en esta página.</p>`; if(pageData.error) { htmlContent += ` <p style="color: orange; padding-left: 15px;">Detalle: ${pageData.error}</p>`; } } htmlContent += `</section>`; }); htmlContent += ` </div> </body> </html>`; const blob = new Blob([htmlContent], { type: 'text/html' }); const fileUrl = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = fileUrl; a.download = fileName; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(fileUrl); let finalMessage = `¡Proceso completado! Se generó "${fileName}". `; finalMessage += `Total URLs ingresadas: ${totalInitial}. `; finalMessage += `Válidas intentadas: ${attemptedValidCount} (con contenido: ${successfullyExtractedCount}). `; finalMessage += `Inválidas/Omitidas: ${skippedInvalidCount}.`; updateProgressBar(totalInitial, totalInitial, finalMessage); updateEtaTextDisplay(-1); const progressVisualInner = document.getElementById('custom-progress-visual-inner-waze'); if (progressVisualInner) progressVisualInner.style.backgroundColor = '#28a745'; }

    async function processLinks(links) {
        allProcessedPostsData = [];
        const totalInitialLinks = links.length;
        let successfullyExtractedCount = 0;
        let attemptedValidLinks = 0;
        let skippedInvalidLinks = 0;
        const validUrlTasks = [];

        const currentBatchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        console.log(`[Extractor Contenido - Principal] Iniciando nuevo lote. ID: ${currentBatchId}`);
        GM_setValue(SCRIPT_STATE_KEY, JSON.stringify({ action: 'batch_initializing', batchId: currentBatchId, timestamp: Date.now() }));

        showProgressBar(); // Esto ya llama a updateProgressBar y updateEtaTextDisplay(null)
        updateProgressBar(0, totalInitialLinks, `Analizando ${totalInitialLinks} enlaces (Lote: ${currentBatchId.substring(0,10)})...`);

        for (let i = 0; i < totalInitialLinks; i++) {
            const url = links[i]; const currentOverallCount = i + 1;
            if (!url || !url.startsWith('https://www.waze.com/discuss/t/')) {
                skippedInvalidLinks++;
                const errorMessage = `URL omitida (formato incorrecto o vacía): ${url || "URL Vacía"}`;
                console.warn(`[Extractor Contenido - Principal] ${errorMessage}`);
                allProcessedPostsData.push({ sourcePostUrl: url || "URL Vacía", pageTitle: "N/A - URL Omitida/Inválida", articles: [], error: errorMessage });
                updateProgressBar(currentOverallCount, totalInitialLinks, `Revisando: ${currentOverallCount}/${totalInitialLinks}. Omitida: "${(url||"").substring(0,30)}..."`);
            } else {
                validUrlTasks.push({ url: url, originalIndex: i });
            }
            if (i % 5 === 0) { await new Promise(resolve => setTimeout(resolve, 20)); }
        }

        totalValidLinksForEta = validUrlTasks.length;
        processedValidLinksForEta = 0;
        batchStartTimeForEta = Date.now();

        if (totalValidLinksForEta === 0) {
            stopEtaTimer();
            updateEtaTextDisplay(-1);
            let endMessage = "No hay URLs válidas para procesar. ";
            if (skippedInvalidLinks > 0) { endMessage += `${skippedInvalidLinks} URLs fueron omitidas.`; }
            else { endMessage = "No se ingresaron URLs o todas estaban vacías."; }
            updateProgressBar(totalInitialLinks, totalInitialLinks, endMessage);
            setTimeout(() => {
                generateAndDownloadHtml(0, 0, skippedInvalidLinks, totalInitialLinks);
                GM_setValue(SCRIPT_STATE_KEY, JSON.stringify({ action: 'idle', reason: 'no_valid_links', batchId: currentBatchId, timestamp: Date.now() }));
            }, 1500);
            return;
        }

        startEtaTimer();

        for (let i = 0; i < validUrlTasks.length; i++) {
            const task = validUrlTasks[i];
            const url = task.url;
            attemptedValidLinks++;
            const currentGlobalLinkIndex = skippedInvalidLinks + attemptedValidLinks;

            updateProgressBar(
                currentGlobalLinkIndex,
                totalInitialLinks,
                `Procesando Válida ${attemptedValidLinks}/${totalValidLinksForEta} (Global ${currentGlobalLinkIndex}/${totalInitialLinks}): ${url.substring(0, 60)}...`
            );

            GM_setValue(SCRIPT_STATE_KEY, JSON.stringify({ action: 'waitingForContent', forUrl: url, batchId: currentBatchId, timestamp: Date.now() }));
            console.log(`[Extractor Contenido - Principal] Abriendo pestaña para ${url} (Batch: ${currentBatchId})`);
            const tab = GM_openInTab(url, { active: false, insert: true, setParent: true });

            let attempts = 0; const maxAttempts = 120; let extractedState = null; let timedOut = false;
            while (attempts < maxAttempts) { /* ... (lógica de espera sin cambios) ... */
                await new Promise(resolve => setTimeout(resolve, 2000)); const rawState = GM_getValue(SCRIPT_STATE_KEY, null);
                if (rawState) {
                    try { const tempState = JSON.parse(rawState); if (tempState.batchId === currentBatchId && tempState.sourceUrl === url) { if (tempState.action === 'contentExtracted' || tempState.action === 'extractionError') { extractedState = tempState; console.log(`[Extractor Contenido - Principal] Recibido estado '${extractedState.action}' para ${url} del batch ${currentBatchId}`); break; } else if (tempState.action === 'waitingForContent') {} else { console.warn(`[Extractor Contenido - Principal] Estado con batch/URL correctos pero acción inesperada '${tempState.action}' para ${url}. Ignorando y esperando.`); } } else { if (tempState.batchId !== currentBatchId) { console.log(`[Extractor Contenido - Principal] Estado ignorado (Batch ID incorrecto). Esperado: ${currentBatchId}, Recibido: ${tempState.batchId} para URL ${tempState.sourceUrl}.`); } else if (tempState.sourceUrl !== url) { console.log(`[Extractor Contenido - Principal] Estado ignorado (URL incorrecta, mismo Batch). Esperado: ${url}, Recibido: ${tempState.sourceUrl}.`); } }
                    } catch(e) { console.error(`[Extractor Contenido - Principal] Error parseando estado: ${e}. Raw: ${rawState}`); }
                } attempts++; if (attempts % 15 === 0) { console.log(`[Extractor Contenido - Principal] Esperando ${url}, intento ${attempts}/${maxAttempts} (Batch: ${currentBatchId})...`); }
            }
            if (!extractedState) { timedOut = true; console.warn(`[Extractor Contenido - Principal] Timeout para ${url} (Batch: ${currentBatchId}) después de ${maxAttempts} intentos.`); }
            if (tab && typeof tab.close === 'function' && !tab.closed) { try { tab.close(); } catch (e) { console.warn("[Extractor Contenido - Principal] Error menor al cerrar pestaña:", e); } }

            processedValidLinksForEta++; // Incrementar aquí para el cálculo del ETA

            if (timedOut) { const failMessage = `Timeout esperando extracción de (Válida ${attemptedValidLinks}/${totalValidLinksForEta}): ${url}`; console.warn(`[Extractor Contenido - Principal] ${failMessage}`); allProcessedPostsData.push({ sourcePostUrl: url, pageTitle: "Error: Timeout en Extracción", articles: [], error: failMessage });
            } else if (extractedState.action === 'extractionError') { console.warn(`[Extractor Contenido - Principal] Error reportado por hija para ${url}: ${extractedState.error}`); allProcessedPostsData.push({ sourcePostUrl: url, pageTitle: "Error en Pestaña Hija", articles: [], error: `Error en pestaña hija: ${extractedState.error}` });
            } else if (extractedState.action === 'contentExtracted') { allProcessedPostsData.push({ sourcePostUrl: extractedState.sourceUrl, pageTitle: extractedState.pageTitle, articles: extractedState.articlesData }); if (extractedState.articlesData && extractedState.articlesData.length > 0) { successfullyExtractedCount++; } console.log(`[Extractor Contenido - Principal] Contenido agregado de "${extractedState.pageTitle}" (${extractedState.articlesData ? extractedState.articlesData.length : 0} artículos) de ${extractedState.sourceUrl}`); }
            await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        }

        stopEtaTimer();
        updateEtaTextDisplay(-1);

        generateAndDownloadHtml(successfullyExtractedCount, attemptedValidLinks, skippedInvalidLinks, totalInitialLinks);
        GM_setValue(SCRIPT_STATE_KEY, JSON.stringify({ action: 'idle', reason: 'batch_completed', batchId: currentBatchId, timestamp: Date.now() }));

        // MODIFICADO: Limpiar la lista de URLs almacenada.
        GM_setValue(URL_LIST_KEY, "");
        console.log(`[Extractor Contenido - Principal] Lista de URLs (${URL_LIST_KEY}) almacenada ha sido vaciada.`);
    }

    function showUrlInputDialog() { /* ... (sin cambios) ... */ const existingDialog = document.getElementById('custom-url-input-dialog-waze'); if (existingDialog) { existingDialog.remove(); } const dialogOverlay = document.createElement('div'); dialogOverlay.id = 'custom-url-input-dialog-waze'; dialogOverlay.style.position = 'fixed'; dialogOverlay.style.top = '0'; dialogOverlay.style.left = '0'; dialogOverlay.style.width = '100%'; dialogOverlay.style.height = '100%'; dialogOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)'; dialogOverlay.style.zIndex = '10000'; dialogOverlay.style.display = 'flex'; dialogOverlay.style.alignItems = 'center'; dialogOverlay.style.justifyContent = 'center'; const dialogContent = document.createElement('div'); dialogContent.style.background = 'white'; dialogContent.style.padding = '25px'; dialogContent.style.borderRadius = '8px'; dialogContent.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'; dialogContent.style.width = 'clamp(300px, 60vw, 600px)'; dialogContent.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'; const title = document.createElement('h2'); title.textContent = 'Introducir URLs de Posts del Foro'; title.style.marginTop = '0'; title.style.marginBottom = '15px'; title.style.color = '#333'; dialogContent.appendChild(title); const label = document.createElement('label'); label.textContent = 'Pega las URLs (una por línea o separadas por comas):'; label.style.display = 'block'; label.style.marginBottom = '8px'; label.style.color = '#555'; dialogContent.appendChild(label); const textarea = document.createElement('textarea'); textarea.id = 'custom-url-textarea-waze'; textarea.style.width = 'calc(100% - 20px)'; textarea.style.minHeight = '150px'; textarea.style.padding = '10px'; textarea.style.border = '1px solid #ccc'; textarea.style.borderRadius = '4px'; textarea.style.fontSize = '14px'; textarea.value = GM_getValue(URL_LIST_KEY, ""); dialogContent.appendChild(textarea); const buttonContainer = document.createElement('div'); buttonContainer.style.marginTop = '20px'; buttonContainer.style.textAlign = 'right'; const cancelButton = document.createElement('button'); cancelButton.textContent = 'Cancelar'; cancelButton.style.padding = '10px 18px'; cancelButton.style.marginRight = '10px'; cancelButton.style.border = 'none'; cancelButton.style.borderRadius = '4px'; cancelButton.style.background = '#6c757d'; cancelButton.style.color = 'white'; cancelButton.style.cursor = 'pointer'; cancelButton.onclick = () => dialogOverlay.remove(); buttonContainer.appendChild(cancelButton); const processButton = document.createElement('button'); processButton.textContent = 'Procesar'; processButton.style.padding = '10px 18px'; processButton.style.border = 'none'; processButton.style.borderRadius = '4px'; processButton.style.background = '#007bff'; processButton.style.color = 'white'; processButton.style.cursor = 'pointer'; processButton.onclick = () => { const urlsString = textarea.value; if (!urlsString.trim()) { alert("No se introdujeron URLs."); return; } GM_setValue(URL_LIST_KEY, urlsString); dialogOverlay.remove(); const urls = urlsString.split(/[\n,]+/) .map(url => url.trim()) .filter(url => url); if (urls.length > 0) { processLinks(urls); } else { alert("La lista de URLs está vacía después de limpiar."); } }; buttonContainer.appendChild(processButton); dialogContent.appendChild(buttonContainer); dialogOverlay.appendChild(dialogContent); document.body.appendChild(dialogOverlay); textarea.focus(); }
    function addExportButton() { /* ... (sin cambios) ... */ const targetParent = document.querySelector('.d-header .panel .header-buttons, .d-header .title, .d-header'); const targetUl = document.querySelector('ul.icons.d-header-icons'); if (targetUl && !document.getElementById('custom-export-content-button-waze')) { const newLi = document.createElement('li'); newLi.id = 'custom-export-content-li-waze'; const button = document.createElement('button'); button.id = 'custom-export-content-button-waze'; button.className = 'btn no-text btn-icon icon btn-flat'; button.title = 'Extraer Contenido de Posts a HTML'; button.innerHTML = `<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 1em; height: 1em; vertical-align: middle;"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>`; button.addEventListener('click', showUrlInputDialog); newLi.appendChild(button); targetUl.prepend(newLi); if (buttonInterval) clearInterval(buttonInterval); } else if (targetParent && !targetUl && !document.getElementById('custom-export-content-button-waze')) { const button = document.createElement('button'); button.id = 'custom-export-content-button-waze'; button.className = 'btn no-text btn-icon icon btn-flat'; button.title = 'Extraer Contenido de Posts a HTML'; button.innerHTML = `<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="width: 1em; height: 1em; vertical-align: middle;"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>`; button.style.marginLeft = '10px'; button.addEventListener('click', showUrlInputDialog); targetParent.appendChild(button); if (buttonInterval) clearInterval(buttonInterval); } }

    const currentUrl = window.location.href; let isChildTabTriggered = false;
    if (window.location.hostname === 'www.waze.com' && window.location.pathname.startsWith('/discuss/t/')) { const stateRaw = GM_getValue(SCRIPT_STATE_KEY, null); if (stateRaw) { try { const state = JSON.parse(stateRaw); if (state.action === 'waitingForContent' && state.forUrl && currentUrl.startsWith(state.forUrl) && state.batchId) { initialParentInstructionForThisChildTab = state; isChildTabTriggered = true; console.log(`[Extractor Contenido - Hija ${currentUrl}] Detectada instrucción (Batch: ${state.batchId}). Iniciando extracción en 7s.`); window.addEventListener('load', () => { console.log(`[Extractor Contenido - Hija ${currentUrl}] Evento 'load'. Esperando para extractContentAndEmbedImagesInTab.`); setTimeout(() => extractContentAndEmbedImagesInTab(initialParentInstructionForThisChildTab), 7000); }); } } catch (e) { console.error("[Extractor Contenido] Error parseando estado (hija):", e); } } }
    if (!isChildTabTriggered) { console.log(`[Extractor Contenido - Principal/No-Hija ${currentUrl}] Configurando UI y estado idle.`); if (window.location.hostname === 'www.waze.com' && window.location.pathname.startsWith('/discuss')) { window.addEventListener('load', () => { buttonInterval = setInterval(addExportButton, 1000); setTimeout(() => clearInterval(buttonInterval), 20000); }); } const initRawState = GM_getValue(SCRIPT_STATE_KEY, null); let needsReset = true; if (initRawState) { try { const initState = JSON.parse(initRawState); if (initState.action === 'idle') { needsReset = false; } else { console.log(`[Extractor Contenido - Principal] Estado SCRIPT_STATE_KEY actual: '${initState.action}'. Se reseteará a 'idle'. (Batch antiguo: ${initState.batchId})`); } } catch(e) { console.error("[Extractor Contenido - Principal] Error parseando estado para reset, se forzará reset:", e); } } if (needsReset) { GM_setValue(SCRIPT_STATE_KEY, JSON.stringify({ action: 'idle', reason: 'main_script_load_reset', timestamp: Date.now() })); console.log("[Extractor Contenido - Principal] SCRIPT_STATE_KEY reseteado a 'idle'."); } }
    console.log(`[Extractor Contenido Waze Discuss] v1.2 Cargado. Es Pestaña Hija Activa: ${isChildTabTriggered}`);

})();