// ==UserScript==
// @name         AILYZE Filter Script
// @namespace    tampermonkey.org
// @version      1.0
// @description  Filter AILYZE website elements
// @match        https://www.ailyze.com/ailyze/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486270/AILYZE%20Filter%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/486270/AILYZE%20Filter%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Localizar o botão "Summarize"
    var summarizeButton = document.evaluate("//button[contains(text(),'Summarize')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    // Verificar se o botão foi encontrado
    if (summarizeButton) {
        // Fazer algo com o botão, como adicionar um evento de clique
        summarizeButton.addEventListener('click', function() {
            // Lógica para tratar o clique no botão "Summarize"
            // ...
        });
    }

    // Localizar o elemento select com id "id_summary"
    var summarySelect = document.getElementById('id_summary');

    // Verificar se o elemento foi encontrado
    if (summarySelect) {
        // Fazer algo com o elemento select
        // ...
    }

    // Localizar o elemento select com id "id_language_options"
    var languageSelect = document.getElementById('id_language_options');

    // Verificar se o elemento foi encontrado
    if (languageSelect) {
        // Fazer algo com o elemento select
        // ...
    }

    // Localizar o elemento select com id "id_response_size"
    var responseSizeSelect = document.getElementById('id_response_size');

    // Verificar se o elemento foi encontrado
    if (responseSizeSelect) {
        // Fazer algo com o elemento select
        // ...
    }

    // Localizar o elemento main
    var mainElement = document.querySelector('body main');

    // Verificar se o elemento foi encontrado
    if (mainElement) {
        // Fazer algo com o elemento main
        // ...
    }

    // Outras localizações e tratamentos de erros podem ser adicionados conforme necessário

})();