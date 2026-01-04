// ==UserScript==
// @name         TAPD 5.0版本布局优化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  优化空间利用率
// @author       pfugwtg
// @match        https://www.tapd.cn/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/376983/TAPD%2050%E7%89%88%E6%9C%AC%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/376983/TAPD%2050%E7%89%88%E6%9C%AC%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentURL = window.location.href;
    var myWorktable = /my_worktable/;
    var storyView = /prong\/stories\/view/;
    var bugView = /bugtrace\/bugs\/view/;

    if (myWorktable.test(currentURL)) {//工作台
        var worktableWrap = document.getElementsByClassName("worktable-wrap")[0];
        worktableWrap.style.paddingLeft = '20px';
        worktableWrap.style.paddingRight = '20px';
        worktableWrap.style.paddingTop = '10px';
        worktableWrap.style.paddingBottom = '10px';

        var worktableCookie = $.cookie('new_worktable');
        if (/expiration_date/.test(worktableCookie)) {//工作台：截止日期列表
            setTimeout(function() {
                var worktableAction = document.getElementsByClassName("worktable-action")[0];
                worktableAction.style.top = '30px';

                var contentDiv = document.getElementById("content_div");
                contentDiv.style.left = '20px';
                contentDiv.style.right = '20px';
                contentDiv.style.top = '78px';
                contentDiv.style.bottom = '10px';

                var worktableFilterWrap = document.getElementsByClassName("worktable-filter-wrap")[0];
                worktableFilterWrap.style.right = '20px';
                worktableFilterWrap.style.bottom = '10px';
            }, 1000);
        } else {//工作台：常规列表
            document.getElementsByClassName("worktable-action-wrapper")[0].style.top = '-55px';

            var worktableTable = document.getElementsByClassName("worktable-table")[0];
            worktableTable.style.left = '20px';
            worktableTable.style.right = '20px';
            worktableTable.style.top = '78px';
            worktableTable.style.bottom = '10px';

            var worktableFilterWrap = document.getElementsByClassName("worktable-filter-wrap")[0];
            worktableFilterWrap.style.right = '20px';
            worktableFilterWrap.style.bottom = '10px';
        }
    } else if (storyView.test(currentURL) || bugView.test(currentURL)) {// Bug、需求详情
        document.getElementById("page-content").style.margin = '0';

        var tuiBs = document.getElementsByClassName("tui-b");
        tuiBs[0].style.height = '100%';
        tuiBs[1].style.height = '100%';
    }
})();