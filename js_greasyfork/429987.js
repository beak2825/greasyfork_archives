// ==UserScript==
// @name         中国海洋大学信息门户修改背景
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  随机修改背景
// @author       zym
// @include     *://my.ouc.edu.cn/web/guest
// @include     *://id.ouc.edu.cn:8071/*
// @run-at document-idle
// @icon         https://www.google.com/s2/favicons?domain=ouc.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429987/%E4%B8%AD%E5%9B%BD%E6%B5%B7%E6%B4%8B%E5%A4%A7%E5%AD%A6%E4%BF%A1%E6%81%AF%E9%97%A8%E6%88%B7%E4%BF%AE%E6%94%B9%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/429987/%E4%B8%AD%E5%9B%BD%E6%B5%B7%E6%B4%8B%E5%A4%A7%E5%AD%A6%E4%BF%A1%E6%81%AF%E9%97%A8%E6%88%B7%E4%BF%AE%E6%94%B9%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==
(function() {
    'use strict'

    var url=window.location.href.split('/')[2]
    let times=60
    console.log(url)
    if(url.search("id.ouc.edu.cn")!=-1){
     login()
    }
    if(url.search("my.ouc.edu.cn")!=-1){
         let num=Math.floor(Math.random()*10+1);
         let img=document.getElementById('allbg')
        let loop = setInterval(function () {
            --times
            if (times <= 0) {
                clearInterval(loop)
            }
             img.src=`/html/themes/classic/images/b${num}.jpg`
        }, 50)
        }
})()