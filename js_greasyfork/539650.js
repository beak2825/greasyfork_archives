// ==UserScript==
// @name         Fotor 去水印
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  通过拦截HTMLImageElement的src属性来阻止Fotor网站上的水印加载。
// @author       阿杰
// @match        https://www.fotor.com.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539650/Fotor%20%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/539650/Fotor%20%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==
(function() {
    document.addEventListener('contextmenu', function(e) {
        e.stopImmediatePropagation(); // 阻止所有阻止右键默认行为的事件
    }, true);
})();
(function() {
    'use strict';

    function createCustomDownloadButton() {
        if (document.getElementById('custom-fotor-download-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'custom-fotor-download-btn';
        btn.innerText = '一键导出PNG';
        btn.style.position = 'fixed';
        btn.style.bottom = '30px';   // 右下角
        btn.style.right = '30px';
        btn.style.zIndex = '99999';
        btn.style.background = 'linear-gradient(90deg, #4f8cff 0%, #38e8ff 100%)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.padding = '12px 24px';
        btn.style.fontSize = '16px';
        btn.style.fontWeight = 'bold';
        btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        btn.style.cursor = 'pointer';
        btn.style.opacity = '0.92';
        btn.style.transition = 'opacity 0.2s';
        btn.onmouseenter = () => btn.style.opacity = '1';
        btn.onmouseleave = () => btn.style.opacity = '0.92';
        btn.onclick = function() {
            const canvas = document.querySelector('canvas');
            if (!canvas) {
                alert('未找到可导出的画布(canvas)。请确保已加载设计内容。');
                return;
            }
            const imgData = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = imgData;
            a.download = 'fotor_export.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        document.body.appendChild(btn);

        // 可选：让按钮可拖动
        let isDragging = false, offsetX = 0, offsetY = 0;
        btn.onmousedown = function(e) {
            isDragging = true;
            offsetX = e.clientX - btn.getBoundingClientRect().left;
            offsetY = e.clientY - btn.getBoundingClientRect().top;
            document.onmousemove = function(e) {
                if (isDragging) {
                    btn.style.right = 'auto';
                    btn.style.bottom = 'auto';
                    btn.style.left = (e.clientX - offsetX) + 'px';
                    btn.style.top = (e.clientY - offsetY) + 'px';
                }
            };
            document.onmouseup = function() {
                isDragging = false;
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createCustomDownloadButton);
    } else {
        createCustomDownloadButton();
    }
})();
(function() {
    'use strict';

    console.log('[Fotor Watermark Blocker] 脚本已加载。版本: 1.0');

    const WATERMARK_URL_FRAGMENTS = [
        'big_watermark_cn.svg',
        'Grid_watermark_v3.png'
    ];

    // 透明的1x1 GIF数据URI
    const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    // -----------------------------------------------------------
    // 劫持 HTMLImageElement.prototype.src
    // -----------------------------------------------------------\
    const originalImageSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    if (originalImageSrcDescriptor && originalImageSrcDescriptor.set) {
        const originalImageSrcSetter = originalImageSrcDescriptor.set;

        Object.defineProperty(HTMLImageElement.prototype, 'src', {
            set: function(value) {
                const isWatermark = WATERMARK_URL_FRAGMENTS.some(fragment => value.includes(fragment));
                if (isWatermark) {
                    console.log(`[Fotor Watermark Blocker] 拦截到水印图片加载: ${value}`);
                    // 设置为透明像素，阻止实际水印加载
                    originalImageSrcSetter.call(this, TRANSPARENT_PIXEL);
                    return;
                }
                // 否则，调用原始的setter
                originalImageSrcSetter.call(this, value);
            },
            get: originalImageSrcDescriptor.get, // 保留原始的getter
            configurable: true
        });
        console.log('[Fotor Watermark Blocker] 成功劫持 HTMLImageElement.prototype.src。');
    } else {
        console.warn('[Fotor Watermark Blocker] 无法劫持 HTMLImageElement.prototype.src。');
    }

})();