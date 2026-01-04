// ==UserScript==
// @name         网页文字编辑
// @version      1.0
// @description  在脚本菜单中手动启用
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/490902/%E7%BD%91%E9%A1%B5%E6%96%87%E5%AD%97%E7%BC%96%E8%BE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/490902/%E7%BD%91%E9%A1%B5%E6%96%87%E5%AD%97%E7%BC%96%E8%BE%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let editMode = false;

    // 切换菜单名称
    function toggleMenuName() {
        if (editMode) {
            exitEditMode();
        } else {
            enterEditMode();
        }
        editMode = !editMode;
    }

    // 进入编辑模式
    function enterEditMode() {
        document.body.contentEditable = true;
        GM_registerMenuCommand('退出编辑模式', toggleMenuName);
    }

    // 退出编辑模式
    function exitEditMode() {
        document.body.contentEditable = false;
        GM_registerMenuCommand('进入编辑模式', toggleMenuName);
    }

    // 初始化菜单命令
    GM_registerMenuCommand('进入编辑模式', enterEditMode);
})();