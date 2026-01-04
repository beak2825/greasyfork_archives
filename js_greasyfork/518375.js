// ==UserScript==
// @name         全能视频下载器-自用-MT
// @namespace    https://qinlili.bid
// @version      0.42
// @description  黑科技！使用MediaSouce的视频下载技术！
// @author       原：琴梨梨,现:MT
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518375/%E5%85%A8%E8%83%BD%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8-%E8%87%AA%E7%94%A8-MT.user.js
// @updateURL https://update.greasyfork.org/scripts/518375/%E5%85%A8%E8%83%BD%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8-%E8%87%AA%E7%94%A8-MT.meta.js
// ==/UserScript==
//这个下载器也可以用于其他网站，自己改一下match地址就行了捏
//这个基于[全能视频下载器-自用]改写的,下载后视频可以用ffmpeg将mp4和mp4a合并，然后用vlc media player播放。或者直接使用potplayer播放（可能出现音频问题）。

(function() {
    'use strict';
    //https://stackoverflow.com/questions/49129643/how-do-i-merge-an-array-of-uint8arrays
    const concat=(arrays)=> {
        // sum of individual array lengths
        let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);

        if (!arrays.length) return null;

        let result = new Uint8Array(totalLength);

        // for each array - copy it over result
        // next array is copied right after the previous one
        let length = 0;
        for(let array of arrays) {
            result.set(array, length);
            length += array.length;
        }

        return result;
    }
    const dlFile = (link, name) => {
        let eleLink = document.createElement('a');
        eleLink.download = name;
        eleLink.style.display = 'none';
        eleLink.href = link;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    }



    (function (addSourceBuffer) {
        MediaSource.prototype.addSourceBuffer = function (mime) {
            console.log(mime)
            switch (mime.substr(0,5)){
                case "audio":
                    window.ams=addSourceBuffer.call(this, mime);
                    return window.ams
                    window.audioBuffer=[];
                    break;
                case "video":
                    window.vms=addSourceBuffer.call(this, mime);
                    return window.vms
                    window.videoBuffer=[];
                    break;
                default:
                    return addSourceBuffer.call(this, mime);
            }
        };
    })(MediaSource.prototype.addSourceBuffer);

    window.videoBuffer=[];
    window.audioBuffer=[];

    (function (appendBuffer) {
        SourceBuffer.prototype.appendBuffer = function (source) {
            if(this==window.ams){
                console.log("audio buffer get")
                window.audioBuffer[window.audioBuffer.length]=source
            }
            if(this==window.vms){
                console.log("video buffer get")
                window.videoBuffer[window.videoBuffer.length]=source
            }
            appendBuffer.call(this, source);
        };
    })(SourceBuffer.prototype.appendBuffer);
    const title=document.createElement("button")
    title.style=`
    position:absolute;
    z-index:9999;
    padding:12px 8px;
    `
    title.setAttribute('id','media_download_video_script')
    document.body.insertBefore(title,document.body.firstChild);
    title.innerText+="[点我开始下载视频]"
    title.addEventListener("click",()=>{
        alert("请仔细阅读说明：\n本工具使用MediaSource下载视频\n点击确认后将以16倍速播放视频\n视频会在播放完成后开始下载\n请保持页面前台运行，千万不要拖拽进度条！！！")
        title.innerText="[正在保存视频，请等待播放完成]"
        const video=document.getElementsByTagName("video")[0]
        video.addEventListener("ended",()=>{
            title.innerText="[正在导出视频]"
            //获取网页标题并处理
            var pageTitle = document.title;
            function sanitizeFileName(title) {
            return title.replace(/[/\\:*?"<>|]/g, '');
            }
            var sanitizedTitle = sanitizeFileName(pageTitle);
            // 创建视频文件Blob并下载
            var videoFile = new Blob([concat(window.videoBuffer)])
            dlFile(URL.createObjectURL(videoFile), sanitizedTitle + ".mp4")
            var audioFile=new Blob([concat(window.audioBuffer)])
            dlFile(URL.createObjectURL(audioFile),sanitizedTitle + ".mp4a")

        })
        video.playbackRate=16
    })

    window.setInterval(()=>{
        if(document.querySelector('#media_download_video_script')==null){
            document.body.insertBefore(title,document.body.firstChild);
        }
    },1000)
})();