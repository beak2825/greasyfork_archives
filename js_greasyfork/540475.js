// ==UserScript==
// @name         黑龙江中医药大学跳过教务系统alert
// @namespace    https://github.com/Ohdmire
// @version      0.1
// @description  强制跳转alert到指定地址
// @author       Ohdmire
// @match        http://jwc.hljucm.net/jsxsd/xspj/xspj_save.do
// @run-at       document-start
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/540475/%E9%BB%91%E9%BE%99%E6%B1%9F%E4%B8%AD%E5%8C%BB%E8%8D%AF%E5%A4%A7%E5%AD%A6%E8%B7%B3%E8%BF%87%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9Falert.user.js
// @updateURL https://update.greasyfork.org/scripts/540475/%E9%BB%91%E9%BE%99%E6%B1%9F%E4%B8%AD%E5%8C%BB%E8%8D%AF%E5%A4%A7%E5%AD%A6%E8%B7%B3%E8%BF%87%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9Falert.meta.js
// ==/UserScript==

(function() {
    'use strict';
     let scriptContent = document.head.innerHTML
     document.head.innerHTML = document.head.innerHTML.replace("");
    const urlMatch = scriptContent.match(/parent\.location\.href='([^']+)'/);
    if (urlMatch && urlMatch[1]) {
        const domain = window.location.origin;
        const redirectUrl = urlMatch[1];

        const fullUrl = domain + urlMatch[1];
        console.log('提取到完整跳转URL:', fullUrl);

        // 直接跳转（不显示alert）
        window.location.href = fullUrl;

        // 或者使用parent跳转（如果是在iframe中）
        parent.location.href = redirectUrl;
}
})();