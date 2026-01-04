// ==UserScript==
// @name         浙里学习小助手
// @namespace    www.zjce.gov.cn
// @version      0.1.3
// @description  “浙里学习”的按专题学习脚本
// @author       wxjwolf
// @run-at       document-start
// @match        https://www.zjce.gov.cn/specialSubject/detail?id=*
// @match        https://www.zjce.gov.cn/videos/detail/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.0.0/jquery.js
// @icon         https://www.zjce.gov.cn/favico.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488389/%E6%B5%99%E9%87%8C%E5%AD%A6%E4%B9%A0%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/488389/%E6%B5%99%E9%87%8C%E5%AD%A6%E4%B9%A0%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function()
 {
    'use strict';
    var hUrl=window.location.href;
    setTimeout(() => {showall()}, 1000*5)
})();

function showall(){
    console.log("on showall()")
    var btnShowall = $('.show_all:eq(0)')
    if(btnShowall == null){
        console.log("showall() returns null!")
    }
    else{
        btnShowall.click()
    }
    setTimeout(() => {listvideo()}, 1000*3)
}
function listvideo(){
    console.log("on listvideo()")
    var videos = $('.video-item');
    if (videos.length === 0) {
        console.log("没有找到 video-item 元素！");
        return;
    }
    else {
        videos.each(function() { // 遍历所有 .video-infos 元素
            var $this = $(this); // 当前遍历到的 .video-infos 元素的 jQuery 对象
            var $playButton = $this.find('.ellipsis.desc-author.progerss'); // 替换为实际的播放按钮类名
            console.log("测试长度：" + $playButton.text().length + " 内容：" + $playButton.text())
            if ($playButton.length > 0 && ($playButton.text().indexOf("未学习") >0 || $playButton.text().indexOf("正在观看") >0 || checkContentForLearningProgress($playButton.text()))) {
                $this.find('.img_style').click();
                setTimeout(function() {
                    viewvideo();
                }, 3000);
                return false; // 在 jQuery 的 .each() 中，返回 false 会停止遍历
            }
        });
    }
}

function viewvideo(){
    setInterval(() => {playvideo()}, 1000*3)
}

function playvideo(){
    var video = document.querySelector("#video-player > div.dplayer-video-wrap > video")
    var set_contentcount=0;
    var set_content=$('.set-content');
    set_contentcount=set_content.length;
    console.log("set_content元素数量：" + set_contentcount);
    if(video == null) return
    console.log("视频是否暂停：" + video.paused)
    var progressbar = document.querySelector('#__layout > div > div > div.video-content > div.video-wrapper > div > div.progress-content > div > div > div > span')
    console.log("视频播放进度：" + progressbar.innerText)
    if(video.paused == true){
        if(progressbar.innerText == ''){
            if (set_contentcount > 0 && set_content.eq(set_contentcount - 1).find('.set-progress').text().indexOf("100%")<=0){
                set_content.each(function() {
                    var $this = $(this);
                    var $progress = $this.find('.set-progress');
                    if ($progress.length > 0 && $progress.text().indexOf("100%") == -1) {
                        $this.click();
                        return false;
                    }
                })
            }
            else {
                window.history.back();
                setTimeout(() => {showall()}, 1000*3)
            }
        }
        else{
            video.click();
            video.volume=0;
        }
    }
}
function checkContentForLearningProgress(content) {
    const regex = "/已学习\d{1,2}%?/";
    const match = content.match(regex);
    return match !== null;
}