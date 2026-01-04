// ==UserScript==
// @name         Show Single En or double En+Cn Subtitles for Coursera
// @name:zh      于 Coursera 显示英文单字幕或中英双字幕
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description         Show Single Eng or double En+Cn subtitles when you're watching coursera, and you may modify the script manually as you like
// @description:zh      在 Coursera 显示英文单字幕或中英双字幕，或手动更改脚本来更换其它语言
// @author       Liu Daqing
// @include      http://www.coursera.org/*
// @include      https://www.coursera.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/369957/Show%20Single%20En%20or%20double%20En%2BCn%20Subtitles%20for%20Coursera.user.js
// @updateURL https://update.greasyfork.org/scripts/369957/Show%20Single%20En%20or%20double%20En%2BCn%20Subtitles%20for%20Coursera.meta.js
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
                if (i.mode == "showing" && i.language == "zh-CN") bsubtitleoff = false;
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
                    if (i.language == "zh-CN" || i.language == "en-US" || i.language == "en") {
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