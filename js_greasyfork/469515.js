// ==UserScript==
// @name         师学通网课（cr202341048.stu.teacher.com.cn）
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  1.验证码自动填写、提交;       2.视频播放结束后重新播放;       3.提交验证码与重新播放功能可能需要等待几秒（不超过20s）。
// @author       wyj1991
// @match        *://*.stu.teacher.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469515/%E5%B8%88%E5%AD%A6%E9%80%9A%E7%BD%91%E8%AF%BE%EF%BC%88cr202341048stuteachercomcn%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/469515/%E5%B8%88%E5%AD%A6%E9%80%9A%E7%BD%91%E8%AF%BE%EF%BC%88cr202341048stuteachercomcn%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){

        if(document.getElementById("codespan")){
            document.getElementById("code").value = document.getElementById("codespan").innerText;
            document.getElementById("codespan").parentNode.parentNode.parentNode.parentNode.children[3].children[0].click();
            console.log("pass captcha!!!");
        }else{
            var elements = document.querySelectorAll('a');
            elements.forEach(function(el) {
            if(el.innerText == 'Ok，我知道了！'){
                el.click();
                document.getElementsByClassName("ccH5TogglePlay")[0].click();
                console.log("rePlay success!!!");
            }
            });
        }

    },20000)

})();