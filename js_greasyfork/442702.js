// ==UserScript==
// @name         国图公开课干掉Flash
// @namespace    https://qinlili.bid
// @version      0.2
// @description  2022年了肯定是不可能再装Flash的捏
// @author       琴梨梨
// @match        *://open.nlc.cn/onlineedu/course/play.htm?*
// @match        *://video.nlc.cn/nlcPlayerHook?*
// @icon         http://open.nlc.cn/onlineedu/client_res/files/favicon.ico?7.1.0
// @grant        none
// @run-at       document-start
// @license      MPLv2
// @require      https://lib.baomitu.com/hls.js/1.1.5/hls.min.js#sha512-O83G0C/Ypje2c3LTYElrDXQaqtKKxtu8WKlMLEMoIFs9HDeI4rMlpnn9AX5xvR3PgJpwSEBrZpxSzfE1usZqiQ==
// @downloadURL https://update.greasyfork.org/scripts/442702/%E5%9B%BD%E5%9B%BE%E5%85%AC%E5%BC%80%E8%AF%BE%E5%B9%B2%E6%8E%89Flash.user.js
// @updateURL https://update.greasyfork.org/scripts/442702/%E5%9B%BD%E5%9B%BE%E5%85%AC%E5%BC%80%E8%AF%BE%E5%B9%B2%E6%8E%89Flash.meta.js
// ==/UserScript==

(function() {
    'use strict';
    switch(location.host){
        case "open.nlc.cn":{
            console.log("Enabled Haruka Player!");
            const confirm=window.confirm;
            window.confirm=text=>{
                if(text.indexOf("Flash")==-1){
                    confirm(text);
                }
            };
            (function(open) {
                XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
                    if(url.indexOf("lesson/play.htm")>0){
                        console.log(url)
                        console.log("Haruka successfully got link request!")
                        this.addEventListener('load', event=>{
                            const videoInfo=JSON.parse(this.response);
                            let videoLink;
                            //获取最高清晰度
                            for(let i=4;i>0;i--){
                                if(!(videoInfo.coursefile["clarity"+i]=="")){
                                    videoLink=videoInfo.coursefile["clarity"+i];
                                }
                            }
                            if(videoLink){
                                console.log("Haruka successfully parsed video link:"+videoLink);
                                if(videoLink.indexOf(".mp4")>0){
                                    let videoElement=document.createElement("video");
                                    videoElement.controls=true;
                                    videoElement.src=videoLink;
                                    videoElement.style="width: 100%;height: 100%;top: 0px;bottom: 0px;left: 0px;right: 0px;";
                                    document.getElementById("lesson-video-content").removeChild(document.getElementById("shinyvVodCaptionPlayer"));
                                    document.getElementById("lesson-video-content").appendChild(videoElement);
                                    console.log("Haruka successfully build video element!");
                                };
                                if(videoLink.indexOf(".m3u8")>0){
                                    console.log("M3u8 link cannot be played directly!Creating iframe now!")
                                    let videoCover=document.createElement("iframe");
                                    videoCover.style="object-fit:contain;width: 100%;height: 100%;top: 0px;bottom: 0px;left: 0px;right: 0px;"
                                    videoCover.src="http://video.nlc.cn/nlcPlayerHook?"+videoLink;
                                    videoCover.allowFullscreen=true;
                                    document.getElementById("lesson-video-content").removeChild(document.getElementById("shinyvVodCaptionPlayer"));
                                    document.getElementById("lesson-video-content").appendChild(videoCover);
                                }
                            }else{
                                console.error("Haruka failed to parse video link!")
                            }
                        });
                    }
                    open.call(this, method, url, async, user, pass);
                };
            })(XMLHttpRequest.prototype.open);
            break;
        }
        case "video.nlc.cn":{
            document.body.innerHTML=`<video id="player" autoplay preload controls style="width: 100%;height: 100%;background-color: black;position: absolute;top: 0px;bottom: 0px;left: 0px;right: 0px;"></video>`;
            document.body.style.margin="0px";
            const player=document.querySelector("#player");
            const link=location.search.substr(1);
            if (Hls.isSupported()) {
                var hls = new Hls();
                hls.loadSource(link);
                hls.attachMedia(player);
            }else{
                console.log("Failed to load Hls module!")
            }
            break;
        }
    }
})();