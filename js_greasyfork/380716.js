// ==UserScript==
// @name         Misc. Labor Kiosk
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Labor Kiosk for various indirect actions
// @author       Cpatters
// @match        https://aftlite-portal.amazon.com/indirect_action
// @match        https://aftlite-na.amazon.com/indirect_action*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380716/Misc%20Labor%20Kiosk.user.js
// @updateURL https://update.greasyfork.org/scripts/380716/Misc%20Labor%20Kiosk.meta.js
// ==/UserScript==

var log= prompt("Scan Badge");
var x= document.querySelector('input[name="code"]')
var button= document.createElement("button");
button.innerHTML= "Gate Keeper"

var body= document.getElementsByTagName("body")[0];
body.appendChild(button);

button.addEventListener ("touch", function() {
    document.querySelector('input[name="name"]').value= log
    x.value= 'GATE'
    x.form.submit()
});


var btn= document.createElement("button");
btn.innerHTML= "Slammer"

var bod= document.getElementsByTagName("body")[0];
bod.appendChild(btn);

btn.addEventListener ("click", function() {
    document.querySelector('input[name="name"]').value= log
    x.value= 'SLAM'
    x.form.submit()
});

var b= document.createElement("button");
b.innerHTML= "Inbound Captain"

var bo= document.getElementsByTagName("body")[0];
bo.appendChild(b);

b.addEventListener ("click", function() {
    document.querySelector('input[name="name"]').value= log
    x.value= 'IBCAP'
    x.form.submit()
});

var c= document.createElement("button");
c.innerHTML= "Dock Crew"

var d= document.getElementsByTagName("body")[0];
d.appendChild(c);

c.addEventListener ("click", function() {
    document.querySelector('input[name="name"]').value= log
    x.value= 'DOCKCREW'
    x.form.submit()
});