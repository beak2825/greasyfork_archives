// ==UserScript==
// @name         Ikariam auto capture
// @namespace    https://s32-en.ikariam.gameforge.com/
// @version      0.1
// @description  try to take over the world!
// @author       海山88
// @match        https://s32-en.ikariam.gameforge.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32101/Ikariam%20auto%20capture.user.js
// @updateURL https://update.greasyfork.org/scripts/32101/Ikariam%20auto%20capture.meta.js
// ==/UserScript==

(function() {
    'use strict';
   setInterval(function(){
       var length = $("a.capture").length;
       if (length > 0)
       {
           $("a.capture")[length-1].click();
       }
   }, 5000);
})();