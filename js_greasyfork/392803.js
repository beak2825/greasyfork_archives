// ==UserScript==
// @name         Guardar-QM
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Gudigno
// @match        https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392803/Guardar-QM.user.js
// @updateURL https://update.greasyfork.org/scripts/392803/Guardar-QM.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.getElementsByTagName('h4')[0].innerText == "Quiz mode"){
        document.getElementsByClassName('submit btn btn-cf-blue')[0].setAttribute("formtarget","_blank");
    }
    // Your code here...
})();