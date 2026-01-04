// ==UserScript==
// @name         安保大学后台自动播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  实现宝安大学自动播放,允许后台播放，让鼠标移动检测失效
// @author       You
// @match        https://www.anbaonet.com//center/online_videos/online_videos.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anbaonet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446300/%E5%AE%89%E4%BF%9D%E5%A4%A7%E5%AD%A6%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/446300/%E5%AE%89%E4%BF%9D%E5%A4%A7%E5%AD%A6%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
function mouseTimeSet() {
    LAST_MOUSE_MOVE_TIME = new Date();
 }
(function() {
     window.setInterval(mouseTimeSet,3000);
     if(!IS_AUTO_PLAY)
     {
         VideoAutoPlay();
     }
     window.onblur=null;
})();

