// ==UserScript==
// @name         扇贝Helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  扇贝单词快捷键拓展
// @author       You
// @match        https://www.tampermonkey.net/scripts.php
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @include      *//web.shanbay.com/wordsweb/*
// @downloadURL https://update.greasyfork.org/scripts/429674/%E6%89%87%E8%B4%9DHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/429674/%E6%89%87%E8%B4%9DHelper.meta.js
// ==/UserScript==
// document.write("<script src='http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js'>");
(function() {
    'use strict';
    // Your code here...
    function listenKeybord($input) {
        var originHeight = document.documentElement.clientHeight || document.body.clientHeight;

        window.addEventListener('resize', function () {
            var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
            if (originHeight < resizeHeight) {
                console.log('Android 键盘收起啦！');
                document.getElementsByClassName('index_input__1SBLh index_success__3Piiq')
                // Android 键盘收起后操作
            } else {
                console.log('Android 键盘弹起啦！');
                // Android 键盘弹起后操作
            }
            originHeight = resizeHeight;
        }, false)
    }
    listenKeybord(document.getElementsByClassName('index_input__1SBLh index_success__3Piiq'));
    var keyCode;
    document.onkeypress = function (e) {
        if (!keyCode) {
            if (window.event) {
                keyCode = event.keyCode;
            } else if (e.which) {
                keyCode = e.which;
            }
            if (keyCode === 79 || keyCode === 111) {
                if(document.getElementsByClassName("index_main__1_DrK")[0] == undefined){
                    document.getElementsByClassName("index_icon__1IK2K")[0].click()
                }
            }
            console.log(keyCode)
        }
    };
    document.onkeyup = function () {
        if (keyCode) {
             keyCode = undefined;
         }
    };
})();

