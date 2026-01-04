// ==UserScript==
// @name         硬币站自动签到
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  硬币站签到
// @author       zaqw6414
// @match        https://www.chrono.gg*
// @match        https://www.chrono.gg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371223/%E7%A1%AC%E5%B8%81%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/371223/%E7%A1%AC%E5%B8%81%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function() {
var a1= /reward-coin([\w\W]*)/;
var jsq = setInterval(function dianji(){panduandianji()},3000);//定时
var ss = document.getElementById('reward-coin');
var bk1 = 0;
function panduandianji(){
var b1 = a1.exec(document.documentElement.outerHTML)[0].slice(20,25)
if (b1 == 'coin"'){
ss.click()
clearInterval(jsq);//清除定时器
}
else{
bk1++
    if (bk1 >= 10){
        console.log('大于30秒，关闭计时器')
        clearInterval(jsq)}
}
}}
)();