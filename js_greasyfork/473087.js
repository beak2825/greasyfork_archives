// ==UserScript==
// @name         禁漫天堂漫画内去广告
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  禁漫天堂内去广告 自动播放设置在代码内修改 翻到页底自动翻页
// @author       luohuang
// @match        https://18comic.vip/photo/*
// @include      https://jm-comic*.club/photo/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jm-comic1.vip
// @grant        window.close
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473087/%E7%A6%81%E6%BC%AB%E5%A4%A9%E5%A0%82%E6%BC%AB%E7%94%BB%E5%86%85%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/473087/%E7%A6%81%E6%BC%AB%E5%A4%A9%E5%A0%82%E6%BC%AB%E7%94%BB%E5%86%85%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const movespeed=0
    //调节速度
    const next = document.querySelector('#next_series a')
    let midguanggao
    const btmguanggao=document.querySelector('.bot-per.visible-xs.visible-sm')
    btmguanggao.innerHTML=''
    const topguanggao = document.querySelectorAll('.col-xs-6')
    for(let index =0 ; index<topguanggao.length ; index++){
        topguanggao[index].style.display='none'}
    let automove = setInterval(function () {
      document.documentElement.scrollTop += movespeed
    }, 10)
    window.addEventListener('touchstart', function () {
      clearInterval(automove)
    })
    window.addEventListener('touchend', function () {
      //if(next.href){
            //if(document.documentElement.scrollTop + document.documentElement.clientHeight*1.1 >= document.documentElement.scrollHeight){
                //GM_openInTab(next.href);
                //window.close()}}
                //浏览器无法使用window.location.href时使用此方法
      automove = setInterval(function () {
        document.documentElement.scrollTop += movespeed
      }, 10)
    })
    window.addEventListener('scroll',function(){
        midguanggao=document.querySelector('.e8c78e-4_b')
        if(midguanggao) midguanggao.remove()
        if(document.documentElement.scrollTop + document.documentElement.clientHeight*1.1 >= document.documentElement.scrollHeight){
		window.location.href=next.href}})
})();