// ==UserScript==
// @name         Contexto Limpio
// @author       Héctor Álvarez
// @namespace    https://github.com/Hectoralvf
// @description  Elimina múltiples elementos en ctxt.es para facilitar la lectura.
//
// @version      1.0.1
// @license MIT
//
// @icon         https://ctxt.es//themes/publication_1/theme_1/favicon/favicon-96x96.png
// @match        https://ctxt.es/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498608/Contexto%20Limpio.user.js
// @updateURL https://update.greasyfork.org/scripts/498608/Contexto%20Limpio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elementosEliminar = [];
    var elementosContenidoEliminar = [];

    // Obtener los divs con clases .mensaje y .cajita
    var divElements = document.querySelectorAll(".mensaje, .cajita, .pub");
    if (divElements.length > 0) {
        elementosEliminar.push(...divElements);
    }

    // Eliminar los divs de clase .mensaje y .cajita
    for (var i = 0; i < elementosEliminar.length; i++) {
        elementosEliminar[i].parentNode.removeChild(elementosEliminar[i]);
    }

    var boxWithPubli = document.querySelectorAll("section.box > div.subsection");
    for (var j = 0; j < boxWithPubli.length; j++) {
        var boxParent = boxWithPubli[j].parentNode;
        boxParent.remove();
    }
})();