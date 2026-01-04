// ==UserScript==
// @license MIT
// @name HKT
// @namespace http://tampermonkey.net/
// @version 0.1
// @description TEST
// @author TEST
// @include *entry*
// @include *queue*
// @include *busy*

// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/452905/HKT.user.js
// @updateURL https://update.greasyfork.org/scripts/452905/HKT.meta.js
// ==/UserScript==

function redirect() {

'use strict';
location.replace("http://entry-hotshow.hkticketing.com/");
}
window.setTimeout(function(){redirect()},300);