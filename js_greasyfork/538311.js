// ==UserScript==
// @name         Codeforces Toggle
// @namespace    http://codeforces.com/
// @version      1.6
// @description  在 Codeforces 题目页隐藏侧边栏
// @match        https://codeforces.com/problemset/problem/*/*
// @match        https://codeforces.com/contest/*/problem/*
// @match        https://codeforces.com/gym/*/problem/*
// @match        https://codeforces.com/group/*/contest/*/problem/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538311/Codeforces%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/538311/Codeforces%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建极简开关按钮
    function createSwitch() {
        const switchDiv = document.createElement('span');
        switchDiv.style.display = 'flex';
        switchDiv.style.alignItems = 'center';
        switchDiv.style.marginLeft = '10px';
        switchDiv.id = 'cfSimpleSwitch';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.title = 'Auto';
        checkbox.style.width = '18px';
        checkbox.style.height = '18px';
        checkbox.style.cursor = 'pointer';

        // 读取本地状态
        const saved = localStorage.getItem('cf_simple_mode');
        if (saved === 'on') checkbox.checked = true;

        switchDiv.appendChild(checkbox);

        // 切换函数
        function setSimpleMode(on) {
            const div = document.getElementById('pageContent');
            const sidebar = document.getElementById('sidebar');
            if (on) {
                if (div) div.classList.remove('content-with-sidebar');
                if (sidebar) sidebar.style.display = 'none';
                document.body.style.zoom = '1.15'; // 放大页面
            } else {
                if (div) div.classList.add('content-with-sidebar');
                if (sidebar) sidebar.style.display = '';
                document.body.style.zoom = '1'; // 恢复页面
            }
        }

        // 初始化
        setSimpleMode(checkbox.checked);

        // 监听开关变化（只有点击才记忆和操作）
        checkbox.addEventListener('change', function() {
            setSimpleMode(this.checked);
            localStorage.setItem('cf_simple_mode', this.checked ? 'on' : 'off');
        });

        // Alt+Q 快捷键切换（同步切换页面大小）
        document.addEventListener('keydown', function(e) {
            if (e.altKey && e.key.toLowerCase() === 'q') {
                const div = document.getElementById('pageContent');
                const sidebar = document.getElementById('sidebar');
                // 反转当前页面状态
                const nowSimple = div && !div.classList.contains('content-with-sidebar');
                if (nowSimple) {
                    if (div) div.classList.add('content-with-sidebar');
                    if (sidebar) sidebar.style.display = '';
                    document.body.style.zoom = '1'; // 恢复页面
                } else {
                    if (div) div.classList.remove('content-with-sidebar');
                    if (sidebar) sidebar.style.display = 'none';
                    document.body.style.zoom = '1.15'; // 放大页面
                }
            }
        });

        return switchDiv;
    }

    // 插入到 problemToolbar，使用 MutationObserver 适配异步加载
    function tryInsertSwitch() {
        const toolbar = document.getElementById('problemToolbar');
        if (toolbar && !document.getElementById('cfSimpleSwitch')) {
            toolbar.appendChild(createSwitch());
            return true;
        }
        return false;
    }

    if (!tryInsertSwitch()) {
        // 监听 DOM 变化，直到 problemToolbar 出现
        const observer = new MutationObserver(() => {
            if (tryInsertSwitch()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();