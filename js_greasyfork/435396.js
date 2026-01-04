// ==UserScript==
// @name        warmane.com decancer 2.0
// @namespace   Violentmonkey Scripts
// @match       https://www.warmane.com/*
// @match       http://armory.warmane.com/*
// @match       http://forum.warmane.com/*
// @grant       none
// @version     2.0
// @author      Wriss Urlowicz
// @description remove video and reposition page content, 2.0 using jquery, does not break the notification popups
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435396/warmanecom%20decancer%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/435396/warmanecom%20decancer%2020.meta.js
// ==/UserScript==

//removes video
jQuery('#page-frame').remove()
//repositions content
jQuery('#page-content-wrapper').css("top","70px")
//forum
jQuery('.above_body').css("top","0px")
//repositions navbar
jQuery('.navigation').css("top","0px")
//fuck up the logo
jQuery('.navigation-logo').css("height","60px")
jQuery('.navigation-logo').css("top","0px")