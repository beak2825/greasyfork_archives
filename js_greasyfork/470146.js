// ==UserScript==
// @name         Steam Workshop Items File Size
// @namespace    steam-workshop-itens-file-size
// @version      1.02
// @description  Adds file size to Steam Workshop items
// @author       Pedro Henrique
// @match        https://steamcommunity.com/workshop/browse*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470146/Steam%20Workshop%20Items%20File%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/470146/Steam%20Workshop%20Items%20File%20Size.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Função para obter o tamanho do arquivo de um URL
    function getFileSize(url) {
        return fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const fileSize = doc.getElementsByClassName("detailsStatRight")[0].innerHTML;

                return fileSize;
            })
            .catch(error => {
                console.error("Error getting file size:", error);
                return "N/A";
            });
    }

    // Função para adicionar o tamanho do arquivo abaixo de cada item
    function addFileSizeToItems() {
        const items = document.getElementsByClassName("workshopItem");

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const link = item.getElementsByTagName("a")[0];
            const url = link.href;
            getFileSize(url)
                .then(fileSize => {
                    const fileSizeElement = document.createElement("div");
                    fileSizeElement.className = "workshopItemFileSize";
                    fileSizeElement.innerHTML = "Size: " + fileSize;
                    item.appendChild(fileSizeElement);
                });
        }
    }

    // Aguarda o carregamento completo da página e adiciona o tamanho do arquivo aos itens
    window.addEventListener("load", () => {
        addFileSizeToItems();
    });

})();