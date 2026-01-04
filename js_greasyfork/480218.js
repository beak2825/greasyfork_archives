// ==UserScript==
// @name         Converter sites em wireframes
// @namespace    tampermonkey.org
// @version      1.0
// @description  Converte todos os sites em wireframes para facilitar a análise da estrutura e layout.
// @author       Seu Nome
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480218/Converter%20sites%20em%20wireframes.user.js
// @updateURL https://update.greasyfork.org/scripts/480218/Converter%20sites%20em%20wireframes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Estilos CSS para converter em wireframes
    var styles = `
        * {
            background-color: #fff !important;
            color: #000 !important;
            border: 1px solid #000 !important;
        }
        
        img {
            display: none !important;
        }
        
        /* Adicione aqui outros estilos para personalizar o wireframe */
    `;
    
    // Cria um elemento <style> com os estilos definidos acima
    var styleElement = document.createElement('style');
    styleElement.textContent = styles;
    
    // Adiciona o elemento <style> ao cabeçalho do documento
    document.head.appendChild(styleElement);
})();