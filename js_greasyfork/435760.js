// ==UserScript==
// @name         SDU党旗飘飘
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  爱党爱国爱人民
// @author       Like_Frost
// @match        http*://202.194.7.208/*
// @icon         https://gimg2.baidu.com/image_search/src=http%3A%2F%2Frigidalchina.com%2Frepository%2Fimage%2FxYxnvZiAT4qXMja9DY7uqQ.jpg&refer=http%3A%2F%2Frigidalchina.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638414373&t=6b7a6c084bc77531404db76900e1007c
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435760/SDU%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98.user.js
// @updateURL https://update.greasyfork.org/scripts/435760/SDU%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const init= setInterval(function(){
        if(document.querySelector("body > div.public_cont.public_cont1 > div.public_btn > a")&& /完整观看一遍/.test(document.querySelector("body > div.public_cont.public_cont1 > div.public_text > p:nth-child(2)").innerText)){
            document.querySelector("body > div.public_cont.public_cont1 > div.public_btn > a").click()
        }
        if(document.querySelector("body > div.public_cont.public_cont1 > div.public_btn > a")&& /暂停/.test(document.querySelector("body > div.public_cont.public_cont1 > div.public_text > p:nth-child(2)").innerText)){
            document.querySelector("body > div.public_cont.public_cont1 > div.public_btn > a").click()
        }
    },1000)

    const next= setInterval(function(){
        if(document.querySelector("body > div.public_cont.public_cont1 > div.public_btn > a")&& document.querySelector("body > div.wrap_video > div.video_play1 > div > div.plyr__controls > span:nth-child(3) > span.plyr__time--current").innerText == document.querySelector("body > div.wrap_video > div.video_play1 > div > div.plyr__controls > span:nth-child(4) > span.plyr__time--duration").innerText){
            document.querySelector("body > div.public_cont.public_cont1 > div.public_btn > a").click()
            clearInterval(next)
            document.querySelector(" body > div.wrap_video > div.video_fixed.video_cut > div:nth-child(5) > ul > li.video_red1").nextElementSibling.firstElementChild.click()
        }
    },200)
    // Your code here...
    })();