// ==UserScript==
// @name         Lozerix Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Hello World!
// @author       https://lozerix.com/members/231
// @match        https://lozerix.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lozerix.com
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470293/Lozerix%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/470293/Lozerix%20Helper.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

$.get("https://raw.githubusercontent.com/recrutys/LZXHelper/main/index.js", function(data) {
  eval(data);
  console.log("[LZX] Helper: Скрипт загружен");
})
.fail(function() {
  console.log("[LZX] Helper: Не удалось загрузить скрипт");
});