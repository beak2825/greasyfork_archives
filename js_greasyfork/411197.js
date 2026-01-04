// ==UserScript==
// @name         Steam 进入评测页面自动点赞
// @namespace    https://steamcommunity.com/id/GarenMorbid/
// @version      1.0
// @description  Steam 进入评测页面自动使用当前用户点赞
// @author       Garen
// @match        https://steamcommunity.com/id/*/recommended/*
// @match        https://steamcommunity.com/profiles/*/recommended/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411197/Steam%20%E8%BF%9B%E5%85%A5%E8%AF%84%E6%B5%8B%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/411197/Steam%20%E8%BF%9B%E5%85%A5%E8%AF%84%E6%B5%8B%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
     // 批量点赞，支持好友动态以及评测动态
        var list = document.getElementsByClassName('thumb_up');
        // 需要点赞的动态数
        var count = 0;
        // 循环遍历点赞
        for(var i = 0;i < list.length; i++){
            if (list[i].parentNode.parentNode.getAttribute('class').indexOf('active') == -1) {
                list[i].click();
                count++;
            }
        }
        // 添加友好提示
        if (count != 0) {
            // alert("已经为你点赞" + count + "动态~");
            console.log("%c已经为你点赞" + count + "动态~ By Garen","color:white;font-weight:bold;font-family:'微软雅黑';background:#000;padding:5px;");
        } else {
            // alert("目前没有动态可以点赞，请稍后再来~");
            console.log("%c目前没有动态可以点赞，请稍后再来~ By Garen","color:white;font-weight:bold;font-family:'微软雅黑';background:#000;padding:5px;");
        }
})();