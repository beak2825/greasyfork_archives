// ==UserScript==
// @name        Strip UTM Tracking (johanb)
// @description Remove "utm_" parameters from the query string, used by Google Analytics.
// @include     *?*utm*
// @version     1
// @grant       none
// @run-at      start
// @namespace https://greasyfork.org/users/126569
// @downloadURL https://update.greasyfork.org/scripts/406701/Strip%20UTM%20Tracking%20%28johanb%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406701/Strip%20UTM%20Tracking%20%28johanb%29.meta.js
// ==/UserScript==

if (document.location.search) {
  var s = document.location.search.replace(/utm_[a-z]+=(.*?)(&|$)/g, '');
  if (s == '?') s = '';
  if (s != document.location.search) {
    var h = document.location.href.replace(/\?.*/, s);
    history.replaceState({}, document.title, h);
  }
}