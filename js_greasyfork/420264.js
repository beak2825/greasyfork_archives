// ==UserScript==
// @name         Remover advertencia de instagram
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Eliminar advertencia de instagram, volex.
// @author       ArtEze
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420264/Remover%20advertencia%20de%20instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/420264/Remover%20advertencia%20de%20instagram.meta.js
// ==/UserScript==

var intervalo_volex = setInterval(function(){
    var volex = document.querySelector(".vohlx");
    var eliminar_volex = volex && volex.remove();
},1000)
