// ==UserScript==
// @name        Language Changer
// @namespace   Me
// @include     *wegobuy*
// @include     *superbuy*
// @version     
// @grant       none
// @description:en       Changes the language
// @run-at document-start
// @description Changes the language
// @downloadURL https://update.greasyfork.org/scripts/393977/Language%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/393977/Language%20Changer.meta.js
// ==/UserScript==

var url = window.location.toString();
if (url.indexOf('www.wegobuy.com/cn/') !== - 1) {
  window.location = url.replace(/cn/, 'en');
}

var url = window.location.toString();
if (url.indexOf('www.superbuy.com/cn/') !== - 1) {
  window.location = url.replace(/cn/, 'en');
}
