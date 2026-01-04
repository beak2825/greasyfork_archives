// ==UserScript==
// @name         Imgur WebP Link Fix with Full-Size Zoom
// @namespace    Violentmonkey Scripts
// @version      17.0
// @description  Replace old Imgur .webp links with clickable zoomable images, fallback & conversion, full-size zoom
// @match        *://*.imgur.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547480/Imgur%20WebP%20Link%20Fix%20with%20Full-Size%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/547480/Imgur%20WebP%20Link%20Fix%20with%20Full-Size%20Zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fallbacks = [".jpg", ".png", ".gif"];
    const cache = new Map();
    const maxConcurrent = 4;
    let queue = [];
    let running = 0;

    function stripQuery(url) {
        return url.split("?")[0];
    }

    function getFileId(url) {
        const match = url.match(/\/([a-zA-Z0-9]+)\.webp$/);
        return match ? match[1] : "imgur-fix";
    }

    async function convertWebPtoPNG(url) {
        url = stripQuery(url);
        if (cache.has(url)) return cache.get(url);

        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const bitmap = await createImageBitmap(blob);

            const canvas = document.createElement("canvas");
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(bitmap, 0, 0);

            return new Promise(resolve => {
                canvas.toBlob(pngBlob => {
                    const blobUrl = URL.createObjectURL(pngBlob);
                    const fileId = getFileId(url);
                    const result = { url: blobUrl, filename: fileId + ".png" };
                    cache.set(url, result);
                    resolve(result);
                }, "image/png");
            });
        } catch (e) {
            console.error("WebP conversion failed:", e);
            return null;
        }
    }

    function enableZoom(img, originalUrl) {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => {
            const overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.background = "rgba(0,0,0,0.9)";
            overlay.style.display = "flex";
            overlay.style.justifyContent = "center";
            overlay.style.alignItems = "center";
            overlay.style.zIndex = "10000";
            overlay.style.cursor = "zoom-out";

            const zoomImg = document.createElement("img");
            // Use the largest possible resolution by removing query strings or resizing
            zoomImg.src = originalUrl;
            zoomImg.style.maxWidth = "95%";
            zoomImg.style.maxHeight = "95%";
            zoomImg.style.boxShadow = "0 0 20px black";
            overlay.appendChild(zoomImg);

            overlay.addEventListener("click", () => document.body.removeChild(overlay));
            document.body.appendChild(overlay);
        });
    }

    async function processLink(link) {
        if (link.dataset.webpProcessed) return;
        link.dataset.webpProcessed = "true";

        let url = link.href;
        if (!url.endsWith(".webp")) return;
        url = stripQuery(url);

        const base = url.replace(/\.webp$/, "");
        let finalUrl = null;
        for (const ext of fallbacks) {
            try {
                finalUrl = await new Promise(resolve => {
                    const img = new Image();
                    const timer = setTimeout(() => resolve(null), 3000);
                    img.onload = () => { clearTimeout(timer); resolve(base + ext); };
                    img.onerror = () => { clearTimeout(timer); resolve(null); };
                    img.src = base + ext;
                });
                if (finalUrl) break;
            } catch {}
        }

        if (!finalUrl) {
            const result = await convertWebPtoPNG(url);
            if (result) finalUrl = result.url;
        }

        if (!finalUrl) return;

        // Replace link with img
        const img = document.createElement("img");
        img.src = finalUrl;
        img.style.maxWidth = "100%";
        img.style.marginTop = "4px";
        link.parentNode.replaceChild(img, link);

        enableZoom(img, url);
    }

    function queueLink(link) {
        queue.push(link);
        processQueue();
    }

    function processQueue() {
        if (running >= maxConcurrent || queue.length === 0) return;
        running++;
        const link = queue.shift();
        processLink(link).finally(() => {
            running--;
            processQueue();
        });
    }

    function fixLinks() {
        document.querySelectorAll('a').forEach(link => {
            if (link.href && link.href.endsWith(".webp") && !link.dataset.webpProcessed) {
                queueLink(link);
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fixLinks);
    } else {
        fixLinks();
    }

    new MutationObserver(fixLinks).observe(document.body, { childList: true, subtree: true });
})();
