// ==UserScript==
// @name         GitHub镜像加速
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  将页面中显示的和链接中的github.con替换为你的镜像github域名
// @author       鲨光狗罕见
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528408/GitHub%E9%95%9C%E5%83%8F%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/528408/GitHub%E9%95%9C%E5%83%8F%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义要替换的旧域名和新域名
    const oldDomain = 'github.com';
    const newDomain = 'bgithub.xyz';

    // 替换文本中的域名
    function replaceTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.nodeValue.includes(oldDomain)) {
                node.nodeValue = node.nodeValue.replace(new RegExp(oldDomain, 'g'), newDomain);
            }
        } else {
            for (const childNode of node.childNodes) {
                replaceTextNodes(childNode);
            }
        }
    }

    // 替换链接的href属性
    function replaceHrefAttributes(link) {
        if (link.href && link.href.includes(oldDomain)) {
            link.href = link.href.replace(oldDomain, newDomain);
        }
    }

    // 初始化替换
    function initReplace() {
        // 替换所有文本节点
        replaceTextNodes(document.body);

        // 替换所有链接的href属性
        const links = document.getElementsByTagName('a');
        for (const link of links) {
            replaceHrefAttributes(link);
        }
    }

    // 页面加载完成后初始化替换
    initReplace();

    // 监控页面动态变化
    const observer = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 替换新添加的文本节点
                        replaceTextNodes(node);

                        // 替换新添加的链接
                        if (node.tagName === 'A') {
                            replaceHrefAttributes(node);
                        } else if (node.getElementsByTagName) {
                            const links = node.getElementsByTagName('a');
                            for (const link of links) {
                                replaceHrefAttributes(link);
                            }
                        }
                    }
                }
            }
        }
    });

    // 监控document.body及其子节点的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
