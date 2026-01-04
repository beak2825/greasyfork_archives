// ==UserScript==
// @name         我不想看到你们谈话
// @version      0.1
// @description  默认关闭课程中的对话框
// @author       Iko
// @license      CC BY-NC
// @namespace    https://github.com/iko233
// @match        https://www.fenbi.com/spa/webclass/class/*
// @grant        none
// @icon         https://nodestatic.fbstatic.cn/weblts_spa_online/page/assets/fenbi32.ico
// @downloadURL https://update.greasyfork.org/scripts/546520/%E6%88%91%E4%B8%8D%E6%83%B3%E7%9C%8B%E5%88%B0%E4%BD%A0%E4%BB%AC%E8%B0%88%E8%AF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/546520/%E6%88%91%E4%B8%8D%E6%83%B3%E7%9C%8B%E5%88%B0%E4%BD%A0%E4%BB%AC%E8%B0%88%E8%AF%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function close() {
        let elements = document.getElementsByClassName("push");
        for(let i=0;i<elements.length;i++){
            elements[i].click();
        }
    }

    // 初次运行
    close();
    // Your code here...
})();