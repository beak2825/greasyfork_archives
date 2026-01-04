// ==UserScript==
// @name         Stu video
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  try to take over the world!
// @author       You
// @match        http://fileservice.neusoft.edu.cn/fileservice/api/previewservice/*
// @match        http://hw.neusoft.edu.cn/hw/lrn/lrn.do*
// @grant        unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/416735/Stu%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/416735/Stu%20video.meta.js
// ==/UserScript==
function skipThisVideo() {
    var html = document.createElement('div');
    html.style.color = 'black'
    html.style.position = 'fixed';
    html.style.top = '10px';
    html.style.left = '10px';
    html.style.width = '150px'
    html.style.height = '80px'
    html.style.backgroundColor = 'rgba(0.2,0.2,0.2,0.6)'
    html.style.cursor = 'pointer'
    html.style.zIndex = 9999;
    html.innerHTML = '<p3>' + '跳过这个' + '</p3>'
    html.addEventListener("click",() => {
        GM_setValue("finished", true)
        window.close()
    })
    document.body.appendChild(html)
}

(function () {
    'use strict';
    const location = window.location.href


    if (location.startsWith("http://hw.neusoft.edu.cn/hw/lrn/lrn.do")) {
        //列表页面
        GM_setValue("finished", true)

        var video_btn_list = new Array()
        video_btn_list.push(...$(".icon-file-movie").parent().parent().parent().find(".btn_online"))
        var mainH = setInterval(() => {
            if (video_btn_list.length === 0) {
                //没了
                clearInterval(mainH)
                return
            }
            if (GM_getValue("finished")) {
                let v = video_btn_list.shift();
                v.style.backgroundColor = "green";
                v.click();
                GM_setValue("finished", false)
            }
            console.log(GM_getValue("finished"))
        }, 5000);
    }

    /*
    $("button.btn_online").on("click", function () {

        var rid, datid, fileid, filetype, vfiletype, resourceurl;

        rid = $(this).parents(".row").children("input[name='rid']").val();
        datid = $(this).parents(".row").children("input[name='datid']").val();
        fileid = $(this).parents(".row").children("input[name='fileid']").val();
        filetype = $(this).parents(".row").children("input[name='filetype']").val();

        //resourceurl=$(this).parents(".row").children("input[name='resourceurl']").val();
        $.ajax({
            type: 'post',
            url: 'fileview.do',
            data: "fileid=" + fileid,
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (data.success == false)
                    showMsg('提示标题', data.message + ',系统异常，请稍后重试', 1);
                else {
                   

                    url = "http://fileservice.neusoft.edu.cn/fileservice/api/previewservice/preview.do?consid=cres" + data.info + "&inlinefileid=" + fileid + "&inlinefiletype=" + filetype + "&academicyearno=2020&termno=0&courseno=74005TC0A3&teachingclassno=200513-018&datid=" + datid + "&rid=" + rid + "&accessorid=19003160413";
                    window.open(url, "_blank");
                }

            },
            error: function (data) {
                showMsg('提示标题', '系统异常，请稍后重试', 1);
            }
        });
    });

    $("button.btn_down").on("click", function () {

        var rid, datid, fileid, filetype, resourceurl;

        rid = $(this).parents(".row").children("input[name='rid']").val();
        datid = $(this).parents(".row").children("input[name='datid']").val();
        fileid = $(this).parents(".row").children("input[name='fileid']").val();
        filetype = $(this).parents(".row").children("input[name='filetype']").val();
        //resourceurl=$(this).parents(".row").children("input[name='resourceurl']").val();
        $.ajax({
            type: 'post',
            url: 'fileview.do',
            data: "fileid=" + fileid,
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (data.success == false)
                    showMsg('提示标题', data.message + ',系统异常，请稍后重试', 1);
                else {

                    url = "http://fileservice.neusoft.edu.cn/fileservice/api/previewservice/fileload.do?consid=cres" + data.info + "&fileid=" + fileid + "&filetype=" + filetype + "&academicyearno=2020&termno=0&courseno=74005TC0A3&teachingclassno=200513-018&datid=" + datid + "&rid=" + rid + "&accessorid=19003160413";
                    window.open(url);
                }

            },
            error: function (data) {
                showMsg('提示标题', '文件服务异常，请稍后重试', 1);
            }
        });
    });
    */


    if (location.startsWith("http://fileservice.neusoft.edu.cn/fileservice/api/previewservice/")) {
        //视频页面
        GM_setValue("finished", false)
        skipThisVideo()
        setTimeout(() => {
            $(".vjs-big-play-button").click()
            let tilend = setInterval(() => {
                if (videojs.players.myVideo){
                    if(videojs.players.myVideo.ended()) {
                    GM_setValue("finished", true)
                    clearInterval(tilend)
                    window.close()
                }
                }
                if (videojs.players.intro_video){
                    if(videojs.players.intro_video.ended()) {
                    GM_setValue("finished", true)
                    clearInterval(tilend)
                    window.close()
                }
                }
            }, 3000)
        }, 2000)
    }

    // Your code here...
})();