// ==UserScript==
// @name         专技天下刷课脚本-常德
// @namespace    https://www.baidu.com
// @version      2020年7月28日 17:47:10
// @description  一个 专技天下刷课 的小脚本  by XieJiaLong
// @author       XieJiaLong
// @match        *://*hbs.zgzjzj.com/*
// @match        *://*.zgzjzj.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407837/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC-%E5%B8%B8%E5%BE%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/407837/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC-%E5%B8%B8%E5%BE%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () {
        for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
            var current_video = document.getElementsByTagName('video')[i]
            //静音
            //console.log('静音');
            current_video.volume = 0
 // 弹出休息框时把他关掉
var xx = document.getElementsByClassName('el-button el-button--default el-button--small el-button--primary');
 if (isNaN(xx)==false){xx=xx[0].getElementsByTagName("span")[0];xx.click()}
     if (isNaN(xx)==true){console.log('没暂停')}

var zt = document.getElementsByClassName('vjs-play-control vjs-control vjs-button vjs-paused')[0].getElementsByTagName("span")[1];
  if (zt.innerText== "Play"){zt.click()};
            //16倍速,不被系统认可，因此注释掉
            //current_video.playbackRate = 500.0
            //视频播放结束后，模拟点击“下一课”
            //console.log(current_video.ended);

            console.log(current_video.ended)
            if (current_video.ended) {
                 var a = document.getElementsByClassName('video-box')[0].getElementsByClassName("el-icon-caret-right")[0];
                 console.log(a);
                 a.click();

window.helloworld = function() {

a = document.getElementsByClassName('vjs-big-play-button')[0].getElementsByClassName("vjs-control-text")[0];
                    setTimeout(console.log(a),3000);
                console.log(a);
                a.click();
}
             for (var x = 0; x < 5; x++) {
    window.setTimeout("helloworld()", 5200);
 }

// vjs-play-control vjs-control vjs-button vjs-paused
// vjs-icon-placeholder


            }
        }
    }, 2000)
})();