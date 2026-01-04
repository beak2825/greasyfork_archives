// ==UserScript==
// @author Askidox
// @name AutoPhy
// @description Remplace les fi/phi/si/s'il/ci par PhY. Mettre <> en début de message pour désactiver pendant 30 secondes le script
// @version  1.5
// @grant none
// @match https://s1.abyssus.games/*
// @include https://s1.abyssus.games/*
// @namespace https://greasyfork.org/users/190016
// @downloadURL https://update.greasyfork.org/scripts/380698/AutoPhy.user.js
// @updateURL https://update.greasyfork.org/scripts/380698/AutoPhy.meta.js
// ==/UserScript==

if (location.href.indexOf("cgnew") * location.href.indexOf("chat") < 0) main();
var nop = false;
function main(){
    try {if (/^<>/.test(document.getElementById("message").value)){
        document.getElementById("message").value = document.getElementById("message").value.replace(/^<>/, "");
        nop = true;
    } else {
        document.getElementById("message").value = document.getElementById("message").value.replace(/(?:fi)|(?:phi)|(?:si)|(?:s'i)|(?:ci)/gi, "PhY");
    }
        } catch (e) {}
    if (nop){
        nop = false;
        setTimeout(main, 60000);
    } else {
        setTimeout(main, 500);
    }
}