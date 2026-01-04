// ==UserScript==
// @author LagSwitchedVirginity
// @namespace https://github.com/LagSwitchedVirginity/UserScripts-and-UserStyles
// @homepage https://github.com/LagSwitchedVirginity/UserScripts-and-UserStyles
// @supportURL https://github.com/LagSwitchedVirginity/UserScripts-and-UserStyles
// @name IMDB to RARBG.to
// @description Should add a button to an IMDB page to go to the RARBG.to piracy page. https://i.imgur.com/U0Xg1T3.png - Requested by Charlie on Discord.
// @version 1567206488
// @match *://www.imdb.com/title/*
// @match *://imdb.com/title/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/388948/IMDB%20to%20RARBGto.user.js
// @updateURL https://update.greasyfork.org/scripts/388948/IMDB%20to%20RARBGto.meta.js
// ==/UserScript==

var t = document.querySelector('meta[property="og:type"]');

if ("video.tv_show" === t.content) {
    var e = document.querySelector('meta[property="pageId"]').content;
    document.querySelector("div.wlb-title-main-details").innerHTML += '<span class="full-wl-button ribbonize" data-recordmetrics="true" style="position: relative;margin-left: 1rem;" onclick="location.href=\'https://www.rarbg.to/tv/' + e + '/\'"><div class="wl-ribbon fullsize not-inWL" style="background-color:#3860bb;" title="Click to go to rarbg.to"><div class="container"><span class="text2" style="color:white;">Click to go to <b>rarbg.to</b></span></div></div></span>';
} else if ("video.movie" === t.content) {
    e = document.querySelector('meta[property="pageId"]').content;
    document.querySelector("div.wlb-title-main-details").innerHTML += '<span class="full-wl-button ribbonize" data-recordmetrics="true" style="position: relative;margin-left: 1rem;" onclick="location.href=\'https://www.rarbg.to/torrents.php?imdb=' + e + '\'"><div class="wl-ribbon fullsize not-inWL" style="background-color:#3860bb;" title="Click to go to rarbg.to"><div class="container"><span class="text2" style="color:white;">Click to go to <b>rarbg.to</b></span></div></div></span>';
}