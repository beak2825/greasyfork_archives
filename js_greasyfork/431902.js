// ==UserScript==
// @name         Ver elconfidencial.com
// @namespace    https://www.elconfidencial.com/
// @version      20210904.1
// @description  Elimina paywall y muestra el texto oculto de la noticia.
// @author       @rutrus
// @match        https://www.elconfidencial.com/*
// @icon         https://www.google.com/s2/favicons?domain=elconfidencial.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/431902/Ver%20elconfidencialcom.user.js
// @updateURL https://update.greasyfork.org/scripts/431902/Ver%20elconfidencialcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var noticia = document.querySelector('div.newsType__content:nth-child(5)');
    if (noticia) {
        noticia.remove();
        setTimeout(function(){
            var contenido = document.querySelector('.newsType__content');
            if (contenido){
                contenido.classList.remove('newsType__content--closed');
            }
        }, 1000);
    }
})();