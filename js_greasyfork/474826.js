// ==UserScript==
// @name         BLS LOGIN PAGE input ENABLER
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  This plugin give you ability to copy paste in bls login page
// @author       Gecko
// @include      https://algeria.blsspainglobal.com/DZA/account/login*
// @include      https://www.blsspainmorocco.net/MAR/account/login*
// @icon         https://algeria.blsspainglobal.com/assets/images/logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474826/BLS%20LOGIN%20PAGE%20input%20ENABLER.user.js
// @updateURL https://update.greasyfork.org/scripts/474826/BLS%20LOGIN%20PAGE%20input%20ENABLER.meta.js
// ==/UserScript==

(function() {
    
$('input.entry-disabled').off('copy paste');


 // Get a reference to the form element
var form = document.getElementsByTagName('form')[0]; // Replace 'yourFormId' with the actual ID of your form


var pattern = /Password/g;
// Loop through all existing input elements inside the form
var existingInputs = form.getElementsByTagName('input');
for (var i = 0; i < existingInputs.length; i++) {

    // Replace each existing input with the new input
    var currentInput = existingInputs[i];
    if((currentInput.name).match(pattern) != null) {
        var newInput = document.createElement('input');
        newInput.type = 'text'; // Set the type of the new input element
        newInput.name = currentInput.name; // Set a name attribute if needed
        newInput.value = ''; // Set an initial value if needed
        newInput.classList.add("form-control");
        currentInput.parentNode.replaceChild(newInput.cloneNode(true), currentInput);
    }
}
})();