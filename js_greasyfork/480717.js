// ==UserScript==
// @name         Site to Wireframe
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Converte a aparência do site para um esquema de cores simples
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480717/Site%20to%20Wireframe.user.js
// @updateURL https://update.greasyfork.org/scripts/480717/Site%20to%20Wireframe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Adicione estilos simples para transformar a aparência do site
    const styles = `
        body {
            background-color: #f0f0f0 !important;
        }

        * {
            border: 1px solid #ccc !important;
        }
    `;

    // Cria um elemento de estilo e adiciona ao cabeçalho do documento
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(styles));
    document.head.appendChild(styleElement);
})();
