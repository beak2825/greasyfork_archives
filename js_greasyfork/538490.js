// ==UserScript==
// @name         HDR图片亮度自动调节
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  压制HDR高光亮度，鼠标悬停显示原始效果
// @author       Lex
// @match        https://www.hdrify.com/*
// @match        https://hdrify.com/*
// @match        https://v2ex.com/*
// @match        https://www.v2ex.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538490/HDR%E5%9B%BE%E7%89%87%E4%BA%AE%E5%BA%A6%E8%87%AA%E5%8A%A8%E8%B0%83%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/538490/HDR%E5%9B%BE%E7%89%87%E4%BA%AE%E5%BA%A6%E8%87%AA%E5%8A%A8%E8%B0%83%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 滤镜设置 - 专门针对压制高光
    const FILTER = 'brightness(0.65) contrast(0.88) saturate(1.15)';

    // 添加全局样式
    GM_addStyle(`
        /* 对所有图片应用滤镜 */
        img {
            filter: ${FILTER} !important;
            transition: filter 0.3s ease !important;
        }

        img:hover {
            filter: none !important;
        }

        canvas {
            filter: ${FILTER} !important;
            transition: filter 0.3s ease !important;
        }

        canvas:hover {
            filter: none !important;
        }

        [style*="background-image"] {
            filter: ${FILTER} !important;
            transition: filter 0.3s ease !important;
        }

        [style*="background-image"]:hover {
            filter: none !important;
        }
    `);

    // Ctrl + Alt + H 开关滤镜
    let enabled = true;
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.key === 'h') {
            e.preventDefault();
            enabled = !enabled;
            document.getElementById('hdr-style').disabled = !enabled;
        }
    });

    console.log('HDR高光压制已启动 (Ctrl+Alt+H 开关)');

})();