// ==UserScript==
// @name         学习通自动刷视频
// @description  学习通自动刷视频,包括自动开始,自动下一章,自动跳过答题
// @namespace    Dongshi
// @author       Dongshi
// @version      1.1
// @license      MIT
// @match        *://*.chaoxing.com/mycourse/studentstudy*
// @downloadURL https://update.greasyfork.org/scripts/445329/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/445329/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

var t=3000
setInterval(function () {
    if (window.getComputedStyle(document.getElementById("iframe").contentWindow.document.getElementsByClassName("ans-job-icon ")[0]).backgroundPositionY === '-24px'){
        for (var i = 0; i < 3; i++)
            if (document.getElementsByClassName("tabtags")[0].children["right" + i]) {
                document.getElementsByClassName("tabtags")[0].children["right" + i].click()
                return;
            }
    }else if(document.getElementById('iframe').contentWindow.document.getElementsByTagName('iframe')[1].contentWindow.document.getElementsByClassName('vjs-control-text')[2].innerHTML==='播放')
        document.getElementById('iframe').contentWindow.document.getElementsByTagName('iframe')[1].contentWindow.document.getElementsByClassName('vjs-control-text')[2].click()
    else if(document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByClassName("vjs-control-bar")[0].getElementsByClassName("vjs-control-text")[0].innerHTML!=='暂停')
        document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByClassName("vjs-control-bar")[0].getElementsByTagName("button")[0].click()
}, t)
setInterval(function (){
    if(!document.getElementById("iframe").contentWindow.document.getElementsByClassName("ans-job-icon ")[0])
        for (var i = 0; i < 3; i++)
            if (document.getElementsByClassName("tabtags")[0].children["right" + i]) {
                document.getElementsByClassName("tabtags")[0].children["right" + i].click()
                return;
            }
},t)
setInterval(function (){
    if(document.getElementById("iframe").contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByClassName("Btn_blue_1 marleft10")[0])
        for (var i = 0; i < 3; i++)
            if (document.getElementsByClassName("tabtags")[0].children["right" + i]) {
                document.getElementsByClassName("tabtags")[0].children["right" + i].click()
                return;
            }
},t)
setInterval(function (){
    if (window.getComputedStyle(document.getElementById("iframe").contentWindow.document.getElementsByClassName("ans-insertvideo-online")[0].contentWindow.document.getElementsByClassName("vjs-big-play-button")[0]).display === 'block')
        document.getElementById("iframe").contentWindow.document.getElementsByClassName("ans-insertvideo-online")[0].contentWindow.document.getElementsByClassName("vjs-big-play-button")[0].click()
},t)