// ==UserScript==
// @name         Tema anti GO_SEDUC chromebook escolar
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Fullscreen, sem borda preta, sem lag, sem travamento. Press P pra trocar
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544552/Tema%20anti%20GO_SEDUC%20chromebook%20escolar.user.js
// @updateURL https://update.greasyfork.org/scripts/544552/Tema%20anti%20GO_SEDUC%20chromebook%20escolar.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const videoURLs = [
        "https://files.catbox.moe/pdoowu.mp4",
        "https://files.catbox.moe/8rghdx.mp4",
        "https://files.catbox.moe/3q0sj1.mp4",
        "https://files.catbox.moe/0ecjn5.mp4",
        "https://files.catbox.moe/rwc0em.mp4",
        "https://files.catbox.moe/uww9y2.mp4",
        "https://files.catbox.moe/da9j9t.mp4",
        "https://files.catbox.moe/9eeurq.mp4"
    ];

    let currentIndex = 0;
    let videoElement = null;
    let preloadElement = null;

    window.addEventListener('load', () => {
        if (!document.body.className.includes("g-home")) return;

        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.innerHTML = "";

        document.documentElement.style.cssText = `
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100%;
            width: 100%;
            background: black;
        `;

        const container = document.createElement("div");
        container.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: black;
            z-index: 999999;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        const preloadNextVideo = (nextIndex) => {
            if (preloadElement) preloadElement.remove();

            preloadElement = document.createElement("video");
            preloadElement.src = videoURLs[nextIndex];
            preloadElement.preload = "auto";
            preloadElement.muted = true;
            preloadElement.style.display = "none";
            document.body.appendChild(preloadElement);
        };

        function createAndPlayVideo(index) {
            if (videoElement) {
                videoElement.pause();
                videoElement.remove();
            }

            const vid = document.createElement("video");
            vid.src = videoURLs[index];
            vid.muted = true;
            vid.playsInline = true;
            vid.loop = false;
            vid.preload = "auto";
            vid.autoplay = true;

            vid.setAttribute("playsinline", "");
            vid.setAttribute("muted", "");
            vid.setAttribute("autoplay", "");
            vid.setAttribute("disableRemotePlayback", "true");

            vid.style.cssText = `
                width: 100vw;
                height: 100vh;
                object-fit: cover;
                background-color: black;
                position: fixed;
                top: 0;
                left: 0;
            `;

            container.appendChild(vid);
            videoElement = vid;

            // ⚠️ Timer de segurança: se não carregar em 3s, troca
            const fallbackTimeout = setTimeout(() => {
                if (vid.readyState < 2) {
                    console.warn("Vídeo lento, pulando...");
                    currentIndex = (currentIndex + 1) % videoURLs.length;
                    createAndPlayVideo(currentIndex);
                }
            }, 3000);

            vid.addEventListener("canplay", () => {
                clearTimeout(fallbackTimeout);
                vid.play().catch(() => {});
            });

            vid.onerror = () => {
                console.warn("Erro no vídeo, trocando...");
                currentIndex = (currentIndex + 1) % videoURLs.length;
                createAndPlayVideo(currentIndex);
            };

            // Pré-carrega o próximo pra garantir fluidez
            const next = (index + 1) % videoURLs.length;
            preloadNextVideo(next);
        }

        createAndPlayVideo(currentIndex);

        document.addEventListener("keydown", (e) => {
            if (e.key.toLowerCase() === "p") {
                currentIndex = (currentIndex + 1) % videoURLs.length;
                createAndPlayVideo(currentIndex);
            }
        });

        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen').catch(() => {});
        }
    });
})();
