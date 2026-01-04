// ==UserScript==
// @name         no more flutter.dev
// @version      0.0.1
// @license      GPL-3.0-only
// @description  convert docs.flutter.dev to flutter.cn/docs/
// @namespace    https://docs.flutter.dev
// @icon         https://flutter.cn/favicon.ico
// @author       Nicoeevee
// @match        https://docs.flutter.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467902/no%20more%20flutterdev.user.js
// @updateURL https://update.greasyfork.org/scripts/467902/no%20more%20flutterdev.meta.js
// ==/UserScript==

(function() {
    'use strict';

  var new_location = location.href.replace('docs.flutter.dev', 'flutter.cn/docs');
  location.href = new_location;
})();