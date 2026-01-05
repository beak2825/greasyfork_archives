// ==UserScript==
// @name        crocoSkipper
// @namespace   http://crocoskipper/
// @match       *://www.croco.site/*
// @match       *://croco.site/*
// @description croco.siteをスキップ
// @version     1.5
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/27902/crocoSkipper.user.js
// @updateURL https://update.greasyfork.org/scripts/27902/crocoSkipper.meta.js
// ==/UserScript==
(function() {
  var current_url = location.href;
  var separator = "?l=";
  var index;
  if ((index = current_url.indexOf(separator)) === -1) {
    return;
  }
  var dest_url = current_url.slice(index + separator.length);
  if (dest_url.indexOf("://") === -1) {
    dest_url = "http://" + dest_url;
  }
  location.href = dest_url;
})();