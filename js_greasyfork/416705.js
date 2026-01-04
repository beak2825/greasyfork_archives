// ==UserScript==
// @name        去你大爷的三三制(翻新)
// @namespace   Violentmonkey Script
// @match       *://33.bxwxm.com.cn/*
// @grant       none
// @version     3.5.0.99
// @author      阿翔哦哦
// @description 独自努力拿高分吧，尊重作者，未经允许禁止转载与使用
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/416705/%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%E4%B8%89%E4%B8%89%E5%88%B6%28%E7%BF%BB%E6%96%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416705/%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%E4%B8%89%E4%B8%89%E5%88%B6%28%E7%BF%BB%E6%96%B0%29.meta.js
// ==/UserScript==

(
  
  function (){
  'use strict';
  $(document).ready(function(){
    $("#NotiflixReportWrap").remove();                //去除烦人的提示窗口
    
    var tips =$("div.full.text-center");        //定位温馨提示内容
    
    var mistakes=new Array();                         //新建数组，用于放置无匹配的题号
    //优化界面
    var time = $("h3.sub-header2.text-right").find("em")  //计时器内容
    time.html('考试计时：0s ');
    time.before("<button class=\"btn btn-primary\" id=\"stoptime\">停止计时<\/button> </a>");
    var stoptime = $("#stoptime").click(function(){window.clearInterval(timer);});
    
    var htmlid = window.location.href.slice(-7,-5);   //获取目前URL
    var count = parseInt(htmlid);                     //获取URL ID
    if(count<=60)
      {
        count=count+100;
      }
    var url;  //URL拼接

    //优化界面
    
    if(window.location.href == 'http://33.bxwxm.com.cn/index/index/index.html')
      {
        
        for(var k = 0; k<$($("div.row")[1]).find('a').length; k++)
          {
            var href_ = $($($("div.row")[1]).find('a')[k]).attr("href");
            switch(href_.slice(-7,-5))
              {
                case "10":
                  $($($("div.row")[1]).find('a')[k]).attr("href", 'http://33.bxwxm.com.cn/index/exam/show/id/85.html');
                  break;
                case "11":
                  $($($("div.row")[1]).find('a')[k]).attr("href", 'http://33.bxwxm.com.cn/index/exam/show/id/115.html');
                  break;
                case "18":
                  $($($("div.row")[1]).find('a')[k]).attr("href", 'http://33.bxwxm.com.cn/index/exam/show/id/137.html');
                  break;
                case "19":
                  $($($("div.row")[1]).find('a')[k]).attr("href", 'http://33.bxwxm.com.cn/index/exam/show/id/145.html');
                  break;
                case "13":
                  $($($("div.row")[1]).find('a')[k]).attr("href", 'http://33.bxwxm.com.cn/index/exam/show/id/92.html');
                  break;
              }
          }
      }
    
    //<毛概>
    if(count>=137 && count<=151)
      {
        var g=14;
        var mg=['绪论',1,2,3,4,5,6,7,8,9,10,11,12,13,14];
        for(var cn=151;cn>=137;cn--)
          {
            url="http://33.bxwxm.com.cn/index/exam/show/id/"+String(cn)+".html";            
            $("#nextQuestion").after("<a href=\"" +url+ "\"<button class=\"btn btn-primary\" id=\"nextPage\"  >"+String(mg[g])+"<\/button> </a>");
            g=g-1;
          }
        //$("#nextQuestion").after("<div style=\"width:100%; font-size:18px; font-weight:bold; margin-bottom:10px; text-indent:6px; color:#454E59;\">选章节<\/div>");
      }
    //</毛概>
//------------------------------------------------------------------------------------------------------------------------------------------
    //<思修>
    var sx=[85,86,129,130,131,90,91];
    if(sx.includes(count))
      {
        var sxpage = ["绪论",1,2,3,4,5,6];
          for(var cnsx=6;cnsx>=0;cnsx--)
          {
              $("#nextQuestion").after("<a href=\"http://33.bxwxm.com.cn/index/exam/show/id/" + String(sx[cnsx]) + ".html\"<button class=\"btn btn-primary\" id=\"nextPage\"  > "+ String(sxpage[cnsx]) +" <\/button> </a>");
          }
          $("#nextQuestion").after("<div style=\"width:100%; font-size:18px; font-weight:bold; margin-bottom:10px; text-indent:6px; color:#454E59;\">选章节<\/div>");
      }
    //</思修>
//------------------------------------------------------------------------------------------------------------------------------------------    
    //<近代史>
    if(count>=115 && count<=128)
      {
        var g=13;
        var jds=["上篇综述",1,2,3,"中篇综述",4,5,6,7,"下篇综述",8,9,10,11];
        for(var cn=128;cn>=115;cn--)
          {
            url="http://33.bxwxm.com.cn/index/exam/show/id/"+String(cn)+".html";
            $("#nextQuestion").after("<a href=\"" +url+ "\"<button class=\"btn btn-primary\" id=\"nextPage\"  >"+String(jds[g])+"<\/button> </a>");
            g=g-1;
          }
        $("#nextQuestion").after("<div style=\"width:100%; font-size:18px; font-weight:bold; margin-bottom:10px; text-indent:6px; color:#454E59;\">选章节<\/div>");
      }
    //</近代史>
//------------------------------------------------------------------------------------------------------------------------------------------    
    //<马原>
    if(count>=92 && count<=99)
      {
        var g=7;
        var my=["导论",1,2,3,4,5,6,7];
        for(var cn=99;cn>=92;cn--)
          {
            url="http://33.bxwxm.com.cn/index/exam/show/id/"+String(cn)+".html";
            $("#nextQuestion").after("<a href=\"" +url+ "\"<button class=\"btn btn-primary\" id=\"nextPage\"  >"+String(my[g])+"<\/button> </a>");
            g=g-1;
          }
        $("#nextQuestion").after("<div style=\"width:100%; font-size:18px; font-weight:bold; margin-bottom:10px; text-indent:6px; color:#454E59;\">选章节<\/div>");
      }
    //</马原>
//------------------------------------------------------------------------------------------------------------------------------------------
    function displayTime(){
    var time = $("h3.sub-header2.text-right").find("em")  //计时器内容
    var date = new Date();
    var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minutes = date.getMinutes();
		var second = date.getSeconds();
		var timestr = year + "年" + month + "月" + day + "日  " + hour+ ":" + minutes + ":" + second;
    time.html(timestr);
    }
    
    var second=1;
    var timer = window.setInterval(function displayTime()
    {
		var timestr = '考试计时：'+second+'s ' ;
    second=second+1;
    time.html(timestr);
    } , 1000);
//----------------------------------------------------------------------------------------------------------------------------------------
    alert('温馨提示：请独自完成答题！');
    
    });
  }
  )();