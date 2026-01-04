// ==UserScript==
// @name         trace.moe auto enable loop
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  automatically enables loop on trace.moe
// @author       SoaringGecko
// @match        *://trace.moe/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408426/tracemoe%20auto%20enable%20loop.user.js
// @updateURL https://update.greasyfork.org/scripts/408426/tracemoe%20auto%20enable%20loop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("#loop").checked=true;
})();