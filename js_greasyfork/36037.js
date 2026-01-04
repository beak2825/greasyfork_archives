// ==UserScript==
// @name         greasyfork.org
// @namespace    http*://greasyfork.org/*
// @version      0.14
// @description  maximale Fensterbreite auf greasyfork.org nutzen
// @author       chillchef
// @match        http*://greasyfork.org/*
// @match        http*://sleazyfork.org/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/36037/greasyforkorg.user.js
// @updateURL https://update.greasyfork.org/scripts/36037/greasyforkorg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try
    {
        var e = document.getElementsByClassName("width-constraint");
        e[0].style.maxWidth = "95%"; //header
        e[1].style.maxWidth = "95%"; //content
    }catch(exp){}
    try{document.getElementById("browse-script-list").style.width = "100%";}catch(exp){} //suchergebnisse;
    try{document.getElementById("user-script-list").style.width = "100%";}catch(exp){} //suchergebnisse;
    try{document.getElementById("script-list-option-groups").style.width = "100%";}catch(exp){} //sidebar;
    try{document.getElementById("carbonads").style.height = "0px";}catch(exp){} //carbon werbung
    //try{document.getElementsByClassName("adsbygoogle")[0].style.height = "0px";}catch(exp){} //google werbung
})();