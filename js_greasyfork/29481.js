// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.mturk.com/mturk/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29481/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/29481/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    $(".top-stripe").hide();
})();