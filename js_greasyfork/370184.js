// ==UserScript==
// @name         爱问知识人查看所有回答
// @namespace    gqqnbig.me
// @version      0.1
// @description  不用再点击“查看更多全部答案”了
// @author       gqqnbig
// @match        https://iask.sina.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370184/%E7%88%B1%E9%97%AE%E7%9F%A5%E8%AF%86%E4%BA%BA%E6%9F%A5%E7%9C%8B%E6%89%80%E6%9C%89%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/370184/%E7%88%B1%E9%97%AE%E7%9F%A5%E8%AF%86%E4%BA%BA%E6%9F%A5%E7%9C%8B%E6%89%80%E6%9C%89%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#other_answer li").each(function()
    {
        $(this).css("display","");
    })

    $(".item-list-more-page").detach();
    $("#otherAnswerPage").show();
})();