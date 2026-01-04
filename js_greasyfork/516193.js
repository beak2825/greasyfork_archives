// ==UserScript==
// @name         手机版百度重定向电脑版百度
// @version      1.0
// @description  当浏览器UA非手机UA时，将手机版百度搜索重定向成电脑版百度搜索
// @author       ChatGPT
// @match        *://m.baidu.com/*&word=*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/516193/%E6%89%8B%E6%9C%BA%E7%89%88%E7%99%BE%E5%BA%A6%E9%87%8D%E5%AE%9A%E5%90%91%E7%94%B5%E8%84%91%E7%89%88%E7%99%BE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/516193/%E6%89%8B%E6%9C%BA%E7%89%88%E7%99%BE%E5%BA%A6%E9%87%8D%E5%AE%9A%E5%90%91%E7%94%B5%E8%84%91%E7%89%88%E7%99%BE%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 获取当前的 URL
    var currentUrl = window.location.href;
    
    // 获取浏览器的 User-Agent
    var userAgent = navigator.userAgent;
    
    // 只有在 URL 包含 "&word=" 且 UA 不包含 "Mobile" 时才替换
    if (currentUrl.includes('&word=') && !userAgent.includes('Mobile')) {
        // 替换 m.baidu.com 为 www.baidu.com
        var newUrl = currentUrl.replace('m.baidu.com', 'www.baidu.com');
        
        // 如果 URL 被修改，则重定向到新的 URL
        if (newUrl !== currentUrl) {
            window.location.href = newUrl;
        }
    }
})();
