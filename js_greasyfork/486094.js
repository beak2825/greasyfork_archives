// ==UserScript==
// @name         Resumo e Análise Temática Automatizados
// @namespace    http://your.namespace.com
// @version      1.0
// @description  Automatiza o processo de resumo e análise temática em documentos carregados.
// @author       Your Name
// @match        https://www.ailyze.com/ailyze/*   // Insira a URL da página onde deseja que o script seja executado
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/486094/Resumo%20e%20An%C3%A1lise%20Tem%C3%A1tica%20Automatizados.user.js
// @updateURL https://update.greasyfork.org/scripts/486094/Resumo%20e%20An%C3%A1lise%20Tem%C3%A1tica%20Automatizados.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para enviar o arquivo e obter o resumo e análise temática
    function processFile(file) {
        var formdata = new FormData();
        formdata.append("demo_file", file);

        // Enviar o arquivo para obter as escolhas de análise
        fetch("/get-demo-choices/", {
            method: "POST",
            body: formdata
        })
        .then(response => response.text())
        .then(data => {
            // Escolher as opções de análise
            var choices = data;

            // Escolher a análise de resumo e análise temática
            var summaryChoice = "Bullet points";
            var thematicChoice = "Conduct thematic analysis";

            // Enviar a escolha do resumo
            fetch("/demo/", {
                method: "POST",
                body: new URLSearchParams({
                    csrfmiddlewaretoken: 'XO4LHJCL2SitzRnKatRLdNUbLzptrDyRjArpdwc3hjiEA3XM4NlS0tvRA6bd8Vqd',
                    choice_button: summaryChoice
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => response.text())
            .then(data => {
                // Resumo em pontos longo em português
                var summaryLength = "Long";
                var language = "Portuguese";
                // Enviar a escolha do resumo
                fetch("/demo/", {
                    method: "POST",
                    body: new URLSearchParams({
                        csrfmiddlewaretoken: 'XO4LHJCL2SitzRnKatRLdNUbLzptrDyRjArpdwc3hjiEA3XM4NlS0tvRA6bd8Vqd',
                        summary: summaryChoice,
                        language_options: language,
                        response_size: summaryLength
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(response => response.text())
                .then(data => {
                    console.log("Resumo em pontos longo em português:", data);

                    // Enviar a escolha da análise temática
                    fetch("/demo/", {
                        method: "POST",
                        body: new URLSearchParams({
                            csrfmiddlewaretoken: 'XO4LHJCL2SitzRnKatRLdNUbLzptrDyRjArpdwc3hjiEA3XM4NlS0tvRA6bd8Vqd',
                            choice_button: thematicChoice
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .then(response => response.text())
                    .then(data => {
                        // Análise temática em português longa
                        var thematicLength = "Long";
                        // Enviar a escolha da análise temática
                        fetch("/demo/", {
                            method: "POST",
                            body: new URLSearchParams({
                                csrfmiddlewaretoken: 'XO4LHJCL2SitzRnKatRLdNUbLzptrDyRjArpdwc3hjiEA3XM4NlS0tvRA6bd8Vqd',
                                language_options: language,
                                response_size: thematicLength
                            }),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })
                        .then(response => response.text())
                        .then(data => {
                            console.log("Análise temática em português longa:", data);
                        })
                        .catch(error => {
                            console.error('Erro na análise temática:', error);
                        });
                    })
                    .catch(error => {
                        console.error('Erro ao selecionar a análise temática:', error);
                    });
                })
                .catch(error => {
                    console.error('Erro no resumo em pontos:', error);
                });
            })
            .catch(error => {
                console.error('Erro ao selecionar o resumo em pontos:', error);
            });
        })
        .catch(error => {
            console.error('Erro ao obter escolhas de análise:', error);
        });
    }

    // Obtém o arquivo do input
    var fileInput = document.getElementById('upload_file');
    fileInput.addEventListener('change', function(event) {
        var files = event.target.files;
        if (files.length > 0) {
            var file = files[0];
            processFile(file);
        }
    });

})();
