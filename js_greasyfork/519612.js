// ==UserScript==
// @name         ITDOG广告自动关闭器 | ITDOG Ad Auto-Closer
// @namespace    http://tampermonkey.net/
// @version      2024-12-03
// @description  自动点击ITDOG网站上的"关闭所有广告"按钮，减少广告干扰。| Automatically click the "Close All Ads" button on the ITDOG website to minimize ad interference.
// @description:zh-CN  自动点击ITDOG网站上的"关闭所有广告"按钮，减少广告干扰。
// @description:zh-TW  自動點擊ITDOG網站上的「關閉所有廣告」按鈕，減少廣告干擾。
// @description:en     Automatically click the "Close All Ads" button on the ITDOG website to minimize ad interference.
// @author       Myth
// @match        *://www.itdog.cn/*
// @icon         https://www.itdog.cn/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519612/ITDOG%E5%B9%BF%E5%91%8A%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%99%A8%20%7C%20ITDOG%20Ad%20Auto-Closer.user.js
// @updateURL https://update.greasyfork.org/scripts/519612/ITDOG%E5%B9%BF%E5%91%8A%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%99%A8%20%7C%20ITDOG%20Ad%20Auto-Closer.meta.js
// ==/UserScript==
// 自动关闭广告的函数
function autoCloseAds() {
    // 通过文字内容查找"关闭所有广告"按钮
    const adCloseButton = Array.from(document.querySelectorAll('div'))
        .find(el => el.textContent.trim() === '关闭所有广告');
    // 如果找到按钮，就点击它
    if (adCloseButton) {
        adCloseButton.click();
        console.log('成功点击广告关闭按钮');
    }
}
// 方案1：脚本加载后立即运行
autoCloseAds();
// 方案2：定期检查并关闭广告
const adCloseInterval = setInterval(autoCloseAds, 2000);
// 可选：2分钟后停止检查
setTimeout(() => {
    clearInterval(adCloseInterval);
    console.log('已停止广告关闭检查');
}, 120000);
// 备用的广告关闭方法
function backupAdClose() {
    // 尝试通过特定属性查找按钮
    const backupButton = document.querySelector('div[onclick*="gg_link"]');
    if (backupButton) {
        backupButton.click();
        console.log('触发备用广告关闭方法');
    }
}
// 添加监听器捕获动态加载的元素
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            autoCloseAds();
            backupAdClose();
        }
    });
});
// 开始监听整个文档
observer.observe(document.body, {
    childList: true,
    subtree: true
});