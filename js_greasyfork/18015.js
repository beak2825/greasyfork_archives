// ==UserScript==
// @name         安全培训考试系统辅助
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description 在http://61.128.255.173:8045/SpeJobCard/CheckInfo.aspx考试系统中直接显示答案
// @author      chuckie
// @match        http://61.128.255.173:8045/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18015/%E5%AE%89%E5%85%A8%E5%9F%B9%E8%AE%AD%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/18015/%E5%AE%89%E5%85%A8%E5%9F%B9%E8%AE%AD%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
showQuestion = function showQuestion(questionNo) 
{
    if (questionNo <= arrStu.length) 
    {
        if (questionNo == 1) 
        {
            $("#btnBefore").attr("disabled", true);
            $("#btnNext").val("下一题");
        } 
        else 
        {
            if (document.getElementById("btnStopExam").disabled == false) 
            {
                $("#btnBefore").attr("disabled", false);
            } 
            else 
            {
                $("#btnBefore").attr("disabled", true);
            }
            
            if (questionNo == arrStu.length) 
            {
                $("#btnNext").val("完成");
            } 
            else 
            {
                $("#btnNext").val("下一题");
            }
        }
    } 
    else 
    {
        return;
    }
    
    //arrStu下标
    var no = parseInt(questionNo) - 1;
    var perScore = parseInt(100 / parseInt($("#ctl00_ContentPlaceHolder1_lblQuestionCount").html()));
    var limitScore = 100 % parseInt($("#ctl00_ContentPlaceHolder1_lblQuestionCount").html());
    
    var innerHtm = "";
    switch (arrStu[no].Que_Type) 
    {
    case "0":
        innerHtm = innerHtm + "<strong>单选题（该题型共有" + quesCount0 + "题，当前第" + questionNo + "题）</strong><br /><br />";
        break;
    case "1":
        innerHtm = innerHtm + "<strong>多选题（该题型共有" + quesCount1 + "题，当前第" + questionNo + "题）</strong><br /><br />";
        break;
    case "2":
        innerHtm = innerHtm + "<strong>判断题（该题型共有" + quesCount2 + "题，当前第" + questionNo + "题）</strong><br /><br />";
        break;
    }
    
    innerHtm = innerHtm + "<label id='queNo'>" + questionNo + "</label>.";
    if (no == 0) 
    {
        innerHtm = innerHtm + arrStu[no].Que_Question + "(" + (perScore + limitScore) + "分)" + "<br/><b>--"+arrStu[no].Que_Answer+"--</b><br/>";
    } 
    else 
    {
        innerHtm = innerHtm + arrStu[no].Que_Question + "(" + perScore + "分)"+ "<br/><b>--"+arrStu[no].Que_Answer+"--</b><br/>";
    }
    
    //显示题目
    switch (arrStu[no].Que_Type) 
    {
    case "0":
        
        if (arrStu[no].Que_OptionA != "") 
        {
            innerHtm = innerHtm + "<input type='radio' name='rdoAnswer' value='A' />A：" + arrStu[no].Que_OptionA + "<br /><br />";
        }
        if (arrStu[no].Que_OptionB != "") 
        {
            innerHtm = innerHtm + "<input type='radio' name='rdoAnswer' value='B' />B：" + arrStu[no].Que_OptionB + "<br /><br />";
        }
        if (arrStu[no].Que_OptionC != "") 
        {
            innerHtm = innerHtm + "<input type='radio' name='rdoAnswer' value='C' />C：" + arrStu[no].Que_OptionC + "<br /><br />";
        }
        if (arrStu[no].Que_OptionD != "") 
        {
            innerHtm = innerHtm + "<input type='radio' name='rdoAnswer' value='D' />D：" + arrStu[no].Que_OptionD + "<br /><br />";
        }
        if (arrStu[no].Que_OptionE != "") 
        {
            innerHtm = innerHtm + "<input type='radio' name='rdoAnswer' value='E' />E：" + arrStu[no].Que_OptionE + "<br /><br />";
        }
        break;
    
    case "1":
        if (arrStu[no].Que_OptionA != "") 
        {
            innerHtm = innerHtm + "<input type='checkbox' name='chkAnswer' value='A' />A：" + arrStu[no].Que_OptionA + "<br /><br />";
        }
        if (arrStu[no].Que_OptionB != "") 
        {
            innerHtm = innerHtm + "<input type='checkbox' name='chkAnswer' value='B' />B：" + arrStu[no].Que_OptionB + "<br /><br />";
        }
        if (arrStu[no].Que_OptionC != "") 
        {
            innerHtm = innerHtm + "<input type='checkbox' name='chkAnswer' value='C' />C：" + arrStu[no].Que_OptionC + "<br /><br />";
        }
        if (arrStu[no].Que_OptionD != "") 
        {
            innerHtm = innerHtm + "<input type='checkbox' name='chkAnswer' value='D' />D：" + arrStu[no].Que_OptionD + "<br /><br />";
        }
        if (arrStu[no].Que_OptionE != "") 
        {
            innerHtm = innerHtm + "<input type='checkbox' name='chkAnswer' value='E' />E：" + arrStu[no].Que_OptionE + "<br /><br />";
        }
        break;
    
    case "2":
        innerHtm = innerHtm + "<input type='radio' name='rdoPanduan' value='正确' />正确<br /><br />";
        innerHtm = innerHtm + "<input type='radio' name='rdoPanduan' value='错误'/>错误<br /><br />";
        break;
    }
    
    $("#divTrueAnswer").hide();
    $("#divShow").html(innerHtm);
    
    //如果是有答案的，显示之前的答案
    if (answer[no] != null  && answer[no] != undefined) 
    {
        switch (arrStu[no].Que_Type) 
        {
        case "0":
            $("input[name='rdoAnswer']").each(function() {
                if (answer[no] == $(this).val()) 
                {
                    $(this).attr("checked", true);
                }
            });
            break;
        
        case "1":
            $("input[name='chkAnswer']").each(function() {
                var answerDuoxuan = answer[no].split(',');
                for (var i = 0; i <= answerDuoxuan.length - 1; i++) 
                {
                    if (answerDuoxuan[i] == $(this).val()) 
                    {
                        $(this).attr("checked", true);
                    }
                }
            });
            break;
        
        case "2":
            $("input[name='rdoPanduan']").each(function() {
                if (answer[no] == $(this).val()) 
                {
                    $(this).attr("checked", true);
                }
            });
            break;
        }
    }
}