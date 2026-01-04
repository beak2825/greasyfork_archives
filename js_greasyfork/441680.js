// ==UserScript==
// @name         天津商业大学URP高校教务管理系统教学评估助手
// @version      1.1
// @description  适用于天津商业大学URP高校教务管理系统进行快速教学评估。
// @author       卓尔不群（于博洋）
// @license MIT
// @match        http://stu.j.tjcu.edu.cn/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @grant       none
// @namespace https://greasyfork.org/zh-CN/scripts/441680-%E5%A4%A9%E6%B4%A5%E5%95%86%E4%B8%9A%E5%A4%A7%E5%AD%A6urp%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B
// @downloadURL https://update.greasyfork.org/scripts/441680/%E5%A4%A9%E6%B4%A5%E5%95%86%E4%B8%9A%E5%A4%A7%E5%AD%A6URP%E9%AB%98%E6%A0%A1%E6%95%99%E5%8A%A1%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/441680/%E5%A4%A9%E6%B4%A5%E5%95%86%E4%B8%9A%E5%A4%A7%E5%AD%A6URP%E9%AB%98%E6%A0%A1%E6%95%99%E5%8A%A1%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function () {
        var keyWord=["优","非常满意","10分"];
        $(".ace").each(function(){
            var self=$(this);
            var text=$(this).next().next().html();
            keyWord.forEach(function(value){
                if(text.indexOf(value)!=-1)
                    self.click();
            });
            console.log(text);
        })
        var content="上课有热情，积极解决学生问题，很好的老师！！";//自行填写
        $("textarea").val(content);
        setTimeout(function(){$("#buttonSubmit").click()},127001);
    });
})();