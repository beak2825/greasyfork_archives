// ==UserScript==
// @name         THUGradingShortcuts
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description 为网络学堂添加快捷键支持，提高批改效率
// @author       你的名字
// @match        https://learn.tsinghua.edu.cn/f/wlxt/kczy/xszy/teacher/fx/*
// @match        https://learn.tsinghua.edu.cn/f/wlxt/kczy/xszy/teacher/beforePiYue*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538174/THUGradingShortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/538174/THUGradingShortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const currentUrl = window.location.href;
    console.log('当前URL:', currentUrl);
    const urlParams = new URLSearchParams(window.location.search);
    // 配置快捷键映射
    const keyFxMap = {
        'F1': '.fv__ui-button.fv__ui-directive-controller.fv__ui-directive-tooltip[name="pencil-tool"]', 
        'F2': '.fv__ui-button.fv__ui-directive-controller.fv__ui-directive-tooltip[name="eraser-tool"]',
        'Enter': '#btn-save'     // 回车 -> 提交
    };
    // 批改题目快捷键映射
    const keyPiyueMap = {
        'Enter': '.btn[value="提交并继续批阅"]',     // 回车 -> 提交
        's': '.btn.zancun',              // s键 -> 暂存
        'Escape': 'div.sub-back:nth-child(16) .btn[value="取消"]',    // Esc键 -> 取消
        ' ': '.btn.btn-success', // 空格 -> 开始批阅
    };
    // 判断当前页面类型
    if (/\/teacher\/fx\//.test(currentUrl)) {
        console.log('检测到批改页');
        initFxPage();
    } 
    else if (/\/teacher\/beforePiYue\?/.test(currentUrl)) {
        console.log('检测到批改前页面');
        initBeforePiYuePage();
    }

    // 等待主容器加载完成
    function initFxPage() {
        const container = document.querySelector('#pdf-ui');
        if (container) {
            // console.log('批改页加载完成');
            setupFxShortcuts();
            showHelpTooltip();
        } else {
            setTimeout(initFxPage, 500);
        }
    }

    function initBeforePiYuePage() {
        const container = document.querySelector('.detail-title');
        if (container) {
            // console.log('批改前页加载完成');
            setupPiYueShortcuts();
            showPiyueHelpTooltip();
        } else {
            setTimeout(initBeforePiYuePage, 500);
        }
    }

    // 检查是否在输入框中
    function isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement.tagName === 'TEXTAREA';
    }

    // 设置批卷页快捷键
    function setupFxShortcuts() {
        document.addEventListener('keydown', function(event) {
            // 检测是否有弹窗存在
            if (isModalVisible()) {
                console.log('检测到弹窗，忽略快捷键');
                if (event.key === 'Enter') {
                    const confirmBtn = document.querySelector('.zeromodal-container.alert .btn-primary');
                    if (confirmBtn) {
                        console.log('点击弹窗确认按钮');
                        event.preventDefault();
                        confirmBtn.click();
                        // 添加点击反馈效果
                        // showClickFeedback(confirmBtn);
                    }
                }
            }
            else {
                if (event.key === 'h') {
                    // console.log('显示帮助提示');
                    // showHelpTooltip();
                    // return; // 阻止默认行为
                }
                else if (event.key === 'Tab') {
                    const input = document.querySelector('input[name="zycj"]');
                    input.focus(); // 自动聚焦到输入框
                    return; // 阻止默认行为
                }
                else {
                    const selector = keyFxMap[event.key];
                    if (selector) {
                        const btn = document.querySelector(selector);
                        if (btn) {
                            event.preventDefault();
                            btn.click();
                            // 添加点击反馈效果
                            // showClickFeedback(btn);
                        }
                    }
                }
            }
        });
    }

    // 设置批卷页前页快捷键
    function setupPiYueShortcuts() {
        document.addEventListener('keydown', function(event) {
            // 如果在输入框中，忽略快捷键
            if (isInputFocused()) {
                // console.log('当前在输入框中，忽略快捷键:', event.key);
                return;
            }
            // 检测是否有弹窗存在
            if (isModalVisible()) {
                console.log('检测到弹窗，忽略快捷键');
                if (event.key === 'Enter') {
                    const confirmBtn = document.querySelector('.zeromodal-container.alert .btn-primary');
                    if (confirmBtn) {
                        console.log('点击弹窗确认按钮');
                        event.preventDefault();
                        confirmBtn.click();
                        // 添加点击反馈效果
                        // showClickFeedback(confirmBtn);
                    }
                }
            }
            else {
                const selector = keyPiyueMap[event.key];
                if (selector) {
                    console.log('检测到快捷键:', event.key, '对应按钮选择器:', selector);
                    const btn = document.querySelector(selector);
                    if (btn) {
                        console.log('找到按钮:', btn);
                        event.preventDefault();
                        btn.click();
                        // 添加点击反馈效果
                        // showClickFeedback(btn);
                    }
                }
            }
        });
    }

    // 显示点击反馈
    function showClickFeedback(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = '';
        }, 200);
    }

    // 显示帮助提示
    function showHelpTooltip() {
        const helpDiv = document.createElement('div');
        helpDiv.style.position = 'fixed';
        helpDiv.style.bottom = '20px';
        helpDiv.style.right = '20px';
        helpDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
        helpDiv.style.color = 'white';
        helpDiv.style.padding = '10px';
        helpDiv.style.borderRadius = '5px';
        helpDiv.style.zIndex = '9999';
        helpDiv.innerHTML = `
            <h3>快捷键帮助</h3>
            <p>F1: 铅笔工具</p>
            <p>F2: 橡皮工具</p>
            <p>Tab: 选择成绩输入框</p>
            <p>Enter: 提交</p>
        `;
        document.body.appendChild(helpDiv);
    }

    // 显示帮助提示
    function showPiyueHelpTooltip() {
        const helpPiyueDiv = document.createElement('div');
        helpPiyueDiv.style.position = 'fixed';
        helpPiyueDiv.style.bottom = '40px';
        helpPiyueDiv.style.left = '40px';
        helpPiyueDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
        helpPiyueDiv.style.color = 'white';
        helpPiyueDiv.style.padding = '20px';
        helpPiyueDiv.style.borderRadius = '5px';
        helpPiyueDiv.style.zIndex = '9999';
        helpPiyueDiv.innerHTML = `
            <h3>快捷键帮助</h3>
            <p style="margin: 8px 0; color: white !important;">回车: 提交并继续批阅</p>
            <p style="margin: 8px 0; color: white !important;">s: 挂起并继续批阅</p>
            <p style="margin: 8px 0; color: white !important;">Esc: 取消</p>
            <p style="margin: 8px 0; color: white !important;">空格: 在线批注作业</p>
        `;
        document.body.appendChild(helpPiyueDiv);
    }

    // 检测弹窗是否存在
    function isModalVisible() {
        const modal = document.querySelector('.zeromodal-container.alert');
        return modal && window.getComputedStyle(modal).display !== 'none';
    }
})();