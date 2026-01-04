// ==UserScript==
// @name         detect-devtool
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  disable detect-devtool
// @author       You
// @include        *://www.simtoco.com*
// @include        *://simtoco.com*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/424206/detect-devtool.user.js
// @updateURL https://update.greasyfork.org/scripts/424206/detect-devtool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("devtoolschange", function (event) {
        console.log("disable devtoolschange")
    }, true);
    
    var id = window.setInterval(function() {}, 0);
    while (id--) {
        window.clearInterval(id);
    }

})();