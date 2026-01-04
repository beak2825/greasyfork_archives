// ==UserScript==
// @name         乘方教务系统学生学分计算工具
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  乘方教务系统的绩点计算工具😆
// @author       GamerNoTitle
// @match        https://jxfw.gdut.edu.cn/*
// @match        https://zhjw.smu.edu.cn/*
// @grant        GM_addStyle
// @run-at       document-idle
// @homepageURL  https://github.com/GDUTMeow/GPACalculator
// @supportURL   https://github.com/GDUTMeow/GPACalculator/issues
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/524891/%E4%B9%98%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%AD%A6%E7%94%9F%E5%AD%A6%E5%88%86%E8%AE%A1%E7%AE%97%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/524891/%E4%B9%98%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%AD%A6%E7%94%9F%E5%AD%A6%E5%88%86%E8%AE%A1%E7%AE%97%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/*
2.0.2 更新：让按钮注入更加精准，现在大概应该不会注入到别的表格里面去了
2.0.1 更新：将复制链接按钮的描述改为“复制 Github 链接”，更加直观
2.0.0 更新：把 Alert 换成了自定义的 Material You Design 模态框，更加好看了
*/

const CONFIG = {
    VERSION: '2.0.2',
    REPO_URL: 'https://github.com/GDUTMeow/GPACalculator'
};

