// ==UserScript==
// @name         调用下载器
// @version      1.3
// @description  调用下载器下载文件链接
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/521758/%E8%B0%83%E7%94%A8%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/521758/%E8%B0%83%E7%94%A8%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册菜单命令，通过点击菜单来手动触发下载
    GM_registerMenuCommand('调用下载器', function() {
(function() {
    // 提示用户输入下载URL，默认使用当前页面的URL
    var url = prompt("请输入下载URL:", location.href);

    // 检查用户是否输入了有效的URL
    if (url && isValidURL(url)) {
        // 如果URL有效，使用GM_download进行下载
        GM_download(url);
    } else {
        // 如果URL无效，给出提示
        alert("无效的URL，无法下载！");
    }

    // 简单的URL验证函数
    function isValidURL(inputUrl) {
        try {
            new URL(inputUrl);  // 尝试构造URL对象
            return true;         // 如果URL构造成功，返回true
        } catch (e) {
            return false;        // 如果URL构造失败，返回false
        }
    }
})();
    });

})();