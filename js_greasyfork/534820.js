// ==UserScript==
// @name YouTube Float Player
// @namespace YouTube Float Player
// @version 1.0.0
// @description Place the YouTube video in a small window at the bottom right corner when scrolling.
// @author DumbGPT
// @match *://www.youtube.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/534820/YouTube%20Float%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/534820/YouTube%20Float%20Player.meta.js
// ==/UserScript==

(function() {
'use strict';

var doc = document;
var win = window;
var floatheight = 0;

function docsearch(query) {
return doc.evaluate(query, doc, null, 7, null);
}

function insertStyle(str, id) {
var styleNode = null;
if (id != null) {
styleNode = doc.getElementById(id);
}
if (styleNode == null) {
styleNode = document.createElement("style");
styleNode.id = id;
styleNode.setAttribute("type", "text/css");
doc.head.appendChild(styleNode);
}
if (styleNode.textContent != str)
styleNode.textContent = str;
}

function reset_float() {
var page = docsearch("//ytd-page-manager/ytd-watch-flexy").snapshotItem(0);
if (!page) return;

if (page.getAttribute("float") != null) setTimeout(function () { win.dispatchEvent(new Event('resize')) }, 100);
page.removeAttribute("float");
page.parentNode.parentNode.removeAttribute("float");
insertStyle("", "ytpc_style_float");
floatheight = 0;
}

function float() {
if (win.location.href.indexOf("watch?") == -1) {
reset_float();
return;
}

var page = docsearch("//ytd-page-manager/ytd-watch-flexy").snapshotItem(0);
if (!page) return;

var intheater = page.getAttribute("theater") != null;
var fullscreen = page.getAttribute("fullscreen") != null;

if (fullscreen) {
reset_float();
return;
}

var vid = intheater ? docsearch("//*[@id='full-bleed-container']").snapshotItem(0)
: docsearch("//*[@id='primary-inner']/*[@id='player']").snapshotItem(0);
if (!vid) return;

var val = vid.getBoundingClientRect();
var vheight = val.bottom - val.top;

var W = doc.body.clientWidth || doc.documentElement.clientWidth;
var H = doc.body.clientHeight || doc.documentElement.clientHeight;
var height = 240;
var width = 427;

var infloat = page.getAttribute("float") != null;

if (!infloat) {
floatheight = vheight;
}

var thres = -1;
if (floatheight > 0) thres = floatheight - 220;

var scrollY = win.pageYOffset;

if (scrollY >= thres && thres > 0) {
page.setAttribute("float", "");
page.parentNode.parentNode.setAttribute("float", "");

var hoff = W - width;
var voff = H - height;
var rtl = (doc.body.getAttribute('dir') == 'rtl');
var lroff = rtl ? "right:0px !important;" : "left:" + hoff + "px !important;";

insertStyle("\
ytd-watch-flexy[float] #player-container {position: fixed !important; top: " + voff + "px !important; " + lroff + " width: " + width + "px !important; height: " + height + "px !important; z-index:1000 !important;}\
ytd-watch-flexy[float] .html5-main-video {width: " + width + "px !important; height: " + height + "px !important;}\
", "ytpc_style_float");
}
else {
reset_float();
}
}

win.addEventListener("focus", float, false);
win.addEventListener("blur", float, false);
win.addEventListener("resize", float, false);
win.addEventListener("scroll", float, false);

setInterval(float, 1000);
float();
})();
