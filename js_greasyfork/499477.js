// ==UserScript==
// @name         FFF游戏修改链接打开方式
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  原来打开只能在当前页面打开 安装后点击游戏下载 则弹出新窗口 方便保存
// @homepage     https://greasyfork.org/zh-CN/scripts/499477-fff%E6%B8%B8%E6%88%8F%E4%BF%AE%E6%94%B9%E9%93%BE%E6%8E%A5%E6%89%93%E5%BC%80%E6%96%B9%E5%BC%8F
// @author       Fxy
// @match        http://danji.jifen2345.cn/yxvip.html
// @icon         http://danji.jifen2345.cn/favicon.ico
// @license      GPLv3

// @downloadURL https://update.greasyfork.org/scripts/499477/FFF%E6%B8%B8%E6%88%8F%E4%BF%AE%E6%94%B9%E9%93%BE%E6%8E%A5%E6%89%93%E5%BC%80%E6%96%B9%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/499477/FFF%E6%B8%B8%E6%88%8F%E4%BF%AE%E6%94%B9%E9%93%BE%E6%8E%A5%E6%89%93%E5%BC%80%E6%96%B9%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    window.setTimeout(function(){
        // 获取所有具有 onclick 事件的 a 元素
        var links = document.querySelectorAll('a[onclick]');
        // 遍历这些元素
        links.forEach(function(link) {
        // 检查 onclick 属性中是否包含 window.location.href
        var onclick = link.getAttribute('onclick');
        if (onclick && onclick.includes('window.location.href')) {
            // 提取 URL
            var urlMatch = onclick.match(/'([^']+)'/);
            if (urlMatch && urlMatch[1]) {
                var url = urlMatch[1];
                // 移除 onclick 属性
                link.removeAttribute('onclick');
                // 设置 href 属性
                link.setAttribute('href', url);
                link.setAttribute('target', '_blank');
            }
        }
    },2000);
});
})();