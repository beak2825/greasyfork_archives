// ==UserScript==
// @name        学习公社-继续学习 - enaea.edu.cn
// @namespace   Violentmonkey Scripts
// @match       https://study.enaea.edu.cn/viewerforccvideo.do
// @grant       none
// @version     1.0
// @author      -
// @description 2022/8/5 下午5:39:55
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448987/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE-%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%20-%20enaeaeducn.user.js
// @updateURL https://update.greasyfork.org/scripts/448987/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE-%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%20-%20enaeaeducn.meta.js
// ==/UserScript==
console.log('check continue study...')
setInterval(function () { 
        // 跳过20分钟休息的提示，继续学习
          skip();
    }, 3000);

function skip(){
    var buttons = document.getElementsByTagName("button")
    if(buttons && buttons.length>0){ 
        for (var i=0;i<buttons.length;i++){ 
          if(buttons[i].innerText=='继续学习'){
               buttons[i].click();
            }
       }
    } 
  
}