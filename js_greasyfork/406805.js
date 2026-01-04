// ==UserScript==
// @name         bilibili自动关闭弹幕
// @namespace    somethingsomething
// @version      0.2
// @description  switch off bilibili bullet screen automatically
// @description:cn  bilibili自动关闭弹幕
// @author       megablue
// @match        *://*.bilibili.com/video/*
// @downloadURL https://update.greasyfork.org/scripts/406805/bilibili%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/406805/bilibili%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function disable_danmu() {
        var target = document.querySelector("input[class='bui-switch-input']")

        if(target && target.checked){
           target.click();
        }
        else if(!target){
            setTimeout(disable_danmu, 500);
        }
    }

    disable_danmu()
})();