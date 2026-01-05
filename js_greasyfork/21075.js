// ==UserScript==
// @name         RemoverMSG
// @namespace    https://greasyfork.org/en/users/52481-gusd-nide
// @version      1.0
// @description  Remover Mensagem HE2
// @match        http://*.hackerexperience.com/*
// @match        http://hackerexperience.com/*
// @match        https://*.hackerexperience.com/*
// @match        https://hackerexperience.com/*
// @downloadURL https://update.greasyfork.org/scripts/21075/RemoverMSG.user.js
// @updateURL https://update.greasyfork.org/scripts/21075/RemoverMSG.meta.js
// ==/UserScript==

if (window.self !== window.top) return;

Array.prototype.contains = function(s) {
    return this.indexOf(s) !== -1;
};
String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
};

var node = document.getElementById("he2");
if(node !== undefined){
    node.remove();
}
