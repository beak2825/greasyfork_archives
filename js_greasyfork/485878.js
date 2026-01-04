// ==UserScript==
// @name         FilmAffinity clickable search
// @namespace    https://github.com/antoniocambados
// @version      0.2
// @description  Makes new (2023) quick search results clickable
// @author       Antonio Cambados
// @match        *://*.filmaffinity.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=filmaffinity.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/485878/FilmAffinity%20clickable%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/485878/FilmAffinity%20clickable%20search.meta.js
// ==/UserScript==

// Instrucciones de instalación:
// 1. Instalar Tampermonkey: https://www.tampermonkey.net/
// 2. Instalar este script
//   a. Usando GitHub
//     1. Acceder a la URL de este gist (https://gist.github.com/antoniocambados/452a1cc0c6f7aea6bd0600309b5ab434) y darle al botón "raw"
//     2. Debería aparecer tampermonkey con la pantalla para aceptar la instalación del script
//   b. Usando Greasey Fork
//     1. Acceder a la URL del script (https://greasyfork.org/es/scripts/485878-filmaffinity-clickable-search?locale_override=1) y seguir las instrucciones
// ---
//
// Installation instructions:
// 1. Install Tampermonkey: https://www.tampermonkey.net/
// 2. Install this script
//   a. Using GitHub
//     1. Go to this gist's URL (https://gist.github.com/antoniocambados/452a1cc0c6f7aea6bd0600309b5ab434) and click the "raw" button
//     2. A Tampermonkey page with installation confirmation should appear
//   b. Using Greasey Fork
//     1. Go to this script's URL (https://greasyfork.org/es/scripts/485878-filmaffinity-clickable-search?locale_override=1) and follow instructions

/*jshint esversion: 6*/

(function() {
    'use strict';

    function makeMovieLink(movieId) {
        return `https://www.filmaffinity.com/es/film${movieId}.html`;
    }

    function makeNameLink(nameId) {
        return `https://www.filmaffinity.com/es/name.php?name-id=${nameId}`;
    }

    function makeTheaterLink(theaterId) {
        return `https://www.filmaffinity.com/es/theater-showtimes.php?id=${theaterId}`
    }

    function replaceMovieElement(element) {
        let movieId = element.getAttribute("data-movie-id");

        if (movieId) {
            element.setAttribute("href", makeMovieLink(movieId));
            element.outerHTML = element.outerHTML.replace(/^<div/g,"<a");
            element.outerHTML = element.outerHTML.replace(/div>$/g,"a>");
        }
    }

    function replacePersonElement(element) {
        let nameId = element.getAttribute("data-name-id");

        if (nameId) {
            element.setAttribute("href", makeNameLink(nameId));
            element.outerHTML = element.outerHTML.replace(/^<div/g,"<a");
            element.outerHTML = element.outerHTML.replace(/div>$/g,"a>");
        }
    }

    function replaceTheaterElement(element) {
        let theaterId = element.getAttribute("data-theater-id");

        if (theaterId) {
            element.setAttribute("href", makeTheaterLink(theaterId));
            element.outerHTML = element.outerHTML.replace(/^<div/g,"<a");
            element.outerHTML = element.outerHTML.replace(/div>$/g,"a>");
        }
    }

    function process() {
        document.querySelectorAll(`div.movie-card-acf`).forEach(card => {
            replaceMovieElement(card);
        });

        document.querySelectorAll(`div.name-ac`).forEach(card => {
            replacePersonElement(card);
        });

        document.querySelectorAll(`div.theater-ac`).forEach(card => {
            replaceTheaterElement(card);
        });

        document.querySelectorAll(`div.movie-cast-acf`).forEach(card => {
            replaceMovieElement(card);
        });
    }

    process();

    // Se configura un MutationObserver para detectar cambios en el DOM y procesar nuevos elementos.
    const observer = new MutationObserver(() => {
        process();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();