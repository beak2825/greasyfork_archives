// ==UserScript==
// @name         Narou Counter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Count how many times you visit Narou today.
// @author       beet
// @match        https://syosetu.com/user/top/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406633/Narou%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/406633/Narou%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // alert(document.cookie);
    var d = new Date();
    var today = d.getMonth() * 100 + d.getDate();
    var lastday = Math.max(...(document.cookie.split(';').map(x => x.split("=")[0].trim() == "narou_lastday" ? x.split("=")[1] * 1.0 : 0)));
    var count = Math.max(...(document.cookie.split(';').map(x => x.split("=")[0].trim() == "narou_count" ? x.split("=")[1] * 1.0 : 0))) + 1;
    if (lastday != today) count = 1;
    alert("You visit Narou " + count + " times today!");
    document.cookie = "narou_lastday=" + today;
    document.cookie = "narou_count=" + count;

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    document.cookie = "expires=" + tomorrow.toUTCString();
})();
