// ==UserScript==
// @name         Mudar Cor e Tamanho do Texto de Recurso (Réu) - PROJUDI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Muda a cor e aumenta o tamanho do texto de recurso.
// @author       Levi Raniere
// @match        https://projudi.tjba.jus.br/projudi/listagens/DadosProcesso*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520340/Mudar%20Cor%20e%20Tamanho%20do%20Texto%20de%20Recurso%20%28R%C3%A9u%29%20-%20PROJUDI.user.js
// @updateURL https://update.greasyfork.org/scripts/520340/Mudar%20Cor%20e%20Tamanho%20do%20Texto%20de%20Recurso%20%28R%C3%A9u%29%20-%20PROJUDI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para mudar a cor e aumentar o tamanho do texto
    function mudarCorETamanhoDoTexto(texto) {
        var elementos = document.querySelectorAll('body *:not(script):not(style)');
        for (var i = 0; i < elementos.length; i++) {
            var elemento = elementos[i];
            for (var j = 0; j < elemento.childNodes.length; j++) {
                var node = elemento.childNodes[j];
                if (node.nodeType === 3) { // Nó de texto
                    var textoNode = node.nodeValue;
                    var regex = new RegExp('(' + texto + ')', 'g');
                    if (regex.test(textoNode)) {
                        var substituto = textoNode.replace(regex, '<span style="color: #FF0000; font-size: larger; font-size: larger; font-size: larger; font-size: larger;">$1</span>');
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = substituto;
                        while (tempDiv.firstChild) {
                            elemento.insertBefore(tempDiv.firstChild, node);
                        }
                        elemento.removeChild(node);
                    }
                }
            }
        }
    }

    // Mudar a cor e aumentar o tamanho dos textos especificados
    mudarCorETamanhoDoTexto("Réu|réu|RÉU|ré|Ré|RÉ");
})();