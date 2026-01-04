// ==UserScript==
// @name         Gemini Canvas Infographic
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a button on Gemini to auto-fill an infographic prompt, select Canvas, and send.
// @match        *://gemini.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537777/Gemini%20Canvas%20Infographic.user.js
// @updateURL https://update.greasyfork.org/scripts/537777/Gemini%20Canvas%20Infographic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INFOGRAPHIC_BUTTON_ID = 'gemini-infographic-btn';
    const INFOGRAPHIC_PROMPT = '创建一个单页HTML信息图，它将基于我上面提出的问题和你的回答，以视觉化方式呈现关键信息。此信息图将使用简体中文，并遵循您指定的技术和样式要求，包括使用Tailwind CSS、Chart.js进行图表绘制（确保Canvas渲染、标签换行和工具提示配置），并且不使用SVG或Mermaid JS。结尾给出引用视频或网页的链接。使用PPT4大原则和ppt撰写金字塔原理，使得信息图更加美观，专业，高级。根据认知心理学的相关知识，让信息图更利于我学习和理解此知识，优化排版，减少认知负荷但不减少信息量，开启友好初学者模式。重点细节务必保留。';

    function clickCanvasButton() {
        const buttons = document.querySelectorAll('button.toolbox-drawer-item-button');
        for (const btn of buttons) {
            const label = btn.querySelector('div.toolbox-drawer-button-label');
            if (label && label.textContent.trim() === 'Canvas') {
                btn.click();
                return true;
            }
        }
        return false;
    }

    function sendPrompt(prompt) {
        const textarea = document.querySelector('textarea, div[contenteditable="true"]');
        if (!textarea) return;

        if (textarea.isContentEditable) {
            textarea.textContent = prompt;
        } else {
            textarea.value = prompt;
        }

        textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

        clickCanvasButton();

        setTimeout(() => {
            const sendBtn = document.querySelector('button[aria-label*="Send"],button[aria-label*="发送"],button[aria-label*="提交"],button[aria-label*="Run"],button[aria-label*="Submit"]');
            if (sendBtn && !sendBtn.disabled) {
                sendBtn.click();
            }
        }, 300);
    }

    function addInfographicButton() {
        if (document.getElementById(INFOGRAPHIC_BUTTON_ID)) return;

        const btn = document.createElement('button');
        btn.id = INFOGRAPHIC_BUTTON_ID;
        btn.textContent = '📊 信息图';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '780px',
            right: '170px',
            zIndex: 99999,
            padding: '8px 12px',
            borderRadius: '4px',
            backgroundColor: '#1a73e8',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px'
        });

        btn.addEventListener('click', () => sendPrompt(INFOGRAPHIC_PROMPT));
        document.body.appendChild(btn);
    }

    if (window.location.hostname.includes('gemini.google.com')) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            addInfographicButton();
        } else {
            window.addEventListener('DOMContentLoaded', addInfographicButton, { once: true });
        }
    }
})();