// ==UserScript==
// @name         去掉湖北考试网的等待时间
// @version      2025-06-24
// @description  屏蔽湖北考试网的等待时间 hbksw.cn
// @author       banjiu
// @match        *://*.hbksw.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @run-at      document-end
// @license      MIT License
// @namespace https://greasyfork.org/users/884018
// @downloadURL https://update.greasyfork.org/scripts/540641/%E5%8E%BB%E6%8E%89%E6%B9%96%E5%8C%97%E8%80%83%E8%AF%95%E7%BD%91%E7%9A%84%E7%AD%89%E5%BE%85%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/540641/%E5%8E%BB%E6%8E%89%E6%B9%96%E5%8C%97%E8%80%83%E8%AF%95%E7%BD%91%E7%9A%84%E7%AD%89%E5%BE%85%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("start")
    search = function(){
        console.log("replace")
    }
    time = function(){
        $(".modalPage").show();
        $(".hiddenBtn").attr("id", "sureBtn");
        $(".hiddenBtn").text("我已阅读并同意");
        $(".hiddenBtn").removeClass("nosearch-css");

        $("body").on("click", ".modalPage .hiddenBtn", function() {
            if (!$(".hiddenBtn").hasClass("nosearch-css")) {
                $(".modalPage").hide();
            }
        });
    }
})();