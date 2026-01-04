// ==UserScript==
// @name         岐黄天使刷课助手 - 样式模块
// @namespace    http://tampermonkey.net/qhtx-modules
// @version      1.3.1
// @description  岐黄天使刷课助手的样式定义模块，提供脚本界面的CSS样式。
// @author       AI助手
// ==/UserScript==

// 样式模块
(function() {
    'use strict';

    // 添加样式
    function applyStyles() {
        GM_addStyle(`
            .qh-assistant-panel {
                position: fixed;
                top: 100px;
                right: 10px;
                width: 280px;
                background: linear-gradient(135deg, #00a8cc, #0062bd);
                border-radius: 12px;
                padding: 15px;
                color: white;
                z-index: 9999;
                font-size: 14px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .qh-assistant-panel:hover {
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
                transform: translateY(-2px);
            }
            .qh-assistant-title {
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 12px;
                border-bottom: 2px solid rgba(255, 255, 255, 0.3);
                padding-bottom: 8px;
                position: relative;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
            }
            .qh-assistant-close {
                position: absolute;
                top: 0;
                right: 0;
                cursor: pointer;
                font-size: 16px;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .qh-assistant-close:hover {
                opacity: 1;
            }
            .qh-assistant-content {
                margin-bottom: 12px;
                background-color: rgba(255, 255, 255, 0.1);
                padding: 10px;
                border-radius: 8px;
            }
            .qh-assistant-content div {
                margin-bottom: 6px;
                display: flex;
                justify-content: space-between;
            }
            .qh-assistant-content div span:first-child {
                font-weight: bold;
                margin-right: 5px;
            }
            .qh-assistant-progress {
                margin-top: 8px;
                height: 12px;
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                overflow: hidden;
                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
            }
            .qh-assistant-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #8BC34A);
                width: 0%;
                transition: width 0.5s;
                border-radius: 10px;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }
            .qh-assistant-btn {
                background: linear-gradient(90deg, #4CAF50, #45a049);
                border: none;
                color: white;
                padding: 8px 12px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 14px;
                margin: 5px 0;
                cursor: pointer;
                border-radius: 50px;
                width: 100%;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                font-weight: bold;
                text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
            }
            .qh-assistant-btn:hover {
                background: linear-gradient(90deg, #45a049, #3d8b3d);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                transform: translateY(-1px);
            }
            .qh-assistant-btn:active {
                transform: translateY(1px);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            }
            .qh-assistant-nav-btns {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            .qh-assistant-nav-btn {
                background: linear-gradient(90deg, #2196F3, #03A9F4);
                border: none;
                color: white;
                padding: 6px 10px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 13px;
                cursor: pointer;
                border-radius: 50px;
                width: 48%;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                font-weight: bold;
            }
            .qh-assistant-nav-btn:hover {
                background: linear-gradient(90deg, #1E88E5, #039BE5);
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
            }
            .qh-assistant-nav-btn:active {
                transform: translateY(1px);
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            }
            .qh-assistant-nav-btn:disabled {
                background: linear-gradient(90deg, #9E9E9E, #BDBDBD);
                cursor: not-allowed;
                opacity: 0.7;
            }
            .qh-assistant-minimize {
                position: absolute;
                top: 0;
                left: 10px;
                cursor: pointer;
                font-size: 16px;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .qh-assistant-minimize:hover {
                opacity: 1;
            }
            .qh-assistant-panel.minimized {
                width: auto;
                height: auto;
                padding: 10px;
            }
            .qh-assistant-panel.minimized .qh-assistant-content,
            .qh-assistant-panel.minimized .qh-assistant-nav-btns,
            .qh-assistant-panel.minimized .qh-assistant-btn {
                display: none;
            }
            .qh-assistant-panel.minimized .qh-assistant-title {
                margin-bottom: 0;
                border-bottom: none;
                padding-bottom: 0;
            }
            .qh-assistant-panel.minimized .qh-assistant-minimize {
                transform: rotate(180deg);
            }

            /* 题库抓取功能样式 */
            .qh-question-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80%;
                max-width: 800px;
                max-height: 80vh;
                background: white;
                border-radius: 12px;
                padding: 20px;
                color: #333;
                z-index: 10000;
                font-size: 14px;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.4);
                display: none;
                overflow: auto;
            }
            .qh-question-title {
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 15px;
                border-bottom: 2px solid #eee;
                padding-bottom: 10px;
                color: #0062bd;
            }
            .qh-question-close {
                position: absolute;
                top: 10px;
                right: 15px;
                cursor: pointer;
                font-size: 20px;
                color: #999;
                transition: color 0.2s;
            }
            .qh-question-close:hover {
                color: #333;
            }
            .qh-question-content {
                margin-bottom: 15px;
                max-height: 50vh;
                overflow-y: auto;
                padding: 10px;
                border: 1px solid #eee;
                border-radius: 8px;
            }
            .qh-question-item {
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px dashed #ddd;
            }
            .qh-question-item:last-child {
                border-bottom: none;
            }
            .qh-question-text {
                font-weight: bold;
                margin-bottom: 8px;
            }
            .qh-question-options {
                margin-left: 20px;
                margin-bottom: 8px;
            }
            .qh-question-option {
                margin-bottom: 5px;
            }
            .qh-question-answer {
                color: #4CAF50;
                font-weight: bold;
            }
            .qh-question-analysis {
                margin-top: 8px;
                color: #666;
                font-size: 13px;
                background-color: #f9f9f9;
                padding: 8px;
                border-radius: 4px;
            }
            .qh-question-btns {
                display: flex;
                justify-content: space-between;
                margin-top: 15px;
            }
            .qh-question-btn {
                background: linear-gradient(90deg, #2196F3, #0062bd);
                border: none;
                color: white;
                padding: 8px 15px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 14px;
                cursor: pointer;
                border-radius: 4px;
                width: 48%;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
            }
            .qh-question-btn:hover {
                background: linear-gradient(90deg, #0062bd, #004a8f);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
            .qh-question-btn:active {
                transform: translateY(1px);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            }
            .qh-question-status {
                text-align: center;
                margin: 10px 0;
                color: #666;
            }
            .qh-question-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                display: none;
            }
        `);
        console.log('[Styles模块] 样式已应用。');
    }

    // 模块加载时自动应用样式
    if (typeof GM_addStyle === 'function') {
        try {
            applyStyles();
        } catch (e) {
            console.error('[Styles模块] applyStyles 执行出错:', e);
        }
    } else {
        console.warn('[Styles模块] GM_addStyle 函数不可用。');
    }

    // 可选: 如果其他模块仍需通过 window.applyStyles 调用（不推荐），则保留
    // window.applyStyles = applyStyles; 

})();
