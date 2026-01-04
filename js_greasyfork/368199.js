// ==UserScript==
// @name        Muestra Clave
// @namespace   zLiquidMethod
// @version     1.0
// @description Shows password on mouseOver and focus, hides on mouseOut and blur
// @author      Lexander Ortega
// @match       http://*/*
// @match       https://*/*
// @copyright   Dustin Zappa 2014
// @downloadURL https://update.greasyfork.org/scripts/368199/Muestra%20Clave.user.js
// @updateURL https://update.greasyfork.org/scripts/368199/Muestra%20Clave.meta.js
// ==/UserScript==

//////////////////////////////////////////////////////////////////////////////
// functions
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// Name: clearText
// Abstract:
//////////////////////////////////////////////////////////////////////////////
function clearText() {
    this.type = "text";
}



//////////////////////////////////////////////////////////////////////////////
// Name: obscureText
// Abstract:
//////////////////////////////////////////////////////////////////////////////
function obscureText() {
    this.type = "password";
}



//////////////////////////////////////////////////////////////////////////////
// Name: addEvents
// Abstract:
//////////////////////////////////////////////////////////////////////////////
function addEvents() {
    var passFields = document.querySelectorAll("input[type='password']");

    if (!passFields.length) {
            return;
        }

    for (var i = 0; i < passFields.length; i++) {
            passFields[i].addEventListener("mouseover", clearText, false);
            passFields[i].addEventListener("focus", clearText, false);
            passFields[i].addEventListener("mouseout", obscureText, false);
            passFields[i].addEventListener("blur", obscureText, false);
        }
}


//////////////////////////////////////////////////////////////////////////////
// events
//////////////////////////////////////////////////////////////////////////////

// execute after load, just in case they generate password fields via javascript
window.addEventListener("load", addEvents, false);