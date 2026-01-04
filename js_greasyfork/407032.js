// ==UserScript==
// @name         去网页版有道云广告
// @namespace    有道云笔记
// @version      0.1
// @description  去掉左下角广告，拉高文件夹显示列表
// @author       Simet.Zeng
// @match        https://note.youdao.com/*/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407032/%E5%8E%BB%E7%BD%91%E9%A1%B5%E7%89%88%E6%9C%89%E9%81%93%E4%BA%91%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/407032/%E5%8E%BB%E7%BD%91%E9%A1%B5%E7%89%88%E6%9C%89%E9%81%93%E4%BA%91%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload=function (){
        var sidebarFt = document.getElementsByClassName('sidebar-ft')[0];
        sidebarFt.parentNode.removeChild(sidebarFt);

        document.getElementsByClassName('sidebar-content')[0].style.bottom = 0;
    };
})();