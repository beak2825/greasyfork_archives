// ==UserScript==
// @name        尚硅谷视频去水印与从头播放(3-3)
// @namespace   gulixueyuan.com
// @match       http://service-cdn.qiqiuyun.net/js-sdk/video-player/1.1.62/player.html
// @grant       SGG_addStyle
// @version     1.1
// @author      Mr.Wang
// @description 打开视频播放页面后自动从头播放，并去除视频播放过程中出现的水印
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404256/%E5%B0%9A%E7%A1%85%E8%B0%B7%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0%E4%B8%8E%E4%BB%8E%E5%A4%B4%E6%92%AD%E6%94%BE%283-3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/404256/%E5%B0%9A%E7%A1%85%E8%B0%B7%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0%E4%B8%8E%E4%BB%8E%E5%A4%B4%E6%92%AD%E6%94%BE%283-3%29.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //去水印
    setInterval(function(){
      var shuiying = $('div.es-view-mask').next();
      if(shuiying)  shuiying.remove();
    },300);
    $(function () {
        setTimeout(function(){
          console.log('准备从头播放');
          var player = videojs('example_video_1_html5_api');
          //从头播放
          player.currentTime(0);
          player.play();
        },3000)
    });
 
})();