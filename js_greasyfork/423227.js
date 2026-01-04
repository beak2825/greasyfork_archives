// ==UserScript==
// @name         西南交大刷党课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动刷西南交大(swjtu)的党课
// @author       kakasearch(qq:1093230325)
// @match        https://fzdxpx.swjtu.edu.cn/fzdx/play*
// @icon         https://www.google.com/s2/favicons?domain=swjtu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423227/%E8%A5%BF%E5%8D%97%E4%BA%A4%E5%A4%A7%E5%88%B7%E5%85%9A%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/423227/%E8%A5%BF%E5%8D%97%E4%BA%A4%E5%A4%A7%E5%88%B7%E5%85%9A%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let init= setInterval(function(){
        if(document.querySelector("body > div.public_cont.public_cont1 > div.public_btn > a") && /完整观看一遍/.test(document.querySelector("body > div.public_cont.public_cont1 > div.public_text > p:nth-child(2)").innerText)){
            document.querySelector("body > div.public_cont.public_cont1 > div.public_btn > a").click()
            setTimeout(function(){document.querySelector("#video").currentTime=document.querySelector("#video").duration;},1000)
        }
    },1000)

    let next= setInterval(function(){
        if(document.querySelector("body > div.public_cont.public_cont1 > div.public_btn > a") && document.querySelector("#video").currentTime == document.querySelector("#video").duration ){
            document.querySelector("body > div.public_cont.public_cont1 > div.public_btn > a").click()
            clearInterval(next)
            document.querySelector(" ul > li.video_red1").nextElementSibling.firstElementChild.click()
        }
    },200)


    // Your code here...
    })();