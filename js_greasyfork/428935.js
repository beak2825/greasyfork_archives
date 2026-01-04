// ==UserScript==
// @name         ban tv
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  xxx
// @author       You
// @match        https://jungletv.live/
// @icon         https://www.google.com/s2/favicons?domain=jungletv.live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428935/ban%20tv.user.js
// @updateURL https://update.greasyfork.org/scripts/428935/ban%20tv.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var myInterval = setInterval(function() {
    if(document.querySelector("button[type=submit]") != null)
    {
        location.reload();
    }
    }, 2000);
    
})();