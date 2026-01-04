// ==UserScript==
// @name         问卷星允许选中复制粘贴
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       fcwys
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   safari
// @description  解除问卷星选中复制粘贴的限制
// @license      MIT
// @icon         https://www.wjx.cn/favicon.ico
// @match        *://*.wjx.cn/*
// @match        *://*.wjx.top/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461941/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%85%81%E8%AE%B8%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/461941/%E9%97%AE%E5%8D%B7%E6%98%9F%E5%85%81%E8%AE%B8%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //允许右键
    document.oncontextmenu = function () {
        return true;
    };
    //允许选中
    document.onselectstart = function () {
        return true;
    };
    $("html,body,div").css("user-select", "text");
    //允许输入框粘贴
    $(".textCont,input,textarea").off("paste");
    //允许输入框右键
    $(".textCont,input,textarea").off("contextmenu");
})();
