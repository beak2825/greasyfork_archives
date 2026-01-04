// ==UserScript==
// @name         删除bilibili直播网页全屏礼物栏-不是循环执行，不占内存
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  在使用哔哩哔哩的页面全屏时，最下面总会显示一栏礼物栏，有时候会误触到礼物，然后损失自己的小电池，此脚本可以在打开网页后删除礼物栏，但是不会操作你的个人数据，请放心食用。
// @author       白白小草
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510253/%E5%88%A0%E9%99%A4bilibili%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E7%A4%BC%E7%89%A9%E6%A0%8F-%E4%B8%8D%E6%98%AF%E5%BE%AA%E7%8E%AF%E6%89%A7%E8%A1%8C%EF%BC%8C%E4%B8%8D%E5%8D%A0%E5%86%85%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/510253/%E5%88%A0%E9%99%A4bilibili%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E7%A4%BC%E7%89%A9%E6%A0%8F-%E4%B8%8D%E6%98%AF%E5%BE%AA%E7%8E%AF%E6%89%A7%E8%A1%8C%EF%BC%8C%E4%B8%8D%E5%8D%A0%E5%86%85%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const targetDiv = document.getElementById('web-player__bottom-bar__container');
            if (targetDiv) {
                targetDiv.remove();
                observer.disconnect();
                break;
            }
        }
    }
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();