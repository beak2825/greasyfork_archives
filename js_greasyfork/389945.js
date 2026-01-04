// ==UserScript==
// @name         kou-oto-login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  oto login
// @author       unknown
// @match        http://ogr.kocaeli.edu.tr/KOUBS/Ogrenci/index.cfm
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/389945/kou-oto-login.user.js
// @updateURL https://update.greasyfork.org/scripts/389945/kou-oto-login.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        if(document.getElementById("Ara")){
            document.getElementById("Ara").click();
            console.log("clicked");}
        else
        {
            console.log("no ara button");
        }
    }, 500);
})();