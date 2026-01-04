// ==UserScript==
// @name         Botão Copiar e Colar complemento no INFODIP
// @namespace    https://greasyfork.org/pt-BR/scripts/542953
// @version      2.3.2
// @description  Botão funcional que copia o número da comunicação e cola no complemento do INFODIP, evitando duplicação.
// @author       Ramon Machado
// @match        https://infodip.tse.jus.br/infodip*
// @match        https://infodiphmg.tse.jus.br/infodip/*
// @grant        none
// @icon         https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/128px/1f4cb.png
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/542953/Bot%C3%A3o%20Copiar%20e%20Colar%20complemento%20no%20INFODIP.user.js
// @updateURL https://update.greasyfork.org/scripts/542953/Bot%C3%A3o%20Copiar%20e%20Colar%20complemento%20no%20INFODIP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function tryInsertButton() {
        const span = document.querySelector('span.fontBlackBold');
        const inputComplemento = document.getElementById('complemento');

        if (!span || !inputComplemento) {
            setTimeout(tryInsertButton, 500);
            return;
        }

        if (document.getElementById('btnInfodipRemoverDuplicacao')) {
            return;
        }

        // Cria o botão
        const botao = document.createElement('button');
        botao.id = 'btnInfodipRemoverDuplicacao';
        botao.innerText = 'Copiar e Colar';
        botao.style.marginLeft = '10px';
        botao.style.padding = '4px 8px';
        botao.style.fontSize = '12px';
        botao.style.cursor = 'pointer';
        botao.style.fontWeight = 'bold';
        //botao.style.border = '0.5px solid #ccc'; // borda fina cinza claro
        //botao.style.borderRadius = '3px'; // borda arredondada de 4px


        // Cria o aviso
        const aviso = document.createElement('span');
        aviso.innerText = '';
        aviso.style.marginLeft = '8px';
        aviso.style.color = 'green';
        aviso.style.fontWeight = 'bold';
        aviso.style.fontSize = '12px';
        aviso.style.userSelect = 'none';

        botao.addEventListener('click', () => {
            let valorAtual = inputComplemento.value.trim();

            function removeDuplicacaoFinal(texto) {
                const partes = texto.split('/');

                if (partes.length < 4) return texto;

                const lastTwo = partes.slice(-2).join('/');
                const beforeLastTwo = partes.slice(0, -2).join('/');

                function normalizar(str) {
                    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
                }

                const lastTwoNorm = normalizar(lastTwo);
                const beforeLastTwoNorm = normalizar(beforeLastTwo);

                if (beforeLastTwoNorm.endsWith(lastTwoNorm)) {
                    return partes.slice(0, -2).join('/');
                }

                return texto;
            }

            valorAtual = removeDuplicacaoFinal(valorAtual);

            const numeroComunicacao = span.textContent.trim();
            const textoParaCopiar = 'INFODIP ' + numeroComunicacao;

            // Checa se já existe o número da comunicação no complemento (independente do texto 'INFODIP')
            if (valorAtual.includes(numeroComunicacao)) {
                aviso.innerText = '⚠️ Número da comunicação já colado no complemento.';
                aviso.style.color = 'red';
                setTimeout(() => {
                    aviso.innerText = '';
                    aviso.style.color = 'green';
                }, 3000);
                return;
            }

            let resultadoFinal = (valorAtual + ' ' + textoParaCopiar).trim();

            // Checa se excede 70 caracteres
            if (resultadoFinal.length > 70) {
                // Remove pontos e hífens se exceder 70 caracteres
                if (valorAtual.includes('.') || valorAtual.includes('-')) {
                    valorAtual = valorAtual.replace(/[\.\-]/g, '');
                    resultadoFinal = (valorAtual + ' ' + textoParaCopiar).trim();
                }

                if (resultadoFinal.length > 70) {
                    aviso.innerText = '⚠️ Excede 70 caracteres mesmo sem pontos e hífens! Não colado.';
                    aviso.style.color = 'red';
                    setTimeout(() => {
                        aviso.innerText = '';
                        aviso.style.color = 'green';
                    }, 3000);
                    return;
                }
            }

            navigator.clipboard.writeText(resultadoFinal)
                .then(() => {
                    inputComplemento.value = resultadoFinal;

                    // Adiciona um fundo verde claro no campo complmemento, caso a cópia dê certo.
                    const originalBg = inputComplemento.style.backgroundColor;
                    inputComplemento.style.backgroundColor = '#b2f2bb'; // verde claro
                    setTimeout(() => {
                        inputComplemento.style.backgroundColor = originalBg;
                    }, 2000);

                    aviso.innerText = '✔️ Número da comunicação colado!';
                    aviso.style.color = 'green';
                    setTimeout(() => {
                        aviso.innerText = '';
                    }, 2000);
                })
                .catch(() => {
                    aviso.innerText = '⚠️ Erro ao copiar';
                    aviso.style.color = 'red';
                });
        });

        // Insere botão e aviso imediatamente após o span
        span.parentNode.insertBefore(botao, span.nextSibling);
        span.parentNode.insertBefore(aviso, botao.nextSibling);
    }

    tryInsertButton();

})();