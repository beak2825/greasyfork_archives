// ==UserScript==
// @name         TY数据生产平台
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  数据生产平台操作，用于自动点击弹窗中的"保存"和"删除"按钮
// @author       ZhouFei
// @match        http://172.31.60.204:8889/esjgc/platform/console/main.htm
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510525/TY%E6%95%B0%E6%8D%AE%E7%94%9F%E4%BA%A7%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/510525/TY%E6%95%B0%E6%8D%AE%E7%94%9F%E4%BA%A7%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 打印调试信息
    function debugLog(message) {
        console.log(`[DEBUG] ${message}`);
    }

    // 查找并点击保存按钮
    function clickSaveButton() {
        const saveButton = document.querySelector('#bchztx'); // 选择“保存”按钮
        if (saveButton) {
            debugLog('找到保存按钮，等待 1 秒后点击...');
            setTimeout(() => {
                saveButton.click(); // 模拟点击保存按钮
                debugLog('已点击保存按钮');
            }, 500); // 1秒延迟
        } else {
            debugLog('未找到保存按钮');
        }
    }

    // 查找并点击删除按钮
    function clickDeleteButton() {
        const deleteButton = document.querySelector('[title="删除"]'); // 选择“删除”按钮
        if (deleteButton) {
            debugLog('找到删除按钮，等待 1 秒后点击...');
            setTimeout(() => {
                deleteButton.click(); // 模拟点击删除按钮
                debugLog('已点击删除按钮');
            }, 500); // 1秒延迟
        } else {
            debugLog('未找到删除按钮');
        }
    }

    // 检查是否有保存弹窗
    function checkSaveModal() {
        const saveModal = document.querySelector('div.panel.window'); // 选择保存弹窗的特征元素
        if ((saveModal) && saveModal.style.display === 'block'){
            debugLog('检测到保存弹窗');
            clickSaveButton(); // 检测到弹窗后执行保存操作
        } else {
            debugLog('未检测到保存弹窗');

        }
    }

    // 检查是否有删除弹窗
    function checkDeleteModal() {
        const deleteModal = document.querySelector('div.esriPopupWrapper'); // 选择删除弹窗的特征元素
        if (deleteModal && deleteModal.style.display === 'block') {
            debugLog('检测到删除弹窗');
            clickDeleteButton(); // 检测到弹窗后执行删除操作
        }else {
            debugLog('未检测到删除弹窗');
        }
    }

    // 观察DOM变化，检测弹窗
    function observeDOMChanges() {
        const observer = new MutationObserver(() => {
            setTimeout (() => {
            setInterval(checkSaveModal, 1000); // 每500毫秒检查一次
            setInterval(checkDeleteModal, 1000) // 每500毫秒检查一次
            }, 10);
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
    // 脚本初始化
    function init() {
        debugLog('脚本已启动，开始监听弹窗...');
        observeDOMChanges();  // 监听DOM变化
    }

    init(); // 执行初始化函数
})();
