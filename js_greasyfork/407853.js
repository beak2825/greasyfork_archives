// ==UserScript==
// @name         Background script
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  change background
// @author       x
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407853/Background%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/407853/Background%20script.meta.js
// ==/UserScript==


(function() {
window.addEventListener('load', function(){

    //has to be direct image link
    var url = "https://i.imgur.com/3t6lTZy.jpg"

    document.head.getElementsByTagName("style")[0].innerHTML="";
    document.body.style.backgroundImage="url('"+url+"')";
    document.body.style.backgroundSize="100%";
    document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0)";
    document.getElementById("app").style.height="1000px";
})
})();
