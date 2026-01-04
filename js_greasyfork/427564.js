// ==UserScript==
// @name         天工大URP教务系统助手
// @version      1.4
// @description  进行快速教学评估。
// @author       ZLY
// @license MIT
// @match        http://jwxs.tiangong.edu.cn/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @grant       none
// @namespace https://greasyfork.org/users/780254
// @downloadURL https://update.greasyfork.org/scripts/427564/%E5%A4%A9%E5%B7%A5%E5%A4%A7URP%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/427564/%E5%A4%A9%E5%B7%A5%E5%A4%A7URP%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function () {
        var keyWord=["优"];
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