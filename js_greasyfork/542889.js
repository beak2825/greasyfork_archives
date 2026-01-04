// ==UserScript==
//此插件由AI（DeepSeek） 编写
// @name         梦熊OJ自动跳题至洛谷
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  添加LB开头的题目的跳转功能
// @author       DeepSeek
// @match        https://www.mxoj.net/problem/*
// @match        https://www.mxoj.net/training/problems*
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @resource     luoguIcon https://www.luogu.com.cn/favicon.ico
// @icon         https://www.luogu.com.cn/favicon.ico
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542889/%E6%A2%A6%E7%86%8AOJ%E8%87%AA%E5%8A%A8%E8%B7%B3%E9%A2%98%E8%87%B3%E6%B4%9B%E8%B0%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/542889/%E6%A2%A6%E7%86%8AOJ%E8%87%AA%E5%8A%A8%E8%B7%B3%E9%A2%98%E8%87%B3%E6%B4%9B%E8%B0%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        debug: true,
        iconUrl: GM_getResourceURL('luoguIcon')
    };

    // 添加样式
    GM_addStyle(`
        /* 基础容器 */
        .luogu-extension-wrapper {
            display: inline-flex !important;
            align-items: center !important;
            position: relative !important;
            vertical-align: middle !important;
        }
        
        /* 题目页面跳转按钮 */
        .luogu-problem-jump-btn {
            display: inline-flex !important;
            align-items: center !important;
            padding: 6px 12px !important;
            margin-left: 12px !important;
            background-color: #3498db !important;
            color: white !important;
            border-radius: 4px !important;
            font-size: 14px !important;
            text-decoration: none !important;
            transition: all 0.2s !important;
            cursor: pointer !important;
            height: auto !important;
            line-height: 1.5 !important;
            border: 1px solid transparent !important;
            white-space: nowrap !important;
            vertical-align: middle !important;
        }
        .luogu-problem-jump-btn:hover {
            background-color: #2980b9 !important;
        }
        .luogu-problem-jump-btn::before {
            content: "" !important;
            display: inline-block !important;
            width: 16px !important;
            height: 16px !important;
            margin-right: 5px !important;
            background-image: url(${CONFIG.iconUrl}) !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
        }
        
        /* 题单页悬停按钮 */
        .luogu-list-hover-btn {
            display: none !important;
            width: 16px !important;
            height: 16px !important;
            margin-left: 8px !important;
            background-image: url(${CONFIG.iconUrl}) !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            cursor: pointer !important;
            vertical-align: middle !important;
        }
        .luogu-extension-wrapper:hover .luogu-list-hover-btn {
            display: inline-block !important;
        }
        
        /* 隐藏原有箭头 */
        .problem-title::after,
        .problem-title::before,
        a.problem-title::after,
        a.problem-title::before,
        .problem-title:hover::after,
        .problem-title:hover::before,
        a.problem-title:hover::after,
        a.problem-title:hover::before {
            display: none !important;
            content: none !important;
        }
    `);

    // 主控制器
    class LuoguExtension {
        constructor() {
            this.init();
        }

        init() {
            if (this.isProblemPage()) {
                this.setupProblemPage();
            } else if (this.isProblemSetPage()) {
                this.setupProblemSetPage();
            }
        }

        // 页面类型判断
        isProblemPage() {
            return window.location.pathname.includes('/problem/') && 
                  !window.location.pathname.includes('/problems');
        }

        isProblemSetPage() {
            return window.location.pathname.includes('/training/problems');
        }

        // 题目页面设置
        setupProblemPage() {
            this.waitForElement('button.btn.btn-primary.answer[onclick^="goAnswer"]', (submitBtn) => {
                const problemId = this.extractProblemIdFromPage();
                const luoguId = this.convertToLuoguId(problemId);
                
                if (luoguId) {
                    this.addProblemJumpButton(submitBtn, luoguId);
                }
            });
        }

        // 题单页面设置
        setupProblemSetPage() {
            const observer = new MutationObserver(() => {
                this.processProblemTitles();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            this.processProblemTitles();
        }

        // 处理题单页题目
        processProblemTitles() {
            document.querySelectorAll('.problem-title, a[href*="/problem/"]').forEach((title) => {
                if (title.dataset.luoguProcessed) return;
                title.dataset.luoguProcessed = 'true';
                
                const wrapper = this.wrapTitle(title);
                const problemId = this.extractProblemId(title);
                const luoguId = this.convertToLuoguId(problemId);
                
                if (luoguId) {
                    this.addListHoverButton(wrapper, luoguId);
                }
            });
        }

        // 工具方法
        wrapTitle(title) {
            const wrapper = document.createElement('div');
            wrapper.className = 'luogu-extension-wrapper';
            title.parentNode.insertBefore(wrapper, title);
            wrapper.appendChild(title);
            return wrapper;
        }

        addProblemJumpButton(submitBtn, luoguId) {
            const existingBtn = submitBtn.parentNode.querySelector('.luogu-problem-jump-btn');
            if (existingBtn) existingBtn.remove();
            
            const btn = document.createElement('a');
            btn.href = `https://www.luogu.com.cn/problem/${luoguId}`;
            btn.className = 'luogu-problem-jump-btn';
            btn.textContent = '洛谷原题';
            btn.target = '_blank';
            
            submitBtn.parentNode.insertBefore(btn, submitBtn.nextSibling);
            
            if (CONFIG.debug) console.log('题目页面跳转按钮已添加:', luoguId);
        }

        addListHoverButton(wrapper, luoguId) {
            const btn = document.createElement('div');
            btn.className = 'luogu-list-hover-btn';
            wrapper.appendChild(btn);
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(`https://www.luogu.com.cn/problem/${luoguId}`, '_blank');
            });
            
            if (CONFIG.debug) console.log('题单页面跳转按钮已添加:', luoguId);
        }

        waitForElement(selector, callback, attempt = 0) {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (attempt < 5) {
                setTimeout(() => this.waitForElement(selector, callback, attempt + 1), 200);
            }
        }

        extractProblemIdFromPage() {
            const submitBtn = document.querySelector('button.btn.btn-primary.answer[onclick^="goAnswer"]');
            if (submitBtn) {
                const match = (submitBtn.getAttribute('onclick') || '').match(/goAnswer\('([A-Za-z]+[\dA-Za-z]*)'\)/);
                if (match) return match[1];
            }
            const urlMatch = window.location.pathname.match(/\/problem\/([A-Za-z]+[\dA-Za-z]*)/i);
            return urlMatch ? urlMatch[1] : null;
        }

        extractProblemId(element) {
            if (element.href) {
                const match = element.href.match(/\/problem\/([A-Za-z]+[\dA-Za-z]*)/i);
                if (match) return match[1];
            }
            return element.textContent.match(/([A-Za-z]+[\dA-Za-z]*)/)?.[1];
        }

        // 增强的题号转换逻辑
        convertToLuoguId(problemId) {
            if (!problemId) return null;
            
            // LB题号处理: LB123 → B123
            if (problemId.startsWith('LB') && problemId.length > 2) {
                return 'B' + problemId.substring(2);
            }
            
            // L题号处理: L123 → P123
            if (problemId.startsWith('L') && problemId.length > 1) {
                return 'P' + problemId.substring(1);
            }
            
            // CF题号保持不变
            if (problemId.startsWith('CF')) {
                return problemId;
            }
            
            return null;
        }
    }

    // 启动插件
    new LuoguExtension();
})();