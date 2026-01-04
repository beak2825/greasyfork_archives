// ==UserScript==
// @name         reset watermarkremover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove watermarkremover
// @author       jiangwy
// @match        https://www.watermarkremover.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=watermarkremover.io
// @grant        none
// @run-at       document-body
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/479087/reset%20watermarkremover.user.js
// @updateURL https://update.greasyfork.org/scripts/479087/reset%20watermarkremover.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let timer = null;
    function clearStore(){
        localStorage.removeItem("WkdGcGJIbEpiV0ZuWlVSaGRHRT0=");
    };
    timer = setInterval(clearStore,1000);
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            if(timer){
                clearInterval(timer);
                timer = null;
            }
        }
        if (document.visibilityState === 'visible') {
            timer = setInterval(clearStore,1000);
        }
    })
})();