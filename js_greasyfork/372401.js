// ==UserScript==
// @name         StreamCraft HBeira Cleaner
// @namespace    https://greasyfork.org/en/scripts/371572-streamcraft-hbeira-style
// @version      1.0
// @description  Remove a inundação das mensagens de curtidas ao apresentador.
// @author       HBeira
// @include      http://www.streamcraft.com/*
// @include      http://streamcraft.com/*
// @downloadURL https://update.greasyfork.org/scripts/372401/StreamCraft%20HBeira%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/372401/StreamCraft%20HBeira%20Cleaner.meta.js
// ==/UserScript==

var intervalo = setInterval(aplicarHBeiraCleaner, 500);
var cont = 0

function aplicarHBeiraCleaner(){
    var list = document.getElementsByClassName("z-html");
    if (/curtidas para o apresentador!/.test(list[cont].innerHTML)) {
        list[cont].parentNode.removeChild(list[cont]);

    if (cont > 0){ cont--; }

    }else{
        cont++;
    }
}