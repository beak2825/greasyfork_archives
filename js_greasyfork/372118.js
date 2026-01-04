// ==UserScript==
// @name         vertical fhl bible
// @namespace    http://cb.fhl.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://cb.fhl.net/read.php*
// @require http://code.jquery.com/jquery-2.0.3.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372118/vertical%20fhl%20bible.user.js
// @updateURL https://update.greasyfork.org/scripts/372118/vertical%20fhl%20bible.meta.js
// ==/UserScript==

(function() {
    'use strict';

$("html").css(
    {
    "writing-mode": "vertical-rl",
    "text-combine-upright": "digits 2",
    "line-height": "1.8","font-family": "verdana",
});

$("b>i>font").css({
    "font-style": "normal",
    "font-weight": "1",
    "font-size": "10px",
    "vertical-align": "super","font-family": "verdana",
});

    // Your code here...
})();