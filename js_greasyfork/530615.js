// ==UserScript==
// @name         HS.fi Kommentit ennen ehdotuksia
// @namespace    https://greasyfork.org/en/users/1449269
// @version      1.1
// @description  Näytä kommentit ennen "Luitko jo nämä?" -listausta.
// @author       Tomi Kortelainen
// @license      MIT
// @match        https://www.hs.fi/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hs.fi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530615/HSfi%20Kommentit%20ennen%20ehdotuksia.user.js
// @updateURL https://update.greasyfork.org/scripts/530615/HSfi%20Kommentit%20ennen%20ehdotuksia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    new MutationObserver(() => {
        const comments = document.querySelector('article.comments')?.parentElement;
        if (comments) {
            const article = document.getElementById('page-main-content')?.parentElement;
            if (article && article.nextElementSibling !== comments) {
                article.insertAdjacentElement('afterend', comments);
            }
        }
    }).observe(document, {subtree: true, childList: true});
})();