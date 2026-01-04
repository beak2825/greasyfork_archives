// ==UserScript==
// @name         Anti Redirect V1.1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Prevents other Tampermonkey scripts from redirecting you to other pages
// @author       zuxity
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493336/Anti%20Redirect%20V11.user.js
// @updateURL https://update.greasyfork.org/scripts/493336/Anti%20Redirect%20V11.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    var originalAssign = window.location.assign;

    
    window.location.assign = function(url) {
       
        if (url !== window.location.href) {
            console.log("Prevented redirect to: " + url);
      
            return;
        }
        
        originalAssign.call(window.location, url);
    };
})();
