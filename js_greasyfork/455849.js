// ==UserScript==
// @name         MuteGreyTheme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除灰色模式
// @author       You
// @match        *://weibo.com/*
// @match        *://www.mgtv.com/
// @match        *://www.bilibili.com/
// @match        *://*.baidu.com/
// @match        *://v.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mgtv.com
// @grant        unsafeWindow
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455849/MuteGreyTheme.user.js
// @updateURL https://update.greasyfork.org/scripts/455849/MuteGreyTheme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_log('开始啦')
    window.onload=function(){
        //腾讯视频
        if (document.querySelectorAll(".gray-style-remembrance").length > 0) {
            GM_log('更新style')
            document.querySelectorAll(".gray-style-remembrance").forEach( a => {
                    a.classList.remove('gray-style-remembrance')
                })
            setTimeout(e => {
                GM_log('延迟更新style')
                document.querySelectorAll(".gray-style-remembrance").forEach( a => {
                    a.classList.remove('gray-style-remembrance')
                })
            }, 1000 )
        } else
        //b站
        if(document.querySelector('html').getAttribute('class') === 'gray'){
            GM_log('B站逻辑')
            document.querySelector('html').removeAttribute('class', 'gray');
        } else
        //芒果
        if(document.querySelector('body').getAttribute('class') === 'page-gray'){
            GM_log('芒果逻辑')
            document.querySelector('body').removeAttribute('class', 'page-gray');
        } else
        //百度
        if(document.querySelector('body').getAttribute('class') === 'big-event-gray'){
            GM_log('百度逻辑')
            document.querySelector('body').removeAttribute('class', 'big-event-gray');
        } else
        //微博 一定是放最后
        if (document.querySelectorAll("style").length > 0) {
            GM_log('微博逻辑')
            document.querySelectorAll("style").forEach( a => {
                if(a.innerHTML.includes('grayTheme')){
                    GM_log('更新style')
                    a.innerHTML=''
                }
            })
        }
    }
})();