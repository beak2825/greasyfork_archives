// ==UserScript==
// @name         知乎账号回答屏蔽工具
// @namespace    https://hmilyld.com/
// @version      0.1
// @description  屏蔽知乎盐选等账号
// @author       Hmilyld
// @match        https://www.zhihu.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417756/%E7%9F%A5%E4%B9%8E%E8%B4%A6%E5%8F%B7%E5%9B%9E%E7%AD%94%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/417756/%E7%9F%A5%E4%B9%8E%E8%B4%A6%E5%8F%B7%E5%9B%9E%E7%AD%94%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //需要屏蔽的用户
    var users = [
        "盐选科普","故事档案局","盐选推荐","真实故事计划"
    ]

    if ($('#ProfileMain').length > 0) {
        new MutationObserver(function (mutations) {
            remove_item();
        }).observe(document.getElementById('ProfileMain'), {
            childList: true,
            subtree: true,
        })
    }

    if ($('#QuestionAnswers-answers').length > 0) {
        new MutationObserver(function (mutations) {
            remove_item();
        }).observe(document.getElementById('QuestionAnswers-answers'), {
            childList: true,
            subtree: true,
        })
    }

    function remove_item() {
        $.each(users, function (idx, item) {
            $("meta[content='" + item + "']").closest(".List-item").hide();
        })
    }

    remove_item();
})();