// ==UserScript==
// @name         AI内容语音合成（通用版）
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  监视并捕获最新的AI生成内容，并转换为语音，优化文本提取
// @author       Your Name
// @match        https://neoosyveiiby.bja.sealos.run/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512473/AI%E5%86%85%E5%AE%B9%E8%AF%AD%E9%9F%B3%E5%90%88%E6%88%90%EF%BC%88%E9%80%9A%E7%94%A8%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/512473/AI%E5%86%85%E5%AE%B9%E8%AF%AD%E9%9F%B3%E5%90%88%E6%88%90%EF%BC%88%E9%80%9A%E7%94%A8%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

/* MIT License

Copyright (c) 2024 ggwk api

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // 创建控制面板
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #f0f0f0;
        padding: 10px;
        border-radius: 5px;
        z-index: 9999;
    `;

    // 创建角色选择下拉框
    const select = document.createElement('select');
    const characters = ["丁真", "AD学姐", "赛马娘", "黑手", "蔡徐坤", "孙笑川", "邓紫棋", "东雪莲", "塔菲", "央视配音", "流萤", "郭德纲", "雷军", "周杰伦", "懒洋洋", "女大学生", "烧姐姐", "麦克阿瑟", "马老师", "孙悟空", "海绵宝宝", "光头强", "陈泽", "村民", "猪猪侠", "猪八戒", "薛之谦", "大司马", "刘华强", "特朗普", "满穗", "桑帛", "李云龙", "卢本伟", "pdd", "tvb", "王者语音播报", "爱莉希雅", "岳山", "妖刀姬", "少萝宝宝", "天海", "王者耀", "蜡笔小新", "琪", "茉莉", "蔚蓝档案桃井", "胡桃", "磊哥游戏", "洛天依", "派大星", "章鱼哥", "蔚蓝档案爱丽丝", "阿梓", "科比", "于谦老师", "嘉然", "乃琳", "向晚", "优优", "茶总", "小然", "泽北", "夯大力", "奶龙"];
    characters.forEach(char => {
        const option = document.createElement('option');
        option.value = char;
        option.textContent = char;
        select.appendChild(option);
    });
    panel.appendChild(select);

    // 创建音频元素
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.style.display = 'none';
    panel.appendChild(audio);

    // 创建状态显示元素
    const statusElement = document.createElement('div');
    statusElement.style.marginTop = '10px';
    panel.appendChild(statusElement);

    // 将面板添加到页面
    document.body.appendChild(panel);

    // 创建悬浮按钮
    const floatingButton = document.createElement('button');
    floatingButton.textContent = '语音合成';
    floatingButton.style.cssText = `
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: -30px;
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        display: none;
        z-index: 1000;
    `;

    // 监听页面变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查新添加的元素是否是AI的聊天消息
                        const messageElement = node.querySelector('.chat_chat-message-item__dKqMl:not(.chat_chat-message-user__ZtTEj)');
                        if (messageElement) {
                            // 为新的AI聊天消息添加悬浮按钮和事件监听
                            addFloatingButtonToMessage(messageElement);
                        }
                    }
                });
            }
        });
    });

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察整个文档
    observer.observe(document.body, config);

    function addFloatingButtonToMessage(messageElement) {
        const newFloatingButton = floatingButton.cloneNode(true);
        messageElement.style.position = 'relative';
        messageElement.appendChild(newFloatingButton);

        messageElement.addEventListener('mouseenter', () => {
            newFloatingButton.style.display = 'block';
        });

        messageElement.addEventListener('mouseleave', () => {
            newFloatingButton.style.display = 'none';
        });

        newFloatingButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const content = extractTextContent(messageElement);
            synthesizeSpeech(content);
        });
    }

    function extractTextContent(element) {
        // 创建一个元素的克隆，这样我们可以安全地修改它
        const clone = element.cloneNode(true);
        
        // 移除克隆元素中的所有按钮
        const buttons = clone.getElementsByTagName('button');
        while (buttons.length > 0) {
            buttons[0].parentNode.removeChild(buttons[0]);
        }
        
        // 获取清理后的文本内容
        return clone.textContent.trim();
    }

    function synthesizeSpeech(text) {
        const selectedCharacter = select.value;
        const apiUrl = `https://api.lolimi.cn/API/yyhc/api.php?msg=${encodeURIComponent(text)}&sp=${encodeURIComponent(selectedCharacter)}`;
        
        statusElement.textContent = '正在合成语音...';
        audio.style.display = 'none';

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            responseType: "json",
            onload: function(response) {
                if (response.status === 200) {
                    const data = response.response;
                    if (data.code === 200 && data.mp3) {
                        audio.src = data.mp3;
                        audio.style.display = 'block';
                        audio.play();
                        statusElement.textContent = '语音合成成功';
                    } else {
                        statusElement.textContent = `合成失败: ${data.message || '未知错误'}`;
                    }
                } else {
                    statusElement.textContent = '语音合成请求失败';
                }
            },
            onerror: function(error) {
                statusElement.textContent = '请求失败：' + error.message;
            }
        });
    }
})();