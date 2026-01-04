// ==UserScript==
// @name         DisableNewTabJump 禁止网站自动打开新标签页
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  阻止某些网站www.example.com、xfuliji.com 自动打开新标签页和弹出窗口, 请在脚本设置中新增用户匹配的网址或编辑源代码@match中新增填写需要阻止的域名或匹配正则表达式 Block some websites www.example.com, xfuliji.com automatically open new tabs and popup windows, please add the user match URL in the script settings or edit the source code @match to fill in the domain name to be blocked or match the regular expression
// @author       kula
// @match        *://www.example.com/*
// @match        *://*.xfuliji.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525874/DisableNewTabJump%20%E7%A6%81%E6%AD%A2%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/525874/DisableNewTabJump%20%E7%A6%81%E6%AD%A2%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 阻止通过 window.open 打开新窗口
    window.open = function () {
        return null;
    };

    // 阻止所有带有 target="_blank" 的链接
    document.addEventListener(
        'click',
        function (e) {
            let target = e.target.closest('a[target="_blank"]');
            if (target) {
                e.preventDefault();
                target.target = '_self';
                // 如果需要保持链接功能，可以手动跳转
                window.location.href = target.href;
            }
        },
        true
    ); // 使用捕获阶段确保尽早拦截

    // 阻止通过 middle click（中键点击）打开新标签页
    document.addEventListener(
        'auxclick',
        function (e) {
            if (e.button === 1 && e.target.closest('a')) {
                e.preventDefault();
            }
        },
        true
    );

    // 针对动态加载内容的 MutationObserver
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    // 元素节点
                    const links = node.querySelectorAll ? node.querySelectorAll('a[target="_blank"]') : [];
                    links.forEach((link) => {
                        link.target = '_self';
                    });
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
