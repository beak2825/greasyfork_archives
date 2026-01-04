// ==UserScript==
// @name         移除淘宝小秘悬浮
// @version      0.1
// @icon         http://img.alicdn.com/favicon.ico
// @description  已购买
// @author       n0tyet
// @grant        unsafeWindow
// @include      *://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @run-at       document-end
// @namespace    http://www.n0tyet.com/
// @downloadURL https://update.greasyfork.org/scripts/369707/%E7%A7%BB%E9%99%A4%E6%B7%98%E5%AE%9D%E5%B0%8F%E7%A7%98%E6%82%AC%E6%B5%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/369707/%E7%A7%BB%E9%99%A4%E6%B7%98%E5%AE%9D%E5%B0%8F%E7%A7%98%E6%82%AC%E6%B5%AE.meta.js
// ==/UserScript==

(function() {
	'use strict';
    window.setTimeout(function(){
        $('#J_xiaomi_dialog').remove();
    }, 500);
}());
