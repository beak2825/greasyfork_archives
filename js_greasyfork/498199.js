// ==UserScript==
// @name         Pornolab Image Expander
// @description  Lets you preview torrents first image by showing on hover on the tracker listing
// @namespace    https://pornolab.net/forum/index.php
// @version      1.0
// @description  try to take over the world!
// @author       Anon1337Elite
// @match        https://pornolab.net/*
// @require      https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498199/Pornolab%20Image%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/498199/Pornolab%20Image%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let links = window.document.querySelectorAll('.med .tLink');

    links.forEach((el) => {
        axios.get(el.href).then(function(res) {
            let div = document.createElement('div');
            div.innerHTML = res.data;
            let source = div.querySelector('var.postImg').title;
            let img = document.createElement('img');

            img.src = source;
            img.classList.add('appendedHoverIMg');
            img.style = 'width: auto; height: auto;';

            let container = el.closest('tr').querySelector('td.row4.med.tLeft.u');
            container.appendChild(img);
        });
    });
})();
