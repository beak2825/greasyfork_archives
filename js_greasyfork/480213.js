// ==UserScript==
// @name         Converter sites em wireframes
// @namespace    tampermonkey.org
// @version      1.2
// @description  Converte todos os sites em wireframes para facilitar a análise da estrutura e layout.
// @author       Seu Nome
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480213/Converter%20sites%20em%20wireframes.user.js
// @updateURL https://update.greasyfork.org/scripts/480213/Converter%20sites%20em%20wireframes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Estilos CSS para converter em wireframes
    var styles = `
        * {
            background-color: #fff !important;
            color: #000 !important;
            border: 1px solid #000 !important;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3) !important;
            padding: 5px !important;
            margin: 5px !important;
        }

        img {
            display: none !important;
        }

        /* Adicione aqui outros estilos para personalizar o wireframe */
        
        /* Exemplo de estilização de texto */
        h1, h2, h3, h4, h5, h6 {
            font-weight: bold;
            text-decoration: underline;
        }
        
        /* Exemplo de espaçamento entre elementos */
        * + * {
            margin-top: 10px !important;
        }
    `;

    // Cria um elemento <style> com os estilos definidos acima
    var styleElement = document.createElement('style');
    styleElement.textContent = styles;

    // Adiciona o elemento <style> ao cabeçalho do documento
    document.head.appendChild(styleElement);
})();