// ==UserScript==
// @name         搜索引擎键盘翻页助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为主流搜索引擎添加键盘左右方向键翻页功能
// @author       Your name
// @match        *://www.google.com/search*
// @match        *://www.google.com.*/search*
// @match        *://www.baidu.com/*
// @match        *://cn.bing.com/search*
// @match        *://www.bing.com/search*
// @match        *://www.sogou.com/web*
// @match        *://www.so.com/s*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530721/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530721/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 搜索引擎配置
    const engineConfig = {
        google: {
            host: ['www.google.com', 'www.google.com.hk', 'www.google.com.tw'],
            prevSelector: '#pnprev',
            nextSelector: '#pnnext'
        },
        baidu: {
            host: ['www.baidu.com'],
            prevSelector: '.page-inner_2jZi2 a:first-child',
            nextSelector: '.page-inner_2jZi2 a:last-child',
            prevText: '上一页',
            nextText: '下一页'
        },
        bing: {
            host: ['cn.bing.com', 'www.bing.com'],
            prevSelector: '.sb_pagP',
            nextSelector: '.sb_pagN'
        },
        sogou: {
            host: ['www.sogou.com'],
            prevSelector: 'a.p[id^="sogou_page_"][href*="&page="]',
            nextSelector: 'a.n[id^="sogou_next_"]'
        },
        so360: {
            host: ['www.so.com'],
            prevSelector: 'a.pn-prev',
            nextSelector: 'a.pn-next'
        }
    };

    // 获取当前搜索引擎
    function getCurrentEngine() {
        const hostname = window.location.hostname;
        for (let engine in engineConfig) {
            if (engineConfig[engine].host.includes(hostname)) {
                return engineConfig[engine];
            }
        }
        return null;
    }

    // 点击元素
    function clickElement(selector, textMatch = null) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return false;

        let targetElement = elements[0];
        
        if (textMatch) {
            for (let element of elements) {
                if (element.textContent.includes(textMatch)) {
                    targetElement = element;
                    break;
                }
            }
        }

        if (targetElement) {
            targetElement.click();
            return true;
        }
        return false;
    }

    // 键盘事件处理
    function handleKeyPress(event) {
        // 如果用户正在输入框中，不处理翻页
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        const engine = getCurrentEngine();
        if (!engine) return;

        // 左方向键：上一页
        if (event.keyCode === 37) {
            if (engine.prevText) {
                clickElement(engine.prevSelector, engine.prevText);
            } else {
                clickElement(engine.prevSelector);
            }
            event.preventDefault();
        }
        // 右方向键：下一页
        else if (event.keyCode === 39) {
            if (engine.nextText) {
                clickElement(engine.nextSelector, engine.nextText);
            } else {
                clickElement(engine.nextSelector);
            }
            event.preventDefault();
        }
    }

    // 添加键盘事件监听
    document.addEventListener('keydown', handleKeyPress);

    // 调试信息
    const engine = getCurrentEngine();
    if (engine) {
        console.log('搜索引擎键盘翻页助手已启用');
    }
})();