// ==UserScript==
// @name         华为商城抢购 自动提交订单
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  华为商城抢购自动提交订单
// @author       You
// @match        https://buy.vmall.com/submit_order.html*
// @grant        
// @downloadURL https://update.greasyfork.org/scripts/392725/%E5%8D%8E%E4%B8%BA%E5%95%86%E5%9F%8E%E6%8A%A2%E8%B4%AD%20%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E8%AE%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/392725/%E5%8D%8E%E4%B8%BA%E5%95%86%E5%9F%8E%E6%8A%A2%E8%B4%AD%20%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E8%AE%A2%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    window.onload=function(){
        ec.order.checkOrder.doSubmit();
    }
})();