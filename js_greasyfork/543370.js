// ==UserScript==
// @name         Vegeta Ultra Ego Fullscreen Switcher Turbo V3
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Vídeo fullscreen insano, troca a cada 10s ou ao apertar 'P' instantâneo, sem delay NUNCA!
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543370/Vegeta%20Ultra%20Ego%20Fullscreen%20Switcher%20Turbo%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/543370/Vegeta%20Ultra%20Ego%20Fullscreen%20Switcher%20Turbo%20V3.meta.js
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

    if (!document.body.className.includes("g-home")) return;

    document.documentElement.innerHTML = "";

    const container = document.createElement("div");
    container.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        background-color: black;
        overflow: hidden;
    `;
    document.body.appendChild(container);

    // Pré-carrega todos os vídeos e esconde (só mostra o atual)
    const videos = videoURLs.map((url, i) => {
        const vid = document.createElement("video");
        vid.src = url;
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: ${i === 0 ? "block" : "none"};
        `;
        container.appendChild(vid);
        return vid;
    });

    let index = 0;
    let intervalId = setInterval(() => {
        videos[index].style.display = "none";
        index = (index + 1) % videos.length;
        videos[index].style.display = "block";
    }, 10000);

    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "p") {
            clearInterval(intervalId); // cancela troca automática
            videos[index].style.display = "none";
            index = (index + 1) % videos.length;
            videos[index].style.display = "block";
        }
    });
})();
