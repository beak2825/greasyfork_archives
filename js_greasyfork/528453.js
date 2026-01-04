// ==UserScript==
// @name         Google & Bing 屏蔽CSDN搜索结果
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  屏蔽CSDN搜索结果
// @author       YourName
// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.bing.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528453/Google%20%20Bing%20%E5%B1%8F%E8%94%BDCSDN%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/528453/Google%20%20Bing%20%E5%B1%8F%E8%94%BDCSDN%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义屏蔽规则（支持正则匹配）
    const blockList = [
        /csdn\.net/i,  // 屏蔽CSDN
        /csdnimg\.cn/i,
        /cloud\.baidu\.com/i,
        // 可追加其他网站，如：/jianshu\.com/i
    ];
    // 定义选择器：每个引擎对应一个数组
    const selectors = {
        google: ['.g'],
        bing: ['.b_ans ','.b_algo', '.b_wpt_bl','.slide'],
        baidu: ['.result'],
    };

    // 检测当前搜索引擎
    const host = window.location.hostname;
    let engine = '';
    if (host.includes('google')) engine = 'google';
    else if (host.includes('bing')) engine = 'bing';
    else if (host.includes('baidu')) engine = 'baidu';

    // 隐藏匹配的搜索结果
    const hideCSDN = () => {
        if (!selectors[engine]) return;
        const queryStr = selectors[engine].join(', ');
        const items = document.querySelectorAll(queryStr);
        items.forEach(item => {
            let link = '';
            if (engine === 'bing') {
                // Bing 特殊处理 .b_wpt_bl，链接可能在 cite 或 a 标签中
                link = item.querySelector('cite')?.innerText || item.querySelector('a')?.href || '';
            } else {
                link = item.querySelector('a')?.href || '';
            }
            if (blockList.some(regex => regex.test(link))) {
                item.remove();
            }
        });
    };

    // 监听页面变化（应对无限滚动加载）
    new MutationObserver(hideCSDN).observe(
        document.body,
        { childList: true, subtree: true }
    );

    // 初始执行
    hideCSDN();
})();