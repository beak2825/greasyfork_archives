// ==UserScript==
// @name         allYoutubersSubbot(prank)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  prank your friends with a fake subbot
// @author       You
// @match        https://www.youtube.com/channel/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376228/allYoutubersSubbot%28prank%29.user.js
// @updateURL https://update.greasyfork.org/scripts/376228/allYoutubersSubbot%28prank%29.meta.js
// ==/UserScript==

var d = document.getElementsByClassName("deemphasize style-scope yt-formatted-string");
var b = document.getElementById("subscriber-count");

var c = b.innerHTML.replace(' מנויים', '');
var newc = c.replace(/,/g, '');
var f = Number(newc);
var g = "";


var a = c.charAt(0);
var t = c.charAt(1);




function commafy( num ) {
    var str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}
function set() {

    a = c.charAt(0);
    t = c.charAt(1);
    g = commafy(f);
    d[0].innerHTML = a + t + "M";
    b.innerHTML = "מנויים " + g;
    f = f + 1;
}
window.setInterval(set, 1);