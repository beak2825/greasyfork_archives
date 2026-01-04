// ==UserScript==
// @name         稿定设计去水印
// @namespace    https://greasyfork.org/en/users/1089045-tao-yan
// @version      2024.927
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @description  刷新去水印
// @author       自己用别乱分享
// @match        https://www.gaoding.com/editor/design?*
// @match        https://www.focodesign.com/editor/design?*
// @match        https://www.focodesign.com/editor/odyssey?template_id=*
// @grant        none
// @license      Creative Commons (CC)
// @downloadURL https://update.greasyfork.org/scripts/510392/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/510392/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 这里的函数会修改 URL.createObjectURL 和 Blob 来阻止水印的生成
    function checkblob() {
        const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = function() {
            // 防止使用 createObjectURL 来显示水印
            return null;
        };
        const originalBlob = Blob;
        window.Blob = function(...args) {
            // 阻止通过 Blob 显示水印
            return new originalBlob(...args);
        };
    }

    // 设定时间限制，但无需提示用户
    const ts1 = 0.25 * 2 * 3 * 4;  // 原来的时间设定
    localStorage.setItem('scriptStartTime', new Date().getTime());

    // 直接启用去水印功能
    checkblob();
})();