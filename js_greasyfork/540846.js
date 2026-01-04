// ==UserScript==
// @name         Quitar posts de tios ignorados en FC
// @namespace    http://tampermonkey.net/
// @version      2025-04-24
// @description  hide posts from blocked users on vbulletin
// @author       You
// @license      Unlicense
// @match        https://forocoches.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/540846/Quitar%20posts%20de%20tios%20ignorados%20en%20FC.user.js
// @updateURL https://update.greasyfork.org/scripts/540846/Quitar%20posts%20de%20tios%20ignorados%20en%20FC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Ocultar hilos cuyo titulo contenta alguna de estas palabras
    const keywords = ['PENYA CULER', 'PEÑA MERENGUE', 'PEÑA', 'BARÇA'];

    // Buscar todos los <td> cuyo id empiece por "td_threadtitle_"
        const tdElements = document.querySelectorAll('td[id^="td_threadtitle_"]');

        tdElements.forEach(td => {
            const postTitle = td.children[0].getElementsByTagName('a')[1].textContent.toLowerCase();
            const containsKeyword = keywords.some(keyword => postTitle.includes(keyword.toLowerCase()));
            // Verificar si el atributo title está vacío
            if (td.getAttribute('title') === '' || containsKeyword) {
                // Eliminar el <tr> padre
                const tr = td.closest('tr');
                if (tr) {
                    tr.remove();
                    console.log(`Eliminado <tr> con id: ${td.id}`);
                }
            }
        });
})();