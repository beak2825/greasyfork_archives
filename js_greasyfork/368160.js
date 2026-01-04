// ==UserScript==
// @name YouTube Polymer Disable
// @match *://www.youtube.com/*
// @exclude *://www.youtube.com/embed/*
// @grant none
// @run-at document-start
// @description:en Fixes YT
// @version 0.0.1.20180517220458
// @namespace https://greasyfork.org/users/186321
// @description Fixes YT
// @downloadURL https://update.greasyfork.org/scripts/368160/YouTube%20Polymer%20Disable.user.js
// @updateURL https://update.greasyfork.org/scripts/368160/YouTube%20Polymer%20Disable.meta.js
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