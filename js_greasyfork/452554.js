// ==UserScript==
// @name         auto read
// @namespace    https://www.quword.com/w/*
// @version      0.1
// @description  趣词词典自动拼读
// @author       You
// @match        https://www.quword.com/w/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quword.com
// @grant        none
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/452554/auto%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/452554/auto%20read.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //获取按钮
    var butt=document.getElementsByClassName("glyphicon glyphicon-volume-up")[1];
    //进入的第一次发声
    //添加循环按钮
    butt.click();
    var a=document.getElementById("yd-word-pron");
    var button = document.createElement("button");
    var input = document.createElement("input");
    //设置默认循环间隔
    input.value = "3";
    input.style.width = "40px";
    button.innerHTML = "自动播放";
    button.id = "auto";
    var time;

    var aa=document.createElement("a")
    aa.innerHTML="    "
    a.appendChild(aa);

    //设置监听
    button.onclick=function(e) {
        console.log(e.target.innerHTML);
        if (e.target.innerHTML=="停止播放"){
            clearInterval(time);
            e.target.innerHTML="自动播放";
        }else if (e.target.innerHTML=="自动播放"){
            var tim=input.value
            butt.click();
            time= setInterval(function () {
                butt.click();
            }, tim*1000);
            e.target.innerHTML="停止播放";
        }
    }

    a.appendChild(button);
    a.appendChild(aa);
    a.appendChild(input);
    document.onkeydown = keyDown;
    button=document.getElementById("auto");
    function keyDown(event){
        var event = event || window.event;
        //显示按键keyCode
        console.log(event.keyCode)
        switch(event.keyCode){
            case 9: //可修改自动播放的停止和开始按钮,默认为tab键
                button.click();
                return false;
            default:
                return true;

        }
    }
})();