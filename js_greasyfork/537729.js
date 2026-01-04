// ==UserScript==
// @name         实时文字转语音
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将选中的文字实时转换为语音
// @author       liangcecool
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537729/%E5%AE%9E%E6%97%B6%E6%96%87%E5%AD%97%E8%BD%AC%E8%AF%AD%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/537729/%E5%AE%9E%E6%97%B6%E6%96%87%E5%AD%97%E8%BD%AC%E8%AF%AD%E9%9F%B3.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2024 [liangcecool]
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

    // 创建语音合成对象
    const synth = window.speechSynthesis;
    let currentUtterance = null;

    // 创建固定悬浮窗
    function createFloatingPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #4CAF50;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            padding: 0;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
            opacity: 0.7;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // 图标
        const icon = document.createElement('div');
        icon.innerHTML = '🔊';
        icon.style.cssText = `
            font-size: 24px;
            user-select: none;
            filter: grayscale(0);
            transition: all 0.3s ease;
        `;
        panel.appendChild(icon);

        // 完整界面容器
        const fullPanel = document.createElement('div');
        fullPanel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 320px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            padding: 15px;
            font-family: Arial, sans-serif;
            display: none;
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.3s ease;
        `;

        // 拖动功能变量
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // 贴边隐藏功能变量
        let isHidden = false;
        const EDGE_THRESHOLD = 10; // 贴边检测阈值
        const HIDDEN_OFFSET = -30; // 隐藏时的偏移量（图标模式下只需要隐藏一半）

        // 标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        `;
        
        const title = document.createElement('div');
        title.textContent = '文字转语音';
        title.style.cssText = `
            font-weight: bold;
            font-size: 16px;
            color: #333;
            user-select: none;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 0 5px;
            color: #666;
            line-height: 1;
        `;
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        fullPanel.appendChild(header);

        // 内容区域
        const content = document.createElement('div');
        content.style.cssText = `
            display: block;
        `;

        // 文本输入框
        const textarea = document.createElement('textarea');
        textarea.placeholder = '输入要朗读的文字，或选中网页文字后点击"朗读选中"';
        textarea.style.cssText = `
            width: 100%;
            height: 100px;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 8px;
            resize: vertical;
            font-size: 14px;
            box-sizing: border-box;
            margin-bottom: 10px;
        `;

        // 控制按钮区域
        const controls = document.createElement('div');
        controls.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        `;

        const playBtn = document.createElement('button');
        playBtn.textContent = '▶ 朗读';
        playBtn.style.cssText = `
            flex: 1;
            padding: 8px 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        const stopBtn = document.createElement('button');
        stopBtn.textContent = '■ 停止';
        stopBtn.style.cssText = `
            flex: 1;
            padding: 8px 16px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        const readSelectedBtn = document.createElement('button');
        readSelectedBtn.textContent = '📝 朗读选中';
        readSelectedBtn.style.cssText = `
            flex: 1;
            padding: 8px 16px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        controls.appendChild(playBtn);
        controls.appendChild(stopBtn);
        controls.appendChild(readSelectedBtn);

        // 语言选择
        const langSelect = document.createElement('select');
        langSelect.style.cssText = `
            width: 100%;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            margin-bottom: 10px;
        `;
        
        const languages = [
            { value: 'zh-CN', text: '中文' },
            { value: 'en-US', text: 'English' },
            { value: 'ja-JP', text: '日本語' },
            { value: 'ko-KR', text: '한국어' }
        ];
        
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.value;
            option.textContent = lang.text;
            langSelect.appendChild(option);
        });

        // 组装内容区域
        content.appendChild(textarea);
        content.appendChild(controls);
        content.appendChild(langSelect);
        fullPanel.appendChild(content);

        // 添加完整面板到页面
        document.body.appendChild(fullPanel);

        // 最小化功能
        let isMinimized = true;  // 默认为最小化状态（图标模式）
        
        // 鼠标悬停效果（图标模式）
        panel.addEventListener('mouseenter', () => {
            if (isMinimized) {
                panel.style.opacity = '1';
                panel.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(1.1)`;
                panel.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
                icon.style.filter = 'grayscale(0) brightness(1.2)';
                
                if (isHidden) {
                    // 从贴边状态恢复
                    panel.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(1.1)`;
                    isHidden = false;
                }
            }
        });

        panel.addEventListener('mouseleave', () => {
            if (isMinimized) {
                panel.style.opacity = '0.7';
                panel.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(1)`;
                panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                icon.style.filter = 'grayscale(0)';
                checkEdgeHiding();
            }
        });

        // 点击图标展开
        panel.addEventListener('click', () => {
            if (isMinimized) {
                isMinimized = false;
                panel.style.display = 'none';
                fullPanel.style.display = 'block';
                setTimeout(() => {
                    fullPanel.style.opacity = '1';
                    fullPanel.style.transform = 'scale(1)';
                }, 10);
            }
        });

        // 关闭按钮功能
        closeBtn.onclick = () => {
            isMinimized = true;
            fullPanel.style.opacity = '0';
            fullPanel.style.transform = 'scale(0.8)';
            setTimeout(() => {
                fullPanel.style.display = 'none';
                panel.style.display = 'flex';
            }, 300);
        };

        // 检查贴边隐藏
        function checkEdgeHiding() {
            if (!isMinimized || isDragging) return;

            const rect = panel.getBoundingClientRect();
            const windowWidth = window.innerWidth;

            // 检查右边贴边
            if (windowWidth - rect.right < EDGE_THRESHOLD) {
                const hideX = xOffset + Math.abs(HIDDEN_OFFSET);
                panel.style.transform = `translate(${hideX}px, ${yOffset}px)`;
                isHidden = true;
            }
            // 检查左边贴边
            else if (rect.left < EDGE_THRESHOLD) {
                const hideX = xOffset + HIDDEN_OFFSET;
                panel.style.transform = `translate(${hideX}px, ${yOffset}px)`;
                isHidden = true;
            }
        }

        // 拖动功能（仅对图标模式有效）
        function dragStart(e) {
            if (!isMinimized) return;

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === panel || panel.contains(e.target)) {
                isDragging = true;
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            
            // 拖动结束后检查贴边
            if (isMinimized) {
                setTimeout(checkEdgeHiding, 100);
            }
        }

        function drag(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }

            if (isDragging) {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                // 更新位置
                panel.style.bottom = 'auto';
                panel.style.right = 'auto';
                panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        // 添加拖动事件监听
        panel.addEventListener('mousedown', dragStart);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mousemove', drag);

        // 朗读功能
        function speakText(text) {
            if (synth.speaking) {
                synth.cancel();
            }

            if (text) {
                currentUtterance = new SpeechSynthesisUtterance(text);
                currentUtterance.lang = langSelect.value;
                currentUtterance.onend = function() {
                    currentUtterance = null;
                };
                currentUtterance.onerror = function(e) {
                    console.error('SpeechSynthesisUtterance error', e);
                    currentUtterance = null;
                };
                synth.speak(currentUtterance);
            }
        }

        // 停止朗读
        function stopSpeaking() {
            if (synth.speaking) {
                synth.cancel();
            }
            currentUtterance = null;
        }

        // 绑定事件
        playBtn.onclick = () => {
            const text = textarea.value.trim();
            if (text) {
                speakText(text);
            }
        };

        stopBtn.onclick = stopSpeaking;

        readSelectedBtn.onclick = () => {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                textarea.value = selectedText;
                speakText(selectedText);
            } else {
                alert('请先选中要朗读的文字');
            }
        };

        document.body.appendChild(panel);

        // 初始化位置（使用transform而不是right/bottom）
        const initialRight = 20;
        const initialBottom = 20;
        panel.style.bottom = 'auto';
        panel.style.right = 'auto';
        panel.style.top = (window.innerHeight - panel.offsetHeight - initialBottom) + 'px';
        panel.style.left = (window.innerWidth - panel.offsetWidth - initialRight) + 'px';

        return { panel, fullPanel };
    }

    // 创建悬浮窗
    createFloatingPanel();

    // 监听选中文本事件，自动填充到输入框
    document.addEventListener('mouseup', function() {
        setTimeout(() => {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText && selectedText.length > 0) {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                    // 可选：自动填充选中的文本到输入框
                    // textarea.value = selectedText;
                }
            }
        }, 10);
    });
})();