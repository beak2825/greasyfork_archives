// ==UserScript==
// @name         去头条视频广告
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        http://video.eastday.com/a/*.html*
// @grant       unsafeWindow
// @grant       GM_setClipboard
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/30642/%E5%8E%BB%E5%A4%B4%E6%9D%A1%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/30642/%E5%8E%BB%E5%A4%B4%E6%9D%A1%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
mp4long=0;//去掉广告
$(document).ready(function(){ 
    video0();
    //缩短加载时间,;默认3秒;
    setTimeout(function() {
        video0= function() {
           console.log('覆盖原函数');
        };
    },500);
});
