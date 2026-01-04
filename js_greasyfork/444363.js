// ==UserScript==
// @name         升学 E 网通 (EWT360) 试卷自动完成 (选择题) 修复版
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  一键完成 E 网通试卷选择题 | Auto Complete EWT
// @author       yzxoi & mogumc
// @match        *://web.ewt360.com/mystudy*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444363/%E5%8D%87%E5%AD%A6%20E%20%E7%BD%91%E9%80%9A%20%28EWT360%29%20%E8%AF%95%E5%8D%B7%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%20%28%E9%80%89%E6%8B%A9%E9%A2%98%29%20%E4%BF%AE%E5%A4%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/444363/%E5%8D%87%E5%AD%A6%20E%20%E7%BD%91%E9%80%9A%20%28EWT360%29%20%E8%AF%95%E5%8D%B7%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%20%28%E9%80%89%E6%8B%A9%E9%A2%98%29%20%E4%BF%AE%E5%A4%8D%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var reportId;
    function getQueryVariable(variable){
        var query = window.location.href;
        query = query.substring(query.indexOf("?") + 1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }
    function error(){
        alert("错误了");
    }
    if (window.location.href.indexOf("exam/answer") != -1){
        $("html").append("<button id='ewt_auto' style='position: fixed;right: 10px;bottom: 10px;font-size: 20px;padding: 10px 20px;border: none;outline: none;background: #5e72e4;color: #fff;border-radius: 5px;box-shadow: 0 2px 5px rgba(0, 0, 0, .2);'>自动做选择题</button>");
    }
    $("#ewt_auto").on("click", function(){
        $("#ewt_auto").css("pointer-events", "none");
        $("#ewt_auto").css("background", "#666");
        getPaperInfo();
    });
    function getPaperInfo(){
        $("#ewt_auto").text("1.获取题目信息中...");
        $.ajax({
            url : "https://web.ewt360.com/customerApi/api/studyprod/web/answer/paper?paperId=" + getQueryVariable("paperId") + "&platform=" + getQueryVariable("platform") + "&bizCode=" + getQueryVariable("bizCode") + "&reportId=0&isRepeat=0",
            type : "GET",
            dataType : "json",
            success : function(result){
                $("#ewt_auto").text("3.自动做题目中...");
                autoCompleteProblems(result.data.questions);
            },
            error : function(xhr){
                error();
            }
        });
    }
    function getNum(str,firstStr,secondStr){
        if(str == "" || str == null || str == undefined){ // "",null,undefined
            return "";
        }
        if(str.indexOf(firstStr)<0){
            return "";
        }
        var subFirstStr=str.substring(str.indexOf(firstStr)+firstStr.length,str.length);
        var subSecondStr=subFirstStr.substring(0,subFirstStr.indexOf(secondStr));
        return subSecondStr;
    }
    function autoCompleteProblems(probs){
        if (probs == null || probs == undefined){
            return;
        }
        for (let prob of probs){
            var ids = prob.id;
            let div = $("#ewt-question-" + ids);
            $(".option-item", div).each(function(index, item) {//清空所有选项
                if ($(item).hasClass("selected")){
                    $(item).click();
                }
            });
            var rights;
            $.ajax({
                url : "https://web.ewt360.com/customerApi/api/studyprod/web/answer/quesiton/analysis?questionId="+ids+"&paperId=" + getQueryVariable("paperId") + "&platform=" + getQueryVariable("platform") + "&bizCode=" + getQueryVariable("bizCode")+"&reportId=0&isRepeat=0",
                type : "GET",
                dataType : "json",
                success : function(result){
                    let divs,questionContent,method,info,methd;
                    for(let cq of result.data.childQuestions){
                         if (cq == null){
                            continue;
                        }
                        divs = $("#ewt-question-" + cq.id);
                        for(let ans of cq.rightAnswer){
                            if (ans == null){
                                continue;
                            }
                            $(".option-item[data-reactid$='$" + ans + "']", divs).click();
                        }
                    }
                    for(let ans of result.data.rightAnswer){
                        if (ans == null){
                            continue;
                        }
                        $(".option-item[data-reactid$='$" + ans + "']", div).click();
                    }
                },
                error : function(xhr){
                    error();
                }
            });
            if (ids == null){
                continue;
            }
        }
        $("#ewt_auto").text("完成！");
    }
})();