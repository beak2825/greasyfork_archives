// ==UserScript==
// @name         Activar botón de commit en GitHub
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Activando botón de commit.
// @author       ArtEze
// @match        https://github.com/*/edit/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422351/Activar%20bot%C3%B3n%20de%20commit%20en%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/422351/Activar%20bot%C3%B3n%20de%20commit%20en%20GitHub.meta.js
// ==/UserScript==

setInterval(function(x){
	document.querySelector("#submit-file").disabled = ""
},1000)
