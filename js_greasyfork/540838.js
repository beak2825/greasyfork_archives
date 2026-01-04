// ==UserScript==
// @name         Drawaria Buttons Fixed Improved
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Asegura que los botones de subida estén siempre visibles y funcionales. Implementa un cooldown interno para evitar errores del servidor.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      picsum.photos
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/540838/Drawaria%20Buttons%20Fixed%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/540838/Drawaria%20Buttons%20Fixed%20Improved.meta.js
// ==/UserScript==

(function() {
    'use-strict';

    const COOLDOWN_DURATION = 60 * 1000; // 60 segundos en milisegundos
    let lastUploadTime = 0; // Marca de tiempo de la última subida
    let cooldownDisplayTimeout = null; // Para limpiar el mensaje de cooldown

    // --- Inyectamos estilos para que los botones se vean bien ---
    GM_addStyle(`
        #superSendButton, #downloadCanvasButton, #uploadTenTimesButton, #uploadTwentyTimesButton, #uploadRandomSketchButton {
            margin-bottom: 0.5em; /* Espacio debajo de los botones */
        }
        #superSendButton .spinner-border, #downloadCanvasButton .spinner-border, #uploadTenTimesButton .spinner-border, #uploadTwentyTimesButton .spinner-border, #uploadRandomSketchButton .spinner-border {
            width: 1em;
            height: 1em;
            margin-left: 0.5em;
            vertical-align: text-bottom;
        }
        #uploadStatusSection {
            font-size: 0.85em;
            color: #555;
            text-align: center;
            margin-top: -0.2em;
            margin-bottom: 0.5em;
            min-height: 1.2em; /* Para mantener el espacio */
        }
        .cooldown-active-msg {
            color: orange;
            font-weight: bold;
        }
        .upload-error-msg {
            color: red;
            font-weight: bold;
        }
        .upload-success-msg {
            color: green;
            font-weight: bold;
        }
    `);

    /**
     * Espera a que un elemento DOM esté disponible.
     * @param {string} selector - Selector CSS del elemento.
     * @param {function} callback - Función a ejecutar cuando el elemento se encuentre.
     * @param {number} [intervalTime=100] - Intervalo de chequeo en ms.
     */
    function waitForElement(selector, callback, intervalTime = 100) {
        const intervalId = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(intervalId);
                callback(element);
            }
        }, intervalTime);
    }

    /**
     * Obtiene el valor de una flag de modo de juego de forma segura.
     * Si las variables de Drawaria no están disponibles, devuelve `false`.
     * @param {string} flagConstName - Nombre de la constante global (ej. 'PGMODE_STENCILS').
     * @returns {boolean} - True si el modo está activo, false en caso contrario.
     */
    const getGameModeFlag = (flagConstName) => {
        // Accede directamente a window.Fn y window[flagConstName] si existen.
        if (typeof window.Fn !== 'undefined' && typeof window[flagConstName] !== 'undefined') {
            const flagValue = window.Fn[window[flagConstName]];
            return !!flagValue; // Asegura que siempre sea un booleano.
        }
        return false; // Valor por defecto si las variables del juego no están disponibles.
    };

    /**
     * Inyecta y ejecuta un fragmento de script en el contexto de la página.
     * Esto permite acceder a variables y funciones que no son accesibles desde el entorno aislado de Tampermonkey.
     * @param {string} codeToInject - El código JavaScript a inyectar y ejecutar.
     */
    function injectScriptInPageContext(codeToInject) {
        const script = document.createElement('script');
        script.textContent = `(function() { ${codeToInject} })();`; // Envuelve el código en un IIFE.
        (document.head || document.documentElement).appendChild(script);
        script.remove(); // Limpia el elemento script del DOM inmediatamente después de la ejecución.
    }

    /**
     * Actualiza el mensaje de estado de subida (cooldown, errores, etc.).
     * @param {string} message - El mensaje a mostrar.
     * @param {string} [type=''] - Clase CSS para el mensaje (ej. 'cooldown-active-msg', 'upload-error-msg').
     * @param {number} [duration=3000] - Duración en ms antes de limpiar el mensaje (0 para no limpiar).
     */
    function setUploadStatusMessage(message, type = '', duration = 3000) {
        const statusSection = document.getElementById('uploadStatusSection');
        if (statusSection) {
            statusSection.innerHTML = message;
            statusSection.className = `upload-status-section ${type}`;
            if (cooldownDisplayTimeout) {
                clearTimeout(cooldownDisplayTimeout);
            }
            if (duration > 0) {
                cooldownDisplayTimeout = setTimeout(() => {
                    statusSection.innerHTML = '';
                    statusSection.className = 'upload-status-section';
                }, duration);
            }
        }
    }


    /**
     * Inicia el temporizador de cooldown global después de una subida.
     */
    function startGlobalCooldown() {
        lastUploadTime = Date.now();
        localStorage.setItem('drawariaLastUploadTime', lastUploadTime); // Guardar en localStorage
        setUploadStatusMessage(`Cooldown: ${Math.ceil(COOLDOWN_DURATION / 1000)}s restantes.`, 'cooldown-active-msg', COOLDOWN_DURATION + 1000);
    }

    /**
     * Función para descargar el dibujo actual del canvas como PNG.
     */
    function downloadDrawing() {
        const downloadButton = document.getElementById('downloadCanvasButton');
        const spinner = downloadButton.querySelector('.spinner-border');

        spinner.style.display = 'inline-block';
        downloadButton.disabled = true; // Deshabilitar solo este botón durante la descarga

        try {
            const mainCanvas = document.getElementById('canvas');
            if (!mainCanvas) {
                throw new Error("No se encontró el canvas principal para descargar.");
            }

            let sourceCanvas = mainCanvas;
            const targetWordElement = document.getElementById('targetword');
            const isWordGuessMode = (targetWordElement && targetWordElement.style.display !== 'none');

            if (!isWordGuessMode && typeof window.ze !== 'undefined' && window.ze instanceof HTMLCanvasElement && window.ze.width > 0 && window.ze.height > 0) {
                sourceCanvas = window.ze;
                console.log("Usando el canvas auto-guardado (window.ze) para la descarga.");
            } else {
                console.log("Usando el canvas visible (mainCanvas) para la descarga.");
            }

            // Usar canvas.toBlob() para obtener el Blob del dibujo.
            sourceCanvas.toBlob((blob) => {
                if (blob) {
                    const filename = `Drawaria-online-${new Date().toISOString().slice(0,10)}.png`;
                    // Utilizar la función saveAs de FileSaver.js, que Drawaria ya carga.
                    if (typeof window.saveAs === 'function') {
                        window.saveAs(blob, filename);
                        console.log(`Dibujo descargado como ${filename}`);
                        setUploadStatusMessage('Dibujo descargado con éxito.', 'upload-success-msg');
                    } else {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        console.warn("window.saveAs no disponible, usando fallback para descargar.");
                        setUploadStatusMessage('Dibujo descargado (fallback).', 'upload-success-msg');
                    }
                } else {
                    throw new Error("No se pudo crear el Blob del canvas.");
                }
            }, 'image/png'); // Siempre descargar como PNG.

        } catch (error) {
            console.error("Error al descargar el dibujo:", error);
            setUploadStatusMessage(`Error: ${error.message}`, 'upload-error-msg');
            alert("Ocurrió un error al descargar el dibujo: " + error.message);
        } finally {
            spinner.style.display = 'none';
            downloadButton.disabled = false;
        }
    }

    /**
     * Procesa una imagen (ya sea del canvas del juego o externa) y la convierte a DataURLs para la subida.
     * @param {HTMLCanvasElement|HTMLImageElement} sourceImage - El canvas del juego o un objeto Image ya cargado.
     * @param {boolean} isSourceCanvas - True si sourceImage es un HTMLCanvasElement, false si es un HTMLImageElement.
     * @returns {Promise<{imageData: string, thumbData: string}>} DataURLs procesados.
     */
    async function processImageForUpload(sourceImage, isSourceCanvas) {
        let imgToDraw = sourceImage;

        // Si la fuente es un canvas, convertimos primero a DataURL (PNG) y luego a Image.
        // Esto sirve como "purificador" para canvas complejos.
        if (isSourceCanvas) {
            const sourceDataURL = sourceImage.toDataURL('image/png');
            imgToDraw = await new Promise((resolve, reject) => {
                const tempImg = new Image();
                tempImg.onload = () => resolve(tempImg);
                tempImg.onerror = (e) => reject(new Error("Error al cargar la imagen del canvas fuente para purificación."));
                tempImg.src = sourceDataURL;
            });
        }

        // --- Procesamiento de la imagen principal para subir (JPEG 1200x1000) ---
        const uploadCanvas = document.createElement("canvas");
        const uploadCtx = uploadCanvas.getContext("2d");
        uploadCanvas.width = 1200;
        uploadCanvas.height = 1000;
        uploadCtx.fillStyle = "#ffffff";
        uploadCtx.fillRect(0, 0, uploadCanvas.width, uploadCanvas.height);
        uploadCtx.drawImage(imgToDraw, 0, 0, uploadCanvas.width, uploadCanvas.height); // Dibujar Image object.
        if (getGameModeFlag('PGMODE_PIXELART')) {
            uploadCtx.imageSmoothingEnabled = false;
        } else {
            uploadCtx.imageSmoothingEnabled = true;
        }

        // --- Procesamiento de la miniatura para subir (JPEG 300x[proporción]) ---
        const thumbCanvas = document.createElement("canvas");
        const thumbCtx = thumbCanvas.getContext("2d");
        thumbCanvas.width = 300;
        thumbCanvas.height = 300 / 1.2;
        thumbCtx.fillStyle = "#ffffff";
        thumbCtx.fillRect(0, 0, thumbCanvas.width, thumbCanvas.height);
        thumbCtx.drawImage(imgToDraw, 0, 0, thumbCanvas.width, thumbCanvas.height); // Dibujar Image object.
        if (getGameModeFlag('PGMODE_PIXELART')) {
            thumbCtx.imageSmoothingEnabled = false;
        } else {
            thumbCtx.imageSmoothingEnabled = true;
        }

        // Convertir los canvases a DataURL (JPEG con compresión).
        const imageData = uploadCanvas.toDataURL("image/jpeg", 0.8);
        const thumbData = thumbCanvas.toDataURL("image/jpeg", 0.8);

        // --- IMPORTANTE: Extraer solo la parte base64 si el servidor lo espera así. ---
        const base64ImageData = imageData.split(',')[1];
        const base64ThumbData = thumbData.split(',')[1];

        return { imageData: base64ImageData, thumbData: base64ThumbData };
    }


    /**
     * Función base para subir un dibujo a la galería.
     * @param {HTMLCanvasElement|HTMLImageElement} sourceContent - El canvas del juego o un objeto Image ya cargado.
     * @param {boolean} isSourceCanvas - True si sourceContent es un HTMLCanvasElement, false si es un HTMLImageElement.
     * @param {boolean} shouldRedirect - Si la página debe redirigir después de la subida.
     * @returns {Promise<boolean>} Resuelve a true si la subida fue exitosa, false si hubo un error.
     */
    async function uploadDrawingToGallery(sourceContent, isSourceCanvas, shouldRedirect = true) {
        // Mostrar spinner para el botón principal si es una subida individual
        const superSendButton = document.getElementById('superSendButton');
        const spinner = superSendButton ? superSendButton.querySelector('.spinner-border') : null;
        if (spinner && shouldRedirect) {
            spinner.style.display = 'inline-block';
        }

        // --- Verificar Cooldown ---
        const now = Date.now();
        const timeLeft = lastUploadTime + COOLDOWN_DURATION - now;
        if (timeLeft > 0) {
            const secondsLeft = Math.ceil(timeLeft / 1000);
            const msg = `Cooldown: ${secondsLeft}s. Por favor, espera.`;
            setUploadStatusMessage(msg, 'cooldown-active-msg', 0); // No limpiar automáticamente
            console.warn(msg);
            if (spinner && shouldRedirect) spinner.style.display = 'none'; // Quitar spinner
            return false; // Fallo debido a cooldown
        }

        try {
            const processedData = await processImageForUpload(sourceContent, isSourceCanvas);
            const base64ImageData = processedData.imageData;
            const base64ThumbData = processedData.thumbData;

            // --- Preparación y envío de la petición HTTP ---
            let roomId = (window.location.pathname.match(/room\/([^/]+)/) || [])[1] || '';
            const galleryHost = "//" + (window.qn || "gallery.drawaria.online");
            const sessionId = (document.cookie.match(/sid1=([^;]+)/) || [])[1] || "";
            const postUrl = `${galleryHost}/gallery/uploadimage/?sessionid=${sessionId}`;

            const formData = new URLSearchParams();
            formData.append('imagedata', base64ImageData);
            formData.append('imagedata1', base64ThumbData);
            formData.append('room', roomId);
            formData.append('targetword', '');
            formData.append('guestplayernames', null);
            formData.append('playeruids', null);
            formData.append('stencils', JSON.stringify(getGameModeFlag('PGMODE_STENCILS')));
            formData.append('pixelart', JSON.stringify(getGameModeFlag('PGMODE_PIXELART')));
            formData.append('advtools', JSON.stringify(getGameModeFlag('PGMODE_ADVTOOLS')));

            const response = await fetch(postUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            if (!response.ok) {
                let errorDetails = await response.text();
                try { const errorJson = JSON.parse(errorDetails); errorDetails = errorJson.error || errorDetails; } catch (e) { /* no es JSON */ }
                throw new Error(`Error de red o servidor (${response.status}): ${errorDetails}`);
            }

            const result = await response.json();
            if (result.error) { throw new Error(result.error); }

            // Éxito: iniciar cooldown
            startGlobalCooldown();

            // --- Notificación interna del juego (inyección de script, mejor esfuerzo) ---
            if (shouldRedirect) { // Solo inyecta si es una subida individual que lleva a redirigir
                const notificationScriptCode = `
                    (function() {
                        if (typeof window.Je !== 'undefined') window.Je = true;
                        if (typeof window.Ze !== 'undefined') window.Ze = Date.now();
                        let notificationSent = false;
                        const imageId = '${result.imageid}';
                        if (typeof window.Hr === 'function') { try { window.Hr('clientnotify', null, 11, [imageId]); notificationSent = true; } catch (e) { console.error("Injected: Error calling Hr:", e); } }
                        if (!notificationSent && typeof window.Nt === 'object' && window.Nt !== null && typeof window.Nt.emit === 'function') {
                            try { window.Nt.emit('clientnotify', null, 11, [imageId]); notificationSent = true; } catch (e) { console.error("Injected: Error calling Nt.emit:", e); }
                        }
                        if (!notificationSent) { console.warn("Injected: No se pudo enviar la notificación interna del juego."); }
                    })();
                `;
                injectScriptInPageContext(notificationScriptCode);
                setUploadStatusMessage('Dibujo subido con éxito. Redirigiendo...', 'upload-success-msg');
                console.log("¡Dibujo subido con éxito! Notificación interna intentada via inyección de script.");
            } else {
                 console.log(`¡Dibujo subido con éxito! ID: ${result.imageid}`);
            }

            // Redirigir si se solicitó.
            if (shouldRedirect && result.imageid) {
                const galleryHost = "//" + (window.qn || "gallery.drawaria.online");
                window.location.href = `${galleryHost}/gallery/img/${result.imageid}`;
            } else if (shouldRedirect) {
                const galleryHost = "//" + (window.qn || "gallery.drawaria.online");
                window.location.href = `${galleryHost}/gallery/new`;
            }
            return true;
        } catch (error) {
            console.error("Error al subir el dibujo:", error);
            setUploadStatusMessage(`Error: ${error.message}`, 'upload-error-msg');
            if (shouldRedirect) {
                alert("Ocurrió un error al subir el dibujo: " + error.message + ". Por favor, inténtalo de nuevo.");
            }
            return false;
        } finally {
            if (spinner && shouldRedirect) {
                spinner.style.display = 'none';
            }
        }
    }

    /**
     * Sube el dibujo actual del canvas del juego.
     */
    async function uploadGameCanvasDrawing() {
        const mainCanvas = document.getElementById('canvas');
        if (!mainCanvas) {
            alert("No se encontró el canvas principal del juego.");
            return;
        }

        let sourceCanvas = mainCanvas;
        const targetWordElement = document.getElementById('targetword');
        const isWordGuessMode = (targetWordElement && targetWordElement.style.display !== 'none');

        // Seleccionar el canvas fuente.
        if (!isWordGuessMode && typeof window.ze !== 'undefined' && window.ze instanceof HTMLCanvasElement && window.ze.width > 0 && window.ze.height > 0) {
            sourceCanvas = window.ze;
        }
        await uploadDrawingToGallery(sourceCanvas, true, true); // Redirige
    }

    /**
     * Sube un boceto aleatorio desde una API externa (una vez).
     */
    async function uploadRandomSketch() {
        const uploadRandomBtn = document.getElementById('uploadRandomSketchButton');
        const superSendButton = document.getElementById('superSendButton'); // Main button to show spinner
        const spinner = superSendButton ? superSendButton.querySelector('.spinner-border') : null;

        // Mostrar spinner para el botón que se clickeó
        if (uploadRandomBtn) uploadRandomBtn.querySelector('.spinner-border').style.display = 'inline-block';
        if (superSendButton) superSendButton.querySelector('.spinner-border').style.display = 'inline-block'; // También en el principal

        // No deshabilitamos los botones para que el usuario pueda intentar de nuevo si quiere
        // Esto se gestiona por el mensaje de cooldown

        // --- Verificar Cooldown ---
        const now = Date.now();
        const timeLeft = lastUploadTime + COOLDOWN_DURATION - now;
        if (timeLeft > 0) {
            const secondsLeft = Math.ceil(timeLeft / 1000);
            const msg = `Cooldown: ${secondsLeft}s. Por favor, espera.`;
            setUploadStatusMessage(msg, 'cooldown-active-msg', 0); // No limpiar automáticamente
            console.warn(msg);
            // Quitar spinners si no se procede
            if (uploadRandomBtn) uploadRandomBtn.querySelector('.spinner-border').style.display = 'none';
            if (superSendButton) superSendButton.querySelector('.spinner-border').style.display = 'none';
            return;
        }

        try {
            // Fetch la imagen de una API externa
            const imageUrl = 'https://picsum.photos/1200/1000'; // Imagen aleatoria para testing
            const blob = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: imageUrl,
                    responseType: "blob",
                    onload: function(response) {
                        if (response.status === 200) {
                            resolve(response.response);
                        } else {
                            reject(new Error(`Fallo al obtener la imagen: ${response.status} ${response.statusText}`));
                        }
                    },
                    onerror: function(response) {
                        reject(new Error(`Error de red al obtener la imagen: ${response.statusText || response.error}`));
                    }
                });
            });

            const imgElement = await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = (e) => reject(new Error("Fallo al cargar la imagen obtenida en el objeto Image."));
                img.src = URL.createObjectURL(blob);
            });
            URL.revokeObjectURL(imgElement.src);

            console.log("Imagen de API externa cargada. Procediendo con la subida.");
            await uploadDrawingToGallery(imgElement, false, true); // Usa Image object, redirige
        } catch (error) {
            console.error("Error al subir boceto de API:", error);
            setUploadStatusMessage(`Error API: ${error.message}`, 'upload-error-msg');
            alert("Ocurrió un error al subir el boceto de API: " + error.message);
        } finally {
            // Quitar spinners al finalizar
            if (uploadRandomBtn) uploadRandomBtn.querySelector('.spinner-border').style.display = 'none';
            if (superSendButton) superSendButton.querySelector('.spinner-border').style.display = 'none';
        }
    }


    /**
     * Función para subir N dibujos del canvas del juego.
     * @param {number} count - Número de veces a subir.
     */
    async function uploadGameCanvasNTimes(count) {
        const uploadBtn = document.getElementById(count === 10 ? 'uploadTenTimesButton' : 'uploadTwentyTimesButton');
        const superSendButton = document.getElementById('superSendButton');
        const spinner = superSendButton ? superSendButton.querySelector('.spinner-border') : null;
        const uploadStatusSection = document.getElementById('uploadStatusSection');

        // Mostrar spinners para todos los botones involucrados
        if (uploadBtn) uploadBtn.querySelector('.spinner-border').style.display = 'inline-block';
        if (superSendButton) superSendButton.querySelector('.spinner-border').style.display = 'inline-block';
        const uploadRandomBtn = document.getElementById('uploadRandomSketchButton');
        if (uploadRandomBtn) uploadRandomBtn.querySelector('.spinner-border').style.display = 'inline-block';


        // --- Verificar Cooldown ---
        const now = Date.now();
        const timeLeft = lastUploadTime + COOLDOWN_DURATION - now;
        if (timeLeft > 0) {
            const secondsLeft = Math.ceil(timeLeft / 1000);
            const msg = `Cooldown: ${secondsLeft}s. Espera para iniciar la subida múltiple.`;
            setUploadStatusMessage(msg, 'cooldown-active-msg', 0); // No limpiar automáticamente
            console.warn(msg);
            // Quitar spinners si no se procede
            if (uploadBtn) uploadBtn.querySelector('.spinner-border').style.display = 'none';
            if (superSendButton) superSendButton.querySelector('.spinner-border').style.display = 'none';
            if (uploadRandomBtn) uploadRandomBtn.querySelector('.spinner-border').style.display = 'inline-block';
            return;
        }

        setUploadStatusMessage(`Iniciando ${count} subidas...`, ''); // Mensaje sin clase especial
        let successfulUploads = 0;

        for (let i = 0; i < count; i++) {
            setUploadStatusMessage(`Subiendo ${i + 1}/${count}... (éxitos: ${successfulUploads})`, '');

            const mainCanvas = document.getElementById('canvas');
            if (!mainCanvas) {
                console.error("No se encontró el canvas principal del juego para subida múltiple. Deteniendo.");
                setUploadStatusMessage('Error: Canvas no encontrado.', 'upload-error-msg');
                break;
            }

            let sourceCanvas = mainCanvas;
            const targetWordElement = document.getElementById('targetword');
            const isWordGuessMode = (targetWordElement && targetWordElement.style.display !== 'none');

            if (!isWordGuessMode && typeof window.ze !== 'undefined' && window.ze instanceof HTMLCanvasElement && window.ze.width > 0 && window.ze.height > 0) {
                sourceCanvas = window.ze;
            }
            // Importante: shouldRedirect = false para que no redirija por cada subida
            const success = await uploadDrawingToGallery(sourceCanvas, true, false);
            if (success) {
                successfulUploads++;
            } else {
                // Si falla una subida, aún esperamos el cooldown para el siguiente intento.
                console.warn(`Subida ${i + 1} falló.`);
            }

            // Pausa obligatoria entre subidas para respetar el cooldown del servidor
            if (i < count - 1) { // No esperar después de la última subida
                setUploadStatusMessage(`Subida ${i + 1} completada. Esperando cooldown...`, 'cooldown-active-msg');
                await new Promise(resolve => setTimeout(resolve, COOLDOWN_DURATION));
            }
        }

        // Quitar spinners y mostrar resultado final
        if (uploadBtn) uploadBtn.querySelector('.spinner-border').style.display = 'none';
        if (superSendButton) superSendButton.querySelector('.spinner-border').style.display = 'none';
        if (uploadRandomBtn) uploadRandomBtn.querySelector('.spinner-border').style.display = 'none';

        setUploadStatusMessage(`Completado: ${successfulUploads} de ${count} subidas exitosas.`, successfulUploads === count ? 'upload-success-msg' : 'upload-error-msg');
        alert(`¡Finalizado! ${successfulUploads} de ${count} dibujos subidos exitosamente.`);
    }

    /**
     * Función para subir N bocetos de API.
     * @param {number} count - Número de veces a subir.
     */
    async function uploadRandomSketchNTimes(count) {
        const uploadBtn = document.getElementById(count === 10 ? 'uploadTenTimesButton' : 'uploadTwentyTimesButton');
        const superSendButton = document.getElementById('superSendButton');
        const spinner = superSendButton ? superSendButton.querySelector('.spinner-border') : null;
        const uploadStatusSection = document.getElementById('uploadStatusSection');
        const uploadRandomBtn = document.getElementById('uploadRandomSketchButton');

        // Mostrar spinners
        if (uploadBtn) uploadBtn.querySelector('.spinner-border').style.display = 'inline-block';
        if (superSendButton) superSendButton.querySelector('.spinner-border').style.display = 'inline-block';
        if (uploadRandomBtn) uploadRandomBtn.querySelector('.spinner-border').style.display = 'inline-block';


        // --- Verificar Cooldown ---
        const now = Date.now();
        const timeLeft = lastUploadTime + COOLDOWN_DURATION - now;
        if (timeLeft > 0) {
            const secondsLeft = Math.ceil(timeLeft / 1000);
            const msg = `Cooldown: ${secondsLeft}s. Espera para iniciar la subida múltiple.`;
            setUploadStatusMessage(msg, 'cooldown-active-msg', 0);
            console.warn(msg);
            // Quitar spinners si no se procede
            if (uploadBtn) uploadBtn.querySelector('.spinner-border').style.display = 'none';
            if (superSendButton) superSendButton.querySelector('.spinner-border').style.display = 'none';
            if (uploadRandomBtn) uploadRandomBtn.querySelector('.spinner-border').style.display = 'none';
            return;
        }

        setUploadStatusMessage(`Iniciando ${count} subidas de bocetos...`, '');
        let successfulUploads = 0;

        for (let i = 0; i < count; i++) {
            setUploadStatusMessage(`Subiendo boceto ${i + 1}/${count}... (éxitos: ${successfulUploads})`, '');

            try {
                const imageUrl = 'https://picsum.photos/1200/1000';
                const blob = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET", url: imageUrl, responseType: "blob",
                        onload: (response) => { if (response.status === 200) resolve(response.response); else reject(new Error(`Failed to fetch: ${response.status}`)); },
                        onerror: (response) => reject(new Error(`Network error: ${response.statusText || response.error}`)),
                    });
                });
                const imgElement = await new Promise((resolve, reject) => {
                    const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(new Error("Failed to load fetched image.")); img.src = URL.createObjectURL(blob);
                });
                URL.revokeObjectURL(imgElement.src);

                const success = await uploadDrawingToGallery(imgElement, false, false); // No redirigir
                if (success) {
                    successfulUploads++;
                } else {
                    console.warn(`Subida de boceto ${i + 1} falló.`);
                }
            } catch (error) {
                console.error(`Error en la subida de boceto ${i + 1}:`, error);
                setUploadStatusMessage(`Error: Subida de boceto ${i + 1} falló.`, 'upload-error-msg');
            }

            // Pausa obligatoria entre subidas para respetar el cooldown del servidor
            if (i < count - 1) {
                setUploadStatusMessage(`Boceto ${i + 1} completado. Esperando cooldown...`, 'cooldown-active-msg');
                await new Promise(resolve => setTimeout(resolve, COOLDOWN_DURATION));
            }
        }

        // Quitar spinners y mostrar resultado final
        if (uploadBtn) uploadBtn.querySelector('.spinner-border').style.display = 'none';
        if (superSendButton) superSendButton.querySelector('.spinner-border').style.display = 'none';
        if (uploadRandomBtn) uploadRandomBtn.querySelector('.spinner-border').style.display = 'none';

        setUploadStatusMessage(`Completado: ${successfulUploads} de ${count} bocetos subidos exitosamente.`, successfulUploads === count ? 'upload-success-msg' : 'upload-error-msg');
        alert(`¡Finalizado! ${successfulUploads} de ${count} bocetos subidos exitosamente.`);
    }



    /**
     * Configura la interfaz del script: crea los botones personalizados y oculta los originales.
     */
    function setupInterface() {
        const rightbar = document.querySelector('#rightbar');
        if (!rightbar || document.getElementById('superSendButton')) return; // Ya existe o no hay padre.

        // Ocultar botones originales del juego
        const originalSendToGalleryButton = document.getElementById('sendtogallery');
        if (originalSendToGalleryButton) originalSendToGalleryButton.style.display = 'none';

        const originalDownloadCanvasButton = document.getElementById('downloadcanvas');
        if (originalDownloadCanvasButton) originalDownloadCanvasButton.style.display = 'none';

        const originalDropdownButton = document.getElementById('roomcontrols-menu');
        if (originalDropdownButton) originalDropdownButton.style.display = 'none';

        const originalDropdownMenu = document.querySelector('#roomcontrols .dropdown-menu');
        if (originalDropdownMenu) originalDropdownMenu.style.display = 'none';

        // Ocultar el mensaje "Inicie sesión en su cuenta..." si está presente.
        const loginMessage = document.querySelector('#roomcontrols .dropdown-header h6');
        if (loginMessage && loginMessage.textContent.includes('Inicie sesión en su cuenta')) {
            loginMessage.style.display = 'none';
        }

        // --- Crear y añadir el botón "Subir Dibujo Falso" ---
        const superSendButton = document.createElement('button');
        superSendButton.id = 'superSendButton';
        superSendButton.type = 'button';
        superSendButton.className = 'btn btn-primary btn-block';
        superSendButton.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <span>Subir Dibujo Falso</span>
            <div class="spinner-border spinner-border-sm" role="status" style="display: none;"></div>
        `;
        superSendButton.addEventListener('click', uploadGameCanvasDrawing);
        rightbar.prepend(superSendButton);

        // --- Crear y añadir el botón "Descargar Dibujo" ---
        const downloadCanvasButton = document.createElement('button');
        downloadCanvasButton.id = 'downloadCanvasButton';
        downloadCanvasButton.type = 'button';
        downloadCanvasButton.className = 'btn btn-secondary btn-block';
        downloadCanvasButton.innerHTML = `
            <i class="fas fa-download"></i>
            <span>Descargar Dibujo</span>
            <div class="spinner-border spinner-border-sm" role="status" style="display: none;"></div>
        `;
        downloadCanvasButton.addEventListener('click', downloadDrawing);
        superSendButton.after(downloadCanvasButton);

        // --- Crear y añadir el botón "Subir 20 Dibujos Falsos" ---
        const uploadTwentyTimesButton = document.createElement('button');
        uploadTwentyTimesButton.id = 'uploadTwentyTimesButton';
        uploadTwentyTimesButton.type = 'button';
        uploadTwentyTimesButton.className = 'btn btn-success btn-block';
        uploadTwentyTimesButton.innerHTML = `
            <i class="fas fa-image"></i>
            <span>Subir 20 Dibujos Falsos</span>
            <div class="spinner-border spinner-border-sm" role="status" style="display: none;"></div>
        `;
        uploadTwentyTimesButton.addEventListener('click', () => uploadRandomSketchNTimes(20));
        downloadCanvasButton.after(uploadTwentyTimesButton);

        // --- Crear y añadir el botón "Subir 10 Dibujos Falsos" ---
        const uploadTenTimesButton = document.createElement('button');
        uploadTenTimesButton.id = 'uploadTenTimesButton';
        uploadTenTimesButton.type = 'button';
        uploadTenTimesButton.className = 'btn btn-info btn-block';
        uploadTenTimesButton.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <span>Subir 10 Dibujos Falsos</span>
            <div class="spinner-border spinner-border-sm" role="status" style="display: none;"></div>
        `;
        uploadTenTimesButton.addEventListener('click', () => uploadGameCanvasNTimes(10));
        uploadTwentyTimesButton.after(uploadTenTimesButton);

        // --- Mensaje de estado de subidas y cooldown ---
        const uploadStatusSection = document.createElement('div');
        uploadStatusSection.id = 'uploadStatusSection';
        uploadStatusSection.textContent = ''; // Vacío inicialmente
        uploadTenTimesButton.after(uploadStatusSection);

        // Cargar el último tiempo de subida al iniciar el script
    }

    // --- Inicio del Script ---
    // Paso 1: Esperar por la barra lateral (#rightbar) para poder añadir los botones.
    waitForElement('#rightbar', (rightbarElement) => {
        if (rightbarElement) {
            setupInterface();
        }
    });

    // Paso 2: Configurar un observador de mutaciones para mantener la interfaz.
    waitForElement('body', (bodyElement) => {
        const observer = new MutationObserver(() => {
            // Si nuestros botones no están presentes, o un botón original reaparece, re-ejecutamos setupInterface().
            if (!document.getElementById('superSendButton') || !document.getElementById('downloadCanvasButton') || !document.getElementById('uploadTwentyTimesButton') || !document.getElementById('uploadTenTimesButton') || (document.getElementById('sendtogallery') && document.getElementById('sendtogallery').style.display !== 'none')) {
                setupInterface();
            }
        });
        observer.observe(bodyElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'disabled'] });
    });

})();