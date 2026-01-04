// ==UserScript==
// @name         Display
// @namespace    -
// @version      0.1
// @description  DO NOT HIDE THE PAGE!!
// @author       LianSheng
// @include      *://battlecats-db.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402464/Display.user.js
// @updateURL https://update.greasyfork.org/scripts/402464/Display.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let load = setInterval(function(){
        document.body.style.cssText = "display: initial;";
    }, 10);
    setTimeout(function(){
        clearInterval(load);
    }, 10000);
})();