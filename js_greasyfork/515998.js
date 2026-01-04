// ==UserScript==
// @name         nxbrew
// @namespace    http://tampermonkey.net/
// @version      20241206
// @description  remove ad blocker warning page and ad jump
// @author       You
// @match        https://nxbrew.com/*
// @match        https://nxbrew.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nxbrew.com
// @grant        none
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515998/nxbrew.user.js
// @updateURL https://update.greasyfork.org/scripts/515998/nxbrew.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll('iframe').forEach(
        function(elem){
            elem.parentNode.removeChild(elem);
        });

    var es = document.getElementsByTagName("div")
    for(var i = 0; i < es.length; i++){
        if(es[i].id.match(/^[a-z]{52,}/g)){
            es[i].remove()
            continue
        }
        if(es[i].style.pointerEvents == "auto"){
            es[i].remove()
            continue
        }
    }
    document.getElementById("adunblocker-js-extra").remove();
    document.getElementById("adunblocker-js").remove();
    document.getElementById("adunblocker-css").remove();
})();