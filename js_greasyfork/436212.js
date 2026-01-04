// ==UserScript==
// @name         干教网防自动暂停插件插件
// @include      http://bjce.bjdj.gov.cn
// @include      http://el-bjce.bjdj.gov.cn
// @version      1.0
// @description  干教网学习插件，无法播放的视频强制开始计时；阻止30分钟未移动鼠标课件暂停播放
// @author       Yang Kang
// @match        http://el-bjce.bjdj.gov.cn/elms/gjwweb/personspace/broadcastCourse.action*
// @license MIT
// @grant        none
// @namespace http://bjce.bjdj.gov.cn
// @downloadURL https://update.greasyfork.org/scripts/436212/%E5%B9%B2%E6%95%99%E7%BD%91%E9%98%B2%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E6%8F%92%E4%BB%B6%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/436212/%E5%B9%B2%E6%95%99%E7%BD%91%E9%98%B2%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E6%8F%92%E4%BB%B6%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //强制开始计时
    $("#countTime",parent.document).timer("startTimer");
    console.log("强制开始计时");

    //阻止30分钟未移动鼠标课件暂停播放
    var _alert=window.alert
    window.alert = function() {
        console.log("阻止了一个弹出框");
        return true;
        console.log("返回了true开始播放");

        //阻止失败，强制播放
        var player=parent.document.getElementById("MediaPlayer");
        $("#jquery_jplayer_1",parent.document).jPlayer('play');
        player.play();
        console.log("开始播放");
        $("#countTime",parent.document).timer("startTimer");
    }

})();