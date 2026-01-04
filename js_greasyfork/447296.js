// ==UserScript==
// @name        联大学堂河南理工大学函授本科考试自动答题
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  联大学堂河南理工大学函授本科考试自动答题,其他学校的不知道管用不管用
// @author       sf
// @match        https://*.jxjypt.cn/paper/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447296/%E8%81%94%E5%A4%A7%E5%AD%A6%E5%A0%82%E6%B2%B3%E5%8D%97%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E5%87%BD%E6%8E%88%E6%9C%AC%E7%A7%91%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/447296/%E8%81%94%E5%A4%A7%E5%AD%A6%E5%A0%82%E6%B2%B3%E5%8D%97%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E5%87%BD%E6%8E%88%E6%9C%AC%E7%A7%91%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $(()=>{
        var sftime = 3000
        var sfAnswer = function(element){
            $.get("https://kc.jxjypt.cn/classroom/favorite/question/view?qid=" + element.value + "&ver=0", function(res){
                try{
                    $(res).find(".right")[0].innerText;
                    var daan = $(res).find(".right").text();
                    //判断题
                    if(daan == "正确" || daan == "对"){
                        if (daan == "对") daan = "正确";
                        $(element).parent().find("dd[data-value='" + daan + "']").click();
                        return;
                    }
                    if(daan == "错误" || daan == "错"){
                        if (daan == "错") daan = "错误";
                        $(element).parent().find("dd[data-value='" + daan + "']").click();
                        return;
                    }
                    //单选多选共用
                    daan = daan.split("");
                    for(var i = 0; i < daan.length; i++){
                        $(element).parent().find("dd[data-value='" + daan[i] + "']").click();
                    }
                }catch(e){
                    //填空题
                    var daan = $(res).find(".wenzi").first().text().trim();
                    $(element).parent().find(".e__textarea").val(daan);
                    //$(element).parent().find(".e__textarea").change();
                    var event = document.createEvent("HTMLEvents");
                    event.initEvent("change",true,true);
                    $(element).parent().find(".e__textarea")[0].dispatchEvent(event);
                }
            });
        }
        //自动答题单元
        $("input[name^='qid']").each(function(index, element){
            element.addEventListener("click",function(){
                sfAnswer(element);
            });
        });
        //自动答题
        $("input[name^='qid']").each(function(index, element){
            (
                function(i,a){
                    setTimeout(function(){
                        $(a).click();
                        fun_goto_question(i+1,1);
                    }, sftime*i);
                }(index,element)
            )
        });
    })
})();