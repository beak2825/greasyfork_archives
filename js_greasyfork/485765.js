// ==UserScript==
// @name         Filtro de Instituições/Organizadoras de Provas
// @namespace    https://www.example.com
// @version      1.0
// @description  Filtra as provas por instituições/organizadoras específicas
// @match        https://www.pciconcursos.com.br/provas/analista-de-informatica/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485765/Filtro%20de%20Institui%C3%A7%C3%B5esOrganizadoras%20de%20Provas.user.js
// @updateURL https://update.greasyfork.org/scripts/485765/Filtro%20de%20Institui%C3%A7%C3%B5esOrganizadoras%20de%20Provas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const organizadoras = [
        "Cebraspe",
        "Cesgranrio",
        "CESPE",
        "CIEE",
        "FCC",
        "FGV",
        "Fundatec",
        "IBADE",
        "IESES",
        "MSM",
        "MPE RO",
        "TCE-RO",
        "SESDEC",
        "FUNCAB/INCAB",
        "DER RO",
        "TJ RO",
        "IPERON"
    ];

    const instituicaoExcluidaXPath = 'li:nth-child(4) span:nth-child(1) span:nth-child(1)';

    const tableRows = document.querySelectorAll("table tbody tr");

    for (const row of tableRows) {
        const instituicaoElement = row.querySelector(instituicaoExcluidaXPath);

        if (instituicaoElement) {
            const instituicao = instituicaoElement.textContent.trim();

            if (organizadoras.includes(instituicao)) {
                const prova = row.querySelector(".ua").textContent.trim();
                const ano = row.querySelector(".ub").textContent.trim();
                const orgao = row.querySelector(".uc").textContent.trim();
                const nivel = row.querySelector(".ue").textContent.trim();

                console.log("Prova:", prova);
                console.log("Ano:", ano);
                console.log("Órgão:", orgao);
                console.log("Instituição:", instituicao);
                console.log("Nível:", nivel);
                console.log("---------------------");
            }
        }
    }
})();