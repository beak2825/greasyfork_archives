// ==UserScript==
// @name         Gitee页面清理
// @namespace    https://gitee.com/hbk01/GiteePageCleaner
// @version      0.2.5
// @description  Gitee 总是喜欢在页面里添加一些花里胡哨的东西，我不想看到它们！
// @author       黑白课
// @supportURL   https://gitee.com/hbk01/GiteePageCleaner/issues
// @match        https://gitee.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401283/Gitee%E9%A1%B5%E9%9D%A2%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/401283/Gitee%E9%A1%B5%E9%9D%A2%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.URL.startsWith("https://gitee.com/")) {
        log("This page is gitee, run clean.");
        var cleanList = [
            document.getElementsByClassName("ui red label")[0], // 企业版的“特惠” 标识
            document.getElementsByClassName("side-toolbar")[0], // 右边的悬浮按钮
            document.getElementsByClassName("iconfont icon-recommend recommend-icon")[0], // "自荐" 按钮
            document.getElementsByClassName("project-donate-overview")[0], // "捐赠" 按钮
            // document.getElementsByClassName("ui large orange donate button")[0], // "捐赠" 按钮
            document.getElementsByClassName("ui gradient button repo-action")[2], // "挂件" 按钮
            document.getElementsByClassName("ui gradient button repo-action")[0], // "挂件" 按钮(应对未登录的时候)
            document.getElementsByClassName("ui gradient button repo-action left attached")[0], // "+ Pull Request" 按钮
            document.getElementsByClassName("ui gradient button repo-action right attached")[0], // "+ Issue" 按钮
            document.getElementsByClassName("row column inner-comment")[0], // "点评" 条
            document.getElementsByClassName("inner-comment-box")[0], // "点评" 输入框
            document.getElementById("comment-box"), // "点评" 输入框
            document.getElementById("blob-comment"), // "点评" 条
            // document.getElementsByClassName("item gitosc-logo")[0], // logo
            document.getElementsByClassName("register-guide")[0], // 未登录时的“加入Gitee”
            document.getElementsByClassName("ui card")[0], // 工作台的企业版推荐
            document.getElementsByClassName("recommend__container")[0], // 推荐关注与推荐仓库
            document.getElementsByClassName("gitee-stars-main-widget pendan-widget")[0], // 左下角推广窗口
            document.getElementsByClassName("udesk_container")[0], // 右边的客服按钮
            // document.getElementsByClassName("")[0],
        ];
        for (var i = 0; i < cleanList.length; i++){
            try {
                if (cleanList[i] instanceof Element){
                    log("Clean ['" + cleanList[i].className + "']");
                    cleanList[i].remove();
                } else if (cleanList[i] instanceof HTMLCollection) {
                    // It's an list
                    if (cleanList[i].length == 1) {
                        log("Clean ['" + cleanList[i][0].className + "']");
                        cleanList[i][0].remove();
                        break;
                    }
                    for (var j = 0; j < cleanList[i].length; j++) {
                        log("Clean ['" + cleanList[i][j].className + "']");
                        cleanList[i][j].remove();
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
})();

function log(msg){
    console.log("Gitee Cleaner: " + msg);
}
