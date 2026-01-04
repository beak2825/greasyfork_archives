// ==UserScript==
// @name         MeTruyenCV Full Reading Page
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Đọc trên desktop ở trang MeTruyenCV.Com full màn hình không bị cố định 1000px gây khó chịu
// @author       mkbyme
// @match        https://metruyencv.com/truyen/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=metruyencv.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463341/MeTruyenCV%20Full%20Reading%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/463341/MeTruyenCV%20Full%20Reading%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const fn=function(){
        const divs = document.querySelectorAll('.nh-read__container,body');
        if(divs && divs.length){
            for(var i=0;i<divs.length;i++){
                var div = divs[i];
                div.style.width='100%';
                div.style.maxWidth='100%';
            }
        }
        const menu = document.querySelector('#js-left-menu');
        if(menu){
            menu.style.left='auto';
            menu.style.right='0px';
            menu.style.inset='16px 0px auto auto';
        }
        const menuRight = document.querySelector('#js-right-menu');
        if(menuRight){
            menuRight.style.left='auto';
            menuRight.style.right='0px';
            // menuRight.style.inset='16px 0px auto auto';
        }
    }
    fn();
    setInterval(fn,1000);
})();