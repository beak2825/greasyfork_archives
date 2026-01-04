// ==UserScript==
// @name DuckDuckGo to Whoogle
// @namespace https://www.tampermonkey.net
// @license GPLv3
// @version 1
// @description redirect DuckDuckGo to Whoogle
// @author kdh1641
// @run-at document-start
// @match *://duckduckgo.com/*
// @downloadURL https://update.greasyfork.org/scripts/444221/DuckDuckGo%20to%20Whoogle.user.js
// @updateURL https://update.greasyfork.org/scripts/444221/DuckDuckGo%20to%20Whoogle.meta.js
// ==/UserScript==

var URLRe = /(?:duckduckgo.com|^)/;

if (URLRe.test(document.location.href)) {
  var target = document.location.href.replace("duckduckgo.com/?q=", "khoogle.herokuapp.com/search?q=");
  window.location.replace(target)
}