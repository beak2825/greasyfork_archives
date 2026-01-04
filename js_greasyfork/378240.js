// ==UserScript==
// @name         Show zh-CN Subtitles for Coursera
// @name:zh      于 Coursera 显示中文（简体）字幕
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show Single zh-CN subtitles when you're watching coursera, and you may modify the script manually as you like!
// @description:zh      在 Coursera 显示中文（简体）字幕，或手动更改脚本来更换其它语言
// @author       Franklin Li
// @include      http://www.coursera.org/*
// @include      https://www.coursera.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/378240/Show%20zh-CN%20Subtitles%20for%20Coursera.user.js
// @updateURL https://update.greasyfork.org/scripts/378240/Show%20zh-CN%20Subtitles%20for%20Coursera.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        var video = document.getElementById("c-video_html5_api");
        if(video){
            var n = video.textTracks;
            var bsubtitleoff = true;
            for (var o = 0; o < n.length; o++) {
                var i = n[o];
                if (i.kind !== "subtitles") continue;
                if (i.language == "zh-CN") i.mode = "showing";
            }
        }
    },500);
})();
