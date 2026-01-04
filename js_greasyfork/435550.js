// ==UserScript==
// @name        Queue Deny/Approve Button Seperation/Colours - RateYourMusic
// @namespace   iN008
// @description Separates and colours the Approve/Deny buttons found on release corrections and image submissions.
// @match       https://rateyourmusic.com/admin/*
// @license     MIT
// @version     1.0
// @author      ~iN008
// @downloadURL https://update.greasyfork.org/scripts/435550/Queue%20DenyApprove%20Button%20SeperationColours%20-%20RateYourMusic.user.js
// @updateURL https://update.greasyfork.org/scripts/435550/Queue%20DenyApprove%20Button%20SeperationColours%20-%20RateYourMusic.meta.js
// ==/UserScript==
$("a.blue_btn:contains('Deny')").css({"background":"#cb1a3c","margin-left":"50px"});
$("a.blue_btn:contains('Approve')").css("background", "#087706");