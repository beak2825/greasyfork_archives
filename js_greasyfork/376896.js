// ==UserScript==
// @name         LWHH Full Screen Video.
// @namespace    http://fb.com/Th3Hopper
// @version      0.2
// @description  Hide sidebar and full screen video.
// @author       Ramin
// @match        *://*learnwith.hasinhayder.com/*/course/*
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376896/LWHH%20Full%20Screen%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/376896/LWHH%20Full%20Screen%20Video.meta.js
// ==/UserScript==
$(".main-content").prepend("<div class=\"extend-wrap\"><button id=\"extend-btn\" type=\"button\" class=\"btn btn-danger btn-sm\">close</button> <button type=\"button\" class=\"btn btn-success btn-sm\" id=\"close-btn\">open</button></div>");
$("#extend-btn").click(function () {
    $(".main-content").prepend("<div class=\"extend-css\"></div>");
    $(".extend-css").append("<style>.main-content{width: 100%;padding:0;margin:0}.side-bar{opacity: 0;display:none}h2#vidtitle{display: none}</style>");

});
$("#close-btn").click(function () {
    $(".extend-css").remove();
});