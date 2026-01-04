// ==UserScript==
// @name        Diario de Navarra adblock + jscript + GDPR + ad's bypass
// @namespace   
// @match       https://www.diariodenavarra.es/*
// @grant       none
// @version     1.1
// @license     MIT
// @author      anonDeveloper
// add to your adblock https://sdk.privacy-center.org/6e7011c3-735d-4a5c-b4d8-c8b97a71fd01/loader.js
// @description Diario de Navarra adblock
// @downloadURL https://update.greasyfork.org/scripts/487160/Diario%20de%20Navarra%20adblock%20%2B%20jscript%20%2B%20GDPR%20%2B%20ad%27s%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/487160/Diario%20de%20Navarra%20adblock%20%2B%20jscript%20%2B%20GDPR%20%2B%20ad%27s%20bypass.meta.js
// ==/UserScript==
document.getElementById("AdSlot_megabanner").remove();


var id = window.setTimeout(function() {}, 0);

while (id--) {
    window.clearTimeout(id); // will do nothing if no timeout with id is present
}

document.getElementById("Top1").remove();
document.getElementById("Top2").remove();
document.getElementById("Top3").remove();
document.getElementById("Top4").remove();
