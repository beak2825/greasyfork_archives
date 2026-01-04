// ==UserScript==
// @name         SomeUserscript
// @version      1.3
// @description  Some userscript for some orange site idk
// @author       piyag47910
// @match        https://*.pornhub.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @namespace https://sleazyfork.org/users/1247880
// @downloadURL https://update.greasyfork.org/scripts/484823/SomeUserscript.user.js
// @updateURL https://update.greasyfork.org/scripts/484823/SomeUserscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
       var nr = document.querySelector("#age-verification-wrapper");
       var nr2 = document.querySelector("#age-verification-container");
       var nr3 = document.querySelector("#ageVerificationOverlay");
        if(nr != null){
            nr.parentNode.removeChild(nr);
        }
            if(nr2 != null){
                nr2.parentNode.removeChild(nr2);
            }
               if(nr3 != null){
                   nr3.parentNode.removeChild(nr3);
               }
    }, 500);
})();