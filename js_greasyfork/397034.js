// ==UserScript==
// @name         Revit API 翻译
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Translate Summary!
// @author       Zero
// @match        https://www.revitapidocs.com/*
// @connect      dict.youdao.com
// @connect      translate.google.cn
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/397034/Revit%20API%20%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/397034/Revit%20API%20%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = window.jQuery;
    var googleUrl = 'https://translate.google.cn/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&hl=zh-CN&sl=auto&tl=';

    addButton();

    //页面变动事件
    $("#api-title").bind("DOMNodeInserted",function(){
        setTimeout(function(){
            addButton();
        },600);
    });

    //添加翻译按钮
    function addButton(){
        //$(".descriptionColumn").append("<a id='btn_tran'>>>翻译</a>");
        //$("#btn_tran").on("click", function(){
            tranSummary();
        //});

    }

    //翻译进程
    function tranSummary () {
        var en_text = "";

        $(".summary").each(function(){
            en_text += $(this).text().replace(/[\n\r]/g, '') + "||";
        });

        ajax2(googleUrl + 'zh-CN&q=', encodeURIComponent(en_text));
    }

    function ajax2(url, text, data) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url + text,
            headers: { 'cookie': '' },
            data: data,
            onload: function (res) {
                googleTran(res.responseText);
            },
            onerror: function (res) {
                alert("连接失败");
            }
        });

    }

    // 谷歌翻译 引擎
    function googleTran(rst) {
        var json = JSON.parse(rst),
            html = '';

        for (var i = 0; i < json.sentences.length; i++) {
            html += json.sentences[i].trans;
        }
        var cn_texts = html.split("||");
        cn_texts.forEach(function(text){

        });
        $(".summary").each(function(i,item){
            var txt = "<div>" + cn_texts[i].replace(/^\s*|\s*$/g, '') + "</div>";
            $(this).append(txt);
        });
    }
})();