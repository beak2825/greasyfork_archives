// ==UserScript==
// @name         西南大学党旗飘飘
// @namespace    匿名
// @version      1.4.0
// @description  如果有时间，还是请大家认真学习党的理论知识。党旗飘飘学习平台刷课工具，不能把视频完全隐藏掉，至少要显示出来一丁点
// @author       匿名
// @license      MIT
// @match        http://222-198-126-210.sangfor.vpn.swu.edu.cn:8118/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.0.0/jquery.js
// @icon         http://www.gov.cn/ztzl/17da/183d03632724084a01bb02.jpg
// @downloadURL https://update.greasyfork.org/scripts/441900/%E8%A5%BF%E5%8D%97%E5%A4%A7%E5%AD%A6%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98.user.js
// @updateURL https://update.greasyfork.org/scripts/441900/%E8%A5%BF%E5%8D%97%E5%A4%A7%E5%AD%A6%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98.meta.js
// ==/UserScript==

let url = location.pathname

if(url == "/ybdy/"){
    document.getElementsByClassName("j_index_more")[0].click()
}

if(url == "/user/lesson"){
    if($(".study_plan2")){
        $(".study_plan2").each((_,element) => {
            if($($(element).find("div")[4]).text() == "未完成"){
                $(element).find("a")[0].click()
            }
        })
    }
}

if(url.endsWith("play")){
    closeAlert()
}

if(url == "/ybdy/lesson/video"){
    $(".head_top_left").find("a[href$='/ybdy/']")[0].click()
}

function closeAlert(){
    let id = setInterval(() => {
        if($(".video_red1>a").css("color") == "rgb(255, 0, 0)"){
            nextVideo(id)
        }else if($(".public_cont>.public_text>p").text() == '您需要完整观看一遍课程视频，才能>获取本课学时，看到视频播放完毕提示框即为完成，然后视频可以拖动播放。'){
            $(".public_cont>.public_btn>a")[0].click()
            if($("input[aria-valuenow=100]").length){
                $("button[class=plyr__control]")[0].click()
            }
        }else if($(".public_cont>.public_text>p").text() == '视频已暂停，点击按钮后继续学习！'){
            $(".public_cont>.public_btn>a")[0].click()
        }else if($(".public_btn>.public_cancel").text() == '继续观看'){
            $(".public_btn>.public_cancel")[0].click()
            if($("input[aria-valuenow=100]").length){
                $("button[class=plyr__control]")[0].click()
            }
        }else if($(".public_cont>.public_text>p").text() == '当前视频播放完毕！'){
            $(".public_cont>.public_btn>a")[0].click()
        }else if($("#wrapper>div>div>button").attr("aria-label") == 'Play'){
            $("#wrapper>div>button").click()
            if($("input[aria-valuenow=100]").length){
                $("button[class=plyr__control]")[0].click()
            }
        }
    }, 1000)
}

function nextVideo(id){
    let videoCount = $(".video_lists>ul>li").length
    $(".video_lists>ul>li").each((_,element) => {
        if($(element).children("a").css("color") != "rgb(255, 0, 0)"){
            $(element).children("a")[0].click()
            return false
        }else{
            videoCount--
            if(videoCount == 0){
                clearInterval(id)
                goback()
            }
        }
    })
}

function goback(){
    $(".video_head>a")[0].click()
}