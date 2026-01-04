// ==UserScript==
// @name         Extra Croutons (Beta)
// @namespace    None
// @version      1.1 Beta
// @description  Allows you to summon more croutons, or to have the script do so automatically.
// @author       4TSOS
// @match        *crouton.net/*
// @icon         https://i.ibb.co/jTVWGnV/Crouton.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441871/Extra%20Croutons%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/441871/Extra%20Croutons%20%28Beta%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
})();

Starter_Crouton = document.querySelector('HTML > Body > img');
Starter_Crouton.style.width = "0px";
Starter_Crouton.style.height = "0px";
var Watermark = document.createElement('p');
Watermark.innerHTML = "4TSOS Crouton Summoner";
Watermark.style.position = "static";
Watermark.style.textShadow = "1px 1px 1px orange";
document.body.appendChild(Watermark)
var Crouton_Button = document.createElement('button');
Crouton_Button.innerHTML = "Summon Crouton";
Crouton_Button.className = "crouton_button";
Crouton_Button.style.position = "static";
Crouton_Button.onclick = function() {
    var Crouton = document.createElement('img');
    Crouton.src = "crouton.png";
    Crouton.alt = "Crouton";
    Crouton.className = "crouton";
    document.body.appendChild(Crouton)
}
var Auto_Crouton_Button = document.createElement('button');
Auto_Crouton_Button.innerHTML = "Automate Summoning";
Auto_Crouton_Button.className = "auto_crouton_button";
Auto_Crouton_Button.style.position = "static";
Auto_Crouton_Button.onclick = function() {
    var Auto_Summon_Confirm = confirm("Do you want to enable auto-summon?")
    if (Auto_Summon_Confirm === true) {
        var Auto_Summon_Delay = prompt("What should the delay between summons be? (MS)");
        function Auto_Summon() {
            var Summon_Crouton_Button = document.querySelector("HTML > Body > .crouton_button");
            Summon_Crouton_Button.click()
        }
       setInterval(Auto_Summon, Auto_Summon_Delay)
    }
}
document.body.appendChild(Auto_Crouton_Button)
document.body.appendChild(Crouton_Button)