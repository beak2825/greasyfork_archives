// ==UserScript==
// @name         B站视频按播放数量过滤
// @namespace    没有
// @version      4
// @description  自动隐藏，或淡化播放数量不足的视频
// @author       cakiihana（cakiihana@live.cn）
// @match        *://search.bilibili.com/all?*
// @match        *://search.bilibili.com/video?*
// @grant        none
// @require      http://code.jquery.com/jquery-1.7.2.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438093/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%8C%89%E6%92%AD%E6%94%BE%E6%95%B0%E9%87%8F%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/438093/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%8C%89%E6%92%AD%E6%94%BE%E6%95%B0%E9%87%8F%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

//主函数，负责开始工作及调用其他，每秒调用一次blockVideo函数
$(function(){
    console.log('B站视频按播放数量过滤 - 已启动');
    setBlock();
    setInterval(blockVideo, 1000);
})

//绘制输入框
function setBlock(){
    $(".conditions-order.flex_between").append("<div>筛选阈值：<input id='blockNum' style='width:70px;padding:1px 5px'></input></div>")
    if (!localStorage.blockVal) {
        localStorage.blockVal = 500;
    }
    $("#blockNum").val(localStorage.blockVal)
    $("#blockNum").bind("change mouseenter", function(){
        blockVideo();
        localStorage.blockVal = $("#blockNum").val();
    })
}

//对不符合要求的视频进行隐藏，或降低透明度
function blockVideo(){
    $(".bili-video-card__stats--left .bili-video-card__stats--item span:even").each(function(i,val){
        var s = val.innerHTML;
        if (s.slice(-1) == "万"){
            s = parseFloat(s.slice(0,-1))*10000;
        }else{
            s = parseFloat(s);
        }

        if (s < $("#blockNum").val()){
            //$(this).parents(".col_3.col_xs_1_5.col_md_2.col_xl_1_7.mb_x40").css("opacity","0.2");
            $(this).parents(".col_3.col_xs_1_5.col_md_2.col_xl_1_7.mb_x40").hide();
        } else {
            $(this).parents(".col_3.col_xs_1_5.col_md_2.col_xl_1_7.mb_x40").show();
        }
    })
}