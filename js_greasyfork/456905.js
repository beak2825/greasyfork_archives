// ==UserScript==
// @name         ykm_youkusp
// @namespace    优酷视频
// @version      0.7
// @description  支持优酷网页观看会员视频等
// @author       ykm
// @match        https://v.youku.com/v_show/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youku.com
// @grant        GM_download
// @grant        GM_addStyle
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/456905/ykm_youkusp.user.js
// @updateURL https://update.greasyfork.org/scripts/456905/ykm_youkusp.meta.js
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
    var patt=new RegExp('电视剧','i') ;
    var result=patt.test(title_jic1);
    if(result == true){
        var name_n = document.querySelector(".subtitle>a")
        var name_n1 = name_n.innerText;
        var name_ji = document.querySelector(".subtitle>span")
        var name_jic1 = name_ji.innerText;
        var name_n1_ji = name_n1 +'-'+ name_jic1
        let DIV = document.createElement('div')
        DIV.id = 'download_video1'
        DIV.innerHTML ='点击播放  《'+ name_n1_ji+'》'
        document.body.appendChild(DIV)
        document.getElementById('download_video1').addEventListener('click',function(e){
            var url = jk + window.location.href
            var name = name_n1_ji
            var features = 0
            var location = 0
            window.open (url, name, features,location)
        })
    }else if(result == false){
        var name_dyn = document.querySelector(".title-width>.subtitle")
        var name_dyn1 = name_dyn.innerText;
        let DIV1 = document.createElement('div')
        DIV1.id = 'download_video2'
        DIV1.innerHTML ='点击播放  《'+ name_dyn1+'》'
        document.body.appendChild(DIV1)
        document.getElementById('download_video2').addEventListener('click',function(e){
            var url = jk + window.location.href
            var name = name_dyn1
            var features = 0
            var location = 0
            window.open (url, name, features,location)
        })
    }else {
        console.log("333333333333333");
    }
    // Your code here...
})();