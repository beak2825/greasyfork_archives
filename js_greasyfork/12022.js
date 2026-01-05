// ==UserScript==
// @name       跨境电商获奖企业提名 半自动提交
// @namespace  
// @version    0.1
// @description  enter something useful
// @match      http://*.sojump.com/*
// @copyright  2012+, You
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/12022/%E8%B7%A8%E5%A2%83%E7%94%B5%E5%95%86%E8%8E%B7%E5%A5%96%E4%BC%81%E4%B8%9A%E6%8F%90%E5%90%8D%20%E5%8D%8A%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/12022/%E8%B7%A8%E5%A2%83%E7%94%B5%E5%95%86%E8%8E%B7%E5%A5%96%E4%BC%81%E4%B8%9A%E6%8F%90%E5%90%8D%20%E5%8D%8A%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==
$(document).ready(function(){
    if(window.location.pathname=="/viewstat/5612289.aspx"){
        window.location.href="http://ww.sojump.com/m/5612289.aspx";
    }else if(window.location.pathname=="/m/5612289.aspx")
    {
        $("#q1_1").parent().find("a").addClass("jqchecked");
        $("#q1_1").parent().parent().addClass("focuschoice");
        $("#q1_1").attr("checked","checked"); 
        
        $("#q2_4").parent().find("a").addClass("jqchecked");
        $("#q2_4").parent().parent().addClass("focuschoice");
        $("#q2_4").attr("checked","checked"); 
        
        $("#q3_3").parent().find("a").addClass("jqchecked");
        $("#q3_3").parent().parent().addClass("focuschoice");
        $("#q3_3").attr("checked","checked"); 
        
        $("#q4_1").parent().find("a").addClass("jqchecked");
        $("#q4_1").parent().parent().addClass("focuschoice");
        $("#q4_1").attr("checked","checked"); 
        
        $("#q5_9").parent().find("a").addClass("jqchecked");
        $("#q5_9").parent().parent().addClass("focuschoice");
        $("#q5_9").attr("checked","checked"); 
        
        $("#q6_6").parent().find("a").addClass("jqchecked");
        $("#q6_6").parent().parent().addClass("focuschoice");
        $("#q6_6").attr("checked","checked"); 
        
        $("#q7_4").parent().find("a").addClass("jqchecked");
        $("#q7_4").parent().parent().addClass("focuschoice");
        $("#q7_4").attr("checked","checked"); 
        
        $("#q8_6").parent().find("a").addClass("jqchecked");
        $("#q8_6").parent().parent().addClass("focuschoice");
        $("#q8_6").attr("checked","checked"); 
        
        $("#q9_2").parent().find("a").addClass("jqchecked");
        $("#q9_2").parent().parent().addClass("focuschoice");
        $("#q9_2").attr("checked","checked"); 
        
        $("#q10_2").parent().find("a").addClass("jqchecked");
        $("#q10_2").parent().parent().addClass("focuschoice");
        $("#q10_2").attr("checked","checked"); 
        
        window.scrollTo(100000,100000);
    }
});

