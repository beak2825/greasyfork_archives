// TExam Helper Script
// version 0.8.5
// Released under the MIT license
//
// --------------------------------------------------------------------
// ==UserScript==
// @name         TExam Helper V2
// @namespace    http://wfwy.xyz:8998/
// @author		 wlte
// @version  	 0.8.5
// @description  TExam Helper
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @include      http://wfwy.xyz:8090/*
// @include      http://121.36.21.116:8088/*
// @include      http://61.133.4.170:8090/*
// @include      http://demo-stn.tomexam.com/*
// @connect      49.232.22.5
// @connect      127.0.0.1
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/406586/TExam%20Helper%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/406586/TExam%20Helper%20V2.meta.js
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
var version_info = 'v0.8.5';
var fCount = 1;
// var sname = '';
// console.log("working");

var console_div = "<div style='position:fixed;left:5px;bottom:5px;width:95%;height:120px;line-height:14px;margin-top:5px;margin-bottom:3px;border-style:solid;border-width:1px;padding:0px 5px;overflow:auto;"+
    "font-size:12px;' id='console-div'>"+
    "<p id='realname' style='display:none;'></p>"+
    "<p id='question-a'><span id='question'></span></p>"+
    "<p id='question-p'><span id='answer' style='color:red'></span></p>"+
    "</div>";

console.log(window.location.pathname);
if(window.location.pathname == '/user/paper/paper_detail.thtml'){
    check_ok();
    if ($('.tm_mbox_question').length > 0){
        $("#form_paper_detail").after(console_div);
        $(".tm_mnavigator").append("<button class='tm_btn' type='button' id='s' title='从后台数据库搜索本题目的其他人上传的参考答案'>搜索答案</button>");
        $(".tm_mnavigator").append("<button class='tm_btn' type='button' id='u' title='把你现在题目的答案上传到后台数据库，可供其他人参考'>上报答案</button>");
        console.log(Date()+ ": sigal mode，ready to run checker:");
    }
    else if($('.tm_paper_question').length > 0){
        //$(".tm_adm_paper_foot").append("<button class='tm_btn' type='button' id='up' title='可以把所有题目上传，不会上传答案'>上报试题</button>");
        $(".tm_adm_paper_foot").append("<button class='tm_btn' type='button' id='se' title='可以刷新全部答案，有答案的编号会变黄，每隔5分钟可以刷新一次'>刷新答案(1)</button>");
        window.setTimeout(function() {
            alert('查题辅助使用说明：\n' +
                  '1、双击题干部分会把你本题答案上传到后台数据库，供其他人参考\n' +
                  '2、最后面的 刷新答案 按钮，每5分钟可以刷新一次全部题目的参考答案。\n' +
                  '3、获取答案后如果有人上传过，题号会变黄，鼠标移动到题号上会显示参考答案\n' +
                  '4、本着共享原则，请积极上传答案，上传一次答案获得一次刷新机会')
        }, 8000);
        console.log(Date()+ ": all question mode，ready to run checker");
    }
    else{
    console.log(Date()+ ": error mode.");
    }
}
else if(window.location.pathname == '/user/paper/history_detail.thtml' || window.location.pathname == '/user/selftest/historydetail.thtml'){
     if($("table.tm_paper_question > tbody > tr > td > div:nth-child(2) > fieldset:nth-child(1)").length > 0){
        $(".tm_adm_paper_foot").append("<button class='tm_btn' type='button' id='upload_anwsers' title='上报标准答案'>上报答案</button>");
        $("#div_processor_ops").append("<button class='tm_btn' type='button' id='upload_anwsers1' title='上报标准答案'>上报答案</button>");

        console.log(Date()+ ": answer mode，ready to upload");
    }
}


$('#s').on('click',function(){
    checker();
    $('#s').attr("disabled", "disabled");
    var id = 20;
    //定时执行
    var timeing = setInterval(function() {
        id = id - 1;
        $('#s').html('禁用(' + id + 's)');
    }, 1000);
    //延迟执行
    window.setTimeout(function() {
        //结束定时,恢复按钮可用
        clearInterval(timeing);
        $('#s').html('搜索答案').removeAttr("disabled");
    }, id * 1000);
});

$('#u').on('click',function(){
    upload_ans()
});

$('#se').on('click',function(){
    if (fCount>0){
        Get_all_question_ans();
        $('#se').attr("disabled", "disabled");
        var id = 360;
        //定时执行
        var timeing = setInterval(function() {
            id = id - 1;
            $('#se').html('禁用(' + id + 's)');
        }, 1000);
        //延迟执行
        window.setTimeout(function() {
            //结束定时,恢复按钮可用
            clearInterval(timeing);
            $('#se').html('刷新答案(' + fCount + ')').removeAttr("disabled");
        }, id * 1000);
    }else{
        alert('没有次数了，多上传你的答案吧。');
    }
});

