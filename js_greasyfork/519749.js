// ==UserScript==
// @name 必应Bing搜索去广告 
// @version 1.1
// @description 通过去除网址中的"&form="去除广告
// @author ChatGPT
// @match https://cn.bing.com/search?* 
// @run-at  document-start
// @grant none 
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/519749/%E5%BF%85%E5%BA%94Bing%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/519749/%E5%BF%85%E5%BA%94Bing%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    // 获取当前的 URL
    var currentUrl = window.location.href;

    // 使用正则表达式去除所有 `&form=` 或 `&FORM=` 参数，大小写不敏感
    var updatedUrl = currentUrl.replace(/([&?])form=[^&]*/gi, '\$1');

    // 如果 URL 已经改变，重新加载页面
    if (currentUrl !== updatedUrl) {
        window.location.href = updatedUrl;
    }
})();