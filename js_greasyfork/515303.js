// ==UserScript==
// @name         Faster Sounter
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Controla a reprodução no sounter.com usando as teclas "a", "d" e "w" e copia a frase atual da música ou o texto selecionado quando pressiona Ctrl + C.
// @author       Kycoft
// @match        *://sounter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515303/Faster%20Sounter.user.js
// @updateURL https://update.greasyfork.org/scripts/515303/Faster%20Sounter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para obter o texto selecionado na página
    function obterTextoSelecionado() {
        return window.getSelection().toString();
    }

    // Função para obter a frase atual da música
    function obterFraseAtual() {
        // Procurando pelo verso atual dentro do div com a classe "Karaoke_highlighted__bcVTQ"
        var fraseAtualElemento = document.querySelector('.Karaoke_highlighted__bcVTQ .Karaoke_completePhrase__Q4uz_');

        if (fraseAtualElemento) {
            return fraseAtualElemento.textContent.trim();
        } else {
            return "Frase não encontrada";
        }
    }

    // Função para copiar o texto para a área de transferência
    function copiarTextoParaAreaDeTransferencia(texto) {
        var textarea = document.createElement('textarea');
        textarea.value = texto;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // Função para simular clique no elemento
    function simularClique(elemento) {
        if (elemento) {
            var eventoClique = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            elemento.dispatchEvent(eventoClique);
        }
    }

    // Ouvinte de evento para Ctrl + C, "a", "d" e "w"
    document.addEventListener('keydown', function (event) {
        // Elemento "SkipPrevious" (tecla "a")
        if (event.key === 'a') {
            var skipPreviousIcon = document.querySelector('[data-testid="SkipPreviousIcon"]');
            simularClique(skipPreviousIcon);
        }

        // Elemento "SkipNext" (tecla "d")
        if (event.key === 'd') {
            var skipNextIcon = document.querySelector('[data-testid="SkipNextIcon"]');
            simularClique(skipNextIcon);
        }

        // Elemento "TranslateIcon" (tecla "w")
        if (event.key === 'w') {
            var translateIcon = document.querySelector('[data-testid="TranslateIcon"]');
            simularClique(translateIcon);
        }

        // Ctrl + C para copiar frase atual ou texto selecionado
        if (event.ctrlKey && event.key === 'c') {
            var textoSelecionado = obterTextoSelecionado();

            if (textoSelecionado) {
                // Se houver texto selecionado, copie esse texto
                copiarTextoParaAreaDeTransferencia(textoSelecionado);
                console.log('Texto selecionado copiado: ' + textoSelecionado);
            } else {
                // Caso contrário, copie a frase atual da música
                var fraseAtual = obterFraseAtual();
                copiarTextoParaAreaDeTransferencia(fraseAtual);
                console.log('Frase atual copiada: ' + fraseAtual);
            }
        }
    });

})();
