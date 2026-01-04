// ==UserScript==
// @name         哪里不会选哪里
// @namespace    https://www.a-mao.com/
// @version      2.0.1
// @description  今天又被队友气哭了呜呜呜呜，计算机组成原理摸鱼摸够一个学期，期末考怎么办呀呜呜呜呜呜，写了个脚本导出原来的测验题组个题库。自用，学习通课程计算机组成原理期末考划词搜题
// @author       阿毛 Aylmer
// @icon         http://public.cdn.yangtuo.net.cn/test/favicon.ico
// @match        *://*.chaoxing.com/exam/test/reVersionTestStartNew*
// @match        *://*.edu.cn/exam/test/reVersionTestStartNew*
// @match        *://mooc1-1.chaoxing.com/*
// @run-at       document-end
// @noframes
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @connect      api.yangtuo.me
// @connect      api.a-mao.com
// @require      https://code.jquery.com/jquery-1.12.4.min.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/427559/%E5%93%AA%E9%87%8C%E4%B8%8D%E4%BC%9A%E9%80%89%E5%93%AA%E9%87%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/427559/%E5%93%AA%E9%87%8C%E4%B8%8D%E4%BC%9A%E9%80%89%E5%93%AA%E9%87%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
/*  --一些配置和函数--  */
    var setting = {
        noteserver: 'https://api.yangtuo.me/v4/note/',
        interface: 'https://api.yangtuo.me/v4/',/*接口地址，不要随意改动*/
        notice: '<p style="color: firebrick;">鼠标左键选中你要搜索的关键字，弹起左键后自动搜索。--by 阿毛</p>',
        flag: 0,
        layerBGC: [193, 255, 193, 0.3],/*layer层背景颜色RGBa*/
    };
    function init(){
        $.ajax({
            type:"GET",
            url:setting.noteserver,
            data:{},
            dataType:"json",
            success:function(temp){
                setting.notice = temp.msg;
            },
            error:function(jqXHR){
                console.warn("Error: "+jqXHR.status);
            }
        });
        StartDrawLayer();
    }
    function StartDrawLayer(){
        var implementStr = "<div class='AMaoAnswer' style='position: fixed; top: 10%; left: 70%; width: 300px; max-height: 200px; padding: 3px; border: 1px solid black; border-radius: 5px;background: rgba("+setting.layerBGC[0]+", "+setting.layerBGC[1]+", "+setting.layerBGC[2]+", "+setting.layerBGC[3]+"); overflow-y: auto; z-index: 99999;'>"
        +"<div id='notice' style='font-size: small; text-align: center; padding:5px;'>"
        +setting.notice
        +"</div><div id='sheet'>"
        +"<table id='answers' border='1' style='font-size: x-small;border-collapse: collapse; margin: 3px;'>"
        +"<thead><tr><th>问题</th><th>答案</th><th>备注</th></tr></thead>"
        +"<tbody id='tablebody'></tbody></table></div></div>";
        $("body").append(implementStr);
    }
    function Insert2sheet(str){
        $("#tablebody").append(str);//更新答案表格
        $("#notice").html(setting.notice);//跟新公告栏
    }
    function getAnswer(questionStr){
        $.ajax({
            type:"GET",
            url:setting.interface,
            data:{
                "q": questionStr,
            },
            dataType:"json",
            success:function(AnswerData){
                var r_code=AnswerData.code;
                var r_msg=AnswerData.msg;
                if(r_code === 200){
                    if($("#tablebody").length > 0){
                        $("#tablebody").html("");
                    }
                    $.each(AnswerData.data,function(idx,item){
                           Insert2sheet("<tr><td>" + item.q + "</td><td>" + item.a + "</td><td>" + item.rand + "</td></tr>");
                    })
                }else{
                    alert(r_msg);
                };},
            error:function(jqXHR){
                console.warn("Error: "+jqXHR.status);
            }
        });
    }
/*  --主任务开始 Main Task Begin--  */
/* --开始事务处理-- */

    init();
    $(window).mouseup(function (e) {
	    var txt;
		txt = window.getSelection().toString();
		if (txt.length > 1) {
            console.log("搜题关键字：" + txt);
			getAnswer(txt);
		}
	});

    $(".AMaoAnswer").mouseenter(function(){$(".AMaoAnswer").hide();});
    $(".AMaoAnswer").mouseleave(function(){$(".AMaoAnswer").show();});

/*  --主任务结束 Main Task End--  */
})();