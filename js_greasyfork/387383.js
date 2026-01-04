// ==UserScript==
// @name         rarbg xxx板块 详情图助手
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  rarbg网的xxx板块的种子详情，下载之前总免不了要先看详情图预览，但是点击却总是给你跳到奇奇怪怪的广告去，用了这个之后，就能自动把详情图展现出来，极大的提高了下片的效率。
// @author       You
// @match        https://www.freebunker.com/*
// @match        https://www.imagefruit.com/*
// @match        https://www.pornbus.org/*
// @match        https://www.imagesnake.com/*
// @match        https://www.imgshots.com/*
// @match        https://imgprime.com/*
// @match        https://www.imgcarry.com/*
// @match        https://imagecurl.com/*
// @match        https://22pixx.xyz/*
// @match        https://rarbgprx.org/torrents.php?category=2;4
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387383/rarbg%20xxx%E6%9D%BF%E5%9D%97%20%E8%AF%A6%E6%83%85%E5%9B%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/387383/rarbg%20xxx%E6%9D%BF%E5%9D%97%20%E8%AF%A6%E6%83%85%E5%9B%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let img = document.getElementById('img_obj')||
        document.querySelector('#image_view a')
    console.log(img)
    if(img){
        window.location = img.src || img.href
    }
    setTimeout(()=>{
    if(window.linkid){

        window.location = window.linkid.replace(/\/([a-z]{2}-[a-z]{1})\//,'/o/').replace('.html','')
    }
    },200)
    let pixx = window.location.host
    //if(pixx.indexOf('pixx')>=0){
    // [].forEach.call(document.getElementsByTagName('a'),function(a){
    //     if(a.href.indexOf('jpeg')>=0){
    //      location = a.href
    //     }
    // })
   // }
    //xxx 列表预览图
    if(location.href === 'https://rarbgprx.org/torrents.php?category=2;4'){
        const tableList = document.querySelectorAll('.lista2t .lista2')
        tableList.forEach(cell=>{
            const url = cell.cells[1].innerHTML.match(/https(.*?)jpg/)
            cell.cells[0].innerHTML = url ? `<img src="${url[0]}">`: cell.cells[0].innerHTML
        })
    }
})();