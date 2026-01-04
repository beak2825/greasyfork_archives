// ==UserScript==
// @name         Jstris darker visited links (temporary)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change the color of visited links
// @author       jezevec10
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386915/Jstris%20darker%20visited%20links%20%28temporary%29.user.js
// @updateURL https://update.greasyfork.org/scripts/386915/Jstris%20darker%20visited%20links%20%28temporary%29.meta.js
// ==/UserScript==

/**************************
  Jstris Stats Script         
**************************/

(function() {
    window.addEventListener('load', function(){

var customStyle=document.createElement("style");
customStyle.innerHTML='a:visited {color:#078867}';
document.body.appendChild(customStyle);

    });
})();