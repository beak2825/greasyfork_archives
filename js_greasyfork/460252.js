// ==UserScript==
// @name         税务答题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  自动化税务答题，不考虑正确性。
// @author       bingtuan
// @match        https://swxyy.guizhou.chinatax.gov.cn/study/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chinatax.gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460252/%E7%A8%8E%E5%8A%A1%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/460252/%E7%A8%8E%E5%8A%A1%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {

    //等待网页载入
    window.onload=function dati(){
       setInterval(()=>{
        document.getElementsByClassName('swiper-slide swiper-slide-visible')[0].getElementsByClassName('answer-item')[0].click();
        document.getElementsByClassName('swiper-slide swiper-slide-visible')[0].getElementsByClassName('answer-item')[1].click();
        document.getElementsByClassName('swiper-slide swiper-slide-visible')[0].getElementsByClassName('van-button van-button--primary van-button--small submit')[0].click();
        document.querySelector('.iconfont.icon-youjiantou').click();
        },5000);

    }
    setInterval(()=>{
       var row = document.getElementsByClassName('row-item');
        if(row.length == 7){
              row[0].click();
       }
    },5000);

    setInterval(()=>{
        var start = document.querySelector('.start-page>div');
         if(start){
              start.click();
        }
     },5000);

    setInterval(()=>{
        document.querySelector('.van-hairline--top.van-dialog__footer>button').click();
        var index = document.querySelector('.iconfont.icon-caidan1').nextElementSibling.innerHTML;
        if(index =='20/20'){
            document.querySelector('.iconfont.icon-fanhui.left').click();
        }
    },5000);

    })();