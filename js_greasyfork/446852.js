// ==UserScript==
// @name         剔除百度首页新闻
// @namespace    http://baidu.com
// @version      0.3
// @description  当你打开百度首页，新闻模块会被自动剔除
// @author       Ganb
// @match        https://live.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/446852/%E5%89%94%E9%99%A4%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%96%B0%E9%97%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/446852/%E5%89%94%E9%99%A4%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%96%B0%E9%97%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    console.log("this hello comes from tampermonkey edited by Ganb!")
    var beforetext=''
    setInterval(function(){
        var asd=$(".webcast-chatroom___item").eq("-2").text();
        if(asd!=''&&asd!=beforetext){
            beforetext=asd;
            $.get('http://localhost:8088/danmu?danmu='+asd,function(res){
                console.log("弹幕",asd,res)
            })
        }
    }, 1 * 1000);
})();