// ==UserScript==
// @name         Agar.io Jungle Viruses
// @version      0.1
// @namespace    http://tampermonkey.net/
// @description  u.u
// @author       NEL99
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26768/Agario%20Jungle%20Viruses.user.js
// @updateURL https://update.greasyfork.org/scripts/26768/Agario%20Jungle%20Viruses.meta.js
// ==/UserScript==

window.jungleVirus = function() { var XML = new XMLHttpRequest(); XML.open("GET", "http://agar.io/agario.core.js", true);
    XML.onreadystatechange = function() {
        if (XML.readyState == 4) {
            var virus = XML.responseText;
            var jungleVirusValue = 145;
            virus = virus.replace(/(\+\d+\.\d+\;l\=\(\w\&\d\|\d\)\=\=\d\&\(\w\[\w\>>\d\]\|\d\)\!\=\d\?l\+)\d+\.\d+(\:l\;)/i, "$1 jungleVirusValue $2");
            eval(virus);
        }
    };
    XML.send(null);
};
window.onload = function(){ jungleVirus(); };