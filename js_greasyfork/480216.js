// ==UserScript==
// @name         Conversor de sites para Wireframes
// @namespace    http://example.com
// @version      1.0
// @description  Converte sites em wireframes básicos
// @include      http://*/*
// @include      https://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/480216/Conversor%20de%20sites%20para%20Wireframes.user.js
// @updateURL https://update.greasyfork.org/scripts/480216/Conversor%20de%20sites%20para%20Wireframes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para converter um elemento em um retângulo de wireframe
    function convertToWireframe(element) {
        var rect = element.getBoundingClientRect();
        var wireframe = document.createElement('div');
        wireframe.style.position = 'absolute';
        wireframe.style.top = rect.top + 'px';
        wireframe.style.left = rect.left + 'px';
        wireframe.style.width = rect.width + 'px';
        wireframe.style.height = rect.height + 'px';
        wireframe.style.border = '2px dashed #000';
        wireframe.style.pointerEvents = 'none';
        document.body.appendChild(wireframe);
    }

    // Função para percorrer todos os elementos da página e convertê-los em wireframes
    function convertPageToWireframes() {
        var elements = document.querySelectorAll('*');
        elements.forEach(function(element) {
            convertToWireframe(element);
        });
    }

    // Estilo para ocultar todos os elementos da página
    GM_addStyle('* { visibility: hidden !important; }');

    // Aguarda o carregamento completo da página antes de converter para wireframes
    window.addEventListener('load', function() {
        // Remove o estilo de ocultação
        GM_addStyle('* { visibility: visible !important; }');
        // Converte a página para wireframes
        convertPageToWireframes();
    });
})();