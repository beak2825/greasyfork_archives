// ==UserScript==
// @name         trace.moe disable auto mute
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disables the auto mute on trace.moe
// @author       SoaringGecko
// @match        *://trace.moe/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408425/tracemoe%20disable%20auto%20mute.user.js
// @updateURL https://update.greasyfork.org/scripts/408425/tracemoe%20disable%20auto%20mute.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("#mute").checked=false;
    document.querySelector("#player").muted=false;
})();