// ==UserScript==
// @name         jikeLivePhoto
// @namespace    http://jaxer.cc/
// @description  即刻查看livephoto的动态视频
// @version      2024-05-11
// @author       jaxer
// @match        https://m.okjike.com/originalPosts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=okjike.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494639/jikeLivePhoto.user.js
// @updateURL https://update.greasyfork.org/scripts/494639/jikeLivePhoto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        let json = document.getElementById("__NEXT_DATA__").innerText
        let data = JSON.parse(json)
        let postPic = data.props.pageProps.post.pictures
        postPic.forEach(p=>{
            if(p.livePhoto){
                console.log(p.livePhoto, p.livePhoto.videoUrl)

                const warpElement = document.querySelector('.post-wrap');
                const newVideo = document.createElement('video');

                // 设置视频的属性
                newVideo.src = p.livePhoto.videoUrl; // 替换为实际的视频URL
                newVideo.controls = true; // 添加控制条
                newVideo.autoplay = false; // 是否自动播放，默认为 false
                newVideo.loop = false; // 是否循环播放，默认为 false
                newVideo.muted = true; // 是否静音，默认为 false
                newVideo.style.width ="100%"

                // 将 <video> 元素添加到 warp 元素的末尾
                warpElement.appendChild(newVideo);
            }

        })
    });


})();