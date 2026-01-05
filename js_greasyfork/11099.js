// ==UserScript==
// @name         Alvin Hellojav
// @namespace    Alvin Hellojav
// @version      0.1
// @description  BETA
// @author       Alvin
// @require      http://code.jquery.com/jquery-1.11.3.min.js
// @match        http://www.hellojav.com/file_downpage.php
// @downloadURL https://update.greasyfork.org/scripts/11099/Alvin%20Hellojav.user.js
// @updateURL https://update.greasyfork.org/scripts/11099/Alvin%20Hellojav.meta.js
// ==/UserScript==

$( document ).ready(function() {
    var URL = "http://www.hellojav.com" + $("a#downBtn").attr("href");
    window.location.assign(URL);
    setTimeout(window.close, 1000);
});
