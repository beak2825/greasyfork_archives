// ==UserScript==
// @name         石墨文档 / 忽略保存快捷键
// @namespace    http://ghoulmind.com
// @version      0.1
// @description  编辑石墨文档时，按下 Ctrl+s 或者 Cmd+S 不再弹出保存对话框
// @author       greatghoul
// @match        https://shimo.im/spreadsheet/*
// @match        https://shimo.im/doc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27326/%E7%9F%B3%E5%A2%A8%E6%96%87%E6%A1%A3%20%20%E5%BF%BD%E7%95%A5%E4%BF%9D%E5%AD%98%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/27326/%E7%9F%B3%E5%A2%A8%E6%96%87%E6%A1%A3%20%20%E5%BF%BD%E7%95%A5%E4%BF%9D%E5%AD%98%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ignoreSaveShortcut(event) {
        if ((event.ctrlKey || event.metaKey) && event.keyCode == 83) {
            event.preventDefault();
            return false;
        }
    }

    window.addEventListener('keydown', ignoreSaveShortcut, false);
})();