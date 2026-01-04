// ==UserScript==
// @name         绕过民生银行信用卡年龄检测
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一句话绕过民生银行信用卡年龄检测
// @author       后月战车
// @match        https://creditcard.cmbc.com.cn/onlinepc/logon/logon.jhtml?*
// @downloadURL https://update.greasyfork.org/scripts/367712/%E7%BB%95%E8%BF%87%E6%B0%91%E7%94%9F%E9%93%B6%E8%A1%8C%E4%BF%A1%E7%94%A8%E5%8D%A1%E5%B9%B4%E9%BE%84%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/367712/%E7%BB%95%E8%BF%87%E6%B0%91%E7%94%9F%E9%93%B6%E8%A1%8C%E4%BF%A1%E7%94%A8%E5%8D%A1%E5%B9%B4%E9%BE%84%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
     document.getElementById("flagDXS").value="true";
})();