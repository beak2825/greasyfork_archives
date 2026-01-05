// ==UserScript==
// @name         Agario Forums Nice - First release
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Just some testing
// @author       Voakie
// @match        http://agarioforums.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18218/Agario%20Forums%20Nice%20-%20First%20release.user.js
// @updateURL https://update.greasyfork.org/scripts/18218/Agario%20Forums%20Nice%20-%20First%20release.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

window.jQuery

$("head").append("<link href='https://fonts.googleapis.com/css?family=Ubuntu' rel='stylesheet' type='text/css'>");

$("div, p, a, span, button, li, ul, ol, input").css({
    "font-family":"'ubuntu', sans-serif"
});

$("#panel").css({
    "background-color":"crimson",
    "color":"white"
});

$(".thead").css({
    "background-color":"crimson"
});

$("#shoutbox .head").css({
    "background-color":"crimson",
    "border-radius-top-left":"2px",
    "border-radius-top-right":"2px",
    "color":"white"
});

$("#shoutbox .head strong").text("Chatbox");

$(".user_avatar").html("<img src='http://i.imgur.com/mFHS1l6.gif'>");

$(".navigation").hide();

$("#header").css({
    "background-image":"url(http://i.imgur.com/HF3tTzC.png?1)"
});

$(".wrap #logo").html("<div class='header-height'><div class='hd_blur'></div></div>");

var agflogo = "Agarforums.io"

$(".header-height").html("<h1 class='agf_logo'>" + agflogo + "</h1><br><p class='madeby'>Design made by Voakie</p>");

$(".agf_logo").css({
    "color":"crimson",
    "font-size":"60px",
    "-webkit-user-select":"none",
    "-moz-user-select":"none",
    "-o-user-select":"none",
    "margin":"0",
    "cursor":"pointer",
    "-webkit-filter":"blur(1px)",
    "-moz-filter":"blur(1px)",
    "-o-filter":"blur(1px)",
});

$(".agf_logo").click(function() {
    document.location.href = "http://agarioforums.net/index.php";
});

$(".madeby").css({
    "display":"inline-block",
    "padding":"10px",
    "border-radius":"20px",
    "color":"crimson",
    "cursor":"pointer"
});

$(".madeby").hover(function() {
    $(this).css({
        "background-color":"rgba(180,180,180,.4)",
        "transition":"all .3s"
    });
}, function() {
    $(".madeby").css({
        "background-color":"rgba(0, 0, 0, 0)"
    });
});

$(".madeby").click(function() {
    document.location.href = "http://agarioforums.net/member.php?action=profile&uid=1038";
});

setInterval(function() {
    $(".collapsed").removeClass("collapsed");
}, 10);