// ==UserScript==
// @name         Auto Upload and Summarize
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically select options and summarize upon uploading a file
// @author       You
// @match        https://www.ailyze.com/ailyze/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486187/Auto%20Upload%20and%20Summarize.user.js
// @updateURL https://update.greasyfork.org/scripts/486187/Auto%20Upload%20and%20Summarize.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para esperar até que um elemento esteja disponível na página
    function waitForElement(selector, callback) {
        var el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(function() {
                waitForElement(selector, callback);
            }, 500);
        }
    }

    // Função para selecionar uma opção em um menu suspenso
    function selectOption(selector, value) {
        var select = document.querySelector(selector);
        if (select) {
            var options = select.options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].value === value) {
                    options[i].selected = true;
                    break;
                }
            }
        }
    }

    // Função principal
    function main() {
        // Selecionar arquivo automaticamente
        var fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.click();
        }

        // Esperar até que o arquivo seja carregado
        waitForElement('input[name="upload_file"]', function(uploadButton) {
            // Aguardar até que o loader desapareça (supondo que seja uma classe chamada 'loader')
            waitForElement('.loader', function(loader) {
                waitForElement('#choices > form > button.btn', function(summarizeButton) {
                    // Clique para resumir
                    summarizeButton.click();

                    // Escolher o tipo de resumo (Bullet Points)
                    selectOption('select[name="summary"]', 'Bullet points');

                    // Abrir opções de idioma
                    var instructionsLabel = document.querySelector('label[data-bs-toggle="collapse"]');
                    if (instructionsLabel) {
                        instructionsLabel.click();
                    }

                    // Selecionar o idioma (Português)
                    selectOption('select[name="id_language_options"]', 'Portuguese');

                    // Selecionar o tamanho da resposta (Long)
                    selectOption('select[name="id_response_size"]', 'Long');
                });
            });
        });
    }

    // Executar a função principal após o carregamento da página
    window.addEventListener('load', main);
})();
