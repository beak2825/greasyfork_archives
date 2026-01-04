// ==UserScript==
// @name         Cookie Editor
// @version      1.1
// @description  编辑cookies，在脚本菜单使用
// @author       DeepSeek
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/532508/Cookie%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/532508/Cookie%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册菜单命令
    GM_registerMenuCommand('编辑Cookies', editCookiesPrecisely, 'e');

    function editCookiesPrecisely() {
        // 获取当前所有cookie并转换为对象
        const currentCookies = document.cookie.split(';').reduce((obj, cookie) => {
            const [name, value] = cookie.trim().split('=');
            if (name) obj[name] = value || '';
            return obj;
        }, {});

        // 转换为编辑字符串（分号分隔）
        const editText = Object.entries(currentCookies)
            .map(([name, value]) => `${name}=${value}`)
            .join('; ');

        // 使用prompt弹窗编辑
        const newText = prompt('编辑Cookies（分号分隔格式）:\n\n注意：任何不在编辑框中的cookie将被删除', editText);
        if (newText === null) return; // 用户取消

        try {
            // 解析新cookie
            const newCookies = newText.split(';').reduce((obj, cookie) => {
                const [name, value] = cookie.trim().split('=');
                if (name) obj[name] = value || '';
                return obj;
            }, {});

            // 找出需要删除的cookie（原有但不在新列表中的）
            Object.keys(currentCookies).forEach(name => {
                if (!(name in newCookies)) {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
                }
            });

            // 设置新的或修改的cookie
            Object.entries(newCookies).forEach(([name, value]) => {
                document.cookie = `${name}=${value}; path=/`;
            });

            // 显示结果并刷新
            const changedCount = Object.keys(newCookies).length;
            const deletedCount = Object.keys(currentCookies).length - changedCount;
            alert(`Cookie更新完成:\n新增/修改: ${changedCount}个\n删除: ${deletedCount}个\n页面将刷新...`);
            setTimeout(() => location.reload(), 500);
            
        } catch (e) {
            alert('错误: ' + e.message);
        }
    }
})();