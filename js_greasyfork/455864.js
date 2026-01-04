// ==UserScript==
// @name         Bypass Grayscale
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Bypass grayscale filter on a few Chinese websites
// @author       ayumi-otosaka-314
// @license      WTFPL
// @match        *://weibo.com/*
// @match        *://www.zhihu.com/*
// @match        *://www.bilibili.com/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/455864/Bypass%20Grayscale.user.js
// @updateURL https://update.greasyfork.org/scripts/455864/Bypass%20Grayscale.meta.js
// ==/UserScript==

$(document).ready(function() {
  $( "style:contains('grayTheme')" ).remove(); // weibo
  $( "style:contains('itcauecng')" ).remove(); // zhihu
  $( ".gray" ).removeClass(); // bilibili
});
