// ==UserScript==
// @name         移动端网页文字编辑
// @version      1.2
// @description  在脚本菜单中手动启用或禁用网页编辑模式
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @namespace    https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/530967/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%BD%91%E9%A1%B5%E6%96%87%E5%AD%97%E7%BC%96%E8%BE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/530967/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%BD%91%E9%A1%B5%E6%96%87%E5%AD%97%E7%BC%96%E8%BE%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let editMode = false;

    function toggleEditMode() {
        editMode = !editMode;
        document.body.contentEditable = editMode;

        if (!editMode) {
            window.getSelection().removeAllRanges(); // 清除选区，避免光标残留
        }

        updateMenu();
    }

    function updateMenu() {
        setTimeout(() => {
            GM_registerMenuCommand(
                editMode ? '❌ 退出编辑模式' : '✏️ 进入编辑模式',
                toggleEditMode
            );
        }, 100);
    }

    // 初始化菜单
    updateMenu();
})();
