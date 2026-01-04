// ==UserScript==
// @name         齐大URP教务系统助手
// @version      1.3
// @description  进行快速教学评估。
// @author       djy
// @match        http://111.43.36.164/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @match        http://172.20.139.153:7700/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @match        https://172-20-139-153-7700.webvpn.qqhru.edu.cn/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @grant       none
// @namespace https://greasyfork.org/users/737539
// @downloadURL https://update.greasyfork.org/scripts/464874/%E9%BD%90%E5%A4%A7URP%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/464874/%E9%BD%90%E5%A4%A7URP%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function () {
        var keyWord=["(A)"];
        $(".ace").each(function(){
            var self=$(this);
            var text=$(this).next().next().html();
            keyWord.forEach(function(value){
                if(text.indexOf(value)!=-1)
                    self.click();
            });
            console.log(text);
        })
//document.querySelector("#page-content-template > div > div > div.widget-content > form > div > table > tbody > tr:nth-child(25) > td > div > textarea")
        var content="上课有热情，积极解决学生问题，很好的老师！！";//自行填写
//        $("textarea").val(content);
        $("#page-content-template > div > div > div.widget-content > form > div > table > tbody > tr:nth-child(25) > td > div > textarea").val(content);
        setTimeout(function() {
            $("#buttonSubmit").click()
            setTimeout(function() {
                $("#layui-layer1 > div.layui-layer-btn > a.layui-layer-btn0").click()
                console.log("我提交啦");
            }, 1370);
        }, 137001);
    });
})();