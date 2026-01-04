// ==UserScript==
// @name         腾讯课堂自动签到
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  实现腾讯课堂自动签到功能
// @author       yicao
// @match        https://ke.qq.com/webcourse/*
// @grant        none
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/400629/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/400629/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = $ || window.$;
    var url = window.location.href;


    $(function(){
        var i = 1;
        setInterval(function(){
            var a = $(".s-btn.s-btn--primary.s-btn--m");
            if(a.length != 0 && a.text() == "签到"){
                a.click();
                var ss = localStorage.getItem("yicao_resign");
                if (ss == null) ss = "";
                var now = new Date();
                ss += "\n" + now.toLocaleDateString()+ "--" + now.toLocaleTimeString();
                // console.log("签到成功!  第" + i++ + "次循环");
                localStorage.setItem("yicao_resign",ss);
            } else{
                // 没有找到签到按钮
                // console.log("签到框没有出现...第" + i++ + "次循环");
            }
        }, 1000);

        setTimeout(function(){
            // 在屏幕中间添加一个按钮，点击后显示签到记录
            var btn = "<button id='findHistoryBtn' style='margin-left:15px' >查看记录</button>"
            var studyHeader = $(".study-header");
            var existedBtn = studyHeader.children()[2];
            $(existedBtn).after(btn);
            $("body").on("click", "#findHistoryBtn", function(){
                var ss = localStorage.getItem("yicao_resign");
                if (ss == null) {
                    console.log("暂无签到记录");
                } else {
                    console.log(ss);
                }
            })
        }, 1000);

    })

})();