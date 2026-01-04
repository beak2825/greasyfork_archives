// ==UserScript==
// @name         gounlimieted
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://gounlimited.to/embed*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403070/gounlimieted.user.js
// @updateURL https://update.greasyfork.org/scripts/403070/gounlimieted.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        const url = document.getElementsByTagName("video")[0].src;
        if(url){
            window.location.href = url;
        }
    }, 1000);
})();