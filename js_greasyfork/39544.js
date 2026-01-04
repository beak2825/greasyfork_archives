// ==UserScript==
// @name YouTube Polymer Disable
// @locale US
// @description Suhh dude
// @match *://www.youtube.com/*
// @exclude *://www.youtube.com/embed/*
// @grant none
// @run-at document-start
// @version 2.1
// @namespace https://greasyfork.org/users/175036
// @downloadURL https://update.greasyfork.org/scripts/39544/YouTube%20Polymer%20Disable.user.js
// @updateURL https://update.greasyfork.org/scripts/39544/YouTube%20Polymer%20Disable.meta.js
// ==/UserScript==
var url = window.location.href;
if (url.indexOf("disable_polymer") === -1) {
  if (url.indexOf("?") > 0) {
    url += "&";
  } else {
    url += "?";
  }
  url += "disable_polymer=1";
  window.location.href = url;
}