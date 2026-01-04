// ==UserScript==
// @name         hostloc使用默认头像
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        http*://www.hostloc.com/thread-*-*-*.html
// @match        http*://hostloc.com/thread-*-*-*.html
// @match        http*://www.hostloc.com/forum.php*
// @match        http*://hostloc.com/forum.php*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/382687/hostloc%E4%BD%BF%E7%94%A8%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/382687/hostloc%E4%BD%BF%E7%94%A8%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for (var i = document.getElementsByClassName("avtm").length - 1; i >= 0; i--) {
	document.getElementsByClassName("avtm")[i].innerHTML="<a><img src=\"https://www.hostloc.com/uc_server/avatar.php\"></a>";
    }
    // Your code here...
})();
