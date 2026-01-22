// ==UserScript==
// @name         Gemini Canvas Infographic
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  在Gemini添加一键生成信息图按钮，自动选择Canvas工具
// @match        https://gemini.google.com/*
// @match        *://gemini.google.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537777/Gemini%20Canvas%20Infographic.user.js
// @updateURL https://update.greasyfork.org/scripts/537777/Gemini%20Canvas%20Infographic.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('=== Gemini Infographic v2.5 ===');

    const INFOGRAPHIC_PROMPT = `基于我上面的问题和你的回答，创建一个专业级信息图（单页HTML）。

## 设计规范
- **苹果极简主义**：大量留白、渐变配色、圆角卡片
- **金字塔结构**：核心结论在顶部，支撑论据向下展开
- **数据可视化**：使用Chart.js图表，关键数字放大显示
- **认知优化**：分类标签、图标辅助、避免墙式文字

## 技术要求
- 使用 Tailwind CSS + Chart.js
- 纯HTML单文件
- 结尾提供原始来源链接`;

    // 样式
    const style = document.createElement('style');
    style.textContent = `
        #gemini-infographic-btn {
            position: fixed;
            top: 14px;
            right: 80px;
            z-index: 999999;
            height: 36px;
            padding: 0 14px;
            border-radius: 18px;
            background: linear-gradient(135deg, #4285f4, #1a73e8);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            font-family: "Google Sans", Roboto, sans-serif;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
        }
        #gemini-infographic-btn:hover {
            background: linear-gradient(135deg, #1a73e8, #1557b0);
            transform: translateY(-1px);
        }
    `;
    document.head.appendChild(style);

    // 第一步：点击"工具"按钮打开菜单
    async function openToolsMenu() {
        console.log('[Infographic] 尝试打开工具菜单...');

        // 查找包含"工具"文字的按钮
        const allButtons = document.querySelectorAll('button');
        for (const btn of allButtons) {
            const text = btn.textContent?.trim() || '';
            if (text === '工具' || text.includes('工具')) {
                console.log('[Infographic] 找到工具按钮，点击...');
                btn.click();
                await new Promise(r => setTimeout(r, 500));
                return true;
            }
        }

        // 备用：查找带有特定class的工具按钮
        const toolBtns = document.querySelectorAll('[class*="tool"] button, button[aria-haspopup="true"]');
        for (const btn of toolBtns) {
            console.log('[Infographic] 尝试点击备用工具按钮...');
            btn.click();
            await new Promise(r => setTimeout(r, 500));
            return true;
        }

        console.log('[Infographic] 未找到工具按钮');
        return false;
    }

    // 第二步：选择Canvas
    async function selectCanvas() {
        console.log('[Infographic] 查找Canvas选项...');

        // 现在菜单应该打开了，查找Canvas
        const matListItems = document.querySelectorAll('.mat-mdc-list-item, [class*="mat-mdc-list-item"]');
        console.log('[Infographic] mat-list-item数量:', matListItems.length);

        for (const item of matListItems) {
            const text = item.textContent?.trim() || '';
            if (text.includes('Canvas')) {
                console.log('[Infographic] 找到Canvas，点击...');
                item.click();
                return true;
            }
        }

        // 遍历所有包含Canvas文字的元素
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
            if (el.children.length === 0 && el.textContent?.trim() === 'Canvas') {
                // 向上查找可点击的父元素
                let parent = el.parentElement;
                for (let i = 0; i < 6 && parent; i++) {
                    if (parent.tagName === 'BUTTON' ||
                        parent.classList.contains('mat-mdc-list-item') ||
                        parent.getAttribute('role') === 'menuitem' ||
                        parent.getAttribute('role') === 'option') {
                        console.log('[Infographic] 找到Canvas父元素，点击...');
                        parent.click();
                        return true;
                    }
                    parent = parent.parentElement;
                }
            }
        }

        console.log('[Infographic] 未找到Canvas选项');
        return false;
    }

    // 主函数
    async function generateInfographic() {
        console.log('[Infographic] === 开始生成信息图 ===');

        // 1. 打开工具菜单
        await openToolsMenu();
        await new Promise(r => setTimeout(r, 600));

        // 2. 选择Canvas
        const selected = await selectCanvas();
        console.log('[Infographic] Canvas选择结果:', selected);
        await new Promise(r => setTimeout(r, 500));

        // 3. 填入提示词
        const textareas = document.querySelectorAll('div[contenteditable="true"], textarea, [role="textbox"]');
        let textarea = null;
        for (const t of textareas) {
            if (t.offsetWidth > 0 && t.offsetHeight > 0) {
                textarea = t;
                break;
            }
        }

        if (textarea) {
            textarea.focus();
            if (textarea.isContentEditable) {
                textarea.textContent = INFOGRAPHIC_PROMPT;
            } else {
                textarea.value = INFOGRAPHIC_PROMPT;
            }
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('[Infographic] 提示词已填入');
        } else {
            console.log('[Infographic] 未找到输入框');
            return;
        }

        // 4. 发送
        await new Promise(r => setTimeout(r, 800));
        const allBtns = document.querySelectorAll('button');
        for (const b of allBtns) {
            const label = b.getAttribute('aria-label') || '';
            if ((label.includes('Send') || label.includes('发送')) && !b.disabled) {
                b.click();
                console.log('[Infographic] 已发送');
                return;
            }
        }
        console.log('[Infographic] 请手动发送');
    }

    // 添加按钮
    function addButton() {
        if (document.getElementById('gemini-infographic-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'gemini-infographic-btn';
        btn.textContent = '📊 信息图';
        btn.onclick = generateInfographic;
        document.body.appendChild(btn);
        console.log('[Infographic] 按钮已添加');
    }

    addButton();
    setTimeout(addButton, 1000);
    setTimeout(addButton, 3000);
    new MutationObserver(() => {
        if (!document.getElementById('gemini-infographic-btn')) addButton();
    }).observe(document.body, { childList: true, subtree: true });

})();
