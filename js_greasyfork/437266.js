// ==UserScript==
// @name         hho-tmall-extension
// @namespace    https://detail.tmall.com
// @version      0.3
// @description  tmall miaomiao!
// @author       miaomiao
// @match        https://detail.tmall.com/*
// @icon         https://www.google.com/s2/favicons?domain=tmall.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437266/hho-tmall-extension.user.js
// @updateURL https://update.greasyfork.org/scripts/437266/hho-tmall-extension.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var $ = window.$
     var imageUrls = []
     $(document).ready(function() {
         // 添加[下载图片]按钮
         const downloadButton = '<button style="position: fixed; top: 140px; right: 100px;z-index: 99999;background: red;color: #fff;cursor: pointer;" id="hhoDownloadImagesBtn">下载天猫图片</button>'
         $('body').append(downloadButton);
     })

    $(document).on('click',"#hhoDownloadImagesBtn", function(){ saveImages() });

    function saveImages() {
        // 左侧
        var leftImagesEl = Array.prototype.slice.call(document.querySelectorAll('#J_UlThumb img')).map(d => {
            d.src = d.src.replace('_60x60q90.jpg','')
            d.hhoType = 'main'
            return d
        });
        leftImagesEl = leftImagesEl.filter(img => img.src.indexOf('q-90-90') < 0)
        leftImagesEl.forEach((img, index) => {
            download(img.src, img.hhoType + index)
        })
        // 详情
        var detailImagesEl = Array.prototype.slice.call(document.querySelectorAll('#description img')).map(d => {
            d.hhoType = 'detail'
            return d
        });
        detailImagesEl = detailImagesEl.filter(img => img.src.indexOf('.gif') < 0 && img.src.indexOf('q-90-90') < 0)
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
})();