// ==UserScript==
// @name         Schlock Isolator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Schlock Isolator isolates the strip
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @author       You
// @match        http://*.schlockmercenary.com/*
// @match        https://*.schlockmercenary.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374144/Schlock%20Isolator.user.js
// @updateURL https://update.greasyfork.org/scripts/374144/Schlock%20Isolator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var el = document.getElementById("strip");
    el.style.width = "100%"
    document.body.innerHTML= el.innerHTML;

})();

