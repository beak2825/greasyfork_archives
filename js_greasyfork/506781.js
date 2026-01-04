// ==UserScript==
// @name         ProcessOn 脑图无水印下载
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description 在ProcessOn上下载没有水印的图像。
// @author       chsengni
// @license        MIT
// @match        https://www.processon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=processon.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/506781/ProcessOn%20%E8%84%91%E5%9B%BE%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/506781/ProcessOn%20%E8%84%91%E5%9B%BE%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 noConflict 避免与其他 jQuery 冲突
    const jq = jQuery.noConflict(true);

    // 等待页面完全加载后执行
    jq(document).ready(function() {
        // 创建按钮容器
        const container = jq('<div></div>').css({
            position: 'fixed',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        });

        // 创建按钮函数
        function createButton(text, format) {
            return jq('<button></button>')
                .addClass('btn btn-primary')
                .text(text)
                .on('click', () => {
                    downloadImage(format);
                });
        }

        // 创建SVG、PNG、JPG按钮
        container.append(createButton('下载 SVG', 'svg'));
        container.append(createButton('下载 PNG', 'png'));
        container.append(createButton('下载 JPG', 'jpg'));

        // 将按钮容器添加到页面
        jq('body').append(container);
    });

        // 更新 SVG 样式
    function updateSVGStyles() {
        const svgElement = jq('.water_image_ontainer svg');
        svgElement.each(function() {
            jq(this).css({
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: '1000px',
                height: '1818px',
                background: 'rgb(255, 255, 255)',
                zIndex: '999',
                transform: 'scale(1)'
            });
        });
    }
    // 下载SVG文件
    function downloadSVG(content) {
        const blob = new Blob([content], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'image.svg';
        a.click();
        URL.revokeObjectURL(url);
    }

    // 下载PNG或JPG文件
    function downloadImage(format) {
        if (jq('.water_image_ontainer').html()!="") {
            updateSVGStyles();
            let content =jq('.water_image_ontainer').html()
            content = content.replace(/ProcessOn.com免费思维导图/g, '');
            content = content.replace(/1000px/g, '1000px');
            content = content.replace(/1818px/g, '1818px');
            if (format === 'svg') {
                downloadSVG(content);
            } else if (format === 'png' || format === 'jpg') {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                const svg = new Blob([content], {type: 'image/svg+xml'});
                const url = URL.createObjectURL(svg);
                img.onload = function() {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob(function(blob) {
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = `image.${format}`;
                        a.click();
                        URL.revokeObjectURL(a.href);
                    }, `image/${format}`);
                };

                img.src = url;
            }
        } else {
            alert('请先打开导出页面再进行下载');
        }
    }
})();
