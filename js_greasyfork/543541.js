// ==UserScript==
// @name         最新百度翻译广告拦截
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  根据规则拦截百度翻译网站的广告
// @author       你
// @match        https://fanyi.baidu.com/*
// @grant        none
// @license      mark
// @downloadURL https://update.greasyfork.org/scripts/543541/%E6%9C%80%E6%96%B0%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/543541/%E6%9C%80%E6%96%B0%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储规则中的CSS选择器
    const cssSelectors = [
        '.qphmPPyw',
        '.MMqloUXF',
        '.ZqJhu4sT',
        '.UzOvH9bK',
        '.Hu5qsRSB',
        '.YQQQIg6B',
        '.Ooum_5hT',
        'div.ant-tabs-tab:nth-of-type(6)',
        'div.ant-tabs-tab:nth-of-type(5)',
        'div.ant-tabs-tab:nth-of-type(4)',
        'div.ant-tabs-tab:nth-of-type(3)',
        'div.ant-tabs-tab:nth-of-type(2)',
        '.lTKZuXrx',
        '.DzKgtddY'
    ];

    // 存储需要拦截的图片URL
    const blockedImages = [
        'fanyi-cdn.cdn.bcebos.com/static/cat/asset/logo.b10defd4.png'
    ];

    // 动态创建CSS样式表，用于隐藏匹配的元素
    function createStyleSheet() {
        const style = document.createElement('style');
        style.type = 'text/tailwindcss';
        document.head.appendChild(style);
        
        // 添加ABlock规则中的CSS选择器
        const cssRules = cssSelectors.map(selector => `${selector} { display: none !important; }`).join('\n');
        style.textContent = cssRules;
        
        return style;
    }

    // 拦截图片加载
    function blockImages() {
        // 检查所有图片元素
        document.querySelectorAll('img').forEach(img => {
            if (blockedImages.some(url => img.src.includes(url))) {
                img.remove();
            }
        });
        
        // 监听DOM变化，处理新添加的图片
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.tagName === 'IMG') {
                            if (blockedImages.some(url => node.src.includes(url))) {
                                node.remove();
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        createStyleSheet();
        blockImages();
    });
})();