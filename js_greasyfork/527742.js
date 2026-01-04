// ==UserScript==
// @name         腾讯元宝/谷歌ai/扣子文件盒子上传增强
// @namespace    https://gist.github.com/youzhiran/4fc8fa8a34c35c34ab455cd3f76d8236
// @version      1.5
// @description  粘贴或拖放时自动为代码文件添加.txt后缀并修正MIME类型，使其可正常上传。可能仍会提示不支持，但看到上传成功即可。目前选择上传方式尚未修改。
// @author       yooyi
// @match        *://yuanbao.tencent.com/*
// @match        *://aistudio.google.com/*
// @match        *://www.coze.cn/space/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527742/%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E8%B0%B7%E6%AD%8Cai%E6%89%A3%E5%AD%90%E6%96%87%E4%BB%B6%E7%9B%92%E5%AD%90%E4%B8%8A%E4%BC%A0%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/527742/%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E8%B0%B7%E6%AD%8Cai%E6%89%A3%E5%AD%90%E6%96%87%E4%BB%B6%E7%9B%92%E5%AD%90%E4%B8%8A%E4%BC%A0%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

// 1.5更新：移除元宝官方支持的语言

(function () {
    'use strict';

    const UNSUPPORTED_EXT = ['.dart', '.kt', '.html', '.scss',
        '.php', '.vbs', '.xml', '.cmd', '.rs', '.ts'];

    let eventsInitialized = false;

    function checkCozeCondition() {
        if (window.location.hostname.includes('www.coze.cn')) {
            const targetElement = document.querySelector('#semi-modal-body > div > div');
            if (targetElement && !eventsInitialized) {
                initDropEvent();
                eventsInitialized = true;
                return true;
            }
        } else if (
            (window.location.hostname.includes('yuanbao.tencent.com') ||
                window.location.hostname.includes('aistudio.google.com')) &&
            !eventsInitialized
        ) {
            initPasteEvent();
            initDropEvent();
            eventsInitialized = true;
            return true;
        }
        return false;
    }

    function initPasteEvent() {
        document.addEventListener('paste', handlePaste, true);
    }

    function initDropEvent() {
        document.addEventListener('drop', handleDrop, true);
    }

    function processFile(file) {
        const originalName = file.name;
        if (UNSUPPORTED_EXT.some(ext => originalName.toLowerCase().endsWith(ext))) {
            return new File([file], `${originalName}.txt`, {type: 'text/plain'});
        }
        return file;
    }

    function handlePaste(e) {
        const items = e.clipboardData.items;
        const files = [];
        let shouldModify = false;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const file = item.getAsFile();
                const processedFile = processFile(file);
                files.push(processedFile);
                if (processedFile !== file) shouldModify = true;
            }
        }

        if (shouldModify) {
            e.preventDefault();
            const newData = new DataTransfer();
            files.forEach(f => newData.items.add(f));

            const target = document.activeElement.closest('input, [contenteditable]') || document.activeElement;
            if (target instanceof HTMLInputElement) {
                target.files = newData.files;
            } else {
                const pasteEvent = new ClipboardEvent('paste', {
                    clipboardData: newData,
                    bubbles: true,
                    cancelable: true
                });
                target.dispatchEvent(pasteEvent);
            }
        }
    }

    function handleDrop(e) {
        // 检测脚本生成标记
        if (e.dataTransfer.types.includes('application/x-script-processed')) return;

        const items = e.dataTransfer.items;
        if (!items.length) return;

        const files = [];
        let shouldModify = false;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const file = item.getAsFile();
                const processedFile = processFile(file);
                files.push(processedFile);
                if (processedFile !== file) shouldModify = true;
            }
        }

        if (shouldModify) {
            e.preventDefault();
            e.stopPropagation();

            const newData = new DataTransfer();
            files.forEach(f => newData.items.add(f));
            newData.setData('application/x-script-processed', 'true'); // 添加标记

            // 创建完整拖放事件序列
            ['dragenter', 'dragover', 'drop'].forEach(eventName => {
                const event = new DragEvent(eventName, {
                    bubbles: true,
                    cancelable: true,
                    dataTransfer: newData
                });

                // 强制设置dataTransfer属性
                Object.defineProperty(event, 'dataTransfer', {
                    value: newData,
                    enumerable: true
                });

                e.target.dispatchEvent(event);
            });

            // 特殊处理文件输入
            if (e.target.tagName === 'INPUT' && e.target.type === 'file') {
                e.target.files = newData.files;
            }
        }
    }

    // 初始检测
    checkCozeCondition();

    // 动态监听（仅扣子需要）
    const observer = new MutationObserver(() => {
        if (!eventsInitialized) checkCozeCondition();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();