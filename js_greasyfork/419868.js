// ==UserScript==
// @name         解锁新浪新闻需要下载APP才能查看全文
// @namespace    https://www.teaxia.com
// @version      1.2.1
// @description  解锁微博PC端跳转至新浪页面时，浏览新闻需要强制下载APP
// @author       teaxia
// @match        *://*.sina.cn/*
// @grant        none
// @note         21-01-28 1.1.0 增加了顶部、播放器广告过滤
// @note         21-07-04 1.2.1 增加了打开APP按钮过滤、修复播放器层广告过滤失败的问题
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/419868/%E8%A7%A3%E9%94%81%E6%96%B0%E6%B5%AA%E6%96%B0%E9%97%BB%E9%9C%80%E8%A6%81%E4%B8%8B%E8%BD%BDAPP%E6%89%8D%E8%83%BD%E6%9F%A5%E7%9C%8B%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/419868/%E8%A7%A3%E9%94%81%E6%96%B0%E6%B5%AA%E6%96%B0%E9%97%BB%E9%9C%80%E8%A6%81%E4%B8%8B%E8%BD%BDAPP%E6%89%8D%E8%83%BD%E6%9F%A5%E7%9C%8B%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener ("load", remove);
    function remove() {
        let node = document.getElementsByClassName('s_card z_c1')   // 内容
        let artFoldBox = document.getElementById('artFoldBox')  // 弹出层
        let callApp = document.getElementsByClassName('callApp_fl_btn') // APP按钮
        let bannerAd = document.getElementsByClassName('cm_art_push')   // banner广告
        let broadcast_box = document.getElementsByClassName('broadcast_box') // 播放器层
        // let c_videoGroup_img = document.getElementsByClassName('c_videoGroup_img') // 播放器
        // 隐藏
        artFoldBox.style.display = 'none'
        // 下载APP按钮
        if(callApp instanceof Object){
            callApp[0].style.display = 'none'
        }
        // 头部横幅广告
        if(bannerAd instanceof Object && bannerAd.length>0){
            bannerAd[0].style.display = 'none'
        }
        // 隐藏播放内容广告
        if(broadcast_box instanceof Object && broadcast_box.length>0){
            for(let i=0;i<broadcast_box.length;i++){
                console.log(broadcast_box,i)
                broadcast_box[i].style.display = 'none'
            }
        }
        // 设置正文内容高度
        if(node instanceof Object && node.length>0){
            node[0].style.height = 'auto'
        }
    }
})();