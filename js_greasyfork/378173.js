// ==UserScript==
// @icon
// @name            全网站视频画中画模式
// @namespace       HZH
// @author          LL99LL
// @description     使用画中画模式观看视频,适合谷歌70以上版本
// @match           *
// @include         *
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.1.1
// @downloadURL https://update.greasyfork.org/scripts/378173/%E5%85%A8%E7%BD%91%E7%AB%99%E8%A7%86%E9%A2%91%E7%94%BB%E4%B8%AD%E7%94%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/378173/%E5%85%A8%E7%BD%91%E7%AB%99%E8%A7%86%E9%A2%91%E7%94%BB%E4%B8%AD%E7%94%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let video=null
    $(function () {
        //查找video
        let findVideo=function(DOM=document.body){
            video = DOM.querySelector("video")
            if (video){
                loadButton(video)
                return
            }
            DOM.querySelectorAll("iframe").forEach(function(iframe){
                console.log(iframe)
                console.log(iframe.contentWindow)
                iframe.contentWindow.onload = function() {
                    findVideo(iframe.contentDocument.body)
                }
            })

        }
        let loadButton=function(){
            let button = '<button id="HZHBtn" title="画中画" draggable="true"  style="cursor:pointer;opacity:0.5;width:20px;height:20px;border-radius:10px;position: fixed;top: 5px;left: 5px;z-index: 10000; border: 5px solid #888; padding: 0;"></button>';
            let body = $("body");
            if (body) {
                body.append(button);
                $('#HZHBtn').hover(function(){
                    $('#HZHBtn').css('opacity','1')
                },function(){
                    $('#HZHBtn').css('opacity','0.5')
                })
            }
        }

        findVideo()
        $("#HZHBtn").click(function () {
            //获取播放器（video）对象
            var btn=$('#HZHBtn')[0]
            if (video !== document.pictureInPictureElement) {
                // 尝试进入画中画模式
                video.requestPictureInPicture();
            } else {
                // 退出画中画
                document.exitPictureInPicture();
            }
        });
    });

})();