// ==UserScript==
// @name         快速vip解析，腾讯，爱奇艺，等
// @namespace    autumnwater
// @version      0.1
// @description  解析vip视频
// @author       autumnwater
// @license      GPL
// @match        *://v.qq.com/x/cover*
// @match        *://www.iqiyi.com/v*
// @match        *://www.mgtv.com/b/*
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @icon         https://v.qq.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472936/%E5%BF%AB%E9%80%9Fvip%E8%A7%A3%E6%9E%90%EF%BC%8C%E8%85%BE%E8%AE%AF%EF%BC%8C%E7%88%B1%E5%A5%87%E8%89%BA%EF%BC%8C%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472936/%E5%BF%AB%E9%80%9Fvip%E8%A7%A3%E6%9E%90%EF%BC%8C%E8%85%BE%E8%AE%AF%EF%BC%8C%E7%88%B1%E5%A5%87%E8%89%BA%EF%BC%8C%E7%AD%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var btnStr = '<input id="btnStr" type="button" value="解析" style="position: absolute; width: 40px; height: 40px; z-index: 9999; left: 0px; top: 60px; color: white; background: red; cursor:pointer">';
    $("body").append(btnStr);
    $("#btnStr").hover(function(){
        $("#btnStr").css("background-color","gray");
    },function(){
        $("#btnStr").css("background-color","red");
    });
    $("#btnStr").click(function(){
        var url = window.location.href;
        var videoUrl = "https://jx.jsonplayer.com/player/?url=" + url;
        window.location.href=videoUrl;
    });
})();