// ==UserScript==
// @name         Date Changer for dashboard
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically inputs video title on Live Dashboard
// @author       You
// @match        https://www.youtube.com/live_dashboard*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/378219/Date%20Changer%20for%20dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/378219/Date%20Changer%20for%20dashboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {

if(document.getElementsByClassName("video-settings-title")[0] != null) {

var d = new Date();

if(d.getHours() <= 12) {window.realtime = "Morning"} else {window.realtime = "Evening"};
var wd = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
GM_setClipboard("PHPCG " + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() + " " + wd[d.getDay()] + " " + realtime + " Service");

}

},100);
})();