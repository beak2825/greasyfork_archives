// ==UserScript==
// @name         导出SVG/PNG
// @namespace    http://tampermonkey.net/
// @version      2025-03-22
// @description  点击按钮导出SVG或PNG格式
// @author       GVMZ
// @match        https://www.processon.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_download
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530527/%E5%AF%BC%E5%87%BASVGPNG.user.js
// @updateURL https://update.greasyfork.org/scripts/530527/%E5%AF%BC%E5%87%BASVGPNG.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 插入导出SVG按钮
    let svgButton = document.createElement('button');
    svgButton.innerHTML = '导出SVG';
    svgButton.style.position = 'fixed';
    svgButton.style.top = '460px';
    svgButton.style.right = '20px';
    svgButton.style.zIndex = 9999;
    svgButton.style.padding = '10px';
    svgButton.style.backgroundColor = '#4CAF50';
    svgButton.style.color = 'white';
    svgButton.style.border = 'none';
    svgButton.style.borderRadius = '5px';
    svgButton.style.cursor = 'pointer';
    document.body.appendChild(svgButton);

    // 插入导出PNG按钮
    let pngButton = document.createElement('button');
    pngButton.innerHTML = '导出PNG';
    pngButton.style.position = 'fixed';
    pngButton.style.top = '500px';
    pngButton.style.right = '20px';
    pngButton.style.zIndex = 9999;
    pngButton.style.padding = '10px';
    pngButton.style.backgroundColor = '#FF5722';
    pngButton.style.color = 'white';
    pngButton.style.border = 'none';
    pngButton.style.borderRadius = '5px';
    pngButton.style.cursor = 'pointer';
    document.body.appendChild(pngButton);

    // 去除水印的函数
    function removeWatermark(svgElement) {
        // 查找包含特定文本的 <text> 元素
        let watermarkTextElements = svgElement.querySelectorAll('text');
        watermarkTextElements.forEach(function(textElement) {
            // 检查文本内容是否为水印文本
            if (textElement.textContent.includes('ProcessOn.com免费流程图')) {
                textElement.remove(); // 移除水印文本
            }
        });
    }

    // 导出SVG按钮的点击事件
    svgButton.addEventListener('click', function() {
        // 获取SVG元素
        let allSvgElements = document.querySelectorAll('[id*="SvgjsSvg"]');
        let svgElement = allSvgElements[2]; // 获取第三个SVG元素

        if (svgElement) {
            // 去除水印
            removeWatermark(svgElement);

            // 获取SVG数据
            let svgData = new XMLSerializer().serializeToString(svgElement);

            // 修复命名空间问题
            svgData = svgData.replace(/xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/g, '');

            // 下载SVG文件
            let svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
            let svgUrl = URL.createObjectURL(svgBlob);
            GM_download({
                url: svgUrl,
                name: 'exported_image.svg',
                saveAs: true
            });
        } else {
            alert('未找到SVG元素');
        }
    });

    // 导出PNG按钮的点击事件
    pngButton.addEventListener('click', function() {
        // 获取SVG元素
        let allSvgElements = document.querySelectorAll('[id*="SvgjsSvg"]');
        // 获取第三个SVG元素
        let svgElement = allSvgElements[2];

        if (svgElement) {
            // 去除水印
            removeWatermark(svgElement);

            // 获取SVG数据
            let svgData = new XMLSerializer().serializeToString(svgElement);

            // 修复命名空间问题
            svgData = svgData.replace(/xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/g, '');

            // 转换为PNG并下载
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let img = new Image();
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(function(blob) {
                    let pngUrl = URL.createObjectURL(blob);
                    GM_download({
                        url: pngUrl,
                        name: 'exported_image.png',
                        saveAs: true
                    });
                }, 'image/png');
            };
        } else {
            alert('未找到SVG元素');
        }
    });
})();
