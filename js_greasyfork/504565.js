// ==UserScript==
// @name         浙里学习小助手2024
// @namespace    www.zjce.gov.cn
// @version      0.1.2
// @description  “浙里学习2024版本”的按课件学习脚本
// @author       wxjwolf
// @run-at       document-start
// @match        https://www.zjce.gov.cn/specialSubject/detail?id=*
// @match        https://www.zjce.gov.cn/videos/detail/*
// @match        https://www.zjce.gov.cn/class/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @icon         https://www.zjce.gov.cn/favico.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504565/%E6%B5%99%E9%87%8C%E5%AD%A6%E4%B9%A0%E5%B0%8F%E5%8A%A9%E6%89%8B2024.user.js
// @updateURL https://update.greasyfork.org/scripts/504565/%E6%B5%99%E9%87%8C%E5%AD%A6%E4%B9%A0%E5%B0%8F%E5%8A%A9%E6%89%8B2024.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.indexOf("/videos/detail/")>0){
        setTimeout(function() {
            viewvideo();
        }, 3000);
    }
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        console.log('捕获的请求 URL:', url); // 输出请求的URL
        if (url.includes('subject/info/info/') || url.includes('class/teachingContent/page?classId=')) {
            this.addEventListener('load', function() {
                // 请求完成后获取响应内容
                const responseText = this.responseText;
                try {
                    // 解析JSON内容
                    const jsonResponse = JSON.parse(responseText);
                    //console.log('捕获的JSON内容:', jsonResponse);
                    if(url.includes('subject/info/info/')){
                        $.each(jsonResponse.data.blockList[0].blockConfigList, function(index, item) {
                            console.log('Item ' + index + ':', item.bizName);
                            const url2=get_url(url,item.bizId,item.type,item.videoId,item.progressName);
                            if (url2){
                                //console.log("找到为播放完成：" + url2)
                                sessionStorage.setItem('previousUrl', window.location.href);
                                window.location.href = url2;
                                return false;
                            }
                        })
                    }
                    else{
                        $.each(jsonResponse.data, function(index, item) {
                            console.log('Item ' + index + ':', item.name);
                            const url2=get_url(url,item.bizId,item.type,item.videoId,item.progressName);
                            console.log(url2)
                            if (url2){
                                //window.location.href = url2;
                                sessionStorage.setItem('previousUrl', window.location.href);
                                //window.location.assign(url2);
                                window.location.href = url2;
                                return false;
                            }
                        })
                    }

                    // 在这里你可以对JSON对象进行操作
                } catch (error) {
                    console.error('JSON解析错误:', error);
                }
            });}
        // 调用原始的open方法，以确保请求正常进行
        originalXhrOpen.apply(this, arguments);
    };
    // Your code here...
})();
function checkContentForLearningProgress(content) {
    const regex = "/已学习\d{1,2}%?/";
    const match = content.match(regex);
    return match !== null;
}
function get_url(url1,bizId,type,videoId,progressName) {
    let retstr="";
    let uuid="";
    if (url1.includes('class/teachingContent/page?classId=')){
        uuid=window.location.href.split('/').pop();
        retstr="https://www.zjce.gov.cn/class/video/" + bizId + "?bizType=" + type + "&uuid=" + uuid}
    else{
        retstr="https://www.zjce.gov.cn/videos/detail/" + bizId + "?bizType=" + type
    }
    if (videoId){
        retstr +="&playId=" + videoId
    }
    //console.log("progressName：" + progressName)
    //console.log(progressName.indexOf("正在观看"))
    if(progressName.indexOf("未学习")>=0 || progressName.indexOf("正在观看")>=0 || checkContentForLearningProgress(progressName)){
        return retstr;
    }
    else{
        return null;
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
                //window.history.back();
                const url3=sessionStorage.getItem('previousUrl');
                window.location.href = url3;
                return false;
                //setTimeout(() => {showall()}, 1000*3)
            }
        }
        else{
            video.click();
            video.volume=0;
        }
    }
}