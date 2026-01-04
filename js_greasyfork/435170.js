// ==UserScript==
// @name        Show Password
// @namespace   Coding With KR
// @version     0.1
// @description Shows password on mouseOver and focus, hides on mouseOut and blur
// @match       http://*/*
// @match       https://*/*
// @author      KR Bishnoi
// @downloadURL https://update.greasyfork.org/scripts/435170/Show%20Password.user.js
// @updateURL https://update.greasyfork.org/scripts/435170/Show%20Password.meta.js
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