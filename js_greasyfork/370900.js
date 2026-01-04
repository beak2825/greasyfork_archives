// ==UserScript==
// @name         baidu baike
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://baike.baidu.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/370900/baidu%20baike.user.js
// @updateURL https://update.greasyfork.org/scripts/370900/baidu%20baike.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    $(document).ready(function(){
        $('input#query').blur();
    })
})();