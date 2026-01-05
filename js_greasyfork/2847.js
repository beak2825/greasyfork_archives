// ==UserScript==
// @name         Survivor Sucks Cleanup
// @author       jkalderash
// @version      0.1
// @description  Makes Sucks look legitimate.
// @match        http://survivorsucks.com/*
// @match        http://survivorsucks.yuku.com/*
// @copyright    2014+, jkalderash
// @require      http://code.jquery.com/jquery-2.0.0.min.js
// @namespace    http://greasyfork.org/users/1076-jkalderash
// @downloadURL https://update.greasyfork.org/scripts/2847/Survivor%20Sucks%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/2847/Survivor%20Sucks%20Cleanup.meta.js
// ==/UserScript==

$("body").hide();

// Hide all pictures.
$("img").hide();
   
// Hide top navigation bar.
$("#mgr-navigation-holder-top").hide();
$("#search_form").hide();
$("th").hide();
$(".bread-crumbs").hide();
$(".post-title").hide();
$(".myfooter p").hide();
    
// Make the background boring.
document.body.style.background = "white";
$("td").css("background","gray");

document.body.style.fontFamily = "Lucida Console";
$("span").css("fontFamily","Lucida Console");
$("span").css("fontSize","x-small");

$("body").show();

