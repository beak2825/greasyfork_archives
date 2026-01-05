// ==UserScript==
// @name        Autoclose Tab
// @description Close tab
// @include     *truyen*
// @match       gaybeeg.info//*
// @include     *
// @grant       window.close

// @version 0.0.1.20170509034148
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/29606/Autoclose%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/29606/Autoclose%20Tab.meta.js
// ==/UserScript==

// separate words or phrases with a comma
var blacklist = ["ad.doubleclick", "expressvpn", "chrome-extension", "cjpalhdlnbpafiamejdnhcphjbkeiagm"],
    re = new RegExp(blacklist.join('|'), "i");

if (re.test(document.body.textContent)) {
  var win = window.open("","_self");
  win.close();
}