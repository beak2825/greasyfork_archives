// ==UserScript==
// @name         统计月报表插件
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  将URL中指定参数的值替换为新的值
// @author       Your Name
// @match        http://222.247.54.151:9000/irpt/ei/portal/bbhview/querybbh.do?*
// @grant        none
// @license      heshenglong313@163.com
// @downloadURL https://update.greasyfork.org/scripts/485157/%E7%BB%9F%E8%AE%A1%E6%9C%88%E6%8A%A5%E8%A1%A8%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/485157/%E7%BB%9F%E8%AE%A1%E6%9C%88%E6%8A%A5%E8%A1%A8%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前URL
    var currentURL = window.location.href;

    // 判断URL中是否包含指定的参数组合
    if (currentURL.includes("startindex=0&pagesize=1500&")) {
        console.log("跳过替换");
        return;
    }
    // 判断URL中是否包含startindex=0参数
    else if (currentURL.includes("startindex=0")) {

        if (!currentURL.includes("&pagesize")) {
            //console.log("跳过替换");
            //return;
            // 替换参数的新值
            var newParamValue = "startindex=0&pagesize=1500";

            // 使用正则表达式替换指定参数的值
            currentURL = currentURL.replace(/(startindex=0)/, newParamValue);

            // 更新当前URL
            window.location.href = currentURL;
        }
    }
})();