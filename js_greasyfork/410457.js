// ==UserScript==
// @name         去除W3Schools “notranslate”
// @namespace    https://greasyfork.org/zh-CN/users/684443
// @homepage     https://greasyfork.org/zh-CN/scripts/410457
// @supportURL   https://greasyfork.org/zh-CN/scripts/410457/feedback
// @version      1.1.6
// @description  去除W3Schools table “notranslate” css class
// @author       zhouhaiboa
// @match        https://www.w3schools.com/*/*.asp
// @match        https://www.w3schools.com/*/*.asp*
// @icon         https://www.w3schools.com/favicon.ico
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @license      GNU GPLv3
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/410457/%E5%8E%BB%E9%99%A4W3Schools%20%E2%80%9Cnotranslate%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/410457/%E5%8E%BB%E9%99%A4W3Schools%20%E2%80%9Cnotranslate%E2%80%9D.meta.js
// ==/UserScript==

(function() {
  $("table").removeClass("notranslate");
  $("table tr td a").addClass("notranslate");
  $("table tr td:nth-child(1)").addClass("notranslate");
})();