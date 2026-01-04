// ==UserScript==
// @name         扇贝单词额外发音快捷键
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  支持多个页面的发音快捷键：3/c单词发音，4例句发音，5/b真题例句发音
// @author       Jerry_zhao
// @match        https://web.shanbay.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525486/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E9%A2%9D%E5%A4%96%E5%8F%91%E9%9F%B3%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/525486/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E9%A2%9D%E5%A4%96%E5%8F%91%E9%9F%B3%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 多页面选择器配置
    const pageSelectors = {
        // 原单词页
        defaultPage: {
            word: 'div[class*="Pronounce_pronounce"] img',
            sentence: 'div[class*="BayTrans_example"] div[class*="index_right"] img',
            exam: 'div[class*="index_main"] div[class*="index_audio"] img'
        },
        // 新单词页
        altPage: {
            word: 'div[class*="index_audioWrap"] img[alt="trumpet"]'
        }
    };

    // 智能元素查找
    function findActiveElements() {
        return {
            // 优先查找默认页面的元素
            word: document.querySelector(pageSelectors.defaultPage.word) ||
                  document.querySelector(pageSelectors.altPage.word),

            // 仅默认页面需要以下元素
            sentence: document.querySelector(pageSelectors.defaultPage.sentence),
            exam: document.querySelector(pageSelectors.defaultPage.exam)
        };
    }

    // 统一快捷键处理
    function handleHotkeys(event) {
        const { word, sentence, exam } = findActiveElements();
        const key = event.key.toLowerCase();

        if (event.repeat) return;

        switch(key) {
            case '3':
            case 'c':
                word?.click();
                break;
            case '4':
                sentence?.click();
                break;
            case '5':
            case 'b':
                exam?.click();
                break;
        }
    }

    // 初始化监听
    function init() {
        document.removeEventListener('keydown', handleHotkeys);
        document.addEventListener('keydown', handleHotkeys);
        console.log('快捷键已更新');
    }

    // 页面加载后启动
    window.addEventListener('load', () => {
        setTimeout(init, 1500);

        new MutationObserver(() => {
            init();
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();