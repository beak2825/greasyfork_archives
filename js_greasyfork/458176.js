// ==UserScript==
// @name         刷实际答题
// @version      2.1.1
// @description  北大青鸟云题库自动刷实际答题(不计正确率)
// @namespace    http://tampermonkey.net/
// @author       ahei126
// @include      https://tiku.ekgc.cn/*
// @match        https://tiku.kgc.cn/*
// @match        https://exam.bdqn.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458176/%E5%88%B7%E5%AE%9E%E9%99%85%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/458176/%E5%88%B7%E5%AE%9E%E9%99%85%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {

    var array = ["A","B","C","D"];
    if(window.location.pathname!="/testing/exam/random/fuxiAuto/1089001004" && window.location.pathname!="/testing/exam/paper"){
        window.location.href="https://tiku.ekgc.cn/testing/exam/random/fuxiAuto/1089001004"

    }else{
        setTimeout(function(){
            $(".sec ul li").click()
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
    }


})();