(function() {
    'use strict';

    // 样式声明
    GM_addStyle(`
        #calcGPA {
            margin-left: 12px;
            padding: 2px 8px;
            background: #5bc0de;
            color: white;
            border: 1px solid #46b8da;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            vertical-align: middle;
            transition: all 0.3s;
        }
        #calcGPA:hover {
            background: #31b0d5;
            transform: translateY(-1px);
        }
        #calcGPA:active {
            transform: translateY(0);
        }

        .gpa-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(4px);
        }

        .gpa-modal {
            background: #F7F2FA;
            border-radius: 28px;
            padding: 24px;
            width: min(90%, 600px);
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            animation: modalEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes modalEnter {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .modal-title {
            font-size: 22px;
            font-weight: 600;
            color: #6750A4;
        }

        .modal-close {
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: background 0.2s;
            font-size: 24px;
            line-height: 1;
        }
        .modal-close:hover {
            background: rgba(0,0,0,0.1);
        }

        .modal-content {
            line-height: 1.6;
            font-family: monospace;
            white-space: pre-wrap;
            padding: 12px 0;
            border-top: 1px solid #79747E;
            border-bottom: 1px solid #79747E;
            margin: 16px 0;
            color: #333;
        }

        .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }

        .md-button {
            padding: 8px 16px;
            border-radius: 20px;
            border: 1px solid #79747E;
            background: transparent;
            cursor: pointer;
            transition: all 0.2s;
            font-family: system-ui;
        }
        .md-button.primary {
            background: #6750A4;
            color: white;
            border: none;
        }
        .md-button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
    `);

    // 模态框创建函数
    function createModal(content) {
        const overlay = document.createElement('div');
        overlay.className = 'gpa-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'gpa-modal';

        modal.innerHTML = `
            <div class="modal-header">
                <div class="modal-title">📊 绩点计算结果 | GPACalculator v${CONFIG.VERSION}</div>
                <div class="modal-close">×</div>
            </div>
            <div class="modal-content">${content}</div>
            <div class="modal-actions">
                <button class="md-button" onclick="this.closest('.gpa-modal-overlay').remove()">关闭</button>
                <button class="md-button primary" id="confirmCopy">复制 Github 仓库链接</button>
            </div>
        `;

        modal.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') overlay.remove();
        });

        modal.querySelector('#confirmCopy').addEventListener('click', () => {
            copyToClipboard(CONFIG.REPO_URL);
            overlay.remove();
        });

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // 按钮注入函数
    function injectButton() {
        document.querySelectorAll('iframe').forEach(iframe => {
            try {
                // 筛选目标 iframe
                if (!iframe.src.includes('xskccjxx!xskccjList.action?firstquery=1')) return;

                // 获取内部文档
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (!iframeDoc) return;

                // 防止重复注入
                if (iframeDoc.getElementById('calcGPA')) return;

                // 查找目标元素
                const toolbar = iframeDoc.getElementById('tb');
                const scoreTable = iframeDoc.querySelector('table.datagrid-btable');
                const targetRow = toolbar?.querySelector('tr');

                if (!toolbar || !scoreTable || !targetRow) return;

                // 创建按钮元素
                const buttonCell = iframeDoc.createElement('td');
                buttonCell.style.cssText = 'padding-left:15px; position:relative; top:-1px;';

                const button = iframeDoc.createElement('a');
                button.id = 'calcGPA';
                button.innerHTML = '📊 计算绩点';
                button.onclick = () => calculateGPA(iframe);

                buttonCell.appendChild(button);
                targetRow.appendChild(buttonCell);

            } catch (error) {
                console.error('iframe 操作错误:', error);
            }
        });
    }

    // 绩点计算函数
    function calculateGPA(targetIframe) {
        try {
            const iframeDoc = targetIframe.contentDocument || targetIframe.contentWindow?.document;
            if (!iframeDoc) return;

            const table = iframeDoc.querySelector('table.datagrid-btable');
            if (!table) return;

            let totalCredits = 0, weightedSum = 0;
            let totalCreditsWithExemption = 0, weightedSumWithExemption = 0;

            table.querySelectorAll('tr').forEach(row => {
                if (row.querySelector('th')) return;
                const creditCell = row.querySelector('td[field="xf"] div');
                const gradeCell = row.querySelector('td[field="cjjd"] div');
                if (!creditCell || !gradeCell) return;

                const credits = parseFloat(creditCell.textContent.trim());
                const gradeText = gradeCell.textContent.trim();
                const isExempt = gradeText === '免修' || gradeText === '--';

                if (isNaN(credits)) return;

                if (!isExempt) {
                    const grade = parseFloat(gradeText);
                    if (!isNaN(grade)) {
                        totalCredits += credits;
                        weightedSum += grade * credits;
                    }
                }

                const effectiveGrade = isExempt ? 3.0 : parseFloat(gradeText);
                if (!isNaN(effectiveGrade)) {
                    totalCreditsWithExemption += credits;
                    weightedSumWithExemption += effectiveGrade * credits;
                }
            });

            const resultMessage = [
                `⚠️ 不含免修的是教务系统里面的计算方式`,
                `⚠️ 含免修的是GDUTDays的计算方式`,
                `⚠️ 绩点 = 加权总分 / 总学分`,
                `✨ 点击确定复制GitHub链接 ✨`,
                `📦 ${CONFIG.REPO_URL}`,
                `----------------------------------------------------------`,
                `✅ 总学分(不含免修)：${totalCredits}`,
                `🚩 加权总分(不含免修)：${weightedSum.toFixed(4)}`,
                `🎉 最终绩点(不含免修)：${totalCredits > 0 ? (weightedSum / totalCredits).toFixed(4) : 0}`,
                `----------------------------------------------------------`,
                `✅ 总学分(含免修)：${totalCreditsWithExemption}`,
                `🚩 加权总分(含免修)：${weightedSumWithExemption.toFixed(4)}`,
                `🎉 最终绩点(含免修)：${totalCreditsWithExemption > 0 ? (weightedSumWithExemption / totalCreditsWithExemption).toFixed(4) : 0}`,
            ].join('\n');

            createModal(resultMessage);

        } catch (error) {
            console.error('绩点计算错误:', error);
        }
    }

    // 剪贴板工具函数
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // DOM 观察器
    let observer;
    function initObserver() {
        if (observer) observer.disconnect();
        observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(node => {
                        if (node.tagName === 'IFRAME') {
                            node.addEventListener('load', () => injectButton());
                        }
                    });
                }
            });
            injectButton();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 路由变化检测
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            initObserver();
            setTimeout(injectButton, 1000);
        }
    }, 1000);

    // 初始化入口
    function initialize() {
        initObserver();
        setTimeout(injectButton, 1500);
    }

    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }

    window.addEventListener('popstate', () => {
        setTimeout(injectButton, 500);
    });

})();
