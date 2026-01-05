// ==UserScript==
// @name         Current IP
// @namespace    www.fuckboygamers.club
// @version      1.1
// @description  Posts your current IP on your navigation panel
// @author       Mr Whiskey
// @include      *://hackforums.net/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @connect      *api.ipify.org*
// @connect      *bot.
// @downloadURL https://update.greasyfork.org/scripts/26137/Current%20IP.user.js
// @updateURL https://update.greasyfork.org/scripts/26137/Current%20IP.meta.js
// ==/UserScript==

var worked = 0;
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       $(".links").text('Your IP: ' + this.response);
    }
    else
        worked++;
        if(worked > 2)
        worked = 0;
};
if(worked === 0)
    xhttp.open("GET", "//api.ipify.org", true);
if(worked === 1)
    xhttp.open("GET", "//icanhazip.com", true);
if(worked === 2)
    xhttp.open("GET", "//ipinfo.io/ip", true);
xhttp.send();
console.log(worked);