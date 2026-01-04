// ==UserScript==
// @name         基于discuz!框架的论坛优化
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  显示 activeId 数值和对应的 msg 值，生成包含特定 URL 的二维码，并每五秒刷新一次网页
// @author       You
// @match        https://mobilelearn.chaoxing.com/widget/sign/refreshEwn?activeId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532520/%E5%9F%BA%E4%BA%8Ediscuz%21%E6%A1%86%E6%9E%B6%E7%9A%84%E8%AE%BA%E5%9D%9B%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532520/%E5%9F%BA%E4%BA%8Ediscuz%21%E6%A1%86%E6%9E%B6%E7%9A%84%E8%AE%BA%E5%9D%9B%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 提取 URL 中的 activeId 数值
    const urlParams = new URLSearchParams(window.location.search);
    const activeId = urlParams.get('activeId');

    // 获取页面 JSON 数据
    const jsonStr = document.body.textContent.trim();
    try {
        const data = JSON.parse(jsonStr);
        const msg = data.msg;

        if (msg && activeId) {
            // 创建显示元素
            const displayDiv = document.createElement('div');
            displayDiv.style = 'position: fixed; top: 20px; right: 20px; padding: 15px 20px; background: #2196F3; color: white; font-size: 16px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); z-index: 9999;';
            displayDiv.textContent = `【签到信息】\nactiveId: ${activeId}\nmsg: ${msg}`;
            displayDiv.style.whiteSpace = 'pre-wrap';
            document.body.appendChild(displayDiv);

            // 创建二维码容器
            const qrCodeDiv = document.createElement('div');
            qrCodeDiv.id = 'qrCodeDiv';
            qrCodeDiv.style = 'position: fixed; top: 200px; right: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; z-index: 9999;';
            document.body.appendChild(qrCodeDiv);

            // 引入 QRCode.js 库
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
            script.onload = function() {
                // 构建包含 activeId 和 msg 的 URL
                const qrCodeUrl = `https://mobilelearn.chaoxing.com/widget/sign/signIn?activeId=${activeId}&ewnCode=${msg}`;
                // 创建二维码实例
                new QRCode(qrCodeDiv, {
                    text: qrCodeUrl,
                    width: 256,
                    height: 256,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            };
            document.head.appendChild(script);
        }
    } catch (error) {
        console.error('[脚本错误] 解析失败:', error);
    }

    // 设置每五秒刷新一次网页
    setInterval(function() {
        location.reload();
    }, 5000);
})();