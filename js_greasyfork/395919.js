// ==UserScript==
// @name         HITSZ假期懒人系统
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @license MIT
// @author       You
// @include     https://www.wjx.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395919/HITSZ%E5%81%87%E6%9C%9F%E6%87%92%E4%BA%BA%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/395919/HITSZ%E5%81%87%E6%9C%9F%E6%87%92%E4%BA%BA%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var stunum = "180110110";
        var name = "您的姓名";
    var currentURL = window.location.href;
    //自动转为电脑网页版
    (function redirect() {
        try {
            var pat = /(https:\/\/www\.wjx\.cn\/)(jq|m)(.*)/g;
            var obj = pat.exec(currentURL);
            if (obj[2] == "m") {
                console.log("redirect now");
                window.location.href = obj[1] + "jq" + obj[3];
            } else {
                console.log("do!");
            }
        } catch (error) {}
    })();

    function judgeType() {

        var q = document.getElementsByClassName("div_question");
        
        var quesnum=0;
        for (var i = 0; i < q.length; i++) {
            //普通单选 or 多选
            if(q[i].querySelectorAll(".ulradiocheck")[0]!= undefined){
            if(q[i].querySelectorAll(".ulradiocheck")[0].getElementsByTagName("li").length==7 ){
                q[i].querySelectorAll(".ulradiocheck")[0].getElementsByTagName("li")[1].click();
            }
            else if (q[i].querySelectorAll(".ulradiocheck")[0].getElementsByTagName("li").length==2 ) {
                q[i].querySelectorAll(".ulradiocheck")[0].getElementsByTagName("li")[1].click();
            }
            }


            else {
             if (q[i].querySelectorAll("textarea").length==1 && quesnum==0) {
                q[i].querySelectorAll("textarea")[0].value =stunum;
                quesnum = quesnum +1;

                }
            else if (q[i].querySelectorAll("textarea").length==1 && quesnum==1) {
                   q[i].querySelectorAll("textarea")[0].value =name;

            }
            }
        }
    }
    judgeType();

    //滚动到提交按钮处
    window.onload = function() {

        try {
            var scrollvalue = document.getElementById("submit_button").offsetParent.offsetParent.offsetTop;
            window.scrollTo({
                top: scrollvalue,
                behavior: "smooth"
            });
        } catch (error) {
            console.log("error", error);
        }
    }
})();

