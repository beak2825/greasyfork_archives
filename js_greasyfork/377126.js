// ==UserScript==
// @name         New Userscript
// @namespace    http://kartable.fr/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://kartable.fr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377126/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/377126/New%20Userscript.meta.js
// ==/UserScript==
setInterval(function() { sinareviens() }, 1000);
function sinareviens(){
    document.getElementsByTagName("BODY")[0].classList.remove("blurred");
    document.getElementsByTagName("BODY")[0].classList.remove("noScroll");
    document.getElementsByTagName("push-more-content")[0].remove();
}