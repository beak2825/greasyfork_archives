// ==UserScript==
// @name        乐创V1
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       You
// @description   看乐创视频
// @license MIT
// @match        https://study.leonline.cn/courses/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leonline.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452966/%E4%B9%90%E5%88%9BV1.user.js
// @updateURL https://update.greasyfork.org/scripts/452966/%E4%B9%90%E5%88%9BV1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('video').defaultPlaybackRate = 1.0;//默认一倍速播放
    document.querySelector('video').play();
    document.querySelector('video').playbackRate = 1.5;//修改此值设置当前的播放倍数

    /*var btn = document.createElement('button')
    btn.innerHTML='二倍速'
    btn.id='mytwo'
    function mF(){
        document.querySelector('video').playbackRate = 2.0;
    }
    btn.addEventListener('click',mF)
    document.getElementsByClassName("coursebox").appendChild(btn)
    document.getElementById("mytwo").click()*/

    setInterval(() => {
        let space = document.evaluate("//*[@id='testVideo']/div/div[2]/div[1]/div[1]/i[1]", document).iterateNext()
        if (space.title === '播放 space'){
            document.querySelector('video').playbackRate = 2.0;
            space.click()
        }
        if (getComputedStyle(document.evaluate("html/body/div/div[2]", document).iterateNext(), null).display === 'block') {
            document.getElementById("snap").click()
            document.getElementById("confirmbtn").click()
        }
        let next=document.evaluate("html/body/div[1]/div[3]/div/div[1]/div/button",document).iterateNext()
        next.click()
    }, 4000);


    html/body/div[1]/div[3]/div/div[1]/div/button
    // Your code here...
})();