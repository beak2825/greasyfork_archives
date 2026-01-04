// ==UserScript==
// @name         陕西省-VIP版本
// @namespace    https://www.tuziang.com/combat/1801.html
// @version      0.1
// @description  这是一个 关于 陕西省专业技术人员继续教育学习平台 自动刷课的小脚本
// @author       Tuziang
// @match        *://*.jxjy01.xidian.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411835/%E9%99%95%E8%A5%BF%E7%9C%81-VIP%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/411835/%E9%99%95%E8%A5%BF%E7%9C%81-VIP%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
        var chapter = document.getElementsByClassName("s_chapter")
        for (var x =0; x < chapter.length; x++)
        {
            chapter[x].click()
        }

        var section = document.getElementsByClassName("s_section")
        for (x =0; x < section.length; x++)
        {
            section[x].click()
        }

    setInterval(function () {
        for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
            var current_video = document.getElementsByTagName('video')[i]
            current_video.volume = 0
            current_video.playbackRate = 8
        }
        var frame = document.getElementsByClassName('s_wrap main_box')[0].getElementsByTagName("iframe")[0].contentWindow.document;
        if (frame.getElementsByClassName("s_point s_pointerct")[0].getAttribute("completestate") == 1) {
            frame.getElementsByClassName("s_point undo_item_bgc")[1].click()
        } else {
            frame.getElementsByClassName("s_point undo_item_bgc")[0].click()
        }
    }, 2000)

})();