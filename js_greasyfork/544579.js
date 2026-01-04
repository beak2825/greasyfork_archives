// ==UserScript==
// @name         Wplace Overlay Harpy
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Overlay for Wplace
// @author       hebert richers
// @match        https://wplace.live/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbGI9BVUTdE15GujzdovWGVSnLE6kAwDxJWy_GhsLGUDDEUqolAX7j6oP54g0wl8hDLyo&usqp=CAU
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544579/Wplace%20Overlay%20Harpy.user.js
// @updateURL https://update.greasyfork.org/scripts/544579/Wplace%20Overlay%20Harpy.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const OVERLAY_IMAGE_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALAAAAC6CAYAAAAOLMc4AAAAIGNIUk0AAIcLAACMDwAA/VEAAIFAAAB9dgAA6Y4AADzmAAAZzQIMv3kAAADgaUNDUHNSR0IAACjPY2BgPM0ABEwODAy5eSVFQe5OChGRUQoMSCAxubiAATdgZGD4dg1EMjBc1g0sYeVnIA1wFgEtBNIfgFgkHcxmZAGxkyBsCRC7vKSgBMjWAbGTC4pAbKCLGXiKQoKcgWwfIFshHYmdhMROSS1OBrJzgOx4hN/y5zMwWHxhYGCeiBBLmsbAsL2dgUHiDkJMZSEDA38rA8O2ywixz/5g/zKKHSpJrSgBifjpOzIUJBYlgqWZQQGalsbA8Gk5AwNvJAOD8AUGBq5oiDvAgLUYGNAM1AQMDABy2DaEK0mA2QAAAAlwSFlzAAAOwgAADsIBFShKgAAAALR6VFh0UmF3IHByb2ZpbGUgdHlwZSBleGlmAAB42l1Q2xHDIAz7Z4qOgB8kZhy40Ltu0PErsNMmFeeXFOQkabxfz/SYINOkZbetblsGtGrlhsayo65MWVde6CFhvvGptxAYlKCKj3vwdPL0NfDS0JWL0bmc+l2wENj+jGKRzDdiNEcY1VNnF0jjq0a+w37R4/JanH1OV0J3/KWjwE+Yh5BkZBHzRTKjSEO1lXU+h9MQmpyC4wfWOk3cR9oM6wAADXhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6ZjBmMmE2OGYtZGRmZS00MWI3LWFjMjctZjQ4MTMwNGM4ODFiIgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkwZjUzOGQ3LWNjMDEtNDg3ZC1iZDg0LWVhMjFkYWY5NjA5ZCIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmYyM2VjY2UxLTJmMjItNDc5Ni04NzYwLWY5NzkzODZmYWYxMyIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IkxpbnV4IgogICBHSU1QOlRpbWVTdGFtcD0iMTc1NDM1NzA1Nzk5MTEzOCIKICAgR0lNUDpWZXJzaW9uPSIyLjEwLjM4IgogICB0aWZmOk9yaWVudGF0aW9uPSIxIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNTowODowNFQyMjoyNDowNC0wMzowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjU6MDg6MDRUMjI6MjQ6MDQtMDM6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmODZmNDNlOS0xYzY2LTQ3MWEtOWE2NS00YzUxNGQ3YjdmMmEiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTGludXgpIgogICAgICBzdEV2dDp3aGVuPSIyMDI1LTA4LTA0VDIyOjI0OjE3LTAzOjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PvktVhIAAAABYktHRACIBR1IAAAAB3RJTUUH6QgFARgRE1iJhQAAN35JREFUeF7tnVvIddt519f+IrgTEENvmorZ0pgrW2/UFrQJ2BpjkLq9EIKNKNHadLfVULzQ3QvL9gDuiNoSahtstYliAlv0oh4o6W4bcMcDPXhhW8QmKSSiLWipCDs76eFz/eb3/lb/6/meMddprvf0rT+Mb445Ds94xhj/8cxnjDnX+z21usLzzz//8IU/9PDq7hFe+A9PrV555ZUpJJ575x9Yffdf+iOr3/quP3qVslp94Yd/ZPWOv/vJrbJve9vbplDlgpFs64AXX3xxulaQ/5VveG31xt/3jun+V3765dXPvPr0FK/yBHVe/qtfM8W//Xt+dPWhj//kFK+wba6pN/qCTmexHsOpDmWr7uYxZt/xnS+3faPN2q4YjZewf8hnLp5+9gNXOdsYtTEn3zqM865xS4xkqadA39GcWL5i3b8Nd1ev/dBfe/jwiy8PA+ReF5vCmrybdOoZajnCLrnk1zrcm79WfiuPtudkKq/WI2Q94jWfOtSdk2+gTG2D+yyT/bJPyu7aP6RtxqEbG/O5cp/5BPWYC8of1evapU7V3bRaPsci+zxXNmVmfF1m9ToK/bFverRqf/1Tn1n99X/6C6sf/fHPrN7+hU+vfstbf/eUPuX/6u94tEK/689O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";

    const PIXEL_URL = "https://backend.wplace.live/s0/pixel/752/1115?x=54&y=22";

    const OFFSET_X = 0; // Mover X pixels para direita (negativo = esquerda)
    const OFFSET_Y = 0; // Mover Y pixels para baixo (negativo = cima)

    function extractCoordinatesFromURL(pixelUrl) {
        try {
            const url = new URL(pixelUrl);
            const pathParts = url.pathname.split('/');
            const searchParams = new URLSearchParams(url.search);

            return {
                chunk1: pathParts[3], // ex: 752
                chunk2: pathParts[4], // ex: 1115
                posX: parseInt(searchParams.get('x')) || 0, // ex: 287
                posY: parseInt(searchParams.get('y')) || 0  // ex: 184
            };
        } catch (e) {
            console.error("Erro ao extrair coordenadas da URL:", e);
            return { chunk1: "757", chunk2: "1162", posX: 0, posY: 0 }; // valores padrão
        }
    }

    const coordinates = extractCoordinatesFromURL(PIXEL_URL);
    const [chunk1, chunk2] = [coordinates.chunk1, coordinates.chunk2];

    console.log(`Aplicando overlay no chunk ${chunk1}/${chunk2} na posição (${coordinates.posX}, ${coordinates.posY})`);

    const OVERLAY_MODES = ["overlay", "original"];
    let overlayMode = OVERLAY_MODES[0];
    let darken = false;

    const chunksString = `/${chunk1}/${chunk2}.png`

    let cachedOverlayImagePromise = null;

    const overlayImage = await getOverlayImage();
    const overlayCanvas = new OffscreenCanvas(1000, 1000);
    const overlayCtx = overlayCanvas.getContext("2d");

    const finalX = coordinates.posX + OFFSET_X;
    const finalY = coordinates.posY + OFFSET_Y;

    overlayCtx.drawImage(overlayImage, finalX, finalY);
    const overlayData = overlayCtx.getImageData(0, 0, 1000, 1000);

    console.log(`✅ Imagem posicionada em (${finalX}, ${finalY}) dentro do chunk [base: (${coordinates.posX}, ${coordinates.posY}) + offset: (${OFFSET_X}, ${OFFSET_Y})]`);

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
            cachedOverlayImagePromise = loadImage(OVERLAY_IMAGE_BASE64)
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