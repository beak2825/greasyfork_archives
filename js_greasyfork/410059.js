// ==UserScript==
// @name         Hide Some AD
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*.biancheng.net/*
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/410059/Hide%20Some%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/410059/Hide%20Some%20AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('#topbar').hide();
    $('#header').hide();
    $('#ad-arc-top').hide();
})();