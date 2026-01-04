// ==UserScript==
// @name         Yan_UDN搶除濕機
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Yan
// @match        http://shopping.udn.com/mall/cus/cat/Cc1c02.do?dc_cargxuid_0=U010395458&eventpage=299811013&kdid=eventPage
// @include      http://shopping.udn.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374243/Yan_UDN%E6%90%B6%E9%99%A4%E6%BF%95%E6%A9%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/374243/Yan_UDN%E6%90%B6%E9%99%A4%E6%BF%95%E6%A9%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
$(".buy_btns").append('<a class="pd_buynow_short_btn" href="javascript:goCartBtnAct(\'2\', \'Y\', \'U010395458\', \'0_072_001\', false)" title="立即購買">Yan測試立即購買</a>');

})();