// ==UserScript==
// @name         豆包去水印图片下载
// @namespace    http://tampermonkey.net/
// @version      20250820120715
// @description  2025年8月20日12:07:18
// @author       ws
// @match        https://www.doubao.com/chat/*
// @icon         https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/web/static/image/logo-icon-white-bg.dc28fd5e.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516813/%E8%B1%86%E5%8C%85%E5%8E%BB%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/516813/%E8%B1%86%E5%8C%85%E5%8E%BB%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 定义要添加的 div
    var checkXPathInterval = setInterval(function() {
        console.log('开始检测按钮是否存在......')
        var newDiv = document.createElement('div');
        newDiv.classList.add('right-label-btn-wrapper-F2OJB9'); // 设置你想要的类名
        newDiv.classList.add('hover-qlWfDU'); // 设置你想要的类名
        newDiv.style.width="100px"
        newDiv.innerHTML = '<span role="img" class="semi-icon semi-icon-default"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M11.996 4q.384 0 .618.236.243.245.243.638v8.205l-.078 1.653 2.082-2.299 1.613-1.598a.9.9 0 0 1 .274-.19 1 1 0 0 1 .344-.062q.352 0 .587.236a.8.8 0 0 1 .243.606.8.8 0 0 1-.07.331 1 1 0 0 1-.212.3l-5.002 4.983a1 1 0 0 1-.297.205.79.79 0 0 1-.689 0 1 1 0 0 1-.298-.205L6.36 12.055a.9.9 0 0 1-.203-.299.8.8 0 0 1-.07-.33q0-.371.234-.607a.8.8 0 0 1 .587-.236q.18 0 .337.063.156.07.281.189l1.605 1.598 2.082 2.307-.078-1.661V4.874q0-.393.235-.638A.86.86 0 0 1 11.996 4M6.822 17.3h10.34q.36 0 .595.235a.84.84 0 0 1 .243.615q0 .361-.243.606a.8.8 0 0 1-.595.244H6.822a.8.8 0 0 1-.595-.244A.86.86 0 0 1 6 18.15q0-.37.227-.614a.8.8 0 0 1 .595-.237"></path></svg></span><span class="btn-label-GAOaPn">去水印下载原图</span>';
        // 循环检测 XPath  /html/body/div[1]/div[1]/div/div[3]/div/main/div/div/div[2]/div/div[1]/div/div/div[2]/div[8]/div/div/div/div/div/div/div/div/div[4]/div/div/div/div[2]/div[2]/div/div[1]/div/div[1]/div[2]/div[1]
        var 右侧div='/html/body/div[1]/div[1]/div/div[3]/div/main/div/div/div[2]/div/div[1]/div/div/div[2]/div[8]/div/div/div/div/div/div/div/div/div[2]/div/div/div/div[2]/div[2]/div/div[1]/div/div[1]/div[2]/div[1]'
        var right_div = document.evaluate(`${右侧div}`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var div_全尺寸= document.evaluate(`${右侧div}/div[2]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (right_div && !div_全尺寸) {
            console.log("添加全尺寸下载按钮")
            newDiv.addEventListener('click', function() {
                downloadImageFromXPath()
            });
            right_div.appendChild(newDiv);
        }else{
            //console.log("[debug-20241112164304]righ不存在  ucunz ws下载已存在")
        }
        newDiv = document.createElement('div');
        newDiv.classList.add('right-label-btn-wrapper-F2OJB9'); // 设置你想要的类名
        newDiv.classList.add('hover-qlWfDU'); // 设置你想要的类名
        newDiv.style.width="100px"
        newDiv.innerHTML = '<span role="img" class="semi-icon semi-icon-default"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M11.996 4q.384 0 .618.236.243.245.243.638v8.205l-.078 1.653 2.082-2.299 1.613-1.598a.9.9 0 0 1 .274-.19 1 1 0 0 1 .344-.062q.352 0 .587.236a.8.8 0 0 1 .243.606.8.8 0 0 1-.07.331 1 1 0 0 1-.212.3l-5.002 4.983a1 1 0 0 1-.297.205.79.79 0 0 1-.689 0 1 1 0 0 1-.298-.205L6.36 12.055a.9.9 0 0 1-.203-.299.8.8 0 0 1-.07-.33q0-.371.234-.607a.8.8 0 0 1 .587-.236q.18 0 .337.063.156.07.281.189l1.605 1.598 2.082 2.307-.078-1.661V4.874q0-.393.235-.638A.86.86 0 0 1 11.996 4M6.822 17.3h10.34q.36 0 .595.235a.84.84 0 0 1 .243.615q0 .361-.243.606a.8.8 0 0 1-.595.244H6.822a.8.8 0 0 1-.595-.244A.86.86 0 0 1 6 18.15q0-.37.227-.614a.8.8 0 0 1 .595-.237"></path></svg></span><span class="btn-label-GAOaPn">去水印下载1200x678尺寸</span>';

        // 循环检测 XPath
        var div_1200x678= document.evaluate(`${右侧div}/div[3]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (right_div && !div_1200x678) {
            console.log("添加div_1200x678下载按钮")
            newDiv.addEventListener('click', function() {
                downloadImageFromXPath_1200x678()
            });
            right_div.appendChild(newDiv);
        }else{
            //console.log("[debug-20241112164304]righ不存在  ucunz ws下载已存在")
        }

    }, 3000); // 每隔 1 秒检测一次，可以根据实际情况调整时间间隔
    // 函数：从 XPath 获取图片 src 并下载，设置分辨率为 1200*675，尝试解决跨域问题
    function downloadImageFromXPath_1200x678() {
        var imgElement = document.evaluate('//*[@id="img-content-container"]/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (imgElement && imgElement.tagName === 'IMG' && imgElement.src) {
            // 设置图像的 crossorigin 属性为 anonymous
            const originalSrc = imgElement.src;
            // 创建一个新的 Image 对象
            const newImage = new Image();
            newImage.crossOrigin = 'anonymous'; // 设置跨域属性
            newImage.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = 1200;
                canvas.height = 678;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(newImage, 0, 0, canvas.width, canvas.height);

                // 生成时间戳命名的文件名
                const timestamp = new Date().getTime();
                // 下载图片
                const link = document.createElement('a');
                link.href = canvas.toDataURL();
                link.download = `${timestamp}.png`;
                link.click();
            };
            newImage.src = originalSrc;
        } else {
            console.error('Image not found at the specified XPath.');
        }
    }
    function downloadImageFromXPath() {
        var imgElement = document.evaluate('//*[@id="img-content-container"]/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (imgElement && imgElement.tagName === 'IMG' && imgElement.src) {
            // 设置图像的 crossorigin 属性为 anonymous
            const originalSrc = imgElement.src;
            // 创建一个新的 Image 对象
            const newImage = new Image();
            newImage.crossOrigin = 'anonymous'; // 设置跨域属性
            newImage.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                // 设置 canvas 尺寸为图片的实际尺寸
                canvas.width = newImage.width;
                canvas.height = newImage.height;
                ctx.drawImage(newImage, 0, 0, canvas.width, canvas.height);

                // 生成时间戳命名的文件名
                const timestamp = new Date().getTime();
                // 下载图片
                const link = document.createElement('a');
                link.href = canvas.toDataURL();
                link.download = `${timestamp}.png`;
                link.click();
            };
            newImage.src = originalSrc;
        } else {
            console.error('Image not found at the specified XPath.');
        }
    }
})();