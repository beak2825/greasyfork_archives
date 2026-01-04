// ==UserScript==
// @name         tmohentai
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  agrega un menu flotante para camnbiar de modos de lectura
// @author       mao_oaks
// @match        https://tmohentai.com/reader/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmohentai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479419/tmohentai.user.js
// @updateURL https://update.greasyfork.org/scripts/479419/tmohentai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {

        let btn_cascada = document.querySelector("#app-navbar-collapse > ul:nth-child(1) > li:nth-child(4) > ul > li:nth-child(2) > a");
        let btn_full = document.querySelector("#app-navbar-collapse > ul:nth-child(1) > li:nth-child(4) > ul > li:nth-child(4) > a");

        let btn_full_new = btn_full.cloneNode(true);
        let btn_cascada_new = btn_cascada.cloneNode(true);

        btn_full_new.style.color = "white";
        btn_cascada_new.style.color = "white";
        var controles = document.createElement("div");
        controles.setAttribute("style", "display: flex; justify-content: space-evenly; background: rgb(162, 46, 40); border-radius: 5px; position: fixed; top: 89%; width: 75%; height: 35px; align-items: center; font-variant-caps: small-caps; right: 10%;");

        controles.appendChild(btn_cascada_new);
        controles.appendChild(btn_full_new);

        var contenedor = document.querySelector("#content-images > div > div.col-xs-12.text-center");

        contenedor.appendChild(controles);

        var distanciaDesdeElTop = contenedor.getBoundingClientRect().bottom;

        var limiteInferior = 650;
        var scroll = 0;
        var scrollMoment = 0;
        var menuFlotante = controles

        window.addEventListener('scroll', function() {
            distanciaDesdeElTop = contenedor.getBoundingClientRect().bottom;

            if (distanciaDesdeElTop < limiteInferior || window.scrollY > 250) {
                menuFlotante.style.display = 'none';
            } else {
                menuFlotante.style.display = 'flex';
            }
            scroll = window.scrollY;
        });


        contenedor.addEventListener("click", function () {
            if (controles.style.display == "flex" ) {
                controles.style.display = "none";
            } else if ( distanciaDesdeElTop > limiteInferior ) {
                controles.style.display = "flex";
            }
        });


    }


    // Your code here...
})();