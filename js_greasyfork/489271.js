// ==UserScript==
// @name         Curar
// @namespace    http://tampermonkey.net/
// @version      2024-03-08
// @description  consume primer item de comida que encuentra en la mochila que indiques si tiene menos vida de la indicada
// @author       Matias Bais
// @match        *://*.gladiatus.gameforge.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489271/Curar.user.js
// @updateURL https://update.greasyfork.org/scripts/489271/Curar.meta.js
// ==/UserScript==

var formContainer = document.createElement('div');
formContainer.id = 'formContainer';
formContainer.style.position = 'fixed';
formContainer.style.bottom = '20px'; // Adjusted to bottom
formContainer.style.left = '20px';
formContainer.style.backgroundColor = '#f0f0f0';
formContainer.style.padding = '20px';
formContainer.style.borderRadius = '10px';
formContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

// Create the form
var form = document.createElement('form');

// Create the first number input
var valorLabel = document.createElement('label');
valorLabel.textContent = 'Vida Mínima % (min 5, max 95): ';
valorLabel.style.display = 'block'; // Display block to align items vertically
var valorInput = document.createElement('input');
valorInput.type = 'number';
valorInput.name = 'valorInput';
valorInput.min = '5';
valorInput.max = '95';
valorInput.style.float = 'right'; // Align input to the right
valorInput.style.marginLeft = '10px'; // Added margin for spacing
valorLabel.appendChild(valorInput);
form.appendChild(valorLabel);

// Create the second number input
var otraLabel = document.createElement('label');
otraLabel.textContent = 'Mochila: ';
otraLabel.style.display = 'block'; // Display block to align items vertically
var otraInput = document.createElement('input');
otraInput.type = 'number';
otraInput.name = 'otraInput';
otraInput.min = '1';
otraInput.max = '4';
otraInput.style.float = 'right'; // Align input to the right
otraInput.style.marginLeft = '10px'; // Added margin for spacing
otraLabel.appendChild(otraInput);
form.appendChild(otraLabel);

// Create the checkbox
var checkboxLabel = document.createElement('label');
checkboxLabel.style.display = 'block'; // Display block to align items vertically
var checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.name = 'activarCheckbox';
checkboxLabel.appendChild(checkbox);
checkboxLabel.appendChild(document.createTextNode('Activar'));
form.appendChild(checkboxLabel);

// Create the "Guardar" button
var guardarButton = document.createElement('button');
guardarButton.textContent = 'Guardar';
guardarButton.type = 'button';
guardarButton.className = 'awesome-button big';
guardarButton.style.marginTop = '10px'; // Added margin for spacing
form.appendChild(guardarButton);

guardarButton.addEventListener('click', function() {
        // Retrieve form data and do something with it (e.g., save it)
        var activarCheckboxValue = checkbox.checked;
        var valorInputValue = valorInput.value;
        var otraInputValue = otraInput.value;

        // Example: Log the form data
        localStorage.setItem('vidaMinima', valorInputValue);
        localStorage.setItem('mochila', otraInputValue);
        localStorage.setItem('activado', activarCheckboxValue);


        // You can add your saving logic here
    });

    // Append the form to the form container
    formContainer.appendChild(form);

    // Append the form container to the body
    document.body.appendChild(formContainer);

// Retrieving data from localStorage
var perfil = localStorage.getItem('perfil');
if(perfil!==null){}
else{
 perfil = "no";
    localStorage.setItem('perfil', "no");
}

var vidaMinima = localStorage.getItem('vidaMinima');
if(vidaMinima !== null){}
else{
    vidaMinima = 25;
    localStorage.setItem('vidaMinima',25);
}
valorInput.value=vidaMinima;

var mochila = localStorage.getItem('mochila');
if(mochila !== null){}
else{
    mochila = 1;
    localStorage.setItem('mochila',1);
}
otraInput.value=mochila;

var activado = localStorage.getItem('activado');
if(activado !== null){}
else{
    activado = false;
    localStorage.setItem('activado',false);
}
checkbox.checked=activado;


(function() {
    'use strict';
    if(!activado)
        return;
    var vida = document.getElementById('header_values_hp_percent');
    console.log("aaa");
    if(parseInt(vida.innerText.slice(0,-1))<=vidaMinima){
        if(perfil=="no"){
          let menu = document.getElementById('mainmenu');
            localStorage.setItem('perfil', "si");
          menu.getElementsByClassName("advanced_menu_entry")[0].getElementsByTagName('a')[0].click();
        }else{

            localStorage.setItem('perfil', "no");
        var inv = document.getElementById('inventory_nav');
        var element = inv.querySelectorAll('a.awesome-tabs')[mochila-1];
        element.click();

        // Acciones a realizar cuando se hace clic en el botón
        setTimeout(function() {
            let inventoryItem = document.querySelector('#inv [data-content-type="64"].ui-draggable');

        // Trigger dblclick event on inventory items
        inventoryItem.dispatchEvent(new MouseEvent('dblclick', {
        bubbles: true,
        cancelable: true
    }));
            console.log("chau");
        },  1000);
        }

    }

    // Crea un nuevo elemento botón
})();

// Function to trigger the dblclick event on items
function triggerDblclickEvent(item) {
    // Dispatch dblclick event on the item

}