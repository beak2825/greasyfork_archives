// ==UserScript==
// @name         全显文字2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ShowAllText2
// @author       Your Name
// @match        *://*/*  
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506552/%E5%85%A8%E6%98%BE%E6%96%87%E5%AD%972.user.js
// @updateURL https://update.greasyfork.org/scripts/506552/%E5%85%A8%E6%98%BE%E6%96%87%E5%AD%972.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听页面加载完成事件
    window.addEventListener('load', function() {
        // 在页面加载完成后2秒执行函数
        setTimeout(function() {
            // 获取所有 <style> 标签
            var styleSheets = document.querySelectorAll('style');
            for (var i = 0; i < styleSheets.length; i++) {
                // 尝试获取 CSSRules, 如果存在的话
                if (styleSheets[i].sheet && styleSheets[i].sheet.cssRules) {
                    // 遍历每一条规则
                    for (var j = 0; j < styleSheets[i].sheet.cssRules.length; j++) {
                        var rule = styleSheets[i].sheet.cssRules[j];
                        // 删除指定的样式属性
                        if (rule.style) {
                            rule.style.removeProperty('white-space');
                            rule.style.removeProperty('overflow');
                            rule.style.removeProperty('text-overflow');
                            //rule.style.removeProperty('display');
                        }
                    }
                }
            }

            // 也可以考虑直接删除或覆盖这些规则
            // 注意：直接删除可能影响其他样式
            // for (var j = 0; j < styleSheets[i].sheet.cssRules.length; j++) {
            //     styleSheets[i].sheet.deleteRule(j);
            //     j--; // 因为删除了一个规则，所以需要回退索引
            // }
        }, 2000); // 2000毫秒 = 2秒
    });
})();