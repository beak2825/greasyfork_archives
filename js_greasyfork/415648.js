// ==UserScript==
// @name         禁止樂天遮擋窗口
// @description  禁止樂天遮擋窗口!
// @namespace    https://www.rakuten.com.tw/
// @version      1.0
// @author       lupohan44
// @match        *://www.rakuten.com.tw/event/double11/info/*
// @grant        none
// @require      //code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/415648/%E7%A6%81%E6%AD%A2%E6%A8%82%E5%A4%A9%E9%81%AE%E6%93%8B%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/415648/%E7%A6%81%E6%AD%A2%E6%A8%82%E5%A4%A9%E9%81%AE%E6%93%8B%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

'use strict';
(function() {
    $('#page > div.contents > div.filter').remove()
})();