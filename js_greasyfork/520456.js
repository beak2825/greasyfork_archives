// ==UserScript==
// @name         Secretaria Toolkit - PROJUDI TJBA
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Conjunto de ferramentas para auxiliar no uso do PROJUDI TJBA
// @author       Levi Raniere
// @match        https://projudi.tjba.jus.br/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520456/Secretaria%20Toolkit%20-%20PROJUDI%20TJBA.user.js
// @updateURL https://update.greasyfork.org/scripts/520456/Secretaria%20Toolkit%20-%20PROJUDI%20TJBA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Script 1: Destacar Processos - Projudi TJBA
    function colorirProcesso() {
        function processarTexto(node) {
            const regex = /\b(\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4})\b/g;

            if (node.nodeType === 3) {
                const texto = node.nodeValue;
                if (regex.test(texto)) {
                    const span = document.createElement('span');
                    span.innerHTML = texto.replace(regex, function(match) {
                        const primeiraParte = match.substring(0, 1);
                        const quatroPrimeiros = match.substring(1, 5);
                        const restoNumero = match.substring(5);

                        return `${primeiraParte}<span style="color: #0000FF; font-size: 1.4em;">${quatroPrimeiros}</span>${restoNumero}`;
                    });
                    node.parentNode.replaceChild(span, node);
                }
            } else if (node.nodeType === 1 && !['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.tagName)) {
                Array.from(node.childNodes).forEach(processarTexto);
            }
        }

        processarTexto(document.body);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    processarTexto(node);
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', colorirProcesso);
    } else {
        colorirProcesso();
    }

    // Script 2: Número de Processo na Guia - Projudi TJBA
    const url = window.location.href;
    if (url.includes('projudi/listagens') || url.includes('projudi/movimentacao')) {
        const processNumberPattern = /\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/;
        let titleUpdated = false;

        function updateTitleWithProcessNumber() {
            if (titleUpdated) return;

            const bodyText = document.body.innerText;
            const processNumberMatch = bodyText.match(processNumberPattern);

            if (processNumberMatch && processNumberMatch.length > 0) {
                const processNumber = processNumberMatch[0];
                const firstFourDigits = processNumber.slice(1, 5);

                document.title = firstFourDigits;
                console.log(`Título atualizado: ${firstFourDigits}`);

                titleUpdated = true;
                observer.disconnect();
                clearInterval(intervalId);
            } else {
                console.log('Número do processo não encontrado.');
            }
        }

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                updateTitleWithProcessNumber();
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        const intervalId = setInterval(updateTitleWithProcessNumber, 100);
    }

    // Script 3: Selecionar Checkboxes Automaticamente - PROJUDI TJBA
    if (url.includes('https://projudi.tjba.jus.br/projudi/buscas/JuntadasParaRealizar?numeroProcesso=')) {
        function selecionarCheckboxes() {
            console.log("Tentando selecionar checkboxes...");
            var checkboxes = document.querySelectorAll('input[type="checkbox"]');
            console.log("Número de checkboxes encontradas:", checkboxes.length);
            if (checkboxes.length > 0) {
                checkboxes.forEach(function(checkbox) {
                    checkbox.checked = true;
                    console.log("Checkbox selecionada:", checkbox);
                });
            } else {
                console.warn("Nenhuma checkbox encontrada. Verifique o seletor CSS.");
            }
        }

        setTimeout(function() {
            selecionarCheckboxes();
        }, 1000);
    }

    // Script 4: Mostrar Advogados automaticamente - PROJUDI TJBA
    var clickedButtons = new Set();

    function clickMostrarOcultar() {
        console.log("Executando clickMostrarOcultar");
        var links = document.querySelectorAll('a[href*="mostraOculta"][href*="\'Adv\'"]');
        console.log("Número de links encontrados:", links.length);

        links.forEach(function(link) {
            var buttonId = link.href;

            if (!clickedButtons.has(buttonId)) {
                console.log("Clicando em:", link);
                link.click();
                clickedButtons.add(buttonId);
            } else {
                console.log("Botão já clicado:", link);
            }
        });
    }

    clickMostrarOcultar();

    var targetNode = document.querySelector('table.tabelaLista');
    if (targetNode) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    clickMostrarOcultar();
                }
            });
        });
        var config = { attributes: true, childList: true, subtree: true };
        observer.observe(targetNode, config);
    }

    // Script 5: Mudar Cor do Texto de Substabelecimento - Projudi TJBA
    function mudarCorTextoSubstabelecimento() {
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

    window.addEventListener('load', mudarCorTextoSubstabelecimento);
    mudarCorTextoSubstabelecimento();

    // Script 6: Mudar Cor do Texto de Recurso - Projudi TJBA
    function mudarCorTextoRecurso() {
        const elementos = document.evaluate(
            "//font[contains(text(), 'Recurso')]",
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

    if (url.includes('https://projudi.tjba.jus.br/projudi/listagens/DadosProcesso?numeroProcesso=')) {
        window.addEventListener('load', mudarCorTextoRecurso);
        mudarCorTextoRecurso();
    }

    // Script 7: Mudar Cor do Texto de Habilitação de Advogado - Projudi TJBA
    function mudarCorTextoHabilitacao() {
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

    window.addEventListener('load', mudarCorTextoHabilitacao);
    mudarCorTextoHabilitacao();

    // Script 8: Mudar Cor do Texto de Contestação de Advogado - Projudi TJBA
    function mudarCorTextoContestacao() {
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

    window.addEventListener('load', mudarCorTextoContestacao);
    mudarCorTextoContestacao();
})();