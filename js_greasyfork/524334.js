// ==UserScript==
// @name         PROJUDI Colors
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Conjunto de scripts para destacar os eventos no PROJUDI TJBA.
// @author       Levi
// @match        https://projudi.tjba.jus.br/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524334/PROJUDI%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/524334/PROJUDI%20Colors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para mudar a cor do texto de Contestação
    function mudarCorContestacao() {
        const elementos = document.evaluate(
            "//font[contains(text(), 'Juntada de Petição de Contestação')]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < elementos.snapshotLength; i++) {
            const elemento = elementos.snapshotItem(i);
            elemento.style.color = '#A020F0';
        }
    }

    // Função para mudar a cor do texto de Habilitação
    function mudarCorHabilitacao() {
        const elementos = document.evaluate(
            "//font[contains(text(), 'Juntada de Petição de Requisição de Habilitação')]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < elementos.snapshotLength; i++) {
            const elemento = elementos.snapshotItem(i);
            elemento.style.color = '#0000FF';
        }
    }

    // Função para destacar "Julgada procedente em parte a ação"
    function destacarProcedenteEmParte() {
        const elements = document.querySelectorAll('b > font');

        for (const element of elements) {
            if (element.textContent.trim() === 'Julgada procedente em parte a ação') {
                element.style.color = 'white';
                element.parentElement.style.backgroundColor = '#006400';
            }
        }
    }

    // Função para mudar a cor do texto da Tutela/Liminar para vinho
    function mudarCorTutelaLiminar() {
        const elementos = document.evaluate(
            "//font[contains(text(), 'Urgência')]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < elementos.snapshotLength; i++) {
            const elemento = elementos.snapshotItem(i);
            elemento.style.color = '#ff0000';
        }
    }

    // Função para mudar a cor do texto de Juntada de Petição de Recurso e Análise de Recurso
    function mudarCorRecurso() {
        const elementos = document.evaluate(
            "//font[contains(text(), 'Petição de Recurso') or contains(text(), 'Análise de Recurso')]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < elementos.snapshotLength; i++) {
            const elemento = elementos.snapshotItem(i);
            elemento.style.color = '#eead2d';
        }
    }

    // Função para mudar a cor do texto de Substabelecimento
    function mudarCorSubstabelecimento() {
        const elementos = document.evaluate(
            "//font[contains(text(), 'Juntada de Petição de Substabelecimento')]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < elementos.snapshotLength; i++) {
            const elemento = elementos.snapshotItem(i);
            elemento.style.color = '#ffa500';
        }
    }

    // Função para destacar "Julgada improcedente a ação"
    function destacarImprocedente() {
        var elements = document.evaluate("//*[contains(text(), 'Julgada improcedente a ação')]", document, null, XPathResult.ANY_TYPE, null);

        var element = elements.iterateNext();
        while (element) {
            element.style.backgroundColor = "#ff0000";
            element.style.color = "white";

            element = elements.iterateNext();
        }
    }

    // Função para modificar o texto de Medida Liminar
    function modificarMedidaLiminar() {
        // Concedida a Medida Liminar
        let xpathConcedida = "//*[contains(text(), 'Concedida a Medida Liminar') or contains(text(),'Concedido a Medida Liminar') or contains(text(),'CONCEDIDA A MEDIDA LIMINAR') or contains(text(),'CONCEDIDO A MEDIDA LIMINAR')]";
        let elementosConcedida = document.evaluate(
            xpathConcedida,
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < elementosConcedida.snapshotLength; i++) {
            const elemento = elementosConcedida.snapshotItem(i);
            elemento.style.color = '#008000';
            elemento.style.textDecoration = 'underline';
        }

        // Não Concedida a Medida Liminar
        let xpathNaoConcedida = "//*[contains(text(), 'Não Concedida a Medida Liminar') or contains(text(),'Não Concedida') or contains(text(),'Não Concedido a Medida Liminar') or contains(text(),'NÃO CONCEDIDO A MEDIDA LIMINAR')]";
        let elementosNaoConcedida = document.evaluate(
            xpathNaoConcedida,
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < elementosNaoConcedida.snapshotLength; i++) {
            const elemento = elementosNaoConcedida.snapshotItem(i);
            elemento.style.color = '#b7410e';
        }
    }

    // Função para mudar a cor do texto de Extinção
    function mudarCorExtinto() {
        const elementos = document.evaluate(
            "//font[contains(text(), 'Extinto')]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < elementos.snapshotLength; i++) {
            const elemento = elementos.snapshotItem(i);
            elemento.style.color = '#000000';
        }
    }

    // Função para modificar o texto de Embargos de Declaração
    function modificarEmbargosDeclaracao() {
        // Embargos de Declaração Acolhidos
        let xpathAcolhidos = "//*[contains(text(), 'Embargos de Declaração Acolhidos') or contains(text(), 'EMBARGOS DE DECLARAÇÃO ACOLHIDOS')]";
        let elementosAcolhidos = document.evaluate(
            xpathAcolhidos,
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < elementosAcolhidos.snapshotLength; i++) {
            const elemento = elementosAcolhidos.snapshotItem(i);
            elemento.style.color = '#008000';
        }

        // Embargos de Declaração Não-acolhidos
        let xpathNaoAcolhidos = "//*[contains(text(), 'Embargos de Declaração Não-acolhidos') or contains(text(), 'EMBARGOS DE DECLARAÇÃO NÃO-ACOLHIDOS') or contains(text(), 'Embargos de Declaração Rejeitados') or contains(text(), 'EMBARGOS DE DECLARAÇÃO REJEITADOS')]";
        let elementosNaoAcolhidos = document.evaluate(
            xpathNaoAcolhidos,
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < elementosNaoAcolhidos.snapshotLength; i++) {
            const elemento = elementosNaoAcolhidos.snapshotItem(i);
            elemento.style.color = '#b7410e';
        }
    }

    // Função para mudar a cor do texto de Acordo
    function mudarCorAcordo() {
        const elementos = document.evaluate(
            "//font[contains(text(), 'Acordo')]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < elementos.snapshotLength; i++) {
            const elemento = elementos.snapshotItem(i);
            elemento.style.color = '#008080';
        }
    }

    // Função para modificar o texto "mero expediente" para cinza e sublinhado
    function modificarMeroExpediente() {
        let xpathMeroExpediente = "//*[contains(text(), 'mero expediente')]";
        let elementosMeroExpediente = document.evaluate(
            xpathMeroExpediente,
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < elementosMeroExpediente.snapshotLength; i++) {
            const elemento = elementosMeroExpediente.snapshotItem(i);
            elemento.style.color = '#808080';
            elemento.style.textDecoration = 'underline';
        }
    }

    // Executa as funções quando a página carregar e imediatamente
    window.addEventListener('load', function() {
        mudarCorContestacao();
        mudarCorHabilitacao();
        destacarProcedenteEmParte();
        mudarCorTutelaLiminar();
        mudarCorRecurso();
        mudarCorSubstabelecimento();
        destacarImprocedente();
        modificarMedidaLiminar();
        mudarCorExtinto();
        modificarEmbargosDeclaracao();
        mudarCorAcordo();
        modificarMeroExpediente(); // Adicionado a função "mero expediente"
    });

    mudarCorContestacao();
    mudarCorHabilitacao();
    destacarProcedenteEmParte();
    mudarCorTutelaLiminar();
    mudarCorRecurso();
    mudarCorSubstabelecimento();
    destacarImprocedente();
    modificarMedidaLiminar();
    mudarCorExtinto();
    modificarEmbargosDeclaracao();
    mudarCorAcordo();
    modificarMeroExpediente(); // Adicionado a função "mero expediente"
})();