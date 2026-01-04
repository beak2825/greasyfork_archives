// ==UserScript==
// @name         Bovada
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://*.bovada.lv/
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/30479/Bovada.user.js
// @updateURL https://update.greasyfork.org/scripts/30479/Bovada.meta.js
// ==/UserScript==

$(window).focus(function() {
$("a#header-login-button")[0].click();
});