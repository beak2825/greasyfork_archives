// ==UserScript==
// @name        汇合-嘉兴继续教育刷课 - jxnh1921.com
// @namespace   Violentmonkey Scripts
// @match       http://www.jxnh1921.com/course/*
// @grant       none
// @version     1.0
// @author      justin.zj.gu
// @description 2023/7/20 02:31:58
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476040/%E6%B1%87%E5%90%88-%E5%98%89%E5%85%B4%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE%20-%20jxnh1921com.user.js
// @updateURL https://update.greasyfork.org/scripts/476040/%E6%B1%87%E5%90%88-%E5%98%89%E5%85%B4%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE%20-%20jxnh1921com.meta.js
// ==/UserScript==

(function () {
  'use strict';
  window.onload = function () {
    //js-learn-prompt
    setInterval( ()=> {


      if ($('div.state-opration.js-state-opration > a').hasClass('open')){
          console.log('视频没放完');
        } else {
          setTimeout(()=>{
            $("a.btn.btn-default.js-next-mobile-btn")[0].click()
          },1000)
          
        }
      for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
        var current_video = document.getElementsByTagName('video')[i]

        // console.log(current_video)

        //允许视频后台播放
        document.addEventListener("visibilitychange", function () {
          if (document.hidden) {
            let videos = document.getElementsByTagName("video");
            for (let i = 0; i < videos.length; i++) {
              videos[i].play();
            }
          }
        });
        // 静音
        current_video.volume = 0

        // 设置倍速，倍速播放不记已学时长，故取消
        // current_video.playbackRate = 2
        if (current_video.paused) {
          current_video.play()
        }
        // 视频播放结束后，模拟点击“下一课”
        if (current_video.ended) {
          nextTag.click()
        }
      }
    }, 2000)
  }
})();