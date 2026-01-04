// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @grant        none
// @require      http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.7.2.js
// @downloadURL https://update.greasyfork.org/scripts/369738/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/369738/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('.button-right').not(':contains(啟動)').click()
})();