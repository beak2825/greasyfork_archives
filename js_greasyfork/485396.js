// ==UserScript==
// @name         Meneame.net - Redirigir a + valorados
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Abre por defecto en modo "comentarios más valorados" en meneos, subs y artículos
// @author       ᵒᶜʰᵒᶜᵉʳᵒˢ
// @match        *://*.meneame.net/story/*
// @match        *://*.meneame.net/m/*/*
// @run-at       document-start
// @icon         https://www.meneame.net/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/485396/Meneamenet%20-%20Redirigir%20a%20%2B%20valorados.user.js
// @updateURL https://update.greasyfork.org/scripts/485396/Meneamenet%20-%20Redirigir%20a%20%2B%20valorados.meta.js
// ==/UserScript==

const Default = '/best-comments'; /*
                '/standard'      // Ordenados
                '/threads'       // Hilos
                '/best-threads'  // Mejores hilos
                '/best-comments' // + Valorados
                '/voters'        // Votos
                '/log'           // Registros
                '/sneak'         // µ fisgona
                '/related'       // Relacionadas
                '/answered'      // Comentarios con respuestas (el resto no aparecen) */

(function() {
    const regex_comment = /\/c\d{1,4}#c-\d{1,4}$/;
    const URL = window.location.href;
    const REF = document.referrer;
    if ((URL.includes('/story/') && !REF.includes('/story/'))|(URL.includes('/m/') && !REF.includes('/m/'))
        && (!REF.includes('/story/')|!REF.includes('/m/'))
        && !URL.endsWith(Default)
        && !regex_comment.test(URL)) {
        window.location.replace(URL + Default);
    }
})();