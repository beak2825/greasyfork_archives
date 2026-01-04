// ==UserScript==
// @name         Show Password
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       coldfeudal
// @match        *://*/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/422717/Show%20Password.user.js
// @updateURL https://update.greasyfork.org/scripts/422717/Show%20Password.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://code.jquery.com/jquery-3.5.1.min.js';
    document.head.appendChild(script);

    $('body').on('focus', 'input[type=password]', function(){
        $(this).attr('type', 'text');
    });

    $('input[type=password]').blur(function(){
        $(this).attr('type', 'password');
    });
})();