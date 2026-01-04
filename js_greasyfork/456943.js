// ==UserScript==
// @name         ykm_aqiyi
// @namespace    爱奇艺视频
// @version      0.1
// @description  支持爱奇艺网页观看会员视频等
// @author       ykm
// @match        https://www.iqiyi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youku.com
// @grant        GM_download
// @grant        GM_addStyle
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/456943/ykm_aqiyi.user.js
// @updateURL https://update.greasyfork.org/scripts/456943/ykm_aqiyi.meta.js
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
    var patt=new RegExp('电影','i') ;
    var title_jic1 = name_title.innerText;
    var result=patt.test(title_jic1);
    if(result == true){
        var name_titles = name_title.innerText
        var atitle_jie =name_titles.indexOf("-完整版")
        var name_mz = name_titles.substring(0, atitle_jie);
        let DIV = document.createElement('div');
        DIV.id = 'download_video1';
        DIV.innerHTML ='点击播放  《'+ name_mz+'》'
        document.body.appendChild(DIV);
        document.getElementById('download_video1').addEventListener('click',function(e){
            var url = jk + window.location.href
            console.log(url)
            var name = name_mz
            var features = 0
            var location = 0
            window.open (url, name, features,location)
        })
    }else if(result == false){
        let DIV1 = document.createElement('div');
        DIV1.id = 'download_video2';
        DIV1.innerHTML ='点击播放 '
        document.body.appendChild(DIV1);
        document.getElementById('download_video2').addEventListener('click',function(e){
            var url = jk + window.location.href
            console.log(url)
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