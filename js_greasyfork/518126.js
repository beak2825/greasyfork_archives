// ==UserScript==
// @name         Sorteio Teatro
// @namespace    tampermonkey.com
// @version      2024-11-19
// @description  Bot to fulfill a form to win tickets to a show
// @author       Guilherme Scafi
// @match        https://docs.google.com/forms/d/e/1FAIpQLSfOrxOOtHNyJ-H9bx-eYfmD635QVXz97XTB27x-FofcB0uvgQ/viewform
// @match        https://docs.google.com/forms/u/0/d/e/1FAIpQLSfOrxOOtHNyJ-H9bx-eYfmD635QVXz97XTB27x-FofcB0uvgQ/formResponse
// @downloadURL https://update.greasyfork.org/scripts/518126/Sorteio%20Teatro.user.js
// @updateURL https://update.greasyfork.org/scripts/518126/Sorteio%20Teatro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var nameToInput = "Guilherme Sígolo Scafi";
    var cpfToInput = "417811438-70";
    var showName = "Thiago Ventura";

    function processForm() {
        var nameField = document.querySelector('input[aria-labelledby="i1 i4"]');
        if (nameField) {
            nameField.value = nameToInput;
            nameField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("Nome preenchido.");
        } else {
            console.error("Campo 'Nome Completo' não encontrado.");
            return;
        }

        var cpfField = document.querySelector('input[aria-labelledby="i6 i9"]');
        if (cpfField) {
            cpfField.value = cpfToInput;
            cpfField.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("CPF preenchido.");
        } else {
            console.error("Campo 'CPF' não encontrado.");
            return;
        }

        selectShowOption(showName, clickSubmitButton);
    }

    function selectShowOption(showName, callback) {
        var radioButton = Array.from(document.querySelectorAll('div[role="radio"]')).find(radio => {
            console.log("Verificando rádio:", radio.getAttribute('aria-label'));
            return radio.getAttribute('aria-label').includes(showName);
        });
        if (radioButton) {
            radioButton.click();
            console.log("Opção de show selecionada:", showName);
            setTimeout(callback, 3000); // Aguarda 3 segundos antes de executar o callback
        } else {
            console.error("Opção de show não encontrada:", showName);
        }
    }

    function clickSubmitButton() {
        var submitButton = document.querySelector('div[role="button"][aria-label="Submit"]');
        if (submitButton) {
            console.log("Botão 'Enviar' encontrado.");
            submitButton.click();
        } else {
            console.error("Botão 'Enviar' não encontrado.");
        }
    }

    function checkAndReload() {
        // Verifica se estamos na URL de resposta
        if (window.location.href.includes("formResponse")) {
            console.log("Na página de resposta. Recarregando para a página inicial do formulário em 30 segundos...");
            setTimeout(function() {
                window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSfOrxOOtHNyJ-H9bx-eYfmD635QVXz97XTB27x-FofcB0uvgQ/viewform";
            }, 30000); // 30 segundos de atraso antes de recarregar para a página inicial do formulário
        } else {
            console.log("Não estamos na página de resposta. Nenhuma ação necessária.");
        }
    }

    window.addEventListener('load', function() {
        if (window.location.href.includes("viewform")) {
            setTimeout(processForm, 2000); // Adiciona um atraso inicial para o carregamento completo da página
        }
        setTimeout(checkAndReload, 30000);
    });

})();