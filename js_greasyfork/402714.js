// ==UserScript==
// @name         学习通查看个人详细数据
// @namespace    jysir_xuexitong_script
// @version      2.0.2
// @description  查看个人排名 【老师视角】 
// @author       Jysir_
// @include      *://*.chaoxing.com/mycourse/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_info
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/402714/%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%9F%A5%E7%9C%8B%E4%B8%AA%E4%BA%BA%E8%AF%A6%E7%BB%86%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/402714/%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%9F%A5%E7%9C%8B%E4%B8%AA%E4%BA%BA%E8%AF%A6%E7%BB%86%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

function dynamicLoadCss(url) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type='text/css';
    link.rel = 'stylesheet';
    link.href = url;
    head.appendChild(link);
}

dynamicLoadCss('https://mooc1-1.chaoxing.com/css/statistic/moockTj.css');

(function() {
    'use strict';
    var $ = $ || window.$;
    var window_url = window.location.href;
    var website_host = window.location.host;

    //iframe中不再执行
    if (window.top != window.self) {
        return;
    }
    //      var gv = {
    //             clazzid: '',
    //             courseId: '',
    //             userid: '',
    //             schoolid: '',
    //             rightPartition: '',
    //             cpi : '',
    //             openc : ''
    //         };

    var pop = '<div id="popLayer" style="display: none;background-color: #B3B3B3;position: absolute;top: 0;right: 0;bottom: 0;left: 0;z-index: 10;-moz-opacity: 0.8;opacity:.80;filter: alpha(opacity=80);">' +
        '</div><div id="popBox" style="padding:20px 10px 20px 10px;display: none;background-color: #FFFFFF;z-index: 11;width: 800px;height: 620px;position:fixed;top:0;right:0;left:0;bottom:0;margin:auto;">' +
        '<div id="pop_content" style="height:580px;overflow-y:auto;width:100%">正在加载...</div>' +
        '<div id="more" style="padding-top:20px;width:100%;text-align:center">' +
        '<div id="ex_home" style="display:inline-block;background-color:#177cb0;color:white;padding:6px;margin-right:10px;margin-left:10px">首页</div>' +
        '<div id="ex_last" style="display:inline-block;background-color:#177cb0;color:white;padding:6px;margin-right:10px;margin-left:10px">上一页</div>' +
        '<div id="ex_next" style="display:inline-block;background-color:#177cb0;color:white;padding:6px;margin-right:10px;margin-left:10px">下一页</div>' +
        '<div id="closepop" style="display:inline-block;background-color:#177cb0;color:white;padding:6px;margin-right:10px;margin-left:10px" >关闭</div>' +
        '</div>' +
        '<div id="ex_page" style="display:none">1</div>'
        ;

    $("body").append(pop);



    console.log(gv);
    var detail = gv;
    var chaoxing_helper = {};

    chaoxing_helper.generateHtml = function() {
        var $that = this;
        var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:40%;left:0px;'>" +
            "<div id='fun6' style='font-size:12px;padding:8px 2px;color:#FFF;background-color:#FE8A23;'>成绩排名</div>" +
            "</div>";
        $("body").append(topBox);

        $("#more").on("click", "#ex_home", function() {
            $("#ex_page").html(1);
            getContent(parseInt($("#ex_page").html()));
        });

        $("#more").on("click", "#ex_last", function() {
            $("#ex_page").html( parseInt($("#ex_page").html()) - 1 );
            getContent(parseInt($("#ex_page").html()));
        });

        $("#more").on("click", "#ex_next", function() {
            $("#ex_page").html( parseInt($("#ex_page").html()) + 1 );
            getContent(parseInt($("#ex_page").html()));
        });

        $("#more").on("click", "#closepop", function() {
            var popBox = document.getElementById("popBox");
            var popLayer = document.getElementById("popLayer");
            popBox.style.display = "none";
            popLayer.style.display = "none";

        });

        $("body").on("click", "#fun6", function() {
            popBox();
        });



    };
    chaoxing_helper.start = function() {
        this.generateHtml();
    };
    chaoxing_helper.start();


})();

function popBox() {
    var popBox = document.getElementById("popBox");
    var popLayer = document.getElementById("popLayer");
    popBox.style.display = "block";
    popLayer.style.display = "block";
    $("#ex_page").html(1);
    getContent(1);
};

function getContent(num) {
    var list = {
        "courseId": gv.courseId,
        "classId": gv.clazzId,
        "pageSize": "30",
        "sw": "",
        "pageNum": num,
        "fid": "0",
        "sortType": "1",
        "order": "score",
        "test": "0",
        "isSimple": "0",
        "openc":gv.openc
    };
    $.ajax({
        //请求方式
        type: "POST",
        //请求的媒体类型
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        //请求地址
        url: "https://mooc1-1.chaoxing.com/moocAnalysis/analysisScoreData",
        //数据，json字符串
        data: list,
        //请求成功
        success: function(result) {
            console.log(result);
            $("#pop_content").html(result.replace(/{/g, '').replace(/}/g, ''));
        },
        //请求失败，包含具体的错误信息
        error: function(e) {
            console.log(e.status);
            console.log(e.responseText);
            $("#pop_content").html("加载失败");
        }
    });
}
