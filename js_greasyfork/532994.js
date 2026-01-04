// ==UserScript==
// @name         泛雅网络教学视频16倍速播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  安装脚本后, 其他操作如常, 视频会自己加速到16倍速。
// @icon         暮暮苒也
// @match        *://*.mooc1.chaoxing.com/mycourse/studentstudy*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532994/%E6%B3%9B%E9%9B%85%E7%BD%91%E7%BB%9C%E6%95%99%E5%AD%A6%E8%A7%86%E9%A2%9116%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/532994/%E6%B3%9B%E9%9B%85%E7%BD%91%E7%BB%9C%E6%95%99%E5%AD%A6%E8%A7%86%E9%A2%9116%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    //视频设置为16倍速播放
    var playVideo = function () {
        var notSet = true
        var videoObj
        var playBtn
        var lastVideoSrc = '' // 用于记录上一个视频的src
        var seed = setInterval(function(){
            try {
                var parentIframe = document.querySelector('#iframe')
                var parentIframeConent = parentIframe.contentWindow.document
                var videoIframe = parentIframeConent.querySelector('iframe')
                var videoIframeConent = videoIframe.contentWindow.document
                var currentVideo = videoIframeConent.querySelector('#video_html5_api')
                // 检测是否是新视频
                if(currentVideo && currentVideo.src !== lastVideoSrc) {
                    notSet = true
                    lastVideoSrc = currentVideo.src
                }

                if(notSet) {
                    console.log("开始设置播放速度")
                    videoObj = currentVideo
                    playBtn = videoIframeConent.querySelector('.vjs-play-control')
                    console.log(playBtn)
                    videoObj.playbackRate = 16
                    Object.defineProperty(videoObj, "playbackRate", {
                        value: 16,
                        writable: false
                    });
                    console.log("设置完成")
                    notSet = false
                }
                else {
                    var palyBtnClassStr = playBtn.getAttribute('class');
                    console.log(palyBtnClassStr.indexOf("vjs-paused"))
                    if(palyBtnClassStr.indexOf("vjs-paused") > 0) {
                        playBtn.click()
                        console.log("自动播放")
                    }
                    console.log("当前视频倍速为:" +  videoObj.playbackRate)
                }
            }catch(err) {
                console.error(err)
                console.log("设置失败, 再次尝试设置")
            }
        }, 1000)
    }

    window.onload = function () {
        playVideo()
    }

})();