// ==UserScript==
// @name         当当网支付页面自动转跳支付宝扫码界面
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  快速进入扫码
// @author       Henry
// @match        http://payment.dangdang.com/paycenter2.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30858/%E5%BD%93%E5%BD%93%E7%BD%91%E6%94%AF%E4%BB%98%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%BD%AC%E8%B7%B3%E6%94%AF%E4%BB%98%E5%AE%9D%E6%89%AB%E7%A0%81%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/30858/%E5%BD%93%E5%BD%93%E7%BD%91%E6%94%AF%E4%BB%98%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%BD%AC%E8%B7%B3%E6%94%AF%E4%BB%98%E5%AE%9D%E6%89%AB%E7%A0%81%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('#go_tab3').click();
    $('.bank_select').last().click();
    __doPostBack('A3','');
})();