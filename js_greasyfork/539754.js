// ==UserScript==
// @name         TikTok Auto Delete All Videos
// @namespace    https://tiktok.com/
// @version      1.1
// @description  Borra todos los videos de tu perfil de TikTok automáticamente al cargar la página
// @author       ChatGPT
// @match        https://www.tiktok.com/@*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539754/TikTok%20Auto%20Delete%20All%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/539754/TikTok%20Auto%20Delete%20All%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let deleting = false;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function deleteAllVideos() {
        if (deleting) return;
        deleting = true;

        while (true) {
            const videos = document.querySelectorAll('a[href*="/video/"]');
            if (videos.length === 0) {
                console.log("No hay más videos en pantalla.");
                break;
            }

            const video = videos[0];
            video.scrollIntoView();
            video.click();
            await sleep(3000);

            const moreBtn = document.querySelector('button[aria-label="More actions"]');
            if (moreBtn) moreBtn.click();
            await sleep(1000);

            const deleteOption = Array.from(document.querySelectorAll('div')).find(el => el.innerText === 'Eliminar');
            if (deleteOption) deleteOption.click();
            await sleep(1000);

            const confirmDelete = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText === 'Eliminar');
            if (confirmDelete) confirmDelete.click();
            await sleep(3000);

            const closeBtn = document.querySelector('svg[aria-label="Close"]');
            if (closeBtn && closeBtn.parentElement) closeBtn.parentElement.click();
            await sleep(2000);

            location.reload(); // recarga para actualizar la lista de videos
            await sleep(5000);
        }

        console.log("Eliminación completa.");
    }

    // Espera a que cargue el perfil y empieza
    window.addEventListener('load', () => {
        setTimeout(deleteAllVideos, 5000);
    });

})();
