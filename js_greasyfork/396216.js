// ==UserScript==
// @name         Remove scrollbar
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  yes
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396216/Remove%20scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/396216/Remove%20scrollbar.meta.js
// ==/UserScript==

/**************************
   Remove scrollbar
**************************/

(function() {
    window.addEventListener('load', function(){

if(~window.location.href.indexOf("?play=")){
document.getElementsByTagName("body")[0].style.height = "100%";
document.getElementsByTagName("body")[0].style.overflow = "hidden";
}
    });
})();