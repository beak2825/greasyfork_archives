// ==UserScript==
// @name         Blutopia actual buffer
// @description  Shows your actual buffer(to 1.0 ratio) next to blutopias buffer(0.4 ratio)
// @match        http://blutopia.xyz/*
// @match        https://blutopia.xyz/*
// @exclude      /https?:\/\/blutopia\.xyz\/login/
// @exclude      /https?:\/\/blutopia\.xyz\/register/
// @exclude      /https?:\/\/blutopia\.xyz\/password\/reset/
// @exclude      /https?:\/\/blutopia\.xyz\/username\/reminder/
// @exclude      /https?:\/\/blutopia\.xyz\/application/
// @exclude      /https?:\/\/blutopia\.xyz\/rss\/.*/
// @version 0.0.1.20200714150437
// @namespace https://greasyfork.org/users/656892
// @downloadURL https://update.greasyfork.org/scripts/407049/Blutopia%20actual%20buffer.user.js
// @updateURL https://update.greasyfork.org/scripts/407049/Blutopia%20actual%20buffer.meta.js
// ==/UserScript==
try {
    var fileSize = /(\d+\.\d+) (([PTG]i)?B)/;
    var li = document.getElementById("main-content").getElementsByClassName("list-inline")[0].getElementsByTagName("li");
    var upload = toGiB(trimHTML(li[2].innerHTML));
    var download = toGiB(trimHTML(li[3].innerHTML));

    li[5].innerHTML = li[5].innerHTML.replace("iB", "iB / " + GiBtoString((upload - download)));
} catch(err) { /*prob on a page without the header thing*/ }

function trimHTML(string) {
    return string.replace(/(<([^>]+)>)|\n|/,"").replace(/ {2,}/, " ").trim();
}

function toGiB(string) {
    var regexp = string.match(fileSize);
    if(regexp == null) {
        return 0;
    }
    var size = parseFloat(regexp[1]);
    var unit = regexp[2];
    var factor;
    switch(unit) {
        case "PiB":
            factor = 1024*1024;
            break;
        case "TiB":
            factor = 1024;
            break;
        case "GiB":
            factor = 1;
            break;
        default:
            return 0;
    }
    return size * factor;
}

function GiBtoString(GiB) {
    var TiB = 1024;
    var PiB = TiB*TiB;
    var unit = " GiB";
    var size = GiB;

    if(GiB >= TiB && GiB < PiB) {
        unit = " TiB";
        size = GiB/TiB;
    } else if(GiB >= PiB) {
        unit = " PiB";
        size = GiB/PiB;
    }

    return size.toFixed(2) + unit;
}