// ==UserScript==
// @name     Aulab Sezioni rinominate
// @match    https://hackademy.it/*
// @grant    none
// @author   MarcoInc
// @description Rinomina le sezioni "Club Alumni"
// @version  1.1.1
// @run-at   document-end
// @license MIT
// @namespace https://greasyfork.org/users/564300
// @downloadURL https://update.greasyfork.org/scripts/480884/Aulab%20Sezioni%20rinominate.user.js
// @updateURL https://update.greasyfork.org/scripts/480884/Aulab%20Sezioni%20rinominate.meta.js
// ==/UserScript==

(function() {
    let sezioni = Array.from(document.querySelectorAll("a.tw-ml-2.tw-mb-0.tw-block.tw-py-1.tw-px-3.tw-text-left.tw-align-middle.tw-font-bold.tw-uppercase.tw-text-dark")).filter(el => el.textContent.includes("Club Alumni #1"));
    sezioni.forEach(sezione => {
        let url = sezione.getAttribute('href');
        let ultimoSegmento = url.split('/').pop();
        let nome = ultimoSegmento.replace(/-/g, ' ').split(" ");
        nome.shift();
        nome.shift();

        sezione.innerHTML=`<i class="fas fa-chevron-right tw-mx-2" aria-hidden="true"></i>Club Alumni - `+nome;
    });


})();
