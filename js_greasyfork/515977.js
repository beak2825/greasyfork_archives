// ==UserScript==
// @license MIT
// @name         Amazon ISBN Search
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Añade botones para buscar el libro en ZLibrary, PDF Archive y Library Genesis usando el ISBN en Amazon
// @author       Daniel
// @match        https://www.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515977/Amazon%20ISBN%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/515977/Amazon%20ISBN%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para obtener el ISBN desde la estructura específica observada
    function getISBN() {
        const isbnElements = document.querySelectorAll("#detailBullets_feature_div li");
        for (let element of isbnElements) {
            if (element.textContent.includes("ISBN-13")) {
                const isbn = element.querySelector("span:nth-child(2)").textContent.trim();
                return isbn;
            }
        }
        return null;
    }

    // Función para crear los botones de búsqueda
    function createSearchButtons(isbn) {
        const container = document.createElement("div");
        container.style.marginTop = "20px";

        // Estilo para los botones
        const buttonStyle = `
            padding: 10px;
            margin: 5px;
            background-color: #0073e6;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;

        // Botón para ZLibrary
        const zlibraryButton = document.createElement("button");
        zlibraryButton.textContent = "Buscar en ZLibrary";
        zlibraryButton.style = buttonStyle;
        zlibraryButton.onclick = () => {
            window.open(`https://es.z-lib.gs/s/${isbn}`, "_blank");
        };
        container.appendChild(zlibraryButton);

        // Botón para PDF Archive
        const pdfArchiveButton = document.createElement("button");
        pdfArchiveButton.textContent = "Buscar PDF en AnnasArchive";
        pdfArchiveButton.style = buttonStyle;
        pdfArchiveButton.onclick = () => {
            window.open(`https://annas-archive.org/search?index=&page=1&q=${isbn}&ext=pdf&sort=&display=`, "_blank");
        };
        container.appendChild(pdfArchiveButton);

        // Botón para Library Genesis
        const libGenButton = document.createElement("button");
        libGenButton.textContent = "Buscar en Library Genesis";
        libGenButton.style = buttonStyle;
        libGenButton.onclick = () => {
            window.open(`https://libgen.is/search.php?req=+${isbn}&open=0&res=25&view=simple&phrase=1&column=identifier`, "_blank");
        };
        container.appendChild(libGenButton);

        // Insertar los botones en la sección de detalles del libro
        const detailSection = document.querySelector("#detailBullets_feature_div");
        if (detailSection) {
            detailSection.appendChild(container);
        }
    }

    // Ejecutar la función principal al cargar la página
    window.onload = () => {
        const isbn = getISBN();
        if (isbn) {
            createSearchButtons(isbn);
        } else {
            console.log("ISBN no encontrado en esta página.");
        }
    };
})();
