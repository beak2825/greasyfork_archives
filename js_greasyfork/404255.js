// ==UserScript==
// @name        尚硅谷视频播放完成后关闭当前窗口并播放下一个(2-3)
// @namespace   gulixueyuan.com
// @match       http://www.gulixueyuan.com/course/*/task/*/activity_show
// @grant       none
// @version     1.1
// @author      Mr.Wang
// @description 视频播放完成后关闭当前窗口，并调用打开窗口的播放下一个方法
// @downloadURL https://update.greasyfork.org/scripts/404255/%E5%B0%9A%E7%A1%85%E8%B0%B7%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%AE%8C%E6%88%90%E5%90%8E%E5%85%B3%E9%97%AD%E5%BD%93%E5%89%8D%E7%AA%97%E5%8F%A3%E5%B9%B6%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA%282-3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/404255/%E5%B0%9A%E7%A1%85%E8%B0%B7%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%AE%8C%E6%88%90%E5%90%8E%E5%85%B3%E9%97%AD%E5%BD%93%E5%89%8D%E7%AA%97%E5%8F%A3%E5%B9%B6%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA%282-3%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(function () {
      setTimeout(function(){
        window.addEventListener('message',function(event){
          if(event.data.indexOf('"eventName":"ended","args":{"stop":true')==35){
            setTimeout(function(){
              opener.nextPlay();
            },3000)
          }
        })
      },30 * 1000)
    })
})();