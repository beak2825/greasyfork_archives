// ==UserScript==
// @name Fandom Old Layout
// @author Test
// @version 1.0
// @date 2021-08-16
// @description A script to get the old Fandom layout back.
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @license CC BY-NC-ND 4.0 International. https://creativecommons.org/licenses/by-nc-nd/4.0/
// @match *://*.fandom.com/*
// @grant none
// @run-at document-start
// @namespace https://greasyfork.org/users/661534
// @downloadURL https://update.greasyfork.org/scripts/430923/Fandom%20Old%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/430923/Fandom%20Old%20Layout.meta.js
// ==/UserScript==

var url = window.location.href;
if (url.indexOf("useskin") === -1) {
  if (url.indexOf("?") > 0) {
    url += "&";
  } else {
    url += "?";
  }
  url += "useskin=oasis";
  window.location.href = url;
}