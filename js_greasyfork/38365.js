// ==UserScript==
// @name         腾讯问答自动提交工具
// @namespace    https://www.ixiqin.com/
// @version      0.1
// @description  Ctrl + Enter 自动提交问答
// @author       Bestony
// @match        https://cloud.tencent.com/developer/ask/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38365/%E8%85%BE%E8%AE%AF%E9%97%AE%E7%AD%94%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/38365/%E8%85%BE%E8%AE%AF%E9%97%AE%E7%AD%94%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function keyDown(e) {
        if (e.which == 13 && e.ctrlKey) {
            $("div.edit-btns>button.c-btn").click()
        }
    }
    document.onkeydown = keyDown;
})();