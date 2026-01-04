// ==UserScript==
// @name         WeChat Image Copier 微信公众号图片复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击微信公众号文章图片，立即复制到粘贴板
// @author       maquedexiju
// @match        https://mp.weixin.qq.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510376/WeChat%20Image%20Copier%20%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%BE%E7%89%87%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/510376/WeChat%20Image%20Copier%20%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%BE%E7%89%87%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function add_copy_img_event() {
        console.log('run');

        var imgs = document.querySelectorAll('img')

        function add_event(img) {

            img.addEventListener('click', function(event) {
                // 找到图片元素
                var imgElement = event.currentTarget;
                console.log(imgElement.src);
                imgElement.setAttribute('crossorigin', 'anonymous'); // 解决 Tainted canvases may not be exported.
                var canvas = document.createElement('canvas');

                // 将图片绘制到canvas上
                canvas.width = imgElement.width;
                canvas.height = imgElement.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);
                // document.body.appendChild(canvas); // 测试图片有没有正常获取

                // 转为Blob数据
                canvas.toBlob(blob => {
                    // 使用剪切板API进行复制
                    const data = [new ClipboardItem({
                        ['image/png']: blob
                    })];

                    navigator.clipboard.write(data).then(function(){console.log('成功')}, function(){console.log('失败')});
                });

            })
        };


        imgs.forEach(add_event);
    };

    // setTimeout(add_copy_img_event, 1000); // 10000毫秒 = 10秒
    var element = document.body;
    // 添加滚动事件的监听器
    window.addEventListener('scrollend', add_copy_img_event); // 微信的内容是划到了地方才进行内容加载
    })();