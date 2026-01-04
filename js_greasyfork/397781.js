// ==UserScript==
// @name         机房防抓摆工具 - Generals.io & B站
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  教练我在认真写代码！
// @author       eqvpkbz
// @match        http://generals.io/*
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397781/%E6%9C%BA%E6%88%BF%E9%98%B2%E6%8A%93%E6%91%86%E5%B7%A5%E5%85%B7%20-%20Generalsio%20%20B%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/397781/%E6%9C%BA%E6%88%BF%E9%98%B2%E6%8A%93%E6%91%86%E5%B7%A5%E5%85%B7%20-%20Generalsio%20%20B%E7%AB%99.meta.js
// ==/UserScript==
(function() {
    document.title = '首页 - 洛谷 | 计算机科学教育新生态'; //动态修改网站标题
    var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://www.luogu.com.cn/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
})();