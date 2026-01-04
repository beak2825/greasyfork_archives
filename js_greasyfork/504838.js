// ==UserScript==
// @name         Meneame.net - Edición alarmista
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Resalta palabras en comentarios y notas
// @author       ᵒᶜʰᵒᶜᵉʳᵒˢ
// @match        *://*.meneame.net/*
// @run-at       document-end
// @icon         https://www.meneame.net/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/504838/Meneamenet%20-%20Edici%C3%B3n%20alarmista.user.js
// @updateURL https://update.greasyfork.org/scripts/504838/Meneamenet%20-%20Edici%C3%B3n%20alarmista.meta.js
// ==/UserScript==

(function() {
    const words = ['pero',
                   'aunque',];
    const regex = new RegExp(`(?!<a[^>]*>)(\\b(${words.join('|')})\\b)(?![^<]*</a>)`, 'gi');
    const comments = document.querySelectorAll('.comment-text');
    comments.forEach(comment => {
        comment.innerHTML = comment.innerHTML.replace(regex, match => {
            return `<span style="font-size: x-large; font-weight: bold;">${match}</span>`;
        });
    });
})();