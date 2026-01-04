// ==UserScript==
// @name Reddit Old Mobile Layout
// @author Test
// @version 1.0
// @date 2021-08-16
// @description A script to get the old Reddit mobile back.
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @license CC BY-NC-ND 4.0 International. https://creativecommons.org/licenses/by-nc-nd/4.0/
// @match *://*.reddit.com/*
// @grant none
// @run-at document-start
// @namespace https://greasyfork.org/users/661534
// @downloadURL https://update.greasyfork.org/scripts/441434/Reddit%20Old%20Mobile%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/441434/Reddit%20Old%20Mobile%20Layout.meta.js
// ==/UserScript==
 
var url = window.location.href;
if (url.indexOf("keep_extension") === -1) {
  if (url.indexOf("?") > 0) {
    url += "&";
  } else {
    url += "?";
  }
  url += "keep_extension=true";
  window.location.href = url;
}