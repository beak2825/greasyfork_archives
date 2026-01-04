// ==UserScript==
// @name         Auto Copy and Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  模拟点击和复制，并切换标签页搜索
// @author       You
// @match        https://audi.wonderit.cn/#/pricetag/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513379/Auto%20Copy%20and%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/513379/Auto%20Copy%20and%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听键盘按键
    document.addEventListener('keydown', function(event) {
        if (event.key === "End") {  // 按下End键
            // 模拟鼠标点击
            simulateClick();
            // 延时操作，确保点击后才进行后续操作
            setTimeout(() => {
                // 运行 Ctrl+A 全选
                document.execCommand('selectAll', false, null);
                // 运行 Ctrl+C 复制
                document.execCommand('copy', false, null);

                // 模拟 Ctrl+Tab 切换标签页
                simulateCtrlTab();
                
                // 延时以确保标签页切换完成
                setTimeout(() => {
                    // 运行 Ctrl+F 打开搜索框
                    openFind();
                    // 运行 Ctrl+V 粘贴
                    pasteAndSearch();
                }, 500); // 500ms延时以确保操作顺序

            }, 200);  // 200ms延时以确保点击动作完成
        }
    });

    function simulateClick() {
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        document.dispatchEvent(event);
    }

    function simulateCtrlTab() {
        const ctrlTabEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Tab',
            ctrlKey: true
        });
        document.dispatchEvent(ctrlTabEvent);
    }

    function openFind() {
        const ctrlFEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'f',
            ctrlKey: true
        });
        document.dispatchEvent(ctrlFEvent);
    }

    function pasteAndSearch() {
        const ctrlVEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'v',
            ctrlKey: true
        });
        document.dispatchEvent(ctrlVEvent);

        setTimeout(() => {
            const enterEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter'
            });
            document.dispatchEvent(enterEvent);
        }, 100);  // 确保内容粘贴完成后再按下回车
    }
})();
