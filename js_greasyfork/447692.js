// ==UserScript==
// @name         天职师大URP教务系统助手
// @description  快速教评助手
// @author       鲈鱼老师
// @version 0.4
// @license MIT
// @match        https://urpst.tute.edu.cn/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @grant       none
// @namespace https://greasyfork.org/users/831685
// @downloadURL https://update.greasyfork.org/scripts/447692/%E5%A4%A9%E8%81%8C%E5%B8%88%E5%A4%A7URP%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447692/%E5%A4%A9%E8%81%8C%E5%B8%88%E5%A4%A7URP%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function () {
        var keyWord=["很好"];
        $(".ace").each(function(){
            var self=$(this);
            var text=$(this).next().next().html();
            keyWord.forEach(function(value){
                if(text.indexOf(value)!=-1)
                    self.click();
            });
            console.log(text);
        })
        var content="上课有热情，积极解决学生问题，好帅的老师";//自行填写
        $("textarea").val(content);
        setTimeout(function(){$("#buttonSubmit").click()},1000*60*2.2);
    });
})();