// ==UserScript==
// @name         秒懂百科视频自动打开声音,从5秒开始播放
// @namespace    http://tampermonkey/
// @version      2.1
// @description  如名
// @author       公众号酷玩安卓
// @match        https://baike.baidu.com/video*
// @grant        none
// @license      无
// @downloadURL https://update.greasyfork.org/scripts/495749/%E7%A7%92%E6%87%82%E7%99%BE%E7%A7%91%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%A3%B0%E9%9F%B3%2C%E4%BB%8E5%E7%A7%92%E5%BC%80%E5%A7%8B%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/495749/%E7%A7%92%E6%87%82%E7%99%BE%E7%A7%91%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%A3%B0%E9%9F%B3%2C%E4%BB%8E5%E7%A7%92%E5%BC%80%E5%A7%8B%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    if(document.getElementsByTagName("video")[0].muted){
        document.getElementsByTagName("video")[0].muted=false;
    }
    if(document.getElementsByTagName("video")[0].currentTime<5){
    	document.getElementsByTagName("video")[0].currentTime=5;
    }
})();