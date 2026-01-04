// ==UserScript==
// @name         Console for mobile browsers - eruda
// @namespace    https://github.com/vancez
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400760/Console%20for%20mobile%20browsers%20-%20eruda.user.js
// @updateURL https://update.greasyfork.org/scripts/400760/Console%20for%20mobile%20browsers%20-%20eruda.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var script = document.createElement('script');
    script.src="//cdn.jsdelivr.net/npm/eruda";
    document.body.appendChild(script);
    script.onload = function () {
        eruda.init();
    }
})();