// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://*.steamcn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39349/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/39349/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
    location.reload();
    }, 30000);
    // Your code here...
})();
