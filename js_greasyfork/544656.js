// ==UserScript==
// @name         WPlace Overlay - Urso Sam
// @name:pt-BR   WPlace Overlay - Urso Sam
// @namespace    https://twitch.tv/ursosam
// @version      2.0
// @description  Carrega o overlay da comunidade Urso Sam para auxiliar na construção de artes no wplace.live.
// @description:pt-BR Carrega o overlay da comunidade Urso Sam para auxiliar na construção de artes no wplace.live.
// @author       Snowkoler
// @match        https://wplace.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wplace.live
// @license      MIT
// @connect      stinkbug-striking-griffon.ngrok-free.app
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/544656/WPlace%20Overlay%20-%20Urso%20Sam.user.js
// @updateURL https://update.greasyfork.org/scripts/544656/WPlace%20Overlay%20-%20Urso%20Sam.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const serverUrl = "https://stinkbug-striking-griffon.ngrok-free.app";
    let isOverlayEnabled = true;
    let tilesConfig = [];
    let wrongPixelCounts = new Map();
    let overlayToggleButton, pixelCounterElement;
    const originalFetch = unsafeWindow.fetch;
    const tileCache = new Map();

    function processTileImage(originalPixelData, blueprintPixelData, width, height) {
    const finalPixelData = new Uint8ClampedArray(width * 3 * height * 3 * 4);
    let wrongPixels = 0;
    const zoom = 3;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const base_r = originalPixelData[i];
            const base_g = originalPixelData[i + 1];
            const base_b = originalPixelData[i + 2];
            const base_a = originalPixelData[i + 3];

            const bp_r = blueprintPixelData[i];
            const bp_g = blueprintPixelData[i + 1];
            const bp_b = blueprintPixelData[i + 2];
            const bp_a = blueprintPixelData[i + 3];

            if (bp_a !== 0) {
                if (base_r !== bp_r || base_g !== bp_g || base_b !== bp_b || base_a !== bp_a) {
                    wrongPixels++;
                }

                const blueprintColor = [bp_r, bp_g, bp_b, 255];
                for (let dy = 0; dy < zoom; dy++) {
                    for (let dx = 0; dx < zoom; dx++) {
                        const final_x = x * zoom + dx;
                        const final_y = y * zoom + dy;
                        const final_i = (final_y * width * zoom + final_x) * 4;

                        if (dx === 1 && dy === 1) {
                            finalPixelData.set(blueprintColor, final_i);
                        } else {
                            finalPixelData.set([base_r, base_g, base_b, base_a], final_i);
                        }
                    }
                }
            } else {
                for (let dy = 0; dy < zoom; dy++) {
                    for (let dx = 0; dx < zoom; dx++) {
                        const final_x = x * zoom + dx;
                        const final_y = y * zoom + dy;
                        const final_i = (final_y * width * zoom + final_x) * 4;
                        finalPixelData.set([base_r, base_g, base_b, base_a], final_i);
                    }
                }
            }
        }
    }
    return { finalPixelData, wrongPixels };
}


    const workerCode = `
        ${processTileImage.toString()}

        self.onmessage = (e) => {
            const { originalPixelData, blueprintPixelData, width, height, tileKey, urlString } = e.data;
            const { finalPixelData, wrongPixels } = processTileImage(originalPixelData, blueprintPixelData, width, height);
            self.postMessage({ finalPixelData, wrongPixels, width, height, tileKey, urlString }, [finalPixelData.buffer]);
        };
    `;
    const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(workerBlob);
    const worker = new Worker(workerUrl);

    worker.onmessage = (e) => {
        const { finalPixelData, wrongPixels, width, height, tileKey, urlString } = e.data;
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = width * 3;
        finalCanvas.height = height * 3;
        const finalCtx = finalCanvas.getContext('2d');
        const finalImageData = new ImageData(finalPixelData, width * 3, height * 3);
        finalCtx.putImageData(finalImageData, 0, 0);
        updatePixelCount(tileKey, wrongPixels);
        finalCanvas.toBlob(finalBlob => {
            tileCache.set(urlString, finalBlob);
            console.log(`WPlace Overlay: Cache atualizado por Worker para ${tileKey}`);
        }, 'image/png');
    };

    async function fetchConfig() {return new Promise((resolve, reject) => { const url = `${serverUrl}/config.json?t=${new Date().getTime()}`; GM_xmlhttpRequest({ method: "GET", url, responseType: "json", headers: { "ngrok-skip-browser-warning": "true" }, onload: (response) => (response.status === 200 && response.response) ? resolve(response.response) : reject(`Falha ao carregar config.json: Status ${response.status}`), onerror: (error) => reject("Erro de rede ao buscar config.json", error) }); }); }
    async function loadImage(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            onload: (response) => {
                if (response.status === 200) {
                    const img = new Image();
                    const objectURL = URL.createObjectURL(response.response);
                    img.onload = () => {
                        URL.revokeObjectURL(objectURL);
                        resolve(img);
                    };
                    img.onerror = () => reject(`Falha ao converter blob para imagem: ${url}`);
                    img.src = objectURL;
                } else {
                    reject(`Falha ao carregar imagem (status ${response.status}): ${url}`);
                }
            },
            onerror: () => reject(`Falha de rede ao carregar imagem: ${url}`)
        });
    });
    }
    function updatePixelCount(tileKey, count) {wrongPixelCounts.set(tileKey, count); let total = 0; wrongPixelCounts.forEach(value => total += value); if (pixelCounterElement) { pixelCounterElement.textContent = `Pixels faltando/errados: ${total}`; } }
    function setupUI() {const container = document.createElement('div'); container.id = 'urso-sam-overlay-ui';
                        Object.assign(container.style, { position: 'fixed', top: '10px', left: '50px', zIndex: '10000', backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column',
                                                        gap: '8px' }); overlayToggleButton = document.createElement('button'); Object.assign(overlayToggleButton.style, { backgroundColor: '#28a745', color: 'white', border: 'none',
                                                        padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }); overlayToggleButton.textContent = 'Overlay LIGADO';
                        overlayToggleButton.onclick = () => { isOverlayEnabled = !isOverlayEnabled; overlayToggleButton.textContent = isOverlayEnabled ? 'Overlay LIGADO' : 'Overlay DESLIGADO';
                                                             overlayToggleButton.style.backgroundColor = isOverlayEnabled ? '#28a745' : '#dc3545'; }; pixelCounterElement = document.createElement('div');
                        Object.assign(pixelCounterElement.style, { color: 'white', fontFamily: 'sans-serif', fontSize: '14px', textAlign: 'center' }); pixelCounterElement.textContent = 'Pixels faltando/errados: 0';
                        container.appendChild(overlayToggleButton); container.appendChild(pixelCounterElement); document.body.appendChild(container); }

    async function processTileWithWorker(urlString, tileX, tileY) {
        try {
            const originalResponse = await originalFetch(urlString);
            const originalImageBlob = await originalResponse.blob();
            const originalImage = await createImageBitmap(originalImageBlob);
            const blueprintUrl = `${serverUrl}/blueprints/${tileX}/${tileY}blueprint.png`;
            const blueprintImage = await loadImage(blueprintUrl);
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = originalImage.width;
            tempCanvas.height = originalImage.height;
            const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
            tempCtx.drawImage(originalImage, 0, 0);
            const originalPixelData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
            tempCtx.clearRect(0,0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(blueprintImage, 0, 0);
            const blueprintPixelData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
            worker.postMessage({
                originalPixelData, blueprintPixelData,
                width: tempCanvas.width, height: tempCanvas.height,
                tileKey: `${tileX},${tileY}`, urlString
            }, [originalPixelData.buffer, blueprintPixelData.buffer]);
        } catch (error) {
            console.error(`WPlace Overlay: Falha ao preparar dados para o Worker para ${tileX},${tileY}`, error);
        }
    }

    try {
        tilesConfig = await fetchConfig();
        setupUI();

        unsafeWindow.fetch = new Proxy(originalFetch, {
            apply: (target, thisArg, argList) => {
                const urlString = typeof argList[0] === 'string' ? argList[0] : argList[0].url;
                try {
                    const url = new URL(urlString);
                    if (isOverlayEnabled && url.hostname === "backend.wplace.live" && url.pathname.includes("/files/s0/tiles/")) {
                        const tileMatch = url.pathname.match(/files\/s0\/tiles\/(\d+)\/(\d+)\.png/);
                        if (tileMatch) {
                            const [, tileX, tileY] = tileMatch;
                            const needsOverlay = tilesConfig.some(coord => coord[0] == tileX && coord[1] == tileY);
                            if (needsOverlay) {
                                if (tileCache.has(urlString)) {
                                    processTileWithWorker(urlString, tileX, tileY);
                                    const cachedBlob = tileCache.get(urlString);
                                    return new Response(cachedBlob, { status: 200, headers: { 'Content-Type': 'image/png' } });
                                } else {
                                    return new Promise(async (resolve) => {
                                        try {
                                            const originalResponse = await target.apply(thisArg, argList);
                                            const originalImageBlob = await originalResponse.clone().blob();
                                            const originalImage = await createImageBitmap(originalImageBlob);
                                            const blueprintUrl = `${serverUrl}/blueprints/${tileX}/${tileY}blueprint.png`;
                                            const blueprintImage = await loadImage(blueprintUrl);
                                            const tileKey = `${tileX},${tileY}`;

                                            const tempCanvas = document.createElement('canvas');
                                            tempCanvas.width = originalImage.width;
                                            tempCanvas.height = originalImage.height;
                                            const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
                                            tempCtx.drawImage(originalImage, 0, 0);
                                            const originalPixelData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
                                            tempCtx.clearRect(0,0, tempCanvas.width, tempCanvas.height);
                                            tempCtx.drawImage(blueprintImage, 0, 0);
                                            const blueprintPixelData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;

                                            const { finalPixelData, wrongPixels } = processTileImage(
                                                originalPixelData, blueprintPixelData, tempCanvas.width, tempCanvas.height
                                            );

                                            updatePixelCount(tileKey, wrongPixels);

                                            const finalCanvas = document.createElement('canvas');
                                            finalCanvas.width = tempCanvas.width * 3;
                                            finalCanvas.height = tempCanvas.height * 3;
                                            finalCanvas.getContext('2d').putImageData(new ImageData(finalPixelData, finalCanvas.width, finalCanvas.height), 0, 0);

                                            const finalBlob = await new Promise(res => finalCanvas.toBlob(res, 'image/png'));
                                            tileCache.set(urlString, finalBlob);
                                            resolve(new Response(finalBlob.slice(), { status: originalResponse.status, headers: originalResponse.headers }));
                                        } catch (e) {
                                            console.error("Falha no processamento inicial do tile", e);
                                            resolve(target.apply(thisArg, argList));
                                        }
                                    });
                                }
                            }
                        }
                    }
                } catch (e) {}
                return target.apply(thisArg, argList);
            }
        });
    } catch (error) {
        console.error("WPlace Overlay: Falha crítica na inicialização.", error);
    }
})();