// ==UserScript==
// @name         trace.moe disable auto mute + auto enable loop
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically disables mute and enables loop on trace.moe
// @author       SoaringGecko
// @match        *://trace.moe/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408427/tracemoe%20disable%20auto%20mute%20%2B%20auto%20enable%20loop.user.js
// @updateURL https://update.greasyfork.org/scripts/408427/tracemoe%20disable%20auto%20mute%20%2B%20auto%20enable%20loop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("#mute").checked=false;
    document.querySelector("#player").muted=false;
    document.querySelector("#loop").checked=true;
})();