// ==UserScript==
// @name         Siguiente capitulo
// @namespace    http://tampermonkey.net/
// @license      GNU GPLv3
// @version      0.1
// @description  Cambiar de capitulos en TMO con las flechas del teclado
// @author       MarKazu
// @match        https://*.com/*/*/cascade
// @match        https://*.com/*/*/paginated/*
// @match        https://lectortmo.com/viewer/*/paginated
// @match        https://lectortmo.com/viewer/*/cascade
// @icon         https://www.google.com/s2/favicons?domain=lectortmo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436643/Siguiente%20capitulo.user.js
// @updateURL https://update.greasyfork.org/scripts/436643/Siguiente%20capitulo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Verificamos si nos encontramos, en el capitulo, de forma pagina
    if(window.location.href.includes("paginated")){
        /*
        En caso afirmativo, reemplazamos el "paginated" por "cascade" para ver
        todas las imagenes del capitulo
        */
        window.location = window.location.href.replace("paginated", "cascade");
    }
    //ponemos un evento 'Keydown' para verificar que letra se presiono
    document.addEventListener('keydown', logKey);
    function logKey(e) {
        //si la tecla que presionamos es la flecha derecha
        if(e.code == "ArrowRight"){
            /*
            Declaramos la variable siguiente, que contiene el div con el elemento a
            que contiene el enlace al siguiente capitulo.
            */
            let siguiente = document.querySelector(".chapter-next");
            /*
            Utilizamos el window.location para poder redireccionar al capitulo siguiente
            */
            window.location = siguiente.querySelector("a").href;
        }
        if(e.code == "ArrowLeft"){
            /*
            Declaramos la variable anterior, que contiene el div con el elemento a
            que contiene el enlace al capitulo anterior.
            */
            let anterior = document.querySelector(".chapter-prev");
            /*
            Utilizamos el window.location para poder redireccionar al capitulo anterior
            */
            window.location = anterior.querySelector("a").href;
        }
    }
})();