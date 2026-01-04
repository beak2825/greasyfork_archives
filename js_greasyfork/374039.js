// ==UserScript==
// @name kwejk anty-adblock
// @namespace http://tampermonkey.net/
// @version 0.1
// @description anti anti-adblock
// @author https://github.com/GazthSonika
// @match kwejk.pl/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/374039/kwejk%20anty-adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/374039/kwejk%20anty-adblock.meta.js
// ==/UserScript==

(function() {
var worker = setInterval(function(){
    window.document.getElementsByClassName("a-campaign-overlay")[0].style.display = "none";
    window.document.getElementsByClassName("a-campaign-block")[0].style.display = "none";
    window.document.getElementsByTagName("main")[0].classList.remove("blured");
}, 200);

setTimeout(function(){clearInterval(worker)}, 5000);
})();
