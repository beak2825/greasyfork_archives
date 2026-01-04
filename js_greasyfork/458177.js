// ==UserScript==
// @name         刷正确率
// @version      2.1.1
// @description  北大青鸟云题库自动刷正确率(不计实际答题)
// @namespace    http://tampermonkey.net/
// @description  try to take over the world!
// @author       ahei126
// @include      https://tiku.ekgc.cn/*
// @match        https://tiku.kgc.cn/*
// @match        https://exam.bdqn.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458177/%E5%88%B7%E6%AD%A3%E7%A1%AE%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/458177/%E5%88%B7%E6%AD%A3%E7%A1%AE%E7%8E%87.meta.js
// ==/UserScript==

(function() {
      if(window.location.pathname=="tiku.ekgc.cn/testing/exam/againPaper/115587821"){
        //点击第一个再来一次
        //执行固定的再来一次
        setTimeout(againAnswer(115587821),2000)
    }else if(window.location.pathname=="/testing/exam/againPaper/115587821"){
        setTimeout(function(){
            $(".sec:eq(0) li span:contains('D')").click();
            $(".sec:eq(1) li span:contains('A')").click();
            $(".sec:eq(2) li span:contains('C')").click();
            $(".sec:eq(3) li span:contains('B')").click();
            $(".sec:eq(4) li span:contains('B')").click();
            $(".sec:eq(5) li span:contains('C')").click();
            $(".sec:eq(6) li span:contains('A')").click();
            $(".sec:eq(7) li span:contains('A')").click();
            $(".sec:eq(8) li span:contains('D')").click();
            $(".sec:eq(9) li span:contains('A')").click();
            $(".sec:eq(10) li span:contains('B')").click();
            $(".sec:eq(11) li span:contains('C')").click();
            $(".sec:eq(12) li span:contains('C')").click();
            $(".sec:eq(13) li span:contains('C')").click();
            $(".sec:eq(14) li span:contains('B')").click();
            $(".sec:eq(15) li span:contains('B')").click();
            $(".sec:eq(16) li span:contains('A')").click();
            $(".sec:eq(17) li span:contains('A')").click();
            $(".sec:eq(18) li span:contains('D')").click();
            $(".sec:eq(19) li span:contains('A')").click();
        },1500);



        //提交按钮
        setTimeout(function(){
            $("#putIn").click()
        },1500)
        //确定提交
        setTimeout(function(){
            $("#putInBtn").click()
        },1500)


        setInterval(function(){
            if($("#testDialog").is(":visible")){
                $("#closeReturnDialog").click()
            }
        },500)
    }else{
        location.href="https://tiku.ekgc.cn/testing/exam/againPaper/115587821";
    }


})();