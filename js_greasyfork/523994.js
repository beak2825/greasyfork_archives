// ==UserScript==
// @name         移除网址中的 "hd"
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动移除网址中出现的 "hd" 并跳转到修改后的地址
// @author       YourName
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523994/%E7%A7%BB%E9%99%A4%E7%BD%91%E5%9D%80%E4%B8%AD%E7%9A%84%20%22hd%22.user.js
// @updateURL https://update.greasyfork.org/scripts/523994/%E7%A7%BB%E9%99%A4%E7%BD%91%E5%9D%80%E4%B8%AD%E7%9A%84%20%22hd%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的网址
    const currentURL = window.location.href;

    // 检查网址中是否包含 "hd"
    if (currentURL.includes('hd')) {
        console.log("检测到包含 'hd' 的网址:", currentURL);

        // 删除 "hd" 并生成新的网址
        const newURL = currentURL.replace(/hd/g, '');

        // 跳转到新的网址
        console.log("跳转到新网址:", newURL);
        window.location.replace(newURL);
    }
})();