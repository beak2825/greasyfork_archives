// ==UserScript==
// @name         Artbreeder Unlimited
// @namespace    https://leaked.wiki
// @version      1.0
// @description  Ajusta a altura da área de texto com base no conteúdo inserido e limita a 1000 caracteres
// @author       Wolf
// @match        *://artbreeder.com/create/mixer
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472038/Artbreeder%20Unlimited.user.js
// @updateURL https://update.greasyfork.org/scripts/472038/Artbreeder%20Unlimited.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    // Recupera o elemento textarea
    var textarea = document.querySelector('div#parents-row > div:nth-child(1) > div > div > div:nth-child(1) > textarea');

    // Substitui a propriedade 'maxlength' do elemento textarea
    Object.defineProperty(textarea, 'maxlength', { value: 1000 });

    // Adiciona um evento de entrada para chamar a função autoResize
    textarea.addEventListener('input', function() {
        autoResize(this);
    }, false);

    // Certifique-se de que a área de texto está vazia antes de definir a altura
    if (textarea.value === '') {
        textarea.style.height = '1px';
    }

    // Chama a função autoResize inicialmente quando a página é carregada
    window.addEventListener('DOMContentLoaded', function() {
        autoResize(textarea);
    });

    // Chama a função autoResize sempre que a janela é redimensionada
    window.addEventListener('resize', function() {
        autoResize(textarea);
    });
})();