// ==UserScript==
// @name         HKTicketing skip 10987654321
// @namespace    https://www.jwang0614.top/scripts
// @version      0.1
// @description  快達網售票
// @author       Olivia
// @match        busy.hkticketing.com*
// @match        https://queue.hkticketing.com/hotshow.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454719/HKTicketing%20skip%2010987654321.user.js
// @updateURL https://update.greasyfork.org/scripts/454719/HKTicketing%20skip%2010987654321.meta.js
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

    if (window.location != "https://hotshow.hkticketing.com/shows/show.aspx?sh=PANTH1222") {
        eraseAllCookie(function() {
            window.location = "https://hotshow.hkticketing.com/shows/show.aspx?sh=PANTH1222";
        });
    }
}