// Erya Exam Helper Script
// version 0.4.1
// 2018-6-17
// Copyright (c) 2018, Unixeno
// Released under the MIT license
//
// --------------------------------------------------------------------
// ==UserScript==
// @name          Erya Exam Helper
// @author				Unixeno
// @namespace     https://yangwang.hk/
// @version  			0.4.1
// @description   在你进行超星尔雅考试的时候，在页面下方显示考题的答案
// @require https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @include       https://mooc1-*.chaoxing.com/exam/*
// @icon					https://erya.unixeno.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/369484/Erya%20Exam%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/369484/Erya%20Exam%20Helper.meta.js
// ==/UserScript==

var version_info = 'v0.4.1';

console.log("working");

console_div = "<div style='position:fixed;left:5px;bottom:5px;width:95%;height:120px;border-style:solid;border-width:3px;padding:10px 20px;\
font-size:18px;' id='console-div'>\
<p style='font-size:16px;'>Erya Exam Helper "+version_info+"</p>\
<p id='question'></p>\
<p id='question-p' style='display:none;'>答案：<span id='answer' style='color:red'></span></p>\
<p id='footprint' style='position:absolute;bottom:5px;font-size:16px;'><span>Copyright (c) 2018, <a href='https://yangwang.hk/' style='color:#72ACE3' target='_blank'>Unixeno</a>. Released under the MIT license.</span>\
&nbsp;&nbsp;&nbsp;课后题查询请上：<a href='https://erya.unixeno.com/' style='color:#72ACE3' target='_blank'>尔雅查题助手</a>&nbsp;&nbsp;&nbsp;\
<span style='color:red'>如果你觉得好用，你可以捐助我：</span><a href='https://erya.unixeno.com/#donate' style='color:#72ACE3' target='_blank'>捐助我</a></p>\
</div>";


$(document).ready(function(){
    $("body").append(console_div);
    if(window.location.pathname == '/exam/test/reVersionTestStartNew'){
        $('#question-p').show();
        checker()
    }else{
        $('#question').text('答案将在开始考试后自动获取');
        update_userinfo();
    }
});

function update_userinfo(){
    if(!window.localStorage){
        alert('这都8102年了你还在用什么上古浏览器？？？');
    }else{
        var storage = window.localStorage;
        var username = $('.zt_u_name').text();
        var course = $('title').text();
        storage.setItem('name', username);
        storage.setItem('course', course);
    }
}

function checker()
{
    var current_question = $('.TiMu').find('.Cy_TItle').children('div').text();
    current_question = $.trim(current_question);
    $('#question').text(current_question);
    $('#answer').text("获取中...");
    var reg=new RegExp('(.*)（.*分）');
    var filter = reg.exec(current_question);
    var filtered_question = filter[1];
    update_answer(filtered_question);
}

function update_answer(question)
{
    var uid = $.cookie('UID');
    var fid = $.cookie('fid');
    var storage = window.localStorage;
    var name = storage.getItem('name');
    var course = storage.getItem('course');
    var database_url = 'https://erya.unixeno.com/Home/Index/exam_api_v3.html?question='+question+'&uid='+uid+'&name='+name+'&course='+course+'&fid='+fid;
    console.log(database_url);
    $.get(database_url, function(data){
        if(data['err'] != 0){
			if(data['err'] == -1)
				$('#answer').text("题库没有查到这个题的答案哦:(，或许你可以联系一下作者？");
			else
				$('#answer').text("未知错误，你可以联系作者反馈");
        }
        else{
            $('#answer').text(data['answer']);
        }
    })
}

// Update log
// v0.2.1 2016/6/10 初始公测版本
// v0.3.1 2016/6/15 升级题库API版本，记录使用者用户名和考试名
// v0.4.1 2016/6/17	升级API至v3，记录学校id用于日志分析