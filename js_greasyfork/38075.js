// ==UserScript==
// @name         AutoSign-TTG
// @name:zh-CN   自动签到-TTG
// @namespace    https://greasyfork.org/zh-CN/scripts/38075
// @version      0.1.1
// @description  自用TTG自动签到工具
// @author       亻紫菜彡
// @match        http*://totheglory.im/*
// @grant        none
// @run-at 		 document-end
// @downloadURL https://update.greasyfork.org/scripts/38075/AutoSign-TTG.user.js
// @updateURL https://update.greasyfork.org/scripts/38075/AutoSign-TTG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    clickSign();
})();

function clickSign() {
    var signBtn = document.getElementById("signed");
    if (!signBtn) {
        return;
    }
    var tag = signBtn.getElementsByTagName("b");
    if (tag[0].innerText == "签到") {
         signBtn.click();
    }
}