// ==UserScript==
// @name         i博思助手加快进度解锁(西亚斯)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  西亚斯i博思用来解锁课程进度，机器学习课程慎用！！！
// @author       CreaterYan
// @match        http://sias.iflysse.com/*
// @requier      http://sias.iflysse.com/Scripts/common/jquery.min.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/436273/i%E5%8D%9A%E6%80%9D%E5%8A%A9%E6%89%8B%E5%8A%A0%E5%BF%AB%E8%BF%9B%E5%BA%A6%E8%A7%A3%E9%94%81%28%E8%A5%BF%E4%BA%9A%E6%96%AF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436273/i%E5%8D%9A%E6%80%9D%E5%8A%A9%E6%89%8B%E5%8A%A0%E5%BF%AB%E8%BF%9B%E5%BA%A6%E8%A7%A3%E9%94%81%28%E8%A5%BF%E4%BA%9A%E6%96%AF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* 自动点击下一页,能够自动切换到下一章节 */
    var $ns = $("#nextStep");
    var interval1 = setInterval(function() {
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        if($ns.css("display") !== "none"){
            document.getElementById("nextStep").dispatchEvent(e);
        }
        document.querySelector("div.buttons > button") && document.querySelector("div.buttons > button").dispatchEvent(e);
        /* 欸！没有办法，没有题库，只能这样弄 */
        /* 试题自动选择（默认选第一项），简答题默认输入，然后提交 */
        if($("#context > #noprogramme > div > div.option > ul#practiceUl > li > div.iradio_square-blue").length || $("#practiceUl > li:nth-child(1) > div").length || !$("#stuanswer").textLength) {
            $("#context > #noprogramme > div > div.option > ul#practiceUl > li > div.iradio_square-blue").eq(0).addClass("checked");
            $("#practiceUl > li:nth-child(1) > div").addClass("checked");
            $("#stuanswer").text("我爱i博思");
        }
        if(document.getElementById("sumbit").style.display !== 'none') {
            sleep(1000);
            document.getElementById("sumbit").dispatchEvent(e);
            sleep(1000);
            if($ns.css("display") == "none") {
                $ns.removeAttr("disabled");
                $ns.css("display", "block");
            }
        }
        /* 视频播放 */
        //判断视频是否暂停，若暂停则继续播放
        var $vedioBar = $("div.prism-progress > div.prism-progress-played");
        if($vedioBar.css('width') !== "0%" ){
            var vedio = document.querySelector("#a1 > video");
            vedio.muted = true;
            vedio.playbackRate=16.0;
        }
    },5000);
    //定时器暂停一会
    function sleep(delay) {
        var start = (new Date()).getTime();
        while((new Date()).getTime() - start < delay) {
            continue;
        }
    }
})();