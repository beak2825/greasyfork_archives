// ==UserScript==
// @name         9dm重定向及贴内链接优化
// @namespace    http://www.9dmsgame.com
// @version      1.8e
// @description  将网页地址进行重定向，防止搜索跳转时卡死。将贴内的各种链接替换成thread-[数字]-1-1.html的形式
// @author       LRual#7299
// @match        http://www.9dmsgame.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483662/9dm%E9%87%8D%E5%AE%9A%E5%90%91%E5%8F%8A%E8%B4%B4%E5%86%85%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/483662/9dm%E9%87%8D%E5%AE%9A%E5%90%91%E5%8F%8A%E8%B4%B4%E5%86%85%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 URL
    var currentUrl = window.location.href;

    // 判断是否包含 www.9dmsgame.com 和 tid= 数字
    var tidMatch = currentUrl.match(/www\.9dmsgame\.com.*?tid=(\d+)|www\.9damaogame\.net.*?tid=(\d+)|www\.9damaogame\.net\/thread-(\d+)/);

    if (tidMatch) {
        // 提取 tid 值
        var tid = tidMatch[1];

        // 构造新的 URL
        var newUrl = 'http://www.9dmsgame.com/thread-' + tid + '-1-1.html';

        // 重定向到新的 URL
        window.location.href = newUrl;
    }
})();

(function() {
    'use strict';

    // 获取所有文本节点
    var textNodes = document.evaluate("//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    // 替换符合条件的文本
    for (var i = 0; i < textNodes.snapshotLength; i++) {
        var node = textNodes.snapshotItem(i);

        // 匹配类似的文字
        var newText = node.nodeValue.replace(/http:\/\/www\.9dmsgame\.com\/forum\.php\?mod=viewthread&tid=(\d+)&page=1&extra=#pid\d+/g, 'http://www.9dmsgame.com/thread-$1-1-1.html');

        // 更新文本节点的值
        node.nodeValue = newText;
    }
})();
(function() {
    'use strict';

    // 获取所有文本节点
    var textNodes = document.evaluate("//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    // 替换符合条件的文本
    for (var i = 0; i < textNodes.snapshotLength; i++) {
        var node = textNodes.snapshotItem(i);

        // 匹配类似的文字
        var newText = node.nodeValue.replace(/http:\/\/www\.9dmsgame\.com\/forum\.php\?mod=viewthread&tid=(\d+)&extra=page%3D1%26filter%3Dtypeid%26typeid%3D8/g, 'http://www.9dmsgame.com/thread-$1-1-1.html');

        // 更新文本节点的值
        node.nodeValue = newText;
    }
})();

(function() {
    'use strict';

    // 获取所有文本节点
    var textNodes = document.evaluate("//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    // 替换符合条件的文本
    for (var i = 0; i < textNodes.snapshotLength; i++) {
        var node = textNodes.snapshotItem(i);

        // 匹配类似的文字
        var newText = node.nodeValue.replace(/http:\/\/www\.9dmsgame\.com\/forum\.php\?mod=viewthread&tid=(\d+)&page=1#pid\d+/g, 'http://www.9dmsgame.com/thread-$1-1-1.html');

        // 更新文本节点的值
        node.nodeValue = newText;
    }
})();

(function() {
    'use strict';

    // 获取所有符合条件的元素
    var elements = document.querySelectorAll('div[align="left"] > div[align="center"]');

    // 遍历符合条件的元素
    elements.forEach(function(element) {
        // 获取元素的文本内容
        var textContent = element.textContent.trim();

        // 检查是否已经包含 <font color="#[数字和字母]">...</font>
        var regex = /<font color="#[0-9a-fA-F]+">.*<\/font>/;
        if (!regex.test(textContent)) {
            // 检查内容是否匹配 http://www.9dmsgame.com/thread-[数字]-1-1.html 这样的形式
            regex = /http:\/\/www\.9dmsgame\.com\/thread-(\d+)-1-1\.html/;
            var match = textContent.match(regex);

            if (match) {
                var threadNumber = match[1];

                // 构造替换后的 HTML
                var newHTML = '<font color="#0000ee"><div align="left"><div align="center">' + textContent + '</div></div></font>';

                // 替换元素
                element.outerHTML = newHTML;
            }
        }
    });
})();


(function() {
    'use strict';

    // 获取所有带有特定链接的<a>元素
    var links = document.querySelectorAll('a[href*="www.9damaogame.net"][target="_blank"]');

    // 遍历替换链接
    links.forEach(function(link) {
        link.href = link.href.replace('www.9damaogame.net', 'www.9dmsgame.com');
    });
})();











