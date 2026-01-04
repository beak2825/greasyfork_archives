// ==UserScript==
// @name         URBTIX ticket script skip321
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Used for buying ticket!
// @author       Felix
// @match        http://msg.urbtix.hk/
// @match        http://busy.urbtix.hk/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452698/URBTIX%20ticket%20script%20skip321.user.js
// @updateURL https://update.greasyfork.org/scripts/452698/URBTIX%20ticket%20script%20skip321.meta.js
// ==/UserScript==

window.onload = function() {
    'use strict';
    function createCookie(name,value,days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires=" + date.toGMTString();
        }
        else expires = "";
        document.cookie = name+"=" + value + expires + "; path=/";
    }
    function eraseCookie(name) {
        createCookie(name,"",-1);
    }
    function eraseAllCookie(callback) {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            eraseCookie(cookies[i].split("=")[0]);
        }
        callback();
    }

    if (window.location != "https://ticket.urbtix.hk/internet/zh_TW/eventDetail/44187") {
        eraseAllCookie(function() {
            window.location = "https://ticket.urbtix.hk/internet/zh_TW/eventDetail/44187";
        });
    }
}