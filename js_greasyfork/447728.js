// ==UserScript==
// @name         亚马逊视频下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  下载review视频
// @author       微博@下饭猫
// @match        *://www.amazon.com/gp/customer-reviews/*
// @match        *://www.amazon.ca/gp/customer-reviews/*
// @match        *://www.amazon.com.mx/gp/customer-reviews/*
// @match        *://www.amazon.co.uk/gp/customer-reviews/*
// @match        *://www.amazon.de/gp/customer-reviews/*
// @match        *://www.amazon.fr/gp/customer-reviews/*
// @match        *://www.amazon.it/gp/customer-reviews/*
// @match        *://www.amazon.es/gp/customer-reviews/*
// @match        *://www.amazon.jp/gp/customer-reviews/*
// @license      Zlib/Libpng License
// @grant        GM_download
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/447728/%E4%BA%9A%E9%A9%AC%E9%80%8A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/447728/%E4%BA%9A%E9%A9%AC%E9%80%8A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
  let btn=`
  #download_video{
    position:fixed;
    top:180px;
    left:200px;
    z-index:99999;
    background:orange;
    padding:5px 10px;
    border-radius:10px;
    cursor:pointer;
  }
  `
  GM_addStyle(btn)

  let DIV = document.createElement('div')
  DIV.id="download_video"
  DIV.innerHTML="下载视频"
  document.body.appendChild(DIV)

  document.getElementById('download_video').addEventListener('click',function(e){
   let url = document.querySelectorAll("input[type='hidden']")[3].getAttribute('value')
   let title = document.querySelector(".review-title").innerText
   console.log(url);
   console.log(title);
   if(url){
     GM_download(url,title)
   }
   else{
    alert("视频未找到，请手动查询")
   }
 })
    // Your code here...
})();