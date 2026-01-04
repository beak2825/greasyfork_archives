// ==UserScript==
// @name         Robux Free By max0782
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Robux Infiniti by max0782
// @author       Max0782
// @match        https://www.roblox.com/*
// @run-at document-start
// @grant   GM_getValue
// @grant   GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/402721/Robux%20Free%20By%20max0782.user.js
// @updateURL https://update.greasyfork.org/scripts/402721/Robux%20Free%20By%20max0782.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a = parseInt(GM_getValue("robux", 0));
    var b = parseInt(GM_getValue("yes", 0));
    var btn = document.getElementById('confirm-btn');
    setInterval(function() {
        document.getElementsByClassName("btn-medium btn-primary")[0].onclick = function(){
            event.preventDefault();
            GM_setValue("yes", 1);
            b = 1;
       //modifica il numero qui sotto con il numero di robux che vuoi avere (se hai dei robux comprati non fare questa hack)
        };
        if (a < 99999999999999999 && b == 1) {
           a++;
        }

        GM_setValue("robux", a);
        document.getElementById("nav-robux-amount").innerHTML = a;
        document.getElementById("nav-robux-balance").innerHTML = a + " ROBUX";
        document.getElementsByClassName("btn-medium btn-primary")[0].innerHTML = "Prendi i robux!";
        if (a >= 0) {
            document.getElementsByClassName("modal-title")[0].innerHTML = "Sei sicuro?";
            document.getElementsByClassName("modal-message")[0].innerHTML = "Sei pronto per comprarlo?";
            btn = document.getElementById('confirm-btn');
            btn.outerHTML = '<button class="' + btn.attributes.class + '" id="' + btn.id + '" >Compra Robux</button>';
            document.getElementById('confirm-btn').innerHTML = 'Compralo!';
            document.getElementById('confirm-btn').onclick = function() {
                (".alert-success").html("Acquisto completato. Il tuo item apparirà tra 3 ore");
                'Roblox'.BootstrapWidgets.ToggleSystemMessage((".alert-success"),5000,1e3);
                document.getElementById('simplemodal-container').outerHTML = '';
                document.getElementById('simplemodal-overlay').outerHTML = '';
                (".alert-success").html("Acquisto completato. Il tuo item apparirà tra 3 ore");
                'Roblox'.BootstrapWidgets.ToggleSystemMessage((".alert-success"),5000,1e3);
            };
        }
    }, 1);
})();