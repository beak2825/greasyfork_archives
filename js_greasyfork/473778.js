// ==UserScript==
// @name         解决西南石油缴费平台显示不全的问题
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  解决西南石油大学缴费平台在Chromium内核的浏览器上有可能显示不全的问题
// @author       MerePT
// @license      MIT
// @match        http://cwjf.swpu.edu.cn/payment/pay/payment.jsp
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swpu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473778/%E8%A7%A3%E5%86%B3%E8%A5%BF%E5%8D%97%E7%9F%B3%E6%B2%B9%E7%BC%B4%E8%B4%B9%E5%B9%B3%E5%8F%B0%E6%98%BE%E7%A4%BA%E4%B8%8D%E5%85%A8%E7%9A%84%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/473778/%E8%A7%A3%E5%86%B3%E8%A5%BF%E5%8D%97%E7%9F%B3%E6%B2%B9%E7%BC%B4%E8%B4%B9%E5%B9%B3%E5%8F%B0%E6%98%BE%E7%A4%BA%E4%B8%8D%E5%85%A8%E7%9A%84%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let check = setInterval(() => {
        if ($('#ext-gen4').length != 0) {
            clearInterval(check)
            $('#ext-gen4').css('height', '')
        }
    }, 100)
})();