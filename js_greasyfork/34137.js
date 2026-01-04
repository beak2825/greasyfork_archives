// ==UserScript==
// @name         Show English and Chinese Subtitles for Coursera
// @name:zh      于 Coursera 显示中英双字幕
// @name:zh-CN   于 Coursera 显示中英双字幕
// @name:zh-TW   于 Coursera 顯示中英雙字
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description         Show English and Chinese subtitles when you're watching coursera, and you may modify the script mannually as you like
// @description:zh      在 Coursera 显示中英双字幕或手动更改脚本来更换其它语言
// @description:zh-CN   在 Coursera 显示中英双字幕或手动更改脚本来更换其他语言
// @description:zh-TW   于 Coursera 顯示中英雙字或手動更改脚本來更換其他語言
// @author       LouizQ
// @include      http://www.coursera.org/*
// @include      https://www.coursera.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/34137/Show%20English%20and%20Chinese%20Subtitles%20for%20Coursera.user.js
// @updateURL https://update.greasyfork.org/scripts/34137/Show%20English%20and%20Chinese%20Subtitles%20for%20Coursera.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //==========================================================================================================
    //If you're using high dpi screen, we strongly advise you to add the script:
    //若为高分辨率屏幕，我们强烈建议您使用：
    //若為高分辨率屏幕，我們强烈建議您使用：

    //https://greasyfork.org/scripts/32934-smaller-coursera-subtitle/code/Smaller%20Coursera%20Subtitle.user.js

    //or uncomment following stript part to reduce size of coursera subtitle
    //或手动取消下面这段脚本的注释，以缩小字幕字号
    //或手動取消下面這段脚本的注釋，以縮小字幕字號

    /*
    var css = 'video::-webkit-media-text-track-display {font-size: 45%;}',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
    */
    //==========================================================================================================

    setInterval(function(){
        var video = document.getElementById("c-video_html5_api");
        if(video){
            var n = video.textTracks;
            var bsubtitleoff = true;
            for (var o = 0; o < n.length; o++) {
                var i = n[o];
                if (i.kind !== "subtitles") continue;
                if (i.mode == "showing") bsubtitleoff = false;
            }
            if (!bsubtitleoff) {
                for (var o = 0; o < n.length; o++) {
                    var i = n[o];
                    //console.log(i.language);
                    /*
                    you may delete the double slash above (uncomment it), click save, and refresh coursera webpage to see the language list in console(F12).
                    你可以删除前一句双斜杠的注释符号，保存并刷新，在控制台（console，F12）中查看有哪些语言。
                    你可以刪除前一句雙斜杠的注釋符號，保存並刷新，在控制臺（console，F12）中查看有哪些語言。
                    */
                    if (i.kind !== "subtitles") continue;
                    if (i.language == "zh-CN" || i.language == "zh-TW" || i.language == "en-US" || i.language == "en") {
                        /*
                        if you want to change the fixed language, just modify the word in quotation mark as you like
                        如果你希望更换语言，可以手动修改引号中的内容
                        如果你希望更換語言，可以手動修改引號中的内容
                        */
                        i.mode = "showing";
                    } else {
                        i.mode = "hidden";
                    }
                }
            } else {
                //warning: you didn't allow to show any subtitles
                //字幕未开启//字幕未開啓
            }
        }
    },500);
})();