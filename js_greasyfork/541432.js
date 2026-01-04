// ==UserScript==
// @name         抖音弹幕加一助手
// @namespace    http://tampermonkey.net/
// @version      1.16
// @description  实现抖音弹幕鼠标悬停加一功能，体验类似于斗鱼加一功能
// @author       A1LExX
// @match        https://live.douyin.com/*
// @match        https://www.douyin.com/root/live/*
// @match        https://www.douyin.com/*
// @grant        none
// @license      GPL-3.0-only 
// @downloadURL https://update.greasyfork.org/scripts/541432/%E6%8A%96%E9%9F%B3%E5%BC%B9%E5%B9%95%E5%8A%A0%E4%B8%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541432/%E6%8A%96%E9%9F%B3%E5%BC%B9%E5%B9%95%E5%8A%A0%E4%B8%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
// ==Changelog==
// v1.16 测试更新推送
// v1.9  修复按钮垂直居中、视觉对齐问题，优化体验
// v1.8  支持过滤系统弹幕，优化兼容性
// v1.7  初始版本，实现弹幕加一功能
// ==/Changelog==

(function () {
    'use strict';

    // --------- 配置 ---------
    const DANMU_SELECTOR = 'xg-danmu div'; // 弹幕单条
    const DANMU_CONTAINER_SELECTOR = 'xg-danmu';
    const BUTTON_TEXT = '+1';
    const BUTTON_ID = '__douyin_plusone_btn__';
    const BUTTON_STYLE = `
        position: fixed;
        z-index: 99999;
        display: none;
        padding: 2px 8px;
        font-size: 14px;
        background: #ff2c55;
        color: #fff;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        transition: opacity 0.2s;
        opacity: 0.95;
        pointer-events: auto;
    `;

    const FILTER_KEYWORDS = [
        '送出'
    ];

    function isFilteredDanmu(text) {
        return FILTER_KEYWORDS.some(keyword => text.includes(keyword));
    }

    // --------- 工具函数 ---------
    // 递归提取弹幕文本（含 emoji）
    function extractDanmuText(node) {
        if (!node) return '';
        if (node.nodeType === Node.TEXT_NODE) return node.textContent;
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'IMG' && node.alt) return node.alt;
            return Array.from(node.childNodes).map(extractDanmuText).join('');
        }
        return '';
    }

    // 查找输入框和发送按钮
    function findInputAndSendBtn() {
        // 输入框是 Slate 编辑器，内容区有 contenteditable="true"
        const input = document.querySelector('[contenteditable="true"]');
        // 发送按钮通常有 data-e2e="chat-send-btn"
        const sendBtn = document.querySelector('[data-e2e="chat-send-btn"]');
        return { input, sendBtn };
    }

    // 填入输入框并自动发送
    function fillAndSend(content) {
        const input = document.querySelector('.zone-container.editor-kit-container[contenteditable="true"]');
        if (input && content) {
            // 只操作 ace-line 下的 span
            const aceLine = input.querySelector('.ace-line');
            if (aceLine) {
                const span = aceLine.querySelector('span[data-string]');
                if (span) {
                    span.textContent = content;
                }
            }
            input.focus();
            // 只触发一次 input 事件
            input.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
            // 200ms后点击发送按钮
            setTimeout(waitAndSend, 200);
        }
    }

    // 自动点击发送按钮
    function waitAndSend() {
        const btn = document.querySelector('.webcast-chatroom___send-btn');
        if (!btn) return;
        if (btn.classList.contains('disable') || btn.hasAttribute('disabled')) {
            setTimeout(waitAndSend, 50);
        } else {
            let clickable = btn;
            if (btn.tagName.toLowerCase() === 'svg' && btn.parentElement) {
                clickable = btn.parentElement;
            }
            ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(type => {
                clickable.dispatchEvent(new MouseEvent(type, {bubbles: true, cancelable: true, view: window}));
            });
            // 再尝试模拟回车
            const input = document.querySelector('.zone-container.editor-kit-container[contenteditable="true"]');
            if (input) {
                ['keydown', 'keypress', 'keyup'].forEach(type => {
                    const event = new KeyboardEvent(type, {bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13, which: 13});
                    input.dispatchEvent(event);
                });
            }
        }
    }

    // --------- "加一"按钮 ---------
    let plusOneBtn = document.getElementById(BUTTON_ID);
    if (!plusOneBtn) {
        plusOneBtn = document.createElement('button');
        plusOneBtn.id = BUTTON_ID;
        plusOneBtn.innerText = BUTTON_TEXT;
        plusOneBtn.setAttribute('style', BUTTON_STYLE);
        document.body.appendChild(plusOneBtn);
    }

    let currentDanmu = null;
    let danmuState = { transform: '', transition: '' };
    let hideTimer = null;
    let plusOneText = ''; // 全局变量

    // 按钮点击
    plusOneBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('加一按钮被点击');
        console.log('将要填充的内容:', plusOneText);
        fillAndSend(plusOneText);
    });

    // 鼠标在按钮上时不消失
    plusOneBtn.addEventListener('mouseenter', () => {
        if (hideTimer) clearTimeout(hideTimer);
    });
    plusOneBtn.addEventListener('mouseleave', () => {
        hideTimer = setTimeout(() => {
            plusOneBtn.style.display = 'none';
            if (currentDanmu) {
                currentDanmu.style.transform = danmuState.transform;
                currentDanmu.style.transition = danmuState.transition;
                currentDanmu = null;
            }
        }, 200);
    });

    // 鼠标移动时检测是否在弹幕上
    document.addEventListener('mousemove', (e) => {
        const danmuDivs = Array.from(document.querySelectorAll(DANMU_SELECTOR));
        let found = false;
        for (const div of danmuDivs) {
            const rect = div.getBoundingClientRect();
            if (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            ) {
                const text = extractDanmuText(div);
                if (isFilteredDanmu(text)) {
                    plusOneBtn.style.display = 'none';
                    continue;
                }
                found = true;
                if (currentDanmu !== div) {
                    // 恢复上一个弹幕动画
                    if (currentDanmu) {
                        currentDanmu.style.transform = danmuState.transform;
                        currentDanmu.style.transition = danmuState.transition;
                    }
                    currentDanmu = div;
                    // 记录当前弹幕动画状态
                    danmuState.transform = div.style.transform;
                    danmuState.transition = div.style.transition;
                    // 冻结当前弹幕
                    const computedTransform = getComputedStyle(div).transform;
                    div.style.transform = computedTransform;
                    div.style.transition = 'none';
                    // 定位按钮（更靠近弹幕右侧）
                    plusOneBtn.style.display = 'block';
                    // 先显示按钮以便获取宽度
                    plusOneBtn.style.left = '-9999px';
                    plusOneBtn.style.top = '-9999px';
                    setTimeout(() => {
                        const btnWidth = plusOneBtn.offsetWidth;
                        const btnHeight = plusOneBtn.offsetHeight;
                        plusOneBtn.style.left = (rect.right - btnWidth - 4) + 'px';
                        plusOneBtn.style.top = (rect.top + (rect.height - btnHeight) / 2 + 3) + 'px';
                    }, 0);
                    plusOneText = text; // 存储内容
                }
                break;
            }
        }
        if (!found && !plusOneBtn.matches(':hover')) {
            plusOneBtn.style.display = 'none';
            if (currentDanmu) {
                currentDanmu.style.transform = danmuState.transform;
                currentDanmu.style.transition = danmuState.transition;
                currentDanmu = null;
            }
        }
    });

    // 兼容性处理
    window.addEventListener('scroll', () => {
        plusOneBtn.style.display = 'none';
        if (currentDanmu) {
            currentDanmu.style.transform = danmuState.transform;
            currentDanmu.style.transition = danmuState.transition;
            currentDanmu = null;
        }
    });
    window.addEventListener('resize', () => {
        plusOneBtn.style.display = 'none';
        if (currentDanmu) {
            currentDanmu.style.transform = danmuState.transform;
            currentDanmu.style.transition = danmuState.transition;
            currentDanmu = null;
        }
    });

    // --------- 过滤系统弹幕（可选） ---------
    // 若需过滤系统弹幕，可在 extractDanmuText 后加判断
    // 例如：if (text.includes('欢迎')) return; // 过滤欢迎类弹幕

    function showPlusBtnForDanmu(danmuDiv) {
        const rect = danmuDiv.getBoundingClientRect();
        const danmuText = extractDanmuText(danmuDiv);
        if (isFilteredDanmu(danmuText)) {
            hidePlusBtn();
            return;
        }
        if (!plusOneBtn) {
            plusOneBtn = document.createElement('button');
            plusOneBtn.innerText = '加一';
            plusOneBtn.style.position = 'fixed';
            plusOneBtn.style.zIndex = '99999';
            plusOneBtn.style.background = '#ff2c55';
            plusOneBtn.style.color = '#fff';
            plusOneBtn.style.border = 'none';
            plusOneBtn.style.borderRadius = '16px';
            plusOneBtn.style.padding = '4px 16px';
            plusOneBtn.style.cursor = 'pointer';
            plusOneBtn.style.fontSize = '15px';
            plusOneBtn.style.fontWeight = 'bold';
            plusOneBtn.style.opacity = '0.96';
            plusOneBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
            plusOneBtn.style.transition = 'background 0.2s, box-shadow 0.2s, opacity 0.2s';
            plusOneBtn.style.pointerEvents = 'auto';
            plusOneBtn.addEventListener('mouseenter', () => {
                plusOneBtn.style.background = '#d81b4c';
                plusOneBtn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.22)';
                plusOneBtn.style.opacity = '1';
            });
            plusOneBtn.addEventListener('mouseleave', () => {
                plusOneBtn.style.background = '#ff2c55';
                plusOneBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
                plusOneBtn.style.opacity = '0.96';
            });
            plusOneBtn.addEventListener('mousedown', e => { e.stopPropagation(); e.preventDefault(); });
            plusOneBtn.addEventListener('mouseup', e => { e.stopPropagation(); e.preventDefault(); });
            plusOneBtn.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();
                const content = extractDanmuText(danmuDiv);
                fillAndSend(content);
                plusOneBtn.style.display = 'none';
            });
            document.body.appendChild(plusOneBtn);
        }
        // 先显示按钮以便获取高度
        plusOneBtn.style.display = 'block';
        plusOneBtn.style.left = '-9999px';
        plusOneBtn.style.top = '-9999px';
        setTimeout(() => {
            const btnWidth = plusOneBtn.offsetWidth;
            const btnHeight = plusOneBtn.offsetHeight;
            plusOneBtn.style.left = (rect.right - btnWidth - 4) + 'px';
            plusOneBtn.style.top = (rect.top + (rect.height - btnHeight) / 2 + 3) + 'px';
        }, 0);

        // 悬停弹幕样式：圆角+淡黑色边框
        danmuDiv.style.boxShadow = '0 0 0 4px rgba(0,0,0,0.18)';
        danmuDiv.style.borderRadius = '16px';

        // 暂停弹幕动画
        if (pausedDanmu && pausedDanmu !== danmuDiv) {
            // 恢复上一个弹幕
            pausedDanmu.style.transition = pausedTransition;
            pausedDanmu.style.transform = pausedTransform;
            pausedDanmu.style.boxShadow = '';
            pausedDanmu.style.borderRadius = '';
            pausedDanmu = null;
        }
        if (danmuDiv) {
            pausedDanmu = danmuDiv;
            pausedTransition = danmuDiv.style.transition;
            pausedTransform = danmuDiv.style.transform;
            // 立即暂停动画
            danmuDiv.style.transition = 'none';
            // 保持当前位置
            // 不需要修改 transform，直接保留当前 transform 即可
        }
    }

    function hidePlusBtn() {
        if (plusOneBtn) {
            plusOneBtn.style.display = 'none';
        }
        // 恢复弹幕动画和样式
        if (pausedDanmu) {
            pausedDanmu.style.transition = pausedTransition;
            pausedDanmu.style.transform = pausedTransform;
            pausedDanmu.style.boxShadow = '';
            pausedDanmu.style.borderRadius = '';
            pausedDanmu = null;
        }
        currentDanmu = null;
    }

})();
