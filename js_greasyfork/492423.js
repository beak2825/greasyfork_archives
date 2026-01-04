// ==UserScript==
// @name         评教
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  qd
// @author       droit
// @match        https://172-20-139-153-7700.webvpn.qqhru.edu.cn/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @match        http://111.43.36.164/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @match        http://172.20.139.153:7700/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492423/%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/492423/%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var keyWord = ["(A)"];
    $(".ace").each(function(){
        var self = $(this);
        var text = $(this).next().next().html();
        keyWord.forEach(function(value){
            if(text.includes(value)) {
                self.click();
            }
        });
        console.log(text);
    });
    var content = "上课有热情，积极解决学生问题。"; // 自行修改填写
    $("#page-content-template > div > div > div.widget-content > form > div > table > tbody > tr:nth-child(25) > td > div > textarea").val(content);

    setTimeout(function() {
        $("#buttonSubmit").click();
        setTimeout(function() {
            $("#layui-layer1 > div.layui-layer-btn > a.layui-layer-btn0").click();
            console.log("我提交啦");
        }, 1370);
    }, 137001);
    function checkTimerEnd() {
        var minutes = parseInt(document.getElementById("RemainM").innerHTML);
        var seconds = parseInt(document.getElementById("RemainS").innerHTML);

        if (minutes === 0 && seconds === 0) {
            document.getElementById("RemainS").innerHTML = "0";
            flag = true;
            document.getElementById("js").remove();
            console.log("倒计时结束");
            $("#buttonSubmit").click();
        }
    }

    setInterval(checkTimerEnd, 1000);

})();