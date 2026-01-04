// ==UserScript==
// @name         超星视频下载，解除鼠标监听
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  为超星视频提供下载
// @author       boboidrem
// @match        *://*.chaoxing.com/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/404029/%E8%B6%85%E6%98%9F%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%EF%BC%8C%E8%A7%A3%E9%99%A4%E9%BC%A0%E6%A0%87%E7%9B%91%E5%90%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/404029/%E8%B6%85%E6%98%9F%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%EF%BC%8C%E8%A7%A3%E9%99%A4%E9%BC%A0%E6%A0%87%E7%9B%91%E5%90%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取下载地址
    function getVideoUrl(url) {
        if(!url) return '';
        var id = url.split('/').slice(-2)[0];
        return 'http://d0.ananas.chaoxing.com/download/'+ id;
    };

    // 插入按钮
    function setUrl() {
        var video = $("video");
        var video_url = null;

        if(video.length == 0) return;

        video_url = video.attr("src"); //获取视频链接地址
        var url = getVideoUrl(video_url);
        $('body').prepend('<h1><a target="_blank" href="' + url +  '" style="color: orange;border-radius: 4px;border:1px solid #ffa500;margin: 10px;">下载</a></h1>')
    };

    // 破解鼠标检测
    function crackMouse() {
      $(window).off('mousemove');
      $(document).off('mousemove');
    }

    // 初始化
    function init() {
      setUrl();
      crackMouse();
    }

    $(setTimeout(init, 2000));
})();