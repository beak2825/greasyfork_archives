// ==UserScript==
// @name         myhm-study
// @namespace    http://tampermonkey.net/my-tools
// @version      0.1.3
// @description  自动播放学习视频，避免弹窗干扰
// @author       my-coder
// @match        *://zyjs.myhm.org/Learn.asp*
// @require      https://code.jquery.com/jquery-1.7.2.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454347/myhm-study.user.js
// @updateURL https://update.greasyfork.org/scripts/454347/myhm-study.meta.js
// ==/UserScript==

(function() {
    'use strict';



    var finished = [];
    var unfinished = [];


    $('a[target="study"]').each((index, item) => {
        var status = $(item).siblings("font").first().attr('color');
        if(status == "green") {
            finished.push($(item).attr('href'));
        } else {
            unfinished.push($(item).attr('href'));
        }
        $(item).attr("target", "studyiFrame");
    });


    $("body").append(`<div id="study-iframe-container" style="position:fixed;top:16px;right:16px;background:white; box-shadow:0 0 0 1px rgba(0,0,0,.08),0 4px 12px 1px rgba(0,0,0,.2);-webkit-box-shadow:0 0 0 1px rgba(0,0,0,.08),0 4px 12px 1px rgba(0,0,0,.2);" >
    <div id="iframe-tool" style="border-bottom:1px solid;"></div>
    <iframe id="studyiFrame" name="studyiFrame" width="400" height="300" src="" style="border:none;padding:0;margin:0;"> </iframe>
    </div>`);


    if(unfinished.length > 0) {
       $("#studyiFrame").attr("src", unfinished[0]);
       $("#studyiFrame").attr("data-index", 0);
    }


    var _watchtimer ;
    $("#studyiFrame").on("load", function() {

         document.getElementById("studyiFrame").contentWindow.clearInterval(document.getElementById("studyiFrame").contentWindow.timerPop);

        var myStudy = document.getElementById("studyiFrame").contentWindow.myStudy;
        var layer = document.getElementById("studyiFrame").contentWindow.layer;


        $(window.frames["studyiFrame"].document).find("div").hide();

        $(window.frames["studyiFrame"].document).find(".main-left").hide();
        $(window.frames["studyiFrame"].document).find("table").attr("width", "390px");

        _watchtimer = setInterval(function(){
            layer.closeAll();


            var process = $(window.frames["studyiFrame"].document).find("#jd").attr("width");
            if (process == "100%") {
                myStudy.end();
            }

            var txt = $(window.frames["studyiFrame"].document).find("#jd_info").text();
            if (txt.endsWith('已完成')) {

                window.location.reload();

                // var i = $("#studyiFrame").attr("data-index");
                // i++;
                // $("#studyiFrame").attr("src", unfinished[i]);
                // $("#studyiFrame").attr("data-index", i);
            }
        }, 3000);
    });


    $("#iframe-tool").html("<strong style='margin:0 8px; padding:4px;'>继续教育挂机软件</strong><a id='close-btn' style='display:inline-block; padding:4px; margin:8px; color: red;'>关闭</a>");
    $("#close-btn").click(() => {
        clearInterval(_watchtimer);
        $("#study-iframe-container").remove();
    });
})();