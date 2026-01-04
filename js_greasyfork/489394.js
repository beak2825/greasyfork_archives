// ==UserScript==
// @name         Empaquetar todo
// @namespace    http://tampermonkey.net/
// @version      2024-03-09
// @description  Vende todo a uno de oro en el mercado de la alianza (lo tenes que tener seteado asi en el crazy addon)
// @author       Matias Bais
// @match         *://*.gladiatus.gameforge.com/game/index.php?mod=guildMarket&*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489394/Empaquetar%20todo.user.js
// @updateURL https://update.greasyfork.org/scripts/489394/Empaquetar%20todo.meta.js
// ==/UserScript==


var button = document.createElement('button');
    button.innerHTML = 'Empaquetar Todo';  // Texto del botón
    button.className = 'awesome-button big'; // Agrega las clases al botón

    // Agrega el botón al cuerpo del documento
    document.getElementsByClassName("inventoryBox")[0].appendChild(button);

    // Agrega un evento clic al botón
    button.addEventListener('click', function() {
        // Acciones a realizar cuando se hace clic en el botón
        localStorage.setItem('venderTodo', true);
        window.location.reload();
// Trigger dblclick event on inventory items

    });


var button2 = document.createElement('button');
    button2.innerHTML = 'cancelar';  // Texto del botón
    button2.className = 'awesome-button big'; // Agrega las clases al botón

    // Agrega el botón al cuerpo del documento
    document.getElementsByClassName("inventoryBox")[0].appendChild(button2);

    // Agrega un evento clic al botón
    button2.addEventListener('click', function() {
        // Acciones a realizar cuando se hace clic en el botón
        localStorage.setItem('venderTodo', false);
        window.location.reload();
// Trigger dblclick event on inventory items

    });

let venderTodo = localStorage.getItem('venderTodo');
console.log(venderTodo);
console.log(venderTodo=='true');
if (venderTodo == null){
   venderTodo==false;
    localStorage.setItem('venderTodo', false);
}

let boton = document.getElementsByName('anbieten')[0];
if(boton.disabled){
    venderTodo=false;
    localStorage.setItem('venderTodo', false);
}

if(venderTodo=='true'){
    console.log('vendiendo');
    let boton = document.getElementsByName('anbieten')[0];
    let inventoryItem = document.querySelector('#inv .ui-draggable');
    if(inventoryItem==null){
      localStorage.setItem('venderTodo', false);
        return;
    }
    setTimeout(function() {
            // Dispatch dblclick event on the item
            inventoryItem.dispatchEvent(new MouseEvent('dblclick', {
                bubbles: true,
                cancelable: true
            }));
        }, 200);
    setTimeout(function() {
            // Dispatch dblclick event on the item
            boton.click();
        }, 400);
    
}