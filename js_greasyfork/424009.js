// ==UserScript==
// @name         JammerRemover
// @namespace    fotix
// @version      0.0.2
// @description  remove the jammer on nas666
// @author       fotix
// @match        *://*.nas66.com/*
// @grant        none
// @license      MIT License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/424009/JammerRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/424009/JammerRemover.meta.js
// ==/UserScript==

(function() {
    //删除jammer内容
    var obj = document.getElementsByClassName("jammer");
    for(let i=0;i<obj.length;i++){
        obj[i].innerHTML="";
    };

    var sty =document.querySelectorAll("[style='display:none']");
    for(let e=0;e<sty.length;e++){
        sty[e].innerHTML="";
    };
})();