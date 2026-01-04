// ==UserScript==
// @name         自动英文字幕
// @namespace    http://elmagnifico.tech/
// @version      1.5
// @description  show english subtitles automatically.
// @author       elmagnifico
// @match        https://www.youtube.com/watch*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380989/%E8%87%AA%E5%8A%A8%E8%8B%B1%E6%96%87%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/380989/%E8%87%AA%E5%8A%A8%E8%8B%B1%E6%96%87%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkChinese(){
        var sub = $('[role="menuitem"]:contains("字幕")');
        if(!sub.length) return false;
        // show subtitles
        sub.click();
        console.log("打开设置");

        var subc = $('[role="menuitemradio"]:contains("中文")');
        if (subc.length) {
            console.log("原片是中文,退出");
            console.log("关闭字幕");
            var close_btn = $('[role="menuitemradio"]:contains("关闭")');
            if (!close_btn.length) return true;
            close_btn.click();
            return true;
        }else{
            console.log("没有中文");
        }
        return false;
    }

    function translateToEnglish(){
        var sub = $('[role="menuitem"]:contains("字幕")');
        if(!sub.length) return false;
        // show subtitles
        sub.click();
        console.log("打开设置");
        var success = false;

        var subc = $('[role="menuitemradio"]:contains("英语")');
        if (subc.length) {
            console.log("切换到英语(美国)字幕");
            subc.click();
            success = true;
        } else {
            console.log("关闭字幕1");
            var close_btn = $('[role="menuitemradio"]:contains("关闭")');
            if (!close_btn.length) return false;
            close_btn.click();
        }

        if(success == false)
        {
            subc = $('[role="menuitemradio"]:contains("英语 (自动生成)")');
            if (subc.length) {
                console.log("切换到英语(自动生成)字幕");
                subc.click();
                success = true;
            } else {
                console.log("关闭字幕2");
                close_btn = $('[role="menuitemradio"]:contains("关闭")');
                if (!close_btn.length) return false;
                close_btn.click();
            }
        }

        if(success == false)
        {
            subc = $('[role="menuitemradio"]:contains("英语")');
            if (subc.length) {
                console.log("切换到英语字幕");
                subc.click();
            } else {
                console.log("关闭字幕3");
                close_btn = $('[role="menuitemradio"]:contains("关闭")');
                if (!close_btn.length) return false;
                close_btn.click();
            }
        }
    }

    function onLoadStart(){
        $('.ytp-subtitles-button[aria-pressed="false"]').click();
        $('.ytp-settings-button').click();
        if(checkChinese() == false)
        {
            $('.ytp-settings-button').click();
            translateToEnglish();
            $('.ytp-settings-button').click();
        }
        console.log("关闭设置");
        $('.ytp-settings-button').click();
    }
    $('video').on('loadstart', onLoadStart).trigger('loadstart');
})();