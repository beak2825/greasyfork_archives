// ==UserScript==
// @name         hho-1688-extension
// @namespace    https://detail.1688.com/
// @version      0.1
// @description  1688!
// @author       miaomiao
// @match        https://detail.1688.com/*
// @icon         https://www.google.com/s2/favicons?domain=1688.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438257/hho-1688-extension.user.js
// @updateURL https://update.greasyfork.org/scripts/438257/hho-1688-extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.$
     var imageUrls = []
     $(document).ready(function() {
         // 添加[下载1688图片]按钮
         const downloadButton = '<button style="position: fixed; top: 140px; right: 100px;z-index: 99999;background: red;color: #fff;cursor: pointer;" id="hhoDownloadImagesBtn">下载1688图片</button>'
         $('body').append(downloadButton);
         // 添加[下载1688视频]按钮
         const downloadVideoButton = '<button style="position: fixed; top: 100px; right: 100px;z-index: 99999;background: green;color: #fff;cursor: pointer;" id="hhoDownloadVideoBtn">下载1688视频</button>'
         $('body').append(downloadVideoButton);
     })

    $(document).on('click',"#hhoDownloadImagesBtn", function(){ saveImages() });

    $(document).on('click',"#hhoDownloadVideoBtn", function(){ saveVideo() });

    function saveImages() {
        // 左侧
        var leftImagesEl = Array.prototype.slice.call(document.querySelectorAll('.detail-gallery-turn img.detail-gallery-img')).map(d => {
            d.hhoType = 'main'
            return d
        });
        leftImagesEl.forEach((img, index) => {
            download(img.src, img.hhoType + index)
        })
        // 详情
        var detailImagesEl = Array.prototype.slice.call(document.querySelectorAll('#detailContentContainer img')).map(d => {
            d.hhoType = 'detail'
            return d
        });
        detailImagesEl.forEach((img, index) => {
            download(img.src, img.hhoType + index)
        })
    }

    function download(link, filename){
        if (!filename) return;
        let img = new Image()
        img.setAttribute('crossOrigin', 'Anonymous')
        console.log(link, filename)
        img.onload = function(){
            let canvas = document.createElement('canvas')
            let context = canvas.getContext('2d')
            canvas.width = img.width
            canvas.height = img.height
            context.drawImage(img, 0, 0, img.width, img.height)
            let url = canvas.toDataURL('images/png')
            let a = document.createElement('a')
            let event = new MouseEvent('click')
            a.download = filename || 'default.png'
            a.href = url
            a.dispatchEvent(event)
        }
        img.src = link
    }

    function saveVideo() {
        var videoEl = Array.prototype.slice.call(document.querySelectorAll('video')).map(d => {
            d.hhoType = 'video'
            return d
        });
        videoEl.forEach((video, index) => {
           downloadVideo(video.src, video.hhoType + index)
        })
    }

    function downloadVideo(link, filename){
        if (!filename) return;
        console.log(link, filename)
        var xhr = new XMLHttpRequest();
        xhr.open('GET', link, true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(this.response);
            var tag = document.createElement('a');
            tag.href = imageUrl;
            tag.target = '_blank';
            tag.download = filename;
            document.body.appendChild(tag);
            tag.click();
            document.body.removeChild(tag);
        };
        xhr.onerror = err => {
            alert('Failed to download picture');
        };
        xhr.send();
    }
})();