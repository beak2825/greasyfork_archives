// ==UserScript==
// @name         Provas Analista de Informática
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract, filter, and save information from pciconcursos.com.br
// @author       You
// @match        https://www.pciconcursos.com.br/provas/analista-de-informatica/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485771/Provas%20Analista%20de%20Inform%C3%A1tica.user.js
// @updateURL https://update.greasyfork.org/scripts/485771/Provas%20Analista%20de%20Inform%C3%A1tica.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para extrair as informações da página
    function extractData(pageUrl) {
        var response = fetch(pageUrl).then(response => response.text());
        var parser = new DOMParser();
        var doc = parser.parseFromString(response, 'text/html');

        var provas = [];

        // Extrair os dados das provas
        var table = doc.querySelector('table');
        var rows = Array.from(table.querySelectorAll('tr')).slice(1); // Ignorar o cabeçalho da tabela
        for (var i = 0; i < rows.length; i++) {
            var cols = rows[i].querySelectorAll('td');
            var prova = {
                'Prova': cols[0].textContent.trim(),
                'Ano': cols[1].textContent.trim(),
                'Órgão': cols[2].textContent.trim(),
                'Instituição': cols[3].textContent.trim(),
                'Nível': cols[4].textContent.trim(),
                'Link': cols[0].querySelector('a').getAttribute('href')
            };
            provas.push(prova);
        }

        return provas;
    }

    // Extrair todas as provas em várias páginas
    function extractAllProvas() {
        var allProvas = [];
        var baseUrl = 'https://www.pciconcursos.com.br/provas/analista-de-informatica/';
        var page = 1;
        var maxPages = 6;

        while (page <= maxPages) {
            var pageUrl = baseUrl + page;
            var provas = extractData(pageUrl);
            allProvas.push(...provas);
            page++;
        }

        return allProvas;
    }

    // Filtrar as provas pela instituição
    function filterByInstitution(provas, institution) {
        var filteredProvas = provas.filter(prova => prova['Instituição'] === institution);
        return filteredProvas;
    }

    // Ordenar as provas por data em ordem decrescente
    function sortByDate(provas) {
        var sortedProvas = provas.sort((a, b) => b['Ano'] - a['Ano']);
        return sortedProvas;
    }

    // Salvar as provas filtradas em um arquivo CSV
    function saveToCSV(provas) {
        var csvContent = 'Prova,Ano,Órgão,Instituição,Nível,Link\n';
        provas.forEach(prova => {
            csvContent += `${prova['Prova']},${prova['Ano']},${prova['Órgão']},${prova['Instituição']},${prova['Nível']},${prova['Link']}\n`;
        });

        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'provas_analista_informatica_filtradas.csv';
        link.click();
    }

    // Executar o script
    var provas = extractAllProvas();
    var provasFiltradas = filterByInstitution(provas, 'CEBRASPE');
    var provasOrdenadas = sortByDate(provasFiltradas);
    saveToCSV(provasOrdenadas);
})();
