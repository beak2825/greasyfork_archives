// ==UserScript==
// @name         豆瓣小组|Ctrl+Enter发表评论
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  豆瓣小组Ctrl+Enter发表评论，不需要再用鼠标点击发送。
// @author       You
// @match        *://www.douban.com/group/topic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392456/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%7CCtrl%2BEnter%E5%8F%91%E8%A1%A8%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/392456/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%7CCtrl%2BEnter%E5%8F%91%E8%A1%A8%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#last").keypress(function(e){
        if((window.event.keyCode == 13 || window.event.keyCode == 10) && (window.event.ctrlKey)){
            $("input[name=submit_btn]").click();
        }
    });
})();