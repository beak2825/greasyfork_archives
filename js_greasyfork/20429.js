// ==UserScript==
// @name         Drudgery
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  centered and unboldened
// @author       dan@garthwaite.org
// @match        https://drudgereport.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20429/Drudgery.user.js
// @updateURL https://update.greasyfork.org/scripts/20429/Drudgery.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("body").css("max-width", "80em").css("margin-left", "auto").css("margin-right", "auto");
    $("a").css("text-decoration", "none").css("font-weight", "normal");
    // Your code here...
})();