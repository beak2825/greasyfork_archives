// ==UserScript==
// @name         TikTok Auto Video Deleter
// @namespace    https://tiktok.com/
// @version      1.0
// @description  Elimina videos automáticamente desde tu perfil en TikTok Web
// @author       ChatGPT
// @match        https://www.tiktok.com/@*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539752/TikTok%20Auto%20Video%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/539752/TikTok%20Auto%20Video%20Deleter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let deleting = false;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function deleteNextVideo() {
        if (deleting) return;
        deleting = true;

        const videoThumbs = document.querySelectorAll('a[href*="/video/"]');

        if (videoThumbs.length === 0) {
            console.log("No hay más videos en pantalla.");
            deleting = false;
            return;
        }

        for (let i = 0; i < videoThumbs.length; i++) {
            videoThumbs[i].click();
            await sleep(3000);

            // Haz clic en los 3 puntos
            const moreOptions = document.querySelector('button[aria-label="More actions"]');
            if (moreOptions) moreOptions.click();
            await sleep(1000);

            // Haz clic en "Eliminar"
            const deleteButton = Array.from(document.querySelectorAll('div')).find(div => div.innerText === 'Eliminar');
            if (deleteButton) deleteButton.click();
            await sleep(1000);

            // Confirma eliminación
            const confirmButton = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText === 'Eliminar');
            if (confirmButton) confirmButton.click();
            await sleep(3000);

            // Cierra el modal o vuelve atrás
            const closeBtn = document.querySelector('svg[aria-label="Close"]');
            if (closeBtn) closeBtn.parentElement.click();

            await sleep(2000);
        }

        deleting = false;
        console.log("Proceso de eliminación finalizado.");
    }

    // Activa con tecla D
    document.addEventListener('keydown', (e) => {
        if (e.key === 'd' || e.key === 'D') {
            console.log("Iniciando eliminación de videos...");
            deleteNextVideo();
        }
    });

})();
