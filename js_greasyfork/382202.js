// ==UserScript==
// @name         sinrec
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       el otako de hispa
// @match        https://www.hispachan.org/g/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382202/sinrec.user.js
// @updateURL https://update.greasyfork.org/scripts/382202/sinrec.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
var borrarrec=document.getElementsByClassName("recommendations");
var tituloc=document.getElementsByClassName("filetitle");
var a;
for(a=0;a<borrarrec.length;a++){
    borrarrec[a].parentNode.removeChild(borrarrec[a]);
}
    for(a=0;a<tituloc.length;a++){
    tituloc[a].parentNode.removeChild(tituloc[a]);
}
    var equis=document.getElementById("hideRecommendations");
equis.parentNode.removeChild(equis);
})();