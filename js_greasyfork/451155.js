// ==UserScript==
// @name         ykm_gequ_kg
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  kw下载歌曲
// @author       ykm
// @match        https://www.kugou.com/mixsong/*
// @match        https://www.kugou.com/song/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_download
// @grant        GM_addStyle
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451155/ykm_gequ_kg.user.js
// @updateURL https://update.greasyfork.org/scripts/451155/ykm_gequ_kg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css = `
    #download_video{
        position:fixed;
        top:10px;
        right:10px;
        z-index:99999;
        background:red;
        padding:5px 10px;
        border-radius:5px;
    }
    `
    GM_addStyle(css)
    let DIV = document.createElement('div')
    DIV.id = 'download_video'
    DIV.innerHTML = '下载歌曲'
    document.body.appendChild(DIV)

    document.getElementById('download_video').addEventListener('click',function(e){
        let url_kg = document.querySelector('audio').getAttribute('src')
        //console.log(url_kg)
        var name_kg = document.querySelector(".audioName").getAttribute('title')
        console.log(name_kg)
        //console.log(name_kwc)
        if(url_kg){
            alert("下载中......")
            GM_download(url_kg,name_kg)
            alert("下载中成功")
        } else {
            alert("未找到")
        }
    })
})();
