// ==UserScript==
// @name         DramaconFansubs Player Popup
// @namespace    https://github.com/CYBERGUILD
// @version      1.3
// @description  Carrega vídeos do Google Drive em um popup diretamente no site DramaconFansubs, evitando redirecionamentos, agora com fullscreen.
// @author       CYBERGUILD
// @match        https://dramaconfansubs.blogspot.com/*/*.html
// @icon         https://dramaconfansubs.blogspot.com/favicon.ico
// @homepage     https://github.com/JempUnkn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530444/DramaconFansubs%20Player%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/530444/DramaconFansubs%20Player%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createPopup(videoUrl, episodeName, seriesName) {
        let popup = document.createElement("div");
        popup.style.position = "fixed";
        popup.style.top = "0";
        popup.style.left = "0";
        popup.style.width = "100vw";
        popup.style.height = "100vh";
        popup.style.background = "rgba(0, 0, 0, 0.8)";
        popup.style.display = "flex";
        popup.style.justifyContent = "center";
        popup.style.alignItems = "center";
        popup.style.zIndex = "10000";

        let container = document.createElement("div");
        container.style.position = "relative";
        container.style.width = "80vw";
        container.style.height = "80vh";
        container.style.background = "#000";
        container.style.borderRadius = "10px";
        container.style.overflow = "hidden";

        let closeButton = document.createElement("button");
        closeButton.innerText = "X";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.style.background = "red";
        closeButton.style.color = "white";
        closeButton.style.border = "none";
        closeButton.style.padding = "10px";
        closeButton.style.cursor = "pointer";
        closeButton.style.fontSize = "16px";
        closeButton.onclick = () => document.body.removeChild(popup);

        let title = document.createElement("h2");
        title.innerText = `${seriesName} - ${episodeName}`;
        title.style.color = "white";
        title.style.textAlign = "center";
        title.style.marginTop = "10px";

        let iframe = document.createElement("iframe");
        iframe.src = videoUrl;
        iframe.style.width = "100%";
        iframe.style.height = "90%";
        iframe.style.border = "none";
        iframe.allow = "fullscreen";

        container.appendChild(closeButton);
        container.appendChild(title);
        container.appendChild(iframe);
        popup.appendChild(container);
        document.body.appendChild(popup);
    }

    document.querySelectorAll('a[href*="drive.google.com/file/d/"]').forEach(link => {
        let driveIdMatch = link.href.match(/drive\.google\.com\/file\/d\/([^\/]+)\/view/);
        if (driveIdMatch) {
            let driveId = driveIdMatch[1];
            let videoUrl = `https://drive.google.com/file/d/${driveId}/preview`;

            let episodeElement = document.querySelector("td a[style*='font-size: 13px;']");
            let episodeName = episodeElement ? episodeElement.innerText.trim() : "Episódio Desconhecido";

            let seriesElement = document.querySelector("h1.title");
            let seriesName = seriesElement ? seriesElement.innerText.trim() : "Série Desconhecida";

            link.innerText = link.innerText.replace("Google Drive", "POPUP:Google Drive");
            link.removeAttribute("target");
            link.addEventListener("click", function(event) {
                event.preventDefault();
                createPopup(videoUrl, episodeName, seriesName);
            });
        }
    });
})();