// ==UserScript==
// @name         只显示中文翻译
// @namespace    https://greasyfork.org/zh-CN/users/1361855-fourth-master
// @version      1.0
// @description  一个移除subtitlecat字幕网站的其他语言翻译只显示中文翻译的的脚本
// @author       Fourth_Master
// @match        https://www.subtitlecat.com/subs/*
// @grant        none
// @license         GNU General Public License v3.0 or later
// @namespace       https://greasyfork.org/scripts/531977
// @supportURL      https://greasyfork.org/scripts/531977
// @homepageURL     https://greasyfork.org/scripts/531977
// @downloadURL https://update.greasyfork.org/scripts/531977/%E5%8F%AA%E6%98%BE%E7%A4%BA%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/531977/%E5%8F%AA%E6%98%BE%E7%A4%BA%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }

    function initScript() {

        try {
            // 创建一个MutationObserver来监视DOM变化
            const observer = new MutationObserver((mutations) => {
                removeTranslationDivs();
            });

            // 配置observer
            const config = {
                childList: true,
                subtree: true
            };

            // 开始观察
            observer.observe(document.body, config);

            // 初始执行一次
            removeTranslationDivs();
        } catch (error) {
            console.error('初始化脚本时发生错误:', error);
        }
    }

    // 移除翻译div的主函数
    function removeTranslationDivs() {
        const divs = document.querySelectorAll('div.col-md-6.col-lg-4');
        divs.forEach(div => {
            // 检查div内部是否包含特定结构
            if (div.querySelector('.sub-single') &&
                div.querySelector('img.flag') &&
                (div.querySelector('.green-link') || div.querySelector('#voting_') || div.querySelector('.yellow-link'))) {
                // 检查是否包含"Chinese (Simplified)"文本
                const hasChineseText = Array.from(div.querySelectorAll('span')).some(span =>
                    span.textContent.includes('Chinese (Simplified)'));
                if (!hasChineseText) {
                    div.remove();
                    console.log('已移除非中文翻译div:', div.textContent);
                }
            }
        });
    }

    // 初始执行一次
    removeTranslationDivs();
})();