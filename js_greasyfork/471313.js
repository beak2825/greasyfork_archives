// ==UserScript==
// @name         最新免费无套路 稿定设计去水印
// @namespace    gaodingsheji
// @version      1.1
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @description  脚本仅供个人学习研究，所得素材资源他用后果自负。
// @author       pachyming
// @match        https://www.gaoding.com/editor/design?*
// @match        https://www.focodesign.com/editor/design?*
// @match        https://www.focodesign.com/editor/odyssey?template_id=*
// @icon         https://focodesign.com/favicon.ico
// @grant        none
// @license      Creative Commons (CC)
// @downloadURL https://update.greasyfork.org/scripts/471313/%E6%9C%80%E6%96%B0%E5%85%8D%E8%B4%B9%E6%97%A0%E5%A5%97%E8%B7%AF%20%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/471313/%E6%9C%80%E6%96%B0%E5%85%8D%E8%B4%B9%E6%97%A0%E5%A5%97%E8%B7%AF%20%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保存原始的 URL.createObjectURL 和 Blob 构造函数
    const originalCreateObjectURL = URL.createObjectURL;
    const originalBlob = window.Blob;

    // 覆盖 URL.createObjectURL
    URL.createObjectURL = function(blob) {
        // 仅拦截图像类型的 Blob 对象
        if (blob.type.startsWith('image/')) {
            console.error('拦截：URL.createObjectURL 调用被拦截，类型为图像');
            return null;
        } else {
            return originalCreateObjectURL(blob);
        }
    };

    // 覆盖 Blob 构造函数
    window.Blob = function(blobParts, options) {
        // 检查 Blob 的类型
        const type = options && options.type ? options.type : '';
        if (type.startsWith('image/')) {
            console.error('拦截：图像类型的 Blob 创建操作被拦截');
            return new originalBlob(blobParts, options);
        } else {
            return new originalBlob(blobParts, options);
        }
    };

    console.log('拦截图像类型的 Blob 和 URL.createObjectURL 操作的脚本已加载');
})();