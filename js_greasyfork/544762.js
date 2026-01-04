// ==UserScript==

// @name         CyberSoul Animes Alliance Overlay

// @namespace    https://discord.gg/7bYHWYgb

// @version      1.3.86

// @description  Overlay da aliança CyberSoul Animes no WPlace

// @author       Víkish

// @match        https://wplace.live/*

// @icon         https://i.imgur.com/TBeJokm.jpeg

// @grant        none

// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/544762/CyberSoul%20Animes%20Alliance%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/544762/CyberSoul%20Animes%20Alliance%20Overlay.meta.js
// ==/UserScript==

(async function () {

'use strict';  

const CHUNK_WIDTH = 1000;  

const CHUNK_HEIGHT = 1000;  

const overlays = [  

    {  

        url: "https://i.imgur.com/jkHLyev.png",  

        chunk: [731, 1193],  

        coords: [731250, 1193250]  

    }  

];  

for (const obj of overlays) {  

    obj.chunksString = `/${obj.chunk[0]}/${obj.chunk[1]}.png`;  

    const { img, width, height } = await loadImage(obj.url);  

    const overlayCanvas = new OffscreenCanvas(CHUNK_WIDTH, CHUNK_HEIGHT);  

    const overlayCtx = overlayCanvas.getContext("2d");  

    overlayCtx.drawImage(img, obj.coords[0] % 1000, obj.coords[1] % 1000, width, height);  

    obj.imageData = overlayCtx.getImageData(0, 0, CHUNK_WIDTH, CHUNK_HEIGHT);  

    obj.totalPixels = countOverlayPixels(obj.imageData.data);  

}  

const OVERLAY_MODES = ["overlay", "original", "chunks"];  

let overlayMode = OVERLAY_MODES[0];  

// === CONTADOR CENTRAL ===  

let pixelErrorCounter = document.createElement("div");  

pixelErrorCounter.id = "pixel-error-counter";  

Object.assign(pixelErrorCounter.style, {  

    position: "fixed",  

    top: "10px",  

    left: "50%",  

    transform: "translateX(-50%)",  

    backgroundColor: "rgba(0, 0, 0, 0.7)",  

    color: "white",  

    fontWeight: "bold",  

    fontSize: "11px",  

    padding: "5px 10px",  

    borderRadius: "8px",  

    zIndex: "9999",  

    pointerEvents: "none",  

    textAlign: "center",  

    lineHeight: "1.5"  

});  

const pixelsText = document.createElement("div");  

pixelsText.textContent = `Remaining pixels: 0`;  

const progressText = document.createElement("div");  

progressText.textContent = `Current progress: 0,00%`;  

pixelErrorCounter.appendChild(pixelsText);  

pixelErrorCounter.appendChild(progressText);  

document.body.appendChild(pixelErrorCounter);  

// === TABELA DE CORES ===  

const colorStatsContainer = document.createElement("div");  

Object.assign(colorStatsContainer.style, {  

    position: "fixed",  

    top: "170px",  

    left: "10px",  

    backgroundColor: "rgba(0,0,0,0.8)",  

    color: "white",  

    fontSize: "10px",  

    padding: "5px",  

    borderRadius: "8px",  

    zIndex: "9999",  

    maxHeight: "250px",  

    overflowY: "auto",  

    maxWidth: "150px",  

    minWidth: "25px"  

});  

const toggleButton = document.createElement("div");  

toggleButton.textContent = "↑";  

Object.assign(toggleButton.style, {  

    cursor: "pointer",  

    textAlign: "center",  

    marginBottom: "5px",  

    fontSize: "14px"  

});  

const colorList = document.createElement("div");  

colorStatsContainer.appendChild(toggleButton);  

colorStatsContainer.appendChild(colorList);  

document.body.appendChild(colorStatsContainer);  

let listVisible = true;  

toggleButton.addEventListener("click", () => {  

    listVisible = !listVisible;  

    colorList.style.display = listVisible ? "block" : "none";  

    toggleButton.textContent = listVisible ? "↑" : "↓";  

});  

fetch = new Proxy(fetch, {  

    apply: async (target, thisArg, argList) => {  

        const urlString = typeof argList[0] === "object" ? argList[0].url : argList[0];  

        let url;  

        try {  

            url = new URL(urlString);  

        } catch {  

            throw new Error("Invalid URL provided to fetch");  

        }  

        if (overlayMode === "overlay") {  

            if (url.hostname === "backend.wplace.live" && url.pathname.startsWith("/files/")) {  

                for (const obj of overlays) {  

                    if (url.pathname.endsWith(obj.chunksString)) {  

                        const originalResponse = await target.apply(thisArg, argList);  

                        const originalBlob = await originalResponse.blob();  

                        const originalImage = await blobToImage(originalBlob);  

                        const width = originalImage.width;  

                        const height = originalImage.height;  

                        const canvas = new OffscreenCanvas(width, height);  

                        const ctx = canvas.getContext("2d", { willReadFrequently: true });  

                        ctx.drawImage(originalImage, 0, 0, width, height);  

                        const originalData = ctx.getImageData(0, 0, width, height);  

                        const resultData = ctx.getImageData(0, 0, width, height);  

                        const d1 = originalData.data;  

                        const d2 = obj.imageData.data;  

                        const dr = resultData.data;  

                        let pixelErrorCount = 0;  

                        const localColorCount = {};  

                        for (let i = 0; i < d1.length; i += 4) {  

                            const isTransparent = d2[i + 3] === 0;  

                            const samePixel =  

                                d1[i] === d2[i] &&  

                                d1[i + 1] === d2[i + 1] &&  

                                d1[i + 2] === d2[i + 2] &&  

                                d1[i + 3] === d2[i + 3];  

                            if (samePixel && !isTransparent) {  

                                dr[i] = 0;  

                                dr[i + 1] = 255;  

                                dr[i + 2] = 0;  

                                dr[i + 3] = 255;  

                            } else if (!isTransparent) {  

                                dr[i] = d2[i];  

                                dr[i + 1] = d2[i + 1];  

                                dr[i + 2] = d2[i + 2];  

                                dr[i + 3] = d2[i + 3];  

                                pixelErrorCount++;  

                                const colorKey = `${d2[i]},${d2[i + 1]},${d2[i + 2]}`;  

                                localColorCount[colorKey] = (localColorCount[colorKey] || 0) + 1;  

                            }  

                        }  

                        // Atualizar contadores visuais  

                        const total = obj.totalPixels || 1;  

                        const progresso = (((total - pixelErrorCount) / total) * 100).toFixed(2).replace('.', ',');  

                        pixelsText.textContent = `Remaining pixels: ${pixelErrorCount}`;  

                        progressText.textContent = `Current progress: ${progresso}%`;  

                        // Atualizar lista de cores  

                        colorList.innerHTML = "";  

                        const sortedColors = Object.entries(localColorCount).sort((a, b) => b[1] - a[1]);  

                        for (const [key, count] of sortedColors) {  

                            const [r, g, b] = key.split(',').map(Number);  

                            const hex = rgbToHex(r, g, b);  

                            const item = document.createElement("div");  

                            item.style.display = "flex";  

                            item.style.alignItems = "center";  

                            item.style.marginBottom = "2px";  

                            const colorBox = document.createElement("div");  

                            colorBox.style.backgroundColor = hex;  

                            colorBox.style.width = "12px";  

                            colorBox.style.height = "12px";  

                            colorBox.style.marginRight = "5px";  

                            const label = document.createElement("span");  

                            label.textContent = `: ${count}`;  

                            item.appendChild(colorBox);  

                            item.appendChild(label);  

                            colorList.appendChild(item);  

                        }  

                        ctx.putImageData(resultData, 0, 0);  

                        const mergedBlob = await canvas.convertToBlob();  

                        return new Response(mergedBlob, {  

                            headers: { "Content-Type": "image/png" }  

                        });  

                    }  

                }  

            }  

        }  

        return target.apply(thisArg, argList);  

    }  

});  

function blobToImage(blob) {  

    return new Promise((resolve, reject) => {  

        const img = new Image();  

        img.onload = () => resolve(img);  

        img.onerror = reject;  

        img.src = URL.createObjectURL(blob);  

    });  

}  

function loadImage(src) {  

    return new Promise((resolve, reject) => {  

        const img = new Image();  

        img.crossOrigin = "anonymous";  

        img.onload = () => {  

            resolve({  

                img,  

                width: img.naturalWidth,  

                height: img.naturalHeight  

            });  

        };  

        img.onerror = reject;  

        img.src = src;  

    });  

}  

function countOverlayPixels(data) {  

    let count = 0;  

    for (let i = 0; i < data.length; i += 4) {  

        if (data[i + 3] !== 0) count++;  

    }  

    return count;  

}  

function rgbToHex(r, g, b) {  

    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");  

}  

function patchUI() {  

    if (document.getElementById("overlay-blend-button")) return;  

    const blendButton = document.createElement("button");  

    blendButton.id = "overlay-blend-button";  

    blendButton.textContent = overlayMode.charAt(0).toUpperCase() + overlayMode.slice(1);  

    Object.assign(blendButton.style, {  

        backgroundColor: "#0e0e0e7f",  

        color: "white",  

        border: "solid",  

        borderColor: "#1d1d1d7f",  

        borderRadius: "4px",  

        padding: "5px 10px",  

        cursor: "pointer",  

        backdropFilter: "blur(2px)"  

    });  

    blendButton.addEventListener("click", () => {  

        overlayMode = OVERLAY_MODES[(OVERLAY_MODES.indexOf(overlayMode) + 1) % OVERLAY_MODES.length];  

        blendButton.textContent = overlayMode.charAt(0).toUpperCase() + overlayMode.slice(1);  

    });  

    const buttonContainer = document.querySelector("div.gap-4:nth-child(1) > div:nth-child(2)");  

    const leftSidebar = document.querySelector("html body div div.disable-pinch-zoom.relative.h-full.overflow-hidden.svelte-6wmtgk div.absolute.right-2.top-2.z-30 div.flex.flex-col.gap-4.items-center");  

    if (buttonContainer) {  

        buttonContainer.appendChild(blendButton);  

        buttonContainer.classList.remove("items-center");  

        buttonContainer.classList.add("items-end");  

    }  

    if (leftSidebar) {  

        leftSidebar.classList.add("items-end");  

        leftSidebar.classList.remove("items-center");  

    }  

}  

const observer = new MutationObserver(() => {  

    patchUI();  

});  

observer.observe(document.querySelector("div.gap-4:nth-child(1)"), {  

    childList: true,  

    subtree: true  

});  

patchUI();

})();