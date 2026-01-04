// ==UserScript==
// @name         Reload Actiontiles Background Test 2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo/related?hl=en
// @include      https://app.actiontiles.com/panel/53bcf2e4-95ef-4711-b6e0-7d54fdb76542
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388021/Reload%20Actiontiles%20Background%20Test%202.user.js
// @updateURL https://update.greasyfork.org/scripts/388021/Reload%20Actiontiles%20Background%20Test%202.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setInterval(function(){
        $("md-content[at-theme=cobalt]").css("background-color","blue");
    }, 10000);

    window.setInterval(function(){
        window.location.reload();
    }, 600000);
})();