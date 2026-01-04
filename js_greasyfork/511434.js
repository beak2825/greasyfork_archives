// ==UserScript==
// @name         PikPak 番号重命名助手
// @name:en      PikPak JAV Renamer Assistant
// @name:ja      PikPak JAV リネームアシスタント
// @name:zh-CN   PikPak 番号重命名助手
// @namespace    https://github.com/CheerChen
// @version      0.8.0
// @description  Adds a rename button next to input field in PikPak rename dialog. Click the button to fetch information from AV-wiki and auto-rename files. Supports file extension preservation and optimized number format matching.
// @description:en Adds a rename button next to input field in PikPak rename dialog. Click the button to fetch information from AV-wiki and auto-rename files. Supports file extension preservation and optimized number format matching.
// @description:ja PikPakのリネームダイアログの入力フィールドの横にリネームボタンを追加します。ボタンをクリックしてAV-wikiから情報を取得し、ファイルを自動リネームします。ファイル拡張子の保護と最適化された番号形式マッチングをサポート。
// @description:zh-CN 在PikPak重命名对话框的输入框旁边添加重命名按钮。点击按钮从AV-wiki获取信息并自动重命名文件。支持文件扩展名保护和优化的番号格式匹配。
// @author       cheerchen37
// @match        *://*mypikpak.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      av-wiki.net
// @connect      api-drive.mypikpak.com
// @icon         https://www.google.com/s2/favicons?domain=mypikpak.com
// @license      MIT
// @homepage     https://github.com/CheerChen/userscripts
// @supportURL   https://github.com/CheerChen/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/511434/PikPak%20%E7%95%AA%E5%8F%B7%E9%87%8D%E5%91%BD%E5%90%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/511434/PikPak%20%E7%95%AA%E5%8F%B7%E9%87%8D%E5%91%BD%E5%90%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("脚本已加载");

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .pikpak-rename-btn {
            margin-left: 8px;
            background: transparent;
            border: none;
            color: #8c8c8c;
            width: 20px;
            height: 20px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            transition: all 0.2s ease;
            opacity: 0.7;
            flex-shrink: 0;
        }
        .pikpak-rename-btn:hover {
            background: rgba(0, 0, 0, 0.08);
            opacity: 1;
            color: #606266;
        }
        .pikpak-rename-btn:active {
            background: rgba(0, 0, 0, 0.12);
            transform: scale(0.95);
        }
        .pikpak-rename-btn:disabled {
            background: transparent;
            color: #c0c4cc;
            cursor: not-allowed;
            opacity: 0.5;
        }
        .pikpak-input-wrapper {
            display: flex;
            align-items: center;
        }
    `;
    document.head.appendChild(style);

    // 1. 定位到元素的部分
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.className === "el-dialog") {
                        handleDialog(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function handleDialog(node) {
        const input = node.querySelector('input.el-input__inner[type="text"]');
        if (!input) return;

        // 检查是否已经添加过按钮
        if (input.parentElement.parentElement.querySelector('.pikpak-rename-btn')) return;

        // 找到 el-input__wrapper 容器
        const inputWrapper = input.closest('.el-input__wrapper');
        if (!inputWrapper) return;

        // 添加包装器类名以便定位
        inputWrapper.parentElement.classList.add('pikpak-input-wrapper');

        // 创建重命名按钮
        const renameBtn = document.createElement('button');
        renameBtn.className = 'pikpak-rename-btn';
        renameBtn.innerHTML = '✨';
        renameBtn.title = '智能重命名';
        
        // 添加点击事件
        renameBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const originalValue = input.value;
            const keyword = extractKeyword(originalValue);
            
            if (!keyword) {
                console.log("未能提取有效关键字");
                alert("未能从文件名中提取有效的番号格式");
                return;
            }

            // 禁用按钮并显示加载状态
            renameBtn.disabled = true;
            renameBtn.innerHTML = '⋯';
            renameBtn.style.opacity = '0.5';
            
            queryAVwiki(keyword, input, originalValue, renameBtn);
        });

        // 将按钮添加到输入框容器的同级位置（右侧）
        inputWrapper.parentElement.appendChild(renameBtn);
    }

    // 2. 提取查询元素的部分
    function extractKeyword(text) {
        // 优化番号格式匹配，处理 3dsvr-0960 -> 3dsvr-960 的情况
        let match = text.match(/([a-zA-Z]+)-0*(\d+)/);
        if (match) {
            // 移除数字部分前面的0，但保留至少一位数字
            const cleanedNumber = match[2].replace(/^0+/, '') || '0';
            return `${match[1]}-${cleanedNumber}`;
        }
        
        // 尝试匹配包含字母和数字的模式，忽略后面的字符
        match = text.match(/([a-zA-Z]+)-(\d+)/);
        if (match) {
            return match[0];
        }
        
        // 处理没有连字符的情况，如 ABC0123 -> ABC-123
        match = text.match(/([a-zA-Z]+)0*(\d+)/);
        if (match) {
            const cleanedNumber = match[2].replace(/^0+/, '') || '0';
            return `${match[1]}-${cleanedNumber}`;
        }
        
        // 通用匹配
        match = text.match(/([a-zA-Z]{3,})(\d+)/);
        if (match) {
            return `${match[1]}-${match[2]}`;
        }

        return null;
    }

    // 3. 使用关键字查询AV-wiki的部分
    function queryAVwiki(keyword, input, originalValue, renameBtn) {
        console.log("keyword " + keyword);
        const encodedKeyword = encodeURIComponent(keyword);

        const url = `https://av-wiki.net/?s=${encodedKeyword}&post_type=product`;
        console.log("url " + url);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const listItems = doc.querySelectorAll('.post .archive-list .read-more a');
                const keywordRegex = new RegExp(keyword.match(/[a-zA-Z]+/)[0], 'i');
                // 查找第一个有效链接
                for (let item of listItems) {
                    if (item.href) {
                        if (!keywordRegex.test(item.href)){
                            continue;
                        }
                        const detailUrl = item.href;
                        console.log("detailUrl "+ detailUrl)
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: detailUrl,
                            onload: function(response) {
                                parseResponseWiki(response.responseText, input, originalValue, renameBtn);
                            },
                            onerror: function(error) {
                                console.log("详情页请求出错: ", error);
                                resetButton(renameBtn, "请求详情页错误");
                            }
                        });
                        return; // 找到有效链接后结束循环
                    }
                }
                // 如果没有找到有效链接，恢复按钮状态
                resetButton(renameBtn, "未找到匹配的番号");
            },
            onerror: function(error) {
                console.log("请求出错: ", error);
                resetButton(renameBtn, "网络请求错误");
            }
        });
    }

    // 4. 解析响应并更新输入框
    function parseResponseWiki(html, input, originalValue, renameBtn) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        // 尝试从meta标签中提取备选信息
        const ogTitle = doc.querySelector('.blockquote-like p');

        let name = ogTitle ? ogTitle.textContent : '未找到名称';

        // 清理名称中的特殊字符
        name = name.replace(/[\/:*?"<>|\x00-\x1F]/g, '_');
        
        // 检查原始值是否包含文件扩展名
        const extensionMatch = originalValue.match(/(\.[^.]+)$/);
        const extension = extensionMatch ? extensionMatch[1] : '';
        
        // 如果有扩展名，保留它；否则直接使用新名称
        input.value = extension ? `${name}${extension}` : `${name}`;
        triggerInputChange(input);
        
        // 恢复按钮状态
        resetButton(renameBtn, "重命名成功", true);
    }

    // 5. 重置按钮状态
    function resetButton(renameBtn, message, isSuccess = false) {
        renameBtn.disabled = false;
        renameBtn.innerHTML = '✨';
        renameBtn.style.opacity = '';
        
        if (message) {
            // 显示消息提示
            if (isSuccess) {
                console.log("重命名成功");
                // 成功时短暂显示对勾
                renameBtn.innerHTML = '✓';
                renameBtn.style.color = '#67c23a';
                setTimeout(() => {
                    renameBtn.innerHTML = '✨';
                    renameBtn.style.color = '';
                }, 1500);
            } else {
                console.log(message);
                alert(message);
            }
        }
    }

    // 6. 触发输入变化事件
    function triggerInputChange(element) {
        // 创建一个新的键盘事件
        var event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });

        element.value = element.value.trim(); // 移除空格
        element.dispatchEvent(event); // 再次触发input事件
    }
})();