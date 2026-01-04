// ==UserScript==
// @name         Filtro de provas por órgão
// @namespace    https://www.example.com
// @version      1.0
// @description  Filtra as provas por órgão desejado
// @match        https://www.pciconcursos.com.br/provas/analista-de-informatica/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485764/Filtro%20de%20provas%20por%20%C3%B3rg%C3%A3o.user.js
// @updateURL https://update.greasyfork.org/scripts/485764/Filtro%20de%20provas%20por%20%C3%B3rg%C3%A3o.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Array com os órgãos desejados
    var orgaosDesejados = ["Cebraspe", "Cesgranrio", "CIEE", "FCC", "FGV", "IBADE", "IESES", "MPE RO", "TCE-RO", "SESDEC", "DER RO", "TJ RO", "FUNCAB", "CESPE"];

    // Selecionar todas as linhas da tabela de provas
    var linhasProvas = document.querySelectorAll("table tbody tr");

    // Iterar sobre as linhas das provas
    linhasProvas.forEach(function(linha) {
        // Obter o valor do órgão na coluna correspondente (terceira coluna)
        var orgao = linha.querySelector("td.uc").textContent.trim();

        // Verificar se o órgão está na lista de órgãos desejados
        var orgaoEncontrado = false;
        orgaosDesejados.forEach(function(orgaoDesejado) {
            if (orgao.includes(orgaoDesejado)) {
                orgaoEncontrado = true;
            }
        });

        // Remover a linha da prova que não possui o órgão desejado
        if (!orgaoEncontrado) {
            linha.style.display = "none";
        }
    });

    // Alterar o texto para português
    var tituloDownload = document.querySelector("h1.tablescraper-selected-row");
    if (tituloDownload) {
        tituloDownload.textContent = "Provas para Download";
    }

    var visualizarArquivos = document.querySelector("h3:contains('Visualizar os arquivos PDF dentro do navegador')");
    if (visualizarArquivos) {
        visualizarArquivos.textContent = "Visualizar os arquivos PDF dentro do navegador";
    }

    var downloadArquivos = document.querySelector("h3:contains('Download dos arquivos em formato PDF')");
    if (downloadArquivos) {
        downloadArquivos.textContent = "Download dos arquivos em formato PDF";
    }
})();