// ==UserScript==
// @name         Ailyze Auto Summarize
// @namespace    https://www.greasyfork.org/en/scripts/xxxxx
// @version      0.1
// @description  Automate Ailyze summarization process
// @author       You
// @match        https://www.ailyze.com/ailyze/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486194/Ailyze%20Auto%20Summarize.user.js
// @updateURL https://update.greasyfork.org/scripts/486194/Ailyze%20Auto%20Summarize.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para esperar o documento carregar completamente
    function waitForDocumentLoad(callback) {
        if (document.readyState === "complete") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    // Função para clicar no botão "Summarize"
    function clickSummarizeButton() {
        document.querySelector("button:contains('Summarize')").click();
    }

    // Função para escolher o tipo de resumo como Bullet Points
    function chooseSummaryType() {
        document.querySelector("#id_summary").value = "bullet_points";
    }

    // Função para clicar em Optional Instructions e selecionar o idioma Português
    function selectLanguageAndLength() {
        document.querySelector("label:contains('Optional Instructions')").click();
        document.querySelector("#id_language_options").value = "portuguese";
        document.querySelector("#id_response_size").value = "long";
    }

    // Função para clicar em Submit
    function clickSubmitButton() {
        document.querySelector("button#submitButton").click();
    }

    // Executar as funções em sequência após o carregamento do documento
    waitForDocumentLoad(function() {
        clickSummarizeButton();
        setTimeout(chooseSummaryType, 2000); // Aguarda 2 segundos antes de escolher o tipo de resumo
        setTimeout(selectLanguageAndLength, 4000); // Aguarda 4 segundos antes de selecionar idioma e tamanho de resposta
        setTimeout(clickSubmitButton, 6000); // Aguarda 6 segundos antes de clicar em Submit
    });
})();
