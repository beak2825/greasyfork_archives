// ==UserScript==
// @name         Facebook Page
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Agrega la palabra "facebook" al link de busqueda del sponsor
// @author       SStvAA!
// @match        https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389967/Facebook%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/389967/Facebook%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function cambia(){
        var botones = document.getElementsByTagName("a");
        for(var i=0;botones.length>i;i++){
            if(botones[i].href.search("google.com")>=0){
                botones[i].href = botones[i].href + "+facebook";
            }
        }
    }
    cambia();
    console.log("Powered By SStvAA!")
})();