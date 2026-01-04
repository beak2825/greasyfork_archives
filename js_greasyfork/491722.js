// ==UserScript==
// @name         恢复河北工程大学E2E平台粘贴功能
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  恢复河北工程大学E2E平台的粘贴功能
// @author       SakuyaAyane
// @match        http://www.huejsj.online:808/*
// @match        http://39.101.206.248:808/*
// @match        http://39.101.206.248:808/student/stuquizPro.aspx
// @match        http://39.101.206.248:808/student/ProgramExercise30.aspx
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491722/%E6%81%A2%E5%A4%8D%E6%B2%B3%E5%8C%97%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6E2E%E5%B9%B3%E5%8F%B0%E7%B2%98%E8%B4%B4%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/491722/%E6%81%A2%E5%A4%8D%E6%B2%B3%E5%8C%97%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6E2E%E5%B9%B3%E5%8F%B0%E7%B2%98%E8%B4%B4%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 恢复整个页面的粘贴功能
    document.addEventListener('paste', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var text = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    }, true); // 使用捕获阶段

    // 恢复整个页面的拖放功能
    document.addEventListener('drop', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        if (files.length > 0) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.activeElement.value = e.target.result;
            };
            reader.readAsText(files[0]);
        }
    }, true); // 使用捕获阶段

        // 恢复右键菜单
    document.oncontextmenu = null;

    // 恢复拖拽事件
    document.ondragover = null;
    document.ondragend = null;

    // 恢复粘贴事件
    document.onpaste = null;

    // 恢复键盘事件
    document.onkeydown = null;

    document.addEventListener('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, true); // 使用捕获阶段

        // 重写 checkTextbox 函数
    window.checkTextbox = function() {
    };
        // 幽默平台 写平台的人是不写代码吗？ 没代码高亮还不让粘贴 写你🐎啊


    // 移除可能阻止粘贴的任何事件监听器
    window.removeEventListener('paste', function(e) { e.preventDefault(); }, true); // 使用捕获阶段

    // 移除可能阻止粘贴的任何元素的属性
    var elements = document.querySelectorAll('*');
    elements.forEach(function(element) {
        element.style.pointerEvents = 'auto';
        element.style.userSelect = 'auto';
    });

    // 尝试恢复文本框的粘贴功能
    var textareas = document.querySelectorAll('textarea');
    textareas.forEach(function(textarea) {
        textarea.removeAttribute('readonly');
        textarea.removeAttribute('onpaste');
    });

    var inputs = document.querySelectorAll('input');
    inputs.forEach(function(input) {
        input.removeAttribute('readonly');
        input.removeAttribute('onpaste');
    });

    // 创建一个新的div元素
    var statusDiv = document.createElement('div');
    statusDiv.id = 'pasteStatusDiv';
    statusDiv.style.position = 'fixed';
    statusDiv.style.bottom = '0';
    statusDiv.style.right = '0';
    statusDiv.style.padding = '10px';
    statusDiv.style.backgroundColor = '#f8f8f8';
    statusDiv.style.border = '1px solid #ddd';
    statusDiv.style.borderRadius = '5px 0 0 0';
    statusDiv.style.zIndex = '9999';

    // 设置初始状态文本
    statusDiv.textContent = '脚本正在运行，粘贴功能已恢复。By SakuyaAyane';

    // 将div添加到页面中
    document.body.appendChild(statusDiv);

    // 更新状态文本
    function updateStatus(text) {
        statusDiv.textContent = text;
    }
})();