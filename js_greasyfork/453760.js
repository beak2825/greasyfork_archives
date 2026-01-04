// ==UserScript==
// @name         Block Delfi.LV ads
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Block Delfi.LV annoying adblocker popup
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @match        https://rus.delfi.lv/*
// @match        https://www.delfi.lv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453760/Block%20DelfiLV%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/453760/Block%20DelfiLV%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var d = new Date();
    d.setTime(d.getTime() + 60 * 5 * 1000);
    document.cookie = "__adblocker=" + ("false") + "; expires=" + d.toUTCString() + "; path=/";

    setInterval(function(){
        if (hidePianoModal) hidePianoModal();
    },1000);
})();