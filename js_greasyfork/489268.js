// ==UserScript==
// @name         Vender Todo
// @namespace    http://tampermonkey.net/
// @version      2024-03-08
// @description  vende todo al mercader
// @author       Matias Bais
// @match        *://*.gladiatus.gameforge.com/game/index.php?mod=inventory&*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489268/Vender%20Todo.user.js
// @updateURL https://update.greasyfork.org/scripts/489268/Vender%20Todo.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Crea un nuevo elemento botón
    var button = document.createElement('button');
    button.innerHTML = 'Vender Todo';  // Texto del botón
    button.className = 'awesome-button big'; // Agrega las clases al botón

    // Agrega el botón al cuerpo del documento
    document.getElementsByClassName("inventoryBox")[0].appendChild(button);

    // Agrega un evento clic al botón
    button.addEventListener('click', function() {
        // Acciones a realizar cuando se hace clic en el botón

        var inventoryItems = document.querySelectorAll('#inv .ui-draggable');

// Trigger dblclick event on inventory items
triggerDblclickEvent(inventoryItems);
    });
})();

// Function to trigger the dblclick event on items
function triggerDblclickEvent(items) {
    items.forEach(function(item, index) {
        // Delay for each item
        setTimeout(function() {
            // Dispatch dblclick event on the item
            item.dispatchEvent(new MouseEvent('dblclick', {
                bubbles: true,
                cancelable: true
            }));
        }, index * 200); // 200 milliseconds delay for each item
    });
}
