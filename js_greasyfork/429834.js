// ==UserScript==
// @name         coco
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  coco网站自定义快捷键
// @author       Khz
// @match        https://www.cocomanhua.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429834/coco.user.js
// @updateURL https://update.greasyfork.org/scripts/429834/coco.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // debugger;
    console.warn('==================================');
    /*
    var key = document.body;
    key.onkeydown =f;  //注册keydown事件处理函数
    key.onkeyup = f;  //注册keyup事件处理函数
    key.onkeypress = f;  //注册keypress事件处理函数
    function f (e) {
        var e = e || window.event;  //标准化事件处理
        var s = e.type + " " + e.keyCode;  //获取键盘事件类型和按下的值
        key.value = s;
    }*/
    document.body.onkeyup = function (e) {
        e = e || window.event; //标准化事件处理
        var s = e.type + " " + e.keyCode; //获取键盘事件类型和按下的值
        console.log(e);
        switch(e.keyCode){ // 获取当前按下键盘键的编码
            case 37 : // 按下左箭头键，向左移动5个像素
                // location.href = location.href;
                $('.mh_prevbook')[0].click()
                break;
            case 39 : // 按下右箭头键，向右移动5个像素
                $('.mh_prevbook')[1].click()
                break;
            case 38 : // 按下上箭头键，向上移动5个像素
                 //box.style.top = box.offsetTop  - 5 + "px";
                break;
            case 40 : // 按下下箭头键，向下移动5个像素
                 //box.style.top = box.offsetTop  + 5 + "px";
                break;
        }
        return false
    }

    // Your code here...
})();