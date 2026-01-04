// ==UserScript==
// @name         ykm_tengxun
// @namespace    腾讯视频
// @version      0.8
// @description  支持腾讯视频网页版观看会员视频等
// @author       ykm
// @match        https://v.qq.com/x/cover/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youku.com
// @grant        GM_download
// @grant        GM_addStyle
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/456908/ykm_tengxun.user.js
// @updateURL https://update.greasyfork.org/scripts/456908/ykm_tengxun.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css = `
           #download_video1{
        position:fixed;
        top:10px;
        right:10px;
        z-index:99999;
        background:#ec5050;
        padding:5px 10px;
        border-radius:5px;
    }
     #download_video2{
        position:fixed;
        top:10px;
        right:10px;
        z-index:99999;
        background:#f6a20a;
        padding:5px 10px;
        border-radius:5px;
    }
    .Card css-oyqdpg{
        display:none;
    }
    `
    GM_addStyle(css)
    var jk ='https://jx.we-vip.com/?url='
    var name_title = document.querySelector("title")
    var title_jic1 = name_title.innerText;
    var patt=new RegExp('电影','i') ;
    var result=patt.test(title_jic1);
    if(result == true){
        var name_ji = document.querySelector(".play-title__content")
        var name_jic1 = name_ji.innerText;
        var name_n1_ji =  name_jic1
        let DIV = document.createElement('div')
        DIV.id = 'download_video1'
        DIV.innerHTML ='点击播放 《'+ name_jic1+'》'
        document.body.appendChild(DIV)
        document.getElementById('download_video1').addEventListener('click',function(e){
            var url = jk + window.location.href
            console.log(url)
            var name = name_n1_ji
            var features = 0
            var location = 0
            window.open (url, name, features,location)
        })
    }else if(result == false ){
        let DIV1 = document.createElement('div')
        DIV1.id = 'download_video2'
        DIV1.innerHTML ='点击播放 '
        document.body.appendChild(DIV1)

        document.getElementById('download_video2').addEventListener('click',function(e){
            var url = jk + window.location.href
            var name = '---'
            var features = 0
            var location = 0
            window.open (url, name, features,location)
        })
    }else {
        console.log("333333333333333");
    }
    // Your code here...
})();