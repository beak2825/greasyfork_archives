// ==UserScript==
// @name         lolo
// @namespace    http://tampermonkey.net/
// @version      2025-03-14
// @description  gogogo!
// @author       b
// @match        https://awards.komchadluek.net/KA8
// @icon         https://awards.komchadluek.net/KA8
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530061/lolo.user.js
// @updateURL https://update.greasyfork.org/scripts/530061/lolo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 第一步：点击图片元素
    const imgElement = document.querySelector('img.ant-image-img.custom-image[src="https://media.komchadluek.net/uploads/images/event/award/2025/01/JYC9NqN4Tf2Dq21x77e4.webp?x-image-process=style/MD"]');
    if (imgElement) {
        imgElement.click();
        console.log('已点击图片元素');
    } else {
        console.log('未找到图片元素');
        return;
    }

    // 第二步：延迟1秒后勾选复选框
    setTimeout(() => {
        const checkbox = document.querySelector('span.agree');
        if (checkbox) {
            checkbox.click();
            console.log('已勾选复选框');
        } else {
            console.log('未找到复选框');
            return;
        }

        // 第三步：点击投票按钮
        const voteButton = document.querySelector('div.btn');
        if (voteButton) {
            voteButton.click();
            console.log('已点击投票按钮');
        } else {
            console.log('未找到投票按钮');
            return;
        }

        // 第四步：点击投票按钮后30秒开始检测结果
        setTimeout(() => {
            const startTime = Date.now();
            const maxWaitTime = 2 * 60 * 1000; // 最大等待时间2分钟
            const checkInterval = 5 * 1000; // 每5秒检测一次

            const checkResult = () => {
                const resultElement = document.querySelector('div.text-content2');
                if (resultElement && resultElement.textContent.includes('คุณสามารถโหวต ได้อีกครั้ง หลัง 10 นาที')) {
                    console.log('检测到结果元素，清除cookie并刷新页面');
                    clearCookiesAndRefresh();
                } else if (Date.now() - startTime >= maxWaitTime) {
                    console.log('超过2分钟未检测到结果元素，清除cookie并刷新页面');
                    clearCookiesAndRefresh();
                } else {
                    console.log('未检测到结果元素，继续检测...');
                    setTimeout(checkResult, checkInterval);
                }
            };

            checkResult();
        }, 30 * 1000); // 延迟30秒开始检测
    }, 1000); // 延迟1秒勾选复选框
})();

// 清除cookie并刷新页面
function clearCookiesAndRefresh() {
    document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    console.log('已清除cookie');
    window.location.reload();
}