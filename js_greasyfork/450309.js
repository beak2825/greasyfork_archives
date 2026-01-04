// ==UserScript==
// @name         Google Search Term Suggestion Removal
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  removes the new stupid search suggestion terms
// @author       an0nymooose
// @match        https://www.google.com/search?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450309/Google%20Search%20Term%20Suggestion%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/450309/Google%20Search%20Term%20Suggestion%20Removal.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function onReady() {
        var plus = document.querySelectorAll("path[d='M11 19V13H5V11H11V5H13V11H19V13H13V19Z']");
        plus.forEach(function(element) {
            //remove 5th parent
            for(var e = element, p = [], i=0; e && e !== document; e = e.parentNode){
                if(i>5){break;}
                if(i==5){e.remove()} i++;
            }
        });
    }
    if (document.readyState !== "loading") {
        onReady();
    } else {
        document.addEventListener("DOMContentLoaded", onReady);
    }
})();