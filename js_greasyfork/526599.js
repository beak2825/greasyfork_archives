// ==UserScript==
// @name         блюру.нет
// @namespace    awaw https://lolz.live/andrey
// @version      1.2
// @description  убирает блюр с превью вк видео
// @author       YourName
// @match        *://vkvideo.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526599/%D0%B1%D0%BB%D1%8E%D1%80%D1%83%D0%BD%D0%B5%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/526599/%D0%B1%D0%BB%D1%8E%D1%80%D1%83%D0%BD%D0%B5%D1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        div {
            unicode-bidi: unset !important;
        }
        img, .image-class {
            filter: none !important;
            -webkit-filter: none !important;
        }
    `;
    document.head.appendChild(style);

    var elements = document.querySelectorAll('div');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.filter = '';
        elements[i].style.webkitFilter = '';
        elements[i].style.unicodeBidi = 'unset';
    }

    new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            Array.from(mutation.addedNodes).forEach(function(node) {
                if (node instanceof HTMLElement && node.tagName === 'DIV') {
                    node.style.filter = '';
                    node.style.webkitFilter = '';
                    node.style.unicodeBidi = 'unset';
                }
            });
        });
    }).observe(document.body, { childList: true, subtree: true });

})();