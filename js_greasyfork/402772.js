// ==UserScript==
// @name        Brutal.io Cleanup Script
// @namespace   Tampermonkey Scripts
// @match       http://brutal.io/
// @match       https://brutal.io/
// @grant       none
// @version     1.0
// @author      AmsterPlays
// @description Download Tampermonkey, Violentmonkey, or other and run this script on Brutal.io to remove the overlay on the home screen.
// @downloadURL https://update.greasyfork.org/scripts/402772/Brutalio%20Cleanup%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/402772/Brutalio%20Cleanup%20Script.meta.js
// ==/UserScript==
$( document ).ready(function() {
$("#bannerID").remove();
$("#mobileBoxId").remove();
$("#linksID").remove();
$("#firstRightBox").remove();
$(".advertiseBox").remove();
$(".leftBottomBox").remove();
$("#pfArrow").remove();
$("#graphicsID").remove();
$(".basic-text2").text("• COPY ROOM LINK");
$("#afterRightBox").remove();
});