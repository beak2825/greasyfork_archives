// ==UserScript==
// @name         SOBERANA Wplace Overlay
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Overlay for Wplace
// @author       C3B
// @match        https://wplace.live/*
// @icon         https://soberana.tv/images/logo.svg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544339/SOBERANA%20Wplace%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/544339/SOBERANA%20Wplace%20Overlay.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const [chunk1, chunk2] = ["758", "1161"]
    const OVERLAY_MODES = ["overlay", "original"];
    let overlayMode = OVERLAY_MODES[0];
    let darken = false;

    const chunksString = `/${chunk1}/${chunk2}.png`

    let cachedOverlayImagePromise = null;

    const overlayImage = await getOverlayImage();
    const overlayCanvas = new OffscreenCanvas(1000, 1000);
    const overlayCtx = overlayCanvas.getContext("2d");
    overlayCtx.drawImage(overlayImage, 0, 0, 1000, 1000);
    const overlayData = overlayCtx.getImageData(0, 0, 1000, 1000);

    fetch = new Proxy(fetch, {
        apply: async (target, thisArg, argList) => {
            const urlString = typeof argList[0] === "object" ? argList[0].url : argList[0];

            let url;
            try {
                url = new URL(urlString);
            } catch (e) {
                throw new Error("Invalid URL provided to fetch");
            }

            if (url.hostname === "backend.wplace.live" && url.pathname.startsWith("/files/") && url.pathname.endsWith(chunksString)) {
                if (overlayMode !== "original") {
                    const originalResponse = await target.apply(thisArg, argList);
                    const originalBlob = await originalResponse.blob();
                    const originalImage = await blobToImage(originalBlob);

                    const width = originalImage.width;
                    const height = originalImage.height;
                    const canvas = new OffscreenCanvas(width, height);
                    const ctx = canvas.getContext("2d");

                    ctx.drawImage(originalImage, 0, 0, width, height);
                    const originalData = ctx.getImageData(0, 0, width, height);

                    const resultData = ctx.getImageData(0, 0, width, height);
                    const d1 = originalData.data;
                    const d2 = overlayData.data;
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
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    function getOverlayImage() {
        if (!cachedOverlayImagePromise) {
            cachedOverlayImagePromise = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoCAMAAAB6fSTWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAzIDc5Ljk2OTBhODdmYywgMjAyNS8wMy8wNi0yMDo1MDoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI2LjkgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODk3NUYyODM2NzQ4MTFGMDkyQTNCOTQyN0FGRkM1MjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODk3NUYyODQ2NzQ4MTFGMDkyQTNCOTQyN0FGRkM1MjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4OTc1RjI4MTY3NDgxMUYwOTJBM0I5NDI3QUZGQzUyMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4OTc1RjI4MjY3NDgxMUYwOTJBM0I5NDI3QUZGQzUyMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg0ZG5AAAAAVUExURQAA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")
        }
        return cachedOverlayImagePromise;
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