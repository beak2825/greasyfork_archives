// ==UserScript==
// @name         b站已关注作者视频自动点赞
// @namespace    https://greasyfork.org/zh-CN/scripts
// @version      9.9.95
// @description  b站(bilibili)视频自动点赞
// @author       cccq
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/list/*
// @icon         https://ts1.cn.mm.bing.net/th?id=OIP-C.t_km_I0O-asr3a-bNrejjQHaHa&w=204&h=204&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2
// @grant        none
// @license      cccq
// @downloadURL https://update.greasyfork.org/scripts/441895/b%E7%AB%99%E5%B7%B2%E5%85%B3%E6%B3%A8%E4%BD%9C%E8%80%85%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/441895/b%E7%AB%99%E5%B7%B2%E5%85%B3%E6%B3%A8%E4%BD%9C%E8%80%85%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    var count = 0;
    // 获取视频点赞列表的盒子
    var box = document.querySelector('.toolbar-left-item-wrap');
    var time = setInterval(like,3000);
    var VideoSrc;
    if(location.href.indexOf("list") != -1){
        VideoSrc = document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch > div > video");
    }else{
        VideoSrc = document.querySelector('bwp-video').src;
    }
    changeVideo();
    auto();

    // 点赞功能
    function like() {
        if (box.querySelector('.video-like.video-toolbar-left-item') && document.querySelector(".already-btn.van-popover__reference") != undefined) { // 点赞的按钮存在
            // 获取关注盒子
            var care = document.querySelector(".already-btn.van-popover__reference");
            if(box.querySelector(".video-like.video-toolbar-left-item.on") == undefined && care.innerText.indexOf("已关注") != -1){ // 未点赞状态
                // 模拟点击视频点赞
                box.querySelector('.video-like.video-toolbar-left-item').click();
                setTimeout(function(){
                    if(box.querySelector(".video-like.video-toolbar-left-item.on") != undefined){
                        clearInterval(time);// 清除计时器
                    }
                },1000)
            }else{ // 已经点赞了
                clearInterval(time);// 清除计时器
            }
        }
        clearInterval(time);// 清除计时器
    }
    // 自动连播时触发点赞
    function auto(){
        document.querySelector('bwp-video').onended = function(){
            time = setInterval(like,3000);
        }
    }
    // 右侧切换视频时触发点赞
    function changeVideo(){
        var card
        if(location.href.indexOf("list") != -1){
            card = document.querySelectorAll(".action-list-item-wrap");
        }else{
            card = document.querySelectorAll(".video-episode-card");
        }
        console.log(card)
        for(var i = 0;i < card.length;i++){
            card[i].onclick = function(){
                time = setInterval(like,3000);
            }
        }
    }
})();