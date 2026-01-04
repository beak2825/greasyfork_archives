// ==UserScript==
// @name         替换Iframe为二维码
// @namespace    http://tampermonkey.net/
// @version      2025-02-06
// @description  tools
// @license MIT
// @author       xiaocc
// @match        *://xlabel.uc.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uc.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536444/%E6%9B%BF%E6%8D%A2Iframe%E4%B8%BA%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/536444/%E6%9B%BF%E6%8D%A2Iframe%E4%B8%BA%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

window.onload = function () {

    // 工具函数：生成二维码的 HTML
    function generateQRCode(src) {
        var qrCodeApi = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(src)}`;
        return `
            <div style="text-align: center;">
                <p>扫我 (●ˇ∀ˇ●)：</p>
                <img src="${qrCodeApi}" alt="二维码" style="width:200px;height:200px;">
            </div>
        `;
    }

    // 主函数：替换 iframe 为二维码
    function replaceIframeWithQRCode() {
        var iframe = document.getElementById('myIframe');
        if (iframe) {
            var src = iframe.src; // 获取 src 属性

            // 检查链接是否包含 "douyin"
            if (src.includes("douyin")) {
                var qrCodeHtml = generateQRCode(src);

                // 创建一个 div 来替换 iframe
                var qrCodeDiv = document.createElement('div');
                qrCodeDiv.innerHTML = qrCodeHtml;

                // 替换 iframe
                iframe.parentNode.replaceChild(qrCodeDiv, iframe);
                console.log('二维码已更新：', src);

            } else {
                console.warn('链接不包含 "douyin"，不转换为二维码替换iframe');
            }
        } else {
            console.warn('未找到 id 为 myIframe 的元素');
        }
    }

    // 每秒检测一次
    setInterval(replaceIframeWithQRCode, 1000);
};