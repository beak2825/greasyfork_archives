// ==UserScript==
// @name         SCAU Choice button enabler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enables user to access confirmation page in advance.
// @author       A handsome guy
// @match        *://jwxt.scau.edu.cn/*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/419759/SCAU%20Choice%20button%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/419759/SCAU%20Choice%20button%20enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("started");
    setInterval(function(){
        var btns=document.getElementsByTagName('button');
        var i=0;
        for(i=0;i<btns.length;i++){
            btns[i].removeAttribute('disabled');
            btns[i].classList.remove('is-disabled');}
    }, 3000);
})();