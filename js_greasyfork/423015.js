// ==UserScript==
// @name        uooc防止失去焦点，自动二倍数播放。
// @include    */www.uooc.net.cn/*
// @version     1.0
// @description 支持失去焦点继续播放,增加二倍速播放。
// @grant       none
// @namespace 1536902260
// @downloadURL https://update.greasyfork.org/scripts/423015/uooc%E9%98%B2%E6%AD%A2%E5%A4%B1%E5%8E%BB%E7%84%A6%E7%82%B9%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%BA%8C%E5%80%8D%E6%95%B0%E6%92%AD%E6%94%BE%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/423015/uooc%E9%98%B2%E6%AD%A2%E5%A4%B1%E5%8E%BB%E7%84%A6%E7%82%B9%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%BA%8C%E5%80%8D%E6%95%B0%E6%92%AD%E6%94%BE%E3%80%82.meta.js
// ==/UserScript==
 $(document).ready(function () {
    setInterval(function () {
        var videoButton = document.getElementsByClassName("vjs-big-play-button animated fadeIn")[0];
        if(videoButton !== undefined)
        {
            var video = document.getElementById("player_html5_api");
            video.onended = function() {alert("视频已播放完成");};
            video.muted = true;
            videoButton.click();
            document.getElementsByTagName("video")[0].playbackRate=2;
        }
    },1000);
});