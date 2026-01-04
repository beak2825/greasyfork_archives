// ==UserScript==
// @name         I博思刷课脚本-河工大人大院刷课用
// @namespace    https://greasyfork.org/zh-CN/scripts/456603-i%E5%8D%9A%E6%80%9D%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC-%E6%B2%B3%E5%B7%A5%E5%A4%A7%E4%BA%BA%E5%A4%A7%E9%99%A2%E5%88%B7%E8%AF%BE%E7%94%A8
// @homepageURL  https://greasyfork.org/zh-CN/scripts/456603-i%E5%8D%9A%E6%80%9D%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC-%E6%B2%B3%E5%B7%A5%E5%A4%A7%E4%BA%BA%E5%A4%A7%E9%99%A2%E5%88%B7%E8%AF%BE%E7%94%A8
// @version      1.0
// @description  hautI博思刷课，仅仅提供章节和视频哦~~暂不提供答题功能~~
// @author       jxc
// @match        http://haut.iflysse.com/web/student/bosi-course/*
// @icon         https://lx08181637.top/images/jinzitapokenm.jpg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456603/I%E5%8D%9A%E6%80%9D%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC-%E6%B2%B3%E5%B7%A5%E5%A4%A7%E4%BA%BA%E5%A4%A7%E9%99%A2%E5%88%B7%E8%AF%BE%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/456603/I%E5%8D%9A%E6%80%9D%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC-%E6%B2%B3%E5%B7%A5%E5%A4%A7%E4%BA%BA%E5%A4%A7%E9%99%A2%E5%88%B7%E8%AF%BE%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    var buttons = document.getElementsByTagName("button");
    setInterval(()=>{
        var video = document.querySelector("video");
        if(video){
            if(video.paused){
                console.log("视频播放")
                video.play()
            } else {

            }

        }
        for(var i = 0;i<buttons.length;i++){
            var item = buttons[i];
            const text = item.querySelector('span')
            if(text){
                const textValue = text.innerText;
                if(textValue === "下一页"){
                    console.log("下一页")
                    item.click()
                }
            }
        }
    },1000)
})();
