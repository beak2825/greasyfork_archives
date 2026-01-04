// ==UserScript==
// @name         复制小红书搜索结果链接
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为小红书搜索结果页添加一个按钮，用于复制前10个链接
// @author       阿巴阿巴阿巴
// @match        https://www.xiaohongshu.com/search_result*
// @icon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474904/%E5%A4%8D%E5%88%B6%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/474904/%E5%A4%8D%E5%88%B6%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function addButtonIfNotExists() {
        if (document.querySelector('.custom-copy-button')) {
            return;  // 如果按钮已经存在，则直接返回
        }

        // 使用两个XPath来定位按钮应该插入的位置
        const xPaths = [
            "//*[@id='app']/div[1]/div[2]/div[2]/div/div[1]/div[1]/div/div",
            "//*[@id='app']/div[1]/div[2]/div[2]/div/div[1]/div[1]/div/div[2]"
        ];

        let insertPosition;

        for (let path of xPaths) {
            insertPosition = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (insertPosition) break;
        }

        if (!insertPosition) {
            console.error('两个指定的XPath位置都未找到，按钮未被添加');
            return;
        }

        // 创建复制按钮
        let btn = document.createElement('button');
        btn.className = 'custom-copy-button';
        btn.textContent = '复制前10个链接';
        btn.style.marginLeft = '10px';
        btn.style.padding = "5px 10px";
        btn.style.background = "#FF4757";
        btn.style.color = "white";
        btn.style.borderRadius = "5px";
        btn.style.border = "none";
        btn.style.cursor = "pointer";

        // 在指定位置后插入按钮
        if (insertPosition.nextSibling) {
            insertPosition.parentNode.insertBefore(btn, insertPosition.nextSibling);
        } else {
            insertPosition.parentNode.appendChild(btn);
        }

        btn.onclick = function() {
            // 使用XPath获取前10个链接
            let linksXpath = "//section[contains(@class, 'note-item')]//a[contains(@class, 'cover')]/@href";
            let links = document.evaluate(linksXpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            let urls = [];
            for (let i = 0; i < Math.min(10, links.snapshotLength); i++) {
                urls.push("https://www.xiaohongshu.com" + links.snapshotItem(i).nodeValue);
            }

            // 复制到剪切板
            let textarea = document.createElement('textarea');
            textarea.textContent = urls.join('\n');
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('已复制' + urls.length + '个链接！');
        };
    }

    function initializeScript() {
        addButtonIfNotExists();

        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    addButtonIfNotExists();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeScript();
    } else {
        document.addEventListener('DOMContentLoaded', initializeScript);
    }

})();