// ==UserScript==
// @name         arXiv and ar5iv Integration Buttons
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds navigation buttons between arXiv and ar5iv pages
// @author       Your Name
// @match        https://arxiv.org/abs/*
// @match        https://ar5iv.labs.arxiv.org/html/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536462/arXiv%20and%20ar5iv%20Integration%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/536462/arXiv%20and%20ar5iv%20Integration%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断当前网站类型
    const isArxiv = window.location.href.includes('arxiv.org/abs/');
    const isAr5iv = window.location.href.includes('ar5iv.labs.arxiv.org/html/');

    // 在arXiv上添加ar5iv按钮
    function addAr5ivButton() {
        // 检查是否是论文页面
        if (!window.location.href.match(/arxiv\.org\/abs\//)) {
            return;
        }

        // 检查是否已有HTML链接
        const existingHtmlLink = document.querySelector('#latexml-download-link');
        if (existingHtmlLink) {
            return; // 已经有HTML链接，不添加新按钮
        }

        // 获取完整的论文ID路径（保留原始格式）
        const paperIdPath = window.location.pathname.replace('/abs/', '');
        if (!paperIdPath) {
            return;
        }

        // 找到放置按钮的位置
        const fullTextUl = document.querySelector('.full-text ul');
        if (!fullTextUl) {
            return;
        }

        // 创建新的ar5iv按钮
        const newLi = document.createElement('li');
        const newLink = document.createElement('a');
        newLink.href = `https://ar5iv.org/abs/${paperIdPath}`;
        newLink.className = 'abs-button ar5iv-button';
        newLink.textContent = 'View on Ar5iv';
        newLink.target = '_blank'; // 在新标签页打开

        // 添加到页面
        newLi.appendChild(newLink);
        fullTextUl.appendChild(newLi);
    }

    // 在ar5iv上添加arXiv悬浮按钮
    function addFloatingButton() {
        // 获取论文ID
        const path = window.location.pathname;
        const htmlPrefix = '/html/';
        if (!path.startsWith(htmlPrefix)) return;

        const paperId = path.substring(htmlPrefix.length);
        if (!paperId) return;

        // 创建悬浮容器
        const floatingDiv = document.createElement('div');
        floatingDiv.id = 'arxiv-floating-button';

        // 设置容器样式
        Object.assign(floatingDiv.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '18px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            fontSize: '15px',
            zIndex: '10000',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)', // Safari支持
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            border: '1px solid rgba(210, 210, 210, 0.8)'
        });

        // 悬停效果
        floatingDiv.onmouseover = function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
            this.style.transform = 'translateY(-2px)';
        };

        floatingDiv.onmouseout = function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            this.style.transform = 'translateY(0)';
        };

        // 点击效果
        floatingDiv.onmousedown = function() {
            this.style.transform = 'translateY(1px)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        };

        floatingDiv.onmouseup = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        };

        // 创建文本
        const text = document.createElement('span');
        text.textContent = 'View on arXiv';
        text.style.fontWeight = '500';
        text.style.color = '#333';

        // 组装按钮
        floatingDiv.appendChild(text);

        // 点击跳转到arXiv
        floatingDiv.addEventListener('click', function() {
            window.open(`https://arxiv.org/abs/${paperId}`, '_blank');
        });

        // 添加到页面
        document.body.appendChild(floatingDiv);
    }

    // 根据当前网站执行相应功能
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (isArxiv) {
                addAr5ivButton();
            } else if (isAr5iv) {
                addFloatingButton();
            }
        });
    } else {
        if (isArxiv) {
            addAr5ivButton();
        } else if (isAr5iv) {
            addFloatingButton();
        }
    }
})();
