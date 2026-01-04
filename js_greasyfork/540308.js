// ==UserScript==
// @name         Gemini对话导出器
// @name:en      Gemini Chat Exporter
// @namespace    https://greasyfork.org/users/your-username
// @version      1.1.0
// @license MIT
// @description  专门为Google Gemini设计的对话导出工具，一键导出聊天记录
// @description:en Specialized chat exporter for Google Gemini, export conversations with one click
// @author       YourUsername
// @match        https://gemini.google.com/*
// @match        https://bard.google.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540308/Gemini%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/540308/Gemini%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log('🚀 Gemini对话导出器已加载');
    // 简化配置
    const config = {
        format: localStorage.getItem('gemini-export-format') || 'emoji',
        version: '1.1.0'
    };
    // 简化的HTML转文本
    function extractText(element) {
        try {
            const clone = element.cloneNode(true);
            // 移除按钮、图标等
            clone.querySelectorAll('button, svg, [class*="copy"], [class*="icon"]').forEach(el => el.remove());
            // 保持代码块格式
            clone.querySelectorAll('pre code').forEach(code => {
                const lang = code.className.match(/language-(\w+)/)?.[1] || '';
                code.textContent = `\`\`\`${lang}\n${code.textContent}\n\`\`\``;
            });
            // 行内代码
            clone.querySelectorAll('code:not(pre code)').forEach(code => {
                code.textContent = `\`${code.textContent}\``;
            });
            // 加粗和斜体
            clone.querySelectorAll('strong, b').forEach(el => {
                el.textContent = `**${el.textContent}**`;
            });
            clone.querySelectorAll('em, i').forEach(el => {
                el.textContent = `*${el.textContent}*`;
            });
            // 列表
            clone.querySelectorAll('ul li').forEach(li => {
                li.textContent = `- ${li.textContent}`;
            });
            clone.querySelectorAll('ol li').forEach((li, i) => {
                li.textContent = `${i+1}. ${li.textContent}`;
            });
            return clone.textContent.trim();
        } catch (e) {
            return element.textContent || element.innerText || '';
        }
    }
    // 简化的消息验证
    function isValidMessage(element, content) {
        // 基本检查
        if (!content || content.length < 10) return false;
        // 排除输入框和草稿
        if (element.closest('[class*="input"]') ||
            element.closest('[class*="draft"]') ||
            element.closest('form') ||
            element.getAttribute('contenteditable') === 'true') {
            return false;
        }
        // 排除UI文本
        const uiTexts = ['发送', 'send', '复制', 'copy', '新建', 'new', '设置', 'settings'];
        if (uiTexts.some(text => content.toLowerCase().includes(text.toLowerCase()) && content.length < 50)) {
            return false;
        }
        // 确保有实际内容
        return /[a-zA-Z\u4e00-\u9fa5]/.test(content) && content.split(/\s+/).length > 2;
    }
    
    // 改进的角色检测 - 使用元素标签和子元素特征
    function detectRole(element) {
        // 根据元素标签直接判断
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'user-query') return 'user';
        if (tagName === 'model-response') return 'assistant';
        
        // 检查子元素特征
        if (element.querySelector('user-query') || element.querySelector('[class*="user-query"]')) {
            return 'user';
        }
        if (element.querySelector('model-response') || element.querySelector('[class*="model-response"]')) {
            return 'assistant';
        }
        
        // 通过类名判断
        const className = element.className || '';
        if (className.includes('user-query')) return 'user';
        if (className.includes('model-response')) return 'assistant';
        
        // 通过消息内容尝试判断 - 常见的提示词
        const content = element.textContent || '';
        if (content.includes('Show thinking') || content.includes('Gemini')) {
            return 'assistant';
        }
        
        // 默认策略 - 如果没有明确识别，返回unknown
        return 'unknown';
    }
    
    // 格式化消息
    function formatMessage(msg, style) {
        const roleEmoji = msg.role === 'user' ? '🟦' : '🟩';
        const roleText = msg.role === 'user' ? 'USER' : 'GEMINI';
        switch(style) {
            case 'emoji':
                return `${roleEmoji} **${roleText}** (${msg.index})\n\n${msg.content}\n\n`;
            case 'box':
                return `┌─ ${roleText} (${msg.index}) ─────────────────────────────────\n${msg.content}\n└─────────────────────────────────────────────────────────\n\n`;
            case 'chat':
                return `[${new Date(msg.timestamp).toLocaleTimeString()}] ${roleText}: \n${msg.content}\n\n`;
            case 'xml':
                return `<${msg.role} id="${msg.index}">\n${msg.content}\n</${msg.role}>\n\n`;
            default:
                return `=== ${roleText} (${msg.index}) ===\n${msg.content}\n\n`;
        }
    }
    
    // 主导出函数 - 确保找到用户和AI消息
    function exportConversation() {
        console.log('🚀 开始导出Gemini对话...');
        
        // 直接找用户和AI的消息元素
        const userElements = document.querySelectorAll('user-query');
        const assistantElements = document.querySelectorAll('model-response');
        
        console.log(`📊 找到 ${userElements.length} 个用户消息和 ${assistantElements.length} 个AI回复`);
        
        if (userElements.length === 0 && assistantElements.length === 0) {
            // 备用方案：根据类名查找
            const userClassElements = document.querySelectorAll('[class*="user-query"]');
            const assistantClassElements = document.querySelectorAll('[class*="model-response"]');
            
            console.log(`📊 备用方案：找到 ${userClassElements.length} 个用户消息和 ${assistantClassElements.length} 个AI回复`);
            
            if (userClassElements.length > 0 || assistantClassElements.length > 0) {
                return processMessageElements(userClassElements, assistantClassElements);
            }
            
            // 最后尝试conversation-container
            const containers = document.querySelectorAll('.chat-history [class*="conversation-container"]:not([class*="cdk-visually-hidden"])');
            console.log(`📊 尝试容器：找到 ${containers.length} 个对话容器`);
            
            if (containers.length === 0) {
                alert('❌ 未找到对话内容\n请确保在Gemini对话页面，且页面已完全加载');
                return;
            }
            return processContainers(containers);
        }
        
        return processMessageElements(userElements, assistantElements);
    }
    
    // 处理找到的消息元素
    function processMessageElements(userElements, assistantElements) {
        const userMessages = [];
        const assistantMessages = [];
        
        // 处理用户消息
        Array.from(userElements).forEach(element => {
            const content = extractText(element);
            if (isValidMessage(element, content)) {
                userMessages.push({
                    content: content,
                    element: element,
                    position: getElementPosition(element)
                });
                console.log(`✅ 添加用户消息: ${content.substring(0, 50)}...`);
            }
        });
        
        // 处理AI消息
        Array.from(assistantElements).forEach(element => {
            const content = extractText(element);
            if (isValidMessage(element, content)) {
                assistantMessages.push({
                    content: content,
                    element: element,
                    position: getElementPosition(element)
                });
                console.log(`✅ 添加AI消息: ${content.substring(0, 50)}...`);
            }
        });
        
        createConversation(userMessages, assistantMessages);
    }
    
    // 获取元素在页面中的位置，用于排序
    function getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
    }
    
    // 处理容器元素 - 每个容器可能包含用户和AI消息
    function processContainers(containers) {
        const userMessages = [];
        const assistantMessages = [];
        
        containers.forEach(container => {
            // 注意：容器内可能同时包含用户和AI消息，所以要分别查找
            
            // 查找用户消息
            const userContent = findAndExtractUserContent(container);
            if (userContent) {
                userMessages.push({
                    content: userContent,
                    element: container,
                    position: getElementPosition(container)
                });
                console.log(`✅ 从容器提取用户消息: ${userContent.substring(0, 50)}...`);
            }
            
            // 查找AI消息
            const assistantContent = findAndExtractAssistantContent(container);
            if (assistantContent) {
                assistantMessages.push({
                    content: assistantContent,
                    element: container,
                    position: getElementPosition(container)
                });
                console.log(`✅ 从容器提取AI消息: ${assistantContent.substring(0, 50)}...`);
            }
            
            // 如果没有找到明确的用户或AI消息，尝试根据内容判断
            if (!userContent && !assistantContent) {
                const content = extractText(container);
                if (isValidMessage(container, content)) {
                    const role = detectRole(container);
                    if (role === 'user') {
                        userMessages.push({
                            content: content,
                            element: container,
                            position: getElementPosition(container)
                        });
                        console.log(`✅ 通过内容判断用户消息: ${content.substring(0, 50)}...`);
                    } else if (role === 'assistant') {
                        assistantMessages.push({
                            content: content,
                            element: container,
                            position: getElementPosition(container)
                        });
                        console.log(`✅ 通过内容判断AI消息: ${content.substring(0, 50)}...`);
                    }
                }
            }
        });
        
        createConversation(userMessages, assistantMessages);
    }
    
    // 从容器中提取用户内容
    function findAndExtractUserContent(container) {
        // 首先尝试找特定标签
        const userElements = container.querySelectorAll('user-query');
        if (userElements.length > 0) {
            const content = extractText(userElements[0]);
            if (isValidMessage(userElements[0], content)) {
                return content;
            }
        }
        
        // 然后尝试找类名包含user-query的元素
        const userClassElements = container.querySelectorAll('[class*="user-query"]');
        if (userClassElements.length > 0) {
            const content = extractText(userClassElements[0]);
            if (isValidMessage(userClassElements[0], content)) {
                return content;
            }
        }
        
        return null;
    }
    
    // 从容器中提取AI内容
    function findAndExtractAssistantContent(container) {
        // 首先尝试找特定标签
        const assistantElements = container.querySelectorAll('model-response');
        if (assistantElements.length > 0) {
            const content = extractText(assistantElements[0]);
            if (isValidMessage(assistantElements[0], content)) {
                return content;
            }
        }
        
        // 然后尝试找类名包含model-response的元素
        const assistantClassElements = container.querySelectorAll('[class*="model-response"]');
        if (assistantClassElements.length > 0) {
            const content = extractText(assistantClassElements[0]);
            if (isValidMessage(assistantClassElements[0], content)) {
                return content;
            }
        }
        
        // 最后尝试找类名包含response的元素，但要排除包含用户消息的
        const responseElements = container.querySelectorAll('[class*="response"]');
        for (let i = 0; i < responseElements.length; i++) {
            const element = responseElements[i];
            // 确保这不是用户消息区域
            if (!element.querySelector('[class*="user-query"]') && 
                !element.classList.contains('user-query')) {
                const content = extractText(element);
                if (isValidMessage(element, content)) {
                    return content;
                }
            }
        }
        
        return null;
    }
    
    // 创建对话
    function createConversation(userMessages, assistantMessages) {
        console.log(`📊 处理 ${userMessages.length} 个用户消息和 ${assistantMessages.length} 个AI回复`);
        
        if (userMessages.length === 0 && assistantMessages.length === 0) {
            alert('❌ 没有找到有效的对话内容\n\n可能原因：\n1. 页面还在加载\n2. 对话内容格式发生变化\n\n请打开控制台(F12)查看详细调试信息');
            return;
        }
        
        // 根据位置对消息排序
        userMessages.sort((a, b) => a.position - b.position);
        assistantMessages.sort((a, b) => a.position - b.position);
        
        // 创建有序对话
        const messages = [];
        
        // 使用位置信息创建有序对话
        let userIndex = 0;
        let assistantIndex = 0;
        
        // 确保对话是交替的：用户 -> AI -> 用户 -> AI
        while (userIndex < userMessages.length || assistantIndex < assistantMessages.length) {
            // 添加用户消息
            if (userIndex < userMessages.length) {
                messages.push({
                    index: messages.length + 1,
                    role: 'user',
                    content: userMessages[userIndex].content,
                    timestamp: new Date().toISOString(),
                    position: userMessages[userIndex].position
                });
                userIndex++;
            }
            
            // 添加AI回复
            if (assistantIndex < assistantMessages.length) {
                messages.push({
                    index: messages.length + 1,
                    role: 'assistant',
                    content: assistantMessages[assistantIndex].content,
                    timestamp: new Date().toISOString(),
                    position: assistantMessages[assistantIndex].position
                });
                assistantIndex++;
            }
        }
        
        // 根据位置重新排序所有消息
        messages.sort((a, b) => a.position - b.position);
        
        // 重新编号
        messages.forEach((msg, i) => {
            msg.index = i + 1;
        });
        
        // 导出
        finishExport(messages);
    }
    
    // 完成导出过程
    function finishExport(messages) {
        // 生成导出内容
        const exportText = [
            `# Gemini 对话导出`,
            `导出时间: ${new Date().toLocaleString()}`,
            `消息数量: ${messages.length}`,
            `来源: ${window.location.href}`,
            `格式: ${config.format}`,
            `导出工具: Gemini对话导出器 v${config.version}`,
            `\n${'='.repeat(50)}\n`,
            ...messages.map(msg => formatMessage(msg, config.format))
        ].join('\n');
        
        // 下载文件
        const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gemini-chat-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log(`✅ 导出完成！${messages.length}条消息`);
        showNotification(`✅ 成功导出 ${messages.length} 条消息！`);
    }
    
    // 创建简化UI
    function createUI() {
        if (document.getElementById('gemini-export-ui')) return;
        console.log('✅ Gemini导出器UI已加载');
        // 创建悬浮球
        const ui = document.createElement('div');
        ui.id = 'gemini-export-ui';
        ui.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                z-index: 999999;
                background: rgba(255,255,255,0.95);
                border-radius: 50%;
                width: 56px;
                height: 56px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                font-size: 24px;
                color: #5f6368;
                border: 1px solid rgba(0,0,0,0.1);
                transition: all 0.3s ease;
                backdrop-filter: blur(8px);
            " title="点击导出Gemini对话" onclick="window.exportGeminiChat()">
                📥
            </div>
            <style>
                #gemini-export-ui > div:hover {
                    transform: translateY(-50%) scale(1.1);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
                }
            </style>
        `;
        document.body.appendChild(ui);
        // 全局函数
        window.exportGeminiChat = exportConversation;
        // 恢复保存的位置
        const savedPosition = localStorage.getItem('gemini-export-position');
        if (savedPosition) {
            try {
                const pos = JSON.parse(savedPosition);
                const floater = ui.firstElementChild;
                floater.style.top = pos.top + 'px';
                floater.style.right = pos.right + 'px';
                floater.style.transform = 'none';
            } catch (e) {
                console.log('恢复位置失败:', e);
            }
        }
        // 简单拖拽
        let isDragging = false;
        const floater = ui.firstElementChild;
        floater.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isDragging = true;
            const startX = e.clientX;
            const startY = e.clientY;
            const rect = floater.getBoundingClientRect();
            function onMouseMove(e) {
                if (!isDragging) return;
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                floater.style.top = (rect.top + deltaY) + 'px';
                floater.style.right = (window.innerWidth - rect.right - deltaX) + 'px';
                floater.style.transform = 'none';
            }
            function onMouseUp() {
                if (isDragging) {
                    isDragging = false;
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    // 保存位置
                    const finalRect = floater.getBoundingClientRect();
                    localStorage.setItem('gemini-export-position', JSON.stringify({
                        top: finalRect.top,
                        right: window.innerWidth - finalRect.right
                    }));
                }
            }
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        });
        // 点击事件：只有不是拖拽时才导出
        floater.addEventListener('click', (e) => {
            if (!isDragging) {
                setTimeout(exportConversation, 10); // 小延迟确保不是拖拽
            }
        });
    }
    
    // 通知函数
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            z-index: 999999; padding: 12px 24px; border-radius: 6px;
            color: white; font-weight: bold; background: #4CAF50;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
    
    // 快捷键
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            exportConversation();
        }
    });
    
    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
    console.log('✅ Gemini导出器已就绪！快捷键: Ctrl+Shift+E');
})();