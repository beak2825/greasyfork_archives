// ==UserScript==
// @name         顺德区教师在线研修
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  登录，打开学习页面，将自动学习，每章节学习完后自动跳到下一个。
// @author       YYMSWY
// @match        https://zy.jsyx.sdedu.net/*
// @icon         https://zy.jsyx.sdedu.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436369/%E9%A1%BA%E5%BE%B7%E5%8C%BA%E6%95%99%E5%B8%88%E5%9C%A8%E7%BA%BF%E7%A0%94%E4%BF%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/436369/%E9%A1%BA%E5%BE%B7%E5%8C%BA%E6%95%99%E5%B8%88%E5%9C%A8%E7%BA%BF%E7%A0%94%E4%BF%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function play(){
        if($(".g-study-prompt p ")[0].innerText.indexOf("您已完成观看")>=0){
            $("#studySelectAct a")[1].click();
            return;
        }
        var timer1 = $(".g-study-prompt p span")[0].innerText;
        var timer2 = $(".g-study-prompt p span")[1].innerText;
        if (parseInt(timer1)<=parseInt(timer2)){
            $("#studySelectAct a")[1].click();
        }
    }

    $(function(){
         if(typeof($('video')[0])!="undefined") {
            $('video')[0].autoplay='true';
            $('video')[0].muted="muted";
        }

        var timeID=window.setInterval(function(){
            if(typeof($('video')[0])!="undefined") {
                try{
                    $('video')[0].play();
                }catch(ex){}
            }
            play();
            console.log('working');
            if($("input[name='response']").length>0)
            {
                console.log('1');
                var x=0,y=$("input[name='response']").length;
                var index=parseInt(Math.random()*y);
                $("input[name='response']")[index].checked='true';
                $('.m-common-btn .m-reExam-btn a button').click()
            }

        }, 1000);
    });
})();