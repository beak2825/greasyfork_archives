// ==UserScript==
// @name     RageZone Notification Titlebar
// @version  1.0.1
// @grant    none
// @include *.ragezone.com/*
// @require https://code.jquery.com/jquery-2.2.4.min.js
// @namespace https://greasyfork.org/users/177261
// @description Shows how many notifications you have on RageZone
// @downloadURL https://update.greasyfork.org/scripts/40080/RageZone%20Notification%20Titlebar.user.js
// @updateURL https://update.greasyfork.org/scripts/40080/RageZone%20Notification%20Titlebar.meta.js
// ==/UserScript==
let elem = document.getElementsByClassName('popupctrl')[0];
let oldTitle = document.title;
if(elem.innerHTML != "Notifications")
{
  let num = document.getElementsByClassName('notifications-number')[0].innerText;
  document.title = "\u2757 ("+num+") " + oldTitle;
}else{
  document.title = "(0) " + oldTitle;
}