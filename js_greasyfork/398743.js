// ==UserScript==
// @name         Responde Aí - Livros
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Script para ver o conteudo pago do Responde Aí!
// @author       Lucasark
// @match        https://www.respondeai.com.br/materias/solucionario/livro/1/edicao/18/*
// @match        https://www.respondeai.com.br/materias/solucionario/livro/1/edicao/18/exercicio/*
// @match        https://www.respondeai.com.br/praticar/218/lista/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398743/Responde%20A%C3%AD%20-%20Livros.user.js
// @updateURL https://update.greasyfork.org/scripts/398743/Responde%20A%C3%AD%20-%20Livros.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    };

    addGlobalStyle('.blur{-webkit-filter:blur(0px);filter:blur(0px);pointer-events:all}');
    addGlobalStyle('.overlay{visibility: hidden}login-disclaimer{visibility: hidden}');
    addGlobalStyle('login-disclaimer{visibility: hidden}');
})();