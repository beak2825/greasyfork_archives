// ==UserScript==
// @name         Funções de Copiar e Colar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adiciona botões para copiar para a área de transferência e colar de lá
// @author       Você
// @match        https://codebench.icomp.ufam.edu.br/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486794/Fun%C3%A7%C3%B5es%20de%20Copiar%20e%20Colar.user.js
// @updateURL https://update.greasyfork.org/scripts/486794/Fun%C3%A7%C3%B5es%20de%20Copiar%20e%20Colar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cria o botão de Copiar
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copiar';
    copyButton.style.position = 'fixed';
    copyButton.style.bottom = '100px';
    copyButton.style.right = '20px';
    copyButton.style.zIndex = '1000';

    // Cria o botão de Colar
    const pasteButton = document.createElement('button');
    pasteButton.textContent = 'Colar';
    pasteButton.style.position = 'fixed';
    pasteButton.style.bottom = '60px';
    pasteButton.style.right = '20px';
    pasteButton.style.zIndex = '1000';

    document.body.appendChild(copyButton);
    document.body.appendChild(pasteButton);

    // Função de Copiar
    copyButton.addEventListener('click', () => {
        if (window.getSelection().toString().length > 0) {
            navigator.clipboard.writeText(window.getSelection().toString())
                .then(() => {
                    console.log('Texto copiado com sucesso');
                    alert('Texto copiado com sucesso!');
                })
                .catch(err => console.error('Falha ao copiar texto:', err));
        }
    });

    // Função de Colar
    pasteButton.addEventListener('click', () => {
        navigator.clipboard.readText()
            .then(text => {
                // Aqui, como exemplo, vamos apenas exibir o texto colado em um alert.
                // Em um cenário real, você poderia inserir este texto em um campo de entrada ou área de texto.
                // alert('Texto colado: ' + text);
            })
            .catch(err => console.error('Falha ao colar texto:', err));
    });
})();
