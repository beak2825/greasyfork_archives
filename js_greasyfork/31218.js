// ==UserScript==
// @name         jiandan custom
// @namespace    rfc2109
// @version      0.12
// @description  煎蛋定制
// @author       rfc2109
// @include      http*://jandan.net/duan*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/31218/jiandan%20custom.user.js
// @updateURL https://update.greasyfork.org/scripts/31218/jiandan%20custom.meta.js
// ==/UserScript==
(function () {
  'use strict';
  var blockUsers = [
    '九十九千里'
  ];
  $('.row').filter(function (i) {
    return blockUsers.indexOf($('strong', this).text()) >= 0
  }).remove()
}) ();
