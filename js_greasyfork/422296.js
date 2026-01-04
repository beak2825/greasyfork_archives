// ==UserScript==
// @name         Identi Fixer
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Script para arreglar pequeños errores de Identi como URLs viejas y el avatar.
// @author       Frankko212
// @match        http://*.identi.io/*
// @match        https://*.identi.io/*
// @downloadURL https://update.greasyfork.org/scripts/422296/Identi%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/422296/Identi%20Fixer.meta.js
// ==/UserScript==

//Redirector de Identi.li a Identi.io
function replace_url(elem, attr) {
    var elems = document.getElementsByTagName(elem);
    for (var i = 0; i < elems.length; i++)
        elems[i][attr] = elems[i][attr].replace('identi.li', 'identi.io');
}
//Funcion avatar
function fixavatar(elem, attr) {
    var elems = document.getElementsByTagName(elem);
    for (var i = 0; i < elems.length; i++)
        elems[i][attr] = elems[i][attr].replace('https://identi.io/'+'https://', 'https://');
}

//Ejecutar replace y avatar
window.onload = function() {
    fixavatar('img', 'src');
    replace_url('a', 'href');
    replace_url('img', 'src');
}