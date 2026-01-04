// ==UserScript==
// @name            百度网盘视频画中画
// @version         0.1
// @namespace       http://tampermonkey.net/
// @author          kakasearch
// @description     为百度网盘播放视频页面增加一个画中画按钮
// @match           https://pan.baidu.com/play/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/427058/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E7%94%BB%E4%B8%AD%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/427058/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E7%94%BB%E4%B8%AD%E7%94%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let getVideo = function(){
        //下次百度云更新，直接改這裏
        return unsafeWindow.videoPlayer.getPlayers().html5player.el_.querySelector('video')
    }
    let loadButton=function(video){
        console.log('画中画加载按钮')
            let button = '<a class="g-button " id="HZHBtn" title="画中画"><span class="g-button-right"><span class="text" style="width: auto;">画中画</span></span></a>'
            document.querySelector("#video-toolbar > div.video-toolbar-buttonbox").innerHTML = button
            
        $("#HZHBtn").click(function () {
            let video = getVideo()
            //获取播放器（video）对象
            var btn=$('#HZHBtn')[0]
            if (video !== document.pictureInPictureElement) {
                // 尝试进入画中画模式
                video.requestPictureInPicture();
            }
        });
        }
    let video=null
    let window=unsafeWindow
    let init = setInterval(function(){
    let video =getVideo()
    if(video){
    clearInterval(init)
          loadButton(video)
    }
    },1000)
})();