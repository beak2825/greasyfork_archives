// ==UserScript==
// @name         ZEPCJWGL扩展插件
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @version      3.0.3.14
// @description  ZEPCLWGL系统扩展插件 实现功能：选修课抢课、体育课选课、一键评教、退课保护等功能，欢迎使用。
// @author       薛定谔的喵~
// @match        http://202.197.192.40/*
// @match        http://202.197.192.42/*
// @grant        GM_xmlhttpRequest

// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/36397/ZEPCJWGL%E6%89%A9%E5%B1%95%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/36397/ZEPCJWGL%E6%89%A9%E5%B1%95%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var btncss='<style>.zxbtn{color: #4876ff; background-color:white; margin-bottom:10px; border: solid #4876FF 1px; border-radius:2px;padding: 5px;transition:all 0.5s ease;} .zxbtn:hover{color:#FFFFF0;background-color:#4876FF;}</style>';
    var titleP = $('title').text();
    if (titleP == '高校现代教学管理系统') {
        if (window.stop) window.stop();
        else document.execCommand("Stop");
    }
    $(function() {
        $('#tbPSW').css('width', '170px').parent().append('<input type="checkbox" id="show" style="display:inline-block;vertical-align:middle;margin-bottom:2px;"><label for="show">显示密码</label></div>'); //缩短密码输入框并加入显示密码功能
        $('#show').click(function() {
            if ($(this).is(':checked')) {
                $('#tbPSW').attr('type', 'text');
            } else {
                $('#tbPSW').attr('type', 'password');
            }
        });
        $('#tbPSW').blur(function() {
            localStorage.xuehao = $('#tbYHM').val();
            localStorage.mima = $('#tbPSW').val();
        });
    });
    $(function() {
        $("#lbXH").parent().append("<a id='zixuinfo' href='javascript:;' style='font-weight:bold;' target='mainFrame' title=''>认证页面</a>");
        $('#hlXXWZ').attr('href', 'http://www.zepc.edu.cn/');
        var XH = localStorage.xuehao;
        var PW = localStorage.mima;
        var t = 0;
        $(function() {
            if ($('#lbXH').text() !== "") {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'http://39.106.19.35/zepcplu/api/api.php?xuehao=' + $('#lbXH').text(),
                    onload: function(response) {
                        if (response.responseText == '1') {
                            $('#lbXM').css('color', 'rgb(218,178,115 )');
                            $('#lbXM').text('[已认证] ' + $('#lbXM').text());
                            $('#lbXM').attr('title', '恭喜，你已通过ZEPC教务系统超级扩展身份认证，可用所有功能！');
                            localStorage.verify = response.responseText;
                        } else if (response.responseText == '2'){
                            $('#lbXM').text('[正在审核] ' + $('#lbXM').text());
                            $('#lbXM').attr('title', '你的申请正在等待审核，请耐心等待！');
                            localStorage.verify = response.responseText;
                        }else if (response.responseText == '3'){
                            $('#lbXM').text('[被驳回] ' + $('#lbXM').text());
                            $('#lbXM').attr('title', '你的申请已经被驳回！');
                            localStorage.verify = response.responseText;
                        }else if (response.responseText == '4'){
                            $('#lbXM').text('[UID被封禁] ' + $('#lbXM').text());
                            $('#lbXM').attr('title', '你的UID已被封禁！');
                            localStorage.verify = response.responseText;
                        }else{
                            $('#lbXM').text('[未知状态] ' + $('#lbXM').text());
                            $('#lbXM').attr('title', '你的UID状态异常！请联系管理员！');
                            localStorage.verify = response.responseText;
                        }
                    }
                });
            }
        });
        $(function() {
            $('#zixuinfo').attr('href', 'http://39.106.19.35/zepcplu/verify.php?name=' + encodeURIComponent($('#lbXM').text()) + '&xuehao=' + $('#lbXH').text() + '&major=' + encodeURIComponent($('#lbZYMC').text()));
        });
        function Getnews() {

        }
        function Addnews(title, dept, releasetime, detailurl) {
            var sNeedTitle = '学生-通知文件';
            if ($('#lbTitle').text() == sNeedTitle) {
                $('#DataGrid1').children().append('<tr bgcolor="#e8f3fd"><td>' + title + '</td><td>' + dept + '</td><td>' + releasetime + '</td><td>' + detailurl + '</td></tr>');
            }
        }
        $(function() {
            $('.side-nav').append(btncss);
            $('.side-nav').append('<li><a href="#" id="showscore" style="color:red;font-weight:bold;"><i class="fa fa-pencil"></i>显示成绩</a></li>');
            $('.btn-primary').each(function(){
            if($(this).text()=='返回'){
                $(this).parent().append(btncss);
                $(this).parent().append("<input type='button' value='显示成绩' id='showscore' class='zxbtn' />");
            }
            });
            $('#showscore').click(function() {
                var sNeedHome = "我的考试";
                    var html = $('.table').html();
                    var result = html.replace(/<!--/gm, "");
                    result = result.replace(/-->/gm, "");
                    $('.table').html(result);
                    $('.home').text($('.home').text() + ' - 已显示考试成绩(最高分就是成绩)');
            });
        });
        $(function() {
            var sNeedTitle = "学生—>学生网上选课";
            var scriptText = '<script language="javascript" type="text/javascript">	function PostNow(eventTarget, eventArgument) {		var theform;		if (window.navigator.appName.toLowerCase().indexOf("microsoft") > -1) {			theform = document.Form1;		}		else {			theform = document.forms["Form1"];		}		theform.__EVENTTARGET.value = eventTarget.split("$").join(":");		theform.__EVENTARGUMENT.value = eventArgument;		theform.submit();	}</script>';
            $("td").each(function() {
                if ($(this).text() == sNeedTitle) {
                    if (localStorage.verify == '1') {
                        $("#HidLc").attr("value", "1");
                        $("#HidJkb").attr("value", "是");
                        $('#btnXK').remove();
                        $("#table1").children().children().children().prepend(btncss);
                        $("#table1").children().children().children().prepend(scriptText);
                        $("#table1").children().children().children().prepend("<input language='javascript' onclick=\"PostNow('btnXK','')\" name='btnXK' id='btnXK' type='submit' class='zxbtn' value='选  定' />");
                    } else {
                        $("#HidLc").attr("value", "1");
                        $("#HidJkb").attr("value", "是");
                        $("#table1").children().children().children().prepend("<span>你还没有认证，不能使用这个功能！快点击上面的“认证页面”去认证吧！</span>");
                    }
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
                    if (localStorage.verify == '1') {
                        $('#Button1').remove();
                        $("#table2").children().children().eq(3).children().prepend(btncss);
                        $("#table2").children().children().eq(3).children().prepend("<input type='submit' name='Button1' value='选  定' id=\"do_OK\" onclick=\"doOk()\" class='zxbtn' />");
                    } else {
                        $("#table2").children().children().eq(3).children().prepend("<span>你还没有认证，不能使用这个功能！快点击上面的“认证页面”去认证吧！</span>");
                    }
                }
            });
            $('td').each(function() {
                if ($(this).text() == '项目名称') {
                    $(this).css({
                        'color': 'red',
                        'font-weight': 'bold'
                    });
                    $(this).parent().css({
                        'border-bottom-color': 'red'
                    });
                }
            });
        });
        $(function() {
            var sNeedTitle = "当前位置：学生—>教学质量评价";
            $("td").each(function() {
                if ($(this).text() == sNeedTitle) {
                    $('#Button1').remove();
                    $('#Button2').remove();
                    $("#lbPJCS").prepend(btncss);
                    $("#lbPJCS").append("<span style='color:red;'>一键评教功能：</span><input type='button' name='zx_yjpj' value='1、一键随机填写' id='zx_yjpj' class='zxbtn'><input type='submit' name='Button1' value='2、保存' id='Button1' class='zxbtn'><input type='submit' name='Button2' value='3、提交' id='Button2' class='zxbtn'>");
                }
            });
            $('#zx_yjpj').click(function() {
                $('select[name^="DataGrid1"]').each(function() {
                    var x = 3;
                    var y = 1;
                    var rand = parseInt(Math.random() * (x - y + 1) + y);
                    $(this).children().eq(rand).attr('selected', 'selected');
                });
                $('#Button1').trigger("click");
            });
        });
        $(function() {
            $('#Div2').parent().prepend(btncss);
            $('#Div2').parent().append('<div style="BORDER-RIGHT:#ccc 1px solid; BORDER-TOP:#ccc 1px solid; MARGIN-TOP:50px; BORDER-LEFT:#ccc 1px solid; WIDTH:350px; BORDER-BOTTOM:#ccc 1px solid"><span style="color:blue;">未评教情况下查成绩(无法选课)~</span><div><input type="button" name="zx_ccj" value="点击查成绩" id="zx_ccj" class="zxbtn"></div></div>');
            $('#zx_ccj').click(function() {

                $.get("/xscj.aspx?xh=" + localStorage.xuehao, function(result) {
                    result = result.replace("<script language='javascript'>alert('未评教学生不能选课或查成绩');window.opener=null;window.location='yzr.htm';</script>", "");
                    $('html').html(result);
                });
            });
        });
    });
})();

