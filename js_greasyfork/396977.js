// ==UserScript==
// @name         游戏年轮自动回复
// @description  游戏年轮网站自动回复脚本
// @namespace    Violentmonkey Scripts
// @version      0.13
// @author       宋兵乙
// @match        https://www.bibgame.com/sgame*/*
// @match        https://www.bibgame.com/nsaita/*
// @grant        none
// @run-at context-menu

// @downloadURL https://update.greasyfork.org/scripts/396977/%E6%B8%B8%E6%88%8F%E5%B9%B4%E8%BD%AE%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/396977/%E6%B8%B8%E6%88%8F%E5%B9%B4%E8%BD%AE%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    //回复内容
    var content = "今天为大家带来的是这款游戏的最新更新补丁，有需要的玩家们可以来看看哦。";


    setTimeout(function() {
        document.getElementById("pl-520am-f-saytext").value = content;
        document.getElementById("pl-submit-btn-main").click();
    },
    1000)

})();