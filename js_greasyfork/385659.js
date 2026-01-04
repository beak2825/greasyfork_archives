// ==UserScript==
// @name         Playing Field Grid Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  customize playing field grid
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385659/Playing%20Field%20Grid%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385659/Playing%20Field%20Grid%20Script.meta.js
// ==/UserScript==

/**************************
  Playing Field Grid Script        
**************************/

(function() {
    window.addEventListener('load', function(){

bgLayer.style.display="none";
var newItem = document.createElement("table");
newItem.style.width = bgLayer.width-8 + "px";
newItem.style.height = bgLayer.height + "px";
newItem.innerHTML = ("<tr>"+"<td style='border:2px solid white;'></td>".repeat(10)+"</tr>").repeat(20)
stage.insertBefore(newItem, stage.childNodes[0]);

    });
})();
