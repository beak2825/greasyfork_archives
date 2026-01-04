// ==UserScript==
// @name         百度查询链接自动添加关键词' -robin'
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  1.02更新内容 新增后缀为“+-robin”的匹配
// @description  为百度搜索链接自动添加" -robin"后缀，可屏蔽大部分百度推广
// @author       leeannm
// @match        https://www.baidu.com/s?*
// @match        https://www.baidu.com/*/s?*
// @match        https://m.baidu.com/s?*
// @match        https://m.baidu.com/*/s?*
// @license       MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523893/%E7%99%BE%E5%BA%A6%E6%9F%A5%E8%AF%A2%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E5%85%B3%E9%94%AE%E8%AF%8D%27%20-robin%27.user.js
// @updateURL https://update.greasyfork.org/scripts/523893/%E7%99%BE%E5%BA%A6%E6%9F%A5%E8%AF%A2%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E5%85%B3%E9%94%AE%E8%AF%8D%27%20-robin%27.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前URL
    var currentUrl = window.location.href;

    // 检查URL是否包含wd参数
    if (currentUrl.includes('wd=') || currentUrl.includes('word=')) {
        var wdParamIndex = 0;
        if (currentUrl.includes('wd=')) {
            // 获取wd参数的值
            wdParamIndex = currentUrl.indexOf('wd=') + 3;
        }
        else {
            // 获取word参数的值
            wdParamIndex = currentUrl.indexOf('word=') + 5;
        }
        var wdValueEndIndex = currentUrl.indexOf('&', wdParamIndex) !== -1 ? currentUrl.indexOf('&', wdParamIndex) : currentUrl.length;
        var wdValue = currentUrl.substring(wdParamIndex, wdValueEndIndex);

         // 检查wd值是否以"%20-robin" 或 " -robin" 或 "+-robin"结尾
        if (!wdValue.endsWith('%20-robin') && !wdValue.endsWith(' -robin') && !wdValue.endsWith('+-robin')) {
            // 添加" -robin"后缀
            var newWdValue = wdValue + ' -robin';

            // 构建新的URL
            var newUrl = currentUrl.substring(0, wdParamIndex) + newWdValue + currentUrl.substring(wdValueEndIndex);

            // 重定向到新的URL
            window.location.href = newUrl;
        }
    }
})();