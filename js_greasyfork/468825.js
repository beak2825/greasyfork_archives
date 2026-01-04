// ==UserScript==
// @license MIT
// @name         Amazon Cart Item Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a button to remove all items in Amazon cart
// @author       Daniel
// @match        https://www.amazon.com/gp/cart/view.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468825/Amazon%20Cart%20Item%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/468825/Amazon%20Cart%20Item%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear el botón y establecer su texto y estilo
    var button = document.createElement('button');
    button.innerHTML = 'Eliminar todos los artículos';
    button.style.width = '200px';
    button.style.height = '40px';
    button.style.position = 'absolute';
    button.style.top = '5px';
    button.style.right = '5px';

    // Añadir el evento click al botón
    button.onclick = function(){
        // Obtener todos los enlaces de eliminación
        var deleteLinks = document.querySelectorAll('input[name="submit.delete.CURRENT"]');
        for (var i = 0; i < deleteLinks.length; i++) {
            // Hacer clic en cada enlace de eliminación
            deleteLinks[i].click();
        }
    }

    // Añadir el botón al body de la página
    document.body.appendChild(button);

})();
