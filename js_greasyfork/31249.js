// ==UserScript==
// @name         ZEPC教务系统超级扩展
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @namespace    http://tampermonkey.net/
// @version      1.0.4.76
// @description  郑州电力高等专科学校教务系统超级扩展插件，可实现：选修课抢课，体育课抢课，一键评教(新)，退课保护，提示等功能，欢迎使用。
// @author       紫旭网络
// @match        http://202.197.192.40/*
// @match        http://202.197.192.42/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31249/ZEPC%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%B6%85%E7%BA%A7%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/31249/ZEPC%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%B6%85%E7%BA%A7%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    $("#hlXXWZ").parent().append("<span id='zixu'>·</span><a id='zixuweb' href='https://www.zixutech.cn' target='mainFrame' style='color:purple;font-weight:bold;'>紫旭网络首页<span hidden='hidden'>啊</span></a>");
    $("#lbXH").parent().append("<a id='zixuadmin' href='https://www.zixutech.cn/app/donate.html' style='color:green;font-weight:bold;' target='mainFrame' title=''>捐赠我们</a>");
    $('#hlXXWZ').attr('href','http://www.zepc.edu.cn/');
    //$("#_div").parent().parent().prepend("<div id='admin' style='width:5px;height:100px;' hidden='hidden'>hello world</div>");
    var t = 0;
    var sXH = $("#lbXH").text(); //获取学号
    //var html='<div id="zxmain"><div style="text-align:center;">[ 插件功能设置 ]</div><div>------------------</div></div>';
    //$('#lbTitle').parent().parent().parent().parent().parent().prepend(html);
    //$('#zxmain').css({'width':'150px','height':'300px','position':'absolute','background-color':'2b3b4b','color':'white'});
    $(function(){
        $('.side-nav').append('<li><a href="#" id="showscore" style="color:red;font-weight:bold;"><i class="fa fa-pencil"></i> 显示成绩</a></li>');
        $('#showscore').click(function(){
            var sNeedHome = "我的考试";
            if($('.home').text()==sNeedHome){
                var html = $('.table').html();
                var result = html.replace(/<!--/gm,"");
                result = result.replace(/-->/gm,"");
                $('.table').html(result);
                $('.home').text($('.home').text()+' - 已显示考试成绩(最高分就是成绩)');

            }
            else{
                alert('显示失败，请先进入“我的考试”页面');
            }
        });
    });
    $(function() {

        $("#lbXH").parent().append("<span style='color:red;'> [警告：选课时期校内有人在恶意刷课，为了保证你的课程等信息安全，如果你的学号和密码一样，请立即<a class='zx_xgmm' target='mainFrame' >修改密码</a>！]</span>");
        $(".zx_xgmm").attr("href", "/mmxg.aspx?xh=" + sXH);
        var sNeedTitle = "学生—>学生网上选课";
        $("td").each(function() {
            if ($(this).text() == sNeedTitle) {
                $("#HidLc").attr("value", "1");
                $("#HidJkb").attr("value", "是");
                $('#btnXK').remove();
                $("#table1").children().children().children().prepend("<input language='javascript' onclick=\"__doPostBack('btnXK','')\" name='btnXK' id='btnXK' type='button' class='button' value='选  定 - 紫旭网络' />");
            }
        });
    });
    $(function() {
        var sNeedValue = "退选";
        $("[type=submit]").each(function() {
            if ($(this).attr("value") == sNeedValue) {
                $(this).attr("disabled", "disabled");
                $(this).attr("title", "[退选保护已开启]防止误操作");
            }
        });
    });
    $(function() {
        var sNeedTitle = "当前位置:学生—>学生选体育项目";
        $("td").each(function() {
            if ($(this).text() == sNeedTitle) {
                $('#Button1').remove();
                $("#table2").children().children().eq(3).children().prepend("<input type='submit' name='Button1' value='选  定 - 紫旭网络' id='Button1' class='button' />");
            }
        });
        $('td').each(function(){
            if ($(this).text() == '健美操') {
                $(this).css({'color':'red','font-weight':'bold'});
                $(this).parent().css({'border-bottom-color':'red'});
            }
        });
    });
    $(function(){
        var sNeedTitle = "当前位置：学生—>教学质量评价";
        $("td").each(function() {
            if ($(this).text() == sNeedTitle) {
                $('#Button1').remove();
                $('#Button2').remove();
                $("#lbPJCS").append("<span style='color:red;'>一键评教功能：</span><input type='button' name='zx_yjpj' value='1、一键填写' id='zx_yjpj' class='button'><input type='submit' name='Button1' value='2、保存' id='Button1' class='button'><input type='submit' name='Button2' value='3、提交' id='Button2' class='button'>");
            }
        });
        $('#zx_yjpj').click(function(){
            //alert("1111");
            $('select[name^="DataGrid1"]').each(function(){
                var x = 3;       
                var y = 1;           
                var rand = parseInt(Math.random() * (x - y + 1) + y);
                $(this).children().eq(rand).attr('selected','selected');
                //alert(i+i1);

            });

            $('#Button1').trigger("click");
        });
    });
    //未评教情况下查成绩(无法选课
    $(function(){
        $('#Div2').parent().append('<div style="BORDER-RIGHT:#ccc 1px solid; BORDER-TOP:#ccc 1px solid; MARGIN-TOP:50px; BORDER-LEFT:#ccc 1px solid; WIDTH:350px; BORDER-BOTTOM:#ccc 1px solid"><span style="color:blue;">没有评教，没办法查成绩？本功能帮你解决！(但仍然无法选课)<br / >在这里输入你的学号即可~</span><div>学号：<input type="text" name="zx_xh" id="zx_xh"><input type="button" name="zx_ccj" value="查成绩" id="zx_ccj" class="button"></div></div>');
        $('#zx_ccj').click(function(){
            var XH = $('#zx_xh').val();
            $.get("xscj.aspx?xh="+XH, function(result){
                result = result.replace("<script language='javascript'>alert('未评教学生不能选课或查成绩');window.opener=null;window.location='yzr.htm';</script>","");
                $('html').html(result);
            });
        });
    });
    //分割！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
})();

