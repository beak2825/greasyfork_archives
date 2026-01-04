// ==UserScript==
// @name         MangaDex Chapter Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adiciona botão para baixar capítulos da MangaDex
// @author       alisson31br
// @match        https://mangadex.org/chapter/*
// @grant        GM_download
// @jshint esversion: 8
// @downloadURL https://update.greasyfork.org/scripts/531870/MangaDex%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/531870/MangaDex%20Chapter%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const button = document.createElement("button");
    button.textContent = "Baixar";
    button.style.position = "absolute";
    button.style.top = "10px";
    button.style.left = "50%";
    button.style.transform = "translateX(-50%)";
    button.style.backgroundColor = "black";
    button.style.color = "white";
    button.style.padding = "10px 20px";
    button.style.fontSize = "16px";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.zIndex = "10000";
    document.body.appendChild(button);

    button.addEventListener("click", async () => {
        const match = window.location.pathname.match(/\/chapter\/([a-f0-9\-]{36})/i);
        const chapterId = match ? match[1] : null;
        console.log(chapterId)

        try {
            
            const response = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`);
            const data = await response.json();

            const baseUrl = data.baseUrl;
            const hash = data.chapter.hash;
            const images = data.chapter.data;

            for (let i = 0; i < images.length; i++) {
                const imgUrl = `${baseUrl}/data/${hash}/${images[i]}`;
                const fileName = `${i + 1}.png`;

                GM_download({
                    url: imgUrl,
                    name: fileName,
                    saveAs: false,
                    onerror: e => console.error("Erro ao baixar imagem:", e)
                });
            }
        } catch (error) {
            console.error("Erro ao baixar capítulo:", error);
            alert("Erro ao baixar capítulo. Verifique o console.");
        }
    });
})();