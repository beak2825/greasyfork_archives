// ==UserScript==
// @name         no more pub.dev
// @version      0.2.1
// @license      GPL-3.0-only
// @description  convert pub.dev to pub.flutter-io.cn
// @namespace    https://pub.dev
// @icon         https://pub.flutter-io.cn/favicon.ico
// @author       Nicoeevee
// @match        https://pub.dev/packages/*
// @match        https://pub.dev/packages?q=*
// @match        https://pub.dev
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461117/no%20more%20pubdev.user.js
// @updateURL https://update.greasyfork.org/scripts/461117/no%20more%20pubdev.meta.js
// ==/UserScript==

(function() {
    'use strict';

  var debug = 0;
  var new_location = location.href.replace('pub.dev', 'pub.flutter-io.cn');
  if ( debug > 0 ) {
    alert(  "Hash:     "+location.hash+
          "\nHost:     "+location.host+
          "\nHostname: "+location.hostname+
          "\nHREF:     "+location.href+
          "\nPathname: "+location.pathname+
          "\nPort:     "+location.port+
          "\nProtocol: "+location.protocol+
          "\n"+
          "\nNew Location: "+new_location);
  };
  location.href = new_location;
})();