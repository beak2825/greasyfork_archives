// ==UserScript==
// @name         apicmob-cms mod
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  apicmob-cms后台mod
// @match        https://cms.apicmob.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542162/apicmob-cms%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/542162/apicmob-cms%20mod.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let isRunning = false;
    let deletedCount = 0;
    let isCollapsed = false;

    function isTargetPage() {
        return true;
    }

    function insertControlPanel() {
        const existingPanel = document.getElementById('auto-delete-panel');
        if (existingPanel) return;

        const panel = document.createElement('div');
        panel.id = 'auto-delete-panel';
        panel.style.position = 'fixed';
        panel.style.top = '20px';
        panel.style.right = '20px';
        panel.style.zIndex = '9999';
        panel.style.background = 'rgba(0, 0, 0, 0.7)';
        panel.style.color = '#fff';
        panel.style.padding = '12px 18px';
        panel.style.borderRadius = '10px';
        panel.style.boxShadow = '0 0 10px #000';
        panel.style.fontSize = '14px';
        panel.innerHTML = `
            <button id="toggle-panel-btn" style="padding: 4px 8px; margin-bottom: 8px;">⯆ 折叠</button>
            <div id="panel-content">
                <div id="delete-status">状态：未运行</div>
                <div id="delete-progress">已删除：0 项</div>
                <button id="delete-start-btn" style="margin-top: 10px; padding: 6px 12px;">开始自动删除</button>
            </div>
        `;
        document.body.appendChild(panel);

        const statusEl = document.getElementById('delete-status');
        const progressEl = document.getElementById('delete-progress');
        const startBtn = document.getElementById('delete-start-btn');
        const toggleBtn = document.getElementById('toggle-panel-btn');
        const contentDiv = document.getElementById('panel-content');

        startBtn.addEventListener('click', () => {
            if (isRunning) {
                isRunning = false;
                startBtn.textContent = '开始自动删除';
                statusEl.textContent = '状态：已停止';
            } else {
                isRunning = true;
                startBtn.textContent = '停止自动删除';
                statusEl.textContent = '状态：运行中';
                deletedCount = 0;
                deleteResourcesLoop(statusEl, progressEl, startBtn);
            }
        });

        toggleBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            contentDiv.style.display = isCollapsed ? 'none' : 'block';
            toggleBtn.textContent = isCollapsed ? '⯈ 展开' : '⯆ 折叠';
        });
    }

    async function deleteResourcesLoop(statusEl, progressEl, startBtn) {
        while (isRunning) {
            const rows = document.querySelectorAll('#pane-BuildResources tbody tr');
            if (rows.length === 0) {
                statusEl.textContent = '状态：完成 ✅';
                startBtn.textContent = '开始自动删除';
                isRunning = false;
                break;
            }

            const deleteBtn = rows[0].querySelector('button.el-button.el-tooltip.d2-ml-10.el-button--text.el-button--default.el-popover__reference');
            if (!deleteBtn) {
                statusEl.textContent = '状态：找不到删除按钮 ❌';
                isRunning = false;
                break;
            }

            console.log("点击删除按钮");
            deleteBtn.click();

            let confirmBtn = null;
            for (let i = 0; i < 20; i++) {
                confirmBtn = Array.from(document.querySelectorAll('button.el-button--primary.el-button--mini'))
                    .find(btn => btn.textContent.includes("确") || btn.textContent.includes("确认"));
                if (confirmBtn) break;
                await sleep(300);
            }

            if (confirmBtn) {
                console.log("点击确认按钮");
                confirmBtn.click();
            } else {
                console.warn("未找到确认按钮，退出");
                statusEl.textContent = '状态：未找到确认按钮 ❌';
                isRunning = false;
                break;
            }

            deletedCount++;
            progressEl.textContent = `已删除：${deletedCount} 项`;

            await sleep(1500);
        }
    }

    function moveControlDiv() {
        const target = document.querySelector('.appic-scope-manage-body_top_right-rI5ycd');
        const container = document.querySelector('.d2-container-full');
        if (target && container) {
            target.parentNode.removeChild(target);
            container.appendChild(target);
            console.log('已移动操作按钮到 header 区域');
        }
    }

    function onPageReady() {
        insertControlPanel();
        setTimeout(moveControlDiv,1000);
    }

    window.addEventListener('hashchange', () => {
        if (isTargetPage()) {
            console.log("进入 detials 页面，插入控制面板和移动元素");
            setTimeout(onPageReady, 1000);
        }
    });

    window.addEventListener('load', () => {
        if (isTargetPage()) {
            setTimeout(onPageReady, 1000);
        }
    });

    function waitForElements(selector, callback, interval = 500, maxAttempts = 20) {
        let attempts = 0;
        const timer = setInterval(() => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                clearInterval(timer);
                callback(elements);
            }
            if (++attempts > maxAttempts) clearInterval(timer);
        }, interval);
    }

    function addLeftFoldButtons() {
        document.querySelectorAll('.vtl-node').forEach((node, idx) => {
            const main = node.querySelector('.vtl-node-main');
            if (main && !main.querySelector('.left-toggle-btn')) {
                const btn = document.createElement('button');
                btn.textContent = '➖';
                btn.className = 'left-toggle-btn';
                btn.style.marginRight = '4px';
                btn.style.cursor = 'pointer';

                let collapsed = false;
                btn.addEventListener('click', () => {
                    let sibling = node.nextElementSibling;

                    // 查找兄弟中的 vtl-tree-margin 或 vtl-list
                    while (sibling && !sibling.className.includes('vtl-tree-margin') && !sibling.className.includes('vtl-list')) {
                        sibling = sibling.nextElementSibling;
                    }

                    if (sibling) {
                        collapsed = !collapsed;
                        sibling.style.display = collapsed ? 'none' : '';
                        btn.textContent = collapsed ? '➕' : '➖';
                        console.log(`第 ${idx} 个节点 ${collapsed ? '折叠' : '展开'}`);
                    } else {
                        console.warn(`第 ${idx} 个节点无兄弟子结构`, node);
                    }
                });

                main.prepend(btn);
            }
        });
    }

    waitForElements('.vtl-node', () => {
        addLeftFoldButtons();
        console.log('[✓] 左侧折叠按钮已添加（支持兄弟结构）');
    });
})();