$('#up').on('click',function(){
    Upload_all_questions();
});

$('#upload_anwsers').on('click',function(){
    Upload_All_Answers();
});

$('#upload_anwsers1').on('click',function(){
    Upload_All_Answers();
});

//$("table.tm_paper_question").on('dblclick','th.tm_question_lineheight  > cite',get_ans_all_mode);
$("table.tm_paper_question").on('dblclick','td.tm_question_lineheight',upload_ans_all_mode);
//new api 0630
function get_ans_all_mode(){
    var d = $(this).parents('table.tm_paper_question');
    var current_question = $(d).find('td.tm_question_lineheight').text().trim();
    var title = $(".tm_paper_head > h1").text();
    GM_xmlhttpRequest({
        method: "post",
        url: 'http://49.232.22.5:8998/tom_exam_api_get_ans',
        data: $.param({"title":title,"question":current_question}),
        headers:  {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(data){
            var rets = JSON.parse(data.responseText);
            $('th.tm_question_lineheight  > cite', d).attr("title", rets.data);
            if(rets.y != ''){
                $('th.tm_question_lineheight  > cite', d).attr("style", "color:yellow;");
            }
        },
        onerror : function(err){
             $('th.tm_question_lineheight  > cite', d).attr("title", "get answer error!");
        }
    });
}
//new api 0630
function upload_ans_all_mode(){
    var d = $(this).parents('table.tm_paper_question');
    var selectedOption = "";
    var allselectString = "";
    var realName = "";
    var questionString = "";
    var aa;
    realName = window.parent.frames[0].document.getElementsByClassName("tm_head_tools")[0].getElementsByTagName('span')[0].innerText
    questionString = $(d).find('td.tm_question_lineheight').text().trim();
    aa=$(d).find('label').each(function(i,e){allselectString += ($(e).text().trim()+" ")});
    aa=$(d).find('input').each(function(i,e){if (e.checked){selectedOption += $(e).val()}});
    var title = $(".tm_paper_head > h1").text();
    var answer = ' (参考答案：'+selectedOption+') ';
    if(selectedOption.length == 0){
        alert("答案为空，无法上报奥。");
        return;
    }
    if(window.confirm('你确定要上传答案 '+ answer + ' 吗？')){
        GM_xmlhttpRequest({
            method: "post",
            url: 'http://49.232.22.5:8998/tom_exam_apiv2_upload_ans',
            data: $.param({"question":questionString,"option":allselectString,"answer":' (参考答案：'+selectedOption+') ',"realname":realName,"title":title}),
            headers:  {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(data){
                var rets = JSON.parse(data.responseText);
                console.log(rets.data);
                fCount += 1;
                if($('#se').attr("disabled")!='disabled'){
                    $('#se').html('刷新答案(' + fCount + ')');
                }
            },
            onerror : function(err){
                alert('未知错误！');
            }
        });
    }
}
//new api 0630
function Upload_All_Answers(){
    var questions={};
    $("table.tm_paper_question").each(function(){
        var q = $('td.tm_question_lineheight', this).text().replace(/\s+/g, ' ').trim();
		var o = $("tbody > tr > td > ul", this).text().replace(/\s+/g, ' ').trim();
		var a = $("tbody > tr > td > div:first > fieldset:nth-child(1)", this).text().replace(/\s+/g, ' ').trim();
		var id = $('th.tm_question_lineheight  > cite', this).text().trim();
        if (a != ""){
            questions[id] = {'q':q,'o':o,'a':a,'n':'[标准答案]'};
        }
    })
    var title = $(".tm_paper_head > h1").text().trim();
    GM_xmlhttpRequest({
        method: "post",
        url: 'http://49.232.22.5:8998/tom_exam_api_upload_real_answers',
        data: $.param({"questions":JSON.stringify(questions),"title":title}),
        headers:  {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(data){
            var rets = JSON.parse(data.responseText);
            alert(rets.data);
        },
        onerror : function(err){
            alert("upload anwsers error!");
        }
    });

}


//new api 0630
function Upload_all_questions(){
    var title = $(".tm_paper_head > h1").text();
    var questions={};
    $(".tm_paper_question").each(function(){
        var q = $('td.tm_question_lineheight', this).text();
		var o = $("tbody", this).text();
		var id = $('th.tm_question_lineheight  > cite', this).text();
        questions[id] = {'q':q.replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/\s+/g, ' ').trim(),'o':o.replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/\s+/g, ' ').trim()};
    })
    var realName = window.parent.frames[0].document.getElementsByClassName("tm_head_tools")[0].getElementsByTagName('span')[0].innerText
    GM_xmlhttpRequest({
        method: "post",
        url: 'http://49.232.22.5:8998/tom_exam_api_upload_all_questions',
        data: $.param({"questions":JSON.stringify(questions),"realname":realName,"title":title}),
        headers:  {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(data){
            var rets = JSON.parse(data.responseText);
            alert(rets.data);
        },
        onerror : function(err){
            alert("upload questions error!");
        }
    });
}

//new api 0630
function Get_all_question_ans(){
    var questions={};
    $(".tm_paper_question").each(function(){
        var q = $('td.tm_question_lineheight', this).text();
		var o = "";
		var id = $('th.tm_question_lineheight  > cite', this).text();
        questions[id] = {'q':q.replace(/\s+/g, ' ').trim(),'o':o.replace(/\s+/g, ' ').trim()};
    })
    var realName = window.parent.frames[0].document.getElementsByClassName("tm_head_tools")[0].getElementsByTagName('span')[0].innerText;
    var title = $(".tm_paper_head > h1").text();
    GM_xmlhttpRequest({
        method: "post",
        url: 'http://49.232.22.5:8998/tom_exam_api_get_all_question_ans',
        data: $.param({"questions":JSON.stringify(questions),"realname":realName,"title":title}),
        headers:  {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(data){
            var rets = JSON.parse(data.responseText);
            $("th.tm_question_lineheight  > cite").each(function(){
                var id = $(this).text().trim();
                $(this).attr("title", rets[id].o);
                if(rets[id].q != ""){
                    $(this).attr("style", "color:yellow;");
                   }
            })
            fCount -= 1;
            alert("获取答案成功!\n有答案的题目题号会变黄，鼠标移动到题号上会显示参考答案\n每5分钟可以刷新一次全部题目答案，单题双击刷新不受限制");
        },
        onerror : function(err){
            alert("get answer error!");
        }
    });

}




//new api 0630
function upload_ans(){
    var selectedOption = "";
    var allselectString = "";
    var realName = "";
    var questionString = "";
    var aa;
    $('#answer').text("上报中...");
    realName = window.parent.frames[0].document.getElementsByClassName("tm_head_tools")[0].getElementsByTagName('span')[0].innerText
    questionString = $("table[style='display: table;']").find('.tm_mbox_question').text().trim();
    aa=$("table[style='display: table;']").find('label').each(function(i,e){allselectString += ($(e).text().trim()+" ")});
    aa=$("table[style='display: table;']").find('input').each(function(i,e){if (e.checked){selectedOption += $(e).val()}});
    var title = $(".tm_paper_head > h1").text();

    $('#question').text(questionString);
    if(selectedOption.length>0){
        GM_xmlhttpRequest({
            method: "post",
            url: 'http://49.232.22.5:8998/tom_exam_apiv2_upload_ans',
            data: $.param({"question":questionString,"option":allselectString,"answer":' (参考答案：'+selectedOption+') ',"realname":realName,"title":title}),
            headers:  {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(data){
                var rets = JSON.parse(data.responseText);
                $('#answer').text(rets.data);
            },
            onerror : function(err){
                $('#answer').text('未知错误！');
            }
        });
    }
    else{
        $('#answer').text("答案为空，无法上报奥。");
    }

}
function check_paper_type(){
    if ($('.tm_paper_question').length>0){
        alert("不支持整卷显示模式！");
    }
    else if ($('.tm_mbox_question').length==0){
        alert("不支持的模式！");
    }
}


function check_ok(){
    var realName = window.parent.frames[0].document.getElementsByClassName("tm_head_tools")[0].getElementsByTagName('span')[0].innerText
    var title = $(".tm_paper_head > h1").text();
    GM_xmlhttpRequest({
        method: "post",
        url: 'http://49.232.22.5:8998/check_ok',
        data: $.param({"pathname":window.location.pathname,"realName":realName,"title":title}),
        headers:  {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(data){
            var retstr = data.responseText;

            if(retstr == 'ok'){
                console.log("连接查题服务器成功！");
               }
            else{
                console.log("查题服务器返回异常！");
            }
        },
        onerror : function(err){
            console.log("连接查题服务器端异常！");
        }
    });
}

//new api 0630
function checker(){
    console.log(Date()+ "start check.");
    var current_question = $("table[style='display: table;']").find('.tm_mbox_question').text();
    current_question = $.trim(current_question);
    var title = $(".tm_paper_head > h1").text();
    var realName = window.parent.frames[0].document.getElementsByClassName("tm_head_tools")[0].getElementsByTagName('span')[0].innerText
    console.log(current_question);
    $('#question').text(current_question);
    $('#answer').text("获取中...");
    GM_xmlhttpRequest({
        method: "post",
        url: 'http://49.232.22.5:8998/tom_exam_apiv2_get_ans',
        data: $.param({"title":title,"realname":realName,"question":current_question}),
        headers:  {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(data){
            var rets = JSON.parse(data.responseText);
//             $('#answer').text(rets.data);
            $('#answer').html(rets.data);
        },
        onerror : function(err){
            $('#answer').text("get answer error!");
        }
    });
}

})();