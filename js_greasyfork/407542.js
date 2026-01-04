// WangDaExamHelperRelease Script
// version 0.1.9
// Released under the MIT license
//
// --------------------------------------------------------------------
// ==UserScript==
// @name         WangDaExamHelperRelease
// @namespace    http://wfwy.xyz:8998/
// @author		 wlte
// @version  	 0.1.9
// @description  WangDaExamHelperReleasev1
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @include      https://wangda.chinamobile.com/*
// @include      http://wfwy.xyz:8998/wangda_exam
// @connect      49.232.22.5
// @connect      127.0.0.1
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/407542/WangDaExamHelperRelease.user.js
// @updateURL https://update.greasyfork.org/scripts/407542/WangDaExamHelperRelease.meta.js
// ==/UserScript==

(function() {
'use strict';
var _self = unsafeWindow;
var $ = _self.jQuery;
document.oncontextmenu = null;
document.onselectstart = null;
document.oncopy = null;
document.oncut = null;
document.onpaste = null;
document.onblur = null;
var version_info = 'v0.1.9';
var g_rets = {};

console.log(window.location.pathname);

//new api 0715
function Upload_inner_html(){
    if($(".title.text-overflow.mb-1").length>0){
        var pathname = window.location.pathname;
        var innerhtmlstring = document.body.innerText;
        var realName = $("div[class='mb-1'] > span[title]").text().replace('姓名：','').trim();
        var title = $(".title.text-overflow.mb-1").text().replace('正在作答:', '').trim();
        GM_xmlhttpRequest({
            method: "post",
            url: 'http://49.232.22.5:8998/tom_exam_api_upload_inner_html',
            data: $.param({"innerhtmlstring":innerhtmlstring,"pathname":pathname,"realName":realName,"title":title}),
            headers:  {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(data){
                console.log(getCurrentTimeString() + " " + data.responseText);
            },
            onerror : function(err){
                console.log(getCurrentTimeString() + " upload inner_html error!");
            }
        });
       }else{
           console.log(getCurrentTimeString() + " Upload_inner_html title not found!");
       }

}

//new api 0715
function Upload_all_questions(){
    if($(".title.text-overflow.mb-1").length>0){
        var title = $(".title.text-overflow.mb-1").text().replace('正在作答:', '').trim();
        var questions={};
        $("div.question-type-item").each(function(){
            var q = $('div.question', this).text().trim();
            var o = $("div.answer", this).text().trim();
            var id = $(this).attr("data-dynamic-key").trim();
            var t = '';
            if($('input[type=radio]', this).length>0) {
                t='(单选)';
            } else if($('input[type=checkbox]', this).length>0){
                t='(多选)';
            } else{
                t='(未知)';
            }
            questions[id] = {'q':q.replace(/^\d+、\s*/, '').replace(/\s+/g, ' ').trim(),'o':t + o.replace(/\s+/g, ' ').trim()};
        })
        var realName = $("div[class='mb-1'] > span[title]").text().replace('姓名：','').trim();
        GM_xmlhttpRequest({
            method: "post",
            url: 'http://49.232.22.5:8998/tom_exam_api_upload_all_questions',
            data: $.param({"questions":JSON.stringify(questions),"realname":realName,"title":title}),
            headers:  {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(data){
                var rets = JSON.parse(data.responseText);
                console.log(getCurrentTimeString() + " "+ rets.data);
            },
            onerror : function(err){
                console.log(getCurrentTimeString() + " upload questions error!");
            }
        });
    }else{
        console.log(getCurrentTimeString() + " Upload_all_questions title not found！");
    }
}

//new api 0715
function Get_all_question_ans(){
    if($(".title.text-overflow.mb-1").length>0){
        var title = $(".title.text-overflow.mb-1").text().replace('正在作答:', '').trim();
        var questions={};
        $("div.question-type-item").each(function(){
            var q = $('div.question', this).text().trim();
            var o = $("div.answer", this).text().trim();
            var id = $(this).attr("data-dynamic-key").trim();
            questions[id] = {'q':q.replace(/^\d+、\s*/, '').replace(/\s+/g, ' ').trim(),'o':o.replace(/\s+/g, ' ').trim()};
        })
        var realName = $("div[class='mb-1'] > span[title]").text().replace('姓名：','').trim();
        GM_xmlhttpRequest({
            method: "post",
            url: 'http://49.232.22.5:8998/tom_exam_api_get_all_question_ans',
            data: $.param({"questions":JSON.stringify(questions),"realname":realName,"title":title}),
            headers:  {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(data){
                var rets = JSON.parse(data.responseText);
                g_rets = rets;
                $('div.question-type-item').each(function(){
                    var id = $(this).attr("data-dynamic-key").trim();
                    $('div.question', this).attr("title", rets[id].o);
                    if(rets[id].q != ""){
                        $('div.question > span', this).attr("style", "font-weight:900;");
                        $('#D75question-'+id).attr("style", "font-weight:900;");
                    }
                })
                console.log(getCurrentTimeString() + " 获取答案成功!");
                setTimeout(Get_all_question_ans, 120000 + getRndInteger(30,90)*1000);
            },
            onerror : function(err){
                console.log(getCurrentTimeString() + " get answer error!");
                setTimeout(Get_all_question_ans, 120000 + getRndInteger(30,90)*1000);
            }
        });
    }else{
        console.log(getCurrentTimeString() + " Get_all_question_ans title not found！");
    }
}
var pathname = window.location.pathname;
//if(pathname.indexOf('question') >-1 || pathname.indexOf('exam') >-1){
    setTimeout(check_ok, 10000 + getRndInteger(0,10)*1000);
    setTimeout(Upload_inner_html, 30000 + getRndInteger(0,30)*1000);
    setTimeout(Upload_all_questions, 60000 + getRndInteger(0,30)*1000);
    setTimeout(Get_all_question_ans, 120000 + getRndInteger(30,90)*1000);
    setTimeout(ReCheck, 220000);
//}

function ReCheck(){
    if($(".title.text-overflow.mb-1").length>0){
        try{
            $('div.question-type-item').each(function(){
                var id = $(this).attr("data-dynamic-key").trim();
                $('div.question', this).attr("title", g_rets[id].o);
                if(g_rets[id].q != ""){
                    $('div.question > span', this).attr("style", "font-weight:900;");
                    $('#D75question-'+id).attr("style", "font-weight:900;");
                }
            })
            console.log(getCurrentTimeString() + " Start Recheck!");
        }
        catch(e){
            console.log(getCurrentTimeString() + " Recheck Error!");
        }
        setTimeout(ReCheck, 20000);
    }else{
        console.log(getCurrentTimeString() + " Recheck title not found！");
    }
}


function check_ok(){
    var realName = $("div[class='mb-1'] > span[title]").text().replace('姓名：','').trim() || $('.inline-block.common-title').text().trim();
    var title = $(".title.text-overflow.mb-1").text().replace('正在作答:', '').trim();
    GM_xmlhttpRequest({
        method: "post",
        url: 'http://49.232.22.5:8998/check_ok',
        data: $.param({"pathname":window.location.href,"realName":realName,"title":title}),
        headers:  {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(data){
            var retstr = data.responseText;

            if(retstr == 'ok'){
                console.log(getCurrentTimeString() + " 连接查题服务器成功！");
               }
            else{
                console.log(getCurrentTimeString() + " 查题服务器返回异常！");
            }
        },
        onerror : function(err){
            console.log(getCurrentTimeString() + " 连接查题服务器端异常！");
        }
    });
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getCurrentTimeString() {
    var date=new Date();
    var newdate=date.toLocaleString('chinese', { hour12: false }); //获取24小时制，中国时间，打印出   2019/01/03/  08:40:32
    return newdate;
}

})();