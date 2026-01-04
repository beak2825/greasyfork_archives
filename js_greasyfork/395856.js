// ==UserScript==
// @name         Elimina notranslate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       SStvAA
// @match        https://render.figure-eight.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395856/Elimina%20notranslate.user.js
// @updateURL https://update.greasyfork.org/scripts/395856/Elimina%20notranslate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var not = document.getElementsByClassName("notranslate");
    for(var i=0;not.length>i;i++){not[i].classList.remove("notranslate")}
    var not = document.getElementsByClassName("notranslate");
    for(var i=0;not.length>i;i++){not[i].classList.remove("notranslate")}
    var not = document.getElementsByClassName("notranslate");
    for(var i=0;not.length>i;i++){not[i].classList.remove("notranslate")}
    var not = document.getElementsByClassName("notranslate");
    for(var i=0;not.length>i;i++){not[i].classList.remove("notranslate")}
})();