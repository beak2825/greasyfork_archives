// ==UserScript==
// @name         Quick restart
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  yes
// @author       no
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387941/Quick%20restart.user.js
// @updateURL https://update.greasyfork.org/scripts/387941/Quick%20restart.meta.js
// ==/UserScript==

/**************************
   Quick restart
**************************/

(function() {
    window.addEventListener('load', function(){

var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
Game['prototype']['startReadyGo'] = new Function(trim(Game['prototype']['startReadyGo'].toString().replace("900","100")))

});})();