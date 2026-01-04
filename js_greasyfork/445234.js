// ==UserScript==
// @name         b站专栏图片大图显示
// @namespace    https://www.bilibili.com/read/cv16689539
// @version      1.3
// @description  B站专栏图片大图显示
// @author       HuiJiOnGit
// @match        *://*.bilibili.com/read/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445234/b%E7%AB%99%E4%B8%93%E6%A0%8F%E5%9B%BE%E7%89%87%E5%A4%A7%E5%9B%BE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/445234/b%E7%AB%99%E4%B8%93%E6%A0%8F%E5%9B%BE%E7%89%87%E5%A4%A7%E5%9B%BE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName('article-detail')[0].style.width = '80vw';
    document.querySelector('#app > div > div.right-side-bar').style.marginLeft = '-82px';
    setTimeout(() => {
        //console.log(document.getElementsByClassName('normal-img'));
        const imgFnArr = [...document.getElementsByClassName('normal-img')].map(item => {
                return new Promise((resolve,reject) => {
                    item.onload = function(){
                        console.debug(this);
                        this.style.width = '';
                        this.style.height = '';
                        resolve();
                    }
                });
            });
        Promise.all(imgFnArr).catch(err => console.error(err));
    },2500);
    document.getElementsByClassName('normal-img').forEach(item => {item.style.width = '';item.style.height = '';});
})();