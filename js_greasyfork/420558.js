// ==UserScript==
// @name         链工宝自动切换视频
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  又不是不能用
// @author       BrontByte
// @match        http://start.lgb360.com/video.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420558/%E9%93%BE%E5%B7%A5%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/420558/%E9%93%BE%E5%B7%A5%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const MAX_TIMES = 10;
    let times = 0;
    let timer=setInterval(() => {
        console.log($("body > div.video > div.video-box > div.box-in > div.list > div > div.item.active #sPlayRate").text())
        if($("body > div.video > div.video-box > div.box-in > div.list > div > div.item.active #sPlayRate").text() === "100"){
            if(times < MAX_TIMES){
                let $next = $("body > div.video > div.video-box > div.box-in > div.list > div > div.item.active")
                do{
                    $next = $next.next();
                }while($next.children(".body").children("ul").children("li:last-child").children("#sPlayRate").text() === "100")
                times ++;
                $next.children("div").trigger("click")
                console.log("看完"+times+"个视频,下一个");
            }else{
                console.log("看完"+times+"个视频,到达每日限额,停止");
                clearInterval(timer)
            }
        }
    },5000)
    })();