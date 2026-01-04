// ==UserScript==
// @name         Missão Wplace Overlay
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Overlay for Wplace
// @author       llucarius
// @match        https://wplace.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=partidomissao.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543949/Miss%C3%A3o%20Wplace%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/543949/Miss%C3%A3o%20Wplace%20Overlay.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const CHUNK_WIDTH = 1000
    const CHUNK_HEIGHT = 1000

    const overlays = await fetchData();

    for (const obj of overlays) {
        obj.chunksString = `/${obj.chunk[0]}/${obj.chunk[1]}.png`

        const { img, width, height } = await loadImage(obj.url)

        const overlayCanvas = new OffscreenCanvas(1000, 1000);
        const overlayCtx = overlayCanvas.getContext("2d");
        overlayCtx.drawImage(img, obj.coords[0], obj.coords[1], width, height);
        obj.imageData = overlayCtx.getImageData(0, 0, 1000, 1000);
    }

    const OVERLAY_MODES = ["overlay", "original", "chunks"];
    let overlayMode = OVERLAY_MODES[0];

    fetch = new Proxy(fetch, {
        apply: async (target, thisArg, argList) => {
            const urlString = typeof argList[0] === "object" ? argList[0].url : argList[0];

            let url;
            try {
                url = new URL(urlString);
            } catch (e) {
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

                            for (let i = 0; i < d1.length; i += 4) {
                                const isTransparent =
                                      d2[i] === 0 &&
                                      d2[i + 1] === 0 &&
                                      d2[i + 2] === 0 &&
                                      d2[i + 3] === 0;

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
                                }
                            }

                            ctx.putImageData(resultData, 0, 0);
                            const mergedBlob = await canvas.convertToBlob();

                            return new Response(mergedBlob, {
                                headers: { "Content-Type": "image/png" }
                            });
                        }
                    }
                }
            } else if (overlayMode === "chunks") {
                if (url.hostname === "backend.wplace.live" && url.pathname.startsWith("/files/")) {
                    const parts = url.pathname.split("/")
                    const [chunk1, chunk2] = [parts.at(-2), parts.at(-1).split(".")[0]]

                    const canvas = new OffscreenCanvas(CHUNK_WIDTH, CHUNK_HEIGHT);
                    const ctx = canvas.getContext("2d", { willReadFrequently: true });

                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(0, 0, CHUNK_WIDTH, CHUNK_HEIGHT);

                    ctx.font = '30px Arial';
                    ctx.fillStyle = 'red';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`${chunk1}, ${chunk2}`, CHUNK_WIDTH / 2, CHUNK_HEIGHT / 2);

                    const mergedBlob = await canvas.convertToBlob();

                    return new Response(mergedBlob, {
                        headers: { "Content-Type": "image/png" }
                    });
                }
            }

            return target.apply(thisArg, argList);
        }
    });

    async function fetchData() {
        const response = await fetch("https://gist.githubusercontent.com/yl99a/45ec3df57cc75c4b93c45251b87eb20b/raw/overlays.json?" + Date.now());
        return await response.json();
    }

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

    function patchUI() {
        if (document.getElementById("overlay-blend-button")) {
            return;
        }
        let blendButton = document.createElement("button");
        blendButton.id = "overlay-blend-button";
        blendButton.textContent = overlayMode.charAt(0).toUpperCase() + overlayMode.slice(1);
        blendButton.style.backgroundColor = "#0e0e0e7f";
        blendButton.style.color = "white";
        blendButton.style.border = "solid";
        blendButton.style.borderColor = "#1d1d1d7f";
        blendButton.style.borderRadius = "4px";
        blendButton.style.padding = "5px 10px";
        blendButton.style.cursor = "pointer";
        blendButton.style.backdropFilter = "blur(2px)";

        blendButton.addEventListener("click", () => {
            overlayMode = OVERLAY_MODES[(OVERLAY_MODES.indexOf(overlayMode) + 1) % OVERLAY_MODES.length];
            blendButton.textContent = `${overlayMode.charAt(0).toUpperCase() + overlayMode.slice(1)}`;
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