// ==UserScript==
// @name         阿里云培训中心自动点击
// @namespace    http://tampermonkey.net/
// @version      2024-11-13
// @description  Try to click the button with class 'btn' on aliyun edu pages.
// @author       mattpower
// @match        https://edu.aliyun.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508888/%E9%98%BF%E9%87%8C%E4%BA%91%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/508888/%E9%98%BF%E9%87%8C%E4%BA%91%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

// 当页面加载完成后执行
    setTimeout(function(){
        var button = document.querySelector('a.text');
        if (button) {// 点击找到的按钮
            var newwindow1 = window.open(button.href, "_blank");
            setTimeout(function(){
                var button = newwindow1.document.querySelector('.ant-btn.ant-btn-primary.orange');
                if (button) {// 点击找到的按钮
                    let path = button.href
                    let pathWithoutQuery = path.split('?')[0];
                    console.log('pathWithoutQuery:',pathWithoutQuery)
                    var newwindow2 = window.open(pathWithoutQuery, "_blank");
                    newwindow1.close();
                    setTimeout(function(){ //连点两次静音
                        var volumn = newwindow2.document.querySelector('.volume-icon');
                        volumn.click();
                        volumn.click();
                    },3*1000);
                    setTimeout(function(){
                        window.open('https://developer.aliyun.com/', "_blank");
                        window.open('https://developer.aliyun.com/score', "_blank");
                        newwindow2.close();
                    },60*1000);
                }
            }, 5*1000);
        }
    }, 5*1000);
})();