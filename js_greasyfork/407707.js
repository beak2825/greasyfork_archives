// ==UserScript==
// @name         NullPhpScript remove adblock
// @namespace    https://greasyfork.org/en/scripts/407707-nullphpscript-remove-adblock/
// @version      0.1
// @description  remove adblock from nullphpscript.com
// @author       TechComet
// @match        https://nullphpscript.com/*
// @match        https://*.nullphpscript.com/*
// @supportURL   https://greasyfork.org/en/scripts/407707-nullphpscript-remove-adblock/feedback
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407707/NullPhpScript%20remove%20adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/407707/NullPhpScript%20remove%20adblock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var rrtt = function() {
        var element_body = document.getElementsByTagName("body")[0];
        element_body.style="";


    var element = document.getElementsByTagName("cloudflare-app"), index;

    for (index = element.length - 1; index >= 0; index--) {
        element[index].parentNode.removeChild(element[index]);
    }
    }

    if(window.attachEvent) {
    window.attachEvent('onload', rrtt);
} else {
    if(window.onload) {
        var curronload = window.onload;
        var newonload = function(evt) {
            curronload(evt);
            rrtt(evt);
        };
        window.onload = newonload;
    } else {
        window.onload = rrtt;
    }
}


})();