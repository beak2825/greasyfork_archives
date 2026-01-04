// ==UserScript==
// @name         bilibili优化助手
// @namespace    https://greasyfork.org/zh-CN/users/547075-limkim
// @version      1.4.0
// @description  去除Bilibili检测插件的提示，去除首页推荐中出现的推广与广告，移除特定日期的黑白色调等
// @author       limkim
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?spm_id_from=*
// @match        https://www.bilibili.com/watchlater/
// @match        https://www.bilibili.com/watchlater/?spm_id_from=*
// @license      MIT

// @icon         https://greasyfork.org/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTQyMzM2LCJwdXIiOiJibG9iX2lkIn19--d46c889cb90bcdda22c3de1e78dd1e4b71e9a8bf/Untitled2.png?locale=zh-CN
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498347/bilibili%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/498347/bilibili%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 去除顶部tip
    if (document.querySelector(".adblock-tips")) {
        document.querySelector(".adblock-tips").style.display = "none";
    }
    setTimeout(() => {
        const quality = document.querySelector('[data-e2e="quality-selector"] div');
        const chatroom = document.querySelector("#chatroom");
        const danmu = document.querySelector('.danmu-icon');
        const gift = document.querySelector('.xg-right-grid xg-icon[data-index="1"].sLHkIpHN');
        const fullscreen = document.querySelector('.xg-right-grid xg-icon[data-index="0.5"].sLHkIpHN');
        quality && quality.click();
        chatroom && chatroom.remove();
        if (danmu && danmu.getAttribute('data-state') === 'active') {
            danmu.click();
        }
        if (gift && gift.textContent.includes('屏蔽')) {
            gift.querySelectorAll('div')[2].click();
        }

        // 稍后再看
        const domList = document.querySelectorAll('.av-pic');
        domList.forEach(dom => {
          const paths = dom.href.split('/');
          const bvid = paths[paths.length - 1];
          dom.setAttribute('href', `https://www.bilibili.com/video/${bvid}`);
          dom.setAttribute('target', '_blank');
        });
    }, 300);
    // 移除特定日期的色彩样式, 例如灰白色
    document.querySelector("html").removeAttribute("class");
    // 节流
    function throttle(func, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            func.apply(this, args);
        }
    }
    function hasAd(node) {
        return node.innerHTML.includes('bili-video-card__info--ad') || node.innerHTML.includes('bili-video-card__info--creative-ad');
    }
    // function getCurrentGroupLastCard(index) {
    //     let remainder = num % 11;
    //     if (remainder === 0) {
    //         return num + 11;
    //     } else {
    //         return num + (11 - remainder);
    //     }
    // }
    // 移除首页广告与推广
    if (window.location.href === 'https://www.bilibili.com/' || window.location.href.startsWith('https://www.bilibili.com/?spm_id_from')) {
        function removeAd() {
            const cardList = document.querySelectorAll('.feed-card, .bili-video-card:not(.feed-card .bili-video-card)');
            cardList.forEach((node, index) => {
                if (hasAd(node)) {
                    // const targetIndex = getCurrentGroupLastCard(index);
                    let targetIndex = index;
                    if (!node.classList.contains('is-rcmd')) {
                        targetIndex = 11;
                    }
                    console.log('移除一个广告', node.querySelector('.bili-video-card__info--tit a').innerHTML);
                    node.innerHTML = '';
                    // if (hasAd(cardList[targetIndex])) {
                    //     node.innerHTML = '';
                    // } else {
                    //     node.innerHTML = cardList[targetIndex].innerHTML;
                    //     cardList[targetIndex].innerHTML = '';
                    // }
                }
            });
        }
        removeAd();
        const container = document.querySelector('.container');
        const containerObserver = new MutationObserver(() => {
            throttle(removeAd, 50)();
        });
        containerObserver.observe(container, { childList: true });
    }
})();