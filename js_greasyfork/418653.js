// ==UserScript==
// @name         安财URP教务系统助手
// @namespace    http://github.com/
// @version      0.1.1
// @description  进行快速教学评估，用于辅助URP教务系统的使用，
// @author       匿名
// @match        http://jwcxk2.aufe.edu.cn/student/teachingEvaluation/evaluation/evaluationPage
// @grant        xfl03
// @downloadURL https://update.greasyfork.org/scripts/418653/%E5%AE%89%E8%B4%A2URP%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/418653/%E5%AE%89%E8%B4%A2URP%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function () {

        //自动选择最优选项
        var keyWord=["非常好"];
        $(".ace").each(function(){
            var self=$(this);
            var text=$(this).next().next().html();
            keyWord.forEach(function(value){
                if(text.indexOf(value)!=-1)
                    self.click();
            });
            console.log(text);
        })

        //自动填写主观评价
        var content="上课有热情，精神饱满，有感染力";//自行填写
        $("textarea").val(content);

//两分钟后提交
        setTimeout(function(){$("#buttonSubmit").click()},1000*60*2.1);



    });


})();