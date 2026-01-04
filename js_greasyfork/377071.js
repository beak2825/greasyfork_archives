// ==UserScript==
// @name         自动写日报
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @requir       http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/377071/%E8%87%AA%E5%8A%A8%E5%86%99%E6%97%A5%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/377071/%E8%87%AA%E5%8A%A8%E5%86%99%E6%97%A5%E6%8A%A5.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // Your code here...
    //doctorfive.top
      $("#Verificacode").eq(0).focus();
      $("#Verificacode").eq(0).attr("value","1232");
      $(".layui-btn").eq(0).click();

    //Boss.Westsoft.com.cn


    var UserName=$("#UpdatePanel1").eq(0);
    console.log(UserName);

    //打开日志页面
    $("#3-5-1 a").click();
    //点击添加日志按钮
     $("#ctl00_ContentPlaceHolder1_But_Add").click();

    //填充标题
    if(window.location.href.indexOf("http://boss.westsoft.com.cn/Westsoft/Office/WorkLog/AddorEditWorkLog.aspx")>-1)
    {
        //获取日期控件中的值
        var DateTime= $("#ctl00_ContentPlaceHolder1_Date_Date").attr("value");
        //下拉选择事件
        $("#ctl00_ContentPlaceHolder1_Drop_Type").val("0C6B6164B5A89567C82610D69FF894AD");
        if(DateTime!=undefined)
        {
            javascript:setTimeout('__doPostBack(\'ctl00$ContentPlaceHolder1$Drop_Type\',\'\')', 0)
        }
       $("#ctl00_ContentPlaceHolder1_text_Title").eq(0).attr("value",DateTime+"日报");
    }
    //设置日志内容
    $("#ctl00_ContentPlaceHolder1_text_Content").val("今日已完成：\r\n1、\r\n2、\r\n3、");

    $("#ctl00_ContentPlaceHolder1_Radio_Verify_1").click();

})();