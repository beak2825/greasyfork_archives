// ==UserScript==
// @name         HidemeOnline Bypass
// @namespace    http://coolwp.com/tamper-monkey-hide-me-online-bypass
// @version      0.1
// @description  hime-me.online bypass
// @author       You
// @match        http://hide-me.online/?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381833/HidemeOnline%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/381833/HidemeOnline%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var theDiv = document.getElementById("url");
    theDiv.getElementsByTagName("a").click();


})();