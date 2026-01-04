// ==UserScript==
// @name         Fnac reloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Just reload fnac every 5 minutes
// @author       You
// @match        https://www.fnac.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417784/Fnac%20reloader.user.js
// @updateURL https://update.greasyfork.org/scripts/417784/Fnac%20reloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        location.reload();
    }, 300000)
})();