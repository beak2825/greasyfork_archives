// ==UserScript==
// @name         京东一键保价自动点击（简化版）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  检测并自动点击京东一键保价按钮（仅点击一次）
// @author       YourName
// @match        https://h5.m.jd.com/pb/016454810/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537938/%E4%BA%AC%E4%B8%9C%E4%B8%80%E9%94%AE%E4%BF%9D%E4%BB%B7%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%EF%BC%88%E7%AE%80%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/537938/%E4%BA%AC%E4%B8%9C%E4%B8%80%E9%94%AE%E4%BF%9D%E4%BB%B7%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%EF%BC%88%E7%AE%80%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 一键保价按钮选择器
    const PRICE_PROTECT_BUTTON_SELECTORS = [
        '#one-btn',                     // 优先使用你提供的ID
        'button:contains("一键价保")',   // 文本匹配
        'button:contains("一键保价")',
        '.price-protect-btn'             // 类选择器
    ];

    // 只执行一次标志
    let hasClicked = false;

    function clickPriceProtectButton() {
        if (hasClicked) return;
        
        // 尝试查找按钮
        const button = findClickableButton(PRICE_PROTECT_BUTTON_SELECTORS);
        
        if (button) {
            console.log('找到一键保价按钮，1秒后点击...');
            setTimeout(() => {
                button.click();
                console.log('一键保价按钮已点击');
                hasClicked = true;
            }, 1000); // 等待1秒后点击
        } else {
            console.log('未找到一键保价按钮');
        }
    }

    // 通用按钮查找函数
    function findClickableButton(selectors) {
        for (const selector of selectors) {
            let button = null;
            
            // 先尝试CSS选择器
            button = document.querySelector(selector);
            
            // 如果没找到且是ID选择器，尝试XPath
            if (!button && selector.startsWith('#')) {
                const xpath = `//*[@id="${selector.replace('#', '')}"]`;
                const result = document.evaluate(
                    xpath, document, null, 
                    XPathResult.FIRST_ORDERED_NODE_TYPE, null
                );
                button = result.singleNodeValue;
            }
            
            // 检查按钮是否可用
            if (button && !button.disabled && 
                button.offsetWidth > 0 && 
                button.offsetHeight > 0) {
                return button;
            }
        }
        return null;
    }

    // 页面加载完成后开始检测
    if (document.readyState === 'complete') {
        clickPriceProtectButton();
    } else {
        window.addEventListener('load', clickPriceProtectButton);
    }

    // 额外添加MutationObserver监听DOM变化
    const observer = new MutationObserver(() => {
        if (!hasClicked) {
            clickPriceProtectButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();