// ==UserScript==
// @name       sgmod - replace logo
// @namespace  woot
// @version    1.0
// @description Replaces the SGM logo with the old one.
// @match      http://www.seriousgmod.com/*
// @copyright  2013+, stackoverflow
// @downloadURL https://update.greasyfork.org/scripts/26326/sgmod%20-%20replace%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/26326/sgmod%20-%20replace%20logo.meta.js
// ==/UserScript==

$( document ).ready(function() {
     $('div[id="logo"] > div > a > img').attr({
       src: "http://i.imgur.com/8u2tpsu.png",
       style: "padding-right:20px"
     });
     $('div[id="logo"] > div').css("margin-left", "45%");
});