// ==UserScript==
// @name         Skip2Watch - تخطي للمشاهدة
// @namespace    http://www.iN4sser.com/
// @version      0.1
// @description  تخطي صفحة بيانات الفيديو في العديد من مواقع المشاهدة
// @author       iN4sser
// @include      *://*cimaclub.com/*/
// @include      *://*series4watch.tv/*/
// @include      *://*cima4up.tv/*/
// @include      *://*shahid4u.tv/*
// @include      *://*cima45.com/*/
// @include      *://*egfire.com/*.html
// @include      *://live.aflamhq.co/*/
// @include      *://*egy4way.com/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39500/Skip2Watch%20-%20%D8%AA%D8%AE%D8%B7%D9%8A%20%D9%84%D9%84%D9%85%D8%B4%D8%A7%D9%87%D8%AF%D8%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/39500/Skip2Watch%20-%20%D8%AA%D8%AE%D8%B7%D9%8A%20%D9%84%D9%84%D9%85%D8%B4%D8%A7%D9%87%D8%AF%D8%A9.meta.js
// ==/UserScript==
if (/cimaclub\.com/.test (location.hostname) ) {
var oldUrlPath  = window.location.pathname;
if ( ! /\?view=1$/.test (oldUrlPath) ) {
if (window.location.href.toString().indexOf("?view=1") != -1) return false;
    var newURL  = window.location.protocol + "//"+ window.location.host+ oldUrlPath + "?view=1" + window.location.search + window.location.hash;
    window.location.replace (newURL);
}
}
else if (/series4watch\.tv/.test (location.hostname) ) {
var oldUrlPath  = window.location.pathname;
if ( ! /\?view=1$/.test (oldUrlPath) ) {
if (window.location.href.toString().indexOf("?view=1") != -1) return false;
    var newURL  = window.location.protocol + "//"+ window.location.host+ oldUrlPath + "?view=1" + window.location.search + window.location.hash;
    window.location.replace (newURL);
}
}
else if (/cima4up\.tv/.test (location.hostname) ) {
var oldUrlPath  = window.location.pathname;
if ( ! /\?view=1$/.test (oldUrlPath) ) {
if (window.location.href.toString().indexOf("?view=1") != -1) return false;
    var newURL  = window.location.protocol + "//"+ window.location.host+ oldUrlPath + "?view=1" + window.location.search + window.location.hash;
    window.location.replace (newURL);
}
}
else if (/shahid4u\.tv/.test (location.hostname) ) {
var oldUrlPath  = window.location.pathname;
if ( ! /\?watch=1$/.test (oldUrlPath) ) {
if (window.location.href.toString().indexOf("?watch=1") != -1) return false;
    var newURL  = window.location.protocol + "//"+ window.location.host+ oldUrlPath + "?watch=1" + window.location.search + window.location.hash;
    window.location.replace (newURL);
}
}
else if (/cima45\.com/.test (location.hostname) ) {
var oldUrlPath  = window.location.pathname;
if ( ! /\?watch=1$/.test (oldUrlPath) ) {
if (window.location.href.toString().indexOf("?watch=1") != -1) return false;
    var newURL  = window.location.protocol + "//"+ window.location.host+ oldUrlPath + "?watch=1" + window.location.search + window.location.hash;
    window.location.replace (newURL);
}
}
else if (/egfire\.com/.test (location.hostname) ) {
var oldUrlPath  = window.location.pathname;
if ( ! /\?do=views$/.test (oldUrlPath) ) {
if (window.location.href.toString().indexOf("?do=views") != -1) return false;
    var newURL  = window.location.protocol + "//"+ window.location.host+ oldUrlPath + "?do=views" + window.location.search + window.location.hash;
    window.location.replace (newURL);
}
}
else if (/live.aflamhq\.co/.test (location.hostname) ) {
var oldUrlPath  = window.location.pathname;
if ( ! /\?watch=1$/.test (oldUrlPath) ) {
if (window.location.href.toString().indexOf("?watch=1") != -1) return false;
    var newURL  = window.location.protocol + "//"+ window.location.host+ oldUrlPath + "?watch=1" + window.location.search + window.location.hash;
    window.location.replace (newURL);
}
}
else if (/egy4way\.com/.test (location.hostname) ) {
var oldUrlPath  = window.location.pathname;
if ( ! /\?watch=1$/.test (oldUrlPath) ) {
if (window.location.href.toString().indexOf("?watch=1") != -1) return false;
    var newURL  = window.location.protocol + "//"+ window.location.host+ oldUrlPath + "?watch=1" + window.location.search + window.location.hash;
    window.location.replace (newURL);
}
}