// ==UserScript==
// @name        域名复制助手
// @namespace   hsopenScript
// @version     1.2
// @description 按快捷键复制根域名并替换页面指定文本中的域名部分，支持顶部配置项自定义。
// @author      hsopen
// @license     GPLv3
// @match       *://*/*
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/541580/%E5%9F%9F%E5%90%8D%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541580/%E5%9F%9F%E5%90%8D%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*** 配置项 ***/
    const CONFIG = {
        hotkey: 'c', // 触发复制的快捷键，单个字符，小写，如 'c' 表示 Alt+C
        matchTemplate: '{copyright} {year} {域名}. All rights reserved.', // 页面中要全匹配的字符串模板
        replaceKey: '{域名}', // 要替换的字符串关键字
        tipDuration: 1500 // 提示显示时长，毫秒
    };

    // 创建顶部提示元素
    const tip = document.createElement('div');
    tip.style.position = 'fixed';
    tip.style.top = '10px';
    tip.style.left = '50%';
    tip.style.transform = 'translateX(-50%)';
    tip.style.padding = '5px 15px';
    tip.style.background = 'rgba(0,0,0,0.7)';
    tip.style.color = '#fff';
    tip.style.fontSize = '14px';
    tip.style.borderRadius = '4px';
    tip.style.zIndex = 999999;
    tip.style.pointerEvents = 'none';
    tip.style.opacity = '0';
    tip.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(tip);

    function showTip(text) {
        tip.textContent = text;
        tip.style.opacity = '1';
        clearTimeout(tip._timeout);
        tip._timeout = setTimeout(() => {
            tip.style.opacity = '0';
        }, CONFIG.tipDuration);
    }

    // 提取根域名函数，去除子域名和协议
    function getRootDomain(hostname) {
        const parts = hostname.split('.');
        if(parts.length <= 2) return hostname;
        const tlds2 = ['co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'net.uk'];
        const lastTwo = parts.slice(-2).join('.');
        if (tlds2.includes(lastTwo)) {
            return parts.slice(-3).join('.');
        }
        return lastTwo;
    }

    // 替换页面中完全匹配的文本节点里的指定关键字
    function replaceKeyInMatchedText(domain) {
        const targetTemplate = CONFIG.matchTemplate;
        const replaceKey = CONFIG.replaceKey;
        const treeWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while(node = treeWalker.nextNode()) {
            if(node.nodeValue.trim() === targetTemplate) {
                const replaced = node.nodeValue.replace(replaceKey, domain);
                node.nodeValue = replaced;
            }
        }
    }

    window.addEventListener('keydown', e => {
        if(e.altKey && e.key.toLowerCase() === CONFIG.hotkey){
            e.preventDefault();
            const hostname = window.location.hostname;
            const rootDomain = getRootDomain(hostname);
            GM_setClipboard(rootDomain);
            showTip(`已复制域名: ${rootDomain}`);
            replaceKeyInMatchedText(rootDomain);
        }
    });

})();
