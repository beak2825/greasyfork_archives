// ==UserScript==
// @name         YouTube - Filtrar videos "Members only" (Ocultar o Marcar)
// @namespace    https://greasyfork.org/users/TuUsuario
// @version      1.0
// @description  🇲🇽 Filtra videos "Solo para miembros" en YouTube: puedes ocultarlos o marcarlos visualmente según prefieras.
// @author       TuNombre
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544888/YouTube%20-%20Filtrar%20videos%20%22Members%20only%22%20%28Ocultar%20o%20Marcar%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544888/YouTube%20-%20Filtrar%20videos%20%22Members%20only%22%20%28Ocultar%20o%20Marcar%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 🇲🇽 OPCIÓN DE MODO:
     * Cambia el valor de 'mode' a "hide" (ocultar) o "highlight" (marcar visualmente)
     * Por defecto está en "hide" para ocultar los videos.
     *
     * 🇺🇸 MODE OPTION:
     * Change the value of 'mode' to "hide" or "highlight"
     * Default is "hide" to completely hide the videos.
     */
    const mode = "hide"; // Opciones válidas: "hide" o "highlight"

    function filterMembersOnlyVideos() {
        const videos = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer');

        videos.forEach(video => {
            const alreadyHandled = video.getAttribute("data-members-handled");

            if (!alreadyHandled && (video.innerText.includes("Members only") || video.innerText.includes("Solo para miembros"))) {
                if (mode === "hide") {
                    video.style.display = "none";
                } else if (mode === "highlight") {
                    video.style.boxSizing = "border-box";
                    video.style.border = "2px solid crimson";
                    video.style.filter = "grayscale(70%) opacity(75%)";
                    video.style.backgroundColor = "#fff0f0";
                }
                video.setAttribute("data-members-handled", "true");
            }
        });
    }

    const observer = new MutationObserver(() => {
        filterMembersOnlyVideos();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', filterMembersOnlyVideos);
})();
