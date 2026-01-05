// ==UserScript==
// @name         sis chrome fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fixes logging in to rpi's SIS on chrome by disabling autocomplete/fill
// @author       You
// @match        https://sis.rpi.edu/rss/*Login
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21110/sis%20chrome%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/21110/sis%20chrome%20fix.meta.js
// ==/UserScript==

function onDown(e) {
    e.stopImmediatePropagation();
    if (typeof e.target.attributes["data-currentName"] == "undefined") {
        e.target.setAttribute("data-currentName", e.target.attributes.name.value);
        e.target.setAttribute('name','');
    }
    if (typeof e.target.attributes["data-currentID"] == "undefined") {
        e.target.setAttribute("data-currentID", e.target.attributes.id.value);
        e.target.setAttribute('id','');
    }
}

function onUp(e) {
     e.stopImmediatePropagation();
    if (typeof e.target.attributes["data-currentName"] != "undefined") {
        e.target.setAttribute("name", e.target.attributes["data-currentName"].value);
        e.target.removeAttribute("data-currentName");
    }
    if (typeof e.target.attributes["data-currentID"] != "undefined") {
        e.target.setAttribute("id", e.target.attributes["data-currentID"].value);
        e.target.removeAttribute("data-currentID");
    }
}

(function() {
    'use strict';
    var sid = document.getElementById("UserID");
    sid.setAttribute("type", "text");
    sid.addEventListener( "focus", onDown );
    sid.addEventListener( "mousedown", onDown );
    sid.addEventListener( "keydown", onDown );
    sid.addEventListener( "blur", onUp );
    sid.addEventListener( "keyup", onUp );
    
    var pin = document.getElementById("PIN").children[0];
    pin.setAttribute("id", "pin-input");
    pin.addEventListener( "focus", onDown );
    pin.addEventListener( "mousedown", onDown );
    pin.addEventListener( "keydown", onDown );
    pin.addEventListener( "blur", onUp );
    pin.addEventListener( "keyup", onUp );
    
})();