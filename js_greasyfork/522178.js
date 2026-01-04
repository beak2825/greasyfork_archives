// ==UserScript==
// @name         夜间模式Dark中二维码空白的补丁
// @description  chrome edge等夜间模式Dark中二维码空白的补丁
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2024-12-29
// @author       Ghini
// @match        https://bewildcard.com/card
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bewildcard.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522178/%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8FDark%E4%B8%AD%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%A9%BA%E7%99%BD%E7%9A%84%E8%A1%A5%E4%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/522178/%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8FDark%E4%B8%AD%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%A9%BA%E7%99%BD%E7%9A%84%E8%A1%A5%E4%B8%81.meta.js
// ==/UserScript==
// 可以使用 @match *://*/* 来匹配所有网站
(function () {
    'use strict';

    function modifySVGFill(element) {
        try {
            const paths = element.querySelectorAll('path');
            let modifiedCount = 0;

            paths.forEach(path => {
                const fill = path.getAttribute('fill');
                if (fill === '#000000' || fill === '#000' || fill === 'rgb(0,0,0)') {
                    path.setAttribute('fill', '#888');
                    modifiedCount++;
                }
            });

            if (modifiedCount > 0) {
                console.log(`[SVG Modifier] 已修改 ${modifiedCount} 个 path 的 fill 属性`);
            }
        } catch (error) {
            console.error('[SVG Modifier] 修改 SVG 时发生错误:', error);
        }
    }

    function initScript() {
        try {
            console.log("[SVG Modifier] 正在初始化...");

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.tagName === 'svg') {
                                modifySVGFill(node);
                            } else if (node.querySelector && node.querySelector('svg')) {
                                node.querySelectorAll('svg').forEach(svg => modifySVGFill(svg));
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 处理现有的 SVG
            document.querySelectorAll('svg').forEach(svg => modifySVGFill(svg));

            console.log("[SVG Modifier] 初始化完成，正在监控 SVG 变化");
        } catch (error) {
            console.error("[SVG Modifier] 初始化失败:", error);
        }
    }

    // 确保 DOM 加载完成后再初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
